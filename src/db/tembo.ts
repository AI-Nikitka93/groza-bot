import { Pool } from 'pg';
import { ENV } from '../env';

export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => { console.error('Unexpected DB Error:', err); });

export async function initDatabase() {
  const client = await pool.connect();
  try {
    // Убеждаемся, что PostGIS установлен
    await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    
    // Создаем таблицу пользователей
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        timezone VARCHAR(50) DEFAULT 'UTC',
        quiet_hours_start TIME,
        quiet_hours_end TIME,
        disable_observation BOOLEAN DEFAULT false,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    try {
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC',
        ADD COLUMN IF NOT EXISTS quiet_hours_start TIME,
        ADD COLUMN IF NOT EXISTS quiet_hours_end TIME,
        ADD COLUMN IF NOT EXISTS disable_observation BOOLEAN DEFAULT false;
      `);
    } catch (e: any) {
      console.log('Alter users failed or not needed:', e.message);
    }

    // Создаем таблицу для локаций пользователей
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_locations (
        id SERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        location GEOGRAPHY(Point, 4326) NOT NULL,
        alert_radius INTEGER DEFAULT 15000,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_location UNIQUE (user_id, name)
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_locations_location 
      ON user_locations USING GIST (location);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_locations_user_id 
      ON user_locations (user_id);
    `);

    try {
      await client.query(`
        INSERT INTO user_locations (user_id, name, location)
        SELECT id, 'Основная', location FROM users WHERE location IS NOT NULL
        ON CONFLICT (user_id, name) DO NOTHING;
      `);
    } catch (e: any) {
      console.log('Data migration to user_locations failed or not needed:', e.message);
    }

    // Создаем таблицу для долгосрочного хранения ударов молний (статистика за 24 часа)
    await client.query(`
      CREATE TABLE IF NOT EXISTS strikes (
        id SERIAL PRIMARY KEY,
        location GEOGRAPHY(Point, 4326),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Создаем таблицу для хранения кластеров штормовых ячеек (Storm Cells)
    await client.query(`
      CREATE TABLE IF NOT EXISTS storm_cells (
        id SERIAL PRIMARY KEY,
        track_id UUID,
        centroid GEOGRAPHY(Point, 4326),
        hull GEOGRAPHY(Polygon, 4326),
        speed_mps REAL,
        direction_deg REAL,
        strike_rate REAL,
        risk_score REAL,
        is_active BOOLEAN DEFAULT true,
        first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    try {
      await client.query(`
        ALTER TABLE storm_cells 
        ADD COLUMN IF NOT EXISTS track_id UUID,
        ADD COLUMN IF NOT EXISTS first_seen_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS risk_score REAL;
      `);
    } catch (e: any) {
      console.log('Alter storm_cells failed or not needed:', e.message);
    }

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_storm_cells_track_id 
      ON storm_cells(track_id);
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

    // Пространственные индексы для штормовых ячеек
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_storm_cells_centroid 
      ON storm_cells USING GIST (centroid);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_storm_cells_hull 
      ON storm_cells USING GIST (hull);
    `);

    // Индекс по активности и времени для быстрой выборки активных штормов
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_storm_cells_active_created 
      ON storm_cells (is_active, created_at DESC);
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
    throw error;
  } finally {
    client.release();
  }
}

export async function pingDatabase(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT 1 as ping');
    return res.rows[0].ping === 1;
  } catch (error) {
    return false;
  }
}

export async function upsertUserLocation(userId: number, lat: number, lon: number, name: string = 'Основная', radiusMeters: number = 50000) {
  // Валидируем координаты перед записью
  if (lat == null || lon == null || isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error('Invalid coordinates provided for user location upsert');
  }

  // Создаем юзера если нет
  const userQuery = `
    INSERT INTO users (id, updated_at)
    VALUES ($1, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP;
  `;
  await pool.query(userQuery, [userId]);

  // Проверяем существование локации с таким именем у пользователя
  const checkRes = await pool.query('SELECT id FROM user_locations WHERE user_id = $1 AND name = $2 LIMIT 1', [userId, name]);
  
  if (checkRes.rows.length > 0) {
    await pool.query(`
      UPDATE user_locations 
      SET location = ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, alert_radius = $5
      WHERE user_id = $1 AND name = $2;
    `, [userId, name, lon, lat, radiusMeters]);
  } else {
    await pool.query(`
      INSERT INTO user_locations (user_id, name, location, alert_radius, created_at)
      VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, CURRENT_TIMESTAMP);
    `, [userId, name, lon, lat, radiusMeters]);
  }
}

export async function getUserLocations(userId: number): Promise<{ id: number, name: string, lat: number, lon: number }[]> {
  const query = `
    SELECT id, name, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lon
    FROM user_locations
    WHERE user_id = $1
    ORDER BY created_at ASC;
  `;
  const res = await pool.query(query, [userId]);
  return res.rows.map(r => ({
    id: r.id,
    name: r.name,
    lat: Number(r.lat),
    lon: Number(r.lon)
  }));
}

export async function deleteUserLocation(userId: number, locationId: number): Promise<boolean> {
  const res = await pool.query('DELETE FROM user_locations WHERE user_id = $1 AND id = $2', [userId, locationId]);
  return (res.rowCount || 0) > 0;
}

const usersInRadiusCache = new Map<string, { expire: number, data: any[] }>();

export async function findUsersInRadiusBatch(strikes: {lat: number, lon: number}[]): Promise<any[]> {
  // Валидация координат для предотвращения падений PostGIS при парсинге
  const validStrikes = strikes.filter(s => 
    typeof s.lat === 'number' && !isNaN(s.lat) && s.lat >= -90 && s.lat <= 90 &&
    typeof s.lon === 'number' && !isNaN(s.lon) && s.lon >= -180 && s.lon <= 180
  );
  if (validStrikes.length === 0) return [];
  
  const multiPointString = `MULTIPOINT(${validStrikes.map(s => `${s.lon} ${s.lat}`).join(', ')})`;
  
  // Local LRU cache check
  const cacheKey = validStrikes.map(s => `${s.lat.toFixed(2)}:${s.lon.toFixed(2)}`).sort().join('|');
  const now = Date.now();
  const cached = usersInRadiusCache.get(cacheKey);
  if (cached && now < cached.expire) {
    return cached.data;
  }

  const query = `
    WITH batch AS (
      SELECT ST_GeomFromText($1, 4326)::geography AS geom
    )
    SELECT 
      u.id AS "userId",
      ul.id AS "locationId",
      ul.name AS "locationName",
      u.timezone,
      u.quiet_hours_start,
      u.quiet_hours_end,
      u.disable_observation,
      ul.alert_radius,
      ST_Y(ul.location::geometry) AS lat,
      ST_X(ul.location::geometry) AS lon,
      ST_Distance(ul.location, b.geom) AS distance,
      (
        SELECT COUNT(*)
        FROM strikes s
        WHERE ST_DWithin(ul.location, s.location, 30000)
          AND s.created_at >= NOW() - INTERVAL '15 minutes'
      ) AS "recentStrikesCount"
    FROM users u
    JOIN user_locations ul ON u.id = ul.user_id
    CROSS JOIN batch b
    WHERE ST_DWithin(ul.location, b.geom, ul.alert_radius);
  `;
  const res = await pool.query(query, [multiPointString]);
  const mappedRes = res.rows.map(row => ({
    userId: row.userId.toString(),
    locationId: row.locationId,
    locationName: row.locationName,
    timezone: row.timezone,
    quiet_hours_start: row.quiet_hours_start,
    quiet_hours_end: row.quiet_hours_end,
    disable_observation: row.disable_observation,
    alert_radius: row.alert_radius,
    lat: Number(row.lat),
    lon: Number(row.lon),
    distance: Number(row.distance),
    recentStrikesCount: Number(row.recentStrikesCount)
  }));
  
  // LRU cache maintenance
  if (usersInRadiusCache.size > 1000) {
    const oldestKey = usersInRadiusCache.keys().next().value;
    if (oldestKey !== undefined) usersInRadiusCache.delete(oldestKey);
  }
  usersInRadiusCache.set(cacheKey, { expire: now + 60000, data: mappedRes });
  
  return mappedRes;
}

export async function getAllUsers(): Promise<{id: number, lat: number, lon: number}[]> {
  const query = `
    SELECT ul.user_id as id, ST_Y(ul.location::geometry) as lat, ST_X(ul.location::geometry) as lon
    FROM user_locations ul;
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
  // 1. Получаем местоположение пользователя (берем 'Основная' или первую попавшуюся)
  const userRes = await pool.query('SELECT location FROM user_locations WHERE user_id = $1 LIMIT 1', [userId]);
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
    FROM user_locations
    WHERE user_id = $1
    LIMIT 1;
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

export async function getClosestStormCell(lat: number, lon: number): Promise<any | null> {
  const query = `
    WITH latest_cell AS (
      SELECT 
        id, track_id, centroid, speed_mps, direction_deg, strike_rate, risk_score, first_seen_at, created_at,
        ST_Distance(centroid, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance_meters,
        ST_X(centroid::geometry) as centroid_lon,
        ST_Y(centroid::geometry) as centroid_lat
      FROM storm_cells
      WHERE is_active = true
      ORDER BY centroid <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      LIMIT 1
    ),
    cell_history AS (
      SELECT 
        track_id,
        EXTRACT(EPOCH FROM (MAX(created_at) - MIN(first_seen_at))) / 60.0 AS age_minutes,
        COALESCE(STDDEV(direction_deg), 0) AS trajectory_variance,
        ARRAY_AGG(ST_AsGeoJSON(centroid)::json ORDER BY created_at ASC) as historical_centroids,
        ARRAY_AGG(risk_score ORDER BY created_at ASC) as historical_scores
      FROM storm_cells
      WHERE track_id = (SELECT track_id FROM latest_cell)
        AND created_at >= NOW() - INTERVAL '1 hour'
      GROUP BY track_id
    )
    SELECT 
      l.*,
      COALESCE(h.age_minutes, 0) as age_minutes,
      COALESCE(h.trajectory_variance, 0) as trajectory_variance,
      COALESCE(h.historical_centroids, ARRAY[]::json[]) as historical_centroids,
      COALESCE(h.historical_scores, ARRAY[]::real[]) as historical_scores
    FROM latest_cell l
    LEFT JOIN cell_history h ON l.track_id = h.track_id;
  `;
  const res = await pool.query(query, [lon, lat]);
  if (res.rows.length === 0) return null;
  return res.rows[0];
}

