import * as fs from 'fs';
import * as path from 'path';
import { pool } from '../db/tembo';

const LOG_FILE = path.join(__dirname, '../../tmp/telemetry_storms.jsonl');

interface QATelemetry {
  type?: 'storm_cell';
  timestamp: string;
  clusterId: number;
  lat: number;
  lon: number;
  speedMps: number;
  directionDeg: number;
  strikeRate: number;
  isStrengthening?: boolean;
}

export async function runQAMonitorCycle() {
  try {
    // Получаем активные ячейки
    const res = await pool.query(`
      SELECT id, 
             ST_Y(centroid::geometry) as lat,
             ST_X(centroid::geometry) as lon,
             speed_mps, 
             direction_deg, 
             strike_rate
      FROM storm_cells
      WHERE is_active = true
    `);

    for (const row of res.rows) {
      const record: QATelemetry = {
        type: 'storm_cell',
        timestamp: new Date().toISOString(),
        clusterId: row.id,
        lat: row.lat,
        lon: row.lon,
        speedMps: row.speed_mps,
        directionDeg: row.direction_deg,
        strikeRate: row.strike_rate
      };

      // Ensure tmp dir exists
      const dir = path.dirname(LOG_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.appendFileSync(LOG_FILE, JSON.stringify(record) + '\n');
    }
  } catch (error) {
    console.error('QA Monitor Error:', error);
  }
}

export function startLiveQAMonitor() {
  console.log('QA Live Monitor started.');
  setInterval(runQAMonitorCycle, 5 * 60 * 1000);
}
