/**
 * Funcionalidad para página de pronóstico diario (14 días)
 * Reutiliza funciones compartidas de utils-clima.js
 */

// Inicializar referencias DOM desde utils-clima
document.addEventListener("DOMContentLoaded", () => {
  selectCiudades = document.getElementById("cities");
  contenedorTarjetasDiarias = document.getElementById("daily-cards");
  
  if (selectCiudades) {
    actualizarMetaCiudad();
    selectCiudades.addEventListener("change", actualizarMetaCiudad);
  }
});

// --- Renderizar tabla diaria ---
async function renderizarTablaDiaria() {
  const dias = await cargarClima();
  if (!dias || !contenedorTarjetasDiarias) return;
  
  contenedorTarjetasDiarias.innerHTML = dias.map((dia, i) => 
    <div class="forecast-row" data-idx="">
      <div class="date-col"></div>
      <div class="temp-col">°/°</div>
      <div class="icon-col"></div>
      <div class="desc-col"></div>
      <div class="rain-col">💧 %</div>
      <button class="detail-btn" title="Detalles">+</button>
    </div>
    <div class="detail-row"></div>
  ).join("");
  
  actualizarBadges(dias[0]);
}

// --- Acordeón detalles ---
if (contenedorTarjetasDiarias) {
  contenedorTarjetasDiarias.addEventListener("click", e => {
    if (e.target.classList.contains("detail-btn")) {
      const row = e.target.closest('.forecast-row');
      const idx = row.dataset.idx;
      const detailRow = row.nextElementSibling;
      document.querySelectorAll(".detail-row").forEach(dr => { 
        if (dr !== detailRow) dr.style.display = "none"; 
      });
      if (!detailRow.style.display || detailRow.style.display === 'none') {
        detailRow.style.display = "block";
        detailRow.innerHTML = renderizarDetallesDia(window.datosClimaGlobal?.[idx]);
      } else {
        detailRow.style.display = "none";
      }
    }
  });
}

// --- Renderizar detalles de día/noche ---
function renderizarDetallesDia(dia) {
  if (!dia) return "";
  return 
    <div class="weather-detail glass">
      <div style="flex:1 1 50%;border-right:1px solid #eee;padding-right:10px;">
        <div style="font-weight:bold;">Día</div>
        <div style="font-size:2rem;">° </div>
        <div style="color:#888;margin-bottom:4px;"></div>
        <div><span>💧</span> %</div>
        <div> Viento máx:  km/h</div>
        <div style="font-size:.95em;">🌅 Amanecer: </div>
        <div style="font-size:.95em;">🌇 Puesta: </div>
      </div>
      <div style="flex:1 1 40%;padding-left:10px">
        <div style="font-weight:bold;">Noche</div>
        <div style="font-size:2rem;">° <ion-icon name="cloud-outline" style="color:#7f8c8d;font-size:30px"></ion-icon></div>
        <div style="color:#888;margin-bottom:4px;"></div>
        <div> Humedad: %</div>
        <div> Índice UV: </div>
        <div> Viento máx:  km/h</div>
      </div>
    </div>
  ;
}

// === Configurar controles de unidades ===
configurarToggleUnidades(renderizarTablaDiaria);
inicializarEventosCiudades(renderizarTablaDiaria);

// === Animaciones en la carga ===
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll('.daily-cards, .forecast-header, .city-choose-area').forEach(el => 
      el.classList.add('animate-in')
    );
  }, 250);
  inicializarMiniMapas();
  renderizarTablaDiaria();
});
