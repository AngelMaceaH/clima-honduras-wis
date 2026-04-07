/**
 * Alertas Cards - Renderizado de tarjetas de alertas
 *
 * Maneja la visualización en formato de tarjetas de todas las alertas
 */

const AlertasCards = {
  /**
   * Renderiza tarjetas de alertas en el contenedor especificado
   * @param {string} containerId - ID del contenedor
   * @param {Array} alerts - Array de alertas
   */
  renderCards(containerId, alerts) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor ${containerId} no encontrado`);
      return;
    }

    // Limpiar contenedor
    container.innerHTML = '';

    // Si no hay alertas, mostrar estado vacío
    if (!alerts || alerts.length === 0) {
      container.innerHTML = this.getEmptyState();
      return;
    }

    // Renderizar cada alerta como una tarjeta
    alerts.forEach(alert => {
      const card = this.createCard(alert);
      container.appendChild(card);
    });

    console.log(`✅ ${alerts.length} tarjetas renderizadas`);
  },

  /**
   * Crea un elemento de tarjeta para una alerta
   * @param {Object} alert - Objeto de alerta
   * @returns {HTMLElement} Elemento de tarjeta
   */
  createCard(alert) {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    const card = document.createElement('div');
    card.className = `alert-card ${alert.severity}`;
    card.setAttribute('role', 'listitem');

    // Encabezado de la tarjeta
    const header = document.createElement('div');
    header.className = 'alert-card-header';

    const title = document.createElement('h3');
    title.className = 'alert-card-title';
    title.textContent = AlertasData.getAlertTypeLabel(alert.type);

    const badge = document.createElement('span');
    badge.className = `severity-badge ${alert.severity}`;
    badge.textContent = AlertasData.getSeverityLabel(alert.severity);

    header.appendChild(title);
    header.appendChild(badge);

    // Meta información
    const meta = document.createElement('div');
    meta.className = 'alert-card-meta';

    const locationItem = document.createElement('div');
    locationItem.className = 'alert-meta-item';
    locationItem.innerHTML = `
      <ion-icon name="location-outline"></ion-icon>
      <span>${alert.location.city}, ${alert.location.department}</span>
    `;

    const timeItem = document.createElement('div');
    timeItem.className = 'alert-meta-item';
    const startDate = new Date(alert.time.start);
    timeItem.innerHTML = `
      <ion-icon name="time-outline"></ion-icon>
      <span>${startDate.toLocaleDateString('es-HN')}</span>
    `;

    const durationItem = document.createElement('div');
    durationItem.className = 'alert-meta-item';
    durationItem.innerHTML = `
      <ion-icon name="hourglass-outline"></ion-icon>
      <span>${AlertasData.formatDuration(alert.time.duration)}</span>
    `;

    meta.appendChild(locationItem);
    meta.appendChild(timeItem);
    meta.appendChild(durationItem);

    // Descripción
    const description = document.createElement('div');
    description.className = 'alert-card-description';
    description.textContent = alert.message;

    // Métricas específicas
    const metrics = this.createMetrics(alert);

    // Recomendaciones
    const recommendations = document.createElement('div');
    recommendations.className = 'alert-card-recommendations';

    const recTitle = document.createElement('h4');
    recTitle.textContent = 'Recomendaciones:';

    const recList = document.createElement('ul');
    alert.recommendations.forEach(rec => {
      const li = document.createElement('li');
      li.textContent = rec;
      recList.appendChild(li);
    });

    recommendations.appendChild(recTitle);
    recommendations.appendChild(recList);

    // Ensamblar tarjeta
    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(description);
    if (metrics) card.appendChild(metrics);
    card.appendChild(recommendations);

    col.appendChild(card);

    return col;
  },

  /**
   * Crea sección de métricas específicas según el tipo de alerta
   * @param {Object} alert - Objeto de alerta
   * @returns {HTMLElement|null} Elemento de métricas o null
   */
  createMetrics(alert) {
    if (!alert.metrics) return null;

    const metricsDiv = document.createElement('div');
    metricsDiv.className = 'alert-metrics';
    metricsDiv.style.cssText = 'margin: 1rem 0; padding: 1rem; background: var(--idx-surface-2); border-radius: 8px;';

    const items = [];

    // Métricas específicas por tipo
    if (alert.type === 'heavy_rain' && alert.metrics.precipitation) {
      items.push({
        icon: 'rainy',
        label: 'Precipitación',
        value: `${Math.round(alert.metrics.precipitation)} mm`
      });
    }

    if ((alert.type === 'storm' || alert.type === 'hurricane') && alert.metrics.windSpeed) {
      items.push({
        icon: 'speedometer',
        label: 'Velocidad del viento',
        value: `${Math.round(alert.metrics.windSpeed)} km/h`
      });
    }

    if (alert.type === 'heat_wave') {
      if (alert.metrics.temperature) {
        items.push({
          icon: 'thermometer',
          label: 'Temperatura máxima',
          value: `${Math.round(alert.metrics.temperature)}°C`
        });
      }
      if (alert.metrics.consecutiveDays) {
        items.push({
          icon: 'calendar',
          label: 'Días consecutivos',
          value: alert.metrics.consecutiveDays
        });
      }
    }

    if (items.length === 0) return null;

    // Renderizar items
    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;';

    items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.style.textAlign = 'center';
      itemDiv.innerHTML = `
        <div style="font-size: 2rem; color: var(--idx-accent); margin-bottom: 0.5rem;">
          <ion-icon name="${item.icon}"></ion-icon>
        </div>
        <div style="font-size: 1.25rem; font-weight: 600; color: var(--idx-text); margin-bottom: 0.25rem;">
          ${item.value}
        </div>
        <div style="font-size: 0.875rem; color: var(--idx-muted);">
          ${item.label}
        </div>
      `;
      grid.appendChild(itemDiv);
    });

    metricsDiv.appendChild(grid);

    return metricsDiv;
  },

  /**
   * Retorna HTML para estado vacío
   * @returns {string} HTML del estado vacío
   */
  getEmptyState() {
    return `
      <div class="col-12">
        <div class="empty-state">
          <ion-icon name="checkmark-circle-outline"></ion-icon>
          <h3>No hay alertas activas</h3>
          <p>¡Excelentes condiciones climáticas en Honduras!</p>
        </div>
      </div>
    `;
  }
};

// Exportar para uso global
window.AlertasCards = AlertasCards;
