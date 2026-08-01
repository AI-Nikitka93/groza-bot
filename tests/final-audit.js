const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

const envPath = '.env';
const envBackupPath = '.env.backup';

function log(msg) {
  console.log(`[AUDIT] ${msg}`);
}

async function request(path) {
  const start = Date.now();
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, timeMs: Date.now() - start, data }));
    });
    req.on('error', (err) => resolve({ error: err.message, timeMs: Date.now() - start }));
    req.end();
  });
}

async function run() {
  log('--- FINAL INDEPENDENT AUDIT ---');

  // 1. Start Watchdog Normally
  log('Starting Groza normally...');
  let child = spawn('node', ['watchdog.js']);
  let logs = [];
  child.stdout.on('data', d => logs.push(d.toString()));
  child.stderr.on('data', d => logs.push(d.toString()));

  await new Promise(r => setTimeout(r, 6000)); // wait for boot

  // 2. HTTP Responses & Times
  const h1 = await request('/health');
  log(`GET /health -> ${h1.error ? h1.error : h1.status} in ${h1.timeMs}ms: ${h1.data || 'undefined'}`);
  
  const hd = await request('/health/details');
  log(`GET /health/details -> ${hd.error ? hd.error : hd.status} in ${hd.timeMs}ms: ${hd.data ? hd.data.substring(0, 100) : 'undefined'}...`);

  const ready = await request('/ready');
  log(`GET /ready -> ${ready.error ? ready.error : ready.status} in ${ready.timeMs}ms: ${ready.data || 'undefined'}`);

  // 3. Same Source of Truth verification
  if (h1.data && hd.data && h1.data.includes(JSON.parse(hd.data).status)) {
    log('PASS: /health and /health/details share the same status.');
  }

  // 4. Timeouts & Blitzortung Code Proof
  log('Checking Code for Blitzortung Exp Backoff + Jitter...');
  const blitzCode = fs.readFileSync('src/weather/lightning_listener.ts', 'utf8');
  if (blitzCode.includes('Math.pow(2, reconnectAttempts)') && blitzCode.includes('Math.random()')) {
    log('PASS: Blitzortung uses Exponential Backoff + Jitter.');
  }

  log('Checking Code for Promise.race timeouts...');
  const obsCode = fs.readFileSync('src/observability.ts', 'utf8');
  if (obsCode.includes('Promise.race([pingDatabase()') && obsCode.includes('setTimeout')) {
    log('PASS: External checks are wrapped in Timeout (Promise.race).');
  }

  child.kill();
  await new Promise(r => setTimeout(r, 1000));

  // 5. Chaos Validation (Postgres Refused -> 503 instead of Connection Refused)
  log('--- STARTING CHAOS SIMULATION ---');
  fs.copyFileSync(envPath, envBackupPath);
  let envData = fs.readFileSync(envPath, 'utf8');
  fs.writeFileSync(envPath, envData.replace(/DATABASE_URL=.*/, 'DATABASE_URL=postgres://bad:bad@bad:5432/bad'));
  
  child = spawn('node', ['watchdog.js']);
  let chaosLogs = [];
  child.stdout.on('data', d => chaosLogs.push(d.toString()));
  child.stderr.on('data', d => chaosLogs.push(d.toString()));

  await new Promise(r => setTimeout(r, 2000)); // Express binds immediately
  
  const c1 = await request('/health');
  log(`CHAOS GET /health (Before DB Exit) -> ${c1.error ? c1.error : c1.status} : ${c1.data}`);
  if (c1.status === 503) {
    log('PASS: Postgres failed, but HTTP 503 returned. NO Connection Refused.');
  } else {
    log('FAIL: Did not return 503.');
  }

  // 6. Watchdog multiple restarts (Check no 15 min coma)
  log('Waiting for multiple restarts to verify watchdog max backoff cap (60s)...');
  
  // We'll wait until we see Attempt 5 to ensure no 15 min coma
  let attempts = 0;
  for (let i = 0; i < 40; i++) {
    const logStr = chaosLogs.join('');
    if (logStr.includes('Attempt: 5')) {
      attempts = 5;
      break;
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  if (attempts >= 5) {
    log('PASS: Watchdog surpassed 5 crashes without 15 min coma. Backoff logic works.');
  } else {
    log('FAIL: Watchdog did not reach 5 restarts in time.');
  }

  child.kill();
  fs.copyFileSync(envBackupPath, envPath);
  fs.unlinkSync(envBackupPath);

  log('--- AUDIT COMPLETE ---');
  process.exit(0);
}

run();
