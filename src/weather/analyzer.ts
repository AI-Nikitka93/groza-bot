import * as turf from '@turf/turf';
import type { Feature, Point, Polygon, MultiPolygon } from 'geojson';
import { getRecentStrikes } from '../alerting/store';
import { pool } from '../db/tembo';
import { Redis } from 'ioredis';
import { ENV } from '../env';

const redis = new Redis(ENV.REDIS_URL);

interface StormCellData {
  centroid: Feature<Point>;
  hull: Feature<Polygon | MultiPolygon | Point>;
  strikeCount: number;
}

import * as crypto from 'crypto';

export async function runStormAnalysis() {
  try {
    const strikes = getRecentStrikes();
    // 1. Формируем GeoJSON из недавних молний
    const points = turf.featureCollection(
      strikes.map(s => turf.point([s.lon, s.lat], { timestamp: s.timestamp }))
    );

    if (points.features.length < 5) {
      // Слишком мало молний для кластеризации
      return;
    }

    // 2. Кластеризация DBSCAN (max distance 15 km, min points 5)
    const clustered = turf.clustersDbscan(points, 15, { units: 'kilometers', minPoints: 5 });
    
    // Группируем по ID кластера
    const clustersMap = new Map<number, Feature<Point>[]>();
    
    turf.propEach(clustered, (currentProperties, featureIndex) => {
      if (!currentProperties) return;
      const clusterId = currentProperties.cluster;
      if (clusterId !== undefined) {
        if (!clustersMap.has(clusterId)) {
          clustersMap.set(clusterId, []);
        }
        clustersMap.get(clusterId)!.push(clustered.features[featureIndex] as Feature<Point>);
      }
    });

    const newCells: StormCellData[] = [];

    for (const [clusterId, features] of clustersMap.entries()) {
      const fc = turf.featureCollection(features);
      const centroid = turf.centroid(fc);
      let hull: Feature<Polygon | MultiPolygon | Point>;
      
      try {
        hull = turf.convex(fc) || centroid;
      } catch (e) {
        hull = centroid;
      }
      
      newCells.push({
        centroid,
        hull,
        strikeCount: features.length
      });
    }

    // 3. Вычисление векторов движения (сопоставление с прошлыми ячейками)
    // Забираем активные штормовые ячейки из БД (последние 10 минут)
    const recentDbCellsRes = await pool.query(`
      SELECT id, 
             track_id,
             first_seen_at,
             ST_AsGeoJSON(centroid)::json as centroid_geo, 
             speed_mps, 
             direction_deg, 
             strike_rate,
             EXTRACT(EPOCH FROM (NOW() - created_at)) as age_seconds
      FROM storm_cells 
      WHERE is_active = true AND created_at >= NOW() - INTERVAL '10 minutes'
    `);

    // Отключаем старые
    await pool.query(`UPDATE storm_cells SET is_active = false WHERE created_at < NOW() - INTERVAL '10 minutes'`);

    for (const cell of newCells) {
      let speed_mps = 0;
      let direction_deg = 0;
      let strike_rate = cell.strikeCount; // Упрощенно: удары за текущее окно кэша (15 мин)
      let track_id = crypto.randomUUID();
      let first_seen_at = new Date();

      // Ищем ближайшую прошлую ячейку
      let bestMatch = null;
      let minDistance = Infinity;

      for (const row of recentDbCellsRes.rows) {
        const prevCentroidStr = row.centroid_geo;
        const prevCentroid = prevCentroidStr ? turf.point(prevCentroidStr.coordinates) : null;
        if (prevCentroid) {
          const distKm = turf.distance(prevCentroid, cell.centroid, { units: 'kilometers' });
          if (distKm < 30 && distKm < minDistance) { // Считаем тем же штормом, если центроид сдвинулся < 30 км
            minDistance = distKm;
            bestMatch = row;
          }
        }
      }

      if (bestMatch && minDistance > 0.5) { // Игнорируем микросдвиги (< 500м)
        const timeDiffSeconds = Math.max(1, Math.round(Number(bestMatch.age_seconds) || 60));
        const currentSpeedMps = (minDistance * 1000) / timeDiffSeconds;
        
        // Экспоненциальное скользящее среднее (EMA) для скорости
        const prevSpeed = bestMatch.speed_mps || 0;
        speed_mps = (currentSpeedMps * 0.3) + (prevSpeed * 0.7);

        // Направление (Bearing)
        const prevCentroidStr = bestMatch.centroid_geo;
        const prevCentroid = turf.point(prevCentroidStr.coordinates);
        let bearing = turf.bearing(prevCentroid, cell.centroid);
        if (bearing < 0) bearing += 360;
        direction_deg = bearing;

        track_id = bestMatch.track_id || track_id;
        first_seen_at = bestMatch.first_seen_at ? new Date(bestMatch.first_seen_at) : first_seen_at;
      } else if (bestMatch) {
        speed_mps = bestMatch.speed_mps || 0;
        direction_deg = bestMatch.direction_deg || 0;

        track_id = bestMatch.track_id || track_id;
        first_seen_at = bestMatch.first_seen_at ? new Date(bestMatch.first_seen_at) : first_seen_at;
      }

      // Сохраняем новую ячейку в БД
      const centroidWkt = `POINT(${cell.centroid.geometry.coordinates[0]} ${cell.centroid.geometry.coordinates[1]})`;
      
      let hullWkt = centroidWkt;
      if (cell.hull.geometry.type === 'Polygon') {
        const coords = cell.hull.geometry.coordinates[0].map((c: number[]) => `${c[0]} ${c[1]}`).join(', ');
        hullWkt = `POLYGON((${coords}))`;
      }

      // Вычисляем базовый физический индекс опасности ячейки
      const cellRiskScore = Math.min(100, Math.round((strike_rate * 2) + (speed_mps * 1.5)));

      await pool.query(`
        INSERT INTO storm_cells (centroid, hull, speed_mps, direction_deg, strike_rate, is_active, track_id, first_seen_at, risk_score)
        VALUES (
          ST_SetSRID(ST_GeomFromText($1), 4326)::geography, 
          ST_SetSRID(ST_GeomFromText($2), 4326)::geography, 
          $3, $4, $5, true, $6, $7, $8
        )
      `, [centroidWkt, hullWkt, speed_mps, direction_deg, strike_rate, track_id, first_seen_at.toISOString(), cellRiskScore]);
    }
  } catch (error) {
    console.error('Error running storm analysis:', error);
  }
}

// Запуск анализатора (будет вызываться из index.ts или cron)
export function startAnalyzerCron() {
  setInterval(runStormAnalysis, 60 * 1000); // Каждую минуту
}
