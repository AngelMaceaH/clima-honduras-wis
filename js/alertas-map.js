/**
 * Alertas Map - Visualización de mapa con marcadores de alertas
 */

const AlertasMap = {
  map: null,
  markers: [],

  /**
   * Inicializa el mapa Leaflet
   * @param {string} containerId - ID del contenedor del mapa
   * @param {Array} alerts - Array de alertas
   */
  init(containerId, alerts) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor ${containerId} no encontrado`);
      return;
    }

    // Crear mapa centrado en Honduras
    this.map = L.map(containerId).setView([14.5, -87.5], 7);

    // Agregar capa de mapa base (tema claro/oscuro)
    const isDark = document.body.classList.contains('dark-theme');
    const tileLayer = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileLayer, {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);

    // Agregar marcadores
    this.update(alerts);

    console.log('🗺️ Mapa inicializado');
  },

  /**
   * Actualiza los marcadores en el mapa
   * @param {Array} alerts - Array de alertas
   */
  update(alerts) {
    if (!this.map) return;

    // Limpiar marcadores existentes
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    if (!alerts || alerts.length === 0) {
      console.log('No hay alertas para mostrar en el mapa');
      return;
    }

    // Agregar nuevos marcadores
    alerts.forEach(alert => {
      const marker = this.createMarker(alert);
      if (marker) {
        marker.addTo(this.map);
        this.markers.push(marker);
      }
    });

    // Ajustar vista para mostrar todos los marcadores
    if (this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }

    console.log(`🗺️ ${this.markers.length} marcadores actualizados`);
  },

  /**
   * Crea un marcador para una alerta
   * @param {Object} alert - Objeto de alerta
   * @returns {L.Marker} Marcador Leaflet
   */
  createMarker(alert) {
    if (!alert.location || !alert.location.coordinates) {
      console.warn('Alerta sin coordenadas:', alert);
      return null;
    }

    const [lat, lon] = alert.location.coordinates;

    // Crear icono custom según severidad
    const color = AlertasData.getSeverityColor(alert.severity);
    const iconHtml = `
      <div class="severity-marker severity-marker-${alert.severity}"
           style="background-color: ${color};">
      </div>
    `;

    const icon = L.divIcon({
      className: 'custom-marker',
      html: iconHtml,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Crear marker
    const marker = L.marker([lat, lon], { icon });

    // Crear popup
    const popupContent = `
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 0.5rem 0; color: ${color};">
          ${AlertasData.getAlertTypeLabel(alert.type)}
        </h4>
        <p style="margin: 0 0 0.5rem 0;">
          <strong>${alert.location.city}</strong>, ${alert.location.department}
        </p>
        <p style="margin: 0 0 0.5rem 0;">
          ${alert.message}
        </p>
        <p style="margin: 0; font-size: 0.875rem; color: #666;">
          <strong>Severidad:</strong> ${AlertasData.getSeverityLabel(alert.severity)}
        </p>
      </div>
    `;

    marker.bindPopup(popupContent);

    return marker;
  }
};

window.AlertasMap = AlertasMap;
