import Redis from 'ioredis';
import { ENV } from '../env';

export const redis = new Redis(ENV.REDIS_URL);

redis.on('error', err => {
  console.error('IoRedis Error (likely rate limit):', err.message);
});

export async function pingRedis(): Promise<boolean> {
  try {
    const res = await redis.ping();
    return res === 'PONG';
  } catch (error) {
    return false;
  }
}

export async function checkRateLimitBatch(userIds: string[], eventType: string, cooldownSec: number): Promise<string[]> {
  if (userIds.length === 0) return [];
  try {
    const pipeline = redis.pipeline();
    
    if (eventType === 'extreme' || eventType === 'high' || eventType === 'critical') {
      userIds.forEach(id => {
        pipeline.set(`ratelimit:${id}:critical`, '1', 'EX', cooldownSec, 'NX');
      });
      const results = await pipeline.exec();
      const allowedUsers: string[] = [];
      if (results) {
        let hasError = false;
        userIds.forEach((id, index) => {
          const res = results[index];
          if (res && res[0]) hasError = true;
          if (res && !res[0] && res[1] === 'OK') allowedUsers.push(id);
        });
        if (hasError) throw new Error('Redis pipeline returned errors (likely rate limit)');
      }
      return allowedUsers;
    } else {
      userIds.forEach(id => {
        pipeline.get(`ratelimit:${id}:critical`);
      });
      const critResults = await pipeline.exec();
      
      const secondPipeline = redis.pipeline();
      const candidateIndices: number[] = [];
      
      if (critResults) {
        let hasError = false;
        userIds.forEach((id, index) => {
          const critRes = critResults[index];
          if (critRes && critRes[0]) hasError = true;
          if (critRes && !critRes[0] && critRes[1] === null) {
            secondPipeline.set(`ratelimit:${id}:warning`, '1', 'EX', cooldownSec, 'NX');
            candidateIndices.push(index);
          }
        });
        if (hasError) throw new Error('Redis pipeline returned errors on GET (likely rate limit)');
      }
      
      if (candidateIndices.length === 0) return [];
      
      const warnResults = await secondPipeline.exec();
      const allowedUsers: string[] = [];
      
      if (warnResults) {
        let hasError = false;
        candidateIndices.forEach((originalIndex, i) => {
          const res = warnResults[i];
          if (res && res[0]) hasError = true;
          if (res && !res[0] && res[1] === 'OK') allowedUsers.push(userIds[originalIndex]);
        });
        if (hasError) throw new Error('Redis pipeline returned errors on SET (likely rate limit)');
      }
      return allowedUsers;
    }
  } catch (error) {
    console.error('Redis Rate Limit Exception (Fail-Safe trigger):', error);
    // In-memory fallback to ensure alerts keep working!
    const allowedUsers: string[] = [];
    const now = Date.now();
    userIds.forEach(id => {
      const key = `ratelimit:${id}:${eventType === 'extreme' || eventType === 'high' || eventType === 'critical' ? 'critical' : 'warning'}`;
      const expiry = memoryCache.get(key);
      if (!expiry || now > expiry) {
        memoryCache.set(key, now + (cooldownSec * 1000));
        allowedUsers.push(id);
      }
    });
    // Cleanup expired cache entries periodically
    if (Math.random() < 0.05) {
      for (const [k, v] of memoryCache.entries()) {
        if (now > v) memoryCache.delete(k);
      }
    }
    return allowedUsers;
  }
}

export const memoryCache = new Map<string, number>();
function getUtcHourString(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}:${hh}`;
}

export async function incrementRequestCount(source: 'api' | 'bot'): Promise<void> {
  const utcStr = getUtcHourString(new Date());
  const key = `monitoring:requests:${source}:${utcStr}`;
  await redis.multi()
    .incr(key)
    .expire(key, 172800)
    .exec();
}

export async function getRequestCountForPeriod(source: 'api' | 'bot', hours: number): Promise<number> {
  const keys: string[] = [];
  const now = new Date();
  for (let i = 0; i < hours; i++) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const utcStr = getUtcHourString(d);
    keys.push(`monitoring:requests:${source}:${utcStr}`);
  }
  
  if (keys.length === 0) return 0;
  
  const values = await redis.mget(keys);
  let total = 0;
  for (const val of values) {
    if (val !== null) {
      const num = parseInt(val, 10);
      if (!isNaN(num)) {
        total += num;
      }
    }
  }
  return total;
}

