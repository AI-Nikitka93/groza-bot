require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const tables = ['users', 'strikes', 'errors'];
  for (const table of tables) {
    console.log(`\nTable: ${table}`);
    const res = await pool.query(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = $1;
    `, [table]);
    console.log(res.rows.find(r => r.column_name === 'location'));
  }
  process.exit(0);
}
main().catch(console.error);
