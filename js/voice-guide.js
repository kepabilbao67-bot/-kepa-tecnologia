/* Guía por voz: narra cada sección al pasar el ratón.
   Extraído de index.html; se carga en el mismo orden y posición que antes. */

/* ─── voice guide: narra cada sección al pasar el ratón ── */
(function () {
  const btn     = document.getElementById('guideBtn');
  const caption = document.getElementById('vozCaption');
  const capText = document.getElementById('vozText');
  if (!btn) return;
  const label = btn.querySelector('.guide-label');
  const tts = window.speechSynthesis;
  if (!tts) { btn.style.display = 'none'; return; }

  /* ─── idiomas disponibles para la guía ───────────────── */
  const LANGS = [
    { code:'es', label:'Español', speech:'es-ES' },
    { code:'en', label:'English', speech:'en-US' },
    { code:'ca', label:'Català',  speech:'ca-ES' },
    { code:'eu', label:'Euskara', speech:'eu-ES' },
    { code:'gl', label:'Galego',  speech:'gl-ES' },
    { code:'de', label:'Deutsch', speech:'de-DE' },
    { code:'it', label:'Italiano', speech:'it-IT' },
    { code:'zh', label:'中文',     speech:'zh-CN' }
  ];
  const SECTIONS = ['header','.trust','#servicios','#stack','#precios','#proceso','#casos','#testimonios','#agenda','#contenido','#faq','#contacto'];

  /* explicaciones por sección en cada idioma (se leen y se muestran) */
  const TEXTS = {
    es: {
      'header':'Bienvenido a KEPA tecnología. Soy Kepa, freelance en Bilbao especializado en automatización e inteligencia artificial para pequeñas y medianas empresas. Te ayudo a ahorrar horas de trabajo repetitivo.',
      '.trust':'Estas son las herramientas con las que construyo tus automatizaciones: Make, ene ocho ene, Claude, WhatsApp, Airtable, Google Sheets y Voiceflow. Tecnología fiable que ya usan miles de empresas.',
      '#servicios':'Aquí tienes mis servicios: automatización de procesos, integración de inteligencia artificial, comunicación automática, paneles de datos en tiempo real, integración de sistemas y consultoría. Todo a medida de tu negocio.',
      '#stack':'Este es mi stack tecnológico: las plataformas y conexiones que combino para que tus procesos funcionen solos, de principio a fin.',
      '#precios':'Tres formas de empezar. El Workflow Express desde trescientos cincuenta euros, el Sistema Pro desde mil quinientos euros, y un formato a medida con mantenimiento. Solo acepto tres proyectos nuevos al mes para cuidar la calidad.',
      '#proceso':'Mi proceso tiene tres pasos: primero un diagnóstico gratuito de treinta minutos, después diseño el flujo de trabajo, y por último lo implemento y te lo entrego funcionando, con documentación y soporte.',
      '#casos':'Casos reales con resultados medibles: horas ahorradas cada semana, errores eliminados y retorno de la inversión en pocos meses. Resultados concretos, no promesas.',
      '#testimonios':'Lo que dicen los negocios que ya dejaron de hacerlo todo a mano: recuperaron tiempo, atienden a más clientes y trabajan con menos errores.',
      '#agenda':'Aquí puedes reservar tu consulta gratuita. Elige un día y una hora en el calendario y, al confirmar, se abre WhatsApp con la cita escrita. Treinta minutos, sin compromiso.',
      '#contenido':'Cada semana publico en Instagram la serie Superprompt: un prompt o un caso real de automatización con inteligencia artificial, listo para que lo copies y lo apliques a tu negocio.',
      '#faq':'Preguntas frecuentes: aquí respondo las dudas más habituales sobre precio, tiempos, qué pasa si algo falla y si necesitas conocimientos técnicos. Spoiler: no hacen falta.',
      '#contacto':'Y aquí empezamos. Cuéntame qué quieres automatizar por el formulario, por WhatsApp, por teléfono o por correo. Te respondo en menos de veinticuatro horas.'
    },
    en: {
      'header':'Welcome to KEPA technology. I am Kepa, a freelancer in Bilbao specialized in automation and artificial intelligence for small and medium businesses. I help you save hours of repetitive work.',
      '.trust':'These are the tools I use to build your automations: Make, n8n, Claude, WhatsApp, Airtable, Google Sheets and Voiceflow. Reliable technology already used by thousands of companies.',
      '#servicios':'Here are my services: process automation, artificial intelligence integration, automatic communication, real-time data dashboards, systems integration and consulting. All tailored to your business.',
      '#stack':'This is my tech stack: the platforms and connections I combine so your processes run on their own, from start to finish.',
      '#precios':'Three ways to start. The Workflow Express from three hundred and fifty euros, the Pro System from one thousand five hundred euros, and a custom format with maintenance. I only take three new projects a month to protect quality.',
      '#proceso':'My process has three steps: first a free thirty-minute diagnosis, then I design the workflow, and finally I implement it and deliver it working, with documentation and support.',
      '#casos':'Real cases with measurable results: hours saved every week, errors eliminated and return on investment in just a few months. Concrete results, not promises.',
      '#testimonios':'What businesses say after they stopped doing everything by hand: they got their time back, serve more clients and work with fewer errors.',
      '#agenda':'Here you can book your free consultation. Pick a day and time on the calendar and, when you confirm, WhatsApp opens with the appointment written out. Thirty minutes, no commitment.',
      '#contenido':'Every week I publish the Superprompt series on Instagram: a prompt or a real automation case with artificial intelligence, ready for you to copy and apply to your business.',
      '#faq':'Frequently asked questions: here I answer the most common doubts about price, timing, what happens if something fails and whether you need technical knowledge. Spoiler: you do not.',
      '#contacto':'And here is where we begin. Tell me what you want to automate through the form, WhatsApp, phone or email. I reply in under twenty-four hours.'
    },
    ca: {
      'header':'Benvingut a KEPA tecnologia. Sóc en Kepa, autònom a Bilbao especialitzat en automatització i intel·ligència artificial per a petites i mitjanes empreses. T\u2019ajudo a estalviar hores de feina repetitiva.',
      '.trust':'Aquestes són les eines amb què construeixo les teves automatitzacions: Make, ene vuit ene, Claude, WhatsApp, Airtable, Google Sheets i Voiceflow. Tecnologia fiable que ja fan servir milers d\u2019empreses.',
      '#servicios':'Aquí tens els meus serveis: automatització de processos, integració d\u2019intel·ligència artificial, comunicació automàtica, panells de dades en temps real, integració de sistemes i consultoria. Tot a mida del teu negoci.',
      '#stack':'Aquest és el meu stack tecnològic: les plataformes i connexions que combino perquè els teus processos funcionin sols, de principi a fi.',
      '#precios':'Tres maneres de començar. El Workflow Express des de tres-cents cinquanta euros, el Sistema Pro des de mil cinc-cents euros, i un format a mida amb manteniment. Només accepto tres projectes nous al mes per cuidar la qualitat.',
      '#proceso':'El meu procés té tres passos: primer un diagnòstic gratuït de trenta minuts, després dissenyo el flux de treball, i finalment l\u2019implemento i te\u2019l lliuro funcionant, amb documentació i suport.',
      '#casos':'Casos reals amb resultats mesurables: hores estalviades cada setmana, errors eliminats i retorn de la inversió en pocs mesos. Resultats concrets, no promeses.',
      '#testimonios':'El que diuen els negocis que ja van deixar de fer-ho tot a mà: van recuperar temps, atenen més clients i treballen amb menys errors.',
      '#agenda':'Aquí pots reservar la teva consulta gratuïta. Tria un dia i una hora al calendari i, en confirmar, s\u2019obre WhatsApp amb la cita escrita. Trenta minuts, sense compromís.',
      '#contenido':'Cada setmana publico a Instagram la sèrie Superprompt: un prompt o un cas real d\u2019automatització amb intel·ligència artificial, a punt perquè el copiïs i l\u2019apliquis al teu negoci.',
      '#faq':'Preguntes freqüents: aquí responc els dubtes més habituals sobre preu, terminis, què passa si alguna cosa falla i si necessites coneixements tècnics. Spoiler: no en calen.',
      '#contacto':'I aquí comencem. Explica\u2019m què vols automatitzar pel formulari, per WhatsApp, per telèfon o per correu. Et responc en menys de vint-i-quatre hores.'
    },
    eu: {
      'header':'Ongi etorri KEPA teknologiara. Kepa naiz, Bilboko autonomoa, automatizazioan eta adimen artifizialean espezializatua enpresa txiki eta ertainentzat. Lan errepikakorreko orduak aurrezten laguntzen dizut.',
      '.trust':'Hauek dira zure automatizazioak eraikitzeko erabiltzen ditudan tresnak: Make, ene zortzi ene, Claude, WhatsApp, Airtable, Google Sheets eta Voiceflow. Milaka enpresak jada erabiltzen duten teknologia fidagarria.',
      '#servicios':'Hona hemen nire zerbitzuak: prozesuen automatizazioa, adimen artifizialaren integrazioa, komunikazio automatikoa, denbora errealeko datu-panelak, sistemen integrazioa eta aholkularitza. Dena zure negoziora egokitua.',
      '#stack':'Hau da nire teknologia-stacka: zure prozesuek berez funtziona dezaten, hasieratik amaierara, konbinatzen ditudan plataformak eta konexioak.',
      '#precios':'Hasteko hiru modu. Workflow Express hirurehun eta berrogeita hamar eurotik, Sistema Pro mila eta bostehun eurotik, eta mantentze-lanekin neurrira egindako formatua. Hilean hiru proiektu berri baino ez ditut onartzen kalitatea zaintzeko.',
      '#proceso':'Nire prozesuak hiru urrats ditu: lehenik hogeita hamar minutuko doako diagnostikoa, gero lan-fluxua diseinatzen dut, eta azkenik ezarri eta martxan entregatzen dizut, dokumentazioarekin eta laguntzarekin.',
      '#casos':'Emaitza neurgarriak dituzten benetako kasuak: astero aurreztutako orduak, ezabatutako erroreak eta inbertsioaren itzulera hilabete gutxitan. Emaitza zehatzak, ez promesak.',
      '#testimonios':'Dena eskuz egiteari utzi zioten negozioek diotena: denbora berreskuratu zuten, bezero gehiago artatzen dituzte eta errore gutxiagorekin lan egiten dute.',
      '#agenda':'Hemen zure doako kontsulta erreserba dezakezu. Aukeratu egun eta ordu bat egutegian eta, berresterakoan, WhatsApp irekitzen da hitzordua idatzita. Hogeita hamar minutu, konpromisorik gabe.',
      '#contenido':'Astero Instagramen Superprompt seriea argitaratzen dut: adimen artifizialarekin automatizatzeko prompt bat edo benetako kasu bat, kopiatu eta zure negozioan aplikatzeko prest.',
      '#faq':'Ohiko galderak: hemen prezioari, epeei, zerbaitek huts egiten badu zer gertatzen den eta ezagutza teknikorik behar duzun buruzko zalantza ohikoenak erantzuten ditut. Spoiler: ez dira behar.',
      '#contacto':'Eta hemen hasten gara. Esadazu zer automatizatu nahi duzun formularioaren, WhatsAppen, telefonoaren edo posta bidez. Hogeita lau ordu baino lehen erantzuten dizut.'
    },
    gl: {
      'header':'Benvido a KEPA tecnoloxía. Son Kepa, autónomo en Bilbao especializado en automatización e intelixencia artificial para pequenas e medianas empresas. Axúdoche a aforrar horas de traballo repetitivo.',
      '.trust':'Estas son as ferramentas coas que construo as túas automatizacións: Make, ene oito ene, Claude, WhatsApp, Airtable, Google Sheets e Voiceflow. Tecnoloxía fiable que xa usan miles de empresas.',
      '#servicios':'Aquí tes os meus servizos: automatización de procesos, integración de intelixencia artificial, comunicación automática, paneis de datos en tempo real, integración de sistemas e consultoría. Todo á medida do teu negocio.',
      '#stack':'Este é o meu stack tecnolóxico: as plataformas e conexións que combino para que os teus procesos funcionen sós, de principio a fin.',
      '#precios':'Tres formas de comezar. O Workflow Express desde trescentos cincuenta euros, o Sistema Pro desde mil cincocentos euros, e un formato a medida con mantemento. Só acepto tres proxectos novos ao mes para coidar a calidade.',
      '#proceso':'O meu proceso ten tres pasos: primeiro un diagnóstico gratuíto de trinta minutos, despois deseño o fluxo de traballo, e por último impleméntoo e entrégocho funcionando, con documentación e soporte.',
      '#casos':'Casos reais con resultados medibles: horas aforradas cada semana, erros eliminados e retorno do investimento en poucos meses. Resultados concretos, non promesas.',
      '#testimonios':'O que din os negocios que xa deixaron de facelo todo a man: recuperaron tempo, atenden a máis clientes e traballan con menos erros.',
      '#agenda':'Aquí podes reservar a túa consulta gratuíta. Escolle un día e unha hora no calendario e, ao confirmar, ábrese WhatsApp coa cita escrita. Trinta minutos, sen compromiso.',
      '#contenido':'Cada semana publico en Instagram a serie Superprompt: un prompt ou un caso real de automatización con intelixencia artificial, listo para que o copies e o apliques ao teu negocio.',
      '#faq':'Preguntas frecuentes: aquí respondo as dúbidas máis habituais sobre prezo, prazos, que pasa se algo falla e se necesitas coñecementos técnicos. Spoiler: non fan falta.',
      '#contacto':'E aquí comezamos. Cóntame que queres automatizar polo formulario, por WhatsApp, por teléfono ou por correo. Respóndoche en menos de vinte e catro horas.'
    },
    de: {
      'header':'Willkommen bei KEPA Technologie. Ich bin Kepa, Freelancer in Bilbao, spezialisiert auf Automatisierung und künstliche Intelligenz für kleine und mittlere Unternehmen. Ich helfe dir, Stunden repetitiver Arbeit zu sparen.',
      '.trust':'Das sind die Werkzeuge, mit denen ich deine Automatisierungen baue: Make, n8n, Claude, WhatsApp, Airtable, Google Sheets und Voiceflow. Zuverlässige Technologie, die bereits Tausende Unternehmen nutzen.',
      '#servicios':'Hier sind meine Leistungen: Prozessautomatisierung, Integration künstlicher Intelligenz, automatische Kommunikation, Echtzeit-Datendashboards, Systemintegration und Beratung. Alles maßgeschneidert für dein Unternehmen.',
      '#stack':'Das ist mein Technologie-Stack: die Plattformen und Verbindungen, die ich kombiniere, damit deine Prozesse von Anfang bis Ende von selbst laufen.',
      '#precios':'Drei Möglichkeiten zu starten. Der Workflow Express ab dreihundertfünfzig Euro, das Pro-System ab tausendfünfhundert Euro und ein maßgeschneidertes Format mit Wartung. Ich nehme nur drei neue Projekte pro Monat an, um die Qualität zu sichern.',
      '#proceso':'Mein Prozess hat drei Schritte: zuerst eine kostenlose dreißigminütige Analyse, dann entwerfe ich den Workflow und schließlich setze ich ihn um und liefere ihn funktionsfähig, mit Dokumentation und Support.',
      '#casos':'Echte Fälle mit messbaren Ergebnissen: jede Woche gesparte Stunden, beseitigte Fehler und Amortisation in wenigen Monaten. Konkrete Ergebnisse, keine Versprechen.',
      '#testimonios':'Was Unternehmen sagen, die aufgehört haben, alles von Hand zu machen: Sie haben Zeit zurückgewonnen, betreuen mehr Kunden und arbeiten mit weniger Fehlern.',
      '#agenda':'Hier kannst du dein kostenloses Beratungsgespräch buchen. Wähle einen Tag und eine Uhrzeit im Kalender und bei der Bestätigung öffnet sich WhatsApp mit dem geschriebenen Termin. Dreißig Minuten, unverbindlich.',
      '#contenido':'Jede Woche veröffentliche ich auf Instagram die Superprompt-Reihe: einen Prompt oder einen echten Automatisierungsfall mit künstlicher Intelligenz, bereit zum Kopieren und Anwenden in deinem Unternehmen.',
      '#faq':'Häufige Fragen: hier beantworte ich die häufigsten Zweifel zu Preis, Zeit, was passiert, wenn etwas schiefgeht, und ob du technisches Wissen brauchst. Spoiler: brauchst du nicht.',
      '#contacto':'Und hier beginnen wir. Sag mir, was du automatisieren möchtest, über das Formular, WhatsApp, Telefon oder E-Mail. Ich antworte in weniger als vierundzwanzig Stunden.'
    },
    it: {
      'header':'Benvenuto in KEPA tecnologia. Sono Kepa, freelance a Bilbao specializzato in automazione e intelligenza artificiale per piccole e medie imprese. Ti aiuto a risparmiare ore di lavoro ripetitivo.',
      '.trust':'Questi sono gli strumenti con cui costruisco le tue automazioni: Make, n8n, Claude, WhatsApp, Airtable, Google Sheets e Voiceflow. Tecnologia affidabile già usata da migliaia di aziende.',
      '#servicios':'Ecco i miei servizi: automazione dei processi, integrazione dell’intelligenza artificiale, comunicazione automatica, dashboard di dati in tempo reale, integrazione di sistemi e consulenza. Tutto su misura per la tua attività.',
      '#stack':'Questo è il mio stack tecnologico: le piattaforme e le connessioni che combino affinché i tuoi processi funzionino da soli, dall’inizio alla fine.',
      '#precios':'Tre modi per iniziare. Il Workflow Express da trecentocinquanta euro, il Sistema Pro da millecinquecento euro, e un formato su misura con manutenzione. Accetto solo tre nuovi progetti al mese per curare la qualità.',
      '#proceso':'Il mio processo ha tre passaggi: prima una diagnosi gratuita di trenta minuti, poi progetto il flusso di lavoro, e infine lo implemento e te lo consegno funzionante, con documentazione e supporto.',
      '#casos':'Casi reali con risultati misurabili: ore risparmiate ogni settimana, errori eliminati e ritorno sull’investimento in pochi mesi. Risultati concreti, non promesse.',
      '#testimonios':'Cosa dicono le aziende che hanno smesso di fare tutto a mano: hanno recuperato tempo, servono più clienti e lavorano con meno errori.',
      '#agenda':'Qui puoi prenotare la tua consulenza gratuita. Scegli un giorno e un’ora nel calendario e, alla conferma, si apre WhatsApp con l’appuntamento già scritto. Trenta minuti, senza impegno.',
      '#contenido':'Ogni settimana pubblico su Instagram la serie Superprompt: un prompt o un caso reale di automazione con intelligenza artificiale, pronto da copiare e applicare alla tua attività.',
      '#faq':'Domande frequenti: qui rispondo ai dubbi più comuni su prezzo, tempi, cosa succede se qualcosa non funziona e se servono conoscenze tecniche. Spoiler: non servono.',
      '#contacto':'Ed è qui che iniziamo. Dimmi cosa vuoi automatizzare tramite il modulo, WhatsApp, telefono o email. Rispondo in meno di ventiquattro ore.'
    },
    zh: {
      'header':'欢迎来到 KEPA 科技。我是 Kepa，毕尔巴鄂的自由职业者，专注于为中小企业提供自动化和人工智能服务。我帮你节省大量重复性工作的时间。',
      '.trust':'这些是我用来构建自动化的工具：Make、n8n、Claude、WhatsApp、Airtable、Google Sheets 和 Voiceflow。数千家公司都在使用的可靠技术。',
      '#servicios':'这是我的服务：流程自动化、人工智能集成、自动沟通、实时数据面板、系统集成和咨询。一切都为你的业务量身定制。',
      '#stack':'这是我的技术栈：我组合的各种平台和连接，让你的流程从头到尾自动运行。',
      '#precios':'三种开始方式。Workflow Express 套餐从三百五十欧元起，Pro 系统从一千五百欧元起，还有含维护的定制方案。为了保证质量，我每月只接三个新项目。',
      '#proceso':'我的流程分三步：先是三十分钟的免费诊断，然后我设计工作流程，最后实施并交付可运行的成果，附带文档和支持。',
      '#casos':'有可衡量成果的真实案例：每周节省的工时、消除的错误，以及几个月内的投资回报。实实在在的成果，而非空头承诺。',
      '#testimonios':'那些不再事事手动操作的企业这样说：他们重新获得了时间，服务更多客户，错误更少。',
      '#agenda':'在这里你可以预约免费咨询。在日历上选择日期和时间，确认后 WhatsApp 会打开并写好预约信息。三十分钟，无需承诺。',
      '#contenido':'我每周在 Instagram 上发布 Superprompt 系列：一个提示词或一个真实的人工智能自动化案例，方便你复制并应用到自己的业务中。',
      '#faq':'常见问题：这里我回答关于价格、时间、出问题怎么办以及是否需要技术知识的最常见疑问。剧透：不需要。',
      '#contacto':'我们从这里开始。通过表单、WhatsApp、电话或邮件告诉我你想自动化什么。我会在二十四小时内回复。'
    }
  };
  const INTRO = {
    es:'Modo guía activado. Pasa el ratón por cualquier sección de la web y te la explico en voz alta.',
    en:'Guide mode activated. Move your mouse over any section of the site and I will explain it out loud.',
    ca:'Mode guia activat. Passa el ratolí per qualsevol secció del web i te l\u2019explico en veu alta.',
    eu:'Gida modua aktibatuta. Pasatu sagua webeko edozein ataletik eta ozen azalduko dizut.',
    gl:'Modo guía activado. Pasa o rato por calquera sección da web e explícocha en voz alta.',
    de:'Guide-Modus aktiviert. Bewege die Maus über einen beliebigen Bereich der Website und ich erkläre ihn dir laut.',
    it:'Modalità guida attivata. Passa il mouse su qualsiasi sezione del sito e te la spiego ad alta voce.',
    zh:'导览模式已启用。将鼠标移到网站的任意部分，我就会为你大声讲解。'
  };

  let curLang = localStorage.getItem('kepaGuideLang');
  if (!LANGS.some(l => l.code === curLang)) curLang = 'es';
  const langOf = () => LANGS.find(l => l.code === curLang) || LANGS[0];

  SECTIONS.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.setAttribute('data-voz-key', sel);
  });

  /* construir el selector de idioma */
  const langBox = document.getElementById('guideLangs');
  let langBtns = [];
  if (langBox) {
    const t = document.createElement('div');
    t.className = 'gl-title'; t.textContent = 'Idioma · Language';
    langBox.appendChild(t);
    langBtns = LANGS.map(l => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'guide-lang' + (l.code === curLang ? ' active' : '');
      b.dataset.code = l.code;
      const flag = document.createElement('span');
      flag.className = 'fl fl-' + l.code;
      flag.setAttribute('aria-hidden', 'true');
      b.appendChild(flag);
      b.appendChild(document.createTextNode(l.label));
      b.addEventListener('click', () => setLang(l.code));
      langBox.appendChild(b);
      return b;
    });
  }
  function setLang(code) {
    curLang = code;
    localStorage.setItem('kepaGuideLang', code);
    langBtns.forEach(b => b.classList.toggle('active', b.dataset.code === code));
    window.dispatchEvent(new CustomEvent('kepa-lang-change', { detail: code }));
    if (on) speakIntro();
  }
  window.kepaSetLang = setLang;

  /* voz profesional en español (misma selección que KEPA IA) */
  let esVoice = null;
  function pickVoice() {
    const voices = tts.getVoices(); if (!voices.length) return;
    const PREF = ['jorge','pablo','álvaro','alvaro','enrique','carlos','microsoft álvaro','microsoft alvaro','microsoft pablo','microsoft jorge','diego','miguel','google español'];
    const score = v => {
      const n = (v.name||'').toLowerCase(), l = (v.lang||'').toLowerCase(); let s = 0;
      if (/es[-_]es/.test(l)) s += 100; else if (/^es/.test(l)) s += 40;
      const i = PREF.findIndex(p => n.includes(p)); if (i !== -1) s += (60 - i*4);
      if (/neural|natural|google|premium|enhanced/.test(n)) s += 25;
      if (/jorge|pablo|álvaro|alvaro|carlos|diego|enrique|miguel|male|hombre|masculin/.test(n)) s += 35;
      if (/mónica|monica|helena|elvira|laura|sabina|paulina|marisol|female|mujer|femenin/.test(n)) s -= 30;
      return s;
    };
    esVoice = voices.filter(v => /^es/i.test(v.lang)).sort((a,b)=>score(b)-score(a))[0]
           || voices.sort((a,b)=>score(b)-score(a))[0] || null;
  }
  /* elegir la mejor voz disponible para un idioma cualquiera */
  function voiceFor(speech) {
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
  pickVoice(); tts.onvoiceschanged = pickVoice;

  let on = false, current = null, hoverTimer = null;

  function showCaption(text) {
    capText.textContent = text;
    caption.classList.add('show');
  }
  function hideCaption() { caption.classList.remove('show'); }

  function speakUtter(text) {
    tts.cancel();
    const info = langOf();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = info.speech;
    const v = curLang === 'es' ? (esVoice || voiceFor(info.speech)) : voiceFor(info.speech);
    if (v) u.voice = v;
    u.rate = 0.97; u.pitch = curLang === 'es' ? 0.9 : 1;
    u.onstart = () => showCaption(text);
    u.onend = hideCaption; u.onerror = hideCaption;
    tts.speak(u);
  }
  function speakIntro() { speakUtter(INTRO[curLang] || INTRO.es); }
  function speak(el) {
    const key = el.getAttribute('data-voz-key');
    if (!key) return;
    const text = (TEXTS[curLang] && TEXTS[curLang][key]) || TEXTS.es[key];
    if (!text) return;
    speakUtter(text);
    // highlight
    document.querySelectorAll('.voz-active').forEach(e => e.classList.remove('voz-active'));
    el.classList.add('voz-active');
  }

  function clearHighlight() {
    document.querySelectorAll('.voz-active').forEach(e => e.classList.remove('voz-active'));
  }

  function onMove(e) {
    if (!on) return;
    const el = e.target.closest('[data-voz-key]');
    if (el === current) return;
    clearTimeout(hoverTimer);
    if (!el) {
      current = null;
      return;
    }
    current = el;
    // pausa ~450ms sobre la sección antes de leer
    hoverTimer = setTimeout(() => { if (current === el && on) speak(el); }, 450);
  }

  function setOn(state) {
    on = state;
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (label) label.textContent = on ? 'Guía activa' : 'Guía por voz';
    btn.setAttribute('aria-label', on ? 'Desactivar guía por voz' : 'Activar guía por voz');
    if (on) {
      document.addEventListener('mousemove', onMove);
      if (langBox) langBox.classList.add('show');
      speakIntro();
    } else {
      document.removeEventListener('mousemove', onMove);
      if (langBox) langBox.classList.remove('show');
      clearTimeout(hoverTimer);
      tts.cancel();
      current = null;
      hideCaption();
      clearHighlight();
    }
  }

  btn.addEventListener('click', () => setOn(!on));

  // also support keyboard focus (accesibilidad) when guide is on
  document.addEventListener('focusin', (e) => {
    if (!on) return;
    const el = e.target.closest('[data-voz-key]');
    if (el && el !== current) { current = el; speak(el); }
  });
})();
