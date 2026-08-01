import { pingDatabase } from './db/tembo';
import { pingRedis } from './cache/upstash';
import { pingBullMQ } from './alerting/queue';
import { pingTelegram } from './bot/index';
import { pingBlitzortung } from './weather/lightning_listener';

let isAppReady = false;
let globalStatus: 'healthy' | 'degraded' | 'failed' | 'starting' = 'starting';
let degradationReason: string | null = null;

let cachedDependencyTree = {
  postgres: 'ok',
  redis: 'ok',
  bullmq: 'ok',
  telegram: 'ok',
  blitzortung: 'ok'
};

const startTime = Date.now();
let lightningStrikesCount = 0;
let notificationsCount = 0;
let failedJobsCount = 0;
let totalProcessingTimeMs = 0;
let processedJobsCount = 0;
let lastLightningTime: Date | null = null;
let lastNotificationTime: Date | null = null;

async function checkDependencies() {
  const results = await Promise.allSettled([
    Promise.race([pingDatabase(), new Promise(r => setTimeout(() => r(false), 5000))]),
    Promise.race([pingRedis(), new Promise(r => setTimeout(() => r(false), 5000))]),
    Promise.race([pingBullMQ(), new Promise(r => setTimeout(() => r(false), 5000))]),
    pingTelegram(), // already has race
    Promise.race([pingBlitzortung(), new Promise(r => setTimeout(() => r(false), 5000))])
  ]);

  cachedDependencyTree = {
    postgres: results[0].status === 'fulfilled' && results[0].value ? 'ok' : 'failed',
    redis: results[1].status === 'fulfilled' && results[1].value ? 'ok' : 'failed',
    bullmq: results[2].status === 'fulfilled' && results[2].value ? 'ok' : 'failed',
    telegram: results[3].status === 'fulfilled' && results[3].value ? 'ok' : 'failed',
    blitzortung: results[4].status === 'fulfilled' && results[4].value ? 'ok' : 'failed',
  };

  const hasCriticalFailure = cachedDependencyTree.postgres === 'failed' || cachedDependencyTree.redis === 'failed' || cachedDependencyTree.bullmq === 'failed';
  const hasOptionalFailure = cachedDependencyTree.telegram === 'failed' || cachedDependencyTree.blitzortung === 'failed';

  if (hasCriticalFailure) {
    globalStatus = 'failed';
  } else if (hasOptionalFailure) {
    globalStatus = 'degraded';
  } else {
    globalStatus = 'healthy';
  }
}

// Start background loop
checkDependencies();
setInterval(checkDependencies, 10000);

export const MetricsTracker = {
  setReady(ready: boolean) {
    isAppReady = ready;
  },
  isReady() {
    return isAppReady;
  },
  
  setStatus(status: 'healthy' | 'degraded' | 'failed', reason?: string) {
    globalStatus = status;
    if (reason) degradationReason = reason;
  },
  getStatus() {
    return { status: globalStatus, reason: degradationReason, tree: cachedDependencyTree };
  },

  recordStrike() {
    lightningStrikesCount++;
    lastLightningTime = new Date();
  },
  
  recordNotification() {
    notificationsCount++;
    lastNotificationTime = new Date();
  },
  
  recordJobSuccess(processingTimeMs: number) {
    processedJobsCount++;
    totalProcessingTimeMs += processingTimeMs;
  },
  
  recordJobFailure() {
    failedJobsCount++;
  },

  getMetrics() {
    const uptimeMs = Date.now() - startTime;
    const uptimeSec = uptimeMs / 1000;
    
    return {
      processUptimeSeconds: Math.floor(uptimeSec),
      memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100,
      cpuUsage: process.cpuUsage(), // returns { user, system } microseconds
      lightningStrikesTotal: lightningStrikesCount,
      lightningPerSecond: uptimeSec > 0 ? (lightningStrikesCount / uptimeSec) : 0,
      notificationsTotal: notificationsCount,
      notificationsPerSecond: uptimeSec > 0 ? (notificationsCount / uptimeSec) : 0,
      failedJobs: failedJobsCount,
      averageProcessingTimeMs: processedJobsCount > 0 ? (totalProcessingTimeMs / processedJobsCount) : 0,
      lastLightningTime,
      lastNotificationTime
    };
  }
};
