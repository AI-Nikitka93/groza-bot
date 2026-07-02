"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tembo_1 = require("./db/tembo");
const listener_1 = require("./blitzortung/listener");
const bot_1 = require("./bot");
async function bootstrap() {
    console.log('Bootstrapping Groza Single-Worker...');
    // 1. Initialize Database & PostGIS
    await (0, tembo_1.initDatabase)();
    // 2. Start Telegram Bot
    await (0, bot_1.startBot)();
    // 3. Start Blitzortung WS Proxy listener
    (0, listener_1.startBlitzortungListener)();
    console.log('Groza Single-Worker is running.');
}
bootstrap().catch(console.error);
//# sourceMappingURL=index.js.map