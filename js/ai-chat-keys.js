// Archivo generado para almacenar claves de API en el repo privado.
// NOTA: Estas claves se incluyen intencionalmente en el repositorio por decisión del propietario.
// Si alguna vez se hace público el repo, elimina este archivo y rota las claves.

(function () {
  'use strict';
  // Eliminamos/limpiamos la clave de Gemini para no usarla.
  try { window.__GEMINI_API_KEY__ = ''; } catch (e) { /* noop */ }

  // Clave API de Groq (configurada por el usuario)
  window.__GROQ_API_KEY__ = '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';

  // Activar Groq como proveedor por defecto.
  try {
    // Forzamos 'groq' como proveedor activo.
    localStorage.setItem('elclima_ai_provider', 'groq');
  } catch (e) { /* noop */ }
})();
