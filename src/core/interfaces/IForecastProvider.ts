import { GeoPoint } from './IDataProvider';

export interface ForecastResult {
  timestamp: number;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  precipProb: number;
  confidenceScore: number;
}

export interface IForecastProvider {
  readonly providerName: string;
  
  initialize(): Promise<void>;
  
  /**
   * Retrieves a standard weather forecast (Ground Truth).
   * @param location The geographic coordinates.
   * @param horizonHours How far into the future to predict.
   */
  getForecast(location: GeoPoint, horizonHours: number): Promise<ForecastResult[]>;
  
  /**
   * Returns a health score from 0 to 100.
   */
  getHealthScore(): Promise<number>;
}
