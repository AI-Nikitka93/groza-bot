import { Telegraf, Markup } from 'telegraf';
import { ENV } from '../env';
import { handleStart } from './handlers/onboarding';
import { handleLocation } from './handlers/location';
import { handleWebAppData } from './handlers/webapp';
import { handleStats } from './handlers/stats';
import { handleHealth, handleAdminMetrics } from './handlers/health';
import { incrementRequestCount } from '../cache/upstash';
import { getUserLocation, insertErrorLog } from '../db/tembo';

// Mock token if not provided for build passing
const token = ENV.TELEGRAM_BOT_TOKEN || '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';
export const bot = new Telegraf(token);

export async function pingTelegram(): Promise<boolean> {
  try {
    const res = await Promise.race([
      bot.telegram.getMe(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]) as any;
    return !!res.id;
  } catch (err) {
    return false;
  }
}

// Глобальный middleware для инкрементирования счетчика входящих запросов бота при каждом апдейте
bot.use((ctx, next) => {
  incrementRequestCount('bot').catch(console.error);
  return next();
});

// Глобальный обработчик ошибок Telegraf, предотвращающий падение процесса при ошибках обработки обновлений
bot.catch(async (err: any, ctx) => {
  console.error(`Telegraf error occurred for update ${ctx.update.update_id}:`, err);
  try {
    const userId = ctx.from?.id;
    let location: { lat: number, lon: number } | null = null;
    if (userId) {
      location = await getUserLocation(userId);
    }
    await insertErrorLog(
      'bot',
      err.name || 'Error',
      err.message || 'Unknown bot error',
      err.stack,
      location?.lat,
      location?.lon,
      userId
    );
  } catch (dbErr) {
    console.error('Failed to log bot error to database:', dbErr);
  }
});

bot.start(handleStart);
bot.command('stats', handleStats);
bot.command('admin_metrics', handleAdminMetrics);
bot.command('status', handleHealth);
bot.command('help', handleStart);
bot.command('location', (ctx) => ctx.reply('Пожалуйста, отправьте вашу геолокацию:', { reply_markup: { keyboard: [[{ text: '📍 Отправить геолокацию', request_location: true }]], resize_keyboard: true } }));
bot.action('change_location', (ctx) => ctx.reply('Пожалуйста, отправьте новую геолокацию:', { reply_markup: { keyboard: [[{ text: '📍 Отправить геолокацию', request_location: true }]], resize_keyboard: true } }));
bot.on('location', handleLocation);
bot.on('web_app_data', handleWebAppData);

bot.hears('⚡️ Текущий статус', handleHealth);
bot.hears('📍 Изменить локацию', (ctx) => ctx.reply('Пожалуйста, отправьте вашу геолокацию:', { reply_markup: { keyboard: [[{ text: '📍 Отправить геолокацию', request_location: true }]], resize_keyboard: true } }));
bot.hears('❓ Помощь', handleStart);

export async function startBot() {
  const isProd = process.env.NODE_ENV === 'production' || (ENV.WEBAPP_URL && ENV.WEBAPP_URL.includes('alwaysdata.net'));
  
  if (ENV.TELEGRAM_BOT_TOKEN) {
    bot.telegram.setChatMenuButton({ menuButton: { type: 'web_app', text: '🗺 Моя локация', web_app: { url: `${ENV.WEBAPP_URL}?v=3` } } })
      .catch(err => console.error('Failed to set chat menu button:', err));

    bot.telegram.setMyCommands([
      { command: 'start', description: 'Запустить бота' },
      { command: 'status', description: 'Статус систем' },
      { command: 'location', description: 'Сменить локацию' },
      { command: 'help', description: 'Помощь' }
    ]).catch(err => console.error('Failed to set bot commands:', err));

    if (isProd) {
      console.log('Telegram bot is running in WEBHOOK mode on Alwaysdata.');
      return;
    }

    console.log('Starting Telegram bot...');
    try {
      await bot.launch({ dropPendingUpdates: true });
      console.log('Telegram bot launched successfully.');
    } catch (err) {
      console.error('Failed to launch Telegram bot:', err);
      throw err; // Пробрасываем ошибку для перезапуска контейнера в Docker/Render
    }
  } else {
    console.log('TELEGRAM_BOT_TOKEN not provided, bot running in dry mode.');
  }
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
