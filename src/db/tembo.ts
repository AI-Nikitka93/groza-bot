import { Pool } from 'pg';
import { ENV } from '../env';

export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

export async function initDatabase() {
  const client = await pool.connect();
  try {
    // Убеждаемся, что PostGIS установлен
    await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    
    // Создаем таблицу пользователей с их позицией
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        location GEOMETRY(Point, 4326),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Создаем BRIN индекс для оптимизации гео-запросов 
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_location 
      ON users USING GIST (location);
    `);
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
}

export async function upsertUserLocation(userId: number, lat: number, lon: number) {
  const query = `
    INSERT INTO users (id, location, updated_at)
    VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), CURRENT_TIMESTAMP)
    ON CONFLICT (id) 
    DO UPDATE SET 
      location = EXCLUDED.location,
      updated_at = CURRENT_TIMESTAMP;
  `;
  await pool.query(query, [userId, lon, lat]);
}

export async function findUsersInRadius(lat: number, lon: number, radiusMeters: number) {
  // Ищем пользователей в заданном радиусе (PostGIS ST_DWithin)
  const query = `
    SELECT id
    FROM users
    WHERE ST_DWithin(
      location::geography,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
      $3
    );
  `;
  const res = await pool.query(query, [lon, lat, radiusMeters]);
  return res.rows.map(row => row.id);
}
