/**
 * Utilidades compartidas para funcionalidad de clima
 * Consolidación de código duplicado de app.js, semana.js, pronóstico-diario.js
 */

// === Configuración global ===
let unidad = "metric";
const CLAVE_MAPTILER = '2i2ueuusXQQ6T0qtSbgL';

// Elementos DOM que deben ser inicializados por los archivos que importan esto
let selectCiudades = null;
let contenedorTarjetasDiarias = null;

// Mini-mapas
let miniMapaSuperior = null;
let miniMapaInferior = null;
let marcadorSuperior = null;
let marcadorInferior = null;
let circuloSuperior = null;
let circuloInferior = null;

/**
 * Actualiza metadatos de la ciudad seleccionada
 */
function actualizarMetaCiudad() {
  if (!selectCiudades) return;
  const valor = selectCiudades.value;
  const partes = valor.split("|");
  const nombre = partes[1], departamento = partes[2];
  const metaElement = document.getElementById("city-meta");
  if (metaElement) {
    metaElement.innerHTML = `<span style="font-weight:700">${nombre}</span> <span style="color:#7a7f97;">/</span> <span>${departamento}</span>`;
  }
}

/**
 * Inicializa los mini-mapas de Leaflet
 */
function inicializarMiniMapas() {
  const elementoMapaSuperior = document.getElementById('miniMapTop');
  if (!elementoMapaSuperior) return;

  const urlBase = (estilo='basic') =>
    `https://api.maptiler.com/maps/${estilo}/256/{z}/{x}/{y}.png?key=${CLAVE_MAPTILER}`;

  miniMapaSuperior = L.map('miniMapTop', { attributionControl: false, zoomControl: true })
    .setView([15.5007, -88.0244], 7);

  L.tileLayer(urlBase('basic'), { maxZoom: 19, crossOrigin: true }).addTo(miniMapaSuperior);

  marcadorSuperior = L.circleMarker([15.5007, -88.0244], { radius: 6, color: '#fff', fillColor: '#007bff', fillOpacity: 1 }).addTo(miniMapaSuperior);
  circuloSuperior = L.circle([15.5007, -88.0244], { radius: 60000, color: '#2b7cff55', fillColor: '#2b7cff33', weight: 0 }).addTo(miniMapaSuperior);

  setTimeout(() => miniMapaSuperior.invalidateSize(), 300);
}

/**
 * Actualiza la posición de los mini-mapas
 * @param {number} latitud - Latitud de la ubicación
 * @param {number} longitud - Longitud de la ubicación
 */
function actualizarMiniMapas(latitud, longitud) {
  if (miniMapaSuperior) {
    miniMapaSuperior.setView([latitud, longitud], 9);
    marcadorSuperior.setLatLng([latitud, longitud]);
    circuloSuperior.setLatLng([latitud, longitud]);
    miniMapaSuperior.invalidateSize();
  }
  if (miniMapaInferior) {
    miniMapaInferior.setView([latitud, longitud], 9);
    marcadorInferior.setLatLng([latitud, longitud]);
    circuloInferior.setLatLng([latitud, longitud]);
    miniMapaInferior.invalidateSize();
  }
}

/**
 * Carga datos de clima de la API OpenMeteo
 */
async function cargarClima() {
  if (!selectCiudades || !contenedorTarjetasDiarias) return;
  
  const valor = selectCiudades.value;
  const [coordenadas] = valor.split("|");
  const [latitud, longitud] = coordenadas.split(",");

  actualizarMiniMapas(parseFloat(latitud), parseFloat(longitud));

  const hoy = new Date();
  const fechaInicio = hoy.toISOString().split("T")[0];
  const fechaCierre = new Date(hoy.getTime() + 13*24*60*60*1000).toISOString().split("T")[0];

  const urlAPI = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,uv_index_max,sunrise,sunset,wind_speed_10m_max,relative_humidity_2m_mean&timezone=America/Tegucigalpa&start_date=${fechaInicio}&end_date=${fechaCierre}`;
  console.log("URL API:", urlAPI);

  try {
    const respuesta = await fetch(urlAPI);
    const datos = await respuesta.json();
    if (!datos.daily || !datos.daily.time) {
      contenedorTarjetasDiarias.innerHTML = "<div style='color:red'>No se obtuvieron datos de clima.</div>";
      return;
    }

    const dias = datos.daily.time.map((fecha, indice) => {
      const tempMaxC = datos.daily.temperature_2m_max[indice];
      const tempMinC = datos.daily.temperature_2m_min[indice];
      return {
        fecha: fecha,
        nombre: new Date(fecha).toLocaleDateString("es-ES", { weekday:"short", day:"numeric" }),
        tempMax: unidad==="metric"?Math.round(tempMaxC):Math.round(tempMaxC*9/5+32),
        tempMin: unidad==="metric"?Math.round(tempMinC):Math.round(tempMinC*9/5+32),
        icono: obtenerIconoClima(datos.daily.weathercode[indice]),
        desc: obtenerDescripcionClima(datos.daily.weathercode[indice]),
        lluvia: datos.daily.precipitation_probability_max ? datos.daily.precipitation_probability_max[indice] : "--",
        indiceUV: datos.daily.uv_index_max ? datos.daily.uv_index_max[indice] : "--",
        amanecer: datos.daily.sunrise ? datos.daily.sunrise[indice] : "--",
        atardecer: datos.daily.sunset ? datos.daily.sunset[indice] : "--",
        humedadMedia: datos.daily.relative_humidity_2m_mean ? datos.daily.relative_humidity_2m_mean[indice] : "--",
        velocidadVientoMax: datos.daily.wind_speed_10m_max ? datos.daily.wind_speed_10m_max[indice] : "--",
        indice: indice
      };
    });

    window.datosClimaGlobal = dias;
    return dias;
  } catch(err) {
    console.error(err);
    contenedorTarjetasDiarias.innerHTML = "<div style='color:red'>Error cargando el clima.</div>";
    return null;
  }
}

/**
 * Actualiza insignias de lluvia y viento
 */
function actualizarBadges(datosHoy){
  const badgeLluvia = document.getElementById('badge-rain');
  const badgeViento = document.getElementById('badge-wind');
  if(!datosHoy){
    if(badgeLluvia) badgeLluvia.textContent = 'Lluvia: --';
    if(badgeViento) badgeViento.textContent = 'Viento: --';
    return;
  }

  const probabilidad = Number(datosHoy.lluvia ?? 0);
  let textoLluvia = `Lluvia: ${probabilidad}%`;
  let claseLluvia = probabilidad>=60?'high':probabilidad>=30?'medium':'low';

  const valorViento = Number(datosHoy.velocidadVientoMax ?? 0);
  const textoViento = valorViento===0?'Viento: --':`Viento: ${valorViento} km/h`;
  let claseViento = valorViento>=40?'strong':'normal';

  if(badgeLluvia){ badgeLluvia.textContent = textoLluvia; badgeLluvia.className=`badge-pill badge-rain ${claseLluvia}`; }
  if(badgeViento){ badgeViento.textContent = textoViento; badgeViento.className=`badge-pill badge-wind ${claseViento}`; }
}

/**
 * Obtiene el icono del clima basado en código WMO
 */
function obtenerIconoClima(code){
  switch(code){
    case 0: return '<ion-icon name="sunny-outline" style="color:#f39c12;font-size:30px"></ion-icon>';
    case 1: case 2: return '<ion-icon name="partly-sunny-outline" style="color:#f1c40f;font-size:30px"></ion-icon>';
    case 3: return '<ion-icon name="cloud-outline" style="color:#7f8c8d;font-size:30px"></ion-icon>';
    case 45: case 48: return '<ion-icon name="cloudy-outline" style="color:#95a5a6;font-size:30px"></ion-icon>';
    case 51: case 53: case 55: return '<ion-icon name="rainy-outline" style="color:#3498db;font-size:30px"></ion-icon>';
    case 61: case 63: case 65: return '<ion-icon name="rainy-outline" style="color:#2980b9;font-size:30px"></ion-icon>';
    case 71: case 73: case 75: return '<ion-icon name="snow-outline" style="color:#ecf0f1;font-size:30px"></ion-icon>';
    case 80: case 81: case 82: return '<ion-icon name="rainy-outline" style="color:#1abc9c;font-size:30px"></ion-icon>';
    case 95: case 96: case 99: return '<ion-icon name="thunderstorm-outline" style="color:#8e44ad;font-size:30px"></ion-icon>';
    default: return '<ion-icon name="cloud-outline" style="color:#7f8c8d;font-size:30px"></ion-icon>';
  }
}

/**
 * Obtiene descripción del clima basada en código WMO
 */
function obtenerDescripcionClima(code){
  switch(code){
    case 0: return "Despejado";
    case 1: case 2: return "Parcialmente nublado";
    case 3: return "Nublado";
    case 45: case 48: return "Neblina";
    case 51: case 53: case 55: return "Llovizna";
    case 61: case 63: case 65: return "Lluvia";
    case 71: case 73: case 75: return "Nieve";
    case 80: case 81: case 82: return "Chubascos";
    case 95: case 96: case 99: return "Tormenta";
    default: return "Sin información";
  }
}

/**
 * Obtiene icono de humedad
 */
function obtenerIconoHumedad(){
  return '<ion-icon name="water-outline" style="color:#46b0ed;font-size:1.4em;vertical-align:-2px;"></ion-icon>';
}

/**
 * Obtiene icono de UV
 */
function obtenerIconoUV(){
  return '<ion-icon name="sunny-outline" style="color:#ffbb12;font-size:1.4em;vertical-align:-2px;"></ion-icon>';
}

/**
 * Obtiene icono de viento
 */
function obtenerIconoViento(){
  return '<ion-icon name="swap-horizontal-outline" style="color:#76baf7;font-size:1.4em;vertical-align:-2px;"></ion-icon>';
}

/**
 * Obtiene icono de lluvia
 */
function obtenerIconoLluvia(){
  return '<ion-icon name="rainy-outline" style="color:#3498db;font-size:1.4em;vertical-align:-2px;"></ion-icon>';
}

/**
 * Configura los selectores de unidades (Celsius/Fahrenheit)
 */
function configurarToggleUnidades(funcionCargarClima) {
  const btnCelsius = document.getElementById("celsius");
  const btnFahrenheit = document.getElementById("fahrenheit");
  
  if (btnCelsius) {
    btnCelsius.addEventListener("click", () => {
      unidad = "metric";
      funcionCargarClima();
      btnCelsius.classList.add("active");
      btnFahrenheit?.classList.remove("active");
    });
  }
  
  if (btnFahrenheit) {
    btnFahrenheit.addEventListener("click", () => {
      unidad = "imperial";
      funcionCargarClima();
      btnFahrenheit.classList.add("active");
      btnCelsius?.classList.remove("active");
    });
  }
}

/**
 * Inicializa los eventos del selector de ciudades
 */
function inicializarEventosCiudades(funcionCargarClima) {
  if (selectCiudades) {
    selectCiudades.addEventListener("change", () => {
      actualizarMetaCiudad();
      funcionCargarClima();
    });
  }
}
