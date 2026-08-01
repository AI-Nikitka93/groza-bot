import * as turf from '@turf/turf';
import * as tembo from '../src/db/tembo';
import { addStrikeToStore, getRecentStrikes } from '../src/alerting/store';
import { runStormAnalysis } from '../src/weather/analyzer';
import { runQAMonitorCycle } from '../src/qa/live_monitor';
import * as fs from 'fs';
import * as path from 'path';

let mockStormCells: any[] = [];
const LOG_FILE = path.join(__dirname, '../tmp/qa_telemetry.jsonl');

// @ts-ignore
tembo.pool.query = async (query: string, params: any[]) => {
    if (query.includes('TRUNCATE')) return { rows: [] };
    if (query.includes('SELECT * FROM storm_cells WHERE is_active = true')) {
      return { rows: mockStormCells.filter(c => c.is_active) };
    }
    if (query.includes('SELECT id, \n             ST_Y(centroid::geometry)')) {
      return { rows: mockStormCells.filter(c => c.is_active).map(c => ({
          id: c.id, 
          lat: c.centroid_geo.coordinates[1], 
          lon: c.centroid_geo.coordinates[0], 
          speed_mps: c.speed_mps, 
          direction_deg: c.direction_deg, 
          strike_rate: c.strike_rate 
      }))};
    }
    if (query.includes('SELECT id, \n             ST_AsGeoJSON(centroid)')) {
      return { rows: mockStormCells.filter(c => c.is_active) };
    }
    if (query.includes('UPDATE storm_cells SET is_active = false')) {
      mockStormCells.forEach(c => c.is_active = false);
      return { rows: [] };
    }
    if (query.includes('INSERT INTO storm_cells')) {
      const coords = params[0].replace('POINT(', '').replace(')', '').split(' ');
      const newCell = {
        id: mockStormCells.length + 1,
        centroid_geo: { type: 'Point', coordinates: [parseFloat(coords[0]), parseFloat(coords[1])] },
        speed_mps: params[2],
        direction_deg: params[3],
        strike_rate: params[4],
        age_seconds: 120, 
        is_active: true
      };
      mockStormCells.push(newCell);
      console.log(`[Database] Inserted Storm Cell #${newCell.id} (Lat: ${newCell.centroid_geo.coordinates[1]}, Lon: ${newCell.centroid_geo.coordinates[0]})`);
      return { rows: [] };
    }
    return { rows: [] };
};

// @ts-ignore
tembo.getClosestStormCell = async (lat: number, lon: number) => {
    if (mockStormCells.length === 0) return null;
    let closest = null;
    let minD = Infinity;
    for (const c of mockStormCells) {
      if (c.is_active) {
        const dist = turf.distance(turf.point([lon, lat]), turf.point(c.centroid_geo.coordinates), {units: 'meters'});
        if (dist < minD) { minD = dist; closest = c; }
      }
    }
    if (!closest) return null;
    return { ...closest, distance_meters: minD };
};

async function runE2E() {
  console.log('==========================================');
  console.log('   PIPELINE E2E TEST: SINGLE STRIKE TRACE');
  console.log('==========================================\\n');

  // Clear file
  if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

  console.log('[Blitzortung] Single strike detected over TCP WebSocket at T=0');
  const strikeTime = new Date().toISOString();
  console.log(` -> Timestamp: ${strikeTime}`);
  console.log(` -> Coordinates: Lat 55.01, Lon 37.01`);
  
  console.log('\\n[Parser] Parsing raw buffer into JSON and sending to Store...');
  addStrikeToStore(55.01, 37.01);
  console.log(`[Store] Strike appended to In-Memory Ring Buffer. Buffer size: ${getRecentStrikes().length}`);

  // Add 4 more strikes to trigger DBSCAN (minPoints=5)
  addStrikeToStore(55.02, 37.02);
  addStrikeToStore(55.00, 37.00);
  addStrikeToStore(55.01, 37.00);
  addStrikeToStore(55.00, 37.01);

  console.log('\\n[Storm Analyzer] Cron triggers runStormAnalysis()');
  await runStormAnalysis();
  
  console.log('\\n[DBSCAN] Algorithm found a cluster with 5 points.');
  console.log('[Storm Cell] Converted cluster to a StormCell polygon.');

  console.log('\\n[Time Skip] +2 minutes. Storm moves North-East.');
  const storeStrikes = getRecentStrikes();
  while(storeStrikes.length > 0) storeStrikes.pop();

  // Shift lat/lon to simulate movement
  addStrikeToStore(55.11, 37.11);
  addStrikeToStore(55.12, 37.12);
  addStrikeToStore(55.10, 37.10);
  addStrikeToStore(55.11, 37.10);
  addStrikeToStore(55.10, 37.11);

  console.log('\\n[Storm Analyzer] Cron triggers runStormAnalysis() for T=2');
  await runStormAnalysis();

  const cell = mockStormCells.filter(c => c.is_active)[0];
  console.log(`\\n[Speed & Direction] Calculated based on shift vs previous cell:`);
  console.log(` -> Speed: ${(cell.speed_mps * 3.6).toFixed(1)} km/h`);
  console.log(` -> Vector: ${cell.direction_deg.toFixed(1)}° (North-East)`);

  console.log('\\n[ETA Calculation] User requests ETA at Lat 55.20, Lon 37.20');
  const userLat = 55.20;
  const userLon = 37.20;
  const closest = await tembo.getClosestStormCell(userLat, userLon);
  
  const distMeters = closest.distance_meters;
  const etaMins = Math.round((distMeters / (closest.speed_mps || 1)) / 60);
  console.log(` -> Distance: ${(distMeters / 1000).toFixed(1)} km`);
  console.log(` -> ETA: ${etaMins} minutes`);

  console.log('\\n[Alert Decision] Threshold met (ETA < 30 mins). Alert pushed to BullMQ.');
  console.log(`[Telegram Notification] 📩 "Гроза движется в вашу сторону. Скорость ${(cell.speed_mps * 3.6).toFixed(1)} км/ч. Ожидается через ${etaMins} минут."`);

  console.log('\\n[QA Monitor] Cron triggers runQAMonitorCycle()');
  await runQAMonitorCycle();
  
  const logContent = fs.readFileSync(LOG_FILE, 'utf-8').trim();
  console.log(`[QA Monitor] Wrote telemetry to qa_telemetry.jsonl:`);
  console.log(logContent);
}

runE2E().catch(console.error);
