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
    
    // Создаем таблицу пользователей с их позицией (используя GEOGRAPHY для корректной индексации и масштабирования)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        location GEOGRAPHY(Point, 4326),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Создаем GIST индекс на GEOGRAPHY поле для оптимизации гео-запросов 
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_location 
      ON users USING GIST (location);
    `);

    // Создаем таблицу для долгосрочного хранения ударов молний (статистика за 24 часа)
    await client.query(`
      CREATE TABLE IF NOT EXISTS strikes (
        id SERIAL PRIMARY KEY,
        location GEOGRAPHY(Point, 4326),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Пространственный индекс по координатам молний
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_strikes_location 
      ON strikes USING GIST (location);
    `);

    // Индекс по времени создания для эффективного фильтра по времени (последние 24 часа)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_strikes_created_at 
      ON strikes (created_at);
    `);

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
}

export async function upsertUserLocation(userId: number, lat: number, lon: number) {
  // Валидируем координаты перед записью
  if (lat == null || lon == null || isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error('Invalid coordinates provided for user location upsert');
  }

  const query = `
    INSERT INTO users (id, location, updated_at)
    VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, CURRENT_TIMESTAMP)
    ON CONFLICT (id) 
    DO UPDATE SET 
      location = EXCLUDED.location,
      updated_at = CURRENT_TIMESTAMP;
  `;
  await pool.query(query, [userId, lon, lat]);
}

export async function findUsersInRadiusBatch(strikes: {lat: number, lon: number}[], radiusMeters: number) {
  // Валидация координат для предотвращения падений PostGIS при парсинге
  const validStrikes = strikes.filter(s => 
    typeof s.lat === 'number' && !isNaN(s.lat) && s.lat >= -90 && s.lat <= 90 &&
    typeof s.lon === 'number' && !isNaN(s.lon) && s.lon >= -180 && s.lon <= 180
  );
  if (validStrikes.length === 0) return [];
  
  const multiPointString = `MULTIPOINT(${validStrikes.map(s => `${s.lon} ${s.lat}`).join(', ')})`;
  const query = `
    SELECT DISTINCT id
    FROM users
    WHERE ST_DWithin(
      location,
      ST_GeomFromText($1, 4326)::geography,
      $2
    );
  `;
  const res = await pool.query(query, [multiPointString, radiusMeters]);
  return res.rows.map(row => row.id);
}

export async function getAllUsers(): Promise<{id: number, lat: number, lon: number}[]> {
  const query = `
    SELECT id, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon
    FROM users;
  `;
  const res = await pool.query(query);
  return res.rows;
}

export async function insertStrikesBatch(strikes: {lat: number, lon: number}[]) {
  const validStrikes = strikes.filter(s => 
    typeof s.lat === 'number' && !isNaN(s.lat) && s.lat >= -90 && s.lat <= 90 &&
    typeof s.lon === 'number' && !isNaN(s.lon) && s.lon >= -180 && s.lon <= 180
  );
  if (validStrikes.length === 0) return;

  // Формируем плейсхолдеры для массового инсерта: (ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, CURRENT_TIMESTAMP), ...
  const valueRows = validStrikes.map((_, index) => {
    const base = index * 2;
    return `(ST_SetSRID(ST_MakePoint($${base + 1}, $${base + 2}), 4326)::geography, CURRENT_TIMESTAMP)`;
  }).join(', ');

  const query = `
    INSERT INTO strikes (location, created_at)
    VALUES ${valueRows};
  `;

  const params: number[] = [];
  validStrikes.forEach(s => {
    params.push(s.lon);
    params.push(s.lat);
  });

  await pool.query(query, params);

  // Периодическая очистка молний старше 24 часов (с вероятностью 10%, чтобы не грузить СУБД)
  if (Math.random() < 0.1) {
    pool.query("DELETE FROM strikes WHERE created_at < NOW() - INTERVAL '24 hours'").catch(err => {
      console.error('Error cleaning old strikes:', err);
    });
  }
}

export async function countStrikesNearUser(userId: number, radiusMeters: number = 100000): Promise<number | null> {
  // 1. Получаем местоположение пользователя
  const userRes = await pool.query('SELECT location FROM users WHERE id = $1', [userId]);
  if (userRes.rows.length === 0) return null;
  
  const userLocation = userRes.rows[0].location;
  if (!userLocation) return null;

  // 2. Считаем количество молний за последние 24 часа в радиусе radiusMeters
  const query = `
    SELECT COUNT(*)::integer as count
    FROM strikes
    WHERE ST_DWithin(location, $1, $2)
      AND created_at >= NOW() - INTERVAL '24 hours';
  `;
  const countRes = await pool.query(query, [userLocation, radiusMeters]);
  return countRes.rows[0].count;
}
