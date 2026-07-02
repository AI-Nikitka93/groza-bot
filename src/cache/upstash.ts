import Redis from 'ioredis';
import { ENV } from '../env';

export const redis = new Redis(ENV.REDIS_URL);

export async function checkRateLimit(userId: number, eventType: 'critical' | 'warning', cooldownSec: number): Promise<boolean> {
  const key = `ratelimit:${userId}:${eventType}`;
  
  // NX: set only if not exists
  // EX: expire in cooldownSec seconds
  const result = await redis.set(key, '1', 'EX', cooldownSec, 'NX');
  
  // if result is OK, we haven't sent this type of alert to this user recently
  return result === 'OK';
}
