import { pool, initDatabase } from '../src/db/tembo';
import { addStrikeToStore } from '../src/alerting/store';
import { runStormAnalysis } from '../src/weather/analyzer';
import { getClosestStormCell } from '../src/db/tembo';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  console.log('--- STARTING STORM TRACKING INTEGRATION TEST ---');
  
  await initDatabase();
  await pool.query('TRUNCATE TABLE storm_cells RESTART IDENTITY CASCADE;');
  await pool.query('TRUNCATE TABLE strikes RESTART IDENTITY CASCADE;');

  console.log('1. Mocking T=0 (Initial Storm Cluster)');
  // Create a cluster of 6 strikes at Lat 55.0, Lon 37.0 (Moscow region)
  const baseLat = 55.0;
  const baseLon = 37.0;

  for (let i = 0; i < 6; i++) {
    addStrikeToStore(baseLat + (Math.random() * 0.01), baseLon + (Math.random() * 0.01));
  }
  
  console.log('Running Storm Analysis for T=0...');
  await runStormAnalysis();

  let cells = await pool.query('SELECT * FROM storm_cells');
  console.log(`Created ${cells.rows.length} storm cell(s) at T=0.`);
  
  console.log('\n2. Mocking T+2 minutes (Storm moves North-East)');
  // Shift by 0.1 degrees lat/lon (approx 11km)
  const shiftLat = 55.1; 
  const shiftLon = 37.1;

  for (let i = 0; i < 6; i++) {
    addStrikeToStore(shiftLat + (Math.random() * 0.01), shiftLon + (Math.random() * 0.01));
  }

  // Sleep 1 sec to ensure temporal difference
  await delay(1000);
  
  console.log('Running Storm Analysis for T=2...');
  // Force age_seconds to be roughly 120s by updating DB manually since real time hasn't passed
  await pool.query(`UPDATE storm_cells SET created_at = NOW() - INTERVAL '2 minutes'`);
  await runStormAnalysis();

  cells = await pool.query('SELECT * FROM storm_cells WHERE is_active = true');
  console.log(`Created ${cells.rows.length} active storm cell(s) at T=2.`);
  
  if (cells.rows.length > 0) {
    const cell = cells.rows[0];
    console.log(`- Speed: ${cell.speed_mps.toFixed(2)} m/s (${(cell.speed_mps * 3.6).toFixed(1)} km/h)`);
    console.log(`- Direction: ${cell.direction_deg.toFixed(2)} degrees`);
    console.log(`- Strike Rate: ${cell.strike_rate} strikes per window`);
    
    console.log('\n3. Testing User ETA Calculation (User at Lat 55.2, Lon 37.2)');
    const closest = await getClosestStormCell(55.2, 37.2);
    if (closest) {
      const distMeters = closest.distance_meters;
      const etaMins = Math.round((distMeters / (closest.speed_mps || 1)) / 60);
      console.log(`- Distance to user: ${(distMeters / 1000).toFixed(1)} km`);
      console.log(`- ETA: ${etaMins} minutes`);
    } else {
      console.log('Failed to find closest storm cell.');
    }
  } else {
    console.log('TEST FAILED: No active cells found.');
  }

  await pool.end();
  console.log('--- TEST FINISHED ---');
  process.exit(0);
}

runTest().catch(console.error);
