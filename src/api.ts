import express from 'express';
import cors from 'cors';
import path from 'path';
import { getRecentStrikes } from './alerting/store';
import { ENV } from './env';
import { incrementRequestCount, getRequestCountForPeriod } from './cache/upstash';
import { insertErrorLog, getErrorsCount, getRecentErrors, getUserLocation, upsertUserLocation } from './db/tembo';
import { bot, pingTelegram } from './bot';
import { MetricsTracker } from './observability';
import { pingDatabase } from './db/tembo';
import { pingRedis } from './cache/upstash';
import { pingBullMQ, telegramQueue } from './alerting/queue';
import { pingBlitzortung } from './weather/lightning_listener';
import { EventEmitter } from 'events';

export const strikeEmitter = new EventEmitter();

export function startApiServer() {
  const app = express();

  // Диагностическое логирование запросов
  app.use((req, res, next) => {
    // @ts-ignore
    const routes = app._router ? app._router.stack
      // @ts-ignore
      .map((r: any) => {
        if (r.route) {
          return `ROUTE: ${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path} (${r.regexp ? r.regexp.toString() : ''})`;
        } else {
          return `MIDDLEWARE: ${r.name || 'anonymous'} (${r.regexp ? r.regexp.toString() : ''})`;
        }
      })
      : [];
    console.log(`[HTTP-DEBUG] Incoming: ${req.method} ${req.url} (original: ${req.originalUrl})`);
    console.log(`[HTTP-DEBUG] Express Stack: ${JSON.stringify(routes, null, 2)}`);
    next();
  });
  
  app.get('/api/debug-env', (req, res) => {
    res.json({
      NODE_ENV: process.env.NODE_ENV,
      isProd: process.env.NODE_ENV === 'production' || (ENV.WEBAPP_URL && ENV.WEBAPP_URL.includes('alwaysdata.net')),
      WEBAPP_URL: ENV.WEBAPP_URL,
      TELEGRAM_BOT_TOKEN: ENV.TELEGRAM_BOT_TOKEN
    });
  });
  
  const isProd = process.env.NODE_ENV === 'production' || (ENV.WEBAPP_URL && ENV.WEBAPP_URL.includes('alwaysdata.net'));
  
  if (ENV.TELEGRAM_BOT_TOKEN) {
    const botId = ENV.TELEGRAM_BOT_TOKEN.split(':')[0].replace(/\r/g, '');
    const webhookPath = `/api/telegram-webhook-${botId}`;
    const webhookUrl = `${ENV.WEBAPP_URL.replace('/index.html', '').replace(/\r/g, '')}${webhookPath}`;
    
    // Ручная обработка вебхука Telegram без использования хрупкого bot.webhookCallback
    app.post(webhookPath, async (req, res) => {
      console.log('[HTTP-DEBUG] WEBHOOK HANDLER ENTERED!');
      console.log('[HTTP-DEBUG] Request headers:', JSON.stringify(req.headers));
      
      let bodyData = '';
      req.on('data', (chunk) => {
        bodyData += chunk;
      });
      
      req.on('end', async () => {
        console.log('[HTTP-DEBUG] Body data read complete. Length:', bodyData.length);
        console.log('[HTTP-DEBUG] Body content:', bodyData);
        
        let parsedBody: any = {};
        try {
          if (bodyData) {
            parsedBody = JSON.parse(bodyData);
          }
        } catch (e: any) {
          console.error('[HTTP-DEBUG] JSON parse error:', e.message);
        }
        
        try {
          // Возвращаем 200 OK сразу, чтобы Telegram не отваливался по таймауту
          if (!res.headersSent) {
            res.sendStatus(200);
          }
          // Передаем распарсенный апдейт напрямую в Telegraf без res (чтобы он юзал HTTP API)
          bot.handleUpdate(parsedBody).catch(err => {
            console.error('[HTTP-DEBUG] Error handling Telegram update inside Telegraf:', err);
          });
          console.log('[HTTP-DEBUG] bot.handleUpdate triggered.');
        } catch (err: any) {
          console.error('[HTTP-DEBUG] Error processing update in wrapper:', err);
        }
      });
    });
    
    bot.telegram.setWebhook(webhookUrl)
      .then(() => console.log(`Telegram webhook successfully set to: ${webhookUrl}`))
      .catch(err => console.error('Failed to set Telegram webhook:', err));
  }
  
  // Ограничиваем CORS доверенным WebApp URL и localhost для разработки
  app.use(cors({
    origin: ENV.WEBAPP_URL ? [ENV.WEBAPP_URL, /http:\/\/(localhost|127\.0\.0\.1):\d+/] : '*'
  }));

  // Подсчет API запросов
  app.use((req, res, next) => {
    incrementRequestCount('api').catch(console.error);
    next();
  });
  
  // Простой in-memory Rate Limiting для защиты API эндпоинтов от флуда
  const ipRequestCounts = new Map<string, { count: number, resetTime: number }>();
  const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 минута
  const MAX_REQUESTS_PER_WINDOW = 60; // макс 60 запросов в минуту
  
  app.use('/api/', (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    const record = ipRequestCounts.get(ip);
    if (!record || now > record.resetTime) {
      ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      next();
    } else {
      record.count += 1;
      if (record.count > MAX_REQUESTS_PER_WINDOW) {
        res.status(429).json({ error: 'Too many requests. Please try again later.' });
      } else {
        next();
      }
    }
  });

  // Статические файлы WebApp (с запретом кэширования для index.html)
  app.use(express.static(path.join(__dirname, '../public'), {
    setHeaders: (res, reqPath, stat) => {
      if (reqPath.endsWith('index.html')) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
      }
    }
  }));

  // Отдельные эндпоинты Health Checks (без Rate Limit API, чтобы мониторинг всегда проходил)
  app.get('/health', (req, res) => {
    const { status } = MetricsTracker.getStatus();
    res.status(status === 'failed' || status === 'starting' || status === 'degraded' ? 503 : 200).json({ status: status });
  });

  app.get('/ready', (req, res) => {
    const ready = MetricsTracker.isReady();
    res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready' });
  });

  app.get('/health/details', async (req, res) => {
    const { status, tree } = MetricsTracker.getStatus();
    const metrics = MetricsTracker.getMetrics();
    
    let queueLength = 0;
    try {
      queueLength = await telegramQueue.count();
    } catch (e) {}

    res.status((status === 'failed' || status === 'starting' || status === 'degraded') ? 503 : 200).json({
      status: status,
      dependencyTree: {
        Bot: tree
      },
      metrics: {
        memory: metrics.memoryUsageMB,
        pid: process.pid,
        queue: queueLength,
        uptime: metrics.processUptimeSeconds,
        restartCount: process.env.RESTART_COUNT || 0,
        crashReason: process.env.CRASH_REASON || null
      }
    });
  });

  app.use('/api/location', express.json());

  app.post('/api/location', async (req, res) => {
    try {
      const { userId, lat, lon } = req.body;
      if (!userId || lat === undefined || lon === undefined) {
        return res.status(400).json({ error: 'Missing parameters' });
      }
      
      const latNum = Number(lat);
      const lonNum = Number(lon);
      await upsertUserLocation(userId, latNum, lonNum);
      
      const timestamp = Date.now();
      const userUrl = `${ENV.WEBAPP_URL}?lat=${latNum}&lon=${lonNum}&v=${timestamp}`;
      
      try {
        await bot.telegram.setChatMenuButton({
          chatId: userId,
          menuButton: {
            type: 'web_app',
            text: '🗺 Моя локация',
            web_app: { url: userUrl }
          }
        } as any);
      } catch (e) {
        console.error('Failed to update chat menu button on api', e);
      }
      
      try {
        await bot.telegram.sendMessage(
          userId, 
          '✅ Локация сохранена. Зона наблюдения до 30 км активирована. Мы уведомим вас при возникновении грозовой угрозы по Индексу Опасности!'
        );
      } catch (e) {
        console.error('Failed to send confirmation message', e);
      }

      res.json({ success: true });
    } catch(e) {
      console.error('Error in /api/location:', e);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Эндпоинт для активных молний
  app.get('/api/user/:id/location', async (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });
      
      const loc = await getUserLocation(userId);
      if (loc) {
        res.json(loc);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch(e) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/strikes', (req, res) => {
    const strikes = getRecentStrikes();
    res.json({ strikes });
  });

  // Server-Sent Events endpoint for real-time live map updates
  app.get('/api/strikes/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const onStrike = (strike: any) => {
      res.write(`data: ${JSON.stringify(strike)}\n\n`);
    };

    strikeEmitter.on('strike', onStrike);

    req.on('close', () => {
      strikeEmitter.removeListener('strike', onStrike);
    });
  });

  app.get('/api/debug-db', async (req, res) => {
    try {
      const pool = require('./db/tembo').pool || (require('pg').Pool && new (require('pg').Pool)({connectionString: require('./env').ENV.DATABASE_URL}));
      const { rows } = await pool.query('SELECT * FROM users ORDER BY updated_at DESC LIMIT 5');
      res.json({ 
        db_url: require('./env').ENV.DATABASE_URL ? require('./env').ENV.DATABASE_URL.substring(0, 30) + '...' : 'undefined',
        rows
      });
    } catch(e: any) {
      res.json({ error: e.message });
    }
  });

  // Эндпоинт для мониторинга статистики
  app.get('/api/monitoring/stats', async (req, res, next) => {
    try {
      let hours = 24;
      if (req.query.hours) {
        const parsed = parseInt(String(req.query.hours), 10);
        if (!isNaN(parsed)) {
          hours = Math.min(Math.max(parsed, 1), 48);
        }
      }
      
      let lat: number | undefined = undefined;
      let lon: number | undefined = undefined;
      if (req.query.lat) {
        const parsed = parseFloat(String(req.query.lat));
        if (!isNaN(parsed)) lat = parsed;
      }
      if (req.query.lon) {
        const parsed = parseFloat(String(req.query.lon));
        if (!isNaN(parsed)) lon = parsed;
      }
      if (lat !== undefined && (isNaN(lat) || lat < -90 || lat > 90)) {
        lat = undefined;
      }
      if (lon !== undefined && (isNaN(lon) || lon < -180 || lon > 180)) {
        lon = undefined;
      }
      if (lat === undefined || lon === undefined) {
        lat = undefined;
        lon = undefined;
      }
      
      let radius = 100000;
      if (req.query.radius) {
        const parsed = parseFloat(String(req.query.radius));
        if (!isNaN(parsed) && parsed > 0) {
          radius = parsed;
        }
      }
      
      const [requestsApi, requestsBot, errorsApi, errorsBot, recentErrors] = await Promise.all([
        getRequestCountForPeriod('api', hours),
        getRequestCountForPeriod('bot', hours),
        getErrorsCount('api', hours, lat, lon, radius),
        getErrorsCount('bot', hours, lat, lon, radius),
        getRecentErrors(hours, 50, lat, lon, radius)
      ]);
      
      const errorRateApi = requestsApi > 0 ? Number(((errorsApi / requestsApi) * 100).toFixed(2)) : 0;
      const errorRateBot = requestsBot > 0 ? Number(((errorsBot / requestsBot) * 100).toFixed(2)) : 0;
      
      res.json({
        api: { requests: requestsApi, errors: errorsApi, errorRate: errorRateApi },
        bot: { requests: requestsBot, errors: errorsBot, errorRate: errorRateBot },
        recentErrors
      });
    } catch (err) {
      next(err);
    }
  });

  // Глобальное middleware обработки ошибок
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const rawLat = req.query.lat || req.headers['x-user-latitude'];
    const rawLon = req.query.lon || req.headers['x-user-longitude'];
    
    let latNum: number | undefined = undefined;
    let lonNum: number | undefined = undefined;
    
    if (rawLat !== undefined && rawLat !== null) {
      const parsed = parseFloat(String(rawLat));
      if (!isNaN(parsed) && parsed >= -90 && parsed <= 90) {
        latNum = parsed;
      }
    }
    if (rawLon !== undefined && rawLon !== null) {
      const parsed = parseFloat(String(rawLon));
      if (!isNaN(parsed) && parsed >= -180 && parsed <= 180) {
        lonNum = parsed;
      }
    }
    
    const rawUserId = req.headers['x-user-id'] || req.query.userId || req.query.user_id || (req.body && (req.body.userId || req.body.user_id));
    let userIdNum: number | undefined = undefined;
    if (rawUserId !== undefined && rawUserId !== null) {
      const parsed = parseInt(String(rawUserId), 10);
      if (!isNaN(parsed)) {
        userIdNum = parsed;
      }
    }
    
    insertErrorLog(
      'api',
      err.name || 'Error',
      err.message || 'Unknown error',
      err.stack,
      latNum,
      lonNum,
      userIdNum
    ).catch(dbErr => {
      console.error('Failed to log error to database:', dbErr);
    });
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred'
    });
  });

  const PORT = process.env.PORT || 3000;
  
  const server = typeof PORT === 'string' && isNaN(Number(PORT))
    ? app.listen(PORT, () => {
        console.log(`API and Static server running on socket ${PORT}`);
      })
    : app.listen(Number(PORT), process.env.IP || '0.0.0.0', () => {
        console.log(`API and Static server running on ${process.env.IP || '0.0.0.0'}:${PORT}`);
      });

  // Настройка таймаутов для защиты от атак типа Slowloris (медленная передача заголовков)
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;
  server.requestTimeout = 30000; // 30 секунд

  return server;
}

