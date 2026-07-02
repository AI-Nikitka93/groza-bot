import { findUsersInRadius } from '../db/tembo';
import { checkRateLimit } from '../cache/upstash';
import { bot } from '../bot'; // We will create this next
import { addStrikeToStore } from './store';

const CRITICAL_RADIUS_METERS = 5000;
const WARNING_RADIUS_METERS = 15000;
const ALERT_COOLDOWN_SEC = 1800; // 30 minutes

export async function processStrike(lat: number, lon: number) {
  addStrikeToStore(lat, lon);
  try {
    // 1. Find users in 15km (Warning Zone)
    const warningUsers = await findUsersInRadius(lat, lon, WARNING_RADIUS_METERS);
    
    // 2. Find users in 5km (Critical Zone)
    const criticalUsers = await findUsersInRadius(lat, lon, CRITICAL_RADIUS_METERS);
    
    // Sets to keep track
    const criticalSet = new Set(criticalUsers);
    
    // Process Critical Alerts (Inverted Pyramid)
    for (const userId of criticalUsers) {
      const canSend = await checkRateLimit(userId, 'critical', ALERT_COOLDOWN_SEC);
      if (canSend) {
        const text = `🚨 МОЛНИЯ В 5 КМ! Срочно уйдите с открытого пространства!\n\nЗафиксировано несколько разрядов в зоне 5 км. Гроза уже здесь. Если укрытия нет — примите позу эмбриона.\n\n🗺 Смотреть радар: https://t.me/GrozaRadarBot/app`;
        await bot.telegram.sendMessage(userId, text).catch(() => {}); // ignore block errors
      }
    }

    // Process Warning Alerts (for users in 15km but NOT in 5km)
    for (const userId of warningUsers) {
      if (!criticalSet.has(userId)) {
        const canSend = await checkRateLimit(userId, 'warning', ALERT_COOLDOWN_SEC);
        if (canSend) {
          const text = `⚠️ Внимание: Грозовой фронт на горизонте (15 км).\n\nУ вас есть около 10-15 минут, чтобы найти укрытие или покинуть воду. Шторм движется в вашем направлении.\n\n🗺 Оценить угрозу на радаре: https://t.me/GrozaRadarBot/app`;
          await bot.telegram.sendMessage(userId, text).catch(() => {});
        }
      }
    }

  } catch (error) {
    console.error('Error in processStrike:', error);
  }
}
