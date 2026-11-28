/* Calendario de reservas (abre WhatsApp con la cita).
   Extraído de index.html; se carga en el mismo orden y posición que antes. */

/* ─── booking calendar ─────────────────────────────────── */
(function () {
  const WA_NUMBER = '34643371782';
  const daysEl   = document.getElementById('bkDays');
  const monthEl  = document.getElementById('bkMonth');
  const prevBtn  = document.getElementById('bkPrev');
  const nextBtn  = document.getElementById('bkNext');
  const slotsDay = document.getElementById('bkSlotsDay');
  const slotList = document.getElementById('bkSlotList');
  const slotsEmpty = document.getElementById('bkSlotsEmpty');
  const confirm  = document.getElementById('bkConfirm');
  if (!daysEl) return;

  const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const DOW    = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const SLOTS  = ['09:30','10:30','11:30','12:30','16:00','17:00','18:00','19:00'];

  const today = new Date(); today.setHours(0,0,0,0);
  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let view = new Date(minMonth);
  let selDate = null, selSlot = null;

  function sameDay(a, b) { return a && b && a.getTime() === b.getTime(); }
  function isWeekend(d) { const w = d.getDay(); return w === 0 || w === 6; }
  function isPast(d) { return d < today; }

  function render() {
    monthEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
    prevBtn.disabled = (view.getFullYear() === minMonth.getFullYear() && view.getMonth() === minMonth.getMonth());

    // limit booking to ~3 months ahead
    const maxMonth = new Date(minMonth.getFullYear(), minMonth.getMonth() + 3, 1);
    nextBtn.disabled = (view.getFullYear() === maxMonth.getFullYear() && view.getMonth() === maxMonth.getMonth());

    daysEl.innerHTML = '';
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    // make Monday the first column (getDay: 0=Sun)
    let lead = (first.getDay() + 6) % 7;
    for (let i = 0; i < lead; i++) {
      const e = document.createElement('div'); e.className = 'bk-day empty'; daysEl.appendChild(e);
    }
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d);
      const cell = document.createElement('button');
      cell.className = 'bk-day';
      cell.type = 'button';
      cell.textContent = d;
      const disabled = isPast(date) || isWeekend(date);
      if (disabled) cell.classList.add('disabled');
      if (sameDay(date, today)) cell.classList.add('today');
      if (sameDay(date, selDate)) cell.classList.add('selected');
      if (!disabled) cell.addEventListener('click', () => selectDay(date));
      else cell.disabled = true;
      daysEl.appendChild(cell);
    }
  }

  function selectDay(date) {
    selDate = date; selSlot = null;
    render();
    const label = DOW[date.getDay()] + ' ' + date.getDate() + ' de ' + MONTHS[date.getMonth()];
    slotsDay.innerHTML = label.charAt(0).toUpperCase() + label.slice(1);
    slotsEmpty.style.display = 'none';
    slotList.innerHTML = '';
    SLOTS.forEach(t => {
      const b = document.createElement('button');
      b.className = 'bk-slot'; b.type = 'button'; b.textContent = t;
      b.addEventListener('click', () => {
        selSlot = t;
        [...slotList.children].forEach(c => c.classList.remove('selected'));
        b.classList.add('selected');
        updateConfirm();
      });
      slotList.appendChild(b);
    });
    updateConfirm();
  }

  function updateConfirm() {
    if (selDate && selSlot) {
      confirm.classList.add('ready');
      const label = DOW[selDate.getDay()] + ' ' + selDate.getDate() + ' de ' + MONTHS[selDate.getMonth()] + ' de ' + selDate.getFullYear();
      const msg = 'Hola Kepa 👋 Quiero reservar la consulta gratuita de 30 min.\n\n' +
        '📅 ' + label.charAt(0).toUpperCase() + label.slice(1) + '\n' +
        '🕑 ' + selSlot + ' (hora peninsular)\n\n' +
        '¿Te viene bien? Quedo a la espera de confirmación.';
      confirm.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    } else {
      confirm.classList.remove('ready');
      confirm.href = '#';
    }
  }

  prevBtn.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); });
  nextBtn.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });

  render();
})();
