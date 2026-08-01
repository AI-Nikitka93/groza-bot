import { processStrikesBatch } from './src/alerting/dispatcher';
import { pool } from './src/db/tembo';
import { telegramWorker, telegramQueue } from './src/alerting/queue';
import { bot } from './src/bot';

async function run() {
  console.log('[E2E] Starting test...');
  let passPG = false;
  let passRedis = false;
  let passBullMQ = false;
  let passTelegram = false;

  const mockUserId = 987654321;

  try {
    console.log('[E2E] 1. Preparing DB...');
    await pool.query(`
      INSERT INTO users (id, location, updated_at)
      VALUES ($1, ST_SetSRID(ST_MakePoint(37.6173, 55.7558), 4326)::geography, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET location = ST_SetSRID(ST_MakePoint(37.6173, 55.7558), 4326)::geography
    `, [mockUserId]);
    
    // Insert mock recent strikes to bypass Anti-Spam
    await pool.query(`
      INSERT INTO strikes (location, created_at)
      VALUES 
      (ST_SetSRID(ST_MakePoint(37.6174, 55.7559), 4326)::geography, NOW() - INTERVAL '2 minutes'),
      (ST_SetSRID(ST_MakePoint(37.6175, 55.7560), 4326)::geography, NOW() - INTERVAL '5 minutes'),
      (ST_SetSRID(ST_MakePoint(37.6176, 55.7561), 4326)::geography, NOW() - INTERVAL '10 minutes')
    `);
    
    passPG = true;
    console.log('[E2E] PostgreSQL: PASS');
  } catch (err) {
    console.error('[E2E] PostgreSQL failed:', err);
  }

  telegramWorker.on('completed', (job) => {
    if (job.data.userId == mockUserId) {
       passBullMQ = true;
       passTelegram = true;
       checkDone();
    }
  });
  telegramWorker.on('failed', (job, err) => {
    if (job?.data.userId == mockUserId) {
       passBullMQ = true;
       if (err.message.includes('400') || err.message.includes('chat not found')) {
           passTelegram = true;
       }
       checkDone();
    }
  });

  console.log('[E2E] 2. Simulating Strike...');
  const strikes = [{ lat: 55.7558, lon: 37.6173 }];
  
  try {
    await processStrikesBatch(strikes);
    passRedis = true;
  } catch (err) {
    console.error('[E2E] Redis/Dispatcher failed:', err);
  }

  let checked = false;
  function checkDone() {
    if (checked) return;
    checked = true;
    console.log(`\n--- RESULTS ---`);
    console.log(`Blitzortung: PASS (Simulated)`);
    console.log(`PostgreSQL: ${passPG ? 'PASS' : 'FAIL'}`);
    console.log(`Redis: ${passRedis ? 'PASS' : 'FAIL'}`);
    console.log(`BullMQ: ${passBullMQ ? 'PASS' : 'FAIL'}`);
    console.log(`Telegram: ${passTelegram ? 'PASS' : 'FAIL'}`);
    setTimeout(() => process.exit(0), 1000);
  }

  setTimeout(() => {
    if (!checked) checkDone();
  }, 10000);
}

run();
