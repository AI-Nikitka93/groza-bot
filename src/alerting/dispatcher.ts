import { findUsersInRadiusBatch, insertStrikesBatch, getClosestStormCell } from '../db/tembo';
import { checkRateLimitBatch, redis, memoryCache } from '../cache/upstash';
import { telegramQueue, telegramWorker } from './queue';
import { bot } from '../bot';
import { addStrikeToStore } from './store';
import { ENV } from '../env';
import { AppConfig } from '../config';
import * as turf from '@turf/turf';
import { logTelemetry } from '../qa/telemetry';
import crypto from 'crypto';

// Radius extended to 50km to capture all observation zones
const MAX_RADIUS_METERS = 50000;
const ALERT_COOLDOWN_SEC = 1800; // 30 minutes

type DangerLevel = 'extreme' | 'high' | 'moderate' | 'observation' | 'low';


function isDNDActive(timezone: string, startTime?: string, endTime?: string): boolean {
  if (!startTime || !endTime) return false;
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || 'UTC', hour: 'numeric', minute: 'numeric', hour12: false
    });
    const parts = formatter.formatToParts(new Date());
    const curHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const curMin = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
    
    const currentMinutes = curHour * 60 + curMin;
    const [startH, startM] = startTime.split(':').map(Number);
    const startMinutes = startH * 60 + (startM || 0);
    const [endH, endM] = endTime.split(':').map(Number);
    const endMinutes = endH * 60 + (endM || 0);
    
    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  } catch (e) { return false; }
}

function getRelativeTrajectoryText(stormLat: number, stormLon: number, userLat: number, userLon: number, stormBearing: number): string {
  const stormPoint = turf.point([stormLon, stormLat]);
  const userPoint = turf.point([userLon, userLat]);
  
  let bearingSU = turf.bearing(stormPoint, userPoint);
  if (bearingSU < 0) bearingSU += 360;
  
  let delta = Math.abs(stormBearing - bearingSU);
  if (delta > 180) delta = 360 - delta;
  
  if (delta < 30) return "✅ Грозовой фронт движется в вашу сторону.";
  if (delta > 150) return "✅ Грозовой фронт удаляется от вас.";
  
  let relAngle = bearingSU - stormBearing;
  if (relAngle > 180) relAngle -= 360;
  if (relAngle < -180) relAngle += 360;
  
  let passingBearing = stormBearing + (relAngle > 0 ? -90 : 90);
  if (passingBearing < 0) passingBearing += 360;
  if (passingBearing >= 360) passingBearing -= 360;
  
  let passDir = '';
  if (passingBearing >= 315 || passingBearing < 45) passDir = 'севернее';
  else if (passingBearing >= 45 && passingBearing < 135) passDir = 'восточнее';
  else if (passingBearing >= 135 && passingBearing < 225) passDir = 'южнее';
  else passDir = 'западнее';
  
  return `✅ Грозовой фронт пройдёт ${passDir} вас.`;
}


function generateDynamicMessage(
  level: DangerLevel, 
  distKm: string, 
  density: number, 
  userLat: number,
  userLon: number,
  riskEma: number,
  trend: string,
  confidence: number,
  locationName: string,
  cell?: any
): string {
  const dKm = parseFloat(distKm);

  // UX-Psychology: Hybrid Alert System
  let header = '';
  let warningMessage = '';
  let survivalTrigger = '';
  let isExtreme = false;
  
  if (level === 'extreme' || dKm <= 3) {
    isExtreme = true;
    header = '🔴 ЭКСТРЕМАЛЬНАЯ УГРОЗА ЖИЗНИ';
    if (dKm <= 1.5) {
      warningMessage = '⚡ Шторм прямо над вами! Шутки кончились.';
    } else {
      warningMessage = '⚠️ Приближается крайне опасный штормовой фронт!';
    }
    survivalTrigger = '❗ НЕМЕДЛЕННО НАЙДИТЕ УКРЫТИЕ В КАПИТАЛЬНОМ ЗДАНИИ! ОТОЙДИТЕ ОТ ОКОН! ❗';
  } else if (level === 'high' || dKm <= 10) {
    header = '🟠 КРИТИЧЕСКАЯ ОПАСНОСТЬ';
    warningMessage = 'Удары молний фиксируются в опасной близости от вашей локации.';
    survivalTrigger = '⚠️ Отмените все планы на улице и зайдите в помещение!';
  } else if (level === 'moderate') {
    header = '🟡 ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ';
    warningMessage = 'Наблюдается формирование или приближение грозового фронта.';
    survivalTrigger = '💡 Следите за обновлениями и будьте готовы укрыться.';
  } else {
    header = '🔵 ИНФОРМАЦИОННОЕ СООБЩЕНИЕ';
    warningMessage = 'Гроза далеко, но может двигаться в вашу сторону.';
    survivalTrigger = '💡 Ситуация под контролем, продолжаем наблюдение.';
  }

  let text = `${header}\n📍 Локация: ${locationName}\n⚡ Дистанция до ударов: ${distKm} км`;
  
  if (cell && cell.speed_mps > 0 && cell.direction_deg !== undefined && cell.centroid_lat) {
    const speedKmh = Math.round(cell.speed_mps * 3.6);
    const trajText = getRelativeTrajectoryText(
      cell.centroid_lat, 
      cell.centroid_lon, 
      userLat, 
      userLon, 
      cell.direction_deg
    );
    const distMeters = cell.distance_meters || parseFloat(distKm) * 1000;
    
    if (dKm > 1.5) {
      text += `\n\n${trajText}`;
    }
    if (speedKmh > 5) {
      text += (dKm > 1.5 ? `\n` : `\n\n`) + `💨 Скорость фронта: ${speedKmh} км/ч`;
      const etaMins = Math.round((distMeters / (cell.speed_mps || 1)) / 60);
      if (etaMins > 0 && etaMins < 120 && dKm > 1.5) {
        text += `\n⏳ Расчетное время удара (ETA): ${etaMins} минут`;
      }
    }
  } else if (!cell || cell.speed_mps === 0) {
    if (dKm > 1.5) {
      text += `\n\n✅ Гроза малоподвижна или формируется вблизи вас.`;
    } else {
      text += `\n\n✅ Гроза малоподвижна или формируется прямо над вами.`;
    }
  }

  if (isExtreme) {
    text += `\n\n${warningMessage}\n\n${survivalTrigger}`;
  } else {
    text += `\n\n${warningMessage}\n\n📊 Индекс угрозы: ${riskEma.toFixed(0)}/100 (${trend})\n🎯 Достоверность: ${confidence.toFixed(0)}%\n\n${survivalTrigger}`;
  }
  
  return text;
}
export async function processStrikesBatch(strikes: {lat: number, lon: number}[]) {
  if (strikes.length === 0) return;

  try {
    await insertStrikesBatch(strikes);
  } catch (err) {
    console.error('Error inserting strikes batch to database:', err);
  }

  // addStrikeToStore is now handled instantly in lightning_listener.ts
  
  try {
    const usersWithDistances = await findUsersInRadiusBatch(strikes);
    if (usersWithDistances.length === 0) return;
    
    const groups: Record<DangerLevel, any[]> = {
      extreme: [], high: [], moderate: [], observation: [], low: []
    };

    for (const u of usersWithDistances) {
      if (isDNDActive(u.timezone, u.quiet_hours_start, u.quiet_hours_end)) {
        continue;
      }

      const cell = await getClosestStormCell(u.lat, u.lon);
      if (cell && cell.speed_mps !== undefined) {
        cell.speed_mps = Math.min(cell.speed_mps, 25);
      }
      
      // --- CALCULATE RISK SCORE (Pure Multiplicative) ---
      const maxRadius = AppConfig.riskModel.maxRadiusMeters || 30000;
      const maxDensityScalar = AppConfig.riskModel.maxDensityScalar || 50;
      const fastSpeedKmh = AppConfig.riskModel.fastSpeedKmh || 40;

      // USE CELL DISTANCE IF AVAILABLE: Storm front distance is more accurate than individual strikes
      const effectiveDistance = cell && cell.distance_meters !== undefined ? cell.distance_meters : u.distance;

      // Base factors normalized [0.05..1.0] and [1.0..2.0]
      let distanceFactor = Math.max(0.05, 1 - (effectiveDistance / maxRadius));
      let densityFactor = Math.min(2.0, 1 + (u.recentStrikesCount / maxDensityScalar));

      // Multiplicative combination of base factors with configured exponent weights
      let baseScore = 50 * Math.pow(distanceFactor, AppConfig.riskModel.weights.distance) * Math.pow(densityFactor, AppConfig.riskModel.weights.density);

      let multiplier = 1.0;
      let isDirectlyApproaching = false;
      let hasValidEta = false;

      if (cell && cell.speed_mps > 0 && cell.direction_deg !== undefined) {
        const stormPoint = turf.point([cell.centroid_lon, cell.centroid_lat]);
        const userPoint = turf.point([u.lon, u.lat]);
        let bearingSU = turf.bearing(stormPoint, userPoint);
        if (bearingSU < 0) bearingSU += 360;
        let delta = Math.abs(cell.direction_deg - bearingSU);
        if (delta > 180) delta = 360 - delta;

        if (delta <= 45) {
          multiplier *= AppConfig.riskModel.multipliers.directionDirect;
          isDirectlyApproaching = true;
        } else if (delta >= 135) {
          multiplier *= AppConfig.riskModel.multipliers.directionAway;
        }

        const etaMins = (effectiveDistance / cell.speed_mps) / 60;
        if (etaMins <= 30 && isDirectlyApproaching) {
          multiplier *= AppConfig.riskModel.multipliers.etaImminent;
          hasValidEta = true;
        }
        
        if (cell.speed_mps * 3.6 > fastSpeedKmh) {
          multiplier *= AppConfig.riskModel.multipliers.speedFast;
        }
      } else if (!cell) {
        // Fallback for unclustered or forming storms
        if (u.distance < 15000) {
          multiplier *= 1.2;
          isDirectlyApproaching = true; // Assume danger if very close
        }
      }

      let currentRisk = Math.min(100, baseScore * multiplier);

      // --- HYSTERESIS (EMA) ---
      const emaKey = `risk:ema:${u.userId}`;
      let prevEmaStr = null;
      try {
        prevEmaStr = await redis.get(emaKey);
      } catch(e) {
        // Fallback to memory
        const cachedEma = memoryCache.get(emaKey);
        if (cachedEma !== undefined) prevEmaStr = String(cachedEma);
      }
      let prevEma = prevEmaStr ? parseFloat(prevEmaStr) : currentRisk;
      
      const alpha = AppConfig.riskModel.emaAlpha;
      let riskEma = (currentRisk * alpha) + (prevEma * (1 - alpha));
      try {
        await redis.set(emaKey, riskEma.toFixed(2), 'EX', 1800); // Expires in 30 mins
      } catch(e) {
        // Fallback to memory
        memoryCache.set(emaKey, riskEma);
      }

      // --- TREND ---
      let trendText = '➡️ Стабильная';
      const trendThresh = AppConfig.riskModel.trendThreshold || 3;
      if (riskEma > prevEma + trendThresh) {
        trendText = '↗️ Растет';
        riskEma *= AppConfig.riskModel.multipliers.trendGrowing;
        riskEma = Math.min(100, riskEma);
      } else if (riskEma < prevEma - trendThresh) {
        trendText = '↘️ Снижается';
      }

      // --- CONFIDENCE SCORE ---
      let confidence = 100;
      const baseDeductions = AppConfig.confidenceModel.baseDeduction || { trajectory: 45, age: 50, eta: 50 };
      if (cell && cell.trajectory_variance > 45) confidence -= (baseDeductions.trajectory * AppConfig.confidenceModel.weights.trajectoryStability);
      if (cell && cell.age_minutes < 15) confidence -= (baseDeductions.age * AppConfig.confidenceModel.weights.stormAge);
      if (!cell || !hasValidEta) confidence -= (baseDeductions.eta * AppConfig.confidenceModel.weights.etaValidity);
      confidence = Math.max(0, Math.min(100, confidence));

      // --- ASSIGN DANGER LEVEL ---
      let level: DangerLevel = 'low';
      if (riskEma >= 80) level = 'extreme';
      else if (riskEma >= 60) level = 'high';
      else if (riskEma >= 40) level = 'moderate';
      else if (riskEma >= 20) level = 'observation';

      if (effectiveDistance > 15000 && (level === 'extreme' || level === 'high')) {
        level = 'moderate';
      }


      // Ensure Observation warnings are ONLY sent if moving towards user (Cross-Track check)
      if (level === 'observation' && (!isDirectlyApproaching || u.disable_observation)) {
        level = 'low'; 
      }

      const payload = {
        userId: u.userId, locationId: u.locationId, locationName: u.locationName,
        lat: u.lat, lon: u.lon, distMeters: effectiveDistance, density: u.recentStrikesCount,
        riskEma, trendText, confidence, cell,
        etaMins: (cell && cell.speed_mps > 0) ? (effectiveDistance / cell.speed_mps) / 60 : undefined
      };

      groups[level].push(payload);
    }

    const dispatchAlerts = async (level: DangerLevel) => {
      const groupUsers = groups[level];
      if (groupUsers.length === 0) return;

      const userIds = groupUsers.map(u => u.userId);
      const allowedUsers = await checkRateLimitBatch(userIds, level, ALERT_COOLDOWN_SEC);
      const allowedSet = new Set(allowedUsers);

      for (const u of groupUsers) {
        if (!allowedSet.has(u.userId)) continue;

        const trackId = u.cell?.track_id || 'default_track';
        // 🔒 STAGE 1 DEDUPLICATION: Atomic Redis lock for (userId + locationId + trackId + dangerLevel)
        const tupleDedupKey = `alert:dedup:${u.userId}:${u.locationId}:${trackId}:${level}`;
        
        const now = Date.now();
        const localExpiry = memoryCache.get(tupleDedupKey);
        if (localExpiry && now <= localExpiry) {
           continue; // Deduplicated locally before hitting Redis
        }
        memoryCache.set(tupleDedupKey, now + (ALERT_COOLDOWN_SEC * 1000));

        let isAcquired = false;
        try {
          const res = await redis.set(tupleDedupKey, '1', 'EX', ALERT_COOLDOWN_SEC, 'NX');
          isAcquired = !!res;
        } catch (e) {
          isAcquired = true; // Local memory cache already set, fallback to true
        }
        
        if (!isAcquired) {
          // Alert already dispatched for this specific user, location, storm cell, and danger level!
          continue;
        }

        // Active notification tracking for All Clear service
        const activeKey = `alert:active:${u.userId}:${u.locationId}`;
        const activeExpiry = memoryCache.get(activeKey);
        if (!activeExpiry || now > activeExpiry) {
          memoryCache.set(activeKey, now + (45 * 60 * 1000));
          try {
            await redis.set(activeKey, '1', 'EX', 45 * 60);
            
            // 🔒 STAGE 3 ALL CLEAR: Schedule persistent BullMQ job to monitor when storm leaves
            await telegramQueue.add('check-all-clear', {
              userId: Number(u.userId),
              locationId: u.locationId,
              locationName: u.locationName,
              lat: u.lat,
              lon: u.lon
            }, {
              delay: 20 * 60 * 1000, // Check back in 20 minutes
              jobId: `allclear-${u.userId}-${u.locationId}-${now}`,
              removeOnComplete: true,
              removeOnFail: true
            });
          } catch(e) {
            console.error('Failed to schedule check-all-clear job:', e);
          }
        }

        const distKm = (u.distMeters / 1000).toFixed(1);
        const text = generateDynamicMessage(level, distKm, u.density, u.lat, u.lon, u.riskEma, u.trendText, u.confidence, u.locationName, u.cell);
        
        logTelemetry({
          alert_id: crypto.randomUUID(),
          user_id: u.userId,
          location_id: u.locationId,
          risk_score: u.riskEma,
          confidence_score: u.confidence,
          ETA: u.etaMins,
          distance: u.distMeters,
          direction: u.cell?.direction_deg || 0,
          speed: u.cell?.speed_mps || 0,
          density: u.density,
          trend: u.trendText,
          prediction_timestamp: new Date().toISOString(),
          notification_type: level as any,
          notification_sent: true
        });
        
        const url = `${ENV.WEBAPP_URL}?lat=${u.lat}&lon=${u.lon}&v=${Date.now()}`;
        const reply_markup = {
          inline_keyboard: [
            [{ text: '🔄 Обновить радар', web_app: { url } }],
            [{ text: '📍 Сменить локацию', callback_data: 'change_location' }]
          ]
        };

        // 🔒 STAGE 2 DEDUPLICATION: BullMQ deterministic Job ID prevents queue duplication
        const jobId = `job:${u.userId}:${u.locationId}:${trackId}:${level}`;
        const isDegraded = require('../observability').MetricsTracker.getStatus().status === 'degraded';
        if (isDegraded) {
          try {
            await require('../bot').bot.telegram.sendMessage(u.userId, text, { reply_markup });
          } catch(tgErr) {
             console.error('Failed direct send fallback in degraded mode:', tgErr);
          }
        } else {
          try {
            await telegramQueue.add('alert', { userId: Number(u.userId), text, reply_markup }, { jobId, removeOnComplete: true, removeOnFail: true });
          } catch (queueErr) {
            console.error('Queue error (Fallback to direct send):', queueErr);
            try {
              await require('../bot').bot.telegram.sendMessage(u.userId, text, { reply_markup });
            } catch(tgErr) {
               console.error('Failed direct send fallback:', tgErr);
            }
          }
        }
      }
    };

    await dispatchAlerts('extreme');
    await dispatchAlerts('high');
    await dispatchAlerts('moderate');
    await dispatchAlerts('observation');
    // Low alerts are not dispatched to avoid spam

  } catch (error) {
    console.error('Error in processStrikesBatch:', error);
  }
}
