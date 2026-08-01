export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface RawWeatherData {
  timestamp: number;
  location: GeoPoint;
  type: string; // e.g. 'lightning', 'precipitation'
  payload: any;
}

export interface IDataProvider {
  readonly providerName: string;
  
  initialize(): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  
  onData(callback: (data: RawWeatherData) => void): void;
  
  /**
   * Returns a health score from 0 to 100 representing the reliability and freshness of the data.
   */
  getHealthScore(): Promise<number>;
}
