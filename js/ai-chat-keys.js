// Carga la clave Groq desde el mismo contenido que tu .env (formato KEY=valor).
//
// Importante: el navegador solo puede obtener variables vía HTTP (fetch). Muchos servidores
// locales NO sirven archivos cuyo nombre empieza por punto, por eso /.env suele dar 404.
// Solución: ejecuta en la raíz del proyecto:  powershell -File scripts/sync-env.ps1
// Eso copia .env → groq.env (archivo sin punto) que sí se puede cargar.

(async function () {
  'use strict';

  // Eliminamos/limpiamos la clave de Gemini para no usarla.
  try { window.__GEMINI_API_KEY__ = ''; } catch (e) { /* noop */ }

  // Valor por defecto (vacío) por si falla la carga del .env.
  window.__GROQ_API_KEY__ = '';

  function parseGroqKey(envText) {
    if (typeof envText !== 'string') return '';
    const lines = envText.split(/\r?\n/);
    const candidates = ['GROQ_API_KEY', 'groq_api_key', 'chatbot_api_key', 'CHATBOT_API_KEY'];

    for (const row of lines) {
      const trimmed = String(row || '').trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      for (const keyName of candidates) {
        const re = new RegExp('^\\s*' + keyName + '\\s*=');
        if (!re.test(trimmed)) continue;
        return trimmed
          .replace(new RegExp('^\\s*' + keyName + '\\s*=\\s*'), '')
          .replace(/^['"]|['"]$/g, '')
          .trim();
      }
    }

    return '';
  }

  async function loadGroqKeyFromEnv() {
    const candidates = [
      'groq.env',
      './groq.env',
      '/groq.env',
      'env',
      './env',
      '/env',
      '.env',
      './.env',
      '/.env',
    ];
    for (const path of candidates) {
      try {
        const response = await fetch(path, { cache: 'no-store' });
        if (!response.ok) continue;
        const envText = await response.text();
        const key = parseGroqKey(envText);
        if (key) return key;
      } catch (e) {
        // noop
      }
    }
    return '';
  }

  var readyPromise = (async function () {
    try {
      const groqApiKey = await loadGroqKeyFromEnv();
      window.__GROQ_API_KEY__ = groqApiKey || '';
    } catch (e) {
      window.__GROQ_API_KEY__ = '';
    }
  })();

  try { window.__AI_CHAT_KEYS_READY__ = readyPromise; } catch (e) { /* noop */ }
  await readyPromise;

  // Activar Groq como proveedor por defecto.
  try {
    // Forzamos 'groq' como proveedor activo.
    localStorage.setItem('cemeco_ai_provider', 'groq');
  } catch (e) { /* noop */ }
})();
