import express from 'express';
import cors from 'cors';
import path from 'path';
import { getRecentStrikes } from './alerting/store';
import { ENV } from './env';

export function startApiServer() {
  const app = express();
  
  // Ограничиваем CORS доверенным WebApp URL и localhost для разработки
  app.use(cors({
    origin: ENV.WEBAPP_URL ? [ENV.WEBAPP_URL, /http:\/\/(localhost|127\.0\.0\.1):\d+/] : '*'
  }));
  
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

  // Отдача статики из папки public (правильный путь для build/dist)
  app.use(express.static(path.join(__dirname, '../public')));

  // Эндпоинт для активных молний
  app.get('/api/strikes', (req, res) => {
    const strikes = getRecentStrikes();
    res.json({ strikes });
  });

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const HOST = process.env.IP || '0.0.0.0';
  
  const server = app.listen(PORT, HOST, () => {
    console.log(`API and Static server running on ${HOST}:${PORT}`);
  });

  // Настройка таймаутов для защиты от атак типа Slowloris (медленная передача заголовков)
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;
  server.requestTimeout = 30000; // 30 секунд

  return server;
}
