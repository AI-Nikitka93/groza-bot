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

    // Создаем таблицу ошибок для логирования сбоев системы
    await client.query(`
      CREATE TABLE IF NOT EXISTS errors (
        id SERIAL PRIMARY KEY,
        source VARCHAR(50) NOT NULL,
        error_type VARCHAR(100),
        message TEXT,
        stack TEXT,
        location GEOGRAPHY(Point, 4326),
        user_id BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // GIST индекс на location
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_errors_location 
      ON errors USING GIST (location);
    `);

    // B-tree индекс на created_at
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_errors_created_at 
      ON errors (created_at);
    `);

    // B-tree индекс на source
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_errors_source 
      ON errors (source);
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

export async function getUserLocation(userId: number): Promise<{ lat: number, lon: number } | null> {
  const query = `
    SELECT ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon
    FROM users
    WHERE id = $1;
  `;
  const res = await pool.query(query, [userId]);
  if (res.rows.length === 0 || res.rows[0].lat == null || res.rows[0].lon == null) {
    return null;
  }
  return {
    lat: Number(res.rows[0].lat),
    lon: Number(res.rows[0].lon)
  };
}

export async function insertErrorLog(
  source: string,
  errorType: string,
  message: string,
  stack?: string,
  lat?: number,
  lon?: number,
  userId?: number
): Promise<void> {
  let locationExpr = 'NULL';
  const params: any[] = [source, errorType, message, stack || null, userId || null];

  if (lat !== undefined && lon !== undefined && lat !== null && lon !== null) {
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new Error('Invalid coordinates provided for error log');
    }
    locationExpr = 'ST_SetSRID(ST_MakePoint($6, $7), 4326)::geography';
    params.push(lon, lat);
  }

  const query = `
    INSERT INTO errors (source, error_type, message, stack, location, user_id)
    VALUES ($1, $2, $3, $4, ${locationExpr}, $5);
  `;
  await pool.query(query, params);
}

export async function getErrorsCount(
  source?: string,
  hours?: number,
  lat?: number,
  lon?: number,
  radiusMeters?: number
): Promise<number> {
  const conditions: string[] = [];
  const params: any[] = [];

  if (hours !== undefined && hours !== null) {
    params.push(hours);
    conditions.push(`created_at >= NOW() - ($${params.length} * INTERVAL '1 hour')`);
  }

  if (source !== undefined && source !== null) {
    params.push(source);
    conditions.push(`source = $${params.length}`);
  }

  if (
    lat !== undefined && lat !== null &&
    lon !== undefined && lon !== null &&
    radiusMeters !== undefined && radiusMeters !== null
  ) {
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new Error('Invalid coordinates provided for error radius filter');
    }
    params.push(lon, lat, radiusMeters);
    const lonIdx = params.length - 2;
    const latIdx = params.length - 1;
    const radIdx = params.length;
    conditions.push(`ST_DWithin(location, ST_SetSRID(ST_MakePoint($${lonIdx}, $${latIdx}), 4326)::geography, $${radIdx})`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT COUNT(*)::integer as count FROM errors ${whereClause};`;
  const res = await pool.query(query, params);
  return res.rows[0].count;
}

export async function getRecentErrors(
  hours?: number,
  limit?: number,
  lat?: number,
  lon?: number,
  radiusMeters?: number
): Promise<any[]> {
  const conditions: string[] = [];
  const params: any[] = [];

  if (hours !== undefined && hours !== null) {
    params.push(hours);
    conditions.push(`created_at >= NOW() - ($${params.length} * INTERVAL '1 hour')`);
  }

  if (
    lat !== undefined && lat !== null &&
    lon !== undefined && lon !== null &&
    radiusMeters !== undefined && radiusMeters !== null
  ) {
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new Error('Invalid coordinates provided for error radius filter');
    }
    params.push(lon, lat, radiusMeters);
    const lonIdx = params.length - 2;
    const latIdx = params.length - 1;
    const radIdx = params.length;
    conditions.push(`ST_DWithin(location, ST_SetSRID(ST_MakePoint($${lonIdx}, $${latIdx}), 4326)::geography, $${radIdx})`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  let limitClause = '';
  if (limit !== undefined && limit !== null) {
    params.push(limit);
    limitClause = `LIMIT $${params.length}`;
  }

  const query = `
    SELECT 
      id, 
      source, 
      error_type, 
      message, 
      stack, 
      ST_Y(location::geometry) as lat, 
      ST_X(location::geometry) as lon, 
      user_id, 
      created_at
    FROM errors
    ${whereClause}
    ORDER BY created_at DESC
    ${limitClause};
  `;
  const res = await pool.query(query, params);
  return res.rows.map(row => ({
    id: row.id,
    source: row.source,
    error_type: row.error_type,
    message: row.message,
    stack: row.stack,
    lat: row.lat !== null ? Number(row.lat) : null,
    lon: row.lon !== null ? Number(row.lon) : null,
    user_id: row.user_id !== null ? Number(row.user_id) : null,
    created_at: row.created_at
  }));
}
