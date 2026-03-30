/**
 * Widget de chat — asistente meteorológico.
 *
 * Proveedores con capa gratuita (clave en el navegador, localStorage):
 *   - Google Gemini — https://aistudio.google.com/apikey
 *   - Groq (modelos Llama, API estilo OpenAI/chat) — https://console.groq.com/keys
 *
 * La API de OpenAI (GPT/“ChatGPT” en API) es de pago; no hay plan gratis permanente como los anteriores.
 *
 * Overrides opcionales: window.__GEMINI_API_KEY__, window.__GROQ_API_KEY__
 */
(function () {
  'use strict';

  var STORAGE_PROVIDER = 'elclima_ai_provider';
  var STORAGE_GEMINI = 'elclima_gemini_api_key';
  var STORAGE_GROQ = 'elclima_groq_api_key';

  var GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];
  var GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

  var SYSTEM_PROMPT =
    'Eres un asistente virtual de El Clima Honduras. Actúas como meteorólogo y divulgador climático ' +
    'con experiencia en Honduras y Centroamérica. Respondes siempre en español, con tono claro, amable y profesional. ' +
    'Explicas conceptos (frentes, humedad, índices UV, alertas, estaciones, efectos del Niño/La Niña cuando aplique) ' +
    'sin alarmismo. Si no tienes datos en tiempo real, dilo y ofrece orientación general o cómo interpretar fuentes ' +
    'oficiales (Copeco, insivumenh, Open-Meteo). No inventes datos numéricos actuales de ciudades; sugiere consultar ' +
    'el sitio o apps oficiales. Mensajes breves salvo que el usuario pida detalle.';

  function getProvider() {
    try {
      var p = localStorage.getItem(STORAGE_PROVIDER);
      if (p === 'groq' || p === 'gemini') return p;
      return 'gemini';
    } catch (e) {
      return 'gemini';
    }
  }

  function setProvider(p) {
    try {
      if (p === 'groq' || p === 'gemini') localStorage.setItem(STORAGE_PROVIDER, p);
    } catch (e) { /* noop */ }
  }

  function getGeminiKey() {
    try {
      if (typeof window.__GEMINI_API_KEY__ === 'string' && window.__GEMINI_API_KEY__.trim()) {
        return window.__GEMINI_API_KEY__.trim();
      }
      return localStorage.getItem(STORAGE_GEMINI) || '';
    } catch (e) {
      return '';
    }
  }

  function getGroqKey() {
    try {
      if (typeof window.__GROQ_API_KEY__ === 'string' && window.__GROQ_API_KEY__.trim()) {
        return window.__GROQ_API_KEY__.trim();
      }
      return localStorage.getItem(STORAGE_GROQ) || '';
    } catch (e) {
      return '';
    }
  }

  function getActiveKey() {
    return getProvider() === 'groq' ? getGroqKey() : getGeminiKey();
  }

  function setGeminiKey(key) {
    try {
      if (key && key.trim()) localStorage.setItem(STORAGE_GEMINI, key.trim());
      else localStorage.removeItem(STORAGE_GEMINI);
    } catch (e) { /* noop */ }
  }

  function setGroqKey(key) {
    try {
      if (key && key.trim()) localStorage.setItem(STORAGE_GROQ, key.trim());
      else localStorage.removeItem(STORAGE_GROQ);
    } catch (e) { /* noop */ }
  }

  function ensureStyles() {
    if (document.querySelector('link[data-ai-chat-widget]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/ai-chat-widget.css';
    link.setAttribute('data-ai-chat-widget', '1');
    document.head.appendChild(link);
  }

  function buildWidget() {
    var root = document.createElement('div');
    root.className = 'ai-chat-root';
    root.id = 'ai-chat-root';
    root.innerHTML =
      '<button type="button" class="ai-chat-fab" id="ai-chat-fab" aria-label="Abrir asistente de clima" aria-expanded="false" aria-controls="ai-chat-panel">' +
      '<i class="ri-chat-smile-3-line" aria-hidden="true"></i></button>' +
      '<div class="ai-chat-panel" id="ai-chat-panel" role="dialog" aria-modal="false" aria-labelledby="ai-chat-title" hidden>' +
      '<div class="ai-chat-panel__head">' +
      '<div class="ai-chat-panel__head-text">' +
      '<p class="ai-chat-panel__title" id="ai-chat-title">Asistente de clima</p>' +
      '<p class="ai-chat-panel__sub" id="ai-chat-sub">Pregunta sobre el tiempo en Honduras</p></div>' +
      '<div class="ai-chat-panel__head-actions">' +
      '<button type="button" class="ai-chat-panel__settings" id="ai-chat-settings" aria-label="Configurar clave API" aria-expanded="false" aria-controls="ai-chat-config" title="Clave API">' +
      '<i class="ri-settings-3-line" aria-hidden="true"></i></button>' +
      '<button type="button" class="ai-chat-panel__close" id="ai-chat-close" aria-label="Cerrar chat"><span aria-hidden="true">×</span></button></div></div>' +
      '<div class="ai-chat-messages" id="ai-chat-messages"></div>' +
      '<div class="ai-chat-config" id="ai-chat-config" hidden></div>' +
      '<div class="ai-chat-typing" id="ai-chat-typing" hidden></div>' +
      '<form class="ai-chat-form" id="ai-chat-form" autocomplete="off">' +
      '<input type="text" id="ai-chat-input" placeholder="Escribe tu pregunta…" maxlength="2000" aria-label="Mensaje" />' +
      '<button type="submit" id="ai-chat-send">Enviar</button></form></div>';

    document.body.appendChild(root);
    return root;
  }

  function appendMsg(container, text, kind) {
    var el = document.createElement('div');
    el.className = 'ai-chat-msg ai-chat-msg--' + kind;
    el.textContent = text;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function updatePanelSubtitle() {
    var sub = document.getElementById('ai-chat-sub');
    if (!sub) return;
    sub.textContent = 'Pregunta sobre el tiempo en Honduras';
  }

  /** @type {{role: string, text: string}[]} */
  var history = [];

  function renderConfigPanel(configEl) {
    var prov = getProvider();
    var hasKey = prov === 'groq' ? !!getGroqKey() : !!getGeminiKey();

    configEl.innerHTML =
      '<p class="ai-chat-config__title">Clave API</p>' +
      '<label for="ai-chat-provider">Proveedor</label>' +
      '<select id="ai-chat-provider" class="ai-chat-provider-select">' +
      '<option value="gemini"' + (prov === 'gemini' ? ' selected' : '') + '>Google Gemini</option>' +
      '<option value="groq"' + (prov === 'groq' ? ' selected' : '') + '>Groq (Llama)</option>' +
      '</select>' +
      '<label for="ai-chat-apikey">Clave API</label>' +
      '<input type="password" id="ai-chat-apikey" placeholder="Pega tu clave" autocomplete="off" />' +
      '<div class="ai-chat-config__actions">' +
      '<button type="button" id="ai-chat-save-key">Guardar</button>' +
      '<button type="button" id="ai-chat-clear-key">Quitar</button>' +
      '<a id="ai-chat-help-link" class="ai-chat-link" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Obtener clave</a></div>';

    var select = document.getElementById('ai-chat-provider');
    var input = document.getElementById('ai-chat-apikey');
    var helpLink = document.getElementById('ai-chat-help-link');
    var save = document.getElementById('ai-chat-save-key');
    var clear = document.getElementById('ai-chat-clear-key');

    if (helpLink) {
      helpLink.href = prov === 'groq' ? 'https://console.groq.com/keys' : 'https://aistudio.google.com/apikey';
    }

    if (input && hasKey) input.placeholder = '•••••••• (guardada)';

    if (select) {
      select.addEventListener('change', function () {
        setProvider(select.value);
        history = [];
        var messages = document.getElementById('ai-chat-messages');
        if (messages) messages.innerHTML = '';
        renderConfigPanel(configEl);
      });
    }

    if (save) {
      save.addEventListener('click', function () {
        var v = input ? input.value.trim() : '';
        if (v) {
          if (getProvider() === 'groq') setGroqKey(v);
          else setGeminiKey(v);
        }
        if (input) input.value = '';
        renderConfigPanel(configEl);
      });
    }
    if (clear) {
      clear.addEventListener('click', function () {
        if (getProvider() === 'groq') setGroqKey('');
        else setGeminiKey('');
        if (input) input.value = '';
        renderConfigPanel(configEl);
      });
    }
  }

  function buildGeminiContents() {
    return history.map(function (h) {
      return {
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }]
      };
    });
  }

  function extractGeminiText(data) {
    try {
      var c = data.candidates && data.candidates[0];
      var parts = c && c.content && c.content.parts;
      if (!parts || !parts.length) return '';
      return parts.map(function (p) { return p.text || ''; }).join('');
    } catch (e) {
      return '';
    }
  }

  function callGemini(done, fail) {
    var key = getGeminiKey();
    if (!key) {
      fail('Falta la clave de Gemini. Pulsa el engranaje arriba, pégala y guarda.');
      return;
    }

    var idx = 0;
    function tryModel() {
      if (idx >= GEMINI_MODELS.length) {
        fail('No se pudo obtener respuesta con Gemini. Revisa la clave o la cuota.');
        return;
      }
      var model = GEMINI_MODELS[idx];
      var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(key);
      var body = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: buildGeminiContents(),
        generationConfig: { temperature: 0.75, maxOutputTokens: 1024 }
      };

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) {
              var apiMsg = (data && data.error && data.error.message) || res.statusText;
              if (res.status === 404) {
                idx++;
                tryModel();
                return;
              }
              fail(apiMsg || 'Error de la API');
              return;
            }
            var text = extractGeminiText(data);
            if (!text) {
              idx++;
              tryModel();
              return;
            }
            done(text);
          });
        })
        .catch(function (err) {
          idx++;
          if (idx < GEMINI_MODELS.length) tryModel();
          else fail(err.message || 'Error de red');
        });
    }

    tryModel();
  }

  function buildGroqMessages() {
    var messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    history.forEach(function (h) {
      messages.push({
        role: h.role === 'model' ? 'assistant' : 'user',
        content: h.text
      });
    });
    return messages;
  }

  function callGroq(done, fail) {
    var key = getGroqKey();
    if (!key) {
      fail('Falta la clave de Groq. Ábrela desde el icono de ajustes (engranaje).');
      return;
    }

    var midx = 0;
    function tryGroqModel() {
      if (midx >= GROQ_MODELS.length) {
        fail('No se pudo obtener respuesta con Groq.');
        return;
      }
      var model = GROQ_MODELS[midx];
      fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + key
        },
        body: JSON.stringify({
          model: model,
          messages: buildGroqMessages(),
          temperature: 0.75,
          max_tokens: 1024
        })
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) {
              var msg = (data && data.error && data.error.message) || res.statusText;
              if (res.status === 400 && msg && msg.indexOf('model') !== -1) {
                midx++;
                tryGroqModel();
                return;
              }
              fail(msg);
              return;
            }
            var text =
              data.choices &&
              data.choices[0] &&
              data.choices[0].message &&
              data.choices[0].message.content;
            if (!text || !String(text).trim()) {
              midx++;
              tryGroqModel();
              return;
            }
            done(String(text).trim());
          });
        })
        .catch(function (err) {
          midx++;
          if (midx < GROQ_MODELS.length) tryGroqModel();
          else fail(err.message || 'Error de red');
        });
    }

    tryGroqModel();
  }

  function callAI(done, fail) {
    if (getProvider() === 'groq') callGroq(done, fail);
    else callGemini(done, fail);
  }

  function init() {
    ensureStyles();
    if (document.getElementById('ai-chat-root')) return;

    buildWidget();

    var fab = document.getElementById('ai-chat-fab');
    var panel = document.getElementById('ai-chat-panel');
    var closeBtn = document.getElementById('ai-chat-close');
    var settingsBtn = document.getElementById('ai-chat-settings');
    var messages = document.getElementById('ai-chat-messages');
    var configEl = document.getElementById('ai-chat-config');
    var form = document.getElementById('ai-chat-form');
    var input = document.getElementById('ai-chat-input');
    var sendBtn = document.getElementById('ai-chat-send');
    var typing = document.getElementById('ai-chat-typing');

    if (!fab || !panel || !messages || !configEl || !form || !input) return;

    function setSettingsOpen(open) {
      if (!configEl || !settingsBtn) return;
      configEl.hidden = !open;
      settingsBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        renderConfigPanel(configEl);
      }
    }

    if (settingsBtn) {
      settingsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var next = configEl.hidden;
        setSettingsOpen(next);
      });
    }

    function openPanel() {
      panel.hidden = false;
      requestAnimationFrame(function () {
        panel.classList.add('is-open');
      });
      fab.setAttribute('aria-expanded', 'true');
      updatePanelSubtitle();
      setSettingsOpen(false);
      input.focus();
    }

    function closePanel() {
      setSettingsOpen(false);
      panel.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
      setTimeout(function () {
        panel.hidden = true;
      }, 220);
    }

    fab.addEventListener('click', function () {
      if (panel.classList.contains('is-open')) closePanel();
      else openPanel();
    });
    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !panel.classList.contains('is-open')) return;
      if (configEl && !configEl.hidden) {
        setSettingsOpen(false);
        return;
      }
      closePanel();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = (input.value || '').trim();
      if (!text) return;

      appendMsg(messages, text, 'user');
      input.value = '';
      history.push({ role: 'user', text: text });

      sendBtn.disabled = true;
      typing.hidden = false;
      typing.textContent = 'Pensando…';

      callAI(
        function (reply) {
          typing.hidden = true;
          sendBtn.disabled = false;
          appendMsg(messages, reply, 'bot');
          history.push({ role: 'model', text: reply });
        },
        function (err) {
          typing.hidden = true;
          sendBtn.disabled = false;
          appendMsg(messages, String(err), 'err');
          history.pop();
        }
      );
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
