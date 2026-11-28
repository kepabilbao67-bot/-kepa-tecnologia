/* Música de fondo (Für Elise sintetizado en el navegador).
   Extraído de index.html; se carga en el mismo orden y posición que antes. */

/* ─── Beethoven · Für Elise (sintetizado en el navegador) ─ */
(function () {
  const btn = document.getElementById('musicBtn');
  if (!btn) return;
  const label = btn.querySelector('.music-label');

  const F = {
    'E4':329.63,'F4':349.23,'G#4':415.30,'A4':440.00,'B4':493.88,
    'C5':523.25,'D5':587.33,'D#5':622.25,'E5':659.25,
    'A3':220.00,'B3':246.94,'C4':261.63,'D4':293.66,'E3':164.81,'A2':110.00
  };
  // Für Elise — tema principal (mano derecha) + bajos sencillos. [nota, duración]
  const MEL = [
    ['E5',1],['D#5',1],['E5',1],['D#5',1],['E5',1],['B4',1],['D5',1],['C5',1],
    ['A4',2],['R',1],['C4',1],['E4',1],['A4',1],
    ['B4',2],['R',1],['E4',1],['G#4',1],['B4',1],
    ['C5',2],['R',1],['E4',1],['E5',1],['D#5',1],['E5',1],['D#5',1],['E5',1],['B4',1],['D5',1],['C5',1],
    ['A4',2],['R',1],['C4',1],['E4',1],['A4',1],
    ['B4',2],['R',1],['E4',1],['C5',1],['B4',1],['A4',2],['R',2]
  ];
  // bajos (acordes Am / E) por compás, muy suave
  const BASS = [
    ['A2',8],['R',7],['E3',8],['R',7],['A2',8],['R',7],['A2',8],['R',7],['E3',8],['R',5],['A2',8],['R',4]
  ];

  let ctx = null, master = null, loopTimer = null, on = false;
  const UNIT = 0.17; // segundos por unidad

  function piano(freq, time, dur, peak) {
    const o1 = ctx.createOscillator(); o1.type = 'triangle'; o1.frequency.value = freq;
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 2;
    const g  = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(peak, time + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0006, time + Math.max(0.12, dur * 0.92));
    const go = ctx.createGain(); go.gain.value = 0.28; // octava más floja
    o1.connect(g); o2.connect(go); go.connect(g); g.connect(master);
    o1.start(time); o2.start(time);
    o1.stop(time + dur + 0.05); o2.stop(time + dur + 0.05);
  }

  function scheduleLoop() {
    if (!on || !ctx) return;
    const start = ctx.currentTime + 0.06;
    let t = start;
    MEL.forEach(([n, d]) => { const dur = d * UNIT; if (n !== 'R') piano(F[n], t, dur, 0.17); t += dur; });
    const total = t - start;
    // bajos en paralelo
    let bt = start;
    BASS.forEach(([n, d]) => { const dur = d * UNIT; if (n !== 'R') piano(F[n], bt, dur, 0.10); bt += dur; });
    loopTimer = setTimeout(scheduleLoop, total * 1000 - 70);
  }

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.0;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; lp.Q.value = 0.3;
    // un poco de sala
    const delay = ctx.createDelay(); delay.delayTime.value = 0.22;
    const fb = ctx.createGain(); fb.gain.value = 0.18;
    const wet = ctx.createGain(); wet.gain.value = 0.16;
    master.connect(lp); lp.connect(ctx.destination);
    lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.2);
    scheduleLoop();
  }

  function stop() {
    if (!ctx) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.linearRampToValueAtTime(0.0, t + 0.6);
    clearTimeout(loopTimer);
    setTimeout(() => { try { ctx.close(); } catch (e) {} ctx = null; }, 800);
  }

  btn.addEventListener('click', () => {
    on = !on;
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (label) label.textContent = on ? 'Sonando' : 'Für Elise';
    btn.setAttribute('aria-label', on ? 'Pausar Für Elise' : 'Reproducir Für Elise de Beethoven');
    if (on) { build(); ctx.resume && ctx.resume(); } else { stop(); }
  });
})();
