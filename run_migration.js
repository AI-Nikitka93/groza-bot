require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await pool.query(`ALTER TABLE users ALTER COLUMN location TYPE GEOGRAPHY(Point, 4326) USING location::geography;`);
  console.log('Migration applied.');
  process.exit(0);
}
main().catch(console.error);
