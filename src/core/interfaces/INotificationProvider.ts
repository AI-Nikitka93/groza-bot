export interface NotificationPayload {
  userId: string;
  message: string;
  level: 'info' | 'warning' | 'critical';
  metadata?: Record<string, any>;
}

export interface INotificationProvider {
  readonly providerName: string;
  
  initialize(): Promise<void>;
  
  /**
   * Sends a single notification. Returns true on success.
   */
  send(payload: NotificationPayload): Promise<boolean>;
  
  /**
   * Sends multiple notifications in a batch for higher throughput.
   * Returns an array of booleans indicating success for each payload.
   */
  sendBatch(payloads: NotificationPayload[]): Promise<boolean[]>;
  
  /**
   * Returns a health score from 0 to 100.
   */
  getHealthScore(): Promise<number>;
}
