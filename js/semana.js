/**
 * Funcionalidad para página semanal (7 días)
 * Reutiliza funciones compartidas de utils-clima.js
 */

// Inicializar referencias DOM desde utils-clima
document.addEventListener("DOMContentLoaded", () => {
  selectCiudades = document.getElementById("cities");
  contenedorTarjetasDiarias = document.getElementById("semana-cards");
  
  if (selectCiudades) {
    actualizarMetaCiudad();
    selectCiudades.addEventListener("change", actualizarMetaCiudad);
  }
});

// --- Renderizar tarjetas semanales ---
async function renderizarTarjetasSemanales() {
  const dias = await cargarClima();
  if (!dias || !contenedorTarjetasDiarias) return;
  
  // Filtrar para solo 7 días (sin sábados en esta versión)
  const diasSemana = dias.slice(0, 7);
  
  contenedorTarjetasDiarias.innerHTML = diasSemana.map((dia, idx) => 
    <div class="week-card">
      <div class="day-title"></div>
      <div class="icon-big"></div>
      <div class="temps-block">
        <span class="tmax">°</span>
        <span class="tmin">°</span>
      </div>
      <div class="details-small">
        <div> Humedad: %</div>
        <div> Viento:  km/h</div>
        <div> UV: </div>
        <div> Lluvia: %</div>
      </div>
    </div>
  ).join("");
  
  actualizarBadges(diasSemana[0]);
}

// === Configurar controles de unidades ===
configurarToggleUnidades(renderizarTarjetasSemanales);
inicializarEventosCiudades(renderizarTarjetasSemanales);

// === Animaciones en la carga ===
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll('.weekly-cards, .forecast-header, .city-choose-area').forEach(el => 
      el.classList.add('animate-in')
    );
  }, 250);
  inicializarMiniMapas();
  renderizarTarjetasSemanales();
});
