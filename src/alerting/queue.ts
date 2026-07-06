import { Queue, Worker } from 'bullmq';
import { ENV } from '../env';
import { bot } from '../bot';

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

export const telegramWorker = new Worker('telegram-alerts', async (job) => {
  const { userId, text } = job.data;
  try {
    await bot.telegram.sendMessage(userId, text);
  } catch (err: any) {
    if (err.code === 403) {
      console.log(`User ${userId} blocked the bot.`);
    } else if (err.code === 429) {
      console.warn(`Rate limit hit (429) for user ${userId}. Retrying...`);
      throw err; // throw to trigger BullMQ retry
    } else {
      throw err;
    }
  }
}, {
  connection,
  limiter: {
    max: 25,
    duration: 1000,
  }
});

telegramWorker.on('failed', (job, err) => {
  if (job) {
    console.error(`Job ${job.id} failed for user ${job.data.userId}:`, err.message);
  }
});
