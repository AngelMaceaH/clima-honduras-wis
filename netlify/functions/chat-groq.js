exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Metodo no permitido' })
    };
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.chatbot_api_key;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Falta GROQ_API_KEY en variables de entorno de Netlify' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Body JSON invalido' })
    };
  }

  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  if (!messages.length) {
    return {
      statusCode: 400,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'messages es requerido' })
    };
  }

  const models = Array.isArray(payload.models) && payload.models.length
    ? payload.models
    : ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

  const temperature = Number.isFinite(payload.temperature) ? payload.temperature : 0.75;
  const maxTokens = Number.isFinite(payload.max_tokens) ? payload.max_tokens : 1024;

  let lastError = 'No se pudo obtener respuesta con Groq';
  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens
        })
      });

      const data = await response.json();
      if (!response.ok) {
        lastError = (data && data.error && data.error.message) || response.statusText || lastError;
        continue;
      }

      const reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!reply || !String(reply).trim()) {
        lastError = 'Respuesta vacia del modelo';
        continue;
      }

      return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ reply: String(reply).trim(), model })
      };
    } catch (e) {
      lastError = e && e.message ? e.message : lastError;
    }
  }

  return {
    statusCode: 502,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ error: lastError })
  };
};
