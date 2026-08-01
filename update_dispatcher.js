const fs = require('fs');

let content = fs.readFileSync('src/alerting/dispatcher.ts', 'utf8');

// 1. Add telemetry import
content = content.replace("import * as turf from '@turf/turf';", "import * as turf from '@turf/turf';\nimport { logTelemetry } from '../qa/telemetry';\nimport crypto from 'crypto';");

// 2. Change DangerLevel
content = content.replace("type DangerLevel = 'extreme' | 'high' | 'observation' | 'low';", "type DangerLevel = 'extreme' | 'high' | 'moderate' | 'observation' | 'low';");

// 3. Add isDNDActive
const dndFunc = `
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
`;
content = content.replace("function getRelativeTrajectoryText", dndFunc + "\nfunction getRelativeTrajectoryText");

// 4. Update UI generator
const uiFunc = `
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
  let header = '';
  let rec = '';
  switch(level) {
    case 'extreme': header = '🔴 **Критическая опасность**'; rec = 'Немедленно найдите укрытие!'; break;
    case 'high': header = '🟠 **Высокая опасность**'; rec = 'Отмените планы на улице и зайдите в помещение.'; break;
    case 'moderate': header = '🟡 **Умеренная опасность**'; rec = 'Будьте готовы к ухудшению погоды.'; break;
    case 'observation': header = '🔵 **Наблюдение**'; rec = 'Гроза далеко, но движется в вашу сторону. Ситуация может измениться.'; break;
    default: header = '🟢 **Низкая опасность**'; rec = ''; break;
  }

  let text = \`\${header}\\n📍 Локация: \${locationName}\\n⚡ Расстояние: \${distKm} км\n\`;
  
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
    
    text += \`\\n\${trajText}\`;
    if (speedKmh > 5) {
      text += \`\\n💨 Скорость фронта: \${speedKmh} км/ч\`;
      const etaMins = Math.round((distMeters / (cell.speed_mps || 1)) / 60);
      if (etaMins > 0 && etaMins < 120) {
        text += \`\\n⏳ До начала грозы примерно: \${etaMins} минут\`;
      }
    }
  } else if (!cell || cell.speed_mps === 0) {
    text += \`\\n\\n✅ Гроза малоподвижна или формируется.\`;
  }

  text += \`\\n\\n📊 Индекс опасности: \${riskEma.toFixed(0)}/100 (\${trend})\\n🎯 Уверенность прогноза: \${confidence.toFixed(0)}%\\n\\n💡 Рекомендация: \${rec}\`;
  return text;
}
`;
const oldUiFuncStart = content.indexOf("function generateDynamicMessage");
const oldUiFuncEnd = content.indexOf("export async function processStrikesBatch");
content = content.substring(0, oldUiFuncStart) + uiFunc + content.substring(oldUiFuncEnd);

// 5. Update logic inside processStrikesBatch
const logicMatch = `const usersWithDistances = await findUsersInRadiusBatch(strikes, MAX_RADIUS_METERS);`;
content = content.replace(logicMatch, `const usersWithDistances = await findUsersInRadiusBatch(strikes);`);

const groupsMatch = `const groups: Record<DangerLevel, any[]> = {
      extreme: [], high: [], observation: [], low: []
    };`;
content = content.replace(groupsMatch, `const groups: Record<DangerLevel, any[]> = {
      extreme: [], high: [], moderate: [], observation: [], low: []
    };`);

const forLoopMatch = `for (const u of usersWithDistances) {
      const cell = await getClosestStormCell(u.lat, u.lon);`;
const forLoopRepl = `for (const u of usersWithDistances) {
      if (isDNDActive(u.timezone, u.quiet_hours_start, u.quiet_hours_end)) {
        continue;
      }

      const cell = await getClosestStormCell(u.lat, u.lon);`;
content = content.replace(forLoopMatch, forLoopRepl);

const levelMatch = `      let level: DangerLevel = 'low';
      if (riskEma >= 80) level = 'extreme';
      else if (riskEma >= 60) level = 'high';
      else if (riskEma >= 30) level = 'observation';`;
const levelRepl = `      let level: DangerLevel = 'low';
      if (riskEma >= 80) level = 'extreme';
      else if (riskEma >= 60) level = 'high';
      else if (riskEma >= 40) level = 'moderate';
      else if (riskEma >= 20) level = 'observation';`;
content = content.replace(levelMatch, levelRepl);

const obsCheckMatch = `      if (level === 'observation' && !isDirectlyApproaching) {
        level = 'low'; 
      }`;
const obsCheckRepl = `      if (level === 'observation' && (!isDirectlyApproaching || u.disable_observation)) {
        level = 'low'; 
      }`;
content = content.replace(obsCheckMatch, obsCheckRepl);

const payloadMatch = `const payload = {
        userId: u.userId, lat: u.lat, lon: u.lon, distMeters: u.distance, density: u.recentStrikesCount,
        riskEma, trendText, confidence, cell
      };`;
const payloadRepl = `const payload = {
        userId: u.userId, locationId: u.locationId, locationName: u.locationName,
        lat: u.lat, lon: u.lon, distMeters: u.distance, density: u.recentStrikesCount,
        riskEma, trendText, confidence, cell,
        etaMins: (cell && cell.speed_mps > 0) ? (u.distance / cell.speed_mps) / 60 : undefined
      };`;
content = content.replace(payloadMatch, payloadRepl);


const dispatchMatch = `const dispatchAlerts = async (level: DangerLevel) => {
      const groupUsers = groups[level];`;
const dispatchRepl = `const dispatchAlerts = async (level: DangerLevel) => {
      const groupUsers = groups[level];`;
// No change to signature, but we need to change how redis and generator are called

const loopMatch = `for (const u of groupUsers) {
        if (allowedSet.has(u.userId)) {
          await redis.set(\`alert:active:\${u.userId}\`, '1', 'EX', 45 * 60);

          const distKm = (u.distMeters / 1000).toFixed(1);
          const text = generateDynamicMessage(level, distKm, u.density, u.lat, u.lon, u.riskEma, u.trendText, u.confidence, u.cell);`;
          
const loopRepl = `for (const u of groupUsers) {
        if (allowedSet.has(u.userId)) {
          await redis.set(\`alert:active:\${u.userId}:\${u.locationId}\`, '1', 'EX', 45 * 60);

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
          });`;
content = content.replace(loopMatch, loopRepl);

const finalDispatchMatch = `await dispatchAlerts('extreme');
    await dispatchAlerts('high');
    await dispatchAlerts('observation');`;
const finalDispatchRepl = `await dispatchAlerts('extreme');
    await dispatchAlerts('high');
    await dispatchAlerts('moderate');
    await dispatchAlerts('observation');`;
content = content.replace(finalDispatchMatch, finalDispatchRepl);


fs.writeFileSync('src/alerting/dispatcher.ts', content);
