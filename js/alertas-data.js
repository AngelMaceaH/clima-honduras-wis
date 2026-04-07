/**
 * Alertas Data - Procesamiento de datos meteorológicos y generación de alertas
 *
 * Este módulo contiene la lógica para:
 * - Definir umbrales de severidad para diferentes tipos de alertas
 * - Procesar datos meteorológicos de Open-Meteo API
 * - Generar alertas basadas en condiciones climáticas
 * - Clasificar alertas por severidad y tipo
 */

const AlertasData = {
  /**
   * Umbrales de severidad para diferentes tipos de alertas meteorológicas
   */
  thresholds: {
    heavy_rain: {
      severe: 50,      // mm/día
      extreme: 100
    },
    storm: {
      severe: 60,      // km/h
      extreme: 90
    },
    heat_wave: {
      moderate: 35,    // °C
      extreme: 38,
      consecutiveDays: 3
    },
    hurricane: {
      extreme: 120     // km/h
    }
  },

  /**
   * Procesa datos meteorológicos de una ciudad y genera alertas
   * @param {Object} cityData - Datos meteorológicos de la ciudad
   * @returns {Array} Array de alertas generadas
   */
  processWeatherData(cityData) {
    const alerts = [];

    if (!cityData || !cityData.data) {
      console.warn('Datos de ciudad inválidos:', cityData);
      return alerts;
    }

    // Verificar lluvia intensa
    const rainAlert = this.checkHeavyRain(cityData);
    if (rainAlert) alerts.push(rainAlert);

    // Verificar tormentas/vientos fuertes
    const stormAlert = this.checkStorm(cityData);
    if (stormAlert) alerts.push(stormAlert);

    // Verificar olas de calor
    const heatAlert = this.checkHeatWave(cityData);
    if (heatAlert) alerts.push(heatAlert);

    return alerts;
  },

  /**
   * Verifica condiciones de lluvia intensa
   * @param {Object} cityData - Datos meteorológicos de la ciudad
   * @returns {Object|null} Objeto de alerta o null si no hay alerta
   */
  checkHeavyRain(cityData) {
    const precipData = cityData.data.precipitation_sum || [];
    if (precipData.length === 0) return null;

    const maxPrecip = Math.max(...precipData);

    if (maxPrecip >= this.thresholds.heavy_rain.severe) {
      const severity = maxPrecip >= this.thresholds.heavy_rain.extreme ? 'extreme' : 'severe';

      // Encontrar el día con mayor precipitación
      const maxIndex = precipData.indexOf(maxPrecip);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + maxIndex);

      return {
        id: this.generateAlertId('rain', cityData.city),
        type: 'heavy_rain',
        severity: severity,
        location: {
          city: cityData.city,
          department: cityData.department,
          coordinates: cityData.coordinates
        },
        time: {
          start: startDate.toISOString(),
          duration: 24 // horas
        },
        metrics: {
          precipitation: maxPrecip
        },
        message: `Lluvia intensa: ${Math.round(maxPrecip)}mm esperados`,
        icon: 'rainy-outline',
        recommendations: [
          'Evite zonas propensas a inundaciones',
          'Tenga precaución al conducir',
          'Manténgase informado de actualizaciones',
          'Prepare kit de emergencia'
        ]
      };
    }

    return null;
  },

  /**
   * Verifica condiciones de tormenta o huracán
   * @param {Object} cityData - Datos meteorológicos de la ciudad
   * @returns {Object|null} Objeto de alerta o null si no hay alerta
   */
  checkStorm(cityData) {
    const windData = cityData.data.wind_speed_10m_max || [];
    if (windData.length === 0) return null;

    const maxWind = Math.max(...windData);

    if (maxWind >= this.thresholds.storm.severe) {
      let severity = 'severe';
      let type = 'storm';

      if (maxWind >= this.thresholds.hurricane.extreme) {
        severity = 'extreme';
        type = 'hurricane';
      } else if (maxWind >= this.thresholds.storm.extreme) {
        severity = 'extreme';
      }

      // Encontrar el día con mayor viento
      const maxIndex = windData.indexOf(maxWind);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + maxIndex);

      return {
        id: this.generateAlertId(type, cityData.city),
        type: type,
        severity: severity,
        location: {
          city: cityData.city,
          department: cityData.department,
          coordinates: cityData.coordinates
        },
        time: {
          start: startDate.toISOString(),
          duration: 12 // horas
        },
        metrics: {
          windSpeed: maxWind
        },
        message: `Vientos ${severity === 'extreme' ? 'extremos' : 'fuertes'}: ${Math.round(maxWind)} km/h`,
        icon: type === 'hurricane' ? 'warning-outline' : 'thunderstorm-outline',
        recommendations: [
          'Permanezca en interiores',
          'Asegure objetos sueltos en exteriores',
          'Evite áreas con árboles grandes',
          'Mantenga linterna y radio a mano'
        ]
      };
    }

    return null;
  },

  /**
   * Verifica condiciones de ola de calor
   * @param {Object} cityData - Datos meteorológicos de la ciudad
   * @returns {Object|null} Objeto de alerta o null si no hay alerta
   */
  checkHeatWave(cityData) {
    const temps = cityData.data.temperature_2m_max || [];
    if (temps.length === 0) return null;

    const threshold = this.thresholds.heat_wave.moderate;

    // Contar días consecutivos sobre el umbral
    let consecutiveDays = 0;
    let maxConsecutive = 0;
    let startIndex = 0;
    let maxStartIndex = 0;

    for (let i = 0; i < temps.length; i++) {
      if (temps[i] > threshold) {
        if (consecutiveDays === 0) {
          startIndex = i;
        }
        consecutiveDays++;
        if (consecutiveDays > maxConsecutive) {
          maxConsecutive = consecutiveDays;
          maxStartIndex = startIndex;
        }
      } else {
        consecutiveDays = 0;
      }
    }

    if (maxConsecutive >= this.thresholds.heat_wave.consecutiveDays) {
      const maxTemp = Math.max(...temps);
      const severity = maxTemp >= this.thresholds.heat_wave.extreme ? 'extreme' : 'moderate';

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + maxStartIndex);

      return {
        id: this.generateAlertId('heat', cityData.city),
        type: 'heat_wave',
        severity: severity,
        location: {
          city: cityData.city,
          department: cityData.department,
          coordinates: cityData.coordinates
        },
        time: {
          start: startDate.toISOString(),
          duration: maxConsecutive * 24 // horas
        },
        metrics: {
          temperature: maxTemp,
          consecutiveDays: maxConsecutive
        },
        message: `Ola de calor: ${maxConsecutive} días consecutivos sobre ${threshold}°C`,
        icon: 'sunny-outline',
        recommendations: [
          'Manténgase hidratado',
          'Evite exposición al sol durante horas pico (10am-4pm)',
          'Use protector solar y ropa ligera',
          'Revise a personas vulnerables (niños, ancianos)'
        ]
      };
    }

    return null;
  },

  /**
   * Genera un ID único para una alerta
   * @param {string} type - Tipo de alerta
   * @param {string} city - Nombre de la ciudad
   * @returns {string} ID único de alerta
   */
  generateAlertId(type, city) {
    const timestamp = Date.now();
    const citySlug = city.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/\s+/g, '_');
    return `alert_${timestamp}_${citySlug}_${type}`;
  },

  /**
   * Obtiene el color de severidad según el tema
   * @param {string} severity - Nivel de severidad
   * @returns {string} Color en formato hexadecimal
   */
  getSeverityColor(severity) {
    const isDark = document.body.classList.contains('dark-theme');

    const colors = {
      extreme: isDark ? '#ef4444' : '#dc2626',
      severe: isDark ? '#fb923c' : '#f97316',
      moderate: isDark ? '#fbbf24' : '#eab308',
      minor: isDark ? '#60a5fa' : '#3b82f6'
    };

    return colors[severity] || colors.moderate;
  },

  /**
   * Obtiene la etiqueta en español para un tipo de alerta
   * @param {string} type - Tipo de alerta
   * @returns {string} Etiqueta en español
   */
  getAlertTypeLabel(type) {
    const labels = {
      heavy_rain: 'Lluvia Intensa',
      storm: 'Tormenta',
      heat_wave: 'Ola de Calor',
      hurricane: 'Huracán'
    };

    return labels[type] || type;
  },

  /**
   * Obtiene la etiqueta en español para un nivel de severidad
   * @param {string} severity - Nivel de severidad
   * @returns {string} Etiqueta en español
   */
  getSeverityLabel(severity) {
    const labels = {
      extreme: 'Extremo',
      severe: 'Severo',
      moderate: 'Moderado',
      minor: 'Menor'
    };

    return labels[severity] || severity;
  },

  /**
   * Formatea una fecha ISO a formato legible en español
   * @param {string} isoDate - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-HN', options);
  },

  /**
   * Formatea duración en horas a formato legible
   * @param {number} hours - Duración en horas
   * @returns {string} Duración formateada
   */
  formatDuration(hours) {
    if (hours < 24) {
      return `${hours} hora${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} día${days !== 1 ? 's' : ''}`;
    }
  }
};

// Exportar para uso en otros módulos
if (typeof window !== 'undefined') {
  window.AlertasData = AlertasData;
}
