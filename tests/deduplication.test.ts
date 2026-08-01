import { processStrikesBatch } from '../src/alerting/dispatcher';
import { redis } from '../src/cache/upstash';
import { pool, upsertUserLocation, insertStrikesBatch } from '../src/db/tembo';
import { runStormAnalysis } from '../src/weather/analyzer';
import { telegramQueue } from '../src/alerting/queue';

async function testDeduplicationProtection() {
  console.log('🧪 Testing 7x Notification Duplication Protection...\n');

  const testUserId = 777888999;
  const testLat = 55.7500;
  const testLon = 37.6100;

  try {
    // 1. Setup multiple saved locations / duplicate records for the user
    console.log('1️⃣ Registering multiple locations for the same user...');
    await upsertUserLocation(testUserId, testLat, testLon, 'Дом');
    await upsertUserLocation(testUserId, testLat + 0.001, testLon + 0.001, 'Работа');
    await upsertUserLocation(testUserId, testLat + 0.002, testLon + 0.002, 'Дача');
    
    // Clear any previous Redis keys for test user
    const keys = await redis.keys(`*${testUserId}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }

    // 2. Ingest Strike Batch
    console.log('2️⃣ Ingesting strike batch...');
    const strikes = [];
    for (let i = 0; i < 12; i++) {
      strikes.push({ lat: testLat + 0.005, lon: testLon + 0.005 });
    }
    await insertStrikesBatch(strikes);
    await runStormAnalysis();

    // Drain initial queue count
    const initialJobCount = await telegramQueue.getJobCountByTypes('waiting', 'active', 'delayed');

    // 3. Trigger Dispatcher Multiple Times (Simulating 7 rapid batches)
    console.log('3️⃣ Executing processStrikesBatch 7 times in rapid succession...');
    for (let attempt = 1; attempt <= 7; attempt++) {
      await processStrikesBatch(strikes);
    }

    const finalJobCount = await telegramQueue.getJobCountByTypes('waiting', 'active', 'delayed');
    const jobsAdded = finalJobCount - initialJobCount;

    console.log(`\n📊 Results: Total BullMQ Jobs added for user ${testUserId} across 7 runs: ${jobsAdded}`);

    // Verify Redis Tuple Keys
    const dedupKeys = await redis.keys(`alert:dedup:${testUserId}:*`);
    console.log(`🔒 Redis Deduplication Locks Active: ${dedupKeys.length}`);
    dedupKeys.forEach(k => console.log(`   - Key: ${k}`));

    if (jobsAdded > 3) { // 3 locations max, each only 1 notification allowed
      throw new Error(`FAILURE: Protection failed! ${jobsAdded} jobs created (expected max 3 across 7 runs).`);
    }

    console.log('\n======================================================');
    console.log('🎉 7X DUPLICATION PROTECTION TEST PASSED SUCCESSFULLY!');
    console.log('======================================================');
    process.exit(0);

  } catch (err: any) {
    console.error('\n❌ DEDUPLICATION TEST FAILED:', err.message || err);
    process.exit(1);
  }
}

testDeduplicationProtection();
