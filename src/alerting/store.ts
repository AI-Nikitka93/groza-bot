export interface Strike {
  lat: number;
  lon: number;
  timestamp: number;
}

// Keep strikes from the last 15 minutes
const MAX_AGE_MS = 15 * 60 * 1000;
let recentStrikes: Strike[] = [];

export function addStrikeToStore(lat: number, lon: number) {
  const now = Date.now();
  recentStrikes.push({ lat, lon, timestamp: now });
  
  // Clean up old strikes periodically or simply filter on read
  if (recentStrikes.length > 5000) { // arbitrary limit to prevent OOM
    recentStrikes = recentStrikes.filter(s => now - s.timestamp < MAX_AGE_MS);
  }
}

export function getRecentStrikes(): Strike[] {
  const now = Date.now();
  // Filter out older than MAX_AGE_MS before returning
  recentStrikes = recentStrikes.filter(s => now - s.timestamp < MAX_AGE_MS);
  return recentStrikes;
}
