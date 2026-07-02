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
    // Свободный стиль CartoDB Dark Matter
    style: {
      version: 8,
      sources: {
        'cartodb-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
          ],
          tileSize: 256
        }
      },
      layers: [
        {
          id: 'cartodb-dark-layer',
          type: 'raster',
          source: 'cartodb-dark',
          minzoom: 0,
          maxzoom: 22
        }
      ]
    },
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
    startPolling();
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

// Опрос бэкенда
async function pollStrikes() {
  try {
    const res = await fetch('/api/strikes');
    const data = await res.json();
    
    if (data && data.strikes) {
      const features = data.strikes.map(s => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [s.lon, s.lat] },
        properties: { timestamp: s.timestamp }
      }));
      
      map.getSource('strikes').setData({
        type: 'FeatureCollection',
        features
      });
    }
  } catch (e) {
    console.error('Polling error:', e);
  }
}

function startPolling() {
  pollStrikes();
  setInterval(pollStrikes, 10000); // 10s
}

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
