import fs from 'fs';
import path from 'path';

export interface AppConfigSchema {
  riskModel: {
    maxRadiusMeters: number;
    maxDensityScalar: number;
    fastSpeedKmh: number;
    trendThreshold: number;
    weights: {
      distance: number;
      density: number;
    };
    multipliers: {
      directionDirect: number;
      directionAway: number;
      etaImminent: number;
      speedFast: number;
      trendGrowing: number;
    };
    emaAlpha: number;
  };
  confidenceModel: {
    baseDeduction: {
      trajectory: number;
      age: number;
      eta: number;
    };
    weights: {
      trajectoryStability: number;
      stormAge: number;
      etaValidity: number;
    };
  };
  allClear: {
    minutesWithoutLightning: number;
    maxRiskScore: number;
  };
}

const configPath = path.join(__dirname, '../config.json');

export function loadConfig(): AppConfigSchema {
  return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as AppConfigSchema;
}

export const AppConfig = loadConfig();
