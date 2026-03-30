

(function () {
  'use strict';

  /**
   * Inicializa componentes principales de la aplicación
   * - Navegación y menú desplegable
   * - Alternancia de temas (claro/oscuro)
   */
  function inicializarPrincipal() {
    // === Selecciones del DOM ===
    const elementosNavegacion = document.querySelectorAll(".navigation li");
    const botonAlternancia = document.querySelector(".toggle");
    const navegador = document.querySelector(".navigation");
    const contenidoPrincipal = document.querySelector(".main");

    // Elementos de tema (pueden no existir en todas las páginas)
    const botonTema = document.getElementById('themeToggle');
    const textoTema = document.getElementById('themeText');
    const iconoTema = document.getElementById('themeIcon');

    // === Configurar navegación con hover ===
    if (elementosNavegacion && elementosNavegacion.length > 0) {
      /**
       * Marca el enlace activo cuando se pasa el ratón sobre él
       */
      function marcarEnlaceActivo() {
        elementosNavegacion.forEach((item) => item.classList.remove("hovered"));
        this && this.classList && this.classList.add("hovered");
      }
      elementosNavegacion.forEach((item) => item.addEventListener("mouseover", marcarEnlaceActivo));
    }

    // === Configurar alternancia del menú ===
    if (botonAlternancia) {
      function alternarMenu() {
        if (navegador) navegador.classList.toggle("active");
        if (contenidoPrincipal) contenidoPrincipal.classList.toggle("active");
      }
      botonAlternancia.addEventListener('click', alternarMenu);
      botonAlternancia.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          alternarMenu();
        }
      });
    }

    // === Configurar sistema de temas ===
    try {
      const temaNeumantenido = localStorage.getItem('theme');
      const esOscuro = temaNeumantenido === 'dark';
      
      aplicarTema(esOscuro);
      
      if (botonTema) {
        botonTema.addEventListener('click', () => {
          const nuevoEstadoOscuro = document.body.classList.toggle('dark-theme');
          localStorage.setItem('theme', nuevoEstadoOscuro ? 'dark' : 'light');
          actualizarTextoTema(nuevoEstadoOscuro);
        });
      }
    } catch (error) {
      console.error('Error al configurar tema:', error);
    }

    /**
     * Aplica el tema a la aplicación
     * @param {boolean} esOscuro - Si es true, aplica tema oscuro
     */
    function aplicarTema(esOscuro) {
      if (esOscuro) {
        document.body.classList.add('dark-theme');
        actualizarTextoTema(true);
      } else {
        document.body.classList.remove('dark-theme');
        actualizarTextoTema(false);
      }
    }

    /**
     * Actualiza el texto e icono del tema
     * @param {boolean} esOscuro - Si es true, muestra opciones para tema claro
     */
    function actualizarTextoTema(esOscuro) {
      if (textoTema) {
        textoTema.textContent = esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
      }
      if (iconoTema) {
        iconoTema.className = esOscuro ? 'bi bi-moon-fill me-2' : 'bi bi-sun-fill me-2';
      }
    }
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarPrincipal);
  } else {
    inicializarPrincipal();
  }

  // Optional export for debugging from console:
  window.__main_debug = {
    initMain: inicializarPrincipal
  };

})();