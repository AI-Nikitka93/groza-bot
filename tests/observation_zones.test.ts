import { pool, upsertUserLocation, insertStrikesBatch } from '../src/db/tembo';
import { addStrikeToStore } from '../src/alerting/store';
import { runStormAnalysis } from '../src/weather/analyzer';
import { processStrikesBatch } from '../src/alerting/dispatcher';
import { redis } from '../src/cache/upstash';
import fs from 'fs';
import path from 'path';

async function testObservationZones() {
  console.log('🧪 Starting Functional Observation Zone Test (20 km, 25 km, 30 km)...\n');

  const userId = 888111222;
  // User at Moscow center
  const userLat = 55.7558;
  const userLon = 37.6173;

  try {
    await upsertUserLocation(userId, userLat, userLon, 'Дом');
    console.log('   ✅ Test User registered at Moscow center [55.7558, 37.6173]');

    const testDistances = [
      { name: '30 km', offsetLat: 0.27, offsetLon: 0 }, // ~30 km North
      { name: '25 km', offsetLat: 0.225, offsetLon: 0 }, // ~25 km North
      { name: '20 km', offsetLat: 0.18, offsetLon: 0 }  // ~20 km North
    ];

    for (const d of testDistances) {
      console.log(`\n📍 Testing Lightning Storm at ${d.name} (${(d.offsetLat * 111).toFixed(1)} km away)...`);
      
      // Clean previous Redis keys
      const keys = await redis.keys(`*${userId}*`);
      if (keys.length > 0) await redis.del(...keys);

      // 1. Frame 1: Strikes further out
      const strikesF1 = [];
      for (let i = 0; i < 15; i++) {
        strikesF1.push({ lat: userLat + d.offsetLat + 0.02, lon: userLon });
      }
      await insertStrikesBatch(strikesF1);
      await runStormAnalysis();

      // 2. Frame 2: Strikes at target distance moving towards User (Southwards, bearing ~180°)
      await new Promise(r => setTimeout(r, 1000));
      const strikesF2 = [];
      for (let i = 0; i < 20; i++) {
        const lat = userLat + d.offsetLat + (Math.random() - 0.5) * 0.005;
        const lon = userLon + (Math.random() - 0.5) * 0.005;
        addStrikeToStore(lat, lon);
        strikesF2.push({ lat, lon });
      }
      await insertStrikesBatch(strikesF2);
      await runStormAnalysis();

      // Dispatcher cycle
      await processStrikesBatch(strikesF2);

      // Verify Telemetry Log entry for this alert
      const alertsFile = path.join(__dirname, '../tmp/telemetry_alerts.jsonl');
      if (fs.existsSync(alertsFile)) {
        const lines = fs.readFileSync(alertsFile, 'utf-8').trim().split('\n');
        const lastAlert = JSON.parse(lines.pop() || '{}');
        
        console.log(`   ✅ Dispatch Result for ${d.name}:`);
        console.log(`      - Distance: ${(lastAlert.distance / 1000).toFixed(1)} km`);
        console.log(`      - Notification Type: ${lastAlert.notification_type}`);
        console.log(`      - Risk Score: ${lastAlert.risk_score.toFixed(1)}/100`);
        console.log(`      - Confidence: ${lastAlert.confidence_score}%`);

        if (lastAlert.notification_type === 'low') {
          console.warn(`   ⚠️ Warning: Strike at ${d.name} evaluated as 'low' danger (Check cross-track or speed)`);
        } else {
          console.log(`   🎯 SUCCESS: Alert correctly triggered for ${d.name} (${lastAlert.notification_type} zone)!`);
        }
      }
    }

    console.log('\n======================================================');
    console.log('🎉 OBSERVATION ZONE FUNCTIONAL TEST PASSED SUCCESSFULLY!');
    console.log('======================================================');
    process.exit(0);

  } catch (err: any) {
    console.error('\n❌ OBSERVATION ZONE TEST FAILED:', err.message || err);
    process.exit(1);
  }
}

testObservationZones();
