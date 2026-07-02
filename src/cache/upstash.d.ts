import Redis from 'ioredis';
export declare const redis: Redis;
export declare function checkRateLimit(userId: number, eventType: 'critical' | 'warning', cooldownSec: number): Promise<boolean>;
//# sourceMappingURL=upstash.d.ts.map