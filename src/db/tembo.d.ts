import { Pool } from 'pg';
export declare const pool: Pool;
export declare function initDatabase(): Promise<void>;
export declare function upsertUserLocation(userId: number, lat: number, lon: number): Promise<void>;
export declare function findUsersInRadius(lat: number, lon: number, radiusMeters: number): Promise<any[]>;
//# sourceMappingURL=tembo.d.ts.map