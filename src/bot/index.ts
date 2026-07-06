import { Telegraf } from 'telegraf';
import { ENV } from '../env';
import { handleStart } from './handlers/onboarding';
import { handleLocation } from './handlers/location';
import { handleWebAppData } from './handlers/webapp';
import { handleStats } from './handlers/stats';
import { incrementRequestCount } from '../cache/upstash';
import { getUserLocation, insertErrorLog } from '../db/tembo';

// Mock token if not provided for build passing
const token = ENV.TELEGRAM_BOT_TOKEN || '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';
export const bot = new Telegraf(token);

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
bot.on('location', handleLocation);
bot.on('web_app_data', handleWebAppData);

export async function startBot() {
  const isProd = process.env.NODE_ENV === 'production' || (ENV.WEBAPP_URL && ENV.WEBAPP_URL.includes('alwaysdata.net'));
  
  if (ENV.TELEGRAM_BOT_TOKEN) {
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
