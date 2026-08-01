const { Pool } = require('pg');
const { ENV } = require('./dist/env');
const pool = new Pool({ connectionString: ENV.DATABASE_URL });
async function test() {
  const userId = "6297262714";
  const name = 'Основная';
  const checkRes = await pool.query('SELECT id FROM user_locations WHERE user_id = $1 AND name = $2 LIMIT 1', [userId, name]);
  console.log('String userId result:', checkRes.rows);
  
  const checkRes2 = await pool.query('SELECT id FROM user_locations WHERE user_id = $1 AND name = $2 LIMIT 1', [6297262714, name]);
  console.log('Number userId result:', checkRes2.rows);
  pool.end();
}
test();
