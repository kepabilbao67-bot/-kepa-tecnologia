// Vercel serverless function — proxy para el chat KEPA IA.
// Configura la variable de entorno ANTHROPIC_API_KEY en el panel de Vercel
// (Project → Settings → Environment Variables). NUNCA la pongas en el código.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Falta ANTHROPIC_API_KEY en el servidor.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const messages = body.messages;
    if (!Array.isArray(messages) || !messages.length) {
      res.status(400).json({ error: 'Se requiere un array de mensajes.' });
      return;
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      })
    });

    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: (data && data.error && data.error.message) || 'Error de la API.' });
      return;
    }

    const reply = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : '';
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
}
