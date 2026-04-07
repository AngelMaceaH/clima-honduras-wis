/**
 * Alertas Timeline - Visualización de línea de tiempo con D3.js
 * Versión simplificada - para implementación completa en el futuro
 */

const AlertasTimeline = {
  svg: null,
  width: 0,
  height: 300,
  margin: { top: 20, right: 20, bottom: 30, left: 50 },

  /**
   * Inicializa la línea de tiempo
   * @param {string} containerId - ID del contenedor
   * @param {Array} alerts - Array de alertas
   */
  init(containerId, alerts) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor ${containerId} no encontrado`);
      return;
    }

    // Mensaje temporal para implementación futura
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; color: var(--idx-muted);">
        <ion-icon name="time-outline" style="font-size: 3rem; margin-bottom: 1rem;"></ion-icon>
        <h3 style="color: var(--idx-text); margin-bottom: 0.5rem;">Línea de Tiempo</h3>
        <p>Visualización de timeline avanzada con D3.js</p>
        <p style="font-size: 0.875rem;">Mostrando ${alerts.length} alertas en formato de lista:</p>
        <div style="max-width: 600px; margin: 2rem auto; text-align: left;">
          ${this.createSimpleList(alerts)}
        </div>
      </div>
    `;

    console.log('⏰ Timeline inicializado (versión simplificada)');
  },

  /**
   * Actualiza la línea de tiempo
   * @param {Array} alerts - Array de alertas
   */
  update(alerts) {
    this.init('alert-timeline', alerts);
  },

  /**
   * Crea una lista simple de alertas
   * @param {Array} alerts - Array de alertas
   * @returns {string} HTML de la lista
   */
  createSimpleList(alerts) {
    if (!alerts || alerts.length === 0) {
      return '<p style="text-align: center;">No hay alertas para mostrar</p>';
    }

    const sortedAlerts = [...alerts].sort((a, b) => {
      return new Date(a.time.start) - new Date(b.time.start);
    });

    return sortedAlerts.map(alert => {
      const color = AlertasData.getSeverityColor(alert.severity);
      const startDate = new Date(alert.time.start);

      return `
        <div style="padding: 0.75rem; margin-bottom: 0.5rem; border-left: 4px solid ${color}; background: var(--idx-surface); border-radius: 4px;">
          <div style="font-weight: 600; color: var(--idx-text); margin-bottom: 0.25rem;">
            ${AlertasData.getAlertTypeLabel(alert.type)} - ${alert.location.city}
          </div>
          <div style="font-size: 0.875rem; color: var(--idx-muted);">
            ${startDate.toLocaleDateString('es-HN', { weekday: 'short', month: 'short', day: 'numeric' })} |
            ${AlertasData.getSeverityLabel(alert.severity)}
          </div>
        </div>
      `;
    }).join('');
  }
};

window.AlertasTimeline = AlertasTimeline;
