const { Telegraf } = require('telegraf');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const botId = token.split(':')[0];
const webhookUrl = `https://groza-bot.alwaysdata.net/api/telegram-webhook-${botId}`;

const bot = new Telegraf(token);

async function refresh() {
    console.log("Deleting old webhook...");
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    console.log("Setting new webhook:", webhookUrl);
    await bot.telegram.setWebhook(webhookUrl);
    console.log("Webhook info:", await bot.telegram.getWebhookInfo());
}

refresh().catch(console.error);
