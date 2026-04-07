/**
 * Alertas App - Controlador principal
 *
 * Orquesta la carga de datos meteorológicos, generación de alertas,
 * y actualización de todos los componentes de visualización
 */

const AlertasApp = {
  // Estado global de la aplicación
  state: {
    alerts: [],
    weatherData: [],
    filters: {
      severity: 'all',
      type: 'all',
      region: 'all'
    },
    lastUpdate: null,
    isLoading: false
  },

  // Principales ciudades de Honduras con coordenadas
  cities: [
    { name: 'Tegucigalpa', department: 'Francisco Morazán', lat: 14.0723, lon: -87.1921 },
    { name: 'San Pedro Sula', department: 'Cortés', lat: 15.5047, lon: -88.0251 },
    { name: 'La Ceiba', department: 'Atlántida', lat: 15.7697, lon: -86.7988 },
    { name: 'Choluteca', department: 'Choluteca', lat: 13.3011, lon: -87.1908 },
    { name: 'Comayagua', department: 'Comayagua', lat: 14.4500, lon: -87.6500 },
    { name: 'Juticalpa', department: 'Olancho', lat: 14.6658, lon: -86.2164 },
    { name: 'Danlí', department: 'El Paraíso', lat: 14.0333, lon: -86.5667 },
    { name: 'Santa Rosa de Copán', department: 'Copán', lat: 14.7667, lon: -88.7833 },
    { name: 'Siguatepeque', department: 'Comayagua', lat: 14.5989, lon: -87.8406 },
    { name: 'Tocoa', department: 'Colón', lat: 15.6500, lon: -85.9833 },
    { name: 'Puerto Cortés', department: 'Cortés', lat: 15.8489, lon: -87.9422 },
    { name: 'El Progreso', department: 'Yoro', lat: 15.4000, lon: -87.8000 },
    { name: 'Tela', department: 'Atlántida', lat: 15.7833, lon: -87.4500 },
    { name: 'Catacamas', department: 'Olancho', lat: 14.8489, lon: -85.9000 },
    { name: 'Olanchito', department: 'Yoro', lat: 15.4833, lon: -86.5667 },
    { name: 'Trujillo', department: 'Colón', lat: 15.9197, lon: -85.9608 },
    { name: 'La Lima', department: 'Cortés', lat: 15.4333, lon: -87.9167 },
    { name: 'Villanueva', department: 'Cortés', lat: 15.3167, lon: -88.0000 },
    { name: 'Santa Bárbara', department: 'Santa Bárbara', lat: 15.0167, lon: -88.2333 },
    { name: 'Yoro', department: 'Yoro', lat: 15.1333, lon: -87.1333 },
    { name: 'Gracias', department: 'Lempira', lat: 14.5833, lon: -88.5833 },
    { name: 'Marcala', department: 'La Paz', lat: 14.1500, lon: -88.0333 },
    { name: 'Nacaome', department: 'Valle', lat: 13.5333, lon: -87.4833 },
    { name: 'La Esperanza', department: 'Intibucá', lat: 14.3000, lon: -88.1833 },
    { name: 'Ocotepeque', department: 'Ocotepeque', lat: 14.4333, lon: -89.1833 },
    { name: 'Yuscarán', department: 'El Paraíso', lat: 13.9333, lon: -86.8500 },
    { name: 'Roatán', department: 'Islas de la Bahía', lat: 16.3225, lon: -86.5444 },
    { name: 'Intibucá', department: 'Intibucá', lat: 14.3167, lon: -88.1667 },
    { name: 'Nueva Ocotepeque', department: 'Ocotepeque', lat: 14.4333, lon: -89.1833 },
    { name: 'Copán Ruinas', department: 'Copán', lat: 14.8333, lon: -89.1500 },
    { name: 'Yuscaran', department: 'El Paraíso', lat: 13.9333, lon: -86.8500 }
  ],

  /**
   * Inicializa la aplicación de alertas
   */
  async init() {
    console.log('🚀 Inicializando Sistema de Alertas Meteorológicas...');

    try {
      // Mostrar estado de carga
      this.showLoading();

      // Cargar datos meteorológicos para todas las ciudades
      await this.loadWeatherData();

      // Generar alertas basadas en umbrales
      this.generateAlerts();

      // Inicializar componentes de visualización
      await this.initializeComponents();

      // Vincular eventos del DOM
      this.bindEventListeners();

      // Actualizar estadísticas en hero
      this.updateSummaryStats();

      // Iniciar actualización automática (cada 30 minutos)
      this.startAutoRefresh();

      // Ocultar estado de carga
      this.hideLoading();

      console.log(`✅ Sistema iniciado: ${this.state.alerts.length} alertas activas`);
    } catch (error) {
      console.error('❌ Error al inicializar la aplicación:', error);
      this.showError('Error al cargar alertas. Por favor, intente más tarde.');
      this.hideLoading();
    }
  },

  /**
   * Muestra el estado de carga
   */
  showLoading() {
    this.state.isLoading = true;
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
      loadingState.style.display = 'block';
    }
  },

  /**
   * Oculta el estado de carga
   */
  hideLoading() {
    this.state.isLoading = false;
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
      loadingState.style.display = 'none';
    }
  },

  /**
   * Carga datos meteorológicos para todas las ciudades
   */
  async loadWeatherData() {
    console.log(`📡 Cargando datos meteorológicos para ${this.cities.length} ciudades...`);

    // Procesar ciudades en lotes de 5 para mejorar el rendimiento
    const batchSize = 5;
    const batches = [];

    for (let i = 0; i < this.cities.length; i += batchSize) {
      const batch = this.cities.slice(i, i + batchSize);
      batches.push(batch);
    }

    // Ejecutar lotes en paralelo
    const results = await Promise.all(
      batches.map(batch => this.fetchBatchWeatherData(batch))
    );

    // Aplanar resultados y filtrar nulos
    this.state.weatherData = results.flat().filter(data => data !== null);
    this.state.lastUpdate = new Date();

    console.log(`✅ Datos cargados para ${this.state.weatherData.length} ciudades`);
  },

  /**
   * Obtiene datos meteorológicos para un lote de ciudades
   * @param {Array} cities - Lote de ciudades
   * @returns {Promise<Array>} Promesa con array de datos meteorológicos
   */
  async fetchBatchWeatherData(cities) {
    const promises = cities.map(city => this.fetchCityWeather(city));
    return Promise.all(promises);
  },

  /**
   * Obtiene datos meteorológicos para una ciudad
   * @param {Object} city - Objeto de ciudad con lat, lon, name, department
   * @returns {Promise<Object|null>} Datos meteorológicos o null si falla
   */
  async fetchCityWeather(city) {
    const url = `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${city.lat}&longitude=${city.lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weathercode` +
      `&timezone=America/Tegucigalpa&forecast_days=3`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        city: city.name,
        department: city.department,
        coordinates: [city.lat, city.lon],
        data: data.daily
      };
    } catch (error) {
      console.error(`⚠️ Error al obtener datos para ${city.name}:`, error);
      return null;
    }
  },

  /**
   * Genera alertas basadas en los datos meteorológicos cargados
   */
  generateAlerts() {
    console.log('⚠️ Generando alertas...');

    this.state.alerts = [];

    for (const cityData of this.state.weatherData) {
      if (!cityData) continue;

      const alerts = AlertasData.processWeatherData(cityData);
      this.state.alerts.push(...alerts);
    }

    console.log(`✅ ${this.state.alerts.length} alertas generadas`);

    // Guardar en caché para historial
    this.saveToCache();
  },

  /**
   * Inicializa todos los componentes de visualización
   */
  async initializeComponents() {
    console.log('🎨 Inicializando componentes...');

    // Inicializar mapa (si está disponible)
    if (typeof AlertasMap !== 'undefined') {
      AlertasMap.init('alert-map', this.state.alerts);
    }

    // Renderizar tarjetas de alertas
    if (typeof AlertasCards !== 'undefined') {
      AlertasCards.renderCards('alerts-container', this.state.alerts);
    }

    // Inicializar gráficos (si están disponibles)
    if (typeof AlertasCharts !== 'undefined') {
      AlertasCharts.initDonutChart('severity-donut', this.state.alerts);
      AlertasCharts.initTrendsChart('trends-line', this.getHistoricalAlerts());
    }

    // Inicializar timeline (si está disponible)
    if (typeof AlertasTimeline !== 'undefined') {
      AlertasTimeline.init('alert-timeline', this.state.alerts);
    }

    // Poblar filtro de regiones
    this.populateRegionFilter();
  },

  /**
   * Vincula eventos del DOM
   */
  bindEventListeners() {
    // Filtro de severidad
    const severityFilter = document.getElementById('severity-filter');
    if (severityFilter) {
      severityFilter.addEventListener('change', (e) => {
        this.state.filters.severity = e.target.value;
        this.applyFilters();
      });
    }

    // Filtro de tipo
    const typeFilter = document.getElementById('type-filter');
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.state.filters.type = e.target.value;
        this.applyFilters();
      });
    }

    // Filtro de región
    const regionFilter = document.getElementById('region-filter');
    if (regionFilter) {
      regionFilter.addEventListener('change', (e) => {
        this.state.filters.region = e.target.value;
        this.applyFilters();
      });
    }

    // Botón de actualización
    const refreshBtn = document.getElementById('refresh-alerts');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.refresh();
      });
    }
  },

  /**
   * Aplica filtros a las alertas
   */
  applyFilters() {
    let filtered = [...this.state.alerts];

    // Filtrar por severidad
    if (this.state.filters.severity !== 'all') {
      filtered = filtered.filter(a => a.severity === this.state.filters.severity);
    }

    // Filtrar por tipo
    if (this.state.filters.type !== 'all') {
      filtered = filtered.filter(a => a.type === this.state.filters.type);
    }

    // Filtrar por región
    if (this.state.filters.region !== 'all') {
      filtered = filtered.filter(a => a.location.department === this.state.filters.region);
    }

    // Actualizar visualizaciones
    if (typeof AlertasMap !== 'undefined') {
      AlertasMap.update(filtered);
    }

    if (typeof AlertasCards !== 'undefined') {
      AlertasCards.renderCards('alerts-container', filtered);
    }

    if (typeof AlertasCharts !== 'undefined') {
      AlertasCharts.updateDonutChart(filtered);
    }

    if (typeof AlertasTimeline !== 'undefined') {
      AlertasTimeline.update(filtered);
    }

    console.log(`🔍 Filtros aplicados: ${filtered.length} alertas visibles`);
  },

  /**
   * Actualiza las estadísticas en el hero
   */
  updateSummaryStats() {
    const totalStat = document.getElementById('stat-total');
    const citiesStat = document.getElementById('stat-cities');
    const updatedStat = document.getElementById('stat-updated');

    if (totalStat) {
      totalStat.textContent = this.state.alerts.length;
    }

    if (citiesStat) {
      const uniqueCities = new Set(this.state.alerts.map(a => a.location.city));
      citiesStat.textContent = uniqueCities.size;
    }

    if (updatedStat && this.state.lastUpdate) {
      const now = new Date();
      const diff = Math.floor((now - this.state.lastUpdate) / 1000 / 60); // minutos
      updatedStat.textContent = diff === 0 ? 'Ahora' : `Hace ${diff} min`;
    }
  },

  /**
   * Pobla el filtro de regiones con los departamentos únicos
   */
  populateRegionFilter() {
    const regionFilter = document.getElementById('region-filter');
    if (!regionFilter) return;

    // Obtener departamentos únicos
    const departments = new Set(this.state.alerts.map(a => a.location.department));
    const sortedDepts = Array.from(departments).sort();

    // Limpiar opciones actuales (excepto "Todas las regiones")
    while (regionFilter.options.length > 1) {
      regionFilter.remove(1);
    }

    // Agregar departamentos
    sortedDepts.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      regionFilter.appendChild(option);
    });
  },

  /**
   * Refresca los datos y alertas
   */
  async refresh() {
    console.log('🔄 Refrescando alertas...');

    this.showLoading();

    try {
      await this.loadWeatherData();
      this.generateAlerts();
      this.applyFilters();
      this.updateSummaryStats();
      this.populateRegionFilter();

      console.log('✅ Actualización completada');
    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      this.showError('Error al actualizar alertas.');
    } finally {
      this.hideLoading();
    }
  },

  /**
   * Inicia la actualización automática cada 30 minutos
   */
  startAutoRefresh() {
    setInterval(() => {
      console.log('⏰ Auto-actualización programada');
      this.refresh();
    }, 30 * 60 * 1000); // 30 minutos
  },

  /**
   * Guarda alertas en caché localStorage
   */
  saveToCache() {
    const cacheData = {
      timestamp: Date.now(),
      alerts: this.state.alerts,
      ttl: 60 * 60 * 1000 // 1 hora
    };

    localStorage.setItem('alertas_cache', JSON.stringify(cacheData));

    // También actualizar historial
    this.updateHistory();
  },

  /**
   * Actualiza el historial de alertas en localStorage
   */
  updateHistory() {
    let history = JSON.parse(localStorage.getItem('alertas_history') || '[]');

    // Agregar entrada actual
    history.push({
      date: new Date().toISOString(),
      alertCount: this.state.alerts.length,
      alerts: this.state.alerts.map(a => ({
        type: a.type,
        severity: a.severity
      }))
    });

    // Mantener solo últimos 7 días
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    history = history.filter(h => new Date(h.date).getTime() > sevenDaysAgo);

    localStorage.setItem('alertas_history', JSON.stringify(history));
  },

  /**
   * Obtiene el historial de alertas
   * @returns {Array} Historial de alertas
   */
  getHistoricalAlerts() {
    return JSON.parse(localStorage.getItem('alertas_history') || '[]');
  },

  /**
   * Muestra un mensaje de error al usuario
   * @param {string} message - Mensaje de error
   */
  showError(message) {
    const container = document.getElementById('alerts-container');
    if (container) {
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger d-flex align-items-center" role="alert">
            <ion-icon name="warning-outline" class="me-2" style="font-size: 1.5rem;"></ion-icon>
            <div>${message}</div>
          </div>
        </div>
      `;
    }
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  AlertasApp.init();
});

// Exportar para uso global
window.AlertasApp = AlertasApp;
