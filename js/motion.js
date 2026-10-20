/* Lokaly motion: iOS-style movement on top of a runtime that re-renders a whole phone on every change.
   Rule: motion plays when something opens, closes, arrives or changes value, never because a render happened.
   Every entry has a birth time; a re-render re-applies the same animation at the same moment, so it continues instead of replaying. */
(function () {
  const L = window.L;
  const IOS = 'cubic-bezier(.32,.72,0,1)', EXIT = 'cubic-bezier(.4,0,1,1)', ARC = 'cubic-bezier(.65,0,.35,1)', OUT = 'cubic-bezier(0,0,.58,1)';
  // Durations (ms). The validated thesis: 420 push/pop and sheet, ease-in exits, 160 tab fade, 560 handoff, 150 reduced-motion fades.
  const T = { page: 420, tab: 160, fade: 220, sheetIn: 420, sheetOut: 220, scrimIn: 280, scrimOut: 220, pushIn: 420, pushOut: 240, toastIn: 220, toastOut: 160, dot: 560, rm: 150, pop: 320, num: 700, fill: 520, row: 320, inStep: 60 };
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const now = () => performance.now();
  const M = (L.M = { T, IOS, EXIT, ARC, OUT, forceRM: false });
  M.on = () => !L.fast && typeof Element.prototype.animate === 'function';
  M.rm = () => M.forceRM || mq.matches;

  /* Play kf on el as if it started at `born`. Returns null once it is over, so a late re-render adds nothing. */
  M.play = function (el, kf, dur, ease, born, extra) {
    if (!M.on()) return null;
    if (M.rm()) { if (!kf.rmOk) { kf = [{ opacity: 0 }, { opacity: 1 }]; dur = T.rm; ease = 'linear'; } }
    const t = now() - born;
    if (t >= dur) return null;
    const a = el.animate(kf, Object.assign({ duration: dur, easing: ease, fill: 'backwards' }, extra || {}));
    if (t < 0) a.effect.updateTiming({ delay: -t }); else a.currentTime = t;
    return a;
  };
  /* Move el into the phone's effects layer and animate it away. The layer is never re-rendered. */
  M.exit = function (ph, el, kf, dur, ease) {
    const keep = el.classList.contains('sheet') ? el.scrollTop : 0;
    el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); el.removeAttribute('data-k');
    ph.fx.appendChild(el); if (keep) el.scrollTop = keep;
    if (M.rm()) { kf = [{ opacity: 1 }, { opacity: 0 }]; dur = T.rm; ease = 'linear'; }
    const a = el.animate(kf, { duration: dur, easing: ease, fill: 'forwards' });
    const done = () => el.remove();
    a.finished.then(done, done);
  };
  M.born = function (ph, key, at) {
    ph.seenK.add(key);
    if (!ph.bornAt.has(key)) ph.bornAt.set(key, at == null ? now() : at);
    return ph.bornAt.get(key);
  };

  /* ───────── pages ───────── */
  let seq = 0;
  M.key = (entry) => entry._k || (entry._k = 'e' + (++seq));
  const NAV = {
    push: { dur: T.page, ease: IOS, inKf: [{ transform: 'translateX(100%)' }, { transform: 'none' }], outKf: [{ transform: 'none' }, { transform: 'translateX(-28%)' }], outDim: [{ opacity: 0 }, { opacity: 0.08 }], top: 'in' },
    pop: { dur: T.page, ease: IOS, inKf: [{ transform: 'translateX(-28%)' }, { transform: 'none' }], inDim: [{ opacity: 0.08 }, { opacity: 0 }], outKf: [{ transform: 'none' }, { transform: 'translateX(100%)' }], top: 'out' },
    tab: { dur: T.tab, ease: OUT, inKf: [{ opacity: 0 }, { opacity: 1 }], outKf: [{ opacity: 1 }, { opacity: 1 }], top: 'in' },
    fade: { dur: T.fade, ease: OUT, inKf: [{ opacity: 0 }, { opacity: 1 }], outKf: [{ opacity: 1 }, { opacity: 1 }], top: 'in' }
  };
  const spec = (kind) => (M.rm() ? { dur: T.rm, ease: 'linear', inKf: [{ opacity: 0 }, { opacity: 1 }], outKf: [{ opacity: 1 }, { opacity: 1 }], top: 'in' } : NAV[kind]);

  /* Put the new page node in place. A navigation keeps the old node as an inert ghost and slides both;
     a plain re-render swaps the node and carries over whatever transition is still running. */
  M.page = function (ph, pg, nav, k) {
    const scr = ph.scr, old = ph.pg;
    if (!old) { scr.insertBefore(pg, ph.ovl); return; }
    if (nav && M.on() && ph.pgKey !== k && NAV[nav]) {
      if (ph.tx && ph.tx.ghost) ph.tx.ghost.remove();
      const s = spec(nav);
      const from = getComputedStyle(old).transform;
      old.getAnimations().forEach((a) => a.cancel());
      old.classList.add('ghost'); old.setAttribute('inert', ''); old.setAttribute('aria-hidden', 'true');
      scr.insertBefore(pg, old);
      pg.style.zIndex = s.top === 'in' ? 2 : 1; old.style.zIndex = s.top === 'in' ? 1 : 2;
      ph.tx = { k, born: now(), s, ghost: old };
      if (nav === 'push' || nav === 'pop') (s.top === 'in' ? pg : old).classList.add('lead');
      applyIn(pg, ph.tx);
      const outKf = s.outKf.slice(); if (from && from !== 'none' && outKf[0].transform) outKf[0] = { transform: from };
      const ga = old.animate(outKf, { duration: s.dur, easing: s.ease, fill: 'forwards' });
      if (s.outDim) old.animate(s.outDim, { duration: s.dur, easing: s.ease, fill: 'forwards', pseudoElement: '::after' });
      const tx = ph.tx, done = () => { old.remove(); if (tx.ghost === old) tx.ghost = null; const cur = ph.pg; if (cur && tx === ph.tx) { cur.style.zIndex = ''; cur.classList.remove('lead'); } };
      ga.finished.then(done, done);
    } else {
      pg.style.zIndex = old.style.zIndex; if (old.classList.contains('lead')) pg.classList.add('lead');
      old.replaceWith(pg);
      if (ph.tx && ph.tx.k === k) applyIn(pg, ph.tx);
    }
    ph.pgKey = k;
  };
  function applyIn(pg, tx) {
    if (M.play(pg, tx.s.inKf, tx.s.dur, tx.s.ease, tx.born) && tx.s.inDim && !M.rm()) {
      pg.classList.add('under');
      const a = pg.animate(tx.s.inDim, { duration: tx.s.dur, easing: tx.s.ease, fill: 'both', pseudoElement: '::after' });
      a.currentTime = now() - tx.born;
      const off = () => pg.classList.remove('under'); a.finished.then(off, off);
    }
  }
  /* Birth time of the page for one-shot entrances (data-in): only pages reached by a navigation get them. */
  M.pageBorn = (ph, k) => (ph.tx && ph.tx.k === k ? ph.tx.born : null);

  /* ───────── overlays: sheets, scrims, push, toast ───────── */
  const OV = {
    sheet: { inKf: [{ transform: 'translateY(105%)' }, { transform: 'none' }], inT: T.sheetIn, inE: IOS, outKf: [{ transform: 'none' }, { transform: 'translateY(105%)' }], outT: T.sheetOut, outE: EXIT },
    scrim: { inKf: [{ opacity: 0 }, { opacity: 1 }], inT: T.scrimIn, inE: 'ease-out', outKf: [{ opacity: 1 }, { opacity: 0 }], outT: T.scrimOut, outE: EXIT },
    push: { inKf: [{ transform: 'translateY(calc(-100% - 70px))' }, { transform: 'none' }], inT: T.pushIn, inE: IOS, outKf: [{ transform: 'none' }, { transform: 'translateY(calc(-100% - 70px))' }], outT: T.pushOut, outE: EXIT },
    toast: { inKf: [{ opacity: 0, transform: 'translate(-50%, 8px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], inT: T.toastIn, inE: 'ease-out', outKf: [{ opacity: 1 }, { opacity: 0 }], outT: T.toastOut, outE: EXIT }
  };
  M.overlays = function (ph, html) {
    const ovl = ph.ovl, before = new Map();
    ovl.querySelectorAll(':scope > [data-k]').forEach((el) => before.set(el.dataset.k, el));
    const scroll = {}; before.forEach((el, k) => { if (el.classList.contains('sheet')) scroll[k] = el.scrollTop; });
    ovl.innerHTML = html;
    const after = new Set();
    ovl.querySelectorAll(':scope > [data-k]').forEach((el) => {
      const k = el.dataset.k, o = OV[el.dataset.ov]; after.add(k);
      if (scroll[k]) el.scrollTop = scroll[k];
      const pend = ph.pending && ph.pending[k];
      const b = M.born(ph, 'o:' + k, pend);
      if (o) M.play(el, o.inKf, o.inT, o.inE, b);
    });
    if (!M.on()) return;
    before.forEach((el, k) => { if (!after.has(k)) { const o = OV[el.dataset.ov]; if (o) M.exit(ph, el, o.outKf, o.outT, o.outE); } });
  };

  /* ───────── in-page moments ───────── */
  // data-in="up|pop|draw|count" one-shot entrance when the page or sheet arrives; data-d="ms" adds delay.
  const IN = {
    up: { kf: [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], t: 380, e: IOS },
    pop: { kf: [{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'scale(1.06)', offset: 0.6 }, { opacity: 1, transform: 'none' }], t: 460, e: OUT },
    fade: { kf: [{ opacity: 0 }, { opacity: 1 }], t: 300, e: OUT }
  };
  M.moments = function (ph, root, pageK) {
    if (!M.on()) return;
    const pb = M.pageBorn(ph, pageK);
    root.querySelectorAll('[data-in]').forEach((el) => {
      if (el.closest('[inert]')) return;
      const sh = el.closest('.sheet');
      const base = sh ? ph.bornAt.get('o:' + sh.dataset.k) : pb;
      if (base == null) return;
      const b = base + (+el.dataset.d || 0) + (sh ? 160 : T.page * 0.45);
      const kind = el.dataset.in;
      if (kind === 'draw') M.draw(el, b);
      else if (kind === 'count') M.count(ph, el, 0, +el.dataset.v, b, 'in:' + pageK + ':' + (el.dataset.d || 0));
      else if (IN[kind]) M.play(el, IN[kind].kf, IN[kind].t, IN[kind].e, b);
    });
    // data-row="id": a row that was not on this page last render arrives with a rise.
    const rows = ph.rows.get(pageK) || null, seen = new Set();
    root.querySelectorAll('[data-row]').forEach((el) => {
      if (el.closest('[inert]')) return;
      const k = el.dataset.row; seen.add(k);
      if (rows && !rows.has(k)) ph.bornAt.set('r:' + k, now());
      ph.seenK.add('r:' + k);
      const b = ph.bornAt.get('r:' + k);
      if (b != null) M.play(el, el.classList.contains('me') ? ROWME : IN.up.kf, T.row, IOS, b);
    });
    ph.rows.set(pageK, seen);
    // data-tick="key" data-v="value" data-fx="…": animate when the value differs from the last time this phone showed it.
    root.querySelectorAll('[data-tick]').forEach((el) => {
      if (el.closest('[inert]')) return;
      const k = el.dataset.tick, v = el.dataset.v, prev = ph.ticks.get(k);
      let rec = prev;
      if (!prev) rec = el.dataset.fam && ph.ticks.has(el.dataset.fam) ? { v, from: '', born: now() } : { v, born: -1e9 };
      else if (prev.v !== v) rec = { v, from: prev.v, born: now() };
      ph.ticks.set(k, rec);
      if (rec.from != null) FX[el.dataset.fx] && FX[el.dataset.fx](ph, el, rec, k);
    });
    // Controls need no markup: every data-toggle / data-multi / data-set control is tracked by its own path and value.
    root.querySelectorAll('[data-toggle], [data-multi], [data-set], .seg').forEach((el) => {
      if (el.closest('[inert]') || el.dataset.tick) return;
      const scope = (el.closest('[data-screen]') || ph.scr).dataset.screen;
      let k, v, fx;
      if (el.classList.contains('seg')) {
        const bs = [...el.querySelectorAll(':scope > button')];
        if (!bs.length) return;
        k = 'seg:' + scope + ':' + (bs[0].dataset.set || bs[0].dataset.act || ''); v = String(bs.findIndex((b) => b.classList.contains('on'))); fx = 'seg';
      } else {
        if (el.closest('.seg')) return;
        const on = el.classList.contains('on') || ['aria-checked', 'aria-pressed'].some((a) => el.getAttribute(a) === 'true') || !!el.querySelector('.on');
        k = 'c:' + scope + ':' + (el.dataset.toggle || el.dataset.multi || el.dataset.set) + '|' + (el.dataset.val || ''); v = on ? '1' : '0';
        fx = el.querySelector('.tog') || el.classList.contains('tog') ? 'tog' : 'on';
      }
      const prev = ph.ticks.get(k);
      let rec = prev || { v, born: -1e9 };
      if (prev && prev.v !== v) rec = { v, from: prev.v, born: now() };
      ph.ticks.set(k, rec);
      if (rec.from != null) FX[fx](ph, fx === 'tog' && !el.classList.contains('tog') ? el.querySelector('.tog') : el, rec, k);
    });
  };
  const ROWME = [{ opacity: 0, transform: 'translateY(18px) scale(.96)', transformOrigin: '100% 100%' }, { opacity: 1, transform: 'none', transformOrigin: '100% 100%' }];

  const FX = {
    // status pills, plan cards: settle into the new value
    pop: (ph, el, r) => M.play(el, [{ transform: 'scale(.86)', opacity: 0.35 }, { transform: 'scale(1.04)', opacity: 1, offset: 0.55 }, { transform: 'none', opacity: 1 }], T.pop, OUT, r.born),
    // badges: pop only when the number goes up
    badge: (ph, el, r) => { if (+r.v > +r.from) M.play(el, [{ transform: 'scale(.6)' }, { transform: 'scale(1.18)', offset: 0.5 }, { transform: 'none' }], T.pop, OUT, r.born); },
    // money and counts roll from the old number to the new one
    num: (ph, el, r, k) => M.count(ph, el, +r.from, +r.v, r.born, 't:' + k),
    // toggles: knob slides from where it was
    tog: (ph, el, r) => {
      const on = r.v === '1';
      M.play(el, on ? [{ transform: 'none' }, { transform: 'translateX(20px)' }] : [{ transform: 'translateX(20px)' }, { transform: 'none' }], 240, IOS, r.born, { pseudoElement: '::after' });
      M.play(el, [{ backgroundColor: on ? '#D9DCD6' : '#34A853' }, { backgroundColor: getComputedStyle(el).backgroundColor }], 240, OUT, r.born);
    },
    // checks, radios, chips turned on
    on: (ph, el, r) => {
      if (r.v !== '1') return;
      const mark = el.querySelector('.check, .radio') || el;
      const s = mark.offsetWidth > 140 ? 0.98 : mark.offsetWidth > 40 ? 0.94 : 0.8;
      M.play(mark, [{ transform: 'scale(' + s + ')' }, { transform: 'none' }], 220, OUT, r.born);
    },
    // bars (meter, progress, escrow): grow from the old fill
    bar: (ph, el, r) => {
      const a = Math.max(0, Math.min(1, +r.from / Math.max(+r.v, 0.0001)));
      if (+r.v > +r.from) M.play(el, [{ transform: 'scaleX(' + a + ')' }, { transform: 'none' }], T.fill, IOS, r.born);
    },
    // a segment that changes colour wipes the new colour in from the left
    // escrow and progress segments: the new colour sweeps in after the timeline has moved
    wipe: (ph, el, r, k) => { const bar = el.tagName === 'I' ? el : el.querySelector('i'); if (r.v && bar) M.play(bar, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], 520, ARC, r.born + (/^es:/.test(k) ? 200 + 110 * +k.split(':').pop() : 0), { pseudoElement: '::after' }); },
    // timeline step reached: dot pops, the line above it draws down
    // timeline step reached: steps go one after another, the dot pops and its line draws down to the next
    step: (ph, el, r, k) => {
      const was = r.from, is = r.v, i = +k.split(':').pop() || 0;
      const lead = ph.ticks.get(k.replace(/:\d+$/, ':lead'));
      const b = r.born + 110 * Math.max(0, i - (lead && lead.born === r.born ? lead.i : i));
      if (!lead || lead.born !== r.born) ph.ticks.set(k.replace(/:\d+$/, ':lead'), { born: r.born, i });
      if (is === 'done' || is === 'cur' || is === 'bad') {
        const d = el.querySelector('.tdot');
        if (d) M.play(d, [{ transform: 'scale(.6)' }, { transform: 'scale(1.12)', offset: 0.55 }, { transform: 'none' }], T.pop, OUT, b);
        if (was === 'up' || was === 'cur') M.play(el.querySelector('.tx') || el, [{ opacity: 0.35 }, { opacity: 1 }], 300, OUT, b);
        if (is === 'done' && was !== 'done') M.play(el, [{ transform: 'scaleY(0)' }, { transform: 'none' }], 360, IOS, b + 120, { pseudoElement: '::before' });
      }
    },
    // segmented control: a thumb slides from the old option to the new one
    seg: (ph, el, r) => {
      const bs = [...el.querySelectorAll('button')], to = bs[+r.v], fromB = bs[+r.from];
      if (!to || !fromB || M.rm()) return;
      const dx = fromB.offsetLeft - to.offsetLeft, sx = fromB.offsetWidth / to.offsetWidth;
      M.play(to, [{ transform: 'translateX(' + dx + 'px) scaleX(' + sx + ')' }, { transform: 'none' }], 300, IOS, r.born);
      to.querySelectorAll(':scope > *').forEach((c) => M.play(c, [{ transform: 'scaleX(' + (1 / sx) + ')', opacity: 0 }, { transform: 'none', opacity: 1 }], 300, IOS, r.born));
    },
    // copy that swaps in place (sheet steps, banners)
    swap: (ph, el, r) => M.play(el, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], 260, OUT, r.born)
  };
  M.FX = FX;

  /* Count a number in place. The rAF loop finds the current element by key, so re-renders do not reset it. */
  M.count = function (ph, el, from, to, born, key) {
    if (!M.on() || M.rm() || from === to || isNaN(from) || isNaN(to)) return;
    const dur = T.num; if (now() - born >= dur) return;
    el.dataset.ck = key;
    const fmt = el.dataset.fmt || 'int';
    const show = (x) => (fmt === 'eur' ? L.eur(Math.round(x)) : fmt === 'eur2' ? L.eur(x, 2) : fmt === 'n0' && L.lang() === 'es' && L.num ? L.num(Math.round(x), 0) : String(Math.round(x)));
    const final = el.textContent;
    const step = () => {
      const t = Math.min(1, (now() - born) / dur), e = 1 - Math.pow(1 - t, 3);
      const cur = ph.mount.querySelector('[data-ck="' + key + '"]');
      if (!cur) { ph.loops.delete(key); return false; }
      cur.textContent = t >= 1 ? final : show(from + (to - from) * Math.max(0, e));
      if (t >= 1) ph.loops.delete(key);
      return t < 1;
    };
    // A re-render mid-count: tag the new element and write the current value now, so the final number never flashes.
    if (ph.loops.get(key) === born) { step(); return; }
    ph.loops.set(key, born);
    const loop = () => { if (ph.loops.get(key) === born && step()) requestAnimationFrame(loop); };
    loop();
  };
  /* Draw an SVG stroke (the check on success screens). */
  M.draw = function (el, born) {
    el.querySelectorAll('path,polyline,line').forEach((p) => {
      p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1';
      if (!M.play(p, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 420, OUT, born)) p.style.strokeDashoffset = '0';
    });
  };

  /* ───────── the handoff: a dot from the tap on one phone to the push on the other ───────── */
  M.tap = function (ph, el) {
    const r = el.getBoundingClientRect();
    if (r.width) L.lastTap = { ph, x: r.left + r.width / 2, y: r.top + r.height / 2, t: now() };
  };
  // Returns the delay the push should wait for, 0 when there is no dot.
  M.handoff = function (target) {
    const tp = L.lastTap;
    if (!M.on() || M.rm() || !tp || tp.ph === target || now() - tp.t > 2500) return 0;
    const pr = target.mount.getBoundingClientRect();
    if (!pr.width || pr.right < 0 || pr.left > innerWidth) return 0;
    const x1 = pr.left + pr.width / 2, y1 = pr.top + pr.height * 0.085;
    const lift = Math.max(60, Math.abs(x1 - tp.x) * 0.18), dot = document.createElement('div'), kf = [];
    dot.className = 'handoff-dot'; dot.setAttribute('aria-hidden', 'true'); document.body.appendChild(dot);
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, x = tp.x + (x1 - tp.x) * t, y = tp.y + (y1 - tp.y) * t - Math.sin(Math.PI * t) * lift;
      kf.push({ transform: 'translate(' + x + 'px,' + y + 'px)', opacity: t < 0.08 ? t / 0.08 : t > 0.86 ? (1 - t) / 0.14 : 1, offset: t });
    }
    const a = dot.animate(kf, { duration: T.dot, easing: ARC, fill: 'forwards' });
    const done = () => dot.remove(); a.finished.then(done, done);
    L.lastTap = null;
    target.holdUntil = now() + T.dot - 40;
    return T.dot - 40;
  };
})();
