// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Ensure the map resizes when Telegram WebApp expands or keyboard opens
tg.onEvent('viewportChanged', () => {
  if (map) map.resize();
});
window.addEventListener('resize', () => {
  if (map) map.resize();
});
// Токены цветов из DESIGN.md
const COLORS = {
  warning: '#FFEA00',
  critical: '#FF7575',
  bg: '#0C0D10'
};

// Состояние
let userLocation = [37.6173, 55.7558]; // По умолчанию (Москва)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('lat') && urlParams.has('lon')) {
  userLocation = [parseFloat(urlParams.get('lon')), parseFloat(urlParams.get('lat'))];
}
let map;

function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    // Свободный векторный стиль CartoDB Dark Matter
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: userLocation,
    zoom: 12,
    attributionControl: false
  });

  map.on('load', () => {
    // Пользовательский маркер
    map.addSource('user-location', {
      type: 'geojson',
      data: getGeoJSONPoint(userLocation)
    });

    map.addLayer({
      id: 'user-marker',
      type: 'circle',
      source: 'user-location',
      paint: {
        'circle-radius': 6,
        'circle-color': '#FFFFFF',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#4285F4'
      }
    });

    // Источник данных для молний
    map.addSource('strikes', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });

    // Неоновое свечение (Halo) - Динамическое, зависит от возраста молнии
    map.addLayer({
      id: 'strikes-halo',
      type: 'circle',
      source: 'strikes',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['get', 'age'],
          0, 15,       // Fresh strike = 15px
          1000, 8,     // 1 second old = 8px
          60000, 4     // 1 minute old = 4px
        ],
        'circle-color': [
          'interpolate', ['linear'], ['get', 'age'],
          0, '#FFFFFF',        // White flash initially
          500, COLORS.warning, // Yellow after 0.5s
          1500, COLORS.critical, // Red after 1.5s
          300000, '#660000'    // Dark red after 5 mins
        ],
        'circle-opacity': [
          'interpolate', ['linear'], ['get', 'age'],
          0, 1,
          5000, 0.5,
          900000, 0.1
        ],
        'circle-blur': 1
      }
    });

    // Сама точка молнии
    map.addLayer({
      id: 'strikes-core',
      type: 'circle',
      source: 'strikes',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['get', 'age'],
          0, 4,
          2000, 2,
          60000, 1
        ],
        'circle-color': '#FFFFFF',
        'circle-opacity': [
          'interpolate', ['linear'], ['get', 'age'],
          0, 1,
          30000, 0.8,
          900000, 0.0
        ]
      }
    });

    drawSafetyRings();
    initRainViewer();
    startStrikesPolling();
  });
}

let allStrikesMap = new Map();
let isAnimating = false;

function updateMapFeatures() {
  if (!map.getSource('strikes')) return;
  const now = Date.now();
  const features = [];
  
  for (const [id, s] of allStrikesMap.entries()) {
    // If it's a new strike, set its receivedAt to now so it animates from 0
    if (!s.receivedAt) {
      s.receivedAt = now;
    }
    
    const age = now - s.receivedAt;
    
    // Cleanup old strikes locally after 15 minutes
    if (age > 15 * 60 * 1000) {
      allStrikesMap.delete(id);
      continue;
    }
    
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [s.lon, s.lat] },
      properties: { age: age }
    });
  }
  
  map.getSource('strikes').setData({ type: 'FeatureCollection', features });
}

function animateStrikes() {
  updateMapFeatures();
  requestAnimationFrame(animateStrikes);
}

function decodeLZW(e) {
  let t = {};
  let n = e.split('');
  let r = n[0], o = r, a = [r], i = 256;
  for (let s = 1; s < n.length; s++) {
    let c = n[s].charCodeAt(0);
    let u = c < 256 ? n[s] : t[c] ? t[c] : o + r;
    a.push(u);
    r = u.charAt(0);
    t[i] = o + r;
    i++;
    o = u;
  }
  return a.join('');
}

function startStrikesPolling() {
  // 1. Initial load for the past 15 minutes
  fetch('/api/strikes').then(res => res.json()).then(data => {
    if (data && data.strikes) {
      data.strikes.forEach(s => {
        const id = `${s.lat}-${s.lon}-${s.timestamp}`;
        if (!allStrikesMap.has(id)) {
          allStrikesMap.set(id, s);
        }
      });
      if (!isAnimating) {
        isAnimating = true;
        animateStrikes();
      }
    }
  }).catch(e => console.error('Failed to fetch historical strikes', e));

  // 2. Real-time SSE from our own backend (bypassing Blitzortung IP blocks)
  const evtSource = new EventSource('/api/strikes/stream');
  evtSource.onmessage = (event) => {
    try {
      const strike = JSON.parse(event.data);
      if (strike && strike.lat !== undefined && strike.lon !== undefined) {
        const now = Date.now();
        strike.receivedAt = now;
        const id = `${strike.lat}-${strike.lon}-${now}`;
        allStrikesMap.set(id, strike);
      }
    } catch(e) {}
  };
  evtSource.onopen = () => {
    console.log('Live map connected to SSE.');
    if (!isAnimating) {
      isAnimating = true;
      animateStrikes();
    }
  };
}

// Генератор GeoJSON точки
function getGeoJSONPoint(coords) {
  return {
    type: 'FeatureCollection',
    features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: coords } }]
  };
}

// Отрисовка зон безопасности (30км Наблюдение, 15км Опасность, 5км Критическая)
function drawSafetyRings() {
  map.addLayer({
    id: 'ring-30km',
    type: 'circle',
    source: 'user-location',
    paint: {
      'circle-radius': [
        'interpolate', ['exponential', 2], ['zoom'],
        0, 0,
        20, 30000
      ],
      'circle-color': 'transparent',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#00B0FF', // Cyber Blue for Observation Zone
      'circle-stroke-opacity': 0.4
    }
  }, 'user-marker');

  map.addLayer({
    id: 'ring-15km',
    type: 'circle',
    source: 'user-location',
    paint: {
      'circle-radius': [
        'interpolate', ['exponential', 2], ['zoom'],
        0, 0,
        20, 15000
      ],
      'circle-color': 'transparent',
      'circle-stroke-width': 2,
      'circle-stroke-color': COLORS.warning,
      'circle-stroke-opacity': 0.5
    }
  }, 'user-marker');

  map.addLayer({
    id: 'ring-5km',
    type: 'circle',
    source: 'user-location',
    paint: {
      'circle-radius': [
        'interpolate', ['exponential', 2], ['zoom'],
        0, 0,
        20, 5000 
      ],
      'circle-color': 'transparent',
      'circle-stroke-width': 2,
      'circle-stroke-color': COLORS.critical,
      'circle-stroke-opacity': 0.8
    }
  }, 'user-marker');
}

// --- RainViewer Radar Logic ---
let rvTimestamps = [];
let rvCurrentIndex = 0;
let rvAnimationInterval = null;
let rvHost = "https://tilecache.rainviewer.com";
let rvPath = "";
const RADAR_COLORS = 2; // Color scheme (2 = Original)
const RADAR_SMOOTH = 1; // 1 = smooth, 0 = pixelated
const RADAR_SNOW = 1; // 1 = show snow

async function initRainViewer() {
  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
    const data = await res.json();
    rvHost = data.host;
    rvPath = data.radar.past; // Get past radar timestamps
    rvTimestamps = rvPath.map(f => f.time);
    
    // Use latest timestamp
    rvCurrentIndex = rvTimestamps.length - 1;
    
    // Add layers for all timestamps, but hide them
    rvTimestamps.forEach((ts, index) => {
      const sourceId = `rv-source-${ts}`;
      const layerId = `rv-layer-${ts}`;
      
      map.addSource(sourceId, {
        type: 'raster',
        tiles: [`${rvHost}${rvPath[index].path}/256/{z}/{x}/{y}/${RADAR_COLORS}/${RADAR_SMOOTH}_${RADAR_SNOW}.png`],
        tileSize: 256,
        maxzoom: 7
      });
      
      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        layout: {
          visibility: index === rvCurrentIndex ? 'visible' : 'none'
        },
        paint: {
          'raster-opacity': 0.6
        }
      }, 'user-marker'); // Place below user marker
    });
    
    // Show UI
    document.getElementById('radar-controls').classList.remove('hidden');
    updateRadarUI();
    
    // Start animation by default
    toggleRadarAnimation();
  } catch (e) {
    console.error("RainViewer initialization error:", e);
  }
}

function updateRadarUI() {
  const ts = rvTimestamps[rvCurrentIndex];
  if (!ts) return;
  const date = new Date(ts * 1000);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('radar-time').innerText = timeStr;
  
  // Show current layer, hide others
  rvTimestamps.forEach((t, i) => {
    const layerId = `rv-layer-${t}`;
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', i === rvCurrentIndex ? 'visible' : 'none');
    }
  });
}

function toggleRadarAnimation() {
  const playBtn = document.getElementById('btn-radar-play');
  if (rvAnimationInterval) {
    clearInterval(rvAnimationInterval);
    rvAnimationInterval = null;
    playBtn.innerText = '▶';
  } else {
    playBtn.innerText = '⏸';
    rvAnimationInterval = setInterval(() => {
      rvCurrentIndex = (rvCurrentIndex + 1) % rvTimestamps.length;
      updateRadarUI();
    }, 1000); // 1 frame per second
  }
}

document.getElementById('btn-radar-play').addEventListener('click', toggleRadarAnimation);
// -----------------------------

// Функция применения локации на карту
function applyUserLocation() {
  if (!map) return;
  if (map.isStyleLoaded()) {
    map.setCenter(userLocation);
    if (map.getSource('user-location')) {
      map.getSource('user-location').setData(getGeoJSONPoint(userLocation));
    }
  } else {
    map.once('load', () => {
      map.setCenter(userLocation);
      if (map.getSource('user-location')) {
        map.getSource('user-location').setData(getGeoJSONPoint(userLocation));
      }
    });
  }
}

// Получение геолокации
function getUserLocation() {
  if (tg.LocationManager && tg.LocationManager.isInited) {
    tg.LocationManager.getLocation((loc) => {
      if (loc) {
        userLocation = [loc.longitude, loc.latitude];
        applyUserLocation();
      }
    });
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      userLocation = [pos.coords.longitude, pos.coords.latitude];
      applyUserLocation();
    });
  }
}

// UI Ивенты
document.getElementById('btn-center').addEventListener('click', () => {
  getUserLocation(); // Reset to GPS or fly to it
});

document.getElementById('btn-zoom-in').addEventListener('click', () => {
  map.zoomIn();
});

document.getElementById('btn-zoom-out').addEventListener('click', () => {
  map.zoomOut();
});

const sheet = document.getElementById('safety-sheet');
document.getElementById('btn-safety').addEventListener('click', () => {
  sheet.classList.remove('hidden');
});
document.getElementById('btn-close-sheet').addEventListener('click', () => {
  sheet.classList.add('hidden');
});

// Search and manual selection logic
const btnConfirm = document.getElementById('btn-confirm-location');
const crosshair = document.getElementById('crosshair');
let isManualSelectionMode = false;

// When user moves the map manually, activate manual selection mode
function initMapEvents() {
  map.on('movestart', (e) => {
    // Check if the move was triggered by user interaction (not flyTo)
    if (e.originalEvent) {
      isManualSelectionMode = true;
      crosshair.classList.remove('hidden');
      btnConfirm.classList.remove('hidden');
      // Hide the user marker to avoid confusion, user uses crosshair now
      if (map.getLayer('user-marker')) {
        map.setLayoutProperty('user-marker', 'visibility', 'none');
      }
    }
  });

  map.on('moveend', () => {
    if (isManualSelectionMode) {
      const center = map.getCenter();
      userLocation = [center.lng, center.lat];
      if (map.getSource('user-location')) {
        map.getSource('user-location').setData(getGeoJSONPoint(userLocation));
      }
    }
  });

  map.on('click', (e) => {
    userLocation = [e.lngLat.lng, e.lngLat.lat];
    if (map.getSource('user-location')) {
      map.getSource('user-location').setData(getGeoJSONPoint(userLocation));
    }
    
    isManualSelectionMode = false;
    crosshair.classList.add('hidden');
    if (map.getLayer('user-marker')) {
      map.setLayoutProperty('user-marker', 'visibility', 'visible');
    }
    btnConfirm.classList.remove('hidden');
  });
}

document.getElementById('btn-search').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value;
  if (!query) return;

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      userLocation = [parseFloat(lon), parseFloat(lat)];
      map.flyTo({ center: userLocation, zoom: 12 });
      
      if (map.getSource('user-location')) {
        map.getSource('user-location').setData(getGeoJSONPoint(userLocation));
      }
      
      isManualSelectionMode = false;
      crosshair.classList.add('hidden');
      if (map.getLayer('user-marker')) {
        map.setLayoutProperty('user-marker', 'visibility', 'visible');
      }
      btnConfirm.classList.remove('hidden');
    } else {
      tg.showAlert('Город не найден');
    }
  } catch (e) {
    console.error('Search error:', e);
  }
});

// Confirm location and send to bot
btnConfirm.addEventListener('click', () => {
  const payload = {
    lat: userLocation[1],
    lon: userLocation[0]
  };
  
  if (tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) {
    const userId = tg.initDataUnsafe.user.id;
    fetch('/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, lat: payload.lat, lon: payload.lon })
    }).then(() => tg.close()).catch(() => tg.close());
  } else if (tg.sendData) {
    tg.sendData(JSON.stringify(payload));
    tg.close();
  } else {
    tg.close();
  }
});

// Запуск
initMap();
// Wait for map load to bind events
map.on('load', () => {
  initMapEvents();
});

// Если переданы параметры в URL, используем их
if (urlParams.has('lat') && urlParams.has('lon')) {
  // Уже установлено вверху файла
} else if (tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) {
  // Пытаемся получить с бэкенда
  fetch(`/api/user/${tg.initDataUnsafe.user.id}/location`)
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data && data.lat) {
        userLocation = [parseFloat(data.lon), parseFloat(data.lat)];
        applyUserLocation();
      } else {
        getUserLocation();
      }
    }).catch(() => getUserLocation());
} else {
  getUserLocation();
}
