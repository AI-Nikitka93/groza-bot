"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
exports.startBot = startBot;
const telegraf_1 = require("telegraf");
const env_1 = require("../env");
const onboarding_1 = require("./handlers/onboarding");
const location_1 = require("./handlers/location");
// Mock token if not provided for build passing
const token = env_1.ENV.TELEGRAM_BOT_TOKEN || '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';
exports.bot = new telegraf_1.Telegraf(token);
exports.bot.start(onboarding_1.handleStart);
exports.bot.on('location', location_1.handleLocation);
async function startBot() {
    if (env_1.ENV.TELEGRAM_BOT_TOKEN) {
        console.log('Starting Telegram bot...');
        exports.bot.launch();
    }
    else {
        console.log('TELEGRAM_BOT_TOKEN not provided, bot running in dry mode.');
    }
}
process.once('SIGINT', () => exports.bot.stop('SIGINT'));
process.once('SIGTERM', () => exports.bot.stop('SIGTERM'));
//# sourceMappingURL=index.js.map