import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { redis } from '../src/cache/upstash';
import { bot } from '../src/bot';
import { MetricsTracker } from '../src/observability';
import { telegramQueue, telegramWorker } from '../src/alerting/queue';

// Mock dependencies
jest.mock('../src/cache/upstash', () => ({
  redis: {
    get: jest.fn(),
    del: jest.fn(),
    set: jest.fn(),
  },
}));

jest.mock('../src/bot', () => ({
  bot: {
    telegram: {
      sendMessage: jest.fn(),
    },
  },
}));

jest.mock('../src/observability', () => ({
  MetricsTracker: {
    recordNotification: jest.fn(),
    recordJobSuccess: jest.fn(),
    recordJobFailure: jest.fn(),
    getStatus: jest.fn().mockReturnValue({ status: 'ok' })
  },
}));

describe('All-Clear State Machine Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (bot.telegram.sendMessage as any).mockResolvedValue(true);
    // Spy on telegramQueue.add to avoid actual redis connection from test
    jest.spyOn(telegramQueue, 'add').mockResolvedValue({} as any);
  });

  describe('Worker Branch A: Re-enqueue on high risk', () => {
    it('should reschedule check-all-clear job when EMA risk >= 20', async () => {
      (redis.get as any).mockResolvedValue('25.5');
      
      const jobData = {
        userId: 12345,
        locationId: 'loc-1',
        locationName: 'Test City',
        lat: 55.75,
        lon: 37.61
      };
      
      const processor = (telegramWorker as any).processFn;
      await processor({ name: 'check-all-clear', data: jobData, id: 'test-job' } as any);
      
      expect(redis.get).toHaveBeenCalledWith('risk:ema:12345');
      expect(telegramQueue.add).toHaveBeenCalledWith(
        'check-all-clear',
        jobData,
        expect.objectContaining({
          delay: 15 * 60 * 1000,
          jobId: expect.stringMatching(/^allclear-12345-loc-1-\d+$/)
        })
      );
      expect(redis.del).not.toHaveBeenCalled();
      expect(bot.telegram.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('Worker Branch B: Clear lock and send All-Clear', () => {
    it('should delete active lock and send safe notification when EMA risk < 20', async () => {
      (redis.get as any).mockResolvedValue('15.2');
      
      const jobData = {
        userId: 12345,
        locationId: 'loc-1',
        locationName: 'Test City',
        lat: 55.75,
        lon: 37.61
      };
      
      const processor = (telegramWorker as any).processFn;
      await processor({ name: 'check-all-clear', data: jobData, id: 'test-job' } as any);
      
      expect(redis.get).toHaveBeenCalledWith('risk:ema:12345');
      expect(redis.del).toHaveBeenCalledWith('alert:active:12345:loc-1');
      expect(telegramQueue.add).not.toHaveBeenCalled();
      expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
        12345,
        expect.stringContaining('🟢 Гроза ушла. Угроза миновала.'),
        expect.any(Object)
      );
    });
  });
});
