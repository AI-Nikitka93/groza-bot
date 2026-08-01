import { Context } from 'telegraf';
import { MetricsTracker } from '../../observability';
import { pingDatabase } from '../../db/tembo';
import { pingRedis } from '../../cache/upstash';
import { pingBullMQ, telegramQueue } from '../../alerting/queue';
import { pingBlitzortung } from '../../weather/lightning_listener';

const ADMIN_ID = process.env.ADMIN_ID ? parseInt(process.env.ADMIN_ID, 10) : null;

export async function handleHealth(ctx: Context) {
  if (ADMIN_ID && ctx.from?.id !== ADMIN_ID) {
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
