/* Navegación, formularios, idiomas y asistente KEPA IA.
   Extraído de index.html; se carga en el mismo orden y posición que antes. */

/* ─── nav blur on scroll ─────────────────────────────── */
const nav = document.getElementById('nav');

/* formspree ajax */
const cForm = document.getElementById('contactForm');
const cStatus = document.getElementById('formStatus');
const cBtn = document.getElementById('submitBtn');
const WA_NUMBER = '34643371782';

function buildWaMessage(form) {
  const fd = new FormData(form);
  const nombre = (fd.get('nombre') || '').toString().trim();
  const contacto = (fd.get('contacto') || '').toString().trim();
  const proyecto = (fd.get('proyecto') || '').toString().trim();
  const lines = [
    'Hola Kepa, te escribo desde tu web:',
    '',
    `• Nombre: ${nombre}`,
    `• Contacto: ${contacto}`,
    `• Proyecto: ${proyecto}`
  ];
  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
}

// Big green WhatsApp button — a real user click is NEVER blocked by popup blockers.
function waButton(url, label) {
  return '<a href="' + url + '" target="_blank" rel="noopener" ' +
    'style="display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;' +
    'background:#25d366;color:#04210f;font-weight:700;font-size:14px;text-decoration:none;' +
    'padding:11px 18px;border-radius:10px;box-shadow:0 4px 14px rgba(37,211,102,0.35);">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>' +
    (label || 'Abrir WhatsApp') + '</a>';
}

function buildMailto(form) {
  const fd = new FormData(form);
  const nombre = (fd.get('nombre') || '').toString().trim();
  const contacto = (fd.get('contacto') || '').toString().trim();
  const proyecto = (fd.get('proyecto') || '').toString().trim();
  const subject = 'Nueva consulta web — ' + (nombre || 'sin nombre');
  const body = [
    'Hola Kepa,',
    '',
    'Quiero automatizar:',
    proyecto,
    '',
    '— ' + nombre,
    'Contacto: ' + contacto,
    '',
    '(Enviado desde kepatecnologia.com)'
  ].join('\n');
  return 'mailto:kepabilbao67@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

if (cForm) {
  cForm.addEventListener('submit', async (e) => {
    const isPlaceholder = cForm.action.includes('YOUR_FORM_ID');
    const waUrl = buildWaMessage(cForm);

    if (isPlaceholder) {
      // Sin backend: funciona igual — abrimos el correo prerelleno y dejamos WhatsApp listo.
      e.preventDefault();
      if (!cForm.checkValidity()) { cForm.reportValidity(); return; }
      const mailto = buildMailto(cForm);
      // abre el cliente de correo del visitante con todo escrito hacia tu Gmail
      window.location.href = mailto;
      cStatus.className = 'form-status show ok';
      cStatus.innerHTML = '✓ Te he abierto tu correo con el mensaje listo para enviar a <b style="color:var(--text);">kepabilbao67@gmail.com</b> — solo dale a <i>Enviar</i>.' +
        '<br>¿Prefieres WhatsApp? Pulsa aquí:' + waButton(waUrl, 'Enviar por WhatsApp');
      return;
    }

    e.preventDefault();
    if (!cForm.checkValidity()) { cForm.reportValidity(); return; }
    cBtn.disabled = true;
    cBtn.querySelector('.btn-label').textContent = 'Enviando...';
    cStatus.className = 'form-status';

    try {
      const res = await fetch(cForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(cForm)
      });
      if (res.ok) {
        // Email enviado vía Formspree. No abrimos WhatsApp automáticamente (lo bloquea el navegador):
        // mostramos un botón que el cliente pulsa — un clic real nunca se bloquea.
        cStatus.className = 'form-status show ok';
        cStatus.innerHTML = '✓ ¡Mensaje enviado! Te respondo en &lt; 24h.' +
          '<br>Para confirmar al momento, escríbeme también por WhatsApp:' + waButton(waUrl, 'Confirmar por WhatsApp');
        cForm.reset();
      } else {
        throw new Error('bad response');
      }
    } catch (err) {
      // Backend fail — ofrecemos WhatsApp como botón (no auto-open, que se bloquea).
      cStatus.className = 'form-status show ok';
      cStatus.innerHTML = '✓ Tu mensaje está listo. Envíamelo por WhatsApp en un toque:' + waButton(waUrl, 'Enviar por WhatsApp') +
        '<br><span style="font-size:12px;color:var(--text-mute);">¿Prefieres email? <a href="mailto:kepabilbao67@gmail.com" style="color:var(--orange);text-decoration:underline;">kepabilbao67@gmail.com</a></span>';
    } finally {
      cBtn.disabled = false;
      cBtn.querySelector('.btn-label').textContent = 'Enviar mensaje';
    }
  });
}

/* hamburger */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');
function closeMenu() {
  if (!navLinks) return;
  navLinks.classList.remove('open');
  navToggle.classList.remove('open');
  navBackdrop.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navBackdrop.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navBackdrop.addEventListener('click', closeMenu);
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ─── typewriter ─────────────────────────────────────── */
const phrases = [
  "automatiza tu negocio.",
  "escala sin contratar.",
  "conecta tus sistemas.",
  "multiplica tu tiempo."
];
const tw = document.getElementById('typewriter');
let pi = 0, ci = 0, deleting = false;

function tick() {
  const word = phrases[pi];
  if (!deleting) {
    ci++;
    tw.textContent = word.slice(0, ci);
    if (ci === word.length) {
      deleting = true;
      return setTimeout(tick, 1800);
    }
    setTimeout(tick, 55 + Math.random() * 60);
  } else {
    ci--;
    tw.textContent = word.slice(0, ci);
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      return setTimeout(tick, 280);
    }
    setTimeout(tick, 28 + Math.random() * 28);
  }
}
tw.textContent = phrases[0];
ci = phrases[0].length;
setTimeout(() => { deleting = true; tick(); }, 1500);

/* ─── reveal on scroll ───────────────────────────────── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ─── faq accordion ──────────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-a').style.maxHeight = '0px';
    });
    if (!isOpen) {
      item.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

/* ─── smooth scroll for in-page links ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

/* ─── KEPA IA assistant (real AI via window.claude) ──── */
(function () {
  const WA_NUMBER = '34643371782';
  const widget   = document.getElementById('kiaWidget');
  const launcher = document.getElementById('kiaLauncher');
  const closeBtn = document.getElementById('kiaClose');
  const panel    = document.getElementById('kiaPanel');
  const body     = document.getElementById('kiaBody');
  const quick    = document.getElementById('kiaQuick');
  const input    = document.getElementById('kiaInput');
  const sendBtn  = document.getElementById('kiaSend');
  const bubble   = document.getElementById('kiaBubble');
  const bubbleX  = document.getElementById('kiaBubbleX');
  const voiceBtn = document.getElementById('kiaVoice');
  if (!widget) return;

  /* ---- text-to-speech (voz) ---- */
  const tts = window.speechSynthesis;
  const ttsSupported = !!tts;
  let voiceOn = localStorage.getItem('kiaVoiceOn') === '1';
  let esVoice = null;

  function pickVoice() {
    if (!ttsSupported) return;
    const voices = tts.getVoices();
    if (!voices.length) return;

    // Professional Spanish (Spain) MALE voices, best first.
    // Male, high-quality, neutral-professional delivery preferred.
    const PREFERRED = [
      'jorge', 'pablo', 'álvaro', 'alvaro', 'enrique', 'carlos',
      'microsoft álvaro', 'microsoft alvaro', 'microsoft pablo', 'microsoft jorge',
      'diego', 'miguel', 'google español'
    ];

    function score(v) {
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      let s = 0;
      if (/es[-_]es/.test(lang)) s += 100;          // Spain Spanish
      else if (/^es/.test(lang)) s += 40;           // any Spanish
      const idx = PREFERRED.findIndex(p => name.includes(p));
      if (idx !== -1) s += (60 - idx * 4);          // earlier = better
      if (/neural|natural|google|premium|enhanced/.test(name)) s += 25; // quality
      if (/jorge|pablo|álvaro|alvaro|carlos|diego|enrique|miguel|male|hombre|masculin/.test(name)) s += 35; // prefer male
      if (/mónica|monica|helena|elvira|laura|sabina|paulina|marisol|female|mujer|femenin/.test(name)) s -= 30; // de-prioritize female
      return s;
    }

    esVoice = voices
      .filter(v => /^es/i.test(v.lang))
      .sort((a, b) => score(b) - score(a))[0]
      || voices.sort((a, b) => score(b) - score(a))[0]
      || null;
  }
  if (ttsSupported) {
    pickVoice();
    tts.onvoiceschanged = pickVoice;
  }

  function plainText(md) {
    return md
      .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[*_`#>•-]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/👋|🚀|🙌|👍|📅|🕑/g, '')
      .trim();
  }

  function speak(text) {
    if (!ttsSupported || !voiceOn) return;
    try {
      tts.cancel();
      const u = new SpeechSynthesisUtterance(plainText(text));
      const lc = kiaLang(), info = KIA_LANGS[lc];
      u.lang = info.speech;
      const v = lc === 'es' ? (esVoice || voiceForLang(info.speech)) : voiceForLang(info.speech);
      if (v) u.voice = v;
      u.rate = 0.97; u.pitch = lc === 'es' ? 0.9 : 1;
      u.onstart = () => voiceBtn.classList.add('speaking');
      u.onend = () => voiceBtn.classList.remove('speaking');
      u.onerror = () => voiceBtn.classList.remove('speaking');
      tts.speak(u);
    } catch (e) { /* no-op */ }
  }

  function syncVoiceBtn() {
    voiceBtn.classList.toggle('muted', !voiceOn);
    voiceBtn.classList.toggle('on', voiceOn);
    voiceBtn.setAttribute('aria-label', voiceOn ? 'Silenciar voz' : 'Activar voz');
    voiceBtn.title = voiceOn ? 'Voz activada — clic para silenciar' : 'Leer respuestas en voz alta';
  }
  if (!ttsSupported) { voiceBtn.style.display = 'none'; }
  syncVoiceBtn();

  voiceBtn.addEventListener('click', () => {
    voiceOn = !voiceOn;
    localStorage.setItem('kiaVoiceOn', voiceOn ? '1' : '0');
    syncVoiceBtn();
    if (!voiceOn) { tts && tts.cancel(); voiceBtn.classList.remove('speaking'); }
    else {
      // speak the last bot message as confirmation
      const last = [...body.querySelectorAll('.kia-msg.bot')].pop();
      if (last && last.dataset.raw) speak(last.dataset.raw);
    }
  });

  /* ---- idioma activo (compartido con la guía por voz) ---- */
  const KIA_LANGS = {
    es: { speech:'es-ES', name:'español de España (castellano)',
          greet:'¡Hola! 👋 Soy **KEPA IA**, el asistente de Kepa. Te ayudo a entender qué se puede automatizar en tu negocio, qué cuesta y cuánto tarda. ¿Qué te gustaría saber?',
          chips:['¿Qué puedes automatizar?','Ver precios','¿Cuánto tarda un proyecto?','Reservar consulta gratis'],
          ph:'Escribe tu pregunta…',
          err1:'Perdona, no he podido procesar eso ahora mismo. Puedes escribir a Kepa directamente por WhatsApp 👇',
          err2:'Ahora mismo no puedo responder por una limitación temporal. Escríbele a Kepa directamente — te contesta en persona 👇' },
    en: { speech:'en-US', name:'English',
          greet:'Hi! 👋 I\u2019m **KEPA IA**, Kepa\u2019s assistant. I help you understand what can be automated in your business, what it costs and how long it takes. What would you like to know?',
          chips:['What can you automate?','See pricing','How long does a project take?','Book a free consultation'],
          ph:'Type your question…',
          err1:'Sorry, I couldn\u2019t process that right now. You can message Kepa directly on WhatsApp 👇',
          err2:'I can\u2019t answer right now due to a temporary limitation. Message Kepa directly — he replies in person 👇' },
    ca: { speech:'ca-ES', name:'català',
          greet:'Hola! 👋 Sóc **KEPA IA**, l\u2019assistent d\u2019en Kepa. T\u2019ajudo a entendre què es pot automatitzar al teu negoci, què costa i quant triga. Què t\u2019agradaria saber?',
          chips:['Què pots automatitzar?','Veure preus','Quant triga un projecte?','Reservar consulta gratis'],
          ph:'Escriu la teva pregunta…',
          err1:'Perdona, no he pogut processar això ara mateix. Pots escriure a en Kepa directament per WhatsApp 👇',
          err2:'Ara mateix no puc respondre per una limitació temporal. Escriu-li a en Kepa directament — et contesta en persona 👇' },
    eu: { speech:'eu-ES', name:'euskara',
          greet:'Kaixo! 👋 **KEPA IA** naiz, Kepen laguntzailea. Zure negozioan zer automatiza daitekeen, zenbat balio duen eta zenbat denbora behar duen ulertzen laguntzen dizut. Zer jakin nahi duzu?',
          chips:['Zer automatiza dezakezu?','Prezioak ikusi','Zenbat irauten du proiektu batek?','Doako kontsulta erreserbatu'],
          ph:'Idatzi zure galdera…',
          err1:'Barkatu, ezin izan dut hori orain prozesatu. Kepari zuzenean idatz diezaiokezu WhatsApp bidez 👇',
          err2:'Orain ezin dizut erantzun muga tekniko batengatik. Idatzi Kepari zuzenean — berak erantzungo dizu 👇' },
    gl: { speech:'gl-ES', name:'galego',
          greet:'Ola! 👋 Son **KEPA IA**, o asistente de Kepa. Axúdoche a entender que se pode automatizar no teu negocio, canto custa e canto tarda. Que che gustaría saber?',
          chips:['Que podes automatizar?','Ver prezos','Canto tarda un proxecto?','Reservar consulta gratis'],
          ph:'Escribe a túa pregunta…',
          err1:'Perdoa, non puiden procesar iso agora mesmo. Podes escribirlle a Kepa directamente por WhatsApp 👇',
          err2:'Agora mesmo non podo responder por unha limitación temporal. Escríbelle a Kepa directamente — respóndeche en persoa 👇' },
    de: { speech:'de-DE', name:'Deutsch',
          greet:'Hallo! 👋 Ich bin **KEPA IA**, Kepas Assistent. Ich helfe dir zu verstehen, was sich in deinem Unternehmen automatisieren lässt, was es kostet und wie lange es dauert. Was möchtest du wissen?',
          chips:['Was kannst du automatisieren?','Preise ansehen','Wie lange dauert ein Projekt?','Kostenloses Gespräch buchen'],
          ph:'Schreib deine Frage…',
          err1:'Entschuldige, das konnte ich gerade nicht verarbeiten. Du kannst Kepa direkt per WhatsApp schreiben 👇',
          err2:'Ich kann gerade wegen einer vorübergehenden Einschränkung nicht antworten. Schreib Kepa direkt — er antwortet persönlich 👇' },
    it: { speech:'it-IT', name:'italiano',
          greet:'Ciao! 👋 Sono **KEPA IA**, l\u2019assistente di Kepa. Ti aiuto a capire cosa si può automatizzare nella tua attività, quanto costa e quanto tempo richiede. Cosa vuoi sapere?',
          chips:['Cosa puoi automatizzare?','Vedi i prezzi','Quanto dura un progetto?','Prenota una consulenza gratis'],
          ph:'Scrivi la tua domanda…',
          err1:'Scusa, non sono riuscito a elaborarlo ora. Puoi scrivere a Kepa direttamente su WhatsApp 👇',
          err2:'Al momento non posso rispondere per una limitazione temporanea. Scrivi a Kepa direttamente — ti risponde di persona 👇' },
    zh: { speech:'zh-CN', name:'简体中文',
          greet:'你好！👋 我是 **KEPA IA**，Kepa 的助手。我帮你了解你的业务中哪些可以自动化、费用多少、需要多久。你想了解什么？',
          chips:['你能自动化什么？','查看价格','一个项目需要多久？','预约免费咨询'],
          ph:'输入你的问题…',
          err1:'抱歉，现在无法处理。你可以直接通过 WhatsApp 联系 Kepa 👇',
          err2:'由于临时限制，我现在无法回复。请直接联系 Kepa —— 他会亲自回复 👇' }
  };
  function kiaLang() {
    const c = localStorage.getItem('kepaGuideLang');
    return (c && KIA_LANGS[c]) ? c : 'es';
  }
  function voiceForLang(speech) {
    if (!ttsSupported) return null;
    const voices = tts.getVoices(); if (!voices.length) return null;
    const target = speech.toLowerCase(), base = target.split('-')[0];
    const scored = voices.map(v => {
      const l = (v.lang||'').toLowerCase().replace('_','-'), n = (v.name||'').toLowerCase();
      let s = -1;
      if (l === target) s = 100; else if (l.split('-')[0] === base) s = 60; else return null;
      if (/neural|natural|google|premium|enhanced/.test(n)) s += 20;
      return { v, s };
    }).filter(Boolean).sort((a,b)=>b.s-a.s);
    return scored.length ? scored[0].v : null;
  }

  /* ---- knowledge base + behaviour ---- */
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

  let history = [];           // {role, content}
  let busy = false;
  let started = false;

  /* ---- helpers ---- */
  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // minimal, safe markdown → html
  function renderMd(raw) {
    const lines = escapeHtml(raw.trim()).split(/\n/);
    let html = '', list = [];
    const flush = () => { if (list.length) { html += '<ul>' + list.map(li => '<li>' + li + '</li>').join('') + '</ul>'; list = []; } };
    const inline = (t) => t
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/(^|[\s(])(https?:\/\/[^\s)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
    lines.forEach(line => {
      const t = line.trim();
      if (/^[-•*]\s+/.test(t)) { list.push(inline(t.replace(/^[-•*]\s+/, ''))); }
      else if (t === '') { flush(); }
      else { flush(); html += '<p>' + inline(t) + '</p>'; }
    });
    flush();
    return html || '<p>' + inline(escapeHtml(raw)) + '</p>';
  }

  function addMsg(text, who) {
    const m = document.createElement('div');
    m.className = 'kia-msg ' + who;
    m.innerHTML = who === 'bot' ? renderMd(text) : escapeHtml(text);
    if (who === 'bot') {
      m.dataset.raw = text;
      if (ttsSupported) {
        const sp = document.createElement('button');
        sp.className = 'kia-speak';
        sp.type = 'button';
        sp.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg> Escuchar';
        sp.addEventListener('click', () => {
          const wasOn = voiceOn;
          voiceOn = true;            // allow this one to play
          speak(text);
          voiceOn = wasOn;
        });
        m.appendChild(sp);
      }
      if (voiceOn) speak(text);
    }
    body.appendChild(m);
    scrollDown();
    return m;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'kia-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t);
    scrollDown();
    return t;
  }

  function setChips(list) {
    quick.innerHTML = '';
    list.forEach(item => {
      const isCta = typeof item === 'object';
      const c = document.createElement(isCta && item.href ? 'a' : 'button');
      c.className = 'kia-chip' + (isCta ? ' cta' : '');
      c.textContent = isCta ? item.label : item;
      if (isCta && item.href) { c.href = item.href; c.target = '_blank'; c.rel = 'noopener'; }
      else { c.addEventListener('click', () => send(isCta ? item.label : item)); }
      quick.appendChild(c);
    });
  }
  function clearChips() { quick.innerHTML = ''; }

  const INTRO_CHIPS = ['¿Qué puedes automatizar?', 'Ver precios', '¿Cuánto tarda un proyecto?', 'Reservar consulta gratis'];

  function startConversation() {
    if (started) return;
    started = true;
    const info = KIA_LANGS[kiaLang()];
    if (input) input.placeholder = info.ph;
    const t = showTyping();
    setTimeout(() => {
      t.remove();
      addMsg(info.greet, 'bot');
      setChips(info.chips);
    }, 700);
  }

  /* si el visitante cambia de idioma, refresca el saludo y el placeholder */
  window.addEventListener('kepa-lang-change', () => {
    const info = KIA_LANGS[kiaLang()];
    if (input) input.placeholder = info.ph;
    const hasUser = history.some(h => h.role === 'user');
    if (started && !hasUser) {
      body.innerHTML = '';
      clearChips();
      addMsg(info.greet, 'bot');
      setChips(info.chips);
    }
  });

  /* usa el puente window.claude en este entorno; en producción llama a /api/chat
     (api/chat.js tiene su propia copia de SYSTEM, que es la que manda en producción) */
  async function getReply(messages) {
    if (window.claude && typeof window.claude.complete === 'function') {
      return await window.claude.complete({ messages });
    }
    // En producción el prompt de sistema lo pone el servidor: solo se envía la conversación.
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: messages.slice(2), lang: kiaLang() })
    });
    if (!res.ok) throw new Error('api ' + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.reply || '';
  }

  async function send(value) {
    const text = (value || '').toString().trim();
    if (!text || busy) return;
    clearChips();
    addMsg(text, 'user');
    input.value = '';
    history.push({ role: 'user', content: text });

    busy = true;
    input.disabled = true;
    sendBtn.disabled = true;
    const typing = showTyping();

    // keep last 12 turns to bound tokens
    const trimmed = history.slice(-12);
    const langInfo = KIA_LANGS[kiaLang()];
    const messages = [
      { role: 'user', content: SYSTEM + '\n\nIDIOMA OBLIGATORIO: responde SIEMPRE y ÚNICAMENTE en ' + langInfo.name + ', sin importar en qué idioma escriba el visitante. Si el visitante cambia de idioma, sigue respondiendo en ' + langInfo.name + '.\n\n---\nA partir de ahora respondes como KEPA IA. Primer mensaje del visitante a continuación.' },
      { role: 'assistant', content: 'Entendido. Soy KEPA IA y responderé breve y útil en ' + langInfo.name + '.' },
      ...trimmed
    ];

    try {
      const reply = await getReply(messages);
      typing.remove();
      const answer = (reply && reply.trim()) ? reply.trim()
        : KIA_LANGS[kiaLang()].err1;
      addMsg(answer, 'bot');
      history.push({ role: 'assistant', content: answer });

      // booking nudge chips if the reply or question hints at hiring/contact
      const hint = (text + ' ' + answer).toLowerCase();
      if (/precio|cuesta|contrat|reserv|consult|empez|presupuesto|whatsapp|contact|cita|agenda/.test(hint)) {
        setChips([
          { label: 'Reservar por WhatsApp', href: bookLink() },
          { label: 'Escribir por WhatsApp', href: waLink(text) }
        ]);
      }
    } catch (err) {
      typing.remove();
      addMsg(KIA_LANGS[kiaLang()].err2, 'bot');
      setChips([
        { label: 'Escribir por WhatsApp', href: waLink(text) },
        { label: 'Reservar por WhatsApp', href: bookLink() }
      ]);
    } finally {
      busy = false;
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function waLink(context) {
    const msg = 'Hola Kepa, te escribo desde tu web 👋\n\n' +
      (context ? 'Me interesa: ' + context : 'Quiero la consulta gratuita.');
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }
  function bookLink() {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Hola Kepa, quiero reservar la consulta gratuita de 30 min.');
  }

  /* ---- open / close ---- */
  function setOpen(open) {
    widget.classList.toggle('open', open);
    launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) { hideBubble(); startConversation(); setTimeout(() => input.focus(), 320); }
    else { if (ttsSupported) { tts.cancel(); voiceBtn.classList.remove('speaking'); } }
  }
  function toggle() { setOpen(!widget.classList.contains('open')); }

  /* ---- greeting bubble ---- */
  let bubbleTimer;
  function hideBubble() { bubble.classList.remove('show'); }
  function maybeShowBubble() {
    if (sessionStorage.getItem('kiaBubbleDismissed')) return;
    bubbleTimer = setTimeout(() => {
      if (!widget.classList.contains('open')) bubble.classList.add('show');
    }, 2600);
  }
  bubble.addEventListener('click', () => setOpen(true));
  bubbleX.addEventListener('click', (e) => {
    e.stopPropagation();
    hideBubble();
    sessionStorage.setItem('kiaBubbleDismissed', '1');
  });

  launcher.addEventListener('click', toggle);
  closeBtn.addEventListener('click', () => setOpen(false));
  sendBtn.addEventListener('click', () => send(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(input.value); });

  // hero "Habla con KEPA IA" button
  document.querySelectorAll('[data-open-kia]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); setOpen(true); });
  });

  maybeShowBubble();
})();
