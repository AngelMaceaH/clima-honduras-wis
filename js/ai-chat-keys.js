// Configuración del chat del lado cliente.
// La clave de Groq ya no se maneja en frontend: vive en Netlify Function.

(function () {
  'use strict';

  // Mantener Gemini desactivado por defecto en frontend.
  try { window.__GEMINI_API_KEY__ = ''; } catch (e) { /* noop */ }
  window.__GROQ_API_KEY__ = '';
  try { window.__AI_CHAT_KEYS_READY__ = Promise.resolve(); } catch (e) { /* noop */ }

  // Activar Groq como proveedor por defecto.
  try {
    localStorage.setItem('cemeco_ai_provider', 'groq');
  } catch (e) { /* noop */ }
})();
