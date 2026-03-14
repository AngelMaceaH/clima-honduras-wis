// === Inicializar referencias DOM desde utils-clima ===
document.addEventListener("DOMContentLoaded", () => {
  selectCiudades = document.getElementById("cities");
  contenedorTarjetasDiarias = document.getElementById("daily-cards");
  
  // Inicializar valores por defecto
  if (selectCiudades) {
    actualizarMetaCiudad();
    selectCiudades.addEventListener("change", actualizarMetaCiudad);
  }
});

// --- Renderizar tabla diaria ---
async function renderizarTablaDiaria() {
  const dias = await cargarClima();
  if (!dias || !contenedorTarjetasDiarias) return;
  
  contenedorTarjetasDiarias.innerHTML = dias.map((dia, i) => `
    <div class="forecast-row" data-idx="${i}">
      <div class="date-col">${dia.nombre}</div>
      <div class="temp-col">${dia.tempMax}°/${dia.tempMin}°</div>
      <div class="icon-col">${dia.icono}</div>
      <div class="desc-col">${dia.desc}</div>
      <div class="rain-col">💧 ${dia.lluvia ?? "--"}%</div>
      <button class="detail-btn" title="Detalles">+</button>
    </div>
    <div class="detail-row"></div>
  `).join("");
  
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
  return `
    <div class="weather-detail glass">
      <div style="flex:1 1 50%;border-right:1px solid #eee;padding-right:10px;">
        <div style="font-weight:bold;">Día</div>
        <div style="font-size:2rem;">${dia.tempMax}° ${dia.icono}</div>
        <div style="color:#888;margin-bottom:4px;">${dia.desc}</div>
        <div><span>💧</span> ${dia.lluvia ?? "--"}%</div>
        <div>${obtenerIconoViento()} Viento máx: ${dia.velocidadVientoMax ?? "--"} km/h</div>
        <div style="font-size:.95em;">🌅 Amanecer: ${dia.amanecer ?? "--"}</div>
        <div style="font-size:.95em;">🌇 Puesta: ${dia.atardecer ?? "--"}</div>
      </div>
      <div style="flex:1 1 40%;padding-left:10px">
        <div style="font-weight:bold;">Noche</div>
        <div style="font-size:2rem;">${dia.tempMin}° <ion-icon name="cloud-outline" style="color:#7f8c8d;font-size:30px"></ion-icon></div>
        <div style="color:#888;margin-bottom:4px;">${dia.desc}</div>
        <div>${obtenerIconoHumedad()} Humedad: ${dia.humedadMedia ?? "--"}%</div>
        <div>${obtenerIconoUV()} Índice UV: ${dia.indiceUV ?? "--"}</div>
        <div>${obtenerIconoViento()} Viento máx: ${dia.velocidadVientoMax ?? "--"} km/h</div>
      </div>
    </div>
  `;
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
