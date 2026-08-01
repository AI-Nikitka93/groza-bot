import { execSync } from 'child_process';
import { pingDatabase } from '../src/db/tembo';
import { pingRedis } from '../src/cache/upstash';
import { pingBullMQ } from '../src/alerting/queue';
import { pingTelegram } from '../src/bot';
import { pingBlitzortung, startLightningListener } from '../src/weather/lightning_listener';

async function runTest(name: string, command: string, testFn: () => Promise<boolean> | boolean) {
  console.log(`\nSTART: ${name}`);
  console.log(`COMMAND: ${command}`);
  try {
    const start = Date.now();
    const result = await testFn();
    const duration = Date.now() - start;
    if (result) {
      console.log(`OUTPUT: OK (${duration}ms)`);
      console.log(`EXIT CODE: 0`);
      console.log(`PASS`);
      return true;
    } else {
      console.log(`OUTPUT: FAILED or TIMEOUT (${duration}ms)`);
      console.log(`EXIT CODE: 1`);
      console.log(`FAIL`);
      return false;
    }
  } catch (err: any) {
    console.log(`OUTPUT: ERROR: ${err.message}`);
    console.log(`EXIT CODE: 1`);
    console.log(`FAIL`);
    return false;
  }
}

async function run() {
  console.log('=== GROZA PRODUCTION ACCEPTANCE TESTS ===');

  let allPassed = true;

  // 1. Build Test
  const buildPass = await runTest('Build & Typecheck', 'npm run build', () => {
    try {
      const out = execSync('npm run build', { encoding: 'utf-8' });
      return out.includes('dist') || out.includes('tsc');
    } catch (e) { return false; }
  });
  if (!buildPass) allPassed = false;

  // 2. PostgreSQL
  const pgPass = await runTest('PostgreSQL Connection', 'pingDatabase()', async () => {
    return await pingDatabase();
  });
  if (!pgPass) allPassed = false;

  // 3. Redis
  const redisPass = await runTest('Redis Connection', 'pingRedis()', async () => {
    return await pingRedis();
  });
  if (!redisPass) allPassed = false;

  // 4. BullMQ
  const mqPass = await runTest('BullMQ Connection', 'pingBullMQ()', async () => {
    return await pingBullMQ();
  });
  if (!mqPass) allPassed = false;

  // 5. Telegram
  const tgPass = await runTest('Telegram API', 'pingTelegram()', async () => {
    return await pingTelegram();
  });
  if (!tgPass) allPassed = false;

  // 6. Blitzortung (Needs a quick connect simulation)
  const blPass = await runTest('Blitzortung WebSocket', 'startLightningListener() -> pingBlitzortung()', async () => {
    startLightningListener();
    await new Promise(r => setTimeout(r, 3000));
    return await pingBlitzortung();
  });
  if (!blPass) allPassed = false;

  if (allPassed) {
    console.log('\n=== ALL TESTS PASSED ===');
    process.exit(0);
  } else {
    console.log('\n=== SOME TESTS FAILED ===');
    process.exit(1);
  }
}

run();
