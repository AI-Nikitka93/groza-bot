import WebSocket from 'ws';
import { processStrike } from '../alerting/dispatcher';

// URL for Blitzortung WebSocket (Example WS endpoint, usually dynamic, keeping placeholder)
const BLITZORTUNG_WS_URL = 'wss://ws.blitzortung.org:3000/';

let ws: WebSocket;

export function startBlitzortungListener() {
  console.log('Starting Blitzortung WebSocket listener...');
  
  // The actual URL might need to be resolved via their API in a real implementation
  // For the sake of the proxy architecture, we connect to the known WSS endpoint
  ws = new WebSocket(BLITZORTUNG_WS_URL);

  ws.on('open', () => {
    console.log('Connected to Blitzortung WebSocket.');
    // Keep-alive or subscribe message if required
    ws.send(JSON.stringify({ a: 111 })); // Typical auth/init frame for Blitzortung
  });

  ws.on('message', async (data) => {
    try {
      const message = data.toString();
      const strike = JSON.parse(message);
      
      // Expected Blitzortung strike format has 'lat' and 'lon'
      if (strike && strike.lat && strike.lon) {
        // Dispatch to alerting engine
        await processStrike(strike.lat, strike.lon);
      }
    } catch (e) {
      // Handle parsing errors silently as it might be a binary ping/pong
    }
  });

  ws.on('error', (err) => {
    console.error('Blitzortung WS Error:', err);
  });

  ws.on('close', () => {
    console.log('Blitzortung WS closed. Reconnecting in 5s...');
    setTimeout(startBlitzortungListener, 5000);
  });
}
