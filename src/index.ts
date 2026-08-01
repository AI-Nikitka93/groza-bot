import { initDatabase, pingDatabase } from './db/tembo';
import { pingRedis } from './cache/upstash';
import { pingBullMQ } from './alerting/queue';
import { startBot, pingTelegram } from './bot';
import { startApiServer } from './api';
import { startLightningListener, pingBlitzortung } from './weather/lightning_listener';
import { startAnalyzerCron } from './weather/analyzer';
import { startAllClearCron } from './alerting/all_clear';
import { startLiveQAMonitor } from './qa/live_monitor';
import { MetricsTracker } from './observability';
import { ENV } from './env';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function bootstrap() {
  console.log('Bootstrapping Groza Single-Worker...');
  
  // Start API server first so /health responds immediately (even if failed)
  startApiServer();
  
  // 1. Critical Startup Self-Tests
  console.log('Running Critical Health Checks...');
  if (!ENV.DATABASE_URL || !ENV.REDIS_URL) {
    console.error('CRITICAL FAILURE: Missing environment variables.');
    MetricsTracker.setStatus('failed');
    setTimeout(() => process.exit(1), 5000);
    return;
  }

  try {
    await initDatabase();
  } catch (e) {
    console.error('CRITICAL FAILURE: Database initialization failed.', e);
    MetricsTracker.setStatus('failed');
    setTimeout(() => process.exit(1), 5000);
    return;
  }

  const isDbOk = await pingDatabase();
  const isRedisOk = await pingRedis();
  const isQueueOk = await pingBullMQ();

  if (!isDbOk) {
    console.error(`CRITICAL FAILURE: Database=${isDbOk}`);
    console.error('Cannot start the application. Exiting...');
    MetricsTracker.setStatus('failed');
    setTimeout(() => process.exit(1), 5000);
    return;
  }
  
  if (!isRedisOk || !isQueueOk) {
    console.warn(`WARNING: Redis=${isRedisOk}, Queue=${isQueueOk}. Entering DEGRADED mode. Alerts will not work.`);
    MetricsTracker.setStatus('degraded');
  }
  // 2. Start Bot and Servers
  startBot().catch(console.error);
  startLightningListener();
  startAnalyzerCron();
  startAllClearCron();
  
  if (process.env.QA_MODE === 'true') {
    startLiveQAMonitor();
  }

  // 3. Optional Startup Self-Tests
  console.log('Running Optional Health Checks...');
  const isTelegramOk = await pingTelegram();
  const isBlitzortungOk = await pingBlitzortung();

  if (!isTelegramOk || !isBlitzortungOk || (process.env.RESTART_COUNT && parseInt(process.env.RESTART_COUNT, 10) > 3)) {
    console.warn(`OPTIONAL FAILURE: Telegram=${isTelegramOk}, Blitzortung=${isBlitzortungOk}. Entering DEGRADED mode.`);
    MetricsTracker.setStatus('degraded');
  } else {
    MetricsTracker.setStatus('healthy');
  }

  MetricsTracker.setReady(true);
  console.log('Groza Single-Worker is running.');
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
