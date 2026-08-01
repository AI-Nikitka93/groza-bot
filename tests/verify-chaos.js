const { execSync, spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

const envPath = '.env';
const envBackupPath = '.env.backup';

function log(msg) {
  console.log(`[CHAOS] ${msg}`);
}

async function requestHealth() {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:3000/health', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.end();
  });
}

async function run() {
  log('Starting Chaos Validation...');

  // Backup .env
  fs.copyFileSync(envPath, envBackupPath);
  let envData = fs.readFileSync(envPath, 'utf8');
  fs.writeFileSync(envPath, envData.replace(/DATABASE_URL=.*/, 'DATABASE_URL=postgres://bad:bad@bad:5432/bad'));
  
  log('Injected BAD Database URL');

  // Start Watchdog
  const child = spawn('node', ['watchdog.js']);
  let logs = [];
  child.stdout.on('data', d => logs.push(d.toString()));
  child.stderr.on('data', d => logs.push(d.toString()));

  // Wait 4 seconds for it to bind port and fail DB, but before exit
  await new Promise(r => setTimeout(r, 4000));

  // Request /health
  const result = await requestHealth();
  log(`Health Check Response: ${JSON.stringify(result)}`);

  // Wait a bit more to observe backoff
  await new Promise(r => setTimeout(r, 4000));

  // Kill watchdog
  child.kill();

  // Restore .env
  fs.copyFileSync(envBackupPath, envPath);
  fs.unlinkSync(envBackupPath);
  log('Restored .env');

  const allLogs = logs.join('');
  if (result.status === 503 && result.data.includes('failed')) {
    log('PASS: Endpoint responded with failed before dying.');
  } else {
    log('FAIL: Endpoint did not respond correctly.');
  }

  if (allLogs.includes('BACKOFF')) {
    log('PASS: Watchdog caught the failure and triggered backoff.');
  }

  console.log('\n--- WATCHDOG LOGS ---');
  console.log(allLogs);
  process.exit(0);
}

run();
