import Redis from 'ioredis';
import { ENV } from '../env';

export const redis = new Redis(ENV.REDIS_URL);

export async function checkRateLimitBatch(userIds: number[], eventType: 'critical' | 'warning', cooldownSec: number): Promise<number[]> {
  if (userIds.length === 0) return [];
  const pipeline = redis.pipeline();
  
  if (eventType === 'critical') {
    userIds.forEach(id => {
      pipeline.set(`ratelimit:${id}:critical`, '1', 'EX', cooldownSec, 'NX');
    });
    const results = await pipeline.exec();
    const allowedUsers: number[] = [];
    if (results) {
      userIds.forEach((id, index) => {
        const res = results[index];
        if (!res[0] && res[1] === 'OK') allowedUsers.push(id);
      });
    }
    return allowedUsers;
  } else {
    // For warning, we must check if critical exists FIRST.
    // We can't do this purely with a single SET NX. 
    // We will run a script or just fetch existing criticals, then SET NX for warnings.
    // For simplicity, we GET critical, then SET NX warning.
    userIds.forEach(id => {
      pipeline.get(`ratelimit:${id}:critical`);
    });
    const critResults = await pipeline.exec();
    
    const secondPipeline = redis.pipeline();
    const candidateIndices: number[] = [];
    
    if (critResults) {
      userIds.forEach((id, index) => {
        const critRes = critResults[index];
        if (!critRes[0] && critRes[1] === null) {
          // No critical mute found, we can try to set warning mute
          secondPipeline.set(`ratelimit:${id}:warning`, '1', 'EX', cooldownSec, 'NX');
          candidateIndices.push(index);
        }
      });
    }
    
    if (candidateIndices.length === 0) return [];
    
    const warnResults = await secondPipeline.exec();
    const allowedUsers: number[] = [];
    
    if (warnResults) {
      candidateIndices.forEach((originalIndex, i) => {
        const res = warnResults[i];
        if (!res[0] && res[1] === 'OK') allowedUsers.push(userIds[originalIndex]);
      });
    }
    return allowedUsers;
  }
}

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

