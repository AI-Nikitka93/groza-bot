const { Pool } = require('pg');
const { Queue } = require('bullmq');
const Redis = require('ioredis');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = new Redis(process.env.REDIS_URL);
const queue = new Queue('telegram-queue', { connection: redis });

async function checkStats() {
    try {
        const res = await pool.query('SELECT count(*) FROM strikes');
        console.log('PostgreSQL Strikes Count: ' + res.rows[0].count);
        
        const counts = await queue.getJobCounts();
        console.log('BullMQ Job Counts: ', counts);
    } catch(err) {
        console.error('Stats Error:', err);
    } finally {
        await pool.end();
        await redis.quit();
    }
}
checkStats();
