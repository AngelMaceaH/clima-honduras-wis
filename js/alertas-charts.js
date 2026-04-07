/**
 * Alertas Charts - Gráficos con Chart.js
 */

const AlertasCharts = {
  donutChart: null,
  trendsChart: null,

  /**
   * Inicializa el gráfico donut de severidad
   * @param {string} canvasId - ID del canvas
   * @param {Array} alerts - Array de alertas
   */
  initDonutChart(canvasId, alerts) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Contar alertas por severidad
    const counts = this.countBySeverity(alerts);

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Extremo', 'Severo', 'Moderado', 'Menor'],
        datasets: [{
          data: [counts.extreme, counts.severe, counts.moderate, counts.minor],
          backgroundColor: [
            AlertasData.getSeverityColor('extreme'),
            AlertasData.getSeverityColor('severe'),
            AlertasData.getSeverityColor('moderate'),
            AlertasData.getSeverityColor('minor')
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: getComputedStyle(document.body).getPropertyValue('--idx-text')
            }
          }
        }
      }
    });

    console.log('📊 Gráfico donut inicializado');
  },

  /**
   * Actualiza el gráfico donut
   * @param {Array} alerts - Array de alertas
   */
  updateDonutChart(alerts) {
    if (!this.donutChart) return;

    const counts = this.countBySeverity(alerts);
    this.donutChart.data.datasets[0].data = [
      counts.extreme,
      counts.severe,
      counts.moderate,
      counts.minor
    ];
    this.donutChart.update();
  },

  /**
   * Inicializa el gráfico de tendencias
   * @param {string} canvasId - ID del canvas
   * @param {Array} history - Historial de alertas
   */
  initTrendsChart(canvasId, history) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Preparar datos de los últimos 7 días
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('es-HN', { weekday: 'short' }));

      // Buscar conteo para este día
      const dayData = history.find(h => {
        const hDate = new Date(h.date);
        return hDate.toDateString() === date.toDateString();
      });

      data.push(dayData ? dayData.alertCount : 0);
    }

    this.trendsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Alertas',
          data: data,
          borderColor: AlertasData.getSeverityColor('moderate'),
          backgroundColor: AlertasData.getSeverityColor('moderate') + '40',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: getComputedStyle(document.body).getPropertyValue('--idx-text')
            },
            grid: {
              color: getComputedStyle(document.body).getPropertyValue('--idx-border')
            }
          },
          x: {
            ticks: {
              color: getComputedStyle(document.body).getPropertyValue('--idx-text')
            },
            grid: {
              color: getComputedStyle(document.body).getPropertyValue('--idx-border')
            }
          }
        }
      }
    });

    console.log('📈 Gráfico de tendencias inicializado');
  },

  /**
   * Cuenta alertas por severidad
   * @param {Array} alerts - Array de alertas
   * @returns {Object} Objeto con conteos
   */
  countBySeverity(alerts) {
    return {
      extreme: alerts.filter(a => a.severity === 'extreme').length,
      severe: alerts.filter(a => a.severity === 'severe').length,
      moderate: alerts.filter(a => a.severity === 'moderate').length,
      minor: alerts.filter(a => a.severity === 'minor').length
    };
  }
};

window.AlertasCharts = AlertasCharts;
