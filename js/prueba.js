(function () {
  'use strict';

    // small helpers for UI toggles (preserve existing nav behavior)
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

    // Theme: respect existing localStorage setting
    const currentThemeText = document.getElementById('current-theme');
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      if (currentThemeText) currentThemeText.textContent = 'Oscuro';
    } else {
      if (currentThemeText) currentThemeText.textContent = 'Claro';
    }

    // Lunar calculations
    function faseLunar(fecha) {
      const lp = 2551443; // ciclo lunar en segundos
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
      // Calcula el porcentaje de iluminación basado en la fase
      let iluminacion;
      if (fase <= 0.5) {
        iluminacion = fase * 2 * 100; // 0% a 100% (creciente)
      } else {
        iluminacion = (1 - (fase - 0.5) * 2) * 100; // 100% a 0% (menguante)
      }
      return Math.round(iluminacion);
    }

    function sombraMini(fase) {
      const sombra = document.createElement('div');
      sombra.className = 'shadow';
      // simple proportional mask for visual effect
      if (fase <= 0.5) {
        const p = (0.5 - fase) * 2;
        sombra.style.left = '0';
        sombra.style.width = (p * 60) + 'px';
      } else {
        const p = (fase - 0.5) * 2;
        sombra.style.right = '0';
        sombra.style.left = 'auto';
        sombra.style.width = (p * 60) + 'px';
      }
      return sombra;
    }

    // FUNCIÓN PARA ABRIR MODAL CON DATOS LUNARES
    function abrirModalLunar(fecha, faseNombre, iluminacion) {
      const modalLunar = document.getElementById('modal-lunar');
      const modalDate = document.getElementById('modal-lunar-date');
      const modalPhase = document.getElementById('modal-lunar-phase');
      const modalIllumination = document.getElementById('modal-lunar-illumination');
      
      if (modalLunar && modalDate && modalPhase && modalIllumination) {
        // Formatear fecha
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fecha.toLocaleDateString('es-ES', options);
        
        // Actualizar contenido del modal
        modalDate.textContent = fechaFormateada;
        modalPhase.textContent = faseNombre;
        modalIllumination.textContent = `Iluminación: ${iluminacion}%`;
        
        // Mostrar modal
        modalLunar.style.display = 'flex';
        setTimeout(() => {
          modalLunar.classList.add('show');
        }, 10);
      }
    }

    function dibujarCicloLunar() {
      const cont = document.getElementById('container');
      if (!cont) return;
      cont.innerHTML = '';

      for (let i = 0; i < 14; i++) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + i);
        const fase = faseLunar(fecha);
        const faseNombre = nombreFase(fase);
        const iluminacion = calcularIluminacion(fase);

        const card = document.createElement('div');
        card.className = 'day';
        card.dataset.fase = fase;
        card.dataset.fecha = fecha.toISOString();
        card.dataset.faseNombre = faseNombre;
        card.dataset.iluminacion = iluminacion;
        
        // Hacer la tarjeta clicable
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
          abrirModalLunar(fecha, faseNombre, iluminacion);
        });

        const moon = document.createElement('div');
        moon.className = 'moon';
        moon.appendChild(sombraMini(fase));

        const txtFecha = document.createElement('div');
        txtFecha.className = 'date';
        txtFecha.innerHTML = fecha.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: '2-digit',
          month: 'short'
        });

        const txtFase = document.createElement('div');
        txtFase.className = 'phaseName';
        txtFase.innerText = faseNombre;

        card.appendChild(moon);
        card.appendChild(txtFecha);
        card.appendChild(txtFase);
        cont.appendChild(card);
      }

      const status = document.getElementById('status');
      if (status) status.innerText = '';
    }

    // Draw cycle when ready
    function startCicloLunar() {
      try {
        dibujarCicloLunar();
        
        // También hacer que la luna grande de arriba funcione
        const moonClickable = document.getElementById('moon-clickable');
        if (moonClickable) {
          moonClickable.addEventListener('click', function() {
            const hoy = new Date();
            const fase = faseLunar(hoy);
            const faseNombre = nombreFase(fase);
            const iluminacion = calcularIluminacion(fase);
            abrirModalLunar(hoy, faseNombre, iluminacion);
          });
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
    } catch (e) {}

  })();