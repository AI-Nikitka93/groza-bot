import { initDatabase } from './db/tembo';
import { startBlitzortungListener } from './blitzortung/listener';
import { startBot } from './bot';
import { startApiServer } from './api';

async function bootstrap() {
  console.log('Bootstrapping Groza Single-Worker...');
  
  // 1. Initialize Database & PostGIS
  await initDatabase();
  
  // 2. Start Telegram Bot
  await startBot();
  
  // 3. Start Blitzortung WS Proxy listener
  startBlitzortungListener();
  
  // 4. Start API Server (Static Frontend + /api/strikes)
  startApiServer();
  
  console.log('Groza Single-Worker is running.');
}

bootstrap().catch(console.error);
