// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Токены цветов из DESIGN.md
const COLORS = {
  warning: '#FFEA00',
  critical: '#FF7575',
  bg: '#0C0D10'
};

// Состояние
let userLocation = [37.6173, 55.7558]; // По умолчанию (Москва)
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

    // Неоновое свечение (Halo)
    map.addLayer({
      id: 'strikes-halo',
      type: 'circle',
      source: 'strikes',
      paint: {
        'circle-radius': 8,
        'circle-color': COLORS.critical,
        'circle-opacity': 0.4,
        'circle-blur': 1
      }
    });

    // Сама точка молнии
    map.addLayer({
      id: 'strikes-core',
      type: 'circle',
      source: 'strikes',
      paint: {
        'circle-radius': 3,
        'circle-color': '#FFFFFF'
      }
    });

    drawSafetyRings();
    initRainViewer();
  });
}

// Генератор GeoJSON точки
function getGeoJSONPoint(coords) {
  return {
    type: 'FeatureCollection',
    features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: coords } }]
  };
}

// Отрисовка колец 5км и 15км (приблизительный полигон через Turf.js или простая окружность)
function drawSafetyRings() {
  // Для простоты используем circle-radius с интерполяцией по зуму 
  // (В реальном проекте лучше использовать turf.circle для генерации GeoJSON полигонов)
  map.addLayer({
    id: 'ring-15km',
    type: 'circle',
    source: 'user-location',
    paint: {
      'circle-radius': [
        'interpolate', ['exponential', 2], ['zoom'],
        0, 0,
        20, 15000 // приближенное значение пикселей на зуме 20 для 15км
      ],
      'circle-color': 'transparent',
      'circle-stroke-width': 2,
      'circle-stroke-color': COLORS.warning,
      'circle-stroke-opacity': 0.5
    }
  }, 'user-marker'); // Вставляем под маркер пользователя

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
        tileSize: 256
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

// Получение геолокации
function getUserLocation() {
  if (tg.LocationManager && tg.LocationManager.isInited) {
    tg.LocationManager.getLocation((loc) => {
      if (loc) {
        userLocation = [loc.longitude, loc.latitude];
        map.setCenter(userLocation);
        map.getSource('user-location').setData(getGeoJSONPoint(userLocation));
      }
    });
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      userLocation = [pos.coords.longitude, pos.coords.latitude];
      if (map && map.isStyleLoaded()) {
        map.setCenter(userLocation);
        map.getSource('user-location').setData(getGeoJSONPoint(userLocation));
      }
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
}

document.getElementById('btn-search').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value;
  if (!query) return;

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const newLoc = [parseFloat(lon), parseFloat(lat)];
      map.flyTo({ center: newLoc, zoom: 12 });
      
      // Activate manual mode automatically after search
      isManualSelectionMode = true;
      crosshair.classList.remove('hidden');
      btnConfirm.classList.remove('hidden');
      if (map.getLayer('user-marker')) {
        map.setLayoutProperty('user-marker', 'visibility', 'none');
      }
    } else {
      tg.showAlert('Город не найден');
    }
  } catch (e) {
    console.error('Search error:', e);
  }
});

// Confirm location and send to bot
btnConfirm.addEventListener('click', () => {
  // Center of the screen represents the new selected location
  const center = map.getCenter();
  const payload = {
    lat: center.lat,
    lon: center.lng
  };
  
  if (tg.sendData) {
    tg.sendData(JSON.stringify(payload));
  }
  // Close the WebApp after sending data
  tg.close();
});

// Запуск
initMap();
// Wait for map load to bind events
map.on('load', () => {
  initMapEvents();
});
getUserLocation();
