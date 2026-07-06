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

test('Monitoring & Statistics Verification', async (t) => {
  const { incrementRequestCount, getRequestCountForPeriod } = require('../src/cache/upstash');
  const { initDatabase, insertErrorLog, getErrorsCount, getRecentErrors } = require('../src/db/tembo');

  // Ensure tables are created
  await initDatabase();

  await t.test('Test 1: Redis requests monitoring counters', async () => {
    const oldCount = await getRequestCountForPeriod('bot', 1);
    await incrementRequestCount('bot');
    const newCount = await getRequestCountForPeriod('bot', 1);
    assert.strictEqual(newCount, oldCount + 1, 'Bot request count should increase by exactly 1');
  });

  const randomMessage = `MockTestError-${Math.random().toString(36).substring(7)}`;

  await t.test('Test 2: Error logging in PostgreSQL', async () => {
    await insertErrorLog('bot', 'MockTestError', randomMessage, 'mock stack', 55.7558, 37.6173, 12345);
    
    const count = await getErrorsCount('bot', 1, 55.7558, 37.6173, 500);
    assert.ok(count >= 1, 'Errors count in radius 500m should be >= 1');

    const recent = await getRecentErrors(1, 10, 55.7558, 37.6173, 500);
    const ourError = recent.find((e: any) => e.message === randomMessage);
    assert.ok(ourError, 'Our error should be in the recent errors list');
    assert.strictEqual(ourError.lat, 55.7558, 'Error latitude mismatch');
    assert.strictEqual(ourError.lon, 37.6173, 'Error longitude mismatch');
    assert.strictEqual(ourError.user_id, 12345, 'Error user_id mismatch');
  });

  await t.test('Test 3: API stats endpoint GET /api/monitoring/stats', async () => {
    process.env.PORT = '3001';
    // We mock console.log to avoid clutter
    const originalLog = console.log;
    console.log = () => {};
    const server = startApiServer();
    console.log = originalLog;

    try {
      await new Promise<void>((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port: 3001,
          path: '/api/monitoring/stats?hours=1&lat=55.7558&lon=37.6173&radius=5000',
          headers: {
            'Origin': 'http://localhost:3000'
          }
        };

        http.get(options, (res) => {
          try {
            assert.strictEqual(res.statusCode, 200, 'Status code must be 200');
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                
                assert.ok(typeof parsed.api?.requests === 'number', 'api.requests must be a number');
                assert.ok(typeof parsed.api?.errors === 'number', 'api.errors must be a number');
                assert.ok(typeof parsed.api?.errorRate === 'number', 'api.errorRate must be a number');
                
                assert.ok(typeof parsed.bot?.requests === 'number', 'bot.requests must be a number');
                assert.ok(typeof parsed.bot?.errors === 'number', 'bot.errors must be a number');
                assert.ok(typeof parsed.bot?.errorRate === 'number', 'bot.errorRate must be a number');
                
                assert.ok(Array.isArray(parsed.recentErrors), 'recentErrors must be an array');
                
                const ourApiError = parsed.recentErrors.find((e: any) => e.message === randomMessage);
                assert.ok(ourApiError, 'Our test error must be present in the stats API response recentErrors');
                
                resolve();
              } catch (parseErr) {
                reject(parseErr);
              }
            });
          } catch (e) {
            reject(e);
          }
        }).on('error', reject);
      });
    } finally {
      server.close();
    }
  });
});

test('Cleanup resources', async () => {
  const { redis } = require('../src/cache/upstash');
  const { pool } = require('../src/db/tembo');
  await redis.quit();
  await pool.end();
});
