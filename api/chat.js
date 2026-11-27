// Vercel serverless function — proxy para el chat KEPA IA.
// Configura la variable de entorno ANTHROPIC_API_KEY en el panel de Vercel
// (Project → Settings → Environment Variables). NUNCA la pongas en el código.
//
// Protecciones contra uso abusivo (el endpoint es público):
// - El prompt de sistema vive AQUÍ; el cliente solo envía la conversación.
// - Solo acepta peticiones desde los orígenes permitidos (ALLOWED_ORIGINS).
// - Limita nº de mensajes, longitud y tokens de respuesta.
// - Límite de peticiones por IP (en memoria, por instancia: es un freno
//   básico; para un límite global usa Vercel Firewall / Upstash).

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 600;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 1000;
const MAX_TOTAL_CHARS = 6000;
const RATE_LIMIT_PER_MINUTE = 8;
const RATE_LIMIT_PER_DAY = 60;

const DEFAULT_ORIGINS = [
  'https://kepatecnologia.com',
  'https://www.kepatecnologia.com'
];

const LANG_NAMES = {
  es: 'español de España (castellano)',
  en: 'English',
  ca: 'català',
  eu: 'euskara',
  gl: 'galego',
  de: 'Deutsch',
  it: 'italiano',
  zh: '简体中文'
};

const SYSTEM = [
    'Eres KEPA IA, el asistente virtual de la web de Kepa Bilbao (marca "Kepa tecnologIA").',
    'Kepa es freelancer en Bilbao (España) especializado en AUTOMATIZACIÓN e IA para PYMEs y autónomos.',
    '',
    'TU OBJETIVO: resolver dudas de las visitas de forma útil y breve, y guiarlas hacia la consulta gratuita de 30 min por WhatsApp. No inventes datos que no estén aquí.',
    '',
    'SERVICIOS:',
    '1. Automatización de procesos (n8n, Make.com, webhooks, schedulers).',
    '2. Integración de IA y agentes autónomos (Claude API y Claude Code, LangChain, Python; clasificar, resumir, decidir y responder; RAG).',
    '3. Comunicación automatizada (Twilio: SMS, WhatsApp, email transaccional con SendGrid).',
    '4. Dashboards y reportes en tiempo real (Airtable, Google Sheets, Looker).',
    '5. Integración de sistemas (CRM, ERP, e-commerce; REST/JSON, Zapier, OAuth).',
    '6. Consultoría y arquitectura (ROI, roadmap, auditoría).',
    '',
    'STACK: n8n, Claude API, Claude Code, LangChain, Python, Make.com, Twilio, Airtable, Supabase, REST/JSON, Google Sheets, Voiceflow (agentes conversacionales y de voz).',
    '',
    'PROCESO (3 pasos): 1) Diagnóstico gratuito 30 min. 2) Diseño del workflow (arquitectura, flujos y fallbacks). 3) Implementación y entrega con documentación + soporte post-entrega.',
    '',
    'PRECIOS (sin IVA, pago 50% inicio / 50% entrega; presupuesto cerrado tras el diagnóstico):',
    '- Workflow Express: desde 350€. 1 workflow, 1-2 integraciones, doc básica, 14 días soporte. Entrega 3-7 días.',
    '- Sistema Pro (el más vendido): desde 1.500€. Varios workflows, Claude API para decisiones, dashboard en vivo, doc + vídeos, 30 días soporte premium. Entrega 2-3 semanas.',
    '- Arquitectura & Retainer: a medida. Auditoría, roadmap 6-12 meses, reuniones quincenales, soporte prioritario.',
    '',
    'TIEMPOS: workflow básico 3-7 días; sistema completo 2-4 semanas con entregas parciales.',
    'DISPONIBILIDAD: Kepa trabaja solo y acepta solo 3 proyectos nuevos al mes para cuidar la calidad y dar soporte real. Si no quedan plazas este mes, reserva hueco para el siguiente sin compromiso. Transmite esta escasez con naturalidad cuando haya interés.',
    'NO hace falta saber de tecnología: se entrega funcionando con documentación clara. Soporte post-entrega: si falla algo construido por Kepa, se corrige sin coste.',
    'Trabaja con PYMEs, autónomos, e-commerce, despachos y agencias. Remoto desde Bilbao, clientes en toda España. Idiomas: castellano, euskera e inglés.',
    '',
    'CONTACTO: WhatsApp +34 643 371 782 (canal principal, también para reservar la consulta) · email kepabilbao67@gmail.com · Instagram @kepa_bilbao_. En la propia web, en la sección "Agenda", hay un calendario para elegir día y hora; al confirmar se abre WhatsApp con la cita escrita. Si alguien quiere reservar, puedes sugerirle ese calendario o pasarle directamente a WhatsApp.',
    '',
    'ESTILO: responde SIEMPRE en el idioma del visitante (por defecto español de España). Tono cercano, profesional y directo. Respuestas CORTAS (2-4 frases o una lista breve). Usa **negrita** para datos clave y guiones para listas. Como mucho 1 emoji ocasional. Cuando detectes interés real, invita a reservar la consulta gratuita por WhatsApp (+34 643 371 782). Si te preguntan algo fuera de Kepa o su negocio, redirígelo con amabilidad hacia cómo Kepa puede ayudar. Nunca inventes cifras de clientes concretas.'
].join('\n');

function allowedOrigins() {
  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  const list = [...DEFAULT_ORIGINS, ...extra];
  if (process.env.VERCEL_URL) list.push('https://' + process.env.VERCEL_URL);
  return new Set(list);
}

function originOf(req) {
  const origin = req.headers.origin;
  if (origin) return origin;
  // Algunos navegadores omiten Origin en peticiones same-origin: usa Referer.
  const ref = req.headers.referer;
  if (!ref) return '';
  try { return new URL(ref).origin; } catch { return ''; }
}

const hits = new Map(); // ip -> { minute: [ts...], day: [ts...] }

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return req.headers['x-real-ip'] || (req.socket && req.socket.remoteAddress) || 'unknown';
}

function isRateLimited(ip, now = Date.now()) {
  const entry = hits.get(ip) || { minute: [], day: [] };
  entry.minute = entry.minute.filter(t => now - t < 60_000);
  entry.day = entry.day.filter(t => now - t < 86_400_000);
  const limited = entry.minute.length >= RATE_LIMIT_PER_MINUTE || entry.day.length >= RATE_LIMIT_PER_DAY;
  if (!limited) { entry.minute.push(now); entry.day.push(now); }
  hits.set(ip, entry);
  if (hits.size > 5000) {
    for (const [k, v] of hits) { if (!v.day.length || now - v.day[v.day.length - 1] > 86_400_000) hits.delete(k); }
  }
  return limited;
}

// Valida y normaliza la conversación. Devuelve null si no es válida.
function sanitizeMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const msgs = [];
  let total = 0;
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return null;
    if (typeof m.content !== 'string') return null;
    const content = m.content.trim();
    if (!content) continue;
    if (content.length > MAX_MESSAGE_CHARS) return null;
    total += content.length;
    const prev = msgs[msgs.length - 1];
    if (prev && prev.role === m.role) prev.content += '\n\n' + content; // une turnos seguidos del mismo rol
    else msgs.push({ role: m.role, content });
  }
  if (total > MAX_TOTAL_CHARS) return null;
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return null;
  return msgs;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!allowedOrigins().has(originOf(req))) {
    res.status(403).json({ error: 'Origen no permitido.' });
    return;
  }

  if (isRateLimited(clientIp(req))) {
    res.setHeader('Retry-After', '60');
    res.status(429).json({ error: 'Demasiadas peticiones. Prueba en un minuto o escríbenos por WhatsApp.' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'El chat no está disponible ahora mismo.' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    res.status(400).json({ error: 'JSON no válido.' });
    return;
  }

  const messages = sanitizeMessages(body.messages);
  if (!messages) {
    res.status(400).json({ error: 'Conversación no válida o demasiado larga.' });
    return;
  }

  const langName = LANG_NAMES[body.lang] || LANG_NAMES.es;
  const system = SYSTEM +
    '\n\nIDIOMA OBLIGATORIO: responde SIEMPRE y ÚNICAMENTE en ' + langName +
    ', sin importar en qué idioma escriba el visitante.';

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system, messages })
    });

    const data = await r.json().catch(() => null);
    if (!r.ok) {
      console.error('Anthropic API error', r.status, data && data.error);
      res.status(502).json({ error: 'El asistente no está disponible ahora mismo.' });
      return;
    }

    const reply = (data && data.content && data.content[0] && data.content[0].text) ? data.content[0].text : '';
    res.status(200).json({ reply });
  } catch (e) {
    console.error('Chat proxy failure', e);
    res.status(500).json({ error: 'El asistente no está disponible ahora mismo.' });
  }
}

// Exportado solo para tests.
export const _internal = { sanitizeMessages, isRateLimited, allowedOrigins, originOf, hits };
