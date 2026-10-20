/* Lokaly prototype runtime: one world, many phones. */
(function () {
  const L = window.L;
  L.S = {};          // screen registry: id -> {name, role, tab, sheet, noir, render}
  L.A = {};          // actions: name -> fn(ph, arg, el)
  L.phones = [];
  L.seen = new Set();
  L.listeners = [];

  /* ───────── helpers ───────── */
  const t = L.t;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  L.esc = esc;
  // Locale-aware numbers. EN €1,234.56 · ES €1.234,56 (symbol first, as briefed; Spanish convention is "1.234,56 €", reviewer to confirm).
  L.num = (n, dec) => {
    const v = Number(n) || 0; const d = dec === undefined ? (Math.round(v * 100) % 100 ? (Math.round(v * 100) % 10 ? 2 : 1) : 0) : dec;
    const [i, f] = Math.abs(v).toFixed(d).split('.');
    const es = L.lang() === 'es';
    return (v < 0 ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, es ? '.' : ',') + (f ? (es ? ',' : '.') + f : '');
  };
  L.eur = (n, dec) => {
    const v = Math.round(n * 100) / 100;
    const d = dec === undefined ? (v % 1 ? 2 : 0) : dec;
    return '€' + L.num(v, d);
  };
  L.pct = (n) => (L.lang() === 'es' ? L.num(n) + ' %' : L.num(n) + '%');
  L.k = (n) => (n >= 1000 ? (L.lang() === 'es' ? L.num(Math.round(n / 100) / 10) + 'K' : (Math.round(n / 100) / 10).toString().replace(/\.0$/, '') + 'k') : String(n));
  const DAYS = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], es: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'] };
  const MONS = { en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'] };
  const lg = () => (L.lang() === 'es' ? 'es' : 'en');
  L.date = (t) => { const d = new Date(t); return DAYS[lg()][d.getDay()] + ' ' + d.getDate() + ' ' + MONS[lg()][d.getMonth()]; };
  L.dshort = (t) => { const d = new Date(t); return d.getDate() + ' ' + MONS[lg()][d.getMonth()]; };
  L.mon = (t) => { const d = new Date(t); return MONS[lg()][d.getMonth()] + ' ' + d.getFullYear(); };
  L.time = (t) => { const d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  L.dt = (t) => L.date(t) + ' · ' + L.time(t);
  L.ago = (at) => {
    const m = Math.round((L.W.now - at) / 60e3);
    if (m < 1) return t('Just now'); if (m < 60) return t('{n} min ago', { n: m });
    const h = Math.round(m / 60); if (h < 24) return t('{n}h ago', { n: h });
    const d = Math.round(h / 24); if (d === 1) return t('Yesterday'); if (d < 7) return t('{n} days ago', { n: d });
    return L.dshort(at);
  };
  L.hoursLeft = (col) => Math.max(0, Math.ceil((col.submittedAt + 72 * L.H - L.W.now) / L.H));
  L.toLocalInput = (t) => { const d = new Date(t); const p = (n) => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes()); };
  L.id = (p) => p + (++L.W.seq);
  L.pl = (n, one, many) => n + ' ' + t(n === 1 ? one : many || one + 's');

  /* ───────── lookups ───────── */
  L.cr = (id) => L.W.creators.find((x) => x.id === id);
  L.biz = (id) => L.W.businesses.find((x) => x.id === id);
  L.camp = (id) => L.W.campaigns.find((x) => x.id === id);
  L.col = (id) => L.W.collabs.find((x) => x.id === id);
  L.colBiz = (col) => L.biz(L.camp(col.campaignId).bizId);
  L.myBiz = () => L.biz(L.W.bizMe.id);
  L.myCr = () => L.cr(L.W.crMe.id);
  L.threadFor = (bizId, creatorId) => L.W.threads.find((t) => t.bizId === bizId && t.creatorId === creatorId);
  L.myCollabsB = () => L.W.collabs.filter((c) => L.camp(c.campaignId).bizId === L.W.bizMe.id);
  L.myCollabsC = () => L.W.collabs.filter((c) => c.creatorId === L.W.crMe.id);
  L.payB = (rate) => Math.round(rate * 1.1 * 100) / 100;
  L.netC = (rate) => Math.round(rate * 0.9 * 100) / 100;
  L.isUnlocked = (crId) => L.W.bizMe.unlocked.includes(crId);
  L.verified = (cr) => !!(cr.socials.ig.connected || cr.socials.tt.connected);
  L.bizMeter = () => { const m = L.myBiz().meter; const keys = Object.keys(m); return Math.round(25 + 75 * keys.filter((k) => m[k]).length / keys.length); };
  L.crMeter = () => { const m = L.W.crMe.meter; const keys = Object.keys(m); return Math.round(20 + 80 * keys.filter((k) => m[k]).length / keys.length); };
  L.unlocksLeft = () => { const m = L.W.bizMe.membership; return m ? m.unlocks - m.used : 0; };
  L.isEarly = (k) => k.earlyUntil && k.earlyUntil > L.W.now;
  L.slotsLeft = (k) => k.slots - L.W.collabs.filter((c) => c.campaignId === k.id && ['active', 'awaiting', 'submitted', 'completed', 'disputed', 'resolved_released'].includes(c.status)).length;

  L.STATUS = {
    invited: ['Invited', 'sky'], applied: ['Applied', 'sky'], awaiting: ['Awaiting funding', 'peach'], active: ['Active', 'mint'],
    submitted: ['In review', 'lilac'], completed: ['Completed', 'ok'], disputed: ['Under review', 'red'], resolved_released: ['Resolved', 'ok'],
    resolved_refunded: ['Refunded', 'grey'], cancelled: ['Cancelled', 'grey'], declined: ['Not selected', 'grey'], withdrawn: ['Withdrawn', 'grey'], expired: ['Expired', 'grey']
  };

  /* ───────── world + events ───────── */
  L.reset = function (preset) {
    const lang = L.W ? L.W.lang : 'en';
    L.W = preset === 'fresh' ? L.seedFresh() : L.seedDemo();
    L.setLang(lang);
    L.phones.forEach((p) => p.boot());
    L.emit();
  };
  L.emit = function () {
    L.phones.forEach((p) => p.render());
    L.listeners.forEach((f) => f());
  };
  // n.msg is an EN template, n.p its params (refs re-render in the current language); n.text keeps the EN render.
  L.notify = function (role, n) {
    const item = Object.assign({ id: L.id('n'), at: L.W.now, read: false, tone: 'sky', icon: 'bell' }, n);
    if (item.msg) L.setNotifText(item, item.msg, item.p);
    L.W.notifs[role].unshift(item);
    const allowed = L.W.perms[role].push === 'granted' && L.W.prefs[role].push[n.cat || 'collabs'] !== false;
    if (allowed) L.phones.filter((p) => p.role === role).forEach((p) => p.showPush(item));
  };
  L.email = function (id, to, msg, data, p) {
    const e = { id, to, msg, p: p || {}, data: data || {}, at: L.W.now, key: L.id('m') };
    e.subject = L.inLang('en', () => L.etext(e));
    L.W.emails.unshift(e);
  };
  L.post = function (bizId, creatorId, msg, campaignId) {
    let t = L.threadFor(bizId, creatorId);
    if (!t) { t = { id: L.id('t'), bizId, creatorId, campaignId, msgs: [], unread: { business: 0, creator: 0 } }; L.W.threads.unshift(t); }
    if (campaignId) t.campaignId = campaignId;
    t.msgs.push(Object.assign({ at: L.W.now }, msg));
    if (msg.from === 'biz' || msg.from === 'sys') t.unread.creator++;
    if (msg.from === 'cr' || msg.from === 'sys') t.unread.business++;
    L.W.threads = [t].concat(L.W.threads.filter((x) => x !== t));
    return t;
  };
  L.setStatus = function (col, s, extra) {
    col.status = s; col.history.push({ s, at: L.W.now });
    if (extra) Object.assign(col, extra);
  };
  L.advance = function (hours) {
    L.W.now += hours * L.H;
    L.W.collabs.forEach((c) => {
      if (c.status !== 'submitted') return;
      const left = c.submittedAt + 72 * L.H - L.W.now;
      if (left <= 24 * L.H && !c.reminded) { c.reminded = true; L.notify('business', { icon: 'clock', tone: 'lilac', msg: "Reminder · 24h left to review {name}'s post", p: { name: { cr: c.creatorId } }, go: 'B-27:' + c.id }); }
      if (left <= 0) L.release(c, 'auto_released');
    });
    L.emit();
  };
  L.release = function (col, reason) {
    const k = L.camp(col.campaignId), b = L.biz(k.bizId), cr = L.cr(col.creatorId);
    L.setStatus(col, 'completed', { releaseReason: reason });
    if (k.type === 'paid') {
      L.W.txns.unshift({ id: L.id('tx'), bizId: b.id, kind: 'released', collabId: col.id, amount: L.payB(k.rate), at: L.W.now, ref: 'tr_' + L.W.seq + 'Lk' });
      if (cr.id === L.W.crMe.id) L.W.payouts.unshift({ id: L.id('po'), creatorId: cr.id, collabId: col.id, gross: k.rate, net: L.netC(k.rate), status: 'pending', at: L.W.now + 2 * L.D, ref: 'po_' + L.W.seq + 'Lk' });
      L.email('E-04', b.name, 'Released {amt} to {name} · {title}', { col: col.id }, { amt: { eur: L.netC(k.rate) }, name: { cr: cr.id }, title: { camp: k.id } });
      L.email('E-06', cr.first, 'Payout on its way · {amt}', { col: col.id }, { amt: { eur: L.netC(k.rate) } });
    }
    L.post(b.id, cr.id, { from: 'sys', deal: reason === 'auto_released' ? 'auto' : 'released', collabId: col.id }, k.id);
    const auto = reason === 'auto_released';
    L.notify('creator', { icon: 'euro', tone: 'peach', cat: 'payments', msg: k.type === 'paid' ? (auto ? 'Auto-released · {amt} is on its way' : 'Approved · {amt} is on its way') : '{biz} marked your collab complete', p: { amt: { eur: L.netC(k.rate) }, biz: { biz: b.id } }, go: 'S-12:' + col.id });
    L.notify('business', { icon: 'check', tone: 'mint', cat: 'payments', msg: auto ? 'Auto-released to {name} · {title}' : 'Released to {name} · {title}', p: { name: { cr: cr.id }, title: { camp: k.id } }, go: 'S-12:' + col.id });
  };

  /* ───────── icons ───────── */
  const P = {
    back: '<path d="m15 18-6-6 6-6"/>', close: '<path d="M6 6l12 12M18 6 6 18"/>', chev: '<path d="m9 18 6-6-6-6"/>', down: '<path d="m6 9 6 6 6-6"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    home: '<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    work: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 12.5h18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', chat: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', sliders: '<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    unlock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 7.5-2"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    euro: '<path d="M18 7.5A7 7 0 1 0 18 16.5"/><path d="M4 10.5h9M4 13.5h9"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    camera: '<path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m20.5 16-5-5-8.5 8.5"/>',
    link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
    send: '<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/>', more: '<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 2.3-2.4 3.8"/><path d="M12 17.2v.1"/>',
    logout: '<path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 12.5h9l1-12.5"/>', card: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/>',
    download: '<path d="M12 4v11M7 10.5 12 15.5l5-5M5 20h14"/>', spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>', trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    edit: '<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"/>', doc: '<path d="M7 3.5h7l4.5 4.5v12.5H7z"/><path d="M14 3.5V8h4.5M10 12.5h5M10 16h5"/>',
    wifioff: '<path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 5.2-2.8M19 12.9a10 10 0 0 0-2-1.5M12 20h.01"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.9-3.5L3 10"/><path d="M3 4v6h6"/><path d="M4 13a8 8 0 0 0 14.9 3.5L21 14"/><path d="M21 20v-6h-6"/>',
    insta: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".9" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.6 2.3 4.3 5 4.5"/>', youtube: '<rect x="2.5" y="6" width="19" height="12" rx="4"/><path d="m10 9.5 5 2.5-5 2.5z"/>',
    alert: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4.5M12 17.5v.1"/>', block: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>', gift: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8.5h14V12M12 8v12.5"/><path d="M12 8S10.5 3.5 8 4.5 8.5 8 12 8zM12 8s1.5-4.5 4-3.5S15.5 8 12 8z"/>',
    store: '<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16v10.5H4zM9 20v-5h6v5"/>', star4: '<path d="M12 3c.6 4.5 4.5 8.4 9 9-4.5.6-8.4 4.5-9 9-.6-4.5-4.5-8.4-9-9 4.5-.6 8.4-4.5 9-9z"/>',
    km: '<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="12" r="8"/>'
  };
  L.I = (name, size, sw) => '<svg width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.9) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || '') + '</svg>';
  L.I.verified = (s) => '<svg width="' + (s || 16) + '" height="' + (s || 16) + '" viewBox="0 0 24 24" aria-hidden="true"><path fill="#2F6FB0" d="M12 1.8l2.5 1.9 3.1-.1 1 3 2.6 1.8-1 3 1 3-2.6 1.8-1 3-3.1-.1L12 22.2l-2.5-1.9-3.1.1-1-3-2.6-1.8 1-3-1-3 2.6-1.8 1-3 3.1.1z"/><path d="m8.6 12.2 2.3 2.3 4.5-4.7" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  L.I.apple = (s) => '<svg width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.8-1.1-2.9-4.2zM13.9 5.1c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5z"/></svg>';
  L.I.google = (s) => '<svg width="' + (s || 20) + '" height="' + (s || 20) + '" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.6z"/><path fill="#34A853" d="M12 22.5c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10.5 10.5 0 0 0 12 22.5z"/><path fill="#FBBC05" d="M6.2 14.1a6.3 6.3 0 0 1 0-4.1V7.3H2.7a10.5 10.5 0 0 0 0 9.5z"/><path fill="#EA4335" d="M12 5.7c1.5 0 2.9.5 4 1.6l3-3A10.5 10.5 0 0 0 2.7 7.3L6.2 10c.8-2.5 3.1-4.3 5.8-4.3z"/></svg>';

  /* ───────── components ───────── */
  const C = (L.C = {});
  C.attrs = (o) => {
    o = o || {}; let a = '';
    if (o.go) a += ' data-go="' + esc(o.go) + '"';
    if (o.tab) a += ' data-tab="' + esc(o.tab) + '"';
    if (o.act) a += ' data-act="' + esc(o.act) + '"';
    if (o.arg !== undefined) a += ' data-arg="' + esc(o.arg) + '"';
    if (o.back) a += ' data-back="1"';
    if (o.close) a += ' data-close="1"';
    if (o.set) a += ' data-set="' + esc(o.set) + '" data-val="' + esc(o.val) + '"';
    if (o.multi) a += ' data-multi="' + esc(o.multi) + '" data-val="' + esc(o.val) + '"';
    if (o.toggle) a += ' data-toggle="' + esc(o.toggle) + '"';
    if (o.aria) a += ' aria-label="' + esc(o.aria) + '"';
    if (o.pressed !== undefined) a += ' aria-pressed="' + (o.pressed ? 'true' : 'false') + '"';
    if (o.id) a += ' id="' + esc(o.id) + '"';
    return a;
  };
  // Motion hook: js/motion.js animates an element when this key's value differs from the last time the phone showed it.
  L.hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
  L.tk = (key, v, fx, fmt) => ' data-tick="' + esc(key) + '" data-v="' + esc(v) + '" data-fx="' + fx + '"' + (fmt ? ' data-fmt="' + fmt + '"' : '');
  // Primary colour rule: black ('dark') is the default primary. Tan ('pri') is only for an action that commits money,
  // in the floating action bar (fund, pay & publish, approve & release); pass kind: 'pri' there and nowhere else.
  C.btn = (label, o) => {
    o = o || {};
    const cls = ['btn', o.kind || 'dark', o.full ? 'full' : '', o.sm ? 'sm' : '', o.dis ? 'dis' : '', o.busy ? 'busy' : ''].join(' ');
    const inner = o.busy ? '<span class="spin" aria-hidden="true"></span>' + esc(o.busyLabel || t('Processing…')) : (o.icon ? o.icon : '') + esc(label);
    return '<button type="button" class="' + cls + '"' + C.attrs(o) + (o.dis ? ' aria-disabled="true"' : '') + (o.style ? ' style="' + o.style + '"' : '') + '>' + inner + '</button>';
  };
  C.gbtn = (icon, o) => '<button type="button" class="gbtn' + (o && o.clear ? ' clear' : '') + '"' + C.attrs(o) + '>' + L.I(icon, 20, 2) + (o && o.dot ? '<span class="dot"' + (o.dotTk || '') + '></span>' : o && o.dotTk ? '<i hidden' + o.dotTk + '></i>' : '') + '</button>';
  C.top = (o) => {
    o = o || {};
    let left = '';
    if (o.back !== false && !o.close) left = C.gbtn('back', { back: 1, aria: t('Back'), clear: o.clear });
    if (o.close) left = C.gbtn('close', { back: 1, aria: o.closeLabel || t('Close'), clear: o.clear });
    return '<div class="topbar' + (o.solid ? ' solid' : '') + '">' + (left || '<span style="width:44px"></span>') + '<div class="tt">' + esc(o.title || '') + '</div>' + (o.right || '<span style="width:44px"></span>') + '</div>';
  };
  C.bell = (role) => {
    const n = L.W.notifs[role].filter((x) => !x.read).length;
    return C.gbtn('bell', { go: 'S-08', aria: n ? t('Notifications, {n} unread', { n }) : t('Notifications'), dot: n > 0, dotTk: L.tk('bell:' + role, n, 'badge') });
  };
  C.row = (o) => {
    const left = o.icon ? '<span class="ico ' + (o.tone || 'grey') + '">' + L.I(o.icon, 18, 2) + '</span>' : (o.av ? o.av : '');
    const right = (o.right ? '<span class="rv">' + o.right + '</span>' : '') + (o.chev === false ? '' : L.I('chev', 16, 2).replace('<svg', '<svg class="chev"'));
    const tag = o.go || o.act || o.tab || o.toggle || o.set ? 'button' : 'div';
    return '<' + tag + (tag === 'button' ? ' type="button"' : '') + ' class="row' + (o.dang ? ' dang' : '') + '"' + C.attrs(o) + '>' + left + '<span class="rt"><b>' + o.title + '</b>' + (o.sub ? '<span>' + o.sub + '</span>' : '') + '</span>' + right + '</' + tag + '>';
  };
  C.list = (rows, cls) => '<div class="list' + (cls ? ' ' + cls : '') + '">' + rows.join('') + '</div>';
  C.tile = (o) => '<button type="button" class="tile ' + o.tone + (o.wide ? ' wide' : '') + '"' + C.attrs(o) + '><span class="tl">' + esc(o.label) + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></span><span class="tv">' + o.value + '</span><span class="ts">' + esc(o.sub || '') + '</span><span class="tf"><span>' + esc(o.foot || '') + '</span><span>' + esc(o.foot2 || '') + '</span></span></button>';
  C.chip = (label, o) => '<button type="button" class="chip' + (o && o.on ? ' on' : '') + '"' + C.attrs(Object.assign({ pressed: !!(o && o.on) }, o)) + '>' + (o && o.icon ? o.icon : '') + esc(label) + '</button>';
  C.pill = (t, tone, icon, attrs) => '<span class="pill ' + (tone || 'grey') + '"' + (attrs || '') + '>' + (icon ? L.I(icon, 12, 2.4) : '') + esc(t) + '</span>';
  C.status = (s, key) => { const m = L.STATUS[s] || [s, 'grey']; return C.pill(t(m[0]), m[1], null, key ? L.tk('st:' + key, s, 'pop') : ''); };
  C.seg = (key, opts, cur) => '<div class="seg" role="tablist">' + opts.map((o) => '<button type="button" role="tab" aria-selected="' + (o.v === cur) + '" class="' + (o.v === cur ? 'on' : '') + '" data-set="' + key + '" data-val="' + esc(o.v) + '">' + esc(o.label) + (o.count ? ' <span class="cnt">' + o.count + '</span>' : '') + '</button>').join('') + '</div>';
  C.field = (o) => {
    const id = 'f_' + Math.random().toString(36).slice(2, 8);
    const val = o.value == null ? '' : o.value;
    const common = ' id="' + id + '" data-bind="' + o.bind + '"' + (o.live ? ' data-live="1"' : '') + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + (o.mode ? ' inputmode="' + o.mode + '"' : '') + (o.auto ? ' autocomplete="' + o.auto + '"' : '') + (o.max ? ' maxlength="' + o.max + '"' : '');
    let input;
    if (o.textarea) input = '<textarea class="inp' + (o.err ? ' err' : '') + '"' + common + ' rows="4">' + esc(val) + '</textarea>';
    else if (o.pre) input = '<span class="inp-pre"><span class="ink3">' + esc(o.pre) + '</span><input class="inp" type="' + (o.type || 'text') + '"' + common + ' value="' + esc(val) + '"></span>';
    else input = '<input class="inp' + (o.err ? ' err' : '') + '" type="' + (o.type || 'text') + '"' + common + ' value="' + esc(val) + '"' + (o.min ? ' min="' + o.min + '"' : '') + '>';
    return '<label class="field" for="' + id + '"><span>' + esc(o.label) + '</span>' + input + (o.err ? '<small class="err">' + esc(o.err) + '</small>' : o.help ? '<small>' + esc(o.help) + '</small>' : '') + '</label>';
  };
  C.tog = (on, o) => '<button type="button" role="switch" aria-checked="' + !!on + '" class="tog' + (on ? ' on' : '') + (o && o.lock ? ' lock' : '') + '"' + C.attrs(o) + '></button>';
  C.togRow = (title, sub, on, o) => '<button type="button" role="switch" aria-checked="' + !!on + '" class="row"' + C.attrs(o) + '><span class="rt"><b>' + esc(title) + '</b>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</span><span class="tog' + (on ? ' on' : '') + (o && o.lock ? ' lock' : '') + '" aria-hidden="true"></span></button>';
  C.av = (photo, size, alt) => '<span class="av" ' + (alt ? 'role="img" aria-label="' + esc(alt) + '" ' : 'aria-hidden="true" ') + 'style="width:' + size + 'px;height:' + size + 'px;background-image:url(' + (photo || '') + ')"></span>';
  /* Venue marks for the demo venues that have a logo. Keyed by name, so a fresh-install business never borrows one; anyone else keeps the letter. */
  const LOGO_INK = 'fill="none" stroke="#F4EDE1" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"';
  L.LOGOS = {
    'Casa Brisa': '<path d="M21 33a11 11 0 0 1 22 0z" fill="#F4EDE1"/><path d="M15 39.5c2.8-2.4 5.7-2.4 8.5 0s5.7 2.4 8.5 0 5.7-2.4 8.5 0 5.7 2.4 8.5 0M21 46c2.8-2.4 5.7-2.4 8.5 0s5.7 2.4 8.5 0 5.7-2.4 8.5 0" ' + LOGO_INK + '/>',
    'Mar de Olivos': '<path d="M19 47C27 39 35 29 46 17" ' + LOGO_INK + '/><g fill="#F4EDE1"><ellipse cx="26" cy="35" rx="7.5" ry="3" transform="rotate(-20 26 35)"/><ellipse cx="35" cy="34" rx="7.5" ry="3" transform="rotate(-75 35 34)"/><ellipse cx="33" cy="24.5" rx="7" ry="2.8" transform="rotate(-15 33 24.5)"/><ellipse cx="42" cy="25" rx="6" ry="2.6" transform="rotate(-80 42 25)"/></g><circle cx="23" cy="44" r="3.6" fill="#2E3518" stroke="#F4EDE1" stroke-width="1.8"/>',
    'Spa Agua Clara': '<path d="M32 14c-5 6.5-11 14.5-11 21.5a11 11 0 0 0 22 0C43 28.5 37 20.5 32 14z" ' + LOGO_INK + '/><path d="M26.5 37a6 6 0 0 0 5.5 5.5" ' + LOGO_INK + '/>',
    'Forma Studio': '<g fill="#F4EDE1"><rect x="21" y="15" width="7.5" height="34" rx="1.5"/><path d="M28.5 15H40a4.5 4.5 0 0 1 0 9H28.5z"/><circle cx="35.5" cy="33" r="4.5"/></g>'
  };
  C.logo = (b, size) => L.LOGOS[b.name] && !(b.meter && b.meter.logo === false)
    ? '<span class="logo mark" aria-hidden="true" style="width:' + size + 'px;height:' + size + 'px;background:' + (b.color || '#5C636B') + '"><svg viewBox="0 0 64 64" width="100%" height="100%">' + L.LOGOS[b.name] + '</svg></span>'
    : '<span class="logo" aria-hidden="true" style="width:' + size + 'px;height:' + size + 'px;background:' + (b.color || '#5C636B') + ';font-size:' + Math.round(size * 0.5) + 'px">' + esc((b.name || '?').charAt(0)) + '</span>';
  C.ph = (src, style, alt) => '<div class="ph" ' + (alt ? 'role="img" aria-label="' + esc(alt) + '"' : 'aria-hidden="true"') + ' style="background-image:url(' + src + ');' + (style || '') + '"></div>';
  C.empty = (o) => '<div class="empty"><span class="eic" data-in="pop">' + L.I(o.icon || 'spark', 26, 1.8) + '</span><b>' + esc(o.title) + '</b><p>' + esc(o.body) + '</p>' + (o.cta ? '<div class="mt8">' + o.cta + '</div>' : '') + '</div>';
  C.abar = (o) => '<div class="abar' + (o.title ? '' : ' solo') + '">' + (o.title ? '<span class="ab-t"><b>' + o.title + '</b>' + (o.sub ? '<span>' + o.sub + '</span>' : '') + '</span>' : '') + o.btn + '</div>';
  C.sheetHead = (title, sub) => '<div class="grab" aria-hidden="true"></div><div class="sheet-h"><h2>' + esc(title) + '</h2>' + C.gbtn('close', { close: 1, aria: t('Close') }) + '</div>' + (sub ? '<p class="sub" style="margin:-6px 0 16px">' + sub + '</p>' : '');
  /* Deliberate open question for Matt (pending terms, legal wording, numbers). Hidden by the desk toggle 'Show open questions' (body.hide-oq). */
  C.oq = (text) => '<span class="oq" data-oq><b class="oq-l">' + esc(t('Open question')) + '</b>' + (text ? '<span class="oq-t">' + esc(text) + '</span>' : '') + '</span>';
  C.money = (lines) => '<div class="money">' + lines.map((l) => '<div class="ml' + (l[2] ? ' tot' : '') + '"><span>' + esc(l[0]) + '</span><span>' + l[1] + '</span></div>').join('') + '</div>';
  C.banner = (tone, icon, html) => '<div class="banner ' + tone + '" data-row="bn:' + tone + ':' + L.hash(html) + '">' + L.I(icon, 18, 2) + '<div>' + html + '</div></div>';
  C.badges = (cr) => (L.verified(cr) ? '<span class="badge-v">' + L.I.verified(15) + t('Verified') + '</span>' : '') + (cr.plus ? ' <span class="badge-p">PLUS</span>' : '');
  C.prog = (n) => '<div class="prog" role="progressbar" aria-label="' + esc(t('Step {n} of 4', { n })) + '" aria-valuenow="' + n + '" aria-valuemin="1" aria-valuemax="4">' + [1, 2, 3, 4].map((i) => '<i class="' + (i <= n ? 'on' : '') + '"' + L.tk('prog:' + i, i <= n ? 'on' : '', 'wipe') + '></i>').join('') + '</div>';
  // The one stepper: 4-segment bar, "Step n of 4" (plus an optional note), then the serif title. Onboarding and the campaign wizard both use it.
  C.stepHead = (n, title, sub, meta) => C.prog(n) + '<div class="stack g6"><span class="meta">' + (meta || t('Step {n} of 4', { n })) + '</span><h1 class="lt">' + title + '</h1>' + (sub ? '<p class="sub" style="margin:0">' + sub + '</p>' : '') + '</div>';
  // The one success layout (from B-20): centred icon disc, serif headline, a line of context, then the screen's own body.
  C.success = (o) => '<div class="pad stack g20 success"><span class="sx-ic ' + (o.tone || 'ok') + '" data-in="pop"><span data-in="draw" data-d="160" style="display:flex">' + L.I(o.icon || 'check', 40, 2.4) + '</span></span><h1 class="lt' + (o.xl === false ? '' : ' xl') + '" data-in="up" data-d="80">' + o.title + '</h1>' + (o.sub ? '<p class="sub">' + o.sub + '</p>' : '') + (o.body ? '<div class="sx-body stack g16" data-in="up" data-d="200">' + o.body + '</div>' : '') + '</div>';
  C.meter = (pct) => '<div class="meter" role="progressbar" aria-label="' + esc(t('Profile {pct}% complete', { pct })) + '" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"' + L.tk('meter', pct, 'bar') + '></i></div>';

  C.campaignCard = (k, o) => {
    const b = L.biz(k.bizId);
    const early = L.isEarly(k);
    const price = k.type === 'paid' ? L.eur(k.rate) : t('Experience');
    const linked = !(o && o.go === '');
    return '<' + (linked ? 'button type="button"' : 'div') + ' class="ccard"' + (linked ? ' data-go="' + (o && o.go ? o.go : 'C-09:' + k.id) + '"' : '') + '>' +
      '<div class="ph" role="img" aria-label="' + esc(k.title) + '" style="background-image:url(' + k.cover + ')">' + (k.type === 'experience' ? C.pill(t('Experience'), 'glass', 'gift') : C.pill(t('Paid'), 'glass', 'euro')) + (early ? C.pill(t('Early access'), 'ink', 'bolt') : '') + '</div>' +
      '<div class="cb"><span class="stack g4 grow"><span class="meta">' + esc(b.name) + '</span><b>' + esc(k.title) + '</b><span class="meta">' + esc(t('{town} · {km} km · Apply by {date}', { town: t(k.town), km: L.num(k.km), date: L.dshort(k.applyBy) })) + '</span></span>' +
      '<span class="stack g4" style="align-items:flex-end"><span class="price">' + price + '</span><span class="meta">' + (k.type === 'paid' ? t('per creator') : esc(k.offer.split(' + ')[0])) + '</span></span></div></' + (linked ? 'button' : 'div') + '>';
  };
  C.creatorCard = (cr) => {
    const igf = cr.socials.ig.connected ? cr.socials.ig.followers : null;
    const self = cr.socials.other[0];
    return '<button type="button" class="crcard" data-go="B-08:' + cr.id + '"><div class="ph" role="img" aria-label="' + esc(cr.first) + '" style="background-image:url(' + cr.photo + ')">' + (cr.plus ? '<span class="badge-p">PLUS</span>' : '') + '</div>' +
      '<span class="stack g4" style="padding:0 4px"><span class="hrow" style="gap:6px"><b style="font-size:16px;font-weight:600">' + esc(cr.first) + '</b>' + (L.verified(cr) ? L.I.verified(15) : '') + '<span class="meta crtown">' + esc(t(cr.town)) + '</span></span>' +
      '<span class="meta">' + esc(cr.niches.map((v) => t(v)).join(' · ')) + '</span><span class="meta">' + esc((igf ? t('{n} on Instagram', { n: L.k(igf) }) : self ? t('{n} self-reported', { n: L.k(self.followers) }) : t('New'))) + '</span></span></button>';
  };
  C.xcard = (col) => {
    const k = L.camp(col.campaignId), b = L.biz(k.bizId), cr = L.cr(col.creatorId);
    const shots = (col.submission && col.submission.shots) || [k.cover];
    return '<div class="xcard"><div class="strip">' + C.ph(shots[0]) + '<div class="stack g4">' + C.ph(k.cover, 'flex:1') + C.ph(cr.photo, 'flex:1;background-position:center 25%') + '</div></div>' +
      '<div class="xm"><b>' + esc(cr.first) + ' × ' + esc(b.name) + '</b>' + esc(k.title) + ' · ' + esc(b.town) + ' · ' + L.dshort(col.history[col.history.length - 1].at) + '</div></div>';
  };
  C.nextB = (col) => {
    const k = L.camp(col.campaignId), cr = L.cr(col.creatorId);
    switch (col.status) {
      case 'applied': return t('Review application');
      case 'invited': return t('Invite sent · waiting for {name}', { name: cr.first });
      case 'awaiting': return k.type === 'paid' ? t('Fund to confirm {name}', { name: cr.first }) : t('Confirm {name}', { name: cr.first });
      case 'active': return col.visitDate ? t('Visit {when}', { when: L.dt(col.visitDate) }) : t('Agree a visit date');
      case 'submitted': return t('Review · {h}h left', { h: L.hoursLeft(col) });
      case 'completed': return col.releaseReason === 'auto_released' ? t('Auto-released') : t('Approved & released');
      case 'disputed': return t('Lokaly is reviewing');
      case 'cancelled': return k.type === 'paid' ? t('Refunded') : t('Cancelled');
      default: return t(L.STATUS[col.status][0]);
    }
  };
  C.nextC = (col) => {
    const k = L.camp(col.campaignId), b = L.biz(k.bizId);
    switch (col.status) {
      case 'invited': return t('Respond to invite');
      case 'applied': return t('Waiting for {biz}', { biz: b.name });
      case 'awaiting': return k.type === 'paid' ? t('Waiting for funding') : t('Waiting for confirmation');
      case 'active': return !col.visitDate ? t('Set visit date') : col.visitDate > L.W.now ? t('Visit {when}', { when: L.dt(col.visitDate) }) : t('Submit your post');
      case 'submitted': return k.type === 'paid' ? t('Releasing in {h}h', { h: L.hoursLeft(col) }) : t('Completes in {h}h', { h: L.hoursLeft(col) });
      case 'completed': return k.type === 'paid' ? t('Paid {amt}', { amt: L.eur(L.netC(k.rate)) }) : t('Completed');
      case 'disputed': return t('Lokaly is reviewing');
      default: return t(L.STATUS[col.status][0]);
    }
  };
  C.collabRow = (col, role) => {
    const k = L.camp(col.campaignId), b = L.biz(k.bizId), cr = L.cr(col.creatorId);
    const av = role === 'business' ? C.av(cr.photo, 44) : C.logo(b, 44);
    // Two lines: the campaign name (wraps, never ellipsized), then who · next step. The status pill keeps its own width.
    const who = role === 'business' ? cr.first : b.name;
    const go = role === 'business' && col.status === 'applied' ? 'B-25:' + col.id : role === 'business' && col.status === 'submitted' ? 'B-27:' + col.id : role === 'creator' && col.status === 'invited' ? 'C-13:' + col.id : 'S-12:' + col.id;
    return '<button type="button" class="row colrow" data-go="' + go + '">' + av + '<span class="rt"><b>' + esc(k.title) + '</b><span>' + esc(who) + ' · ' + esc(role === 'business' ? C.nextB(col) : C.nextC(col)) + '</span></span>' + C.status(col.status, col.id) + '</button>';
  };
  C.meterCard = (role) => {
    const pct = role === 'business' ? L.bizMeter() : L.crMeter();
    return '<button type="button" class="meter-card" data-go="' + (role === 'business' ? 'B-04' : 'C-05') + '"><span class="hrow between"><b style="font-size:15px">' + t('Profile {pct}%', { pct }) + '</b><span class="meta">' + (role === 'business' ? t('Finish to publish campaigns') : t('Finish to apply')) + '</span></span>' + C.meter(pct) + '<span class="hrow between"><span class="sub" style="font-size:13px">' + (role === 'business' ? t('Logo, photos, description, address') : t('Photo, bio, portfolio, a social')) + '</span><span class="det" style="font-weight:600;font-size:13px">' + t('Finish') + '</span></span></button>';
  };
  C.timeline = (col) => {
    const k = L.camp(col.campaignId), paid = k.type === 'paid';
    const order = ['applied', 'active', 'visit', 'submitted', 'completed'];
    const labels = { applied: t(col.history[0].s === 'invited' ? 'Invited & accepted' : 'Applied'), active: t(paid ? 'Accepted & funded' : 'Accepted'), visit: t('Visit'), submitted: t('Post submitted'), completed: t(paid ? 'Released' : 'Completed') };
    let idx = { invited: 0, applied: 0, awaiting: 0, active: col.visitDate && col.visitDate < L.W.now ? 2 : 1, submitted: 3, completed: 4, resolved_released: 4 }[col.status];
    const bad = ['disputed', 'cancelled', 'resolved_refunded', 'declined', 'withdrawn', 'expired'].includes(col.status);
    if (bad) idx = col.submittedAt ? 3 : col.history.some((h) => h.s === 'active') ? 1 : 0;
    const subs = {
      applied: L.dshort(col.history[0].at), active: col.history.find((h) => h.s === 'active') ? (paid ? t('{date} · {amt} held', { date: L.dshort(col.history.find((h) => h.s === 'active').at), amt: L.eur(L.payB(k.rate)) }) : t('{date} · No payment held', { date: L.dshort(col.history.find((h) => h.s === 'active').at) })) : (col.status === 'awaiting' ? t(paid ? 'Waiting for funding' : 'Waiting for confirmation') : t('Waiting for {biz}', { biz: L.biz(k.bizId).name })),
      visit: col.visitDate ? L.dt(col.visitDate) : t('Agree a time in chat, then set it here'), submitted: col.submittedAt ? t('{when} · 72h review', { when: L.dt(col.submittedAt) }) : t('Post URL + screenshot'),
      completed: col.status === 'completed' ? t(col.releaseReason === 'auto_released' ? 'Auto-released after 72h' : 'Approved') : t('Approve, or automatic after 72h')
    };
    let html = '<div class="tline">' + order.map((s, i) => {
      const cls = i < idx || (i === idx && (col.status === 'completed' || col.status === 'resolved_released')) ? 'done' : i === idx && !bad ? 'cur' : 'up';
      return '<div class="tstep ' + cls + '"' + L.tk('tl:' + col.id + ':' + i, cls, 'step') + '><span class="tdot">' + (cls === 'done' ? L.I('check', 13, 3) : '') + '</span><span class="tx"><b>' + labels[s] + '</b><span>' + esc(subs[s]) + '</span></span></div>';
    }).join('');
    if (bad) {
      const by = col.cancelBy === 'creator' ? 'creator' : 'business';
      const m = { disputed: ['Problem reported', 'Funds frozen · Lokaly is reviewing'], cancelled: ['Cancelled', paid ? 'Cancelled by ' + by + ' · business refunded' : 'Cancelled by ' + by], resolved_refunded: ['Refunded', 'Lokaly refunded the business'], declined: ['Not selected', ''], withdrawn: ['Withdrawn', ''], expired: ['Expired', ''] }[col.status];
      html += '<div class="tstep bad"' + L.tk('tl:' + col.id + ':bad', col.status, 'swap') + ' data-fam="tl:' + col.id + ':0"><span class="tdot">' + L.I('alert', 13, 2.6) + '</span><span class="tx"><b>' + esc(t(m[0])) + '</b><span>' + esc(m[1] ? t(m[1]) : '') + '</span></span></div>';
    }
    return html + '</div>';
  };
  C.escrow = (col) => {
    const s = col.status;
    const st = { held: s === 'active' ? 'on' : ['submitted', 'completed', 'resolved_released'].includes(s) ? 'done' : s === 'disputed' ? 'bad' : '', rev: s === 'submitted' ? 'lil' : ['completed', 'resolved_released'].includes(s) ? 'done' : s === 'disputed' ? 'bad' : '', rel: ['completed', 'resolved_released'].includes(s) ? 'done' : s === 'resolved_refunded' ? 'bad' : '' };
    return '<div class="escrow" aria-label="' + esc(t('Payment status')) + '"><div class="' + st.held + '"' + L.tk('es:' + col.id + ':0', st.held, 'wipe') + '><i></i>' + t(s === 'disputed' ? 'Frozen' : 'Held') + '</div><div class="' + st.rev + '"' + L.tk('es:' + col.id + ':1', st.rev, 'wipe') + '><i></i>' + t('In review · 72h') + '</div><div class="' + st.rel + '"' + L.tk('es:' + col.id + ':2', st.rel, 'wipe') + '><i></i>' + t(s === 'resolved_refunded' ? 'Refunded@@escrow' : 'Released') + '</div></div>';
  };

  /* ───────── app-native pickers (no browser <select> or date inputs) ─────────
     C.pick is a 52pt row: label left, value + chevron right. Tapping it opens the PICK sheet, a list picker or
     iOS-style wheels (24h); Done writes 'YYYY-MM-DD' / 'YYYY-MM-DDTHH:MM' / the option value back to the same data-bind path. */
  const WH = 44; // wheel row height (pt); .wi in styles.css matches
  // Wheel column names live with the other localized date words (DAYS, MONS), not in the t() dictionary.
  const WCOL = { en: { d: 'Day', mo: 'Month', y: 'Year', dd: 'Date', h: 'Hour', mi: 'Minute' }, es: { d: 'Día', mo: 'Mes', y: 'Año', dd: 'Fecha', h: 'Hora', mi: 'Minuto' } };
  const p2 = (n) => String(n).padStart(2, '0');
  const dim = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  L.parseVal = (v, kind) => { const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/); return m ? new Date(+m[1], +m[2] - 1, +m[3], kind === 'datetime' ? +(m[4] || 0) : 0, kind === 'datetime' ? +(m[5] || 0) : 0) : null; };
  L.valStr = (d, kind) => d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + (kind === 'datetime' ? 'T' + p2(d.getHours()) + ':' + p2(d.getMinutes()) : '');
  L.pickShow = (o, v) => {
    if (o.kind === 'list') { const hit = (o.opts || []).find((x) => x.v === v); return hit ? hit.label : v || ''; }
    const d = L.parseVal(v, o.kind); return d ? (o.kind === 'datetime' ? L.dt(d.getTime()) : L.date(d.getTime())) : '';
  };
  const pickMin = (f) => { const m = L.parseVal(f.min, f.kind); if (m && f.kind === 'datetime') m.setMinutes(Math.ceil(m.getMinutes() / 5) * 5, 0, 0); return m; };
  const pickBase = (f) => { const b = pickMin(f) || new Date(L.W.now); return new Date(b.getFullYear(), b.getMonth(), b.getDate()); };
  const pickVal = (f) => {
    const d = L.parseVal(f.v, f.kind);
    if (d) return d;
    const n = new Date(L.W.now); // nothing set yet: the next whole hour (datetime) or today
    return f.kind === 'datetime' ? new Date(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours() + 1) : new Date(n.getFullYear(), n.getMonth(), n.getDate());
  };
  const pickCols = (f, d) => {
    if (f.kind === 'datetime') {
      const b = pickBase(f), today = new Date(L.W.now).toDateString();
      const days = Array.from({ length: 60 }, (_, i) => new Date(b.getFullYear(), b.getMonth(), b.getDate() + i));
      return [
        { k: 'dd', items: days.map((x) => (x.toDateString() === today ? t('Today') : L.date(x.getTime()))), idx: Math.max(0, Math.min(59, Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - b) / L.D))) },
        { k: 'h', items: Array.from({ length: 24 }, (_, i) => p2(i)), idx: d.getHours() },
        { k: 'mi', items: Array.from({ length: 12 }, (_, i) => p2(i * 5)), idx: Math.min(11, Math.round(d.getMinutes() / 5)) }
      ];
    }
    const y0 = (pickMin(f) || new Date(L.W.now)).getFullYear();
    return [
      { k: 'd', items: Array.from({ length: dim(d) }, (_, i) => String(i + 1)), idx: d.getDate() - 1 },
      { k: 'mo', items: MONS[lg()], idx: d.getMonth() },
      { k: 'y', items: [y0, y0 + 1, y0 + 2].map(String), idx: Math.max(0, d.getFullYear() - y0) }
    ];
  };
  C.pick = (o) => {
    const shown = L.pickShow(o, o.value) || t('Not set');
    const cfg = { bind: o.bind, kind: o.kind, label: o.label, opts: o.opts, min: o.min, after: o.after };
    return '<button type="button" class="row pick' + (o.err ? ' err' : '') + '" data-act="pick" data-arg="' + esc(JSON.stringify(cfg)) + '" aria-haspopup="dialog" aria-label="' + esc(o.label + ', ' + shown) + '"><span class="rt"><b>' + esc(o.label) + '</b></span><span class="rv' + (L.pickShow(o, o.value) ? '' : ' unset') + '">' + esc(shown) + '</span>' + L.I('chev', 16, 2).replace('<svg', '<svg class="chev"') + '</button>';
  };
  L.A.pick = (ph, arg) => { const o = JSON.parse(arg); const cur = ph.get(o.bind); ph.go('PICK', { f: Object.assign(o, { v: cur == null ? '' : String(cur) }) }); };
  L.A.wheel = (ph, arg) => {
    const [col, i] = arg.split('|'); const n = +i; const f = ph.top().f; let d = pickVal(f);
    if (col === 'dd') { const b = pickBase(f); d.setFullYear(b.getFullYear(), b.getMonth(), b.getDate() + n); }
    if (col === 'h') d.setHours(n);
    if (col === 'mi') d.setMinutes(n * 5);
    if (col === 'd') d.setDate(n + 1);
    if (col === 'mo' || col === 'y') { const day = d.getDate(); d.setDate(1); if (col === 'mo') d.setMonth(n); else d.setFullYear((pickMin(f) || new Date(L.W.now)).getFullYear() + n); d.setDate(Math.min(day, dim(d))); }
    const min = pickMin(f); if (min && d < min) d = min; // like iOS, a date before the minimum rolls back
    f.v = L.valStr(d, f.kind);
  };
  L.A.pickDone = (ph) => { const f = ph.top().f; const v = f.kind === 'list' ? f.v : L.valStr(pickVal(f), f.kind); ph.sheets.pop(); ph.set(f.bind, v); if (f.after && L.A[f.after]) L.A[f.after](ph, f.bind); };
  L.A.pickSet = (ph, v) => { ph.top().f.v = v; L.A.pickDone(ph); };
  L.S.PICK = { name: 'Picker', sheet: true, title: (e) => e.f.label, render: (x) => {
    const f = x.f;
    if (f.kind === 'list') return C.sheetHead(f.label) + '<div class="list" role="radiogroup" aria-label="' + esc(f.label) + '">' + f.opts.map((o) => '<button type="button" class="row" role="radio" aria-checked="' + (o.v === f.v) + '" data-act="pickSet" data-arg="' + esc(o.v) + '"><span class="rt"><b>' + esc(o.label) + '</b></span>' + (o.v === f.v ? '<span class="pk-on">' + L.I('check', 18, 2.4) + '</span>' : '') + '</button>').join('') + '</div>';
    const d = pickVal(f);
    return C.sheetHead(f.label) + '<p class="pk-read num" aria-live="polite">' + esc(L.pickShow(f, L.valStr(d, f.kind)) + (f.kind === 'date' ? ' ' + d.getFullYear() : '')) + '</p>' +
      '<div class="wheels" role="group" aria-label="' + esc(f.label) + '"><span class="wband" aria-hidden="true"></span>' + pickCols(f, d).map((c) => '<div class="wheel w-' + c.k + '" role="listbox" tabindex="0" aria-label="' + WCOL[lg()][c.k] + '" data-wcol="' + c.k + '" data-idx="' + c.idx + '" data-n="' + c.items.length + '">' +
        c.items.map((s, i) => '<div class="wi' + (i === c.idx ? ' on' : '') + '" role="option" aria-selected="' + (i === c.idx) + '" data-act="wheel" data-arg="' + c.k + '|' + i + '">' + esc(s) + '</div>').join('') + '</div>').join('') + '</div>' +
      '<div class="mt16">' + C.btn(t('Done'), { full: 1, act: 'pickDone' }) + '</div>';
  } };
  L.wheelH = WH;

  /* ───────── tab bars ───────── */
  L.TABS = {
    business: [{ id: 'B-00', label: 'Home', icon: 'home' }, { id: 'B-05', label: 'Discover', icon: 'compass' }, { id: 'B-14', label: 'Create', icon: 'plus', swell: true }, { id: 'S-09', label: 'Messages', icon: 'chat' }, { id: 'B-34', label: 'Profile', icon: 'user' }],
    creator: [{ id: 'C-00', label: 'Home', icon: 'home' }, { id: 'C-06', label: 'Discover', icon: 'compass' }, { id: 'C-14', label: 'Work', icon: 'work', swell: true }, { id: 'S-09', label: 'Messages', icon: 'chat' }, { id: 'C-20', label: 'Profile', icon: 'user' }]
  };
  // ES "Colaboraciones" is the inventory §0.1 stress test for the creator collabs tab ("Work" in EN); fallback is "Collabs".
  L.tabLabel = (tab) => (tab.id === 'C-14' && L.lang() === 'es' ? t('Collabs tab') : t(tab.label));
  C.tabbar = (role, cur) => {
    const unread = L.W.threads.filter((t) => (role === 'business' ? t.bizId === L.W.bizMe.id : t.creatorId === L.W.crMe.id)).reduce((s, t) => s + t.unread[role], 0);
    return '<div class="fade-bottom" aria-hidden="true"></div><nav class="tabbar" aria-label="' + esc(t(role === 'business' ? 'Business tabs' : 'Creator tabs')) + '">' + L.TABS[role].map((tb) => {
      const on = tb.id === cur; const txt = L.tabLabel(tb);
      const badge = tb.id === 'S-09' ? (unread ? '<span class="cnt" aria-hidden="true"' + L.tk('tabcnt', unread, 'badge') + '>' + unread + '</span>' : '<i hidden' + L.tk('tabcnt', 0, 'badge') + '></i>') : '';
      const label = tb.id === 'S-09' && unread ? t('{tab}, {n} unread', { tab: txt, n: unread }) : txt;
      if (tb.swell) return '<button type="button" class="tab swell' + (on ? ' on' : '') + '" data-tab="' + tb.id + '" aria-label="' + esc(label) + '"' + (on ? ' aria-current="page"' : '') + '><span class="swell-o"><span class="swell-i">' + L.I(tb.icon, 24, 2.2) + '</span></span><span class="tl-t">' + esc(txt) + '</span></button>';
      return '<button type="button" class="tab' + (on ? ' on' : '') + '" data-tab="' + tb.id + '" aria-label="' + esc(label) + '"' + (on ? ' aria-current="page"' : '') + '>' + L.I(tb.icon, 24, on ? 2.2 : 1.9) + '<span class="tl-t">' + esc(txt) + '</span>' + badge + '</button>';
    }).join('') + '</nav>';
  };

  /* ───────── phone runtime ───────── */
  function Phone(role, mount, capMount) {
    this.role = role; this.mount = mount; this.cap = capMount;
    this.stack = []; this.sheets = []; this.push = null; this.toastMsg = null; this.draft = null; this.ob = {}; this.busy = null;
    this.bornAt = new Map(); this.seenK = new Set(); this.ticks = new Map(); this.rows = new Map(); this.loops = new Map(); this.pending = {}; this.nav = null; this.toastK = 0;
    L.phones.push(this);
    mount.addEventListener('click', (e) => this.onClick(e));
    mount.addEventListener('input', (e) => this.onInput(e));
    mount.addEventListener('change', (e) => this.onInput(e, true));
    mount.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('[data-enter]')) { e.preventDefault(); this.run(e.target.getAttribute('data-enter'), e.target.getAttribute('data-arg'), e.target); }
      const w = e.target;
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && w.classList && w.classList.contains('wheel')) { e.preventDefault(); const i = Math.max(0, Math.min(+w.dataset.n - 1, +w.dataset.idx + (e.key === 'ArrowDown' ? 1 : -1))); this.run('wheel', w.dataset.wcol + '|' + i, w); }
    });
    // Picker wheels: when a flick settles (scroll-snap), the row in the band becomes the value.
    mount.addEventListener('scroll', (e) => { const w = e.target; if (w.classList && w.classList.contains('wheel')) { clearTimeout(w.settleT); w.settleT = setTimeout(() => this.wheelSettle(w), 120); } }, true);
  }
  L.Phone = Phone;
  Phone.prototype.wheelSettle = function (w) {
    if (!w.isConnected || w.closest('[inert]')) return;
    const i = Math.max(0, Math.min(+w.dataset.n - 1, Math.round(w.scrollTop / L.wheelH)));
    if (i !== +w.dataset.idx) this.run('wheel', w.dataset.wcol + '|' + i, w);
  };
  Phone.prototype.boot = function () {
    this.sheets = []; this.push = null; this.ob = {}; this.draft = null;
    const fresh = L.W.fresh;
    if (fresh) this.stack = [{ id: 'S-01', f: {} }];
    else this.stack = [{ id: this.role === 'business' ? 'B-00' : 'C-00', f: {} }];
    if (fresh) { clearTimeout(this.launchT); this.launchT = setTimeout(() => { if (this.top().id === 'S-01') { this.stack = [{ id: 'S-02', f: {} }]; this.nav = 'fade'; this.render(); } }, L.fast ? 0 : 700); }
  };
  Phone.prototype.top = function () { return this.sheets.length ? this.sheets[this.sheets.length - 1] : this.stack[this.stack.length - 1]; };
  Phone.prototype.base = function () { return this.stack[this.stack.length - 1]; };
  Phone.prototype.go = function (spec, opts) {
    const i = spec.indexOf(':'); const id = i < 0 ? spec : spec.slice(0, i); const arg = i < 0 ? undefined : spec.slice(i + 1);
    const def = L.S[id];
    if (!def) { console.warn('No screen', id); return; }
    if (def.guard) { const redirect = def.guard(this, arg); if (redirect) { if (redirect !== true) this.go(redirect); return; } }
    const entry = { id, arg, f: Object.assign({}, (opts && opts.f) || {}) };
    const same = opts && opts.replace && !def.sheet && this.base().id === id;
    if (def.sheet) this.sheets.push(entry);
    else { this.sheets = []; if (opts && opts.replace) this.stack[this.stack.length - 1] = entry; else if (opts && opts.root) this.stack = [entry]; else this.stack.push(entry); this.nav = same ? null : opts && opts.root ? 'fade' : (opts && opts.nav) || 'push'; }
    if (def.enter) def.enter(this, entry);
    this.render(true);
  };
  Phone.prototype.back = function () {
    if (this.sheets.length) this.sheets.pop();
    else if (this.stack.length > 1) { this.stack.pop(); this.nav = 'pop'; }
    this.render();
  };
  Phone.prototype.closeSheets = function () { this.sheets = []; this.render(); };
  Phone.prototype.tab = function (id) {
    const def = L.S[id];
    if (def && def.guard) { const r = def.guard(this); if (r) { if (r !== true) this.go(r); return; } }
    if (this.base().id !== id || this.stack.length > 1) this.nav = 'tab';
    this.sheets = []; this.stack = [{ id, f: {} }]; if (def && def.enter) def.enter(this, this.stack[0]); this.render(true);
  };
  Phone.prototype.toast = function (msg) {
    this.toastMsg = msg; this.toastK++; this.render(); clearTimeout(this.toastT);
    this.toastT = setTimeout(() => { this.toastMsg = null; this.render(); }, 2600);
  };
  Phone.prototype.showPush = function (n) {
    this.push = n; clearTimeout(this.pushT);
    const wait = L.M.handoff(this);
    if (wait) this.pending['p' + n.id] = performance.now() + wait;
    this.pushT = setTimeout(() => { this.push = null; this.render(); }, 5200 + wait);
  };
  Phone.prototype.later = function (ms, fn) { setTimeout(() => { fn(); L.emit(); }, L.fast ? 0 : ms); };
  Phone.prototype.ctx = function (entry) {
    return { ph: this, role: this.role, w: L.W, e: entry, f: entry.f, arg: entry.arg, me: this.role === 'business' ? L.myBiz() : L.myCr() };
  };
  Phone.prototype.getPath = function (path) {
    const [root, ...rest] = path.split('.');
    let o = root === 'd' ? this.draft : root === 'o' ? this.ob : root === 'w' ? L.W : null;
    let keys = o ? rest : [root].concat(rest);
    if (!o) o = this.top().f;
    for (let i = 0; i < keys.length - 1; i++) { if (o[keys[i]] == null) o[keys[i]] = {}; o = o[keys[i]]; }
    return [o, keys[keys.length - 1]];
  };
  Phone.prototype.get = function (path) { const [o, k] = this.getPath(path); return o[k]; };
  Phone.prototype.set = function (path, v) { const [o, k] = this.getPath(path); o[k] = v; };
  Phone.prototype.run = function (name, arg, el) {
    const fn = L.A[name];
    if (!fn) { console.warn('No action', name); return; }
    fn(this, arg, el);
    L.emit();
  };
  Phone.prototype.onClick = function (e) {
    const el = e.target.closest('[data-go],[data-tab],[data-act],[data-back],[data-close],[data-set],[data-multi],[data-toggle],.scrim,.push');
    if (!el || !this.mount.contains(el) || el.closest('[inert]')) return;
    L.M.tap(this, el);
    if (el.classList.contains('scrim')) { this.back(); return; }
    if (el.classList.contains('push')) { const n = this.push; this.push = null; if (n) { n.read = true; this.sheets = []; if (n.go) this.go(n.go); else this.render(); } return; }
    if (el.dataset.set) { this.set(el.dataset.set, el.dataset.val); this.render(); return; }
    if (el.dataset.multi) { const cur = this.get(el.dataset.multi) || []; const v = el.dataset.val; this.set(el.dataset.multi, cur.includes(v) ? cur.filter((x) => x !== v) : cur.concat(v)); this.render(); return; }
    if (el.dataset.toggle) { this.set(el.dataset.toggle, !this.get(el.dataset.toggle)); this.render(); return; }
    if (el.dataset.act) { this.run(el.dataset.act, el.dataset.arg, el); return; }
    if (el.dataset.back || el.dataset.close) { this.back(); return; }
    if (el.dataset.tab) { this.tab(el.dataset.tab); return; }
    if (el.dataset.go) { this.go(el.dataset.go); return; }
  };
  Phone.prototype.onInput = function (e, isChange) {
    const el = e.target; const key = el.dataset && el.dataset.bind; if (!key) return;
    const v = el.type === 'checkbox' ? el.checked : el.value;
    this.set(key, v);
    if (el.type === 'range' && !isChange) { this.liveLabel(el, key); return; }
    if (el.dataset.live || (isChange && (el.type === 'range' || el.type === 'datetime-local' || el.tagName === 'SELECT'))) this.render();
  };
  // A slider is never re-rendered mid-drag (that drops the drag); its label is recomputed from a throwaway render instead.
  Phone.prototype.liveLabel = function (el, key) {
    const e = this.top(), d = L.S[e.id]; let html = '';
    try { html = d.render(Object.assign(this.ctx(e), { fix: () => {} })); } catch (_) { return; }
    const tpl = document.createElement('template'); tpl.innerHTML = html;
    const twin = tpl.content.querySelector('[data-bind="' + key + '"]'), lab = el.closest('label');
    const from = twin && twin.closest('label') && twin.closest('label').querySelector('span'), to = lab && lab.querySelector('span');
    if (from && to) to.textContent = from.textContent;
  };
  Phone.prototype.render = function (scrollTop) {
    // While a handoff dot is in the air, the receiving phone waits, so the push, badges and bubbles land with it.
    if (this.holdUntil) { const left = this.holdUntil - performance.now(); if (left > 0) { clearTimeout(this.holdT); this.holdT = setTimeout(() => this.render(), left); return; } this.holdUntil = 0; }
    if (this.rendering) { this.again = true; return; }
    this.rendering = true;
    try { this.paint(scrollTop); } finally { this.rendering = false; }
    if (this.again) { this.again = false; this.render(); }
  };
  Phone.prototype.paint = function (scrollTop) {
    const top = this.top(), base = this.base();
    const bdef = L.S[base.id];
    if (!bdef) return;
    const M = L.M, nav = this.nav; this.nav = null;
    // The phone shell (.scr) is built once; the page (.pg) and the overlays (.ovl) are rebuilt each render,
    // so motion can keep a leaving page alive and continue entries instead of replaying them.
    if (!this.scr || !this.mount.contains(this.scr)) {
      this.mount.innerHTML = '<div class="scr"><div class="island" aria-hidden="true"></div><div class="ovl"></div><div class="fx" aria-hidden="true"></div><div class="homebar" aria-hidden="true"></div></div>';
      this.scr = this.mount.firstChild; this.ovl = this.scr.querySelector('.ovl'); this.fx = this.scr.querySelector('.fx'); this.pg = null;
    }
    const view = this.pg && this.pg.querySelector('.view');
    if (view && this.pgEntry) this.pgEntry.scroll = view.scrollTop;
    if (scrollTop && !this.sheets.length && this.pgEntry !== base) base.scroll = 0;
    this.ovl.querySelectorAll(':scope > .sheet[data-k]').forEach((sh) => { const e = this.sheets.find((s) => 's' + M.key(s) === sh.dataset.k); if (e) e.scroll = sh.scrollTop; });
    const active = document.activeElement; let focus = null;
    if (active && this.mount.contains(active) && active.dataset && active.dataset.bind) focus = { bind: active.dataset.bind, s: active.selectionStart, e: active.selectionEnd };
    if (active && this.mount.contains(active) && active.dataset && active.dataset.wcol) focus = { wcol: active.dataset.wcol };
    const wheelAt = {}; this.ovl.querySelectorAll(':scope > .sheet[data-k] .wheel').forEach((w) => { wheelAt[w.closest('.sheet').dataset.k + w.dataset.wcol] = w.scrollTop; });

    const fixed = [];
    const ctx = Object.assign(this.ctx(base), { fix: (h) => fixed.push(h) });
    let body = '';
    try { body = bdef.render(ctx); } catch (err) { console.error(err); body = '<div class="pad top-pad"><b>Render error in ' + base.id + '</b><pre style="white-space:pre-wrap;font-size:11px">' + esc(err.stack) + '</pre></div>'; }
    L.seen.add(base.id);
    const tabHtml = bdef.tab ? C.tabbar(this.role, bdef.tab) : '';
    let sheetsHtml = '';
    this.sheets.forEach((s, i) => {
      const d = L.S[s.id]; L.seen.add(s.id);
      let sb = '';
      const sctx = Object.assign(this.ctx(s), { fix: () => {} });
      try { sb = d.render(sctx); } catch (err) { console.error(err); sb = '<b>Render error ' + s.id + '</b><pre style="white-space:pre-wrap;font-size:11px">' + esc(err.stack) + '</pre>'; }
      const k = M.key(s);
      sheetsHtml += '<div class="scrim" aria-hidden="true" data-k="c' + k + '" data-ov="scrim"></div><div class="sheet' + (d.full ? ' full' : '') + (d.noir ? ' noir' : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(d.title ? d.title(s) : t(d.name)) + '" data-screen="' + s.id + '" data-k="s' + k + '" data-ov="sheet">' + sb + '</div>';
    });
    const off = L.W.scen.offline ? '<div class="offline" role="status">' + L.I('wifioff', 14, 2) + esc(t('Offline · showing saved data')) + '</div>' : '';
    const ptext = this.push ? L.ntext(this.push) : '';
    const push = this.push ? '<button type="button" class="push" data-k="p' + this.push.id + '" data-ov="push" aria-label="' + esc(t('Notification: {text}', { text: ptext })) + '"><span class="pi" aria-hidden="true">L</span><span class="pt"><b>Lokaly</b><span>' + esc(ptext) + '</span></span><span class="meta">' + t('now') + '</span></button>' : '';
    const toast = this.toastMsg ? '<div class="toast" role="status" data-k="t' + this.toastK + '" data-ov="toast">' + L.I('check', 16, 2.4) + esc(this.toastMsg) + '</div>' : '';
    const tone = (bdef.noir ? ' noir' : '') + (bdef.dark ? ' dark' : '');
    this.scr.className = 'scr' + tone; this.scr.dataset.screen = base.id; this.scr.dataset.role = this.role;

    this.seenK = new Set();
    const k = M.key(base);
    const pg = document.createElement('div'); pg.className = 'pg' + tone;
    // Bottom inset: 130pt clears a tab bar or floating action bar; a screen with neither keeps only the home-indicator inset,
    // and a full-bleed screen (bleed: true) none, so nothing scrolls past its content.
    const fx = fixed.join(''), bare = !bdef.tab && !/class="(abar|composer)|bottom:\s*\d/.test(fx);
    pg.innerHTML = '<main class="view' + (bdef.tab ? '' : ' notab') + (bdef.bleed ? ' bleed' : bare ? ' bare' : '') + '" aria-label="' + esc(t(bdef.name)) + '">' + body + '</main>' + fx + tabHtml;
    M.page(this, pg, nav, k);
    this.pg = pg; this.pgEntry = base;
    M.overlays(this, off + sheetsHtml + push + toast);
    M.moments(this, this.scr, k);
    this.bornAt.forEach((_, key) => { if (!this.seenK.has(key)) this.bornAt.delete(key); });
    Object.keys(this.pending).forEach((key) => { if (!this.push || key !== 'p' + this.push.id) delete this.pending[key]; });

    const v2 = pg.querySelector('.view'); if (v2) v2.scrollTop = base.scroll || 0;
    const sh2 = this.ovl.querySelectorAll('.sheet'); if (sh2.length && this.sheets.length) sh2[sh2.length - 1].scrollTop = this.sheets[this.sheets.length - 1].scroll || 0;
    // Wheels come back at their value; a tap on a row (or a roll-back to the minimum) glides there, as on iOS.
    this.ovl.querySelectorAll(':scope > .sheet[data-k] .wheel').forEach((w) => {
      const to = +w.dataset.idx * L.wheelH, from = wheelAt[w.closest('.sheet').dataset.k + w.dataset.wcol];
      if (from != null && Math.abs(from - to) > 1 && M.on() && !M.rm()) { w.scrollTop = from; w.scrollTo({ top: to, behavior: 'smooth' }); } else w.scrollTop = to;
    });
    if (focus && focus.wcol) { const w = this.ovl.querySelector('.wheel[data-wcol="' + focus.wcol + '"]'); if (w) w.focus({ preventScroll: true }); focus = null; }
    if (focus) { const el = this.mount.querySelector('.ovl [data-bind="' + focus.bind + '"]') || pg.querySelector('[data-bind="' + focus.bind + '"]'); if (el) { el.focus(); try { el.setSelectionRange(focus.s, focus.e); } catch (_) {} } }
    if (this.cap) this.cap();
  };
  Phone.prototype.current = function () { return this.top().id; };
})();
