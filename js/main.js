/* ==========================================================================
   Premium Wedding Website - behaviour
   Reads everything from window.WEDDING_CONFIG (js/config.js).
   ========================================================================== */
(() => {
  'use strict';

  const C = window.WEDDING_CONFIG;
  if (!C) {
    console.error('WEDDING_CONFIG not found. Make sure js/config.js loads before js/main.js.');
    return;
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * Dates & formatting (always in the venue's time zone)
   * ------------------------------------------------------------------ */
  const TZ = C.timeZone || 'Asia/Kolkata';
  const weddingDate = new Date(C.date);

  function parts(date, opts) {
    const out = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...opts })
      .formatToParts(date).forEach(p => { out[p.type] = p.value; });
    return out;
  }
  const dateLong = d => {
    const p = parts(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    return `${p.weekday}, ${p.day} ${p.month} ${p.year}`;
  };
  const dateShort = d => {
    const p = parts(d, { day: 'numeric', month: 'long', year: 'numeric' });
    return `${p.day} ${p.month} ${p.year}`;
  };
  const timeLabel = d => {
    const p = parts(d, { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${p.hour}:${p.minute} ${(p.dayPeriod || '').toUpperCase()}`.trim();
  };

  const isValidDate = !isNaN(weddingDate.getTime());
  if (!isValidDate) console.error('config.date is not a valid date. Use the format 2027-02-14T10:30:00+05:30');

  // Values that are computed rather than typed in the config
  const view = Object.assign({}, C, {
    display: {
      dateLong: isValidDate ? dateLong(weddingDate) : '',
      dateShort: isValidDate ? dateShort(weddingDate) : '',
      time: isValidDate ? timeLabel(weddingDate) : ''
    }
  });

  const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

  /* ------------------------------------------------------------------ *
   * Page meta + text bindings
   * ------------------------------------------------------------------ */
  function initBindings() {
    $$('[data-bind]').forEach(el => {
      const v = getPath(view, el.dataset.bind);
      if (v != null && v !== '') el.textContent = v;
    });

    const title = `${C.bride.name} & ${C.groom.name} | Wedding Invitation`;
    document.title = title;
    const desc = `You are invited to the wedding of ${C.bride.name} & ${C.groom.name} on ${view.display.dateLong}` +
      (C.venue && C.venue.city ? ` in ${C.venue.city}` : '') + '.';
    const setMeta = (sel, val) => { const m = $(sel); if (m) m.setAttribute('content', val); };
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', desc);

    const initials = `${(C.bride.name || '')[0] || ''} & ${(C.groom.name || '')[0] || ''}`;
    $$('[data-monogram]').forEach(el => { el.textContent = initials; });

    // Invitation paragraphs
    const box = $('#invitation-text');
    (C.invitation.message || []).forEach(t => {
      const p = document.createElement('p');
      p.textContent = t;
      box.appendChild(p);
    });

    if (C.dressCode) $('#dresscode').hidden = false;

    if (C.hashtag) {
      const h = $('#hashtag');
      h.textContent = C.hashtag;
      h.hidden = false;
    }

    // Footer credit (the text itself is fixed in the HTML; only the name/link is swapped in)
    const credit = $('#developer-credit');
    if (credit && C.developerName) {
      if (C.developerLink) {
        const a = document.createElement('a');
        a.href = C.developerLink;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = C.developerName;
        credit.replaceWith(a);
      } else {
        credit.textContent = C.developerName;
      }
    }

    // Hero photo (optional)
    if (C.heroImage) {
      const hero = $('.hero');
      const test = new Image();
      test.onload = () => {
        $('[data-hero-bg]').style.backgroundImage = `url("${C.heroImage}")`;
        hero.classList.add('has-image');
      };
      test.src = C.heroImage;
    }
  }

  /* ------------------------------------------------------------------ *
   * Couple photos
   * ------------------------------------------------------------------ */
  function initCouple() {
    [['bride', '#bride-card'], ['groom', '#groom-card']].forEach(([key, sel]) => {
      const img = $(`${sel} .person__photo img`);
      const person = C[key];
      if (!img) return;
      if (person.photo) {
        img.src = person.photo;
        img.alt = `Portrait of ${person.fullName || person.name}`;
      } else {
        $(`${sel} .person__photo`).hidden = true;
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Schedule
   * ------------------------------------------------------------------ */
  function renderEvents() {
    const list = $('#timeline');
    const events = (C.events || []).slice().sort((a, b) => new Date(a.start) - new Date(b.start));
    events.forEach((ev, i) => {
      const start = new Date(ev.start || C.date);
      const li = document.createElement('li');
      li.className = 'event reveal';
      li.style.setProperty('--d', `${Math.min(i, 3) * 80}ms`);

      const date = document.createElement('span');
      date.className = 'event__date';
      const dp = parts(start, { weekday: 'short', day: 'numeric', month: 'short' });
      date.textContent = `${dp.weekday} \u00B7 ${dp.day} ${dp.month}`;

      const h = document.createElement('h3');
      h.className = 'event__title';
      h.textContent = ev.title;

      const meta = document.createElement('p');
      meta.className = 'event__meta';
      meta.textContent = [timeLabel(start), ev.venue].filter(Boolean).join(' \u00B7 ');

      li.append(date, h, meta);
      if (ev.description) {
        const d = document.createElement('p');
        d.className = 'event__desc';
        d.textContent = ev.description;
        li.appendChild(d);
      }
      list.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------ *
   * Gallery + lightbox
   * ------------------------------------------------------------------ */
  const gallery = (C.gallery || []).slice();
  const lb = {
    el: $('#lightbox'), img: $('.lightbox__img'), cap: $('.lightbox__caption'), count: $('.lightbox__count'),
    idx: 0, lastFocus: null
  };

  function renderGallery() {
    const grid = $('#gallery-grid');
    if (!gallery.length) { $('#gallery').hidden = true; return; }
    const zoomSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8v6M8 11h6"/></svg>';

    gallery.forEach((g, i) => {
      const li = document.createElement('li');
      li.className = 'gallery__item reveal';
      li.style.setProperty('--d', `${(i % 3) * 90}ms`);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery__btn';
      btn.setAttribute('aria-label', `View photo ${i + 1} of ${gallery.length}: ${g.alt || ''}`);
      if (g.ratio) btn.style.aspectRatio = g.ratio;

      const img = new Image();
      img.src = g.src;
      img.alt = g.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', () => {
        img.remove();
        btn.classList.add('is-missing');
        btn.disabled = true;
        if (!g.ratio) btn.style.aspectRatio = '3/4';
      });

      const zoom = document.createElement('span');
      zoom.className = 'gallery__zoom';
      zoom.setAttribute('aria-hidden', 'true');
      zoom.innerHTML = zoomSvg;

      btn.append(img, zoom);
      btn.addEventListener('click', () => openLightbox(i));
      li.appendChild(btn);
      grid.appendChild(li);
    });
  }

  function showPhoto(i) {
    const n = gallery.length;
    lb.idx = (i + n) % n;
    const g = gallery[lb.idx];
    lb.img.classList.remove('is-in');
    lb.img.onload = () => lb.img.classList.add('is-in');
    lb.img.onerror = () => lb.img.classList.add('is-in');
    lb.img.src = g.src;
    lb.img.alt = g.alt || '';
    lb.cap.textContent = g.caption || g.alt || '';
    lb.count.textContent = `${lb.idx + 1} / ${n}`;
    // preload neighbours for instant navigation
    [lb.idx + 1, lb.idx - 1].forEach(k => { const im = new Image(); im.src = gallery[(k + n) % n].src; });
  }

  function openLightbox(i) {
    lb.lastFocus = document.activeElement;
    lb.el.hidden = false;
    document.body.classList.add('no-scroll');
    showPhoto(i);
    $('.lightbox__close').focus();
  }

  function closeLightbox() {
    lb.el.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lb.lastFocus && lb.lastFocus.focus) lb.lastFocus.focus();
  }

  function initLightbox() {
    if (!gallery.length) return;
    $('.lightbox__close').addEventListener('click', closeLightbox);
    $('.lightbox__prev').addEventListener('click', () => showPhoto(lb.idx - 1));
    $('.lightbox__next').addEventListener('click', () => showPhoto(lb.idx + 1));

    // click on the dark backdrop closes
    lb.el.addEventListener('click', e => { if (e.target === lb.el || e.target.classList.contains('lightbox__stage')) closeLightbox(); });

    document.addEventListener('keydown', e => {
      if (lb.el.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPhoto(lb.idx - 1);
      else if (e.key === 'ArrowRight') showPhoto(lb.idx + 1);
      else if (e.key === 'Tab') {
        // keep keyboard focus inside the dialog
        const f = $$('button', lb.el);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // swipe on touch screens
    let x0 = null;
    lb.el.addEventListener('touchstart', e => { x0 = e.changedTouches[0].clientX; }, { passive: true });
    lb.el.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) showPhoto(lb.idx + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * Countdown
   * ------------------------------------------------------------------ */
  function initCountdown() {
    if (!isValidDate) { $('#countdown').hidden = true; return; }
    const nums = {};
    $$('[data-unit]').forEach(el => { nums[el.dataset.unit] = el; });
    const done = $('#count-done');
    const box = $('#count');
    const pad = n => String(n).padStart(2, '0');
    const end = weddingDate.getTime() + (C.durationHours || 5) * 3600 * 1000;
    let timer;

    function set(unit, value) {
      const el = nums[unit];
      if (el.textContent !== value) {
        el.textContent = value;
        if (!reduceMotion) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
      }
    }

    function tick() {
      const diff = weddingDate.getTime() - Date.now();
      if (diff <= 0) {
        box.hidden = true;
        done.hidden = false;
        done.textContent = Date.now() < end ? 'Today is the day!' : 'Happily married \u2661';
        clearInterval(timer);
        return;
      }
      set('days', pad(Math.floor(diff / 864e5)));
      set('hours', pad(Math.floor(diff / 36e5) % 24));
      set('minutes', pad(Math.floor(diff / 6e4) % 60));
      set('seconds', pad(Math.floor(diff / 1e3) % 60));
    }
    tick();
    timer = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------ *
   * Location & map
   * ------------------------------------------------------------------ */
  function initLocation() {
    const v = C.venue || {};
    const q = encodeURIComponent(v.mapQuery || `${v.name || ''} ${v.address || ''}`);
    const embed = v.mapEmbedUrl || `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
    $('#map').src = embed;
    $('#btn-openmap').href = v.mapLink || `https://www.google.com/maps/search/?api=1&query=${q}`;
    $('#btn-directions').href = v.mapLink || `https://www.google.com/maps/dir/?api=1&destination=${q}`;

    const notes = $('#venue-notes');
    (v.notes || []).forEach(n => {
      const li = document.createElement('li');
      li.textContent = n;
      notes.appendChild(li);
    });
    if (!(v.notes || []).length) notes.hidden = true;
  }

  /* ------------------------------------------------------------------ *
   * Add to calendar
   * ------------------------------------------------------------------ */
  function initCalendar() {
    if (!isValidDate) { $('.detail-actions').hidden = true; return; }
    const start = weddingDate;
    const endD = new Date(start.getTime() + (C.durationHours || 5) * 3600 * 1000);
    const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const title = `Wedding of ${C.bride.name} & ${C.groom.name}`;
    const location = [C.venue.name, C.venue.address].filter(Boolean).join(', ');
    const details = `You are invited to celebrate the wedding of ${C.bride.name} & ${C.groom.name}.`;
    const esc = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

    $('#btn-gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      `&text=${encodeURIComponent(title)}&dates=${stamp(start)}/${stamp(endD)}` +
      `&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

    $('#btn-ics').addEventListener('click', () => {
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Website//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
        `UID:${stamp(start)}-wedding@invitation`, `DTSTAMP:${stamp(new Date())}`,
        `DTSTART:${stamp(start)}`, `DTEND:${stamp(endD)}`,
        `SUMMARY:${esc(title)}`, `DESCRIPTION:${esc(details)}`, `LOCATION:${esc(location)}`,
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');
      const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wedding-invitation.ics';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  /* ------------------------------------------------------------------ *
   * Contacts
   * ------------------------------------------------------------------ */
  function renderContacts() {
    const list = $('#contacts');
    const people = C.contacts || [];
    if (!people.length) { $('#contact').hidden = true; return; }
    people.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = 'contact reveal';
      li.style.setProperty('--d', `${i * 90}ms`);

      const role = document.createElement('p'); role.className = 'contact__role'; role.textContent = c.role || '';
      const name = document.createElement('h3'); name.className = 'contact__name'; name.textContent = c.name;
      const links = document.createElement('div'); links.className = 'contact__links';

      if (c.phone) {
        const a = document.createElement('a');
        a.href = 'tel:' + c.phone.replace(/[^\d+]/g, '');
        a.textContent = c.phone;
        links.appendChild(a);
      }
      if (c.email) {
        const a = document.createElement('a');
        a.href = 'mailto:' + c.email;
        a.textContent = c.email;
        links.appendChild(a);
      }
      li.append(role, name, links);
      list.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------ *
   * RSVP
   * ------------------------------------------------------------------ */
  function initRSVP() {
    const R = C.rsvp || {};
    const form = $('#rsvp-form');
    const extra = $('#rsvp-extra');
    const statusEl = $('#rsvp-status');
    const submit = $('#rsvp-submit');
    const result = $('#rsvp-result');
    const copyBtn = $('#rsvp-copy');
    let lastMessage = '';

    // Deadline note
    if (R.deadline && !isNaN(new Date(R.deadline))) {
      const d = $('#rsvp-deadline');
      d.textContent = `Kindly respond by ${dateShort(new Date(R.deadline))}`;
      d.hidden = false;
    }

    // Guests dropdown
    const guests = $('#rsvp-guests');
    for (let i = 1; i <= (R.maxGuests || 6); i++) {
      guests.add(new Option(i === 1 ? '1 (just me)' : String(i), String(i)));
    }

    // Meal dropdown
    if ((R.mealOptions || []).length) {
      const meal = $('#rsvp-meal');
      meal.add(new Option('No preference', ''));
      R.mealOptions.forEach(m => meal.add(new Option(m, m)));
      $('#meal-field').hidden = false;
    }

    // Event checkboxes (all ticked by default)
    const evBox = $('#rsvp-events');
    const evs = (C.events || []).slice().sort((a, b) => new Date(a.start) - new Date(b.start));
    if (!evs.length) $('#events-field').hidden = true;
    evs.forEach(ev => {
      const label = document.createElement('label');
      label.className = 'pill';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'events';
      input.value = ev.title;
      input.checked = true;
      const span = document.createElement('span');
      span.textContent = ev.title;
      label.append(input, span);
      evBox.appendChild(label);
    });

    // Show guest details only when attending
    $$('input[name="attending"]', form).forEach(r => r.addEventListener('change', () => {
      extra.hidden = form.attending.value !== 'yes';
      setError('attending', '');
    }));

    function setError(field, msg) {
      const el = $(`[data-error-for="${field}"]`, form);
      if (el) el.textContent = msg;
      const input = form.elements[field];
      const target = input && input.length === undefined ? input : (input && input[0]);
      if (target && target.setAttribute) {
        if (msg) target.setAttribute('aria-invalid', 'true'); else target.removeAttribute('aria-invalid');
      }
    }

    function validate(d) {
      let ok = true;
      ['name', 'contact', 'attending'].forEach(f => setError(f, ''));

      if (d.name.trim().length < 2) { setError('name', 'Please enter your name.'); ok = false; }

      const c = d.contact.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
      const isPhone = /^\+?[\d\s\-()]{7,18}$/.test(c) && c.replace(/\D/g, '').length >= 7;
      if (!isEmail && !isPhone) { setError('contact', 'Please enter a valid phone number or email.'); ok = false; }

      if (!d.attending) { setError('attending', 'Please let us know if you can attend.'); ok = false; }
      return ok;
    }

    function collect() {
      const fd = new FormData(form);
      const attending = fd.get('attending') || '';
      return {
        name: String(fd.get('name') || '').trim(),
        contact: String(fd.get('contact') || '').trim(),
        attending,
        guests: attending === 'yes' ? Number(fd.get('guests') || 1) : 0,
        events: attending === 'yes' ? fd.getAll('events') : [],
        meal: attending === 'yes' ? String(fd.get('meal') || '') : '',
        message: String(fd.get('message') || '').trim(),
        _gotcha: String(fd.get('_gotcha') || '')
      };
    }

    function buildMessage(d) {
      const lines = [
        `RSVP - ${C.bride.name} & ${C.groom.name}'s Wedding`,
        '',
        `Name: ${d.name}`,
        `Contact: ${d.contact}`,
        `Attending: ${d.attending === 'yes' ? 'Yes, joyfully accepts' : 'No, regretfully declines'}`
      ];
      if (d.attending === 'yes') {
        lines.push(`Guests: ${d.guests}`);
        if (d.events.length) lines.push(`Events: ${d.events.join(', ')}`);
        if (d.meal) lines.push(`Meal preference: ${d.meal}`);
      }
      if (d.message) lines.push('', `Message: ${d.message}`);
      return lines.join('\n');
    }

    const digits = s => String(s || '').replace(/\D/g, '');
    function isConfigured() {
      if (R.mode === 'endpoint') return /^https?:\/\//.test(R.endpoint || '');
      if (R.mode === 'whatsapp') return digits(R.whatsappNumber).length >= 8;
      if (R.mode === 'email') return /^[^\s@]+@[^\s@]+$/.test(R.email || '');
      return false;
    }

    function showResult(title, text, canCopy) {
      form.hidden = true;
      $('#rsvp-result-title').textContent = title;
      $('#rsvp-result-text').textContent = text;
      copyBtn.hidden = !canCopy;
      result.hidden = false;
      result.focus({ preventScroll: true });
      $('#rsvp').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }

    async function deliver(d, message) {
      if (R.mode === 'endpoint') {
        const res = await fetch(R.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: d.name, contact: d.contact, attending: d.attending, guests: d.guests,
            events: d.events.join(', '), meal: d.meal, message: d.message, summary: message
          })
        });
        if (!res.ok) throw new Error('The RSVP service did not accept the reply.');
        const first = d.name.split(' ')[0];
        showResult(
          d.attending === 'yes' ? `Thank you, ${first}!` : `Thank you for letting us know, ${first}`,
          d.attending === 'yes'
            ? 'Your RSVP has been received. We can\'t wait to celebrate with you!'
            : 'Your reply has been received. You will be missed, and we are grateful for your good wishes.',
          false
        );
        return;
      }

      if (R.mode === 'whatsapp') {
        const url = `https://wa.me/${digits(R.whatsappNumber)}?text=${encodeURIComponent(message)}`;
        const w = window.open(url, '_blank');
        if (w) w.opener = null; else window.location.href = url;
        showResult(
          'One last step',
          'WhatsApp is opening with your reply written out. Please tap Send there so the family receives it.',
          true
        );
        return;
      }

      if (R.mode === 'email') {
        const subject = `RSVP - ${C.bride.name} & ${C.groom.name}'s Wedding`;
        window.location.href = `mailto:${R.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        showResult(
          'One last step',
          'Your email app is opening with your reply written out. Please press Send there so the family receives it.',
          true
        );
      }
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      statusEl.textContent = '';
      statusEl.classList.remove('is-error');

      const d = collect();
      if (d._gotcha) return;                        // bot filled the hidden field
      if (!validate(d)) {
        const bad = $('[aria-invalid="true"]', form) || $('.field__error:not(:empty)', form);
        if (bad && bad.focus) bad.focus();
        return;
      }

      if (!isConfigured()) {
        console.warn('RSVP is not configured. Set rsvp.mode and the matching field in js/config.js.');
        statusEl.textContent = 'Online RSVP is not switched on yet. Please contact the family using the details below.';
        statusEl.classList.add('is-error');
        return;
      }

      lastMessage = buildMessage(d);
      submit.disabled = true;
      submit.textContent = 'Sending\u2026';
      try {
        await deliver(d, lastMessage);
      } catch (err) {
        console.error(err);
        statusEl.textContent = 'Sorry, something went wrong sending your RSVP. Please try again, or contact the family directly.';
        statusEl.classList.add('is-error');
      } finally {
        submit.disabled = false;
        submit.textContent = 'Send my RSVP';
      }
    });

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(lastMessage);
        copyBtn.textContent = 'Copied \u2713';
      } catch {
        copyBtn.textContent = 'Press and hold to copy manually';
      }
      setTimeout(() => { copyBtn.textContent = 'Copy my reply'; }, 2500);
    });

    $('#rsvp-again').addEventListener('click', () => {
      result.hidden = true;
      form.hidden = false;
      $('#rsvp-name').focus();
    });
  }

  /* ------------------------------------------------------------------ *
   * Background music
   * Browsers block sound until the visitor interacts with the page, so music
   * starts on the first tap/click/key press. The button toggles it any time.
   * Default: a soft, original piano-style melody generated live in the browser
   * (no audio file needed). Or set music.src in config.js to use your own MP3.
   * ------------------------------------------------------------------ */
  function initMusic() {
    const M = C.music || {};
    const btn = $('#music-toggle');
    if (M.enabled === false) { btn.hidden = true; return; }

    const audio = $('#bg-audio');
    const label = $('.music__label', btn);
    const volume = typeof M.volume === 'number' ? M.volume : 0.4;
    let playing = false, userChose = false, fileFailed = !M.src;
    let ctx = null, master = null, timer = null, nextTime = 0, step = 0;

    const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

    // Canon-style progression: C  G  Am  Em  F  C  F  G
    const chords = [
      { bass: 36, tones: [60, 64, 67, 72] }, { bass: 43, tones: [59, 62, 67, 71] },
      { bass: 45, tones: [60, 64, 69, 72] }, { bass: 40, tones: [59, 64, 67, 71] },
      { bass: 41, tones: [60, 65, 69, 72] }, { bass: 36, tones: [60, 64, 67, 72] },
      { bass: 41, tones: [60, 65, 69, 72] }, { bass: 43, tones: [59, 62, 67, 71] }
    ];
    const EIGHTH = 0.46;                       // seconds per eighth note (~65 bpm)
    const arp = [0, 1, 2, 3, 2, 1, 2, 3];

    function buildAudio() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      // gentle echo "room"
      const delay = ctx.createDelay(1.5); delay.delayTime.value = 0.42;
      const fb = ctx.createGain(); fb.gain.value = 0.36;
      const tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 2200;
      const wet = ctx.createGain(); wet.gain.value = 0.5;
      master.connect(ctx.destination);
      master.connect(delay); delay.connect(tone); tone.connect(fb); fb.connect(delay);
      tone.connect(wet); wet.connect(ctx.destination);
      return true;
    }

    function pluck(freq, t, vel, dur) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vel, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const a = ctx.createOscillator(); a.type = 'sine'; a.frequency.value = freq;
      const b = ctx.createOscillator(); b.type = 'triangle'; b.frequency.value = freq * 2;
      const bg = ctx.createGain(); bg.gain.value = 0.12;
      a.connect(g); b.connect(bg); bg.connect(g); g.connect(master);
      a.start(t); b.start(t); a.stop(t + dur + 0.1); b.stop(t + dur + 0.1);
    }

    function pad(freqs, t, dur) {
      freqs.forEach(f => {
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.045, t + 1.2);
        g.gain.linearRampToValueAtTime(0.0001, t + dur);
        const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
        o.connect(g); g.connect(master);
        o.start(t); o.stop(t + dur + 0.1);
      });
    }

    function schedule() {
      while (nextTime < ctx.currentTime + 1.4) {
        const barLen = EIGHTH * 8;
        const pos = step % 8;                              // eighth within the bar
        const chord = chords[Math.floor(step / 8) % chords.length];
        if (pos === 0) {
          pad([mtof(chord.bass), mtof(chord.bass + 7)], nextTime, barLen + 0.8);
          pluck(mtof(chord.bass), nextTime, 0.22, 3.2);
        }
        pluck(mtof(chord.tones[arp[pos]]), nextTime, 0.13, 2.2);
        // a sparse, singing melody note on beats 1 and 3
        if ((pos === 0 || pos === 4) && Math.random() < 0.7) {
          const m = chord.tones[Math.floor(Math.random() * 4)] + 12;
          pluck(mtof(m), nextTime + 0.02, 0.1, 3.4);
        }
        nextTime += EIGHTH;
        step++;
      }
    }

    function setUI(on) {
      playing = on;
      btn.classList.toggle('is-playing', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Pause background music' : 'Play background music');
      label.textContent = on ? 'Music on' : 'Play music';
    }

    function startSynth() {
      if (!ctx && !buildAudio()) return false;
      ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 3);
      nextTime = ctx.currentTime + 0.15;
      clearInterval(timer);
      schedule();
      timer = setInterval(schedule, 300);
      return true;
    }

    function stopSynth() {
      if (!ctx) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
      clearInterval(timer);
      setTimeout(() => { if (!playing && ctx) ctx.suspend(); }, 900);
    }

    function start() {
      setUI(true);
      if (!fileFailed) {
        audio.volume = volume;
        if (!audio.src) audio.src = M.src;
        audio.play().catch(() => { fileFailed = true; if (playing && !startSynth()) setUI(false); });
        return;
      }
      if (!startSynth()) setUI(false);
    }

    function stop() {
      setUI(false);
      audio.pause();
      stopSynth();
    }

    audio.addEventListener('error', () => {
      if (!M.src || fileFailed) return;
      fileFailed = true;
      console.warn(`Could not load music file "${M.src}". Using the built-in melody instead.`);
      if (playing) startSynth();
    });

    btn.addEventListener('click', () => {
      userChose = true;
      if (playing) stop(); else start();
    });

    // first interaction anywhere starts the music (unless they already used the button)
    const events = ['pointerdown', 'keydown', 'touchend'];
    const first = e => {
      events.forEach(n => document.removeEventListener(n, first, true));
      if (userChose || (e.target && e.target.closest && e.target.closest('#music-toggle'))) return;
      start();
    };
    events.forEach(n => document.addEventListener(n, first, true));

    // pause while the tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (!playing) return;
      if (document.hidden) { if (ctx) ctx.suspend(); audio.pause(); }
      else { if (ctx && fileFailed) ctx.resume(); if (!fileFailed) audio.play().catch(() => {}); }
    });
  }

  /* ------------------------------------------------------------------ *
   * Scroll reveal
   * ------------------------------------------------------------------ */
  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => io.observe(el));
  }

  /* ------------------------------------------------------------------ *
   * Decorative hero: mandala + falling petals
   * ------------------------------------------------------------------ */
  function initHeroArt() {
    const NS = 'http://www.w3.org/2000/svg';
    const g = $('#mandala');
    if (g) {
      const mk = (tag, attrs) => {
        const el = document.createElementNS(NS, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        return el;
      };
      [196, 150, 96, 44].forEach(r => g.appendChild(mk('circle', { r })));
      const petalA = 'M0 -190 C 11 -168, 11 -150, 0 -132 C -11 -150, -11 -168, 0 -190Z';
      const petalB = 'M0 -128 C 16 -104, 16 -78, 0 -52 C -16 -78, -16 -104, 0 -128Z';
      for (let i = 0; i < 24; i++) g.appendChild(mk('path', { d: petalA, transform: `rotate(${i * 15})` }));
      for (let i = 0; i < 12; i++) g.appendChild(mk('path', { d: petalB, transform: `rotate(${i * 30 + 15})` }));
    }

    if (reduceMotion) return;
    const wrap = $('.petals');
    const colours = [['#F9C9D3', '#EE9DB0'], ['#FBDDE3', '#F0B1C0'], ['#F8DEC4', '#E6B98C'], ['#F5B5C4', '#DC7E96']];
    const count = window.innerWidth < 640 ? 10 : 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const [c1, c2] = colours[i % colours.length];
      p.className = 'petal';
      p.style.cssText =
        `left:${Math.random() * 100}%;--s:${8 + Math.random() * 10}px;--c1:${c1};--c2:${c2};` +
        `--t:${11 + Math.random() * 10}s;--delay:${-Math.random() * 20}s;--sway:${(Math.random() * 120 - 60).toFixed(0)}px`;
      wrap.appendChild(p);
    }
  }

  /* ------------------------------------------------------------------ *
   * Start
   * ------------------------------------------------------------------ */
  initBindings();
  initCouple();
  renderEvents();
  renderGallery();
  initLightbox();
  initCountdown();
  initLocation();
  initCalendar();
  renderContacts();
  initRSVP();
  initMusic();
  initHeroArt();
  initReveal();
})();
