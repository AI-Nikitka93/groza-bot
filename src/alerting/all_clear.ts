import { redis } from '../cache/upstash';
import { telegramQueue } from './queue';
import { pool } from '../db/tembo';
import { AppConfig } from '../config';
import { logTelemetry } from '../qa/telemetry';
import crypto from 'crypto';

export async function getLastStrikeTimeNearLocation(locationId: number, radiusMeters: number): Promise<Date | null> {
  const query = `
    SELECT MAX(s.created_at) as last_time
    FROM strikes s
    JOIN user_locations ul ON ul.id = $1
    WHERE ST_DWithin(s.location, ul.location, $2)
  `;
  const res = await pool.query(query, [locationId, radiusMeters]);
  if (res.rows.length === 0 || !res.rows[0].last_time) return null;
  return new Date(res.rows[0].last_time);
}

export async function runAllClearJob() {
  try {
    let cursor = '0';
    const activeKeys: string[] = [];
    do {
      const res = await redis.scan(cursor, 'MATCH', 'alert:active:*', 'COUNT', 100);
      cursor = res[0];
      activeKeys.push(...res[1]);
    } while (cursor !== '0');

    for (const key of activeKeys) {
      const parts = key.split(':');
      if (parts.length < 4) continue;
      const userId = parseInt(parts[2], 10);
      const locationId = parseInt(parts[3], 10);
      
      if (isNaN(userId) || isNaN(locationId)) continue;

      const riskEmaStr = await redis.get(`risk:ema:${userId}`);
      const riskEma = riskEmaStr ? parseFloat(riskEmaStr) : 0;

      if (riskEma < AppConfig.allClear.maxRiskScore) {
        // Fetch location radius
        const locRes = await pool.query('SELECT alert_radius, name FROM user_locations WHERE id = $1', [locationId]);
        if (locRes.rows.length === 0) continue;
        const radius = locRes.rows[0].alert_radius;
        const locName = locRes.rows[0].name;

        const lastTime = await getLastStrikeTimeNearLocation(locationId, radius);
        
        const now = new Date();
        const diffMins = lastTime ? (now.getTime() - lastTime.getTime()) / 60000 : 999;

        if (diffMins >= AppConfig.allClear.minutesWithoutLightning) {
          const text = `✅ **Грозовой фронт миновал**\nЛокация: ${locName}\nПоследняя молния была ${Math.floor(diffMins)} минут назад. Вы в безопасности.`;
          await telegramQueue.add('alert', { userId, text });
          await redis.del(key);
          
          logTelemetry({
            alert_id: crypto.randomUUID(),
            user_id: userId.toString(),
            location_id: locationId,
            risk_score: riskEma,
            confidence_score: 100,
            distance: radius,
            direction: 0,
            speed: 0,
            density: 0,
            trend: 'Ушел',
            prediction_timestamp: new Date().toISOString(),
            notification_type: 'all_clear',
            notification_sent: true
          });
        }
      }
    }
  } catch (err) {
    console.error('Error running all clear job:', err);
  }
}

export function startAllClearCron() {
  setInterval(runAllClearJob, 5 * 60 * 1000); // 5 minutes
  console.log('All Clear Background Job started.');
}
