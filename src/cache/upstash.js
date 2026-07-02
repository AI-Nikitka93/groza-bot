"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.checkRateLimit = checkRateLimit;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../env");
exports.redis = new ioredis_1.default(env_1.ENV.REDIS_URL);
async function checkRateLimit(userId, eventType, cooldownSec) {
    const key = `ratelimit:${userId}:${eventType}`;
    // NX: set only if not exists
    // EX: expire in cooldownSec seconds
    const result = await exports.redis.set(key, '1', 'EX', cooldownSec, 'NX');
    // if result is OK, we haven't sent this type of alert to this user recently
    return result === 'OK';
}
//# sourceMappingURL=upstash.js.map