"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processStrike = processStrike;
const tembo_1 = require("../db/tembo");
const upstash_1 = require("../cache/upstash");
const bot_1 = require("../bot"); // We will create this next
const CRITICAL_RADIUS_METERS = 5000;
const WARNING_RADIUS_METERS = 15000;
const ALERT_COOLDOWN_SEC = 1800; // 30 minutes
async function processStrike(lat, lon) {
    try {
        // 1. Find users in 15km (Warning Zone)
        const warningUsers = await (0, tembo_1.findUsersInRadius)(lat, lon, WARNING_RADIUS_METERS);
        // 2. Find users in 5km (Critical Zone)
        const criticalUsers = await (0, tembo_1.findUsersInRadius)(lat, lon, CRITICAL_RADIUS_METERS);
        // Sets to keep track
        const criticalSet = new Set(criticalUsers);
        // Process Critical Alerts (Inverted Pyramid)
        for (const userId of criticalUsers) {
            const canSend = await (0, upstash_1.checkRateLimit)(userId, 'critical', ALERT_COOLDOWN_SEC);
            if (canSend) {
                const text = `🚨 МОЛНИЯ В 5 КМ! Срочно уйдите с открытого пространства!\n\nЗафиксировано несколько разрядов в зоне 5 км. Гроза уже здесь. Если укрытия нет — примите позу эмбриона.\n\n🗺 Смотреть радар: https://t.me/GrozaRadarBot/app`;
                await bot_1.bot.telegram.sendMessage(userId, text).catch(() => { }); // ignore block errors
            }
        }
        // Process Warning Alerts (for users in 15km but NOT in 5km)
        for (const userId of warningUsers) {
            if (!criticalSet.has(userId)) {
                const canSend = await (0, upstash_1.checkRateLimit)(userId, 'warning', ALERT_COOLDOWN_SEC);
                if (canSend) {
                    const text = `⚠️ Внимание: Грозовой фронт на горизонте (15 км).\n\nУ вас есть около 10-15 минут, чтобы найти укрытие или покинуть воду. Шторм движется в вашем направлении.\n\n🗺 Оценить угрозу на радаре: https://t.me/GrozaRadarBot/app`;
                    await bot_1.bot.telegram.sendMessage(userId, text).catch(() => { });
                }
            }
        }
    }
    catch (error) {
        console.error('Error in processStrike:', error);
    }
}
//# sourceMappingURL=dispatcher.js.map