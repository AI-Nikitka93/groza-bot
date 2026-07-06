import { Telegraf } from 'telegraf';
import { ENV } from '../env';
import { handleStart } from './handlers/onboarding';
import { handleLocation } from './handlers/location';
import { handleWebAppData } from './handlers/webapp';
import { handleStats } from './handlers/stats';

// Mock token if not provided for build passing
const token = ENV.TELEGRAM_BOT_TOKEN || '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';
export const bot = new Telegraf(token);

// Глобальный обработчик ошибок Telegraf, предотвращающий падение процесса при ошибках обработки обновлений
bot.catch((err: any, ctx) => {
  console.error(`Telegraf error occurred for update ${ctx.update.update_id}:`, err);
});

bot.start(handleStart);
bot.command('stats', handleStats);
bot.on('location', handleLocation);
bot.on('web_app_data', handleWebAppData);

export async function startBot() {
  if (ENV.TELEGRAM_BOT_TOKEN) {
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
