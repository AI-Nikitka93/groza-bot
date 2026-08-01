import { Queue, Worker } from 'bullmq';
import { ENV } from '../env';
import { bot } from '../bot';
import { MetricsTracker } from '../observability';

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
