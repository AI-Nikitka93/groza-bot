import fs from 'fs';
import path from 'path';

export interface TelemetryEvent {
  type?: 'alert' | 'validation';
  alert_id: string;
  user_id: string;
  location_id: string | number;
  risk_score: number;
  confidence_score: number;
  ETA?: number;
  distance: number;
  direction: number;
  speed: number;
  density: number;
  trend: string;
  prediction_timestamp: string;
  actual_first_strike_timestamp?: string;
  eta_error_minutes?: number;
  bearing_error_deg?: number;
  notification_type: 'observation' | 'moderate' | 'high' | 'critical' | 'all_clear';
  notification_sent: boolean;
  notification_delivered?: boolean;
}

const logPath = path.join(__dirname, '../../tmp/telemetry_alerts.jsonl');

export function logTelemetry(event: TelemetryEvent) {
  try {
    const dir = path.dirname(logPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const payload = { type: 'alert', ...event };
    fs.appendFileSync(logPath, JSON.stringify(payload) + '\n');
  } catch (error) {
    console.error('Failed to write telemetry:', error);
  }
}
