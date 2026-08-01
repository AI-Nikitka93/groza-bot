const { Pool } = require('pg');
const { ENV } = require('./dist/env');
const pool = new Pool({ connectionString: ENV.DATABASE_URL });
async function fix() {
  await pool.query('DELETE FROM user_locations WHERE id NOT IN (SELECT MAX(id) FROM user_locations GROUP BY user_id, name);');
  await pool.query('ALTER TABLE user_locations ADD CONSTRAINT unique_user_location UNIQUE (user_id, name);');
  console.log('Cleaned up DB!');
  pool.end();
}
fix();
