import { config } from 'dotenv';

config();

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
