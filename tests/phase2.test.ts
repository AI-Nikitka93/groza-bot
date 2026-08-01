// @ts-nocheck
import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import { startApiServer } from '../src/api';
import { MetricsTracker } from '../src/observability';
import * as http from 'http';

describe('Phase 2 Fixes', () => {
  describe('/health endpoint', () => {
    let server: any;
    let originalPort: string | undefined;

    beforeAll((done) => {
      originalPort = process.env.PORT;
      process.env.PORT = '0'; // Random port
      server = startApiServer();
      server.on('listening', done);
    });

    afterAll((done) => {
      process.env.PORT = originalPort;
      server.close(done);
    });

    it('should return 503 when status is degraded', (done) => {
      jest.spyOn(MetricsTracker, 'getStatus').mockReturnValue({ status: 'degraded', tree: {} as any });
      
      const port = server.address().port;
      
      http.get(`http://localhost:${port}/health`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          expect(res.statusCode).toBe(503);
          expect(JSON.parse(data).status).toBe('degraded');
          jest.restoreAllMocks();
          done();
        });
      }).on('error', done);
    });
  });

  describe('index.ts startBot failure', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('should call process.exit(1) if startBot fails', async () => {
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation((code) => {
        return undefined as never;
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock all the dependencies so the app doesn't actually connect to DB/Redis
      jest.mock('../src/db/tembo', () => ({
        initDatabase: jest.fn().mockResolvedValue(true),
        pingDatabase: jest.fn().mockResolvedValue(true)
      }));
      jest.mock('../src/cache/upstash', () => ({
        pingRedis: jest.fn().mockResolvedValue(true)
      }));
      jest.mock('../src/alerting/queue', () => ({
        pingBullMQ: jest.fn().mockResolvedValue(true)
      }));
      jest.mock('../src/bot', () => ({
        startBot: jest.fn().mockRejectedValue(new Error('Bot failed to start')),
        pingTelegram: jest.fn().mockResolvedValue(true)
      }));
      jest.mock('../src/api', () => ({
        startApiServer: jest.fn().mockReturnValue({ on: jest.fn(), address: () => ({ port: 0 }) })
      }));
      jest.mock('../src/weather/lightning_listener', () => ({
        startLightningListener: jest.fn(),
        pingBlitzortung: jest.fn().mockResolvedValue(true)
      }));
      jest.mock('../src/weather/analyzer', () => ({
        startAnalyzerCron: jest.fn()
      }));
      jest.mock('../src/alerting/all_clear', () => ({
        startAllClearCron: jest.fn()
      }));
      jest.mock('../src/env', () => ({
        ENV: { DATABASE_URL: 'mock', REDIS_URL: 'mock' }
      }));
      jest.mock('../src/observability', () => ({
        MetricsTracker: {
          setStatus: jest.fn(),
          setReady: jest.fn()
        }
      }));

      // require will trigger bootstrap
      require('../src/index');

      // Wait a bit for async startBot().catch() to execute
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(exitSpy).toHaveBeenCalledWith(1);
      
      exitSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });
});
