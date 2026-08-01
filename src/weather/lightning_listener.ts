import WebSocket from 'ws';
import { processStrikesBatch } from '../alerting/dispatcher';
import { MetricsTracker } from '../observability';
import { addStrikeToStore } from '../alerting/store';
import { strikeEmitter } from '../api';
// Период накопления батча (micro-batching)
const BATCH_INTERVAL_MS = 5000;

let strikesBatch: { lat: number, lon: number }[] = [];
let isBlitzortungConnected = false;

// Custom LZW decoder for new Blitzortung websocket payload
function decodeLZW(e: string): string {
  let t: Record<number, string> = {};
  let n = e.split('');
  let r = n[0], o = r, a = [r], i = 256;
  for (let s = 1; s < n.length; s++) {
    let c = n[s].charCodeAt(0);
    let u = c < 256 ? n[s] : t[c] ? t[c] : o + r;
    a.push(u);
    r = u.charAt(0);
    t[i] = o + r;
    i++;
    o = u;
  }
  return a.join('');
}

export async function pingBlitzortung(): Promise<boolean> {
  return isBlitzortungConnected;
}

const WS_SERVERS = [
  'wss://ws1.blitzortung.org/',
  'wss://ws7.blitzortung.org/',
  'wss://ws8.blitzortung.org/',
  'wss://ws5.blitzortung.org/',
  'wss://ws.blitzortung.org/'
];
let currentServerIndex = Math.floor(Math.random() * WS_SERVERS.length);

export function startLightningListener() {
  console.log('Starting Blitzortung real-time listener (Custom LZW WSS)...');
  let reconnectAttempts = 0;
  let ws: WebSocket;

  function connect() {
    const url = WS_SERVERS[currentServerIndex];
    ws = new WebSocket(url, {
      headers: {
        'Origin': 'https://map.blitzortung.org'
      }
    });

    let pingInterval: NodeJS.Timeout;
    let isAlive = false;

    ws.on('open', () => {
      reconnectAttempts = 0;
      isBlitzortungConnected = true;
      isAlive = true;
      console.log(`Blitzortung connected via WSS to ${url}`);
      
      // Subscribe command payload
      ws.send(JSON.stringify({ a: 111 }));

      // Start Heartbeat
      pingInterval = setInterval(() => {
        if (!isAlive) {
          console.log('Blitzortung WebSocket heartbeat failed. Terminating...');
          ws.terminate();
          return;
        }
        isAlive = false;
        ws.ping();
      }, 30000);
    });

    ws.on('pong', () => {
      isAlive = true;
    });

    ws.on('message', (data: WebSocket.RawData) => {
      isBlitzortungConnected = true;
      try {
        const rawStr = data.toString('utf8');
        const decodedStr = decodeLZW(rawStr);
        const strike = JSON.parse(decodedStr);

        if (strike && strike.lat !== undefined && strike.lon !== undefined) {
          let lat = strike.lat;
          let lon = strike.lon;
          if (strike.latc) lat += strike.latc;
          if (strike.lonc) lon += strike.lonc;

          const ts = Date.now();
          MetricsTracker.recordStrike();
          strikesBatch.push({ lat, lon });
          
          // Instant dispatch for frontend
          addStrikeToStore(lat, lon);
          strikeEmitter.emit('strike', { lat, lon, timestamp: ts });
        }
      } catch (err) {
        // Ignore parse errors for malformed packets
      }
    });

    ws.on('close', () => {
      if (pingInterval) clearInterval(pingInterval);
      isBlitzortungConnected = false;
      const delay = Math.min(30000, Math.pow(2, reconnectAttempts) * 1000) + Math.random() * 1000;
      reconnectAttempts++;
      currentServerIndex = (currentServerIndex + 1) % WS_SERVERS.length;
      
      console.log(`Blitzortung WebSocket closed. Reconnecting to next server in ${Math.round(delay/1000)}s...`);
      setTimeout(connect, delay);
    });

    ws.on('error', (err: Error) => {
      console.log('Blitzortung error:', err.message);
    });
  }

  connect();

  // Запускаем обработку батчей
  setInterval(async () => {
    if (strikesBatch.length === 0) return;
    
    const currentBatch = [...strikesBatch];
    strikesBatch = []; // очищаем буфер

    try {
      await processStrikesBatch(currentBatch);
    } catch (err) {
      console.error('Error processing strikes batch:', err);
    }
  }, BATCH_INTERVAL_MS);
}
