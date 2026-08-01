// @ts-nocheck
const { Server } = require('ws');
const { startLightningListener } = require('../src/weather/lightning_listener');

const TEST_PORT = 8089;

jest.mock('ws', () => {
  const actualWs = jest.requireActual('ws');
  
  class MockWebSocket extends actualWs.WebSocket {
    constructor(url, options) {
      super(`ws://localhost:${TEST_PORT}`, options);
      global.wsClientInstance = this;
    }
  }

  return {
    __esModule: true,
    default: MockWebSocket,
    WebSocket: MockWebSocket,
    Server: actualWs.Server,
  };
});

jest.mock('../src/alerting/dispatcher', () => ({
  processStrikesBatch: jest.fn(),
}));
jest.mock('../src/observability', () => ({
  MetricsTracker: { recordStrike: jest.fn() },
}));
jest.mock('../src/alerting/store', () => ({
  addStrikeToStore: jest.fn(),
}));
jest.mock('../src/api', () => ({
  strikeEmitter: { emit: jest.fn() },
}));

describe('Lightning Listener Heartbeat', () => {
  let wss;
  let serverSocket;
  let heartbeatCb;
  let setIntervalSpy;
  let clearIntervalSpy;
  
  beforeAll((done) => {
    wss = new Server({ port: TEST_PORT }, done);
  });
  
  afterAll((done) => {
    if (serverSocket) {
      serverSocket.terminate();
    }
    wss.close(done);
  });
  
  beforeEach(() => {
    // Intercept setInterval to capture the heartbeat callback without breaking real timers
    setIntervalSpy = jest.spyOn(global, 'setInterval').mockImplementation((cb, ms) => {
      if (ms === 30000) {
        heartbeatCb = cb;
        return 999999;
      }
      return Date.now(); // dummy interval ID for batch interval
    });

    clearIntervalSpy = jest.spyOn(global, 'clearInterval').mockImplementation((id) => {
      // do nothing
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should terminate the client connection if no pong is received after 30s', async () => {
    let connectionResolved = false;
    const connectionPromise = new Promise((resolve) => {
      wss.once('connection', (ws) => {
        serverSocket = ws;
        ws._receiver.onping = () => {}; // Disable automatic pong
        connectionResolved = true;
        resolve();
      });
    });

    startLightningListener();

    // Wait for the real connection to establish
    await connectionPromise;

    // Wait for the client to emit 'open' (it happens shortly after connection)
    const clientWs = global.wsClientInstance;
    if (clientWs.readyState !== 1) {
      await new Promise(r => clientWs.once('open', r));
    }

    const terminateSpy = jest.spyOn(clientWs, 'terminate');
    const pingSpy = jest.spyOn(clientWs, 'ping');

    // Simulate first interval tick (30s) -> should send ping and set isAlive = false
    expect(heartbeatCb).toBeDefined();
    heartbeatCb();
    
    expect(pingSpy).toHaveBeenCalled();
    expect(terminateSpy).not.toHaveBeenCalled();

    // Simulate second interval tick (another 30s) -> no pong received, isAlive remains false
    heartbeatCb();
    
    expect(terminateSpy).toHaveBeenCalled();

    // Cleanup to prevent reconnection loops in the background
    clientWs.removeAllListeners('close');
  });
});
