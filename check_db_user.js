const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  const res = await client.query('SELECT updated_at FROM users WHERE id = $1', [6297262714]);
  console.log("DB Result updated_at:", res.rows);
  await client.end();
}
run().catch(console.error);
