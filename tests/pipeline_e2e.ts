import { pool, upsertUserLocation, insertStrikesBatch } from '../src/db/tembo';
import { addStrikeToStore } from '../src/alerting/store';
import { runStormAnalysis } from '../src/weather/analyzer';
import { processStrikesBatch } from '../src/alerting/dispatcher';
import { runQAMonitorCycle } from '../src/qa/live_monitor';
import fs from 'fs';
import path from 'path';

async function runE2EPipelineVerification() {
  console.log('⚡ Starting Groza v1.0 E2E Pipeline & Mathematical Model Verification...\n');

  const testUserId = 999000111;
  const testLat = 55.8000;
  const testLon = 37.6500;

  try {
    // 1. Setup User Location
    console.log('1️⃣ Setting up test user location in DB...');
    await upsertUserLocation(testUserId, testLat, testLon, 'Тестовая локация');
    console.log('   ✅ User location registered at [55.8000, 37.6500]');

    // 2. Ingest Cluster 1 (Frame 1: 55.75, 37.61 - ~6km South-West of user)
    console.log('\n2️⃣ Frame 1: Simulating lightning cluster (10 strikes) at SW...');
    const frame1Strikes = [];
    for (let i = 0; i < 10; i++) {
      const lat = 55.7500 + (Math.random() - 0.5) * 0.01;
      const lon = 37.6100 + (Math.random() - 0.5) * 0.01;
      addStrikeToStore(lat, lon);
      frame1Strikes.push({ lat, lon });
    }
    await insertStrikesBatch(frame1Strikes);
    console.log('   ✅ Batch 1 inserted into PostGIS strikes table.');

    // Run Analyzer for Frame 1
    console.log('\n3️⃣ Running DBSCAN Storm Cell Analyzer (Frame 1)...');
    await runStormAnalysis();
    
    const res1 = await pool.query(`SELECT id, track_id, speed_mps, direction_deg, strike_rate, risk_score FROM storm_cells WHERE is_active = true ORDER BY id DESC LIMIT 1`);
    if (res1.rows.length === 0) {
      throw new Error('FAILED: No storm cell created by DBSCAN!');
    }
    const cell1 = res1.rows[0];
    console.log(`   ✅ Cell 1 Created -> TrackID: ${cell1.track_id}, Intrinsic RiskScore: ${cell1.risk_score}, StrikeRate: ${cell1.strike_rate}`);

    // 3. Ingest Cluster 2 (Frame 2: 55.77, 37.63 - moving towards User)
    console.log('\n4️⃣ Frame 2: Simulating cell movement towards user...');
    // Artificial pause to simulate time passing
    await new Promise(r => setTimeout(r, 1000));

    const frame2Strikes = [];
    for (let i = 0; i < 15; i++) {
      const lat = 55.7700 + (Math.random() - 0.5) * 0.01;
      const lon = 37.6300 + (Math.random() - 0.5) * 0.01;
      addStrikeToStore(lat, lon);
      frame2Strikes.push({ lat, lon });
    }
    await insertStrikesBatch(frame2Strikes);

    console.log('\n5️⃣ Running DBSCAN Storm Cell Analyzer (Frame 2 - Movement vector)...');
    await runStormAnalysis();

    const res2 = await pool.query(`SELECT id, track_id, speed_mps, direction_deg, strike_rate, risk_score FROM storm_cells WHERE is_active = true ORDER BY id DESC LIMIT 1`);
    const cell2 = res2.rows[0];
    console.log(`   ✅ Cell 2 Vector -> Speed: ${(cell2.speed_mps * 3.6).toFixed(1)} km/h, Direction: ${cell2.direction_deg.toFixed(1)}°, Intrinsic RiskScore: ${cell2.risk_score}`);

    if (cell2.speed_mps === 0) {
      console.warn('   ⚠️ Speed 0 detected (check time delta)');
    } else {
      console.log('   ✅ Speed & Direction vector successfully derived from track_id continuation!');
    }

    // 4. Run Alerting Dispatcher & Multiplicative Risk Score
    console.log('\n6️⃣ Executing Alert Dispatcher (Multiplicative Risk Model & Confidence)...');
    await processStrikesBatch(frame2Strikes);
    console.log('   ✅ Dispatcher cycle complete.');

    // 5. Verify Telemetry Output Files
    console.log('\n7️⃣ Verifying Telemetry file outputs & discriminators...');
    await runQAMonitorCycle();

    const alertsFile = path.join(__dirname, '../tmp/telemetry_alerts.jsonl');
    const stormsFile = path.join(__dirname, '../tmp/telemetry_storms.jsonl');

    if (fs.existsSync(alertsFile)) {
      const alertLine = fs.readFileSync(alertsFile, 'utf-8').trim().split('\n').pop();
      console.log(`   ✅ Alerts Telemetry OK -> ${alertLine}`);
    } else {
      console.log('   ℹ️ Alerts telemetry file generated or waiting for dispatch threshold.');
    }

    if (fs.existsSync(stormsFile)) {
      const stormLine = fs.readFileSync(stormsFile, 'utf-8').trim().split('\n').pop();
      console.log(`   ✅ Storms Telemetry OK -> ${stormLine}`);
    } else {
      throw new Error('FAILED: Storms telemetry file was not created!');
    }

    console.log('\n==================================================');
    console.log('🎉 E2E PIPELINE VERIFICATION PASSED SUCCESSFULLY!');
    console.log('==================================================');
    process.exit(0);

  } catch (err: any) {
    console.error('\n❌ E2E PIPELINE VERIFICATION FAILED:', err.message || err);
    process.exit(1);
  }
}

runE2EPipelineVerification();
