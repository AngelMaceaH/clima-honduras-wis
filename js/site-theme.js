/**
 * Tema claro/oscuro unificado (localStorage key: theme).
 * Requiere #theme-btn, #current-theme, [data-theme], opcional #theme-icon (Remix Icon).
 */
(function () {
  'use strict';

  function applyTheme(theme) {
    const currentThemeSpan = document.getElementById('current-theme');
    const icon = document.getElementById('theme-icon');
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      if (currentThemeSpan) currentThemeSpan.textContent = 'Oscuro';
      if (icon) icon.className = 'ri-moon-line me-1';
    } else {
      document.body.classList.remove('dark-theme');
      if (currentThemeSpan) currentThemeSpan.textContent = 'Claro';
      if (icon) icon.className = 'ri-sun-line me-1';
    }
    if (typeof window.__hoy_refreshCharts === 'function') {
      window.__hoy_refreshCharts();
    }
  }

  function init() {
    const themeOptions = document.querySelectorAll('[data-theme]');
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    themeOptions.forEach(function (option) {
      option.addEventListener('click', function (e) {
        e.preventDefault();
        var theme = option.getAttribute('data-theme');
        applyTheme(theme);
        localStorage.setItem('theme', theme);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
