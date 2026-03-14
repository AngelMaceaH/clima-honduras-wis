(function () {
  'use strict';

  const EL = id => document.getElementById(id);
  const tempEl = () => EL('temperature-display');
  const descEl = () => EL('weather-description');
  const feelsEl = () => EL('feels-like');
  const humEl = () => EL('humidity');
  const windEl = () => EL('wind');
  const localTimeEl = () => EL('local-time');
  const refreshBtn = () => EL('refresh-weather');

  function fetchWithRetries(url, opts = {}, retries = 2, backoff = 500) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const attempt = () => {
        attempts++;
        fetch(url, opts).then(res => {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        }).then(json => resolve(json)).catch(err => {
          if (attempts <= retries) {
            setTimeout(attempt, backoff * attempts);
          } else reject(err);
        });
      };
      attempt();
    });
  }

  function updateUI(current, data) {
    try {
      if (!current) return;
      const t = Math.round(current.temperature);
      tempEl() && (tempEl().textContent = `${t}°C`);
      const map = {
        0: 'Despejado', 1: 'Principalmente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
        45: 'Niebla', 48: 'Escarcha', 51: 'Llovizna ligera', 61: 'Lluvia ligera', 63: 'Lluvia moderada',
        71: 'Nieve ligera', 80: 'Chubascos', 95: 'Tormenta'
      };
      descEl() && (descEl().textContent = map[current.weathercode] || 'Indefinido');

      // humidity & wind from hourly arrays if available
      let humidity = null, windspeed = null;
      try {
        const timeISO = current.time;
        if (data && data.hourly && Array.isArray(data.hourly.time)) {
          const idx = data.hourly.time.indexOf(timeISO);
          if (idx !== -1) {
            humidity = data.hourly.relativehumidity_2m && data.hourly.relativehumidity_2m[idx];
            windspeed = data.hourly.windspeed_10m && data.hourly.windspeed_10m[idx];
          }
        }
      } catch (e) {}

      humEl() && (humEl().textContent = `Humedad: ${humidity != null ? Math.round(humidity) + '%' : '--'}`);
      windEl() && (windEl().textContent = `Viento: ${windspeed != null ? Math.round(windspeed) + ' km/h' : '--'}`);

      // simple feels like fallback
      if (feelsEl()) {
        const feels = current.temperature; // keep simple
        feelsEl().textContent = `Sensación: ${Math.round(feels)}°`;
      }

      // local time formatting using API timezone if present
      try {
        const tz = data && data.timezone ? data.timezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        const opts = { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true };
        const timeStr = now.toLocaleTimeString('es-HN', opts).toUpperCase();
        localTimeEl() && (localTimeEl().textContent = `Hora: ${timeStr}`);
      } catch (e) {}
    } catch (e) { console.warn('ciclo-weather updateUI error', e); }
  }

  function obtenerClimaPorCoords(lat, lon) {
    if (!isFinite(lat) || !isFinite(lon)) return Promise.reject(new Error('Coords inválidas'));
    const hourly = 'temperature_2m,relativehumidity_2m,weathercode,windspeed_10m,precipitation_probability';
    const daily = 'sunrise,sunset';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=${hourly}&daily=${daily}&timezone=auto&forecast_days=1`;
    return fetchWithRetries(url, {}, 2).then(data => {
      if (data && data.current_weather) updateUI(data.current_weather, data);
      return data;
    });
  }

  function tryGeoAndFetch() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        obtenerClimaPorCoords(pos.coords.latitude, pos.coords.longitude).catch(err => {
          console.warn('fetch clima fallo', err);
          const desc = descEl(); desc && (desc.textContent = 'No se pudieron obtener datos meteorológicos');
        });
      }, err => {
        console.warn('geolocation failed', err);
        // fallback: a central coord in Honduras
        obtenerClimaPorCoords(14.1, -87.2).catch(()=>{});
      });
    } else {
      obtenerClimaPorCoords(14.1, -87.2).catch(()=>{});
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    tryGeoAndFetch();
    const btn = refreshBtn();
    if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); tryGeoAndFetch(); });
  });

  // expose for debugging
  window.__cicloWeather = { obtenerClimaPorCoords, tryGeoAndFetch };
})();
