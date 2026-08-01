import * as turf from '@turf/turf';
import * as tembo from '../src/db/tembo';
import { addStrikeToStore, getRecentStrikes } from '../src/alerting/store';
import { runStormAnalysis } from '../src/weather/analyzer';

let mockStormCells: any[] = [];

// Mock the DB Pool
// @ts-ignore
tembo.pool.query = async (query: string, params: any[]) => {
    if (query.includes('TRUNCATE')) return { rows: [] };
    if (query.includes('SELECT * FROM storm_cells WHERE is_active = true')) {
      return { rows: mockStormCells.filter(c => c.is_active) };
    }
    if (query.includes('SELECT id, \n             ST_AsGeoJSON(centroid)')) {
      return { rows: mockStormCells.filter(c => c.is_active) };
    }
    if (query.includes('UPDATE storm_cells SET is_active = false')) {
      mockStormCells.forEach(c => c.is_active = false);
      return { rows: [] };
    }
    if (query.includes('INSERT INTO storm_cells')) {
      // params are [centroidWkt, hullWkt, speed, dir, strike_rate]
      const coords = params[0].replace('POINT(', '').replace(')', '').split(' ');
      mockStormCells.push({
        id: mockStormCells.length + 1,
        centroid_geo: { type: 'Point', coordinates: [parseFloat(coords[0]), parseFloat(coords[1])] },
        speed_mps: params[2],
        direction_deg: params[3],
        strike_rate: params[4],
        age_seconds: 120, // simulate exactly 2 minutes passed for the next calculation
        is_active: true
      });
      return { rows: [] };
    }
    return { rows: [] };
};

// Mock getClosestStormCell
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

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  console.log('--- STARTING STORM TRACKING MOCK INTEGRATION TEST ---');
  
  mockStormCells = [];
  
  // Clear the in-memory strikes using a hack (since we don't expose clear)
  // Store just clears old ones, we can just start fresh
  const storeStrikes = getRecentStrikes();
  while(storeStrikes.length > 0) storeStrikes.pop();

  console.log('\\n1. Mocking T=0 (Initial Storm Cluster)');
  // Create a cluster of 10 strikes at Lat 55.0, Lon 37.0
  const baseLat = 55.0;
  const baseLon = 37.0;

  for (let i = 0; i < 10; i++) {
    addStrikeToStore(baseLat + (Math.random() * 0.005), baseLon + (Math.random() * 0.005));
  }
  
  console.log('Running Storm Analysis for T=0...');
  await runStormAnalysis();

  let activeCells = mockStormCells.filter(c => c.is_active);
  console.log(`Created ${activeCells.length} storm cell(s) at T=0.`);
  
  console.log('\\n2. Mocking T+2 minutes (Storm moves North-East)');
  // Empty old strikes to simulate clear window
  while(storeStrikes.length > 0) storeStrikes.pop();

  // Shift by 0.1 degrees lat/lon (approx 11km)
  const shiftLat = 55.1; 
  const shiftLon = 37.1;

  for (let i = 0; i < 10; i++) {
    addStrikeToStore(shiftLat + (Math.random() * 0.005), shiftLon + (Math.random() * 0.005));
  }
  
  console.log('Running Storm Analysis for T=2...');
  await runStormAnalysis();

  activeCells = mockStormCells.filter(c => c.is_active);
  console.log(`Created ${activeCells.length} active storm cell(s) at T=2.`);
  
  if (activeCells.length > 0) {
    const cell = activeCells[0];
    console.log(`- Speed: ${cell.speed_mps.toFixed(2)} m/s (${(cell.speed_mps * 3.6).toFixed(1)} km/h)`);
    console.log(`- Direction: ${cell.direction_deg.toFixed(2)} degrees`);
    console.log(`- Strike Rate: ${cell.strike_rate} strikes per window`);
    
    console.log('\\n3. Testing User ETA Calculation (User at Lat 55.2, Lon 37.2)');
    const closest = await tembo.getClosestStormCell(55.2, 37.2);
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

  console.log('--- TEST FINISHED ---');
  process.exit(0);
}

runTest().catch(console.error);
