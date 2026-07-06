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
