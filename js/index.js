(function () {
  'use strict';

  // -------------------------------------
  // Elementos del DOM (resueltos dinámicamente)
  // -------------------------------------
  const departamentosEl = () => document.getElementById("departamentos");
  const municipiosEl = () => document.getElementById("municipios");
  const locationText = () => document.getElementById("location-text");
  const updateTime = () => document.getElementById("update-time");
  const tempEl = () => document.getElementById("temp");
  const weatherDesc = () => document.getElementById("weather-desc");
  const highLowEl = () => document.getElementById("high-low");
  const weatherIcon = () => document.getElementById("weather-icon");
  const weatherBg = () => document.querySelector(".weather-bg");
  const cuadro2 = () => document.querySelector(".cuadro2");
  /** Fondo dinámico según clima: solo la primera sección (hero) en index */
  const indexHeroBackdrop = () => document.querySelector(".index-hero-weather-bg");


  console.log('hoy.js inicializando...');

  // -------------------------------------
  // Fondos por periodo/clima (USAMOS: madrugada, dia, tarde, noche)
  // Categorías por periodo: despejado, parcialmenteDespejado, nublado, niebla,
  // lluviaLigera, lluviaModerada, nieveLigera, chubascos, tormenta
  // -------------------------------------
  const fondosClima = {
  madrugada: {
    despejado: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    parcialmenteDespejado: "https://plus.unsplash.com/premium_photo-1667338341609-829a2fb99bfc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    nublado: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    niebla: "https://images.unsplash.com/photo-1693967308919-dfe3fe89aa2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvZ2d5JTIwZGF5fGVufDB8fDB8fHww",
    lluviaLigera: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lluviaModerada: "https://images.unsplash.com/photo-1527766833261-b09c3163a791?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    nieveLigera: "https://images.unsplash.com/photo-1642087403376-84e7debb7c49?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c25vd3klMjBkYXl8ZW58MHx8MHx8fDA%3D",
    chubascos: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tormenta: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  dia: {
    despejado: "https://plus.unsplash.com/premium_photo-1727730047398-49766e915c1d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xlYXIlMjBza3l8ZW58MHx8MHx8fDA%3D",
    parcialmenteDespejado: "https://images.unsplash.com/photo-1612251276789-9b1a8f2add8b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNsZWFyJTIwc2t5fGVufDB8fDB8fHww%3D%3D",
    nublado: "https://plus.unsplash.com/premium_photo-1667143327769-1c36fd30a7c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdWR5JTIwZGF5fGVufDB8fDB8fHww%3D%3D",
    niebla: "https://images.unsplash.com/photo-1693967308919-dfe3fe89aa2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvZ2d5JTIwZGF5fGVufDB8fDB8fHww",
    lluviaLigera: "https://images.unsplash.com/photo-1590148778969-44e3dfd8e573?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2xnaHQlMjByYWlufGVufDB8fDB8fHww",
    lluviaModerada: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhaW55JTIwZGF5fGVufDB8fDB8fHww",
    nieveLigera: "https://images.unsplash.com/photo-1642087403376-84e7debb7c49?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c25vd3klMjBkYXl8ZW58MHx8MHx8fDA%3D%3D",
    chubascos: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhaW55JTIwZGF5fGVufDB8fDB8fHww",
    tormenta: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhdnklMjByYWlufGVufDB8fDB8fHww%3D%3D"
  },
  tarde: {
    despejado: "https://plus.unsplash.com/premium_photo-1727730047398-49766e915c1d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xlYXIlMjBza3l8ZW58MHx8MHx8fDA%3D",
    parcialmenteDespejado: "https://plus.unsplash.com/premium_photo-1668091148044-056cd744e64a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3Vuc2V0JTIwY2xvdWR8ZW58MHx8MHx8fDA%3D",
    nublado: "https://images.unsplash.com/photo-1514519273132-6a1abd48302c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHN1bnNldCUyMGNsb3VkfGVufDB8fDB8fHww",
    niebla: "https://images.unsplash.com/photo-1627373892932-b9f0a605eb09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3Vuc2V0JTIwZm9nfGVufDB8fDB8fHww",
    lluviaLigera: "https://images.unsplash.com/photo-1493314894560-5c412a56c17c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhaW4lMjBkcm9wcyUyMG5pZ2h0fGVufDB8fDB8fHww%3D%3D",
    lluviaModerada: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhaW55JTIwZGF5fGVufDB8fDB8fHww",
    chubascos: "https://images.unsplash.com/photo-1493314894560-5c412a56c17c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJhaW4lMjBkcm9wcyUyMG5pZ2h0fGVufDB8fDB8fHww%3D%3D",
    tormenta: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhdnklMjByYWlufGVufDB8fDB8fHww%3D%3D"
  },
  noche: {
    despejado: "https://images.unsplash.com/photo-1513628253939-010e64ac66cd?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG5pZ2h0JTIwc2t5fGVufDB8fDB8fHww",
    parcialmenteDespejado: "https://images.unsplash.com/photo-1622072165281-7be98a19a47b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNsb3VkeSUyMG5pZ2h0fGVufDB8fDB8fHww",
    nublado: "https://images.unsplash.com/photo-1500740516770-92bd004b996e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xvdWR5JTIwbmlnaHR8ZW58MHx8MHx8fDA%3D",
    niebla: "https://images.unsplash.com/photo-1500740516770-92bd004b996e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xvdWR5JTIwbmlnaHR8ZW58MHx8MHx8fDA%3D",
    lluviaLigera: "https://images.unsplash.com/photo-1567688993206-43c34131b21f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhaW4lMjBkcm9wcyUyMG5pZ2h0fGVufDB8fDB8fHww",
    lluviaModerada: "https://images.unsplash.com/photo-1567688993206-43c34131b21f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhaW4lMjBkcm9wcyUyMG5pZ2h0fGVufDB8fDB8fHww",
    nieveLigera: "https://images.unsplash.com/photo-1518467946652-b194dd6dd321?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5pZ2h0JTIwc25vd3xlbnwwfHwwfHx8MA%3D%3D",
    chubascos: "https://images.unsplash.com/photo-1567688993206-43c34131b21f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhaW4lMjBkcm9wcyUyMG5pZ2h0fGVufDB8fDB8fHww",
    tormenta: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhdnklMjByYWlufGVufDB8fDB8fHww%3D%3D"
  }
};

  // -------------------------------------
  // Mapeo de códigos Open-Meteo a claves
  // -------------------------------------
  const mapClima = {
    0: "despejado",1: "parcialmenteDespejado",2: "parcialmenteDespejado",3: "nublado",
    45: "niebla",48: "niebla",51: "lluviaLigera",53: "lluviaLigera",55: "lluviaLigera",
    61: "lluviaLigera",63: "lluviaModerada",65: "lluviaModerada",71: "nieveLigera",
    73: "nieveLigera",75: "nieveLigera",80: "chubascos",81: "chubascos",82: "chubascos",
    95: "tormenta",96: "tormenta",99: "tormenta"
  };

  // -------------------------------------
  // Config / estado
  // -------------------------------------
  let unidad = "C";
  let ultimaUbicacion = null;
  const REMOTE_URL = 'https://raw.githubusercontent.com/forky/honduras-municipios-json/main/municipios.json';
  const LOCAL_URL = './js/municipios.json'; // usar ruta relativa para servidores estáticos
  const FALLBACK_MUNICIPIOS = {
    "Francisco Morazán": ["Tegucigalpa", "Valle de Ángeles"],
    "Cortés": ["San Pedro Sula", "Choloma"],
    "Atlántida": ["La Ceiba", "Tela"]
  };
  const FALLBACK_IMAGE = 'https://picsum.photos/900/600'; // fallback público si Unsplash falla

  // -------------------------------------
  // Helpers
  // -------------------------------------
  function safeEl(elGetter) {
    try {
      return elGetter();
    } catch (e) {
      return null;
    }
  }

  /** Muestra u oculta el skeleton del panel de clima (index #toolbar-weather-panel). */
  function setWeatherPanelLoading(loading) {
    try {
      const panel = document.getElementById('toolbar-weather-panel');
      if (!panel) return;
      const on = !!loading;
      panel.classList.toggle('is-loading', on);
      panel.setAttribute('aria-busy', on ? 'true' : 'false');
      const live = panel.querySelector('.weather-panel-live');
      if (live) live.setAttribute('aria-hidden', on ? 'true' : 'false');
      const sk = panel.querySelector('.weather-panel-skeleton');
      if (sk) sk.setAttribute('aria-hidden', on ? 'false' : 'true');
    } catch (e) {
      /* noop */
    }
  }

    // Fetch con reintentos simples y backoff exponencial.
    // Devuelve la respuesta parseada como JSON si todo OK, o lanza el error final.
    function fetchWithRetries(url, options = {}, retries = 2, backoff = 500) {
      return new Promise((resolve, reject) => {
        let attempts = 0;

        const attempt = () => {
          attempts++;
          fetch(url, options)
            .then(res => {
              if (!res.ok) throw new Error('HTTP ' + res.status);
              return res.json();
            })
            .then(json => resolve(json))
            .catch(err => {
              if (attempts <= retries) {
                const wait = backoff * attempts;
                console.warn(`Fetch fallo (intento ${attempts}/${retries}). Reintentando en ${wait}ms:`, url, err);
                setTimeout(attempt, wait);
              } else {
                console.error('Fetch falló después de reintentos:', url, err);
                reject(err);
              }
            });
        };

        attempt();
      });
    }

  // Conversión de temperatura helpers (usar en todo el fichero)
  function cToF(c) { return Math.round((Number(c) * 9/5) + 32); }
  function fToC(f) { return Math.round((Number(f) - 32) * 5/9); }

  function setBackgroundWithFallback(el, url, fallbackUrl) {
    if (!el) return;
    if (!url) {
      if (fallbackUrl) el.style.backgroundImage = `url('${fallbackUrl}')`;
      return;
    }
    const target = `url("${url}")`;
    if (el.style.backgroundImage === target) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      el.style.backgroundImage = `url('${url}')`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      console.log('Imagen aplicada en elemento:', el, url);
    };
    img.onerror = function (e) {
      console.warn('Error cargando imagen:', url, e);
      if (fallbackUrl) {
        el.style.backgroundImage = `url('${fallbackUrl}')`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        console.log('Fallback aplicado en elemento:', el, fallbackUrl);
      } else {
        el.style.backgroundImage = 'linear-gradient(135deg,#8fb8ff 0%,#cfcfff 100%)';
      }
    };
    img.src = url;
  }

  // Devuelve el valor horario para la hora indicada (ISO) de la clave dada
  function getHourlyValue(data, key, timeISO) {
    try {
      if (!data || !data.hourly || !Array.isArray(data.hourly.time)) return null;
      const times = data.hourly.time;
      let idx = times.indexOf(timeISO);
      // fallback: buscar por la misma hora (YYYY-MM-DDTHH)
      if (idx === -1) {
        const prefix = (timeISO && timeISO.slice(0,13)) || null;
        if (prefix) {
          idx = times.findIndex(t => t.slice(0,13) === prefix);
        }
      }
      if (idx === -1) return null;
      const arr = data.hourly[key];
      if (!arr || !Array.isArray(arr)) return null;
      return arr[idx];
    } catch (e) {
      console.warn('getHourlyValue error', e);
      return null;
    }
  }

  // Determina el periodo del día a partir de una hora (0-23)
  function getPeriodFromHour(hour) {
    if (hour >= 0 && hour < 5) return 'madrugada';
    if (hour >= 5 && hour < 14) return 'dia';
    if (hour >= 14 && hour < 19) return 'tarde';
    return 'noche';
  }

  // -------------------------------------
  // Funciones para pronóstico horario y tarjetas
  // -------------------------------------
  function actualizarPronosticoHorario(data) {
    try {
      if (!data || !data.hourly || !data.hourly.time) return;
      
      const hourlyContainer = document.querySelector('.hourly-container');
      if (!hourlyContainer) return;
      
      // Obtener timezone de la ciudad si está disponible
      const cityTimezone = window.__hoy_debug?.cityTimezone || data.timezone || 'America/Tegucigalpa';
      
      // Obtener la hora actual en el timezone de la ciudad
      const now = new Date();
      const cityTimeOptions = { timeZone: cityTimezone, hour: 'numeric', hour12: false, minute: 'numeric' };
      const cityTimeStr = now.toLocaleString('en-US', cityTimeOptions);
      const [cityHour, cityMinute] = cityTimeStr.split(':').map(Number);
      
      // Encontrar el índice de la hora actual en los datos del API
      // El API retorna horas en formato ISO en el timezone de la ciudad
      let currentHourIndex = 0;
      
      for (let i = 0; i < data.hourly.time.length; i++) {
        const timeStr = data.hourly.time[i];
        // Parsear la hora del string ISO (ej: "2025-11-30T12:00")
        const hourMatch = timeStr.match(/T(\d{2}):/);
        if (hourMatch) {
          const dataHour = parseInt(hourMatch[1]);
          // Buscar la hora que coincida o sea la más cercana
          if (dataHour >= cityHour) {
            currentHourIndex = i;
            break;
          }
        }
      }
      
      // Limpiar contenido actual
      hourlyContainer.innerHTML = '';
      
      // Mostrar las próximas 12 horas desde la hora actual
      for (let i = 0; i < 12; i++) {
        const hourIndex = currentHourIndex + i;
        if (hourIndex >= data.hourly.time.length) break;
        
        const timeStr = data.hourly.time[hourIndex];
        const temp = data.hourly.temperature_2m[hourIndex];
        const weatherCode = data.hourly.weathercode[hourIndex];
        
        // Convertir temperatura según la unidad
        const displayTemp = unidad === 'F' ? cToF(temp) : Math.round(temp);
        
        // Determinar icono según código de clima
        let iconName = 'sunny-outline';
        if (weatherCode === 0) iconName = 'sunny-outline';
        else if (weatherCode <= 2) iconName = 'partly-sunny-outline';
        else if (weatherCode === 3) iconName = 'cloudy-outline';
        else if (weatherCode >= 61 && weatherCode <= 65) iconName = 'rainy-outline';
        else if (weatherCode >= 95) iconName = 'thunderstorm-outline';
        else if (weatherCode >= 71 && weatherCode <= 75) iconName = 'snow-outline';
        
        // Mostrar "Ahora" para la primera hora (hora actual)
        // Para las siguientes horas, parsear la hora directamente del string ISO
        let timeLabel;
        if (i === 0) {
          timeLabel = 'Ahora';
        } else {
          // El API retorna en formato ISO: "2025-11-30T12:00"
          // La hora ya está en el timezone local de la ciudad
          const hourMatch = timeStr.match(/T(\d{2}):/);
          if (hourMatch) {
            const hour24 = parseInt(hourMatch[1]);
            const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
            const ampm = hour24 >= 12 ? 'PM' : 'AM';
            timeLabel = `${hour12}:00 ${ampm}`;
          } else {
            timeLabel = `${i}:00`;
          }
        }
        
        const hourItem = document.createElement('div');
        hourItem.className = 'hourly-item';
        hourItem.innerHTML = `
          <div class="hour-time">${timeLabel}</div>
          <ion-icon name="${iconName}"></ion-icon>
          <div class="hour-temp">${displayTemp}°</div>
        `;
        
        hourlyContainer.appendChild(hourItem);
      }
    } catch (e) {
      console.warn('Error actualizando pronóstico horario:', e);
    }
  }

  // Índice de hora "actual" en series horarias (misma lógica que pronóstico por horas)
  function findCurrentHourIndex(data) {
    if (!data || !data.hourly || !Array.isArray(data.hourly.time)) return 0;
    const cityTimezone = (window.__hoy_debug && window.__hoy_debug.cityTimezone) || data.timezone || 'America/Tegucigalpa';
    const now = new Date();
    const cityTimeStr = now.toLocaleString('en-US', { timeZone: cityTimezone, hour: 'numeric', hour12: false, minute: 'numeric' });
    const [cityHour] = cityTimeStr.split(':').map(Number);
    let currentHourIndex = 0;
    for (let i = 0; i < data.hourly.time.length; i++) {
      const hourMatch = String(data.hourly.time[i]).match(/T(\d{2}):/);
      if (hourMatch) {
        const dataHour = parseInt(hourMatch[1], 10);
        if (dataHour >= cityHour) {
          currentHourIndex = i;
          break;
        }
      }
    }
    return currentHourIndex;
  }

  let chartTempInstance = null;
  let chartPrecipInstance = null;

  function destroyForecastCharts() {
    try {
      if (chartTempInstance) { chartTempInstance.destroy(); chartTempInstance = null; }
    } catch (e) { /* noop */ }
    try {
      if (chartPrecipInstance) { chartPrecipInstance.destroy(); chartPrecipInstance = null; }
    } catch (e) { /* noop */ }
  }

  function chartThemeColors() {
    const dark = document.body.classList.contains('dark-theme');
    return {
      text: dark ? '#94a3b8' : '#64748b',
      grid: dark ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)',
      line: dark ? '#38bdf8' : '#0284c7',
      fillTop: dark ? 'rgba(56,189,248,0.28)' : 'rgba(2,132,199,0.22)',
      fillBot: dark ? 'rgba(56,189,248,0.02)' : 'rgba(2,132,199,0.02)',
      bar: dark ? 'rgba(56,189,248,0.55)' : 'rgba(2,132,199,0.45)',
      barBorder: dark ? '#38bdf8' : '#0284c7'
    };
  }

  function actualizarGraficas(data) {
    if (typeof Chart === 'undefined') return;
    const canvasTemp = document.getElementById('chart-temp-hourly');
    const canvasPrecip = document.getElementById('chart-precip-hourly');
    if (!canvasTemp || !canvasPrecip || !data || !data.hourly || !data.hourly.time) return;

    const hourly = data.hourly;
    const H = 24;
    const idx = findCurrentHourIndex(data);
    const labels = [];
    const temps = [];
    const precips = [];

    for (let i = 0; i < H; i++) {
      const hi = idx + i;
      if (hi >= hourly.time.length) break;
      const timeStr = hourly.time[hi];
      let label = '';
      if (i === 0) label = 'Ahora';
      else {
        const m = String(timeStr).match(/T(\d{2}):/);
        label = m ? `${parseInt(m[1], 10)}h` : '';
      }
      labels.push(label);
      const t = hourly.temperature_2m[hi];
      if (unidad === 'F') {
        temps.push(Math.round((Number(t) * 9) / 5 + 32));
      } else {
        temps.push(Math.round(Number(t) * 10) / 10);
      }
      const pp = hourly.precipitation_probability && hourly.precipitation_probability[hi];
      precips.push(pp != null ? Math.round(Number(pp)) : 0);
    }

    if (!labels.length) return;

    const c = chartThemeColors();
    destroyForecastCharts();

    const hPx = canvasTemp.parentElement ? canvasTemp.parentElement.clientHeight : 220;
    const ctx = canvasTemp.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, Math.max(hPx, 160));
    gradient.addColorStop(0, c.fillTop);
    gradient.addColorStop(1, c.fillBot);

    chartTempInstance = new Chart(canvasTemp, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperatura',
          data: temps,
          borderColor: c.line,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointRadius: 2,
          pointHoverRadius: 6,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const v = ctx.parsed.y;
                return ' ' + v + '°' + unidad;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: c.grid },
            ticks: { color: c.text, maxRotation: 0, autoSkip: true, maxTicksLimit: 12 }
          },
          y: {
            grid: { color: c.grid },
            ticks: { color: c.text }
          }
        }
      }
    });

    chartPrecipInstance = new Chart(canvasPrecip, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Lluvia %',
          data: precips,
          backgroundColor: c.bar,
          borderColor: c.barBorder,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return ' ' + ctx.parsed.y + '%';
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: c.text, maxRotation: 0, autoSkip: true, maxTicksLimit: 12 }
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: c.grid },
            ticks: {
              color: c.text,
              callback: function (v) { return v + '%'; }
            }
          }
        }
      }
    });
  }

  function refreshChartsFromCache() {
    if (window.__hoy_lastForecastData) {
      actualizarGraficas(window.__hoy_lastForecastData);
    }
  }
  
  function actualizarTarjetasInfo(data) {
    try {
      if (!data) return;
      
      const now = new Date();
      const currentTimeISO = data.current_weather?.time || data.hourly?.time[0];
      
      // Probabilidad de lluvia
      const rainProb = getHourlyValue(data, 'precipitation_probability', currentTimeISO);
      const rainProbEl = document.getElementById('rain-prob');
      if (rainProbEl && rainProb !== null) {
        rainProbEl.textContent = `${Math.round(rainProb)}%`;
      }
      
      // Índice UV
      const uvIndex = getHourlyValue(data, 'uv_index', currentTimeISO);
      const uvValueEl = document.getElementById('uv-value');
      const uvSeverityEl = document.querySelector('.uv-severity');
      
      if (uvValueEl && uvIndex !== null) {
        const uvRounded = Math.round(uvIndex * 10) / 10;
        uvValueEl.textContent = uvRounded;
        
        // Cambiar severidad según valor
        if (uvSeverityEl) {
          if (uvRounded < 3) uvSeverityEl.textContent = 'Bajo';
          else if (uvRounded < 6) uvSeverityEl.textContent = 'Moderado';
          else if (uvRounded < 8) uvSeverityEl.textContent = 'Alto';
          else if (uvRounded < 11) uvSeverityEl.textContent = 'Muy alto';
          else uvSeverityEl.textContent = 'Extremo';
        }
      }
      
      // Calidad del aire (datos reales de Open-Meteo Air Quality API)
      const airQualityTextEl = document.getElementById('air-quality-text');
      const airQualityPmEl = document.querySelector('.air-quality-pm');
      
      if (airQualityTextEl) {
        if (data.airQuality) {
          // Usar datos reales de la API
          const pm25 = data.airQuality.pm2_5;
          const usAqi = data.airQuality.us_aqi;
          
          // Determinar calidad según índice US AQI
          let airQuality = 'Buena';
          if (usAqi !== undefined && usAqi !== null) {
            if (usAqi <= 50) airQuality = 'Buena';
            else if (usAqi <= 100) airQuality = 'Moderada';
            else if (usAqi <= 150) airQuality = 'Dañina para grupos sensibles';
            else if (usAqi <= 200) airQuality = 'Dañina';
            else if (usAqi <= 300) airQuality = 'Muy dañina';
            else airQuality = 'Peligrosa';
          } else if (pm25 !== undefined && pm25 !== null) {
            // Fallback a PM2.5 si no hay AQI
            if (pm25 <= 12) airQuality = 'Buena';
            else if (pm25 <= 35.4) airQuality = 'Moderada';
            else if (pm25 <= 55.4) airQuality = 'Dañina para grupos sensibles';
            else if (pm25 <= 150.4) airQuality = 'Dañina';
            else airQuality = 'Muy dañina';
          }
          
          airQualityTextEl.textContent = airQuality;
          if (airQualityPmEl && pm25 !== undefined && pm25 !== null) {
            airQualityPmEl.textContent = `PM 2.5: ${pm25.toFixed(1)} μg/m³`;
          }
        } else {
          // Fallback si no hay datos disponibles
          airQualityTextEl.textContent = 'No disponible';
          if (airQualityPmEl) {
            airQualityPmEl.textContent = 'Datos no disponibles';
          }
        }
      }
      
      // Amanecer y atardecer (usando timezone de la ciudad)
      if (data.daily && data.daily.sunrise && data.daily.sunset) {
        const sunTimesEl = document.getElementById('sun-times-data');
        if (sunTimesEl) {
          // Usar timezone de la ciudad si está disponible
          const cityTimezone = data.timezone || 'America/Tegucigalpa';
          
          // Las fechas vienen en formato ISO desde la API (ej: "2025-11-30T12:18")
          // Ya están en el timezone local de la ciudad, solo necesitamos formatearlas
          const sunriseStr = data.daily.sunrise[0];
          const sunsetStr = data.daily.sunset[0];
          
          // Parsear las horas directamente del string ISO
          const sunriseHour = parseInt(sunriseStr.split('T')[1].split(':')[0]);
          const sunriseMin = sunriseStr.split('T')[1].split(':')[1];
          const sunsetHour = parseInt(sunsetStr.split('T')[1].split(':')[0]);
          const sunsetMin = sunsetStr.split('T')[1].split(':')[1];
          
          // Formatear a 12 horas con AM/PM
          const formatTime12 = (hour, min) => {
            const period = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12.toString().padStart(2, '0')}:${min} ${period}`;
          };
          
          const sunriseTime = formatTime12(sunriseHour, sunriseMin);
          const sunsetTime = formatTime12(sunsetHour, sunsetMin);
          
          sunTimesEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
              <ion-icon name="arrow-up-outline" style="font-size: 1.2rem;"></ion-icon>
              ${sunriseTime}
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.3rem; justify-content: center;">
              <ion-icon name="arrow-down-outline" style="font-size: 1.2rem;"></ion-icon>
              ${sunsetTime}
            </div>
          `;
        }
      }
    } catch (e) {
      console.warn('Error actualizando tarjetas de información:', e);
    }
  }

  // Mensajes de resumen por periodo y por tipo de clima.
  // Cada clave de periodo (madrugada,dia,tarde,noche) mapea a un objeto
  // con claves de clima (despejado, parcialmenteDespejado, nublado, niebla,
  // lluviaLigera, lluviaModerada, chubascos, tormenta, nieveLigera).
  const resumenPorPeriodo = {
    madrugada: {
      despejado: 'Madrugada tranquila y despejada, ideal para descanso.',
      parcialmenteDespejado: 'Madrugada parcialmente nublada, con claros ocasionales.',
      nublado: 'Cielo nublado durante la madrugada, ambiente fresco.',
      niebla: 'Mucha niebla por la madrugada en zonas bajas.',
      lluviaLigera: 'Lloviznas aisladas durante la madrugada.',
      lluviaModerada: 'Lluvias moderadas a primeras horas de la madrugada.',
      chubascos: 'Chubascos dispersos durante la madrugada.',
      tormenta: 'Posibles tormentas eléctricas en la madrugada — precaución.',
      nieveLigera: 'Posible precipitación invernal ligera en zonas altas durante la madrugada.'
    },
    dia: {
      despejado: 'Día soleado y agradable, buena visibilidad para actividades.',
      parcialmenteDespejado: 'Día parcialmente nublado, con ratos de sol.',
      nublado: 'Jornada nublada con poca radiación solar.',
      niebla: 'Niebla matinal que puede disiparse durante el día.',
      lluviaLigera: 'Llueve de forma ligera en algunos sectores durante el día.',
      lluviaModerada: 'Lluvias moderadas que podrían afectar actividades al aire libre.',
      chubascos: 'Chubascos intermitentes durante la jornada.',
      tormenta: 'Día con riesgo de tormentas eléctricas: mantener precaución.',
      nieveLigera: 'Nieve ligera en altura; condiciones frías durante el día.'
    },
    tarde: {
      despejado: 'Tarde despejada, ideal para paseos y actividades al aire libre.',
      parcialmenteDespejado: 'Tarde parcialmente nublada con intervalos de sol.',
      nublado: 'Tarde predominantemente nublada.',
      niebla: 'Niebla persistente por la tarde en algunas zonas bajas.',
      lluviaLigera: 'Llueve de forma ligera durante la tarde.',
      lluviaModerada: 'Lluvias moderadas por la tarde, posible acumulación local.',
      chubascos: 'Chubascos fuertes y localizados durante la tarde.',
      tormenta: 'Tarde con riesgo alto de tormentas eléctricas.',
      nieveLigera: 'Posible nieve ligera en zonas altas durante la tarde.'
    },
    noche: {
      despejado: 'Noche despejada y fresca, buena visibilidad nocturna.',
      parcialmenteDespejado: 'Noche parcialmente nublada con claros dispersos.',
      nublado: 'Noche nublada y más fría de lo habitual.',
      niebla: 'Niebla nocturna que puede reducir la visibilidad en carreteras.',
      lluviaLigera: 'Lloviznas por la noche en sectores aislados.',
      lluviaModerada: 'Lluvias moderadas durante la noche, tome precauciones.',
      chubascos: 'Chubascos nocturnos que podrían ser intensos en intervalos.',
      tormenta: 'Noche con probabilidad de tormentas eléctricas.',
      nieveLigera: 'Nieve ligera en altitudes altas durante la noche.'
    }
  };

  function cargarMunicipios() {
    // Si el archivo `js/municipios.js` fue incluido y define `window.municipiosData`, úsalo directamente.
    // Esto es útil cuando se abre la app desde file:// o cuando no hay acceso al raw remoto.
    try {
      if (window && window.municipiosData && typeof window.municipiosData === 'object') {
        console.log('Usando municipios desde window.municipiosData');
        return Promise.resolve(window.municipiosData);
      }
    } catch (e) {
      // continuar con la estrategia de fetch si ocurre algún error
    }

    // Preferir copia local (más fiable sin CORS/file://). Si falla, intentar remoto y finalmente fallback.
    // Usar fetchWithRetries para mayor resiliencia.
    return fetchWithRetries(LOCAL_URL, {}, 1)
      .catch(errLocal => {
        console.warn('Fetch local falló o no existe:', errLocal, 'Intentando remoto con reintentos...');
        return fetchWithRetries(REMOTE_URL, {}, 2)
          .catch(errRemote => {
            console.warn('Fetch remoto también falló:', errRemote, 'Usando fallback en memoria.');
            return FALLBACK_MUNICIPIOS;
          });
      });
  }

  // -------------------------------------
  // Clima: fetch y mostrar
  // -------------------------------------
  function obtenerClimaPorCoords(lat, lon) {
    if (!lat || !lon) {
      console.warn('obtenerClimaPorCoords recibió coords inválidas', lat, lon);
      return;
    }
    setWeatherPanelLoading(true);
    console.log('Solicitando Open-Meteo para coords:', lat, lon);
    // pedir variables horarias adicionales, daily (sunrise/sunset), y timezone=auto
    const hourlyParams = 'temperature_2m,relativehumidity_2m,weathercode,pressure_msl,visibility,dewpoint_2m,windspeed_10m,precipitation_probability,uv_index,apparent_temperature';
    const dailyParams = 'sunrise,sunset,uv_index_max';
    const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=${hourlyParams}&daily=${dailyParams}&timezone=auto&forecast_days=2`;
    
    // API de calidad de aire (datos reales internacionales)
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,us_aqi&timezone=auto`;

    // Solicitar ambas APIs en paralelo
    Promise.all([
      fetchWithRetries(omUrl, {}, 2),
      fetchWithRetries(airQualityUrl, {}, 2).catch(err => {
        console.warn('Error obteniendo calidad del aire:', err);
        return null; // No fallar si la API de aire no está disponible
      })
    ]).then(([data, airQualityData]) => {
        if (!data || !data.current_weather) {
          console.warn('Open-Meteo no devolvió current_weather', data);
          return;
        }
        
        // Guardar datos de calidad de aire para usar en actualizarTarjetasInfo
        if (airQualityData && airQualityData.current) {
          data.airQuality = airQualityData.current;
        }
        
        mostrarClima(data.current_weather, data);
        
        // Actualizar pronóstico por hora
        actualizarPronosticoHorario(data);
        
        // Actualizar tarjetas de información
        actualizarTarjetasInfo(data);

        window.__hoy_lastForecastData = data;
        actualizarGraficas(data);

        // Intentar poblar métricas detalladas si los elementos existen
        try {
          const timeISO = data.current_weather.time;
          console.log('Open-Meteo hourly keys:', data.hourly ? Object.keys(data.hourly) : 'no hourly');
          console.log('current_weather.time=', timeISO);
          const humidity = getHourlyValue(data, 'relativehumidity_2m', timeISO);
          const pressure = getHourlyValue(data, 'pressure_msl', timeISO);
          const visibility = getHourlyValue(data, 'visibility', timeISO);
          const dewpoint = getHourlyValue(data, 'dewpoint_2m', timeISO);
          const windspeed = (data.current_weather && data.current_weather.windspeed) || getHourlyValue(data, 'windspeed_10m', timeISO);

          const setIf = (id, text) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.textContent = text;
          };

          // helper: Celsius -> Fahrenheit (rounded)
          const cToF = c => Math.round((c * 9/5) + 32);

          // convert dewpoint if necessary
          let dewDisplay = '--';
          if (dewpoint != null) {
            const dp = unidad === 'F' ? cToF(dewpoint) : Math.round(dewpoint);
            dewDisplay = `${dp}°${unidad}`;
          }

          setIf('detail-wind', windspeed ? `${Math.round(windspeed)} km/h` : '--');
          setIf('detail-humidity', humidity ? `${Math.round(humidity)}%` : '--');
          setIf('detail-visibility', visibility ? `${Math.round(visibility/1000)} km` : '--');
          setIf('detail-pressure', pressure ? `${Math.round(pressure)} mbar` : '--');
          setIf('detail-dewpoint', dewDisplay);

          // resumen sencillo: mensaje por categoría de clima
          const climaKey = mapClima[data.current_weather.weathercode] || 'despejado';
          let resumen = '';

          // obtener temperaturas si están disponibles (para adjuntar opcionalmente)
          let minT = null, maxT = null;
          try {
            if (data.hourly && Array.isArray(data.hourly.temperature_2m)) {
              const slice = data.hourly.temperature_2m.slice(0, 24);
              if (slice.length) {
                minT = Math.round(Math.min(...slice));
                maxT = Math.round(Math.max(...slice));
              }
            }
          } catch (e) { /* ignorar */ }

          const resumenPorClima = {
            despejado: 'Hoy el día está soleado',
            parcialmenteDespejado: 'Hoy estará parcialmente nublado',
            nublado: 'Hoy estará nublado',
            niebla: 'Habrá niebla en algunas zonas',
            lluviaLigera: 'Se esperan lloviznas ligeras',
            lluviaModerada: 'Se esperan lluvias moderadas',
            chubascos: 'Habrá chubascos dispersos',
            tormenta: 'Se esperan tormentas eléctricas',
            nieveLigera: 'Se espera nieve ligera'
          };

          resumen = resumenPorClima[climaKey] || (document.getElementById('weather-desc')?.textContent || 'Clima indefinido');

          // Añadir nota sobre alta/baja dependiendo del periodo del día
          try {
            const timeISO = (data.current_weather && data.current_weather.time) ? data.current_weather.time : null;
            const hourForPeriod = timeISO ? new Date(timeISO).getHours() : new Date().getHours();
            const periodo = getPeriodFromHour(hourForPeriod); // 'madrugada','dia','tarde','noche'
            const currentTemp = (data.current_weather && data.current_weather.temperature != null) ? Math.round(data.current_weather.temperature) : null;

            // preparar valores de mínima/máxima para mostrar (convertir a F si corresponde)
            const displayMin = (minT !== null) ? (unidad === 'F' ? cToF(minT) : minT) : null;
            const displayMax = (maxT !== null) ? (unidad === 'F' ? cToF(maxT) : maxT) : null;

            let periodNote = '';
            if (periodo === 'dia' || periodo === 'tarde') {
              // usar la máxima si está disponible, si no estimar usando currentTemp +4
              if (displayMax !== null) {
                periodNote = `. Tendrá una alta de ${displayMax}°${unidad}.`;
              } else if (currentTemp !== null) {
                let guessedHigh = Math.round(currentTemp + 4);
                if (unidad === 'F') guessedHigh = cToF(guessedHigh);
                periodNote = `. Se espera una alta de ${guessedHigh}°${unidad}.`;
              } else {
                periodNote = `. Se espera un aumento de temperatura durante el día.`;
              }
            } else {
              // madrugada o noche: hablar de la baja
              if (displayMin !== null) {
                periodNote = `. Tendrá una baja de ${displayMin}°${unidad}.`;
              } else if (currentTemp !== null) {
                let guessedLow = Math.round(currentTemp - 4);
                if (unidad === 'F') guessedLow = cToF(guessedLow);
                periodNote = `. Se espera una baja de ${guessedLow}°${unidad}.`;
              } else {
                periodNote = `. Se espera un descenso de temperatura durante la noche.`;
              }
            }

            resumen += periodNote;
          } catch (e) {
            console.warn('Error construyendo nota de alta/baja:', e);
          }

          const summEl = document.getElementById('summary-sentence');
          if (summEl) summEl.textContent = resumen || '--';
        } catch (e) {
          console.warn('No se pudieron poblar detalles horarios:', e);
        }
      })
      .catch(err => {
        console.error('Error fetch Open-Meteo:', err);
        // Informar al usuario y, si tenemos última ubicación, intentar mostrar al menos algo.
        try {
          const summEl = document.getElementById('summary-sentence');
          if (summEl) summEl.textContent = 'No se pudieron obtener los datos meteorológicos en este momento.';
        } catch (e) {}
      })
      .finally(() => {
        setWeatherPanelLoading(false);
      });
  }

  function obtenerClimaPorMunicipio(muni, depto) {
    // Intentar uso de mapa rápido si se conoce, si no usar geocoding (Nominatim)
    const coordenadas = {
      "San Pedro Sula": { lat: 15.5, lon: -88.0 },
      "Tegucigalpa": { lat: 14.1, lon: -87.2 },
      "La Ceiba": { lat: 15.77, lon: -86.78 }
    };

    if (coordenadas[muni]) {
      ultimaUbicacion = coordenadas[muni];
      obtenerClimaPorCoords(coordenadas[muni].lat, coordenadas[muni].lon);
      return;
    }

    setWeatherPanelLoading(true);
    // Si no hay coordenadas predefinidas, consultar Nominatim para geocodificar "municipio, departamento, Honduras"
    try {
      const q = encodeURIComponent(`${muni}, ${depto}, Honduras`);
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1&addressdetails=1&accept-language=es`;
      fetchWithRetries(nomUrl, { headers: { 'User-Agent': 'Proyecto_Clima/1.0 (contacto@example.com)' } }, 2)
        .then(results => {
          if (!results || !Array.isArray(results) || results.length === 0) {
            console.warn('Nominatim no devolvió resultados para:', muni, depto);
            const summEl = document.getElementById('summary-sentence');
            if (summEl) summEl.textContent = `No se encontraron coordenadas para ${muni}, ${depto}.`;
            setWeatherPanelLoading(false);
            return;
          }
          const r = results[0];
          const lat = parseFloat(r.lat);
          const lon = parseFloat(r.lon);
          if (!isFinite(lat) || !isFinite(lon)) {
            console.warn('Coordenadas inválidas recibidas de Nominatim', r);
            const summEl = document.getElementById('summary-sentence');
            if (summEl) summEl.textContent = `No se pudieron determinar coordenadas para ${muni}.`;
            setWeatherPanelLoading(false);
            return;
          }
          ultimaUbicacion = { lat, lon };
          obtenerClimaPorCoords(lat, lon);
        })
        .catch(err => {
          console.error('Error geocoding Nominatim:', err);
          const summEl = document.getElementById('summary-sentence');
          if (summEl) summEl.textContent = `No se pudieron obtener coordenadas para ${muni}.`;
          setWeatherPanelLoading(false);
        });
    } catch (e) {
      console.error('Error preparando geocoding para municipio:', e);
      setWeatherPanelLoading(false);
    }
  }

  function mostrarClima(current, data) {
    console.log('mostrarClima llamado', { current, data });
    if (!current || !data) return;

    // Obtener timezone de la ciudad (si está disponible)
    const cityTimezone = data.timezone || 'America/Tegucigalpa';
    const cityTimezoneAbbr = data.timezone_abbreviation || 'GMT-6';
    
    // Hora local del usuario (para actualización)
    const hora = new Date();
    const upEl = safeEl(updateTime);
    const updateTimeStr = hora.toLocaleTimeString('es-HN',{hour:'2-digit',minute:'2-digit', hour12: true}).toUpperCase();
    upEl && (upEl.textContent = `desde ${updateTimeStr} CST`);

    // Hora de la ciudad usando su timezone
    let horaCiudad = new Date();
    try {
      const options = { 
        timeZone: cityTimezone, 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      };
      const timeString = horaCiudad.toLocaleTimeString('es-HN', options).toUpperCase();
      
      // Obtener el offset de GMT para el timezone de la ciudad
      const offsetOptions = { timeZone: cityTimezone, timeZoneName: 'shortOffset' };
      const formatter = new Intl.DateTimeFormat('en-US', offsetOptions);
      const parts = formatter.formatToParts(horaCiudad);
      const offsetPart = parts.find(p => p.type === 'timeZoneName');
      const gmtOffset = offsetPart ? offsetPart.value.replace('GMT', '') : cityTimezoneAbbr;
      
      const localTimeEl = document.getElementById('local-time');
      if (localTimeEl) {
        localTimeEl.textContent = `Hora: ${timeString} (GMT${gmtOffset})`;
      }
      
      // Obtener solo la hora para determinar el período
      const horaOptions = { timeZone: cityTimezone, hour: 'numeric', hour12: false };
      const horaActualCiudad = parseInt(horaCiudad.toLocaleTimeString('es-HN', horaOptions));
      
      // Guardar hora de la ciudad para usar en otras funciones
      window.__hoy_debug = window.__hoy_debug || {};
      window.__hoy_debug.cityHour = horaActualCiudad;
      window.__hoy_debug.cityTimezone = cityTimezone;
    } catch (e) {
      console.warn('Error al calcular hora de ciudad:', e);
    }

    // temperatura
    let temp = current.temperature;
    if (unidad === "F") temp = (temp * 9/5 + 32).toFixed(1);
    const tEl = safeEl(tempEl);
    tEl && (tEl.textContent = `${temp}°${unidad}`);

    // sensación térmica (calculada basada en temperatura, viento y humedad)
    const feelsLikeEl = document.getElementById('feels-like');
    if (feelsLikeEl) {
      const timeISO = current.time;
      const humidity = getHourlyValue(data, 'relativehumidity_2m', timeISO);
      const windspeed = current.windspeed || 0;
      const actualTemp = current.temperature;
      
      // Calcular sensación térmica
      let feelsTemp = actualTemp;
      
      // Si hace calor (>27°C), usar índice de calor con humedad
      if (actualTemp > 27 && humidity !== null) {
        const T = actualTemp;
        const RH = humidity;
        // Fórmula simplificada del índice de calor
        feelsTemp = T + 0.33 * (RH / 100 * 6.105 * Math.exp(17.27 * T / (237.7 + T))) - 0.7 * windspeed - 4;
      } 
      // Si hace frío (<10°C) y hay viento, usar sensación térmica por viento
      else if (actualTemp < 10 && windspeed > 4.8) {
        const T = actualTemp;
        const V = windspeed;
        // Fórmula de wind chill
        feelsTemp = 13.12 + 0.6215 * T - 11.37 * Math.pow(V, 0.16) + 0.3965 * T * Math.pow(V, 0.16);
      }
      // En condiciones normales, la sensación es muy similar a la temperatura real
      else {
        feelsTemp = actualTemp;
      }
      
      // Convertir a la unidad seleccionada
      if (unidad === "F") feelsTemp = Math.round((feelsTemp * 9/5) + 32);
      else feelsTemp = Math.round(feelsTemp);
      
      feelsLikeEl.textContent = `${feelsTemp}°`;
    }

    // descripcion
    const weatherMap = {
      0:"Despejado",1:"Principalmente despejado",2:"Parcialmente nublado",3:"Nublado",
      45:"Niebla",48:"Escarcha",51:"Llovizna ligera",61:"Lluvia ligera",63:"Lluvia moderada",
      71:"Nieve ligera",80:"Chubascos",95:"Tormenta"
    };
    const wdEl = safeEl(weatherDesc);
    wdEl && (wdEl.textContent = weatherMap[current.weathercode] || "Desconocido");

    // altas/bajas (defensivo) — convertir si unidad es F
    if (data.hourly && Array.isArray(data.hourly.temperature_2m)) {
      const arr = data.hourly.temperature_2m.slice(0,24);
      let maxTemp = Math.max(...arr);
      let minTemp = Math.min(...arr);
      if (unidad === 'F') {
        maxTemp = Math.round((maxTemp * 9/5) + 32);
        minTemp = Math.round((minTemp * 9/5) + 32);
      } else {
        maxTemp = Math.round(maxTemp);
        minTemp = Math.round(minTemp);
      }
      const hlEl = safeEl(highLowEl);
      hlEl && (hlEl.textContent = `Alta ${maxTemp}°${unidad} / Baja ${minTemp}°${unidad}`);
    }

    // icono
    const iconMap = {
      0:"https://openweathermap.org/img/wn/50d@2x.png",
      1:"https://openweathermap.org/img/wn/02d@2x.png",
      2:"https://openweathermap.org/img/wn/03d@2x.png",
      3:"https://openweathermap.org/img/wn/04d@2x.png",
      61:"https://openweathermap.org/img/wn/09d@2x.png",
      80:"https://openweathermap.org/img/wn/10d@2x.png",
      95:"https://openweathermap.org/img/wn/11d@2x.png"
    };
    const wIcon = safeEl(weatherIcon);
    if (wIcon) {
      wIcon.src = iconMap[current.weathercode] || iconMap[0];
      const desc = weatherMap[current.weathercode] || 'Condición del clima';
      wIcon.alt = desc;
    }

    // determinar periodo del día usando la hora de la ciudad
    const horaActual = window.__hoy_debug?.cityHour ?? hora.getHours();
    let periodoLocal = '';
    if (horaActual >= 0 && horaActual < 5) periodoLocal = 'madrugada';
    else if (horaActual >= 5 && horaActual < 14) periodoLocal = 'dia';
    else if (horaActual >= 14 && horaActual < 19) periodoLocal = 'tarde';
    else periodoLocal = 'noche';

    const climaKey = mapClima[current.weathercode] || 'despejado';
    const fondoURL = (fondosClima[periodoLocal] && fondosClima[periodoLocal][climaKey])
      ? fondosClima[periodoLocal][climaKey]
      : (fondosClima[periodoLocal] && fondosClima[periodoLocal].despejado) || FALLBACK_IMAGE;

    // Imagen de fondo solo en la cabecera index (.index-hero-weather-bg), según periodo + tipo de clima
    try {
      const elHero = safeEl(indexHeroBackdrop);
      if (elHero) {
        setBackgroundWithFallback(elHero, fondoURL, FALLBACK_IMAGE);
      } else {
        const elFallback = safeEl(cuadro2);
        if (elFallback) setBackgroundWithFallback(elFallback, fondoURL, FALLBACK_IMAGE);
      }
    } catch (e) {
      console.warn('No se pudo aplicar fondo en cabecera hero', e);
    }
  }

  // -------------------------------------
  // Refrescar segun última selección
  // -------------------------------------
  function refrescarClima() {
    const muniEl = safeEl(municipiosEl);
    const deptEl = safeEl(departamentosEl);
    if (muniEl && muniEl.value && deptEl && deptEl.value) {
      obtenerClimaPorMunicipio(muniEl.value, deptEl.value);
    } else if (ultimaUbicacion) {
      obtenerClimaPorCoords(ultimaUbacion.lat, ultimaUbicacion.lon);
    } else {
      console.log('No hay ubicación para refrescar.');
    }
  }

  // -------------------------------------
  // Inicialización
  // -------------------------------------
function init() {
    console.log('hoy.js: iniciando UI y carga de datos...');
    
    const locEl = safeEl(locationText);

    if (locEl) {
        // Mientras carga
        locEl.classList.remove("location-default");
        locEl.classList.add("loading-location");
        locEl.textContent = "Cargando ubicación...";
    }

    // Simular obtención de ubicación luego de 2 segundos
    setTimeout(() => {
        mostrarUbicacionFinal(ubicacion);
    }, 2000);

    function mostrarUbicacionFinal(ubicacion) {
        if (!locEl) return;

        locEl.classList.remove("loading-location"); // quitar azul
        locEl.classList.add("location-text");    // poner negro
  
    }

    // Fondo inicial en hero (mismas claves que fondosClima: madrugada, dia, tarde, noche)
    try {
      const elHero = safeEl(indexHeroBackdrop);
      const target = elHero || safeEl(cuadro2);
      if (target) {
        const now = new Date();
        const h = now.getHours();
        let periodo = 'dia';
        if (h >= 0 && h < 5) periodo = 'madrugada';
        else if (h >= 5 && h < 14) periodo = 'dia';
        else if (h >= 14 && h < 19) periodo = 'tarde';
        else periodo = 'noche';
        const initialFondo = (fondosClima[periodo] && fondosClima[periodo].despejado)
          ? fondosClima[periodo].despejado
          : FALLBACK_IMAGE;
        setBackgroundWithFallback(target, initialFondo, FALLBACK_IMAGE);
      }
    } catch (e) {
      console.warn('No se pudo aplicar fondo inicial en cabecera hero', e);
    }

    // cargar municipios (remote -> local -> fallback)
    cargarMunicipios().then(data => {
      console.log('Datos municipios listos', data && Object.keys(data).length);
      const deptEl = safeEl(departamentosEl);
      const muniEl = safeEl(municipiosEl);
      if (!deptEl) return;

      deptEl.innerHTML = '<option value="">Seleccionar departamento</option>';
      for (let depto in data) {
        const option = document.createElement("option");
        option.value = depto;
        option.textContent = depto;
        deptEl.appendChild(option);
      }

      if (deptEl) {
        deptEl.addEventListener("change", () => {
          const depto = deptEl.value;
          // always operate on the live DOM node for municipios
          const liveMuni = document.getElementById('municipios');
          if (!liveMuni) return;
          // reset municipio select
          liveMuni.innerHTML = '<option value="">Seleccionar municipio</option>';
          if (depto && data[depto]) {
            data[depto].forEach(mun => {
              const opt = document.createElement("option");
              opt.value = mun;
              opt.textContent = mun;
              liveMuni.appendChild(opt);
            });
          }
          // clear selection UI
          try { const summEl = document.getElementById('summary-sentence'); if (summEl) summEl.textContent = 'Selecciona un municipio...'; } catch (e) {}
          try { const tEl = document.getElementById('temp'); if (tEl) tEl.textContent = '--°'; } catch (e) {}
          try { const upEl = document.getElementById('update-time'); if (upEl) upEl.textContent = ''; } catch (e) {}
        });
      }
    });

    // Delegated handler: escuchar cambios en el select de municipios usando delegación
    document.addEventListener('change', (ev) => {
      try {
        const target = ev.target;
        if (!target || target.id !== 'municipios') return;
        const depto = (document.getElementById('departamentos') && document.getElementById('departamentos').value) || null;
        const muni = target.value;
        if (depto && muni) {
          // mostrar estado de carga
          const summEl = document.getElementById('summary-sentence'); if (summEl) summEl.textContent = 'Cargando clima...';
          const tEl = document.getElementById('temp'); if (tEl) tEl.textContent = '--°';
          const upEl = document.getElementById('update-time'); if (upEl) upEl.textContent = 'Actualizando...';
          ultimaUbicacion = null;
          const locEl2 = safeEl(locationText);
          locEl2 && (locEl2.textContent = `${muni}, ${depto}, Honduras`);
          obtenerClimaPorMunicipio(muni, depto);
        }
      } catch (e) {
        console.warn('Error manejando cambio de municipios:', e);
      }
    });

    // refresh button (si existe) — anima, muestra loading y actualiza según selección/ubicación
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        try { refreshBtn.disabled = true; refreshBtn.classList.add('spinning'); } catch (e) {}

        // UI loading indicators
        try { const summEl = document.getElementById('summary-sentence'); if (summEl) summEl.textContent = 'Actualizando...'; } catch (e) {}
        try { const tEl = document.getElementById('temp'); if (tEl) tEl.textContent = '--°'; } catch (e) {}
        try { const upEl = document.getElementById('update-time'); if (upEl) upEl.textContent = 'Actualizando...'; } catch (e) {}

        try {
          const deptElNow = safeEl(departamentosEl);
          const muniElNow = safeEl(municipiosEl);
          if (deptElNow && muniElNow && deptElNow.value && muniElNow.value) {
            console.log('Refresh: usando selección actual', deptElNow.value, muniElNow.value);
            obtenerClimaPorMunicipio(muniElNow.value, deptElNow.value);
          } else if (ultimaUbicacion) {
            console.log('Refresh: usando última ubicación', ultimaUbicacion);
            obtenerClimaPorCoords(ultimaUbicacion.lat, ultimaUbicacion.lon);
          } else if (navigator.geolocation) {
            console.log('Refresh: sin selección, intentando geolocalización...');
            navigator.geolocation.getCurrentPosition(pos => {
              ultimaUbicacion = { lat: pos.coords.latitude, lon: pos.coords.longitude };
              obtenerClimaPorCoords(pos.coords.latitude, pos.coords.longitude);
            }, err => {
              console.warn('Geolocation failed during refresh:', err);
              const summEl = document.getElementById('summary-sentence'); if (summEl) summEl.textContent = 'No se pudo obtener ubicación.';
            });
          } else {
            console.log('Refresh: no hay ubicación para refrescar.');
            const summEl = document.getElementById('summary-sentence'); if (summEl) summEl.textContent = 'Selecciona un municipio o permite geolocalización.';
          }
        } catch (e) {
          console.warn('Error during refresh click:', e);
        } finally {
          try { setTimeout(() => { refreshBtn.classList.remove('spinning'); refreshBtn.disabled = false; }, 900); } catch (e) {}
        }
      });
    }

    // Delegated click handler as fallback in case the button element is replaced
    document.addEventListener('click', function (ev) {
      try {
        const target = ev.target && ev.target.closest && ev.target.closest('#refresh-btn');
        if (!target) return;
        // mimic the behavior of the direct handler
        try { target.disabled = true; target.classList.add('spinning'); } catch (e) {}
        const summEl = document.getElementById('summary-sentence'); if (summEl) summEl.textContent = 'Actualizando...';
        const tEl = document.getElementById('temp'); if (tEl) tEl.textContent = '--°';
        const upEl = document.getElementById('update-time'); if (upEl) upEl.textContent = 'Actualizando...';
        try {
          const deptElNow = safeEl(departamentosEl);
          const muniElNow = safeEl(municipiosEl);
          if (deptElNow && muniElNow && deptElNow.value && muniElNow.value) {
            obtenerClimaPorMunicipio(muniElNow.value, deptElNow.value);
          } else if (ultimaUbicacion) {
            obtenerClimaPorCoords(ultimaUbicacion.lat, ultimaUbicacion.lon);
          } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
              ultimaUbicacion = { lat: pos.coords.latitude, lon: pos.coords.longitude };
              obtenerClimaPorCoords(pos.coords.latitude, pos.coords.longitude);
            }, () => {});
          }
        } catch (e) { console.warn('Delegated refresh error', e); }
        try { setTimeout(() => { target.classList.remove('spinning'); target.disabled = false; }, 900); } catch (e) {}
      } catch (e) {}
    });

    // botones de unidad: actualizar unidad, estilo y refrescar (funciona con ubicación actual)
    (function setupUnitButtons(){
      const cBtn = document.getElementById("celsius-btn");
      const fBtn = document.getElementById("fahrenheit-btn");
      if (!cBtn || !fBtn) return;

      const applyButtonStyle = () => {
        if (unidad === 'C') {
          cBtn.classList.add('btn-primary'); cBtn.classList.remove('btn-light');
          cBtn.textContent = '°C';
          fBtn.classList.remove('btn-primary'); fBtn.classList.add('btn-light');
          fBtn.textContent = '°F';
        } else {
          fBtn.classList.add('btn-primary'); fBtn.classList.remove('btn-light');
          fBtn.textContent = '°F';
          cBtn.classList.remove('btn-primary'); cBtn.classList.add('btn-light');
          cBtn.textContent = '°C';
        }
      };

      // Convierte los valores de temperatura actualmente mostrados en la página
      const convertDisplayedTemps = (fromUnit, toUnit) => {
        if (fromUnit === toUnit) return;

        // current temp
        const tEl = document.getElementById('temp');
        if (tEl && tEl.textContent) {
          const m = tEl.textContent.match(/(-?\d+\.?\d*)/);
          if (m) {
            const n = Number(m[1]);
            const converted = (fromUnit === 'C' && toUnit === 'F') ? cToF(n) : (fromUnit === 'F' && toUnit === 'C') ? fToC(n) : Math.round(n);
            tEl.textContent = `${converted}°${toUnit}`;
          }
        }

        // high-low (format: "Día X°{unit} / Noche Y°{unit}")
        const hlEl = document.getElementById('high-low');
        if (hlEl && hlEl.textContent) {
          const nums = hlEl.textContent.match(/-?\d+\.?\d*/g);
          if (nums && nums.length >= 2) {
            const a = Number(nums[0]);
            const b = Number(nums[1]);
            const ca = (fromUnit === 'C' && toUnit === 'F') ? cToF(a) : (fromUnit === 'F' && toUnit === 'C') ? fToC(a) : Math.round(a);
            const cb = (fromUnit === 'C' && toUnit === 'F') ? cToF(b) : (fromUnit === 'F' && toUnit === 'C') ? fToC(b) : Math.round(b);
            hlEl.textContent = `Alta ${ca}°${toUnit} / Baja ${cb}°${toUnit}`;
          }
        }

        // dew point detail
        const dewEl = document.getElementById('detail-dewpoint');
        if (dewEl && dewEl.textContent && dewEl.textContent.indexOf('--') === -1) {
          const m2 = dewEl.textContent.match(/(-?\d+\.?\d*)/);
          if (m2) {
            const n = Number(m2[1]);
            const conv = (fromUnit === 'C' && toUnit === 'F') ? cToF(n) : (fromUnit === 'F' && toUnit === 'C') ? fToC(n) : Math.round(n);
            dewEl.textContent = `${conv}°${toUnit}`;
          }
        }

        // summary: replace any degrees found in the sentence
        const summEl = document.getElementById('summary-sentence');
        if (summEl && summEl.textContent) {
          summEl.textContent = summEl.textContent.replace(/(-?\d+)°\s*[CF]?/g, (match, p1) => {
            const num = Number(p1);
            const conv = (fromUnit === 'C' && toUnit === 'F') ? cToF(num) : (fromUnit === 'F' && toUnit === 'C') ? fToC(num) : Math.round(num);
            return `${conv}°${toUnit}`;
          });
        }
      };

      cBtn.addEventListener('click', () => {
        const prev = unidad;
        if (prev === 'C') return;
        unidad = 'C';
        applyButtonStyle();
        convertDisplayedTemps(prev, unidad); // immediate
        refrescarClima(); // background fetch to ensure authoritative values
      });

      fBtn.addEventListener('click', () => {
        const prev = unidad;
        if (prev === 'F') return;
        unidad = 'F';
        applyButtonStyle();
        convertDisplayedTemps(prev, unidad); // immediate
        refrescarClima();
      });

      // inicializar estilos según la unidad por defecto
      applyButtonStyle();
    })();

    // geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        console.log('Geolocation OK', pos.coords);
        if (!safeEl(municipiosEl) || !safeEl(municipiosEl).value) {
          ultimaUbicacion = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          obtenerClimaPorCoords(pos.coords.latitude, pos.coords.longitude);

          // reverse geocoding (opcional) — usar reintentos para mayor resiliencia
          try {
            const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=es`;
            fetchWithRetries(nomUrl, { headers: { 'User-Agent': 'Proyecto_Clima/1.0 (contacto@example.com)' } }, 1)
              .then(data => {
                const city = data.address && (data.address.city || data.address.town || data.address.village) || "Desconocido";
                const state = data.address && data.address.state || "";
                const country = data.address && data.address.country || "";
                const locEl2 = safeEl(locationText);
                locEl2 && (locEl2.textContent = `${city}, ${state}, ${country}`);
              })
              .catch(() => {
                const locEl2 = safeEl(locationText);
                locEl2 && (locEl2.textContent = "Honduras");
              });
          } catch (e) {
            const locEl2 = safeEl(locationText);
            locEl2 && (locEl2.textContent = "Honduras");
          }
        }
      }, error => {
        console.warn('No se obtuvo geolocalización:', error);
        const locEl2 = safeEl(locationText);
        locEl2 && (locEl2.textContent = "Ubicación no disponible");
        ultimaUbicacion = { lat: 14.1, lon: -87.2 };
        obtenerClimaPorCoords(14.1, -87.2);
      });
    } else {
      const locEl2 = safeEl(locationText);
      locEl2 && (locEl2.textContent = "Geolocalización no soportada");
    }
  }

  // arrancar cuando el DOM está listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exposición para depuración desde consola
  window.__hoy_debug = {
    refrescarClima,
    obtenerClimaPorCoords,
    obtenerClimaPorMunicipio,
    mostrarClima,
    fondosClima,
    mapClima,
    setBackgroundWithFallback
  };

  window.__hoy_refreshCharts = refreshChartsFromCache;

  console.log('hoy.js cargado y listo.');
})();





// Toggle robusto: actualiza la variable CSS --sidebar-current-width
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('.toggle');
  const sidebar = document.querySelector('.sidebar') || document.querySelector('.navigation');

  if (!toggle) {
    // si no existe toggle no hacemos nada
    console.warn('Toggle button no encontrado (.toggle). Ignorando script de ajuste del sidebar.');
    return;
  }

  // Detectar valores iniciales (si quieres ajustarlos dinámicamente)
  const openWidth = getComputedStyle(root).getPropertyValue('--sidebar-open-width').trim() || '300px';
  const collapsedWidth = getComputedStyle(root).getPropertyValue('--sidebar-collapsed-width').trim() || '80px';

  // Estado local
  let collapsed = false;

  toggle.addEventListener('click', () => {
    collapsed = !collapsed;

    // actualizamos la variable CSS en :root — esto empuja/pulsa .main y mueve .toggle (porque left usa la variable)
    root.style.setProperty('--sidebar-current-width', collapsed ? collapsedWidth : openWidth);

    // opcional: mantener clases para estilo del sidebar (si tu CSS usa .closed o .active)
    if (sidebar) {
      sidebar.classList.toggle('closed', collapsed);
      sidebar.classList.toggle('active', !collapsed); // si usas .navigation.active, adaptalo
    }

    // si quieres también cambiar el icono/texto del botón:
    try {
      toggle.setAttribute('aria-pressed', String(collapsed));
    } catch (e) {}
  });

  // Opcional: forzar valor inicial (en caso de que actualizaciones previas hubieran dejado otro valor)
  root.style.setProperty('--sidebar-current-width', openWidth);
})();