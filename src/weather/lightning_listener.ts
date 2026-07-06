import { Client, Strike } from '@simonschick/blitzortungapi';
import WebSocket from 'ws';
import { processStrikesBatch } from '../alerting/dispatcher';

// Период накопления батча (micro-batching)
const BATCH_INTERVAL_MS = 5000;

let strikesBatch: { lat: number, lon: number }[] = [];

export function startLightningListener() {
  console.log('Starting Blitzortung real-time listener...');
  const client = new Client({ make: (url: string) => {
    const ws = new WebSocket(url);
    ws.on('close', () => {
      console.log('Blitzortung WebSocket closed. Reconnecting in 5 seconds...');
      setTimeout(() => {
        try {
          client.connect('wss://ws1.blitzortung.org/');
        } catch (e) {
          console.error('Reconnect failed', e);
        }
      }, 5000);
    });
    return ws as any;
  }});
  client.on('data', (strike: Strike) => {
    if (strike?.location) {
      strikesBatch.push({ lat: strike.location.latitude, lon: strike.location.longitude });
    }
  });

  client.on('connect', () => {
    console.log('Blitzortung connected');
  });

  client.on('error', (err: Error) => {
    console.log('Blitzortung error', err);
  });

  // В новых версиях API сервер на порту 3000 часто недоступен, пробуем напрямую wss (порт 443)
  client.connect('wss://ws1.blitzortung.org/');

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
