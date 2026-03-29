(function () {
  'use strict';

  // ─── Nav & Sidebar toggles (preserve existing behavior) ───
  const navList = document.querySelectorAll('.navigation li');
  if (navList && navList.length) {
    navList.forEach(item => item.addEventListener('mouseover', function () {
      navList.forEach(i => i.classList.remove('hovered'));
      this.classList.add('hovered');
    }));
  }

  const toggle = document.querySelector('.toggle');
  const navigation = document.querySelector('.navigation');
  const main = document.querySelector('.main');
  if (toggle) {
    toggle.addEventListener('click', () => {
      if (navigation) navigation.classList.toggle('active');
      if (main) main.classList.toggle('active');
    });
  }

  // ═══════════════════════════════════════════════════════════
  // LUNAR CALCULATIONS
  // ═══════════════════════════════════════════════════════════

  function faseLunar(fecha) {
    const lp = 2551443; // ciclo lunar en segundos (~29.53 días)
    return ((fecha.getTime() / 1000) % lp) / lp;
  }

  function nombreFase(f) {
    if (f < 0.03 || f > 0.97) return 'Luna nueva';
    if (f < 0.23) return 'Creciente';
    if (f < 0.27) return 'Cuarto creciente';
    if (f < 0.47) return 'Gibosa creciente';
    if (f < 0.53) return 'Luna llena';
    if (f < 0.73) return 'Gibosa menguante';
    if (f < 0.77) return 'Cuarto menguante';
    return 'Menguante';
  }

  function calcularIluminacion(fase) {
    let iluminacion;
    if (fase <= 0.5) {
      iluminacion = fase * 2 * 100;
    } else {
      iluminacion = (1 - (fase - 0.5) * 2) * 100;
    }
    return Math.round(iluminacion);
  }

  // ─── Shadow element for mini moon orbs ───
  function sombraMini(fase, diameter) {
    const d = diameter || 60;
    const sombra = document.createElement('div');
    sombra.className = 'shadow';
    if (fase <= 0.5) {
      const p = (0.5 - fase) * 2;
      sombra.style.left = '0';
      sombra.style.width = (p * d) + 'px';
    } else {
      const p = (fase - 0.5) * 2;
      sombra.style.right = '0';
      sombra.style.left = 'auto';
      sombra.style.width = (p * d) + 'px';
    }
    return sombra;
  }

  // ═══════════════════════════════════════════════════════════
  // MODAL — open with correct phase data + shadow + SVG ring
  // ═══════════════════════════════════════════════════════════

  function abrirModalLunar(fecha, faseNombre, iluminacion, fase) {
    const modalLunar = document.getElementById('modal-lunar');
    const modalDate = document.getElementById('modal-lunar-date');
    const modalPhase = document.getElementById('modal-lunar-phase');
    const modalIllumination = document.getElementById('modal-lunar-illumination');
    const modalMoonPhase = document.getElementById('modal-moon-phase');

    if (!modalLunar || !modalDate || !modalPhase || !modalIllumination) return;

    // Format date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', options);

    // Update text content
    modalDate.textContent = fechaFormateada;
    modalPhase.textContent = faseNombre;
    modalIllumination.textContent = `Iluminación: ${iluminacion}%`;

    // ─── Draw shadow on modal moon ───
    if (modalMoonPhase) {
      // Clear existing shadow
      const existingShadow = modalMoonPhase.querySelector('.shadow');
      if (existingShadow) existingShadow.remove();
      // Create new shadow with modal moon diameter (130px)
      const shadow = sombraMini(fase, 130);
      modalMoonPhase.appendChild(shadow);
    }

    // ─── Animate SVG illumination ring ───
    const ringFill = document.querySelector('#modal-illumination-ring .ring-fill');
    const ringText = document.querySelector('#modal-illumination-ring .ring-text');
    if (ringFill) {
      const offset = 100 - iluminacion;
      ringFill.style.transition = 'none';
      ringFill.setAttribute('stroke-dashoffset', '100');
      // Force reflow then animate
      void ringFill.getBoundingClientRect();
      ringFill.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      requestAnimationFrame(() => {
        ringFill.setAttribute('stroke-dashoffset', String(offset));
      });
    }
    if (ringText) {
      ringText.textContent = iluminacion + '%';
    }

    // Show modal
    modalLunar.style.display = 'flex';
    setTimeout(() => { modalLunar.classList.add('show'); }, 10);

    // Store current data for download
    window.__currentLunarData = { fecha, faseNombre, iluminacion, fase };
  }

  // ═══════════════════════════════════════════════════════════
  // DOWNLOAD — Canvas-based PNG generation
  // ═══════════════════════════════════════════════════════════

  function descargarFaseLunar() {
    const data = window.__currentLunarData;
    if (!data) return;

    const canvas = document.getElementById('moon-download-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    // Background — deep space gradient
    const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    bgGrad.addColorStop(0, '#1c1433');
    bgGrad.addColorStop(1, '#0e0b1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Stars
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 1.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.5})`;
      ctx.fill();
    }

    // Moon circle
    const cx = size / 2;
    const cy = size / 2 - 20;
    const radius = 100;

    const moonGrad = ctx.createRadialGradient(cx - 25, cy - 20, 0, cx, cy, radius);
    moonGrad.addColorStop(0, '#fff8e7');
    moonGrad.addColorStop(0.5, '#f5d280');
    moonGrad.addColorStop(1, '#d4a043');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = moonGrad;
    ctx.fill();

    // Moon glow
    ctx.save();
    ctx.globalAlpha = 0.25;
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.5);
    glow.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
    glow.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
    ctx.restore();

    // Shadow overlay
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const fase = data.fase;
    ctx.fillStyle = 'rgba(14, 11, 26, 0.90)';
    if (fase <= 0.5) {
      const shadowWidth = (0.5 - fase) * 2 * radius * 2;
      ctx.fillRect(cx - radius, cy - radius, shadowWidth, radius * 2);
    } else {
      const shadowWidth = (fase - 0.5) * 2 * radius * 2;
      ctx.fillRect(cx + radius - shadowWidth, cy - radius, shadowWidth, radius * 2);
    }
    ctx.restore();

    // Text
    ctx.fillStyle = '#ede9fe';
    ctx.font = 'bold 22px Outfit, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.faseNombre, cx, cy + radius + 45);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '600 16px Inter, sans-serif';
    ctx.fillText(`Iluminación: ${data.iluminacion}%`, cx, cy + radius + 70);

    ctx.fillStyle = '#a893c7';
    ctx.font = '13px Inter, sans-serif';
    const fechaStr = data.fecha.toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    ctx.fillText(fechaStr, cx, cy + radius + 92);

    // Trigger download
    const link = document.createElement('a');
    link.download = `fase-lunar-${data.fecha.toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // ═══════════════════════════════════════════════════════════
  // DRAW LUNAR CYCLE — Calendar grid with tooltips & bars
  // ═══════════════════════════════════════════════════════════

  function dibujarCicloLunar() {
    const cont = document.getElementById('container');
    if (!cont) return;
    cont.innerHTML = '';

    const hoyStr = new Date().toDateString();

    for (let i = 0; i < 14; i++) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + i);
      const fase = faseLunar(fecha);
      const faseNombre = nombreFase(fase);
      const iluminacion = calcularIluminacion(fase);

      // ── Card ──
      const card = document.createElement('div');
      card.className = 'day';
      card.dataset.fase = fase;
      card.dataset.fecha = fecha.toISOString();
      card.dataset.faseNombre = faseNombre;
      card.dataset.iluminacion = iluminacion;

      // Today indicator
      if (fecha.toDateString() === hoyStr) {
        card.classList.add('is-today');
      }

      // Click → open modal
      card.addEventListener('click', function () {
        abrirModalLunar(fecha, faseNombre, iluminacion, fase);
      });

      // ── Tooltip ──
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip-illumination';
      tooltip.textContent = `☀ ${iluminacion}% iluminación`;
      card.appendChild(tooltip);

      // ── Moon orb ──
      const moon = document.createElement('div');
      moon.className = 'moon';
      moon.appendChild(sombraMini(fase));
      card.appendChild(moon);

      // ── Date text ──
      const txtFecha = document.createElement('div');
      txtFecha.className = 'date';
      txtFecha.innerHTML = fecha.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
      });
      card.appendChild(txtFecha);

      // ── Phase name ──
      const txtFase = document.createElement('div');
      txtFase.className = 'phaseName';
      txtFase.innerText = faseNombre;
      card.appendChild(txtFase);

      // ── Illumination bar ──
      const barContainer = document.createElement('div');
      barContainer.className = 'illumination-bar-container';
      const bar = document.createElement('div');
      bar.className = 'illumination-bar';
      bar.style.width = iluminacion + '%';
      barContainer.appendChild(bar);
      card.appendChild(barContainer);

      cont.appendChild(card);
    }

    const status = document.getElementById('status');
    if (status) status.innerText = '';
  }

  // ═══════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════

  function startCicloLunar() {
    try {
      dibujarCicloLunar();

      // Hero moon click
      const moonClickable = document.getElementById('moon-clickable');
      if (moonClickable) {
        // Apply shadow to the hero moon too
        const heroMoonIcon = moonClickable.querySelector('.moon-icon-clickable');
        if (heroMoonIcon) {
          const hoy = new Date();
          const faseHoy = faseLunar(hoy);
          heroMoonIcon.appendChild(sombraMini(faseHoy, 90));
        }

        moonClickable.addEventListener('click', function () {
          const hoy = new Date();
          const fase = faseLunar(hoy);
          const faseNombre = nombreFase(fase);
          const iluminacion = calcularIluminacion(fase);
          abrirModalLunar(hoy, faseNombre, iluminacion, fase);
        });
      }

      // Download button
      const downloadBtn = document.getElementById('download-phase-btn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', descargarFaseLunar);
      }

    } catch (err) {
      console.error('Error starting ciclo lunar:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCicloLunar);
  } else {
    startCicloLunar();
  }

  // expose minimal debug API
  try {
    window.__ciclo_debug = { dibujarCicloLunar, abrirModalLunar };
  } catch (e) { }

})();