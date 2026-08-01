import { GeoPoint } from './IDataProvider';

export interface NowcastResult {
  timestamp: number;
  precipIntensity: number;
  thunderstormProb: number;
  isExtreme: boolean;
  confidenceScore: number; // 0 to 100
  explanation: string;
}

export interface INowcastProvider {
  readonly providerName: string;
  
  initialize(): Promise<void>;
  
  /**
   * Retrieves a nowcast prediction up to a specific time horizon.
   * @param location The geographic coordinates.
   * @param horizonMinutes How far into the future to predict.
   */
  getNowcast(location: GeoPoint, horizonMinutes: number): Promise<NowcastResult[]>;
  
  /**
   * Returns a health score from 0 to 100 representing the reliability of the AI/Nowcast model.
   */
  getHealthScore(): Promise<number>;
}
