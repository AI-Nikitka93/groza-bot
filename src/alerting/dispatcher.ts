import { findUsersInRadiusBatch, insertStrikesBatch } from '../db/tembo';
import { checkRateLimitBatch } from '../cache/upstash';
import { telegramQueue } from './queue';
import { addStrikeToStore } from './store';

const CRITICAL_RADIUS_METERS = 5000;
const WARNING_RADIUS_METERS = 15000;
const ALERT_COOLDOWN_SEC = 1800; // 30 minutes

export async function processStrikesBatch(strikes: {lat: number, lon: number}[]) {
  if (strikes.length === 0) return;

  // Записываем молнии в базу данных для долгосрочной статистики (/stats)
  try {
    await insertStrikesBatch(strikes);
  } catch (err) {
    console.error('Error inserting strikes batch to database:', err);
  }

  for (const s of strikes) {
    addStrikeToStore(s.lat, s.lon);
  }
  
  try {
    // 1. Find users in 15km (Warning Zone) for ANY strike in batch
    const warningUsers = await findUsersInRadiusBatch(strikes, WARNING_RADIUS_METERS);
    
    // 2. Find users in 5km (Critical Zone)
    const criticalUsers = await findUsersInRadiusBatch(strikes, CRITICAL_RADIUS_METERS);
    
    // Sets to keep track
    const criticalSet = new Set(criticalUsers);
    
    // 3. Process Critical Alerts
    const allowedCritical = await checkRateLimitBatch(criticalUsers, 'critical', ALERT_COOLDOWN_SEC);
    
    // 4. Process Warning Alerts (exclude critical)
    const justWarningUsers = warningUsers.filter(id => !criticalSet.has(id));
    const allowedWarning = await checkRateLimitBatch(justWarningUsers, 'warning', ALERT_COOLDOWN_SEC);
    
    // 5. Dispatch to BullMQ
    for (const userId of allowedCritical) {
      const text = `🚨 МОЛНИЯ В 5 КМ! Срочно уйдите с открытого пространства!\n\nЗафиксировано несколько разрядов в зоне 5 км. Гроза уже здесь. Если укрытия нет — примите позу эмбриона.\n\n🗺 Смотреть радар: https://t.me/GrozaRadarBot/app`;
      await telegramQueue.add('alert', { userId, text });
    }

    for (const userId of allowedWarning) {
      const text = `⚠️ Внимание: Грозовой фронт на горизонте (15 км).\n\nУ вас есть около 10-15 минут, чтобы найти укрытие или покинуть воду. Шторм движется в вашем направлении.\n\n🗺 Оценить угрозу на радаре: https://t.me/GrozaRadarBot/app`;
      await telegramQueue.add('alert', { userId, text });
    }

  } catch (error) {
    console.error('Error in processStrikesBatch:', error);
  }
}
