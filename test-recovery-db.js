const { Pool } = require('pg');
const pool = new Pool();

pool.on('error', (err) => {
  console.error('[SUCCESS] Pool error caught by handler:', err.message);
  process.exit(0);
});

console.log('Simulating Postgres connection error...');
pool.emit('error', new Error('Simulated pool error'));
