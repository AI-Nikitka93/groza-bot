import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

const localEnvPath = path.join(__dirname, '../.env');
const distEnvPath = path.join(__dirname, 'config.env');

const envPath = fs.existsSync(distEnvPath) ? distEnvPath : localEnvPath;

const dotenvResult = config({ path: envPath });
if (dotenvResult.error) {
  console.error(`[ENV ERROR] Failed to load env from ${envPath}:`, dotenvResult.error.message);
}

const isTest = process.env.NODE_ENV === 'test';

export const ENV = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/groza',
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || '',
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  IMGUR_CLIENT_ID: process.env.IMGUR_CLIENT_ID || '',
  THREADS_USER_ID: process.env.THREADS_USER_ID || '',
  THREADS_ACCESS_TOKEN: process.env.THREADS_ACCESS_TOKEN || '',
  WEBAPP_URL: process.env.WEBAPP_URL || 'https://example.com',
};

// Fail-Fast валидация критических переменных окружения при запуске в продакшене/девелопменте
if (!isTest) {
  const missingVars: string[] = [];
  if (!ENV.TELEGRAM_BOT_TOKEN) missingVars.push('TELEGRAM_BOT_TOKEN');
  if (!ENV.DATABASE_URL) missingVars.push('DATABASE_URL');
  if (!ENV.REDIS_URL) missingVars.push('REDIS_URL');
  
  if (missingVars.length > 0) {
    console.error(`\x1b[31m[CRITICAL CONFIG ERROR] Missing required environment variables: ${missingVars.join(', ')}\x1b[0m`);
    process.exit(1);
  }
}
