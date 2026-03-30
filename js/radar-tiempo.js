(() => {
  const OWM_KEY = '33acea6f74354dc1d95c35f088ba59ef'; // OpenWeatherMap
  const MAPTILER_KEY = 'DGeTvWsP9imdpvIzWEGh'; // MapTiler Key

  const LAYER_MAP = {
    rain: 'precipitation_new',
    clouds: 'clouds_new',
    storms: 'thunderstorm',
    temp: 'temp_new'
  };

  const map = L.map('map', { center: [15.5007, -88.0244], zoom: 7, preferCanvas: true });
  const $ = id => document.getElementById(id);

  // BASE MAPS
  const lightBase = L.tileLayer(
    `https://api.maptiler.com/maps/base-v4/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
    {
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 20,
      crossOrigin: true
    }
  );

  const darkBase = L.tileLayer(
    `https://api.maptiler.com/maps/darkmatter/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
    {
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 20,
      crossOrigin: true
    }
  );

  darkBase.addTo(map);

  // WEATHER LAYER
  let owmLayer = null;

  function setLayer(layer) {
    if (owmLayer) map.removeLayer(owmLayer);

    owmLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/${LAYER_MAP[layer]}/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
      {
        opacity: 0.6,
        zIndex: 500,
        crossOrigin: true,
        attribution: '&copy; OpenWeatherMap'
      }
    );

    owmLayer.addTo(map);
  }

  setLayer('clouds'); // capa inicial de nubes

  // ANIMACIÓN
  let playing = false;
  let playTimer = null;

  const playBtnLabel = () => $('playBtnLabel');
  const themeBtnLabel = () => $('themeBtnLabel');

  function startRadarAnim() {
    if (playing) return;
    playing = true;
    const pb = $('playBtn');
    const pl = playBtnLabel();
    if (pb) pb.classList.add('playing');
    if (pl) pl.textContent = 'Pausar';

    playTimer = setInterval(() => {
      if (!owmLayer) return;
      map.removeLayer(owmLayer);
      const lm = $('layerMode');
      if (lm) setLayer(lm.value);
    }, 1000);
  }

  function stopRadarAnim() {
    playing = false;
    const pb = $('playBtn');
    const pl = playBtnLabel();
    if (pb) pb.classList.remove('playing');
    if (pl) pl.textContent = 'Animar capa';
    clearInterval(playTimer);
  }

  const playBtnEl = $('playBtn');
  if (playBtnEl) playBtnEl.onclick = () => (playing ? stopRadarAnim() : startRadarAnim());

  // CAPAS
  const layerModeEl = $('layerMode');
  if (layerModeEl) {
    layerModeEl.onchange = () => {
      stopRadarAnim();
      setLayer(layerModeEl.value);
    };
  }

  // Mapa base claro / oscuro (no modifica el tema del sitio; usa el interruptor de la barra superior)
  let dark = true;
  const themeBtnEl = $('themeBtn');

  function syncMapBaseButton() {
    if (!themeBtnEl) return;
    const tl = themeBtnLabel();
    if (tl) tl.textContent = dark ? 'Mapa claro' : 'Mapa oscuro';
    themeBtnEl.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  if (themeBtnEl) {
    themeBtnEl.onclick = () => {
      dark = !dark;
      try {
        map.removeLayer(darkBase);
        map.removeLayer(lightBase);
      } catch (e) { /* noop */ }

      (dark ? darkBase : lightBase).addTo(map);
      if (owmLayer) owmLayer.bringToFront();
      syncMapBaseButton();
    };
    syncMapBaseButton();
  }

  // GEOLOCALIZACIÓN
  const locBtnEl = $('locBtn');
  if (locBtnEl) {
    locBtnEl.onclick = () => {
      if (!navigator.geolocation) {
        alert('Geolocalización no disponible');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          L.marker([latitude, longitude]).addTo(map).bindPopup('📌 Estás aquí').openPopup();
          map.setView([latitude, longitude], 12);
        },
        err => console.warn(err)
      );
    };
  }

  // BÚSQUEDA
  async function searchLocation(q) {
    if (!q.trim()) return;
    try {
      const data = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
      ).then(r => r.json());

      if (!data.length) {
        alert('No se encontraron resultados.');
        return;
      }

      map.setView([parseFloat(data[0].lat), parseFloat(data[0].lon)], 10);
    } catch (err) {
      console.error(err);
    }
  }

  const searchBtnEl = $('searchBtn');
  const searchInputEl = $('searchInput');
  if (searchBtnEl && searchInputEl) searchBtnEl.onclick = () => searchLocation(searchInputEl.value);
  if (searchInputEl) searchInputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchLocation(searchInputEl.value);
  });

  // PAÍSES
  const countrySelectEl = $('countrySelect');
  if (countrySelectEl) {
    countrySelectEl.onchange = () => {
      const val = countrySelectEl.value;
      if (!val) return;
      const [lat, lon, z] = val.split(',').map(Number);
      map.setView([lat, lon], z);
    };
  }

  // Exponer funciones útiles para depuración desde la consola
  try {
    window.__radar_debug = {
      setLayer,
      startRadarAnim,
      stopRadarAnim,
      map,
      L
    };
  } catch (e) {
    console.warn('No se pudo exponer __radar_debug', e);
  }

})();
