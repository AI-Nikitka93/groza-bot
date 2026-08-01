import { Context } from 'telegraf';
import { MetricsTracker } from '../../observability';
import { pingDatabase, pool, getUserLocations } from '../../db/tembo';
import { pingRedis, redis } from '../../cache/upstash';
import { pingBullMQ, telegramQueue } from '../../alerting/queue';
import { pingBlitzortung } from '../../weather/lightning_listener';

const ADMIN_IDS = process.env.ADMIN_ID 
  ? process.env.ADMIN_ID.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id)) 
  : [];

export async function handleAdminMetrics(ctx: Context) {
  if (ADMIN_IDS.length > 0 && ctx.from?.id && !ADMIN_IDS.includes(ctx.from.id)) {
    return ctx.reply('Forbidden');
  }

  const msg = await ctx.reply('Опрос компонентов...');

  const results = await Promise.allSettled([
    pingDatabase(),
    pingRedis(),
    pingBullMQ(),
    pingBlitzortung()
  ]);

  const pgo = results[0].status === 'fulfilled' && results[0].value ? '✅' : '❌';
  const rdo = results[1].status === 'fulfilled' && results[1].value ? '✅' : '❌';
  const bmq = results[2].status === 'fulfilled' && results[2].value ? '✅' : '❌';
  const blz = results[3].status === 'fulfilled' && results[3].value ? '✅' : '❌';

  let queueLength = 0;
  try {
    queueLength = await telegramQueue.count();
  } catch (e) {}

  const m = MetricsTracker.getMetrics();
  const { status } = MetricsTracker.getStatus();

  const text = `
🛠 *Groza Production Dashboard*
Статус: *${status.toUpperCase()}*

*Infrastructure*
PostgreSQL: ${pgo}
Redis: ${rdo}
BullMQ: ${bmq}
Blitzortung: ${blz}

*Metrics*
Uptime: ${m.processUptimeSeconds} sec
Memory: ${m.memoryUsageMB} MB
PID: ${process.pid}
Queue Length: ${queueLength}
Restart Count: ${process.env.RESTART_COUNT || 0}
Last Crash: ${process.env.LAST_CRASH || 'Never'}
Crash Reason: ${process.env.CRASH_REASON || 'N/A'}

*Activity*
Strikes Total: ${m.lightningStrikesTotal}
Strikes/sec: ${m.lightningPerSecond.toFixed(2)}
Last Lightning: ${m.lastLightningTime ? m.lastLightningTime.toISOString() : 'None'}

Notifications: ${m.notificationsTotal}
Notif/sec: ${m.notificationsPerSecond.toFixed(2)}
Failed Jobs: ${m.failedJobs}
Avg Processing: ${m.averageProcessingTimeMs.toFixed(2)} ms
  `.trim();

  await ctx.telegram.editMessageText(
    msg.chat.id,
    msg.message_id,
    undefined,
    text,
    { parse_mode: 'Markdown' }
  );
}

export async function handleHealth(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return;

  const locations = await getUserLocations(userId);
  const loc = locations.length > 0 ? locations[0] : null;

  if (!loc) {
    return ctx.reply('Локация не установлена. Отправьте /location для настройки.');
  }

  const emaKey = `risk:ema:${userId}`;
  const riskStr = await redis.get(emaKey);
  const riskIndex = riskStr ? parseFloat(riskStr) : 0;

  let dangerStatus = '🟢 Спокойно';
  if (riskIndex >= 60) {
    dangerStatus = '🔴 Опасность';
  } else if (riskIndex >= 20) {
    dangerStatus = '🟡 Внимание';
  }

  let distText = '📏 Активных молний рядом нет (за последний час)';
  try {
    const query = `
      SELECT ST_Distance(
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        location
      ) as dist,
      EXTRACT(EPOCH FROM (NOW() - created_at)) as age_seconds
      FROM strikes
      WHERE created_at >= NOW() - INTERVAL '60 minutes'
      ORDER BY location <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      LIMIT 1;
    `;
    const res = await pool.query(query, [loc.lon, loc.lat]);
    if (res.rows.length > 0) {
      const distMeters = res.rows[0].dist;
      if (distMeters <= 30000) {
        const ageSeconds = res.rows[0].age_seconds;
        distText = `📏 Ближайшая молния: ${(distMeters / 1000).toFixed(1)} км (${Math.floor(ageSeconds / 60)} мин. назад)`;
      }
    }
  } catch (err) {
    console.error('Error fetching nearest strike distance:', err);
  }

  const text = `
⚡️ *Текущий статус*
📍 Локация: ${loc.name}
⚠️ Статус: ${dangerStatus}
📊 Индекс угрозы: ${riskIndex.toFixed(0)}/100
${distText}
`.trim();

  await ctx.reply(text, { parse_mode: 'Markdown' });
}
