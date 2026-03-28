(() => {
  'use strict';

  // ================= CONFIGURACIÓN =================
  const OWM_KEY = '33acea6f74354dc1d95c35f088ba59ef'; // OpenWeatherMap
  const MAPTILER_KEY = 'DGeTvWsP9imdpvIzWEGh'; // MapTiler Key

  const LAYER_MAP = {
    rain: 'precipitation_new',
    clouds: 'clouds_new', 
    storms: 'thunderstorm',
    temp: 'temp_new',
    wind: 'wind_new' // Nueva capa viento
  };

  // ================= ELEMENTOS DOM =================
  const $ = id => document.getElementById(id);
  const map = L.map('map', { 
    center: [14.8, -86.5], // Honduras centro
    zoom: 7, 
    preferCanvas: true,
    zoomControl: true,
    attributionControl: true
  });

  // Cache de elementos
  const elements = {
    map: $('map'),
    layerMode: $('layerMode'),
    playBtn: $('playBtn'),
    locBtn: $('locBtn'),
    refreshBtn: $('refreshBtn'),
    searchInput: $('searchInput'),
    searchBtn: $('searchBtn'),
    timelinePlay: $('timeline-play'),
    timelineSlider: $('timeline-slider'),
    timelineLabel: $('timeline-label'),
    timelineSpeed: $('timeline-speed'),
    lastUpdate: $('last-update'),
    statusIndicator: $('status-indicator'),
    mapLegend: $('map-legend'),
    searchSuggestions: $('search-suggestions')
  };

  // ================= BASE MAPS =================
  const lightBase = L.tileLayer(
    `https://api.maptiler.com/maps/base-v4/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
    { attribution: '© MapTiler © OpenStreetMap', maxZoom: 20, crossOrigin: true }
  );

  const darkBase = L.tileLayer(
    `https://api.maptiler.com/maps/darkmatter/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
    { attribution: '© MapTiler © OpenStreetMap', maxZoom: 20, crossOrigin: true }
  );

  // tema mapa
  const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
  darkBase.addTo(map);
} else {
  lightBase.addTo(map);
}

  // ================= WEATHER LAYER =================
  let owmLayer = null;
  let currentLayer = 'clouds';

  function setLayer(layerName) {
    if (owmLayer) map.removeLayer(owmLayer);
    
    currentLayer = layerName;
    owmLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/${LAYER_MAP[layerName]}/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
      {
        opacity: 0.7,
        zIndex: 500,
        crossOrigin: true,
        attribution: '© OpenWeatherMap'
      }
    );
    
    owmLayer.addTo(map);
    updateLegend(layerName);
  }

  // Capa inicial
  setLayer('clouds');

  // ================= ANIMACIÓN AVANZADA =================
  let playing = false;
  let playTimer = null;
  let animationSpeed = 1000; // ms entre frames

  function startRadarAnim() {
    if (playing) return;
    playing = true;
    
    const pb = elements.playBtn;
    if (pb) {
      pb.classList.add('playing');
      pb.textContent = '⏸️';
    }

    playTimer = setInterval(() => {
      if (!playing || !owmLayer) return;
      const nextLayer = Object.keys(LAYER_MAP)[
        (Object.keys(LAYER_MAP).indexOf(currentLayer) + 1) % Object.keys(LAYER_MAP).length
      ];
      setLayer(nextLayer);
    }, animationSpeed);
  }

  function stopRadarAnim() {
    playing = false;
    if (playTimer) clearInterval(playTimer);
    
    const pb = elements.playBtn;
    if (pb) {
      pb.classList.remove('playing');
      pb.textContent = '▶️';
    }
  }

  // ================= EVENT LISTENERS =================
  if (elements.playBtn) {
    elements.playBtn.onclick = () => playing ? stopRadarAnim() : startRadarAnim();
  }
const icon = elements.refreshBtn.querySelector('.refresh-icon');

icon.classList.add('spin');

setTimeout(() => {
  icon.classList.remove('spin');
}, 800);

  if (elements.refreshBtn) {
    elements.refreshBtn.onclick = () => {

  if (owmLayer) {
    map.removeLayer(owmLayer);
  }

  setLayer(currentLayer);

  showNotification('Radar actualizado 🌧️');
};
  }

  // Capas
  if (elements.layerMode) {
    elements.layerMode.onchange = (e) => {
      stopRadarAnim();
      setLayer(e.target.value);
    };
  }

  // Timeline
  if (elements.timelineSlider) {
    elements.timelineSlider.oninput = (e) => {
      const progress = e.target.value;
      elements.timelineLabel.textContent = 
        progress === '100' ? 'Ahora' : `${Math.round(progress)}% atrás`;
      
      // Ajustar opacidad del layer
      if (owmLayer) {
        owmLayer.setOpacity(0.3 + (progress / 100) * 0.4);
      }
    };
  }

  
 let timelineInterval = null;

if (elements.timelinePlay) {
  elements.timelinePlay.onclick = () => {

    if (timelineInterval) {
      clearInterval(timelineInterval);
      timelineInterval = null;
      return;
    }

    timelineInterval = setInterval(() => {
      let val = parseInt(elements.timelineSlider.value);
      val = (val + 2) % 100;

      elements.timelineSlider.value = val;
      elements.timelineSlider.dispatchEvent(new Event('input'));

    }, 300);
  };
}


  // ================= TEMA DARK/LIGHT =================
 
const themeBtn = document.getElementById('theme-btn');

let currentTheme = localStorage.getItem('theme') || 'light';

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    themeBtn.textContent = '☀️';
    map.removeLayer(lightBase);
    darkBase.addTo(map);
  } else {
    document.body.classList.remove('dark-theme');
    themeBtn.textContent = '🌙';
    map.removeLayer(darkBase);
    lightBase.addTo(map);
  }

  if (owmLayer) owmLayer.bringToFront();
}

// Inicial
applyTheme(currentTheme);

// Click toggle
themeBtn.onclick = () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', currentTheme);
  applyTheme(currentTheme);
};
document.addEventListener('click', (e) => {
  const option = e.target.closest('[data-theme]');
  if (!option) return;

  const theme = option.getAttribute('data-theme');

  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    map.removeLayer(lightBase);
    darkBase.addTo(map);
  } else {
    document.body.classList.remove('dark-theme');
    map.removeLayer(darkBase);
    lightBase.addTo(map);
  }

  if (owmLayer) owmLayer.bringToFront();
});
  // ================= GEOLOCALIZACIÓN =================
  if (elements.locBtn) {
    elements.locBtn.onclick = () => {
  if (!navigator.geolocation) {
    showNotification('Geolocalización no disponible', 'error');
    return;
  }

  elements.locBtn.classList.add('loading');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      // Limpiar marcadores anteriores (opcional)
      if (window.userMarker) {
        map.removeLayer(window.userMarker);
      }

      // Crear marcador bonito
      window.userMarker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup('📍 Estás aquí')
        .openPopup();

      map.flyTo([latitude, longitude], 12, {
        duration: 1.5
      });

      elements.locBtn.classList.remove('loading');
    },
    () => {
      showNotification('No se pudo obtener ubicación', 'error');
      elements.locBtn.classList.remove('loading');
    }
  );
};
  }

  // ================= BÚSQUEDA AVANZADA =================
  async function searchLocation(query) {
    if (!query.trim()) return;
    
    try {
      showLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=hn,gt,sv,ni,cr,pa`
      );
      const data = await response.json();

      if (!data.length) {
        showNotification('No se encontraron resultados', 'warning');
        return;
      }

      // Mostrar sugerencias
      showSuggestions(data);
      
      // Ir al primer resultado
      const result = data[0];
      map.setView([parseFloat(result.lat), parseFloat(result.lon)], 10);
      
      // Marker
      L.marker([result.lat, result.lon]).addTo(map)
        .bindPopup(`${result.display_name.split(',')[0]}<br>${result.display_name}`)
        .openPopup();
        
    } catch (error) {
      console.error('Error búsqueda:', error);
      showNotification('Error de conexión', 'error');
    } finally {
      showLoading(false);
    }
  }

  function showSuggestions(data) {
    const container = elements.searchSuggestions;
    if (!container) return;
    
    container.innerHTML = data.map(item => 
      `<div class="suggestion-item" data-lat="${item.lat}" data-lon="${item.lon}">
        ${item.display_name.split(',')[0]}, ${item.display_name.split(',')[1]}
      </div>`
    ).join('');
    
    container.style.display = data.length ? 'block' : 'none';
  }

  // Event listeners búsqueda
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', debounce((e) => {
      if (e.target.value.length > 2) {
        searchLocation(e.target.value);
      }
    }, 300));
  }

  if (elements.searchBtn) {
    elements.searchBtn.onclick = () => searchLocation(elements.searchInput.value);
  }
  document.addEventListener('click', function(e) {

  const item = e.target.closest('.suggestion-item');
  if (!item) return;

  const lat = parseFloat(item.dataset.lat);
  const lon = parseFloat(item.dataset.lon);

  map.setView([lat, lon], 11);

  L.marker([lat, lon])
    .addTo(map)
    .bindPopup("Ubicación seleccionada")
    .openPopup();

  elements.searchSuggestions.style.display = 'none';
  elements.searchInput.value = item.textContent;
});

  // ================= UTILIDADES =================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function showNotification(message, type = 'info') {
    // Crear toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
  }

  function showLoading(show) {
    const btns = document.querySelectorAll('.btn-control');
    btns.forEach(btn => btn.style.opacity = show ? '0.6' : '1');
  }

  function updateLegend(layer) {
    const legend = elements.mapLegend;
    if (!legend) return;
    
    const legends = {
      rain: '🌧️ Azul=ligera | Rojo=intensa',
      clouds: '☁️ Blanco=nubes densas',
      storms: '⚡ Amarillo=tormentas',
      temp: '🌡️ Azul=frío | Rojo=calor',
      wind: '💨 Líneas=velocidad viento'
    };
    
    legend.innerHTML = `
      <div class="legend-title">${legends[layer] || 'Leyenda'}</div>
    `;
  }

  // ================= STATUS REAL TIME =================
  function updateStatus() {
    if (elements.lastUpdate) {
      elements.lastUpdate.textContent = new Date().toLocaleTimeString('es-HN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  }

  // Status indicator animado
  function animateStatus() {
    const dot = document.querySelector('.status-dot');
    if (dot) {
      dot.style.background = Math.random() > 0.05 ? '#4ade80' : '#ef4444';
    }
  }

  // ================= INIT =================
  function init() {
    updateStatus();
    setInterval(updateStatus, 1000); // Cada segundo
    setInterval(animateStatus, 3000); // Status cada 3s
    
    // Ocultar suggestions al click fuera
    document.addEventListener('click', (e) => {
      if (elements.searchSuggestions) {
      elements.searchSuggestions.style.display = 'none';
      }
    });

    // ===== DROPDOWN CAPAS =====
const dropdown = document.getElementById('layerDropdown');

if (dropdown) {
  const selected = dropdown.querySelector('.dropdown-selected');
  const options = dropdown.querySelectorAll('.dropdown-item');
  const selectedText = dropdown.querySelector('.selected-text');
  const selectedIcon = dropdown.querySelector('.selected-icon');

  // abrir/cerrar
  selected.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  // seleccionar opción
  options.forEach(option => {
    option.addEventListener('click', () => {
      const value = option.dataset.value;
      const icon = option.textContent.trim().charAt(0);
      const label = option.textContent.trim().substring(2);

      selectedText.textContent = label;
      selectedIcon.textContent = icon;

      dropdown.classList.remove('active');

      stopRadarAnim();
      setLayer(value);
    });
  });

  // cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
}
  }
  

  // ================= DEBUG =================
  window.__radar_debug = {
    setLayer,
    startRadarAnim,
    stopRadarAnim,
    map,
    L,
    elements
  };

  // Inicializar cuando DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();