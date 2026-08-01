import { Queue, Worker } from 'bullmq';
import { ENV } from '../env';
import { bot } from '../bot';
import { MetricsTracker } from '../observability';
import { redis } from '../cache/upstash';

const connection = {
  url: ENV.REDIS_URL,
};

export const telegramQueue = new Queue('telegram-alerts', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 1000,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

export async function pingBullMQ(): Promise<boolean> {
  try {
    const client = await telegramQueue.client;
    const res = await (client as any).ping();
    return res === 'PONG';
  } catch (error) {
    return false;
  }
}

export const telegramWorker = new Worker('telegram-alerts', async (job) => {
  if (job.name === 'check-all-clear') {
    const { userId, locationId, locationName, lat, lon } = job.data;
    const start = Date.now();
    try {
      const riskKey = `risk:ema:${userId}`;
      const riskStr = await redis.get(riskKey);
      const riskEma = riskStr ? parseFloat(riskStr) : 0;
      
      if (riskEma >= 20) {
        // Storm is still active, re-enqueue
        await telegramQueue.add('check-all-clear', job.data, {
          delay: 15 * 60 * 1000,
          jobId: `allclear-${userId}-${locationId}-${Date.now()}`
        });
      } else {
        // Storm passed
        const activeKey = `alert:active:${userId}:${locationId}`;
        await redis.del(activeKey);
        
        const url = `${ENV.WEBAPP_URL}?lat=${lat}&lon=${lon}&v=${Date.now()}`;
        const reply_markup = {
          inline_keyboard: [[{ text: '🗺 Открыть радар', web_app: { url } }]]
        };
        const text = `🟢 Гроза ушла. Угроза миновала.\n📍 Локация: ${locationName}\nИндекс опасности упал до безопасных значений. Вы можете возвращаться к обычным делам.`;
        
        await bot.telegram.sendMessage(userId, text, { reply_markup });
        MetricsTracker.recordNotification();
      }
      MetricsTracker.recordJobSuccess(Date.now() - start);
    } catch (err: any) {
      if (err.code === 403) {
        console.log(`User ${userId} blocked the bot.`);
        MetricsTracker.recordJobSuccess(Date.now() - start);
      } else {
        throw err;
      }
    }
    return;
  }

  const { userId, text, reply_markup } = job.data;
  const start = Date.now();
  try {
    await bot.telegram.sendMessage(userId, text, { reply_markup });
    MetricsTracker.recordNotification();
    MetricsTracker.recordJobSuccess(Date.now() - start);
  } catch (err: any) {
    if (err.code === 403) {
      console.log(`User ${userId} blocked the bot.`);
      MetricsTracker.recordJobSuccess(Date.now() - start); // Not a system failure
    } else if (err.code === 429) {
      console.warn(`Rate limit hit (429) for user ${userId}. Retrying...`);
      throw err; 
    } else {
      throw err;
    }
  }
}, {
  connection,
  limiter: {
    max: 25,
    duration: 1000,
  },
  stalledInterval: 300000,
  drainDelay: 10000
});

telegramWorker.on('failed', (job, err) => {
  MetricsTracker.recordJobFailure();
  if (job) {
    console.error(`Job ${job.id} failed for user ${job.data.userId}:`, err.message);
  }
});

telegramWorker.on('error', err => {
  console.error('BullMQ Worker Error (likely Redis rate limit):', err.message);
});

telegramQueue.on('error', err => {
  console.error('BullMQ Queue Error (likely Redis rate limit):', err.message);
});
