import { Telegraf } from 'telegraf';
import { ENV } from '../env';
import { handleStart } from './handlers/onboarding';
import { handleLocation } from './handlers/location';
import { handleWebAppData } from './handlers/webapp';

// Mock token if not provided for build passing
const token = ENV.TELEGRAM_BOT_TOKEN || '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';
export const bot = new Telegraf(token);

bot.start(handleStart);
bot.on('location', handleLocation);
bot.on('web_app_data', handleWebAppData);

export async function startBot() {
  if (ENV.TELEGRAM_BOT_TOKEN) {
    console.log('Starting Telegram bot...');
    bot.launch();
  } else {
    console.log('TELEGRAM_BOT_TOKEN not provided, bot running in dry mode.');
  }
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
