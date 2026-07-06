process.env.NODE_ENV = 'test';
import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

// 1. Mocking modules BEFORE importing actual handlers
import * as tembo from '../src/db/tembo';
// @ts-ignore
tembo.upsertUserLocation = async (userId: number, lat: number, lon: number) => {
  if (lat == null || lon == null) throw new Error("Invalid coords");
  return Promise.resolve();
};
// @ts-ignore
tembo.countStrikesNearUser = async (userId: number) => {
  if (userId === 999) return null;
  return 42; // Возвращаем 42 удара молнии для теста
};

import { handleStart } from '../src/bot/handlers/onboarding';
import { handleLocation } from '../src/bot/handlers/location';
import { handleStats } from '../src/bot/handlers/stats';
import { startApiServer } from '../src/api';
import { addStrikeToStore } from '../src/alerting/store';
import { Context } from 'telegraf';

// 2. Mock Telegraf Context
class MockTelegrafContext {
  public replies: { text: string, extra: any }[] = [];
  public from: { id: number, first_name: string };
  public message: any;

  constructor(messagePayload: any = {}) {
    this.from = { id: 123456789, first_name: 'TestUser' };
    this.message = messagePayload;
  }

  async reply(text: string, extra?: any) {
    this.replies.push({ text, extra });
  }
}

test('Telegraf Context Mocks & Conversational Flow', async (t) => {
  
  await t.test('Onboarding /start - should return value proposition and map keyboard', async () => {
    const ctx = new MockTelegrafContext() as unknown as Context;
    await handleStart(ctx);
    const mockCtx = ctx as unknown as MockTelegrafContext;

    assert.strictEqual(mockCtx.replies.length, 2, 'Should have exactly 2 replies');
    assert.ok(mockCtx.replies[0].text.includes('Ваш карманный радар безопасности'), 'Missing value proposition');
    assert.ok(mockCtx.replies[0].extra, 'Should have location keyboard markup');
    assert.ok(mockCtx.replies[1].text.includes('выберите точку на карте'), 'Missing map inline keyboard');
  });

  await t.test('Live Location Handler - valid coordinates', async () => {
    const ctx = new MockTelegrafContext({
      location: { latitude: 55.7558, longitude: 37.6173 }
    }) as unknown as Context;
    
    await handleLocation(ctx);
    const mockCtx = ctx as unknown as MockTelegrafContext;

    assert.strictEqual(mockCtx.replies.length, 1);
    assert.ok(mockCtx.replies[0].text.includes('Локация сохранена'), 'Should confirm location saved');
  });

  await t.test('Live Location Handler - negative test (invalid data)', async () => {
    const ctx = new MockTelegrafContext({
      text: "Это текст, а не локация"
    }) as unknown as Context;
    
    await handleLocation(ctx);
    const mockCtx = ctx as unknown as MockTelegrafContext;

    assert.strictEqual(mockCtx.replies.length, 0, 'Should ignore non-location messages');
  });
  
  await t.test('Live Location Handler - negative test (null coordinates)', async () => {
    const ctx = new MockTelegrafContext({
      location: { latitude: null, longitude: null }
    }) as unknown as Context;
    
    await handleLocation(ctx);
    const mockCtx = ctx as unknown as MockTelegrafContext;

    assert.strictEqual(mockCtx.replies.length, 1, 'Should reply with error');
    assert.ok(mockCtx.replies[0].text.includes('Ошибка сохранения локации'), 'Should return error message for null coords');
  });

  await t.test('Stats Handler - user not registered', async () => {
    const ctx = new MockTelegrafContext() as unknown as Context;
    // Подменяем ID пользователя на 999 (который у нас замокан как не имеющий геопозиции)
    (ctx as any).from.id = 999;

    const originalLog = console.log;
    let loggedMsg = '';
    console.log = (msg: string) => { loggedMsg = msg; };

    await handleStats(ctx);
    console.log = originalLog;

    const mockCtx = ctx as unknown as MockTelegrafContext;

    assert.strictEqual(mockCtx.replies.length, 1, 'Should reply with instruction');
    assert.ok(mockCtx.replies[0].text.includes('Сначала отправьте свою геолокацию'), 'Should prompt for location');
    assert.ok(loggedMsg.includes('[STATS-DEBUG]'), 'Log prefix should be [STATS-DEBUG]');
  });

  await t.test('Stats Handler - registered user returns count', async () => {
    const ctx = new MockTelegrafContext() as unknown as Context;
    
    const originalLog = console.log;
    let loggedMsg = '';
    console.log = (msg: string) => { loggedMsg = msg; };

    await handleStats(ctx);
    console.log = originalLog;

    const mockCtx = ctx as unknown as MockTelegrafContext;

    assert.strictEqual(mockCtx.replies.length, 1, 'Should reply with stats');
    assert.ok(mockCtx.replies[0].text.includes('За последние 24 часа зарегистрировано ударов молний: *42*'), 'Should return correct count');
    assert.ok(loggedMsg.includes('[STATS-DEBUG]'), 'Log prefix should be [STATS-DEBUG]');
  });
});

test('API Contract Verification (Express)', async (t) => {
  // Add some mock strikes
  addStrikeToStore(55.75, 37.61);
  addStrikeToStore(55.76, 37.62);

  // Start the server
  process.env.PORT = '3001';
  // We mock console.log to avoid clutter
  const originalLog = console.log;
  console.log = () => {};
  const server = startApiServer();
  console.log = originalLog;

  await t.test('GET /api/strikes should return correct JSON and CORS headers', async () => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/strikes',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      };
      
      http.get(options, (res) => {
        try {
          assert.strictEqual(res.statusCode, 200, 'Status code must be 200');
          assert.strictEqual(res.headers['access-control-allow-origin'], 'http://localhost:3000', 'CORS header missing or mismatch');
          
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            const parsed = JSON.parse(data);
            assert.ok(Array.isArray(parsed.strikes), 'strikes must be an array');
            assert.ok(parsed.strikes.length >= 2, 'Should return the added strikes');
            assert.ok(parsed.strikes[0].lat, 'Strike must have lat');
            assert.ok(parsed.strikes[0].lon, 'Strike must have lon');
            assert.ok(parsed.strikes[0].timestamp, 'Strike must have timestamp');
            resolve();
          });
        } catch (e) {
          reject(e);
        }
      }).on('error', reject);
    });
  });
  
  // Close the server so the Node process can exit
  server.close();
});

test('Cleanup resources', async () => {
  const { redis } = require('../src/cache/upstash');
  const { pool } = require('../src/db/tembo');
  await redis.quit();
  await pool.end();
});
