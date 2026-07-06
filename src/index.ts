import { initDatabase } from './db/tembo';
import { startBot } from './bot';
import { startApiServer } from './api';

import { startLightningListener } from './weather/lightning_listener';

async function bootstrap() {
  console.log('Bootstrapping Groza Single-Worker...');
  
  // 1. Initialize Database & PostGIS
  await initDatabase();
  
  // 2. Start Telegram Bot
  await startBot();
  
  // 3. Start real-time Blitzortung listener
  startLightningListener();
  
  // 4. Start API Server (Static Frontend + /api/strikes)
  startApiServer();
  
  console.log('Groza Single-Worker is running.');
}

bootstrap().catch(console.error);
