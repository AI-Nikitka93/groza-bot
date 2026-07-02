"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.initDatabase = initDatabase;
exports.upsertUserLocation = upsertUserLocation;
exports.findUsersInRadius = findUsersInRadius;
const pg_1 = require("pg");
const env_1 = require("../env");
exports.pool = new pg_1.Pool({
    connectionString: env_1.ENV.DATABASE_URL,
    ssl: env_1.ENV.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});
async function initDatabase() {
    const client = await exports.pool.connect();
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
    }
    catch (error) {
        console.error('Error initializing database:', error);
    }
    finally {
        client.release();
    }
}
async function upsertUserLocation(userId, lat, lon) {
    const query = `
    INSERT INTO users (id, location, updated_at)
    VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), CURRENT_TIMESTAMP)
    ON CONFLICT (id) 
    DO UPDATE SET 
      location = EXCLUDED.location,
      updated_at = CURRENT_TIMESTAMP;
  `;
    await exports.pool.query(query, [userId, lon, lat]);
}
async function findUsersInRadius(lat, lon, radiusMeters) {
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
    const res = await exports.pool.query(query, [lon, lat, radiusMeters]);
    return res.rows.map(row => row.id);
}
//# sourceMappingURL=tembo.js.map