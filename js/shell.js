/* The desk around the phones: flows, scenarios, Lokaly ops, screen index, email outbox. */
(function () {
  const L = window.L, esc = L.esc, I = L.I;

  L.INVENTORY = {
    Shared: ['S-01', 'S-02', 'S-03', 'S-04', 'S-05', 'S-06', 'S-07', 'S-08', 'S-09', 'S-10', 'S-11', 'S-12', 'S-13', 'S-14', 'S-15', 'S-16', 'S-17', 'S-18', 'S-19', 'S-20', 'S-21', 'S-22'],
    Business: ['B-00'].concat(Array.from({ length: 36 }, (_, i) => 'B-' + String(i + 1).padStart(2, '0'))),
    Creator: ['C-00'].concat(Array.from({ length: 26 }, (_, i) => 'C-' + String(i + 1).padStart(2, '0'))),
    Emails: ['E-01', 'E-02', 'E-03', 'E-04', 'E-05', 'E-06', 'E-07', 'E-08']
  };
  const JUMP = {
    'S-10': { business: 'S-10:t2', creator: 'S-10:t3' }, 'S-11': { business: 'S-11:t2', creator: 'S-11:t3' }, 'S-12': { business: 'S-12:col2', creator: 'S-12:col10' },
    'S-13': { business: 'S-13:col1', creator: 'S-13:col10' }, 'S-14': { business: 'S-14:col1', creator: 'S-14:col10' }, 'S-19': 'S-19:view', 'S-20': 'S-20:error', 'S-22': { business: 'S-22:cr:cr2', creator: 'S-22:biz:b2' },
    'S-04': 'S-04:returning', 'B-08': 'B-08:cr1', 'B-09': 'B-09:cr2', 'B-10': 'B-10:cr2', 'B-12': 'B-12:cr6', 'B-20': 'B-20:k1', 'B-22': 'B-22:k1', 'B-23': 'B-23:k1', 'B-25': 'B-25:col9', 'B-27': 'B-27:col2', 'B-29': 'B-29:tx1',
    'C-08': 'C-08:b2', 'C-09': 'C-09:k1', 'C-10': 'C-10:k1', 'C-12': 'C-12:col12', 'C-13': 'C-13:col4', 'C-15': 'C-15:col10', 'C-16': 'C-16:col10', 'C-19': 'C-19:po1'
  };
  // What the phone shows underneath, so a jumped-to sheet or end state opens over its real parent, not over Home.
  const UNDER = {
    'S-11': { business: ['S-09', 'S-10:t2'], creator: ['S-09', 'S-10:t3'] }, 'S-22': { business: ['B-05', 'B-08:cr2'], creator: ['C-06', 'C-08:b2'] },
    'B-04': ['B-00'], 'B-06': ['B-05'], 'B-09': ['B-05', 'B-08:cr2'], 'B-10': ['B-05', 'B-08:cr2'], 'B-12': ['B-05', 'B-08:cr6'], 'B-24': ['B-00'], 'B-33': ['B-05', 'B-08:cr2', 'B-11'],
    'C-05': ['C-00'], 'C-07': ['C-06'], 'C-10': ['C-06', 'C-09:k1'], 'C-11': ['C-06', 'C-09:k1'], 'C-12': ['C-06'], 'C-15': ['C-14', 'S-12:col10'], 'C-16': ['C-14', 'S-12:col10'], 'C-22': ['C-06', 'C-21']
  };
  // A jump moves the world into the screen's real state first (A1, V6): the same changes the app itself would make.
  const member = () => { const b = L.W.bizMe; if (!b.membership || L.unlocksLeft() <= 0) Object.assign(b, L.memberSeed(L.W.now), { pending: null }); };
  const SETUP = {
    'B-04': () => { L.myBiz().meter = Object.assign({}, L.partialMeter.business); },
    'B-24': () => { L.myBiz().meter = Object.assign({}, L.partialMeter.business); },
    'C-05': () => { L.W.crMe.meter = Object.assign({}, L.partialMeter.creator); },
    'C-11': () => { L.W.crMe.meter = Object.assign({}, L.partialMeter.creator); },
    'B-09': (ph) => { member(); L.W.bizMe.unlocked = L.W.bizMe.unlocked.filter((c) => c !== 'cr2'); ph.pendingUnlock = 'cr2'; },
    'B-10': () => { member(); if (!L.isUnlocked('cr2')) { L.W.bizMe.membership.used++; L.W.bizMe.unlocked.push('cr2'); } },
    'B-33': (ph) => { member(); ph.pendingUnlock = 'cr2'; },
    'C-22': () => { L.W.crMe.plus = { renews: L.W.now + 30 * L.D }; L.W.crMe.pending = null; L.myCr().plus = true; },
    'C-12': () => {
      // Lucía applies to Sunset daybed reel (Casa Brisa), as C-10 → Send application does.
      if (L.col('col12')) return;
      const k = L.camp('k1'), me = L.myCr(), pitch = 'Golden hour on the Paseo is my whole feed. I would love to film your daybeds.';
      L.W.collabs.push({ id: 'col12', campaignId: k.id, creatorId: me.id, status: 'applied', pitch, visitDate: null, submission: null, submittedAt: null, history: [{ s: 'applied', at: L.W.now }] });
      L.W.crMe.appsUsed++;
      L.post(k.bizId, me.id, { from: 'sys', deal: 'application', collabId: 'col12' }, k.id);
      L.post(k.bizId, me.id, { from: 'cr', text: pitch }, k.id);
      L.notify('business', { icon: 'user', tone: 'sky', msg: '{name} applied to {title}', p: { name: { cr: me.id }, title: { camp: k.id } }, go: 'B-25:col12' });
    },
    'C-16': () => {
      // Lucía submits her paella post (visited yesterday), as C-15 → Submit for review does.
      const c = L.col('col10'); if (!c || c.status !== 'active') return;
      L.setStatus(c, 'submitted', { submittedAt: L.W.now, submission: { url: 'https://www.instagram.com/reel/C9paellaLucia/', shots: [L.img('restaurant')] }, reminded: false });
      L.post(L.camp(c.campaignId).bizId, c.creatorId, { from: 'sys', deal: 'submission', collabId: c.id }, c.campaignId);
    }
  };
  const phone = (role) => L.phones.find((p) => p.role === role);

  L.jump = function (id) {
    if (id.startsWith('E-')) { const e = L.W.emails.find((m) => m.id === id) || L.sampleEmail(id); L.openEmail(e); return; }
    const role = id.startsWith('B') ? 'business' : id.startsWith('C') ? 'creator' : (L.focusRole || 'business');
    const ph = phone(role);
    let spec = JUMP[id] ? (typeof JUMP[id] === 'string' ? JUMP[id] : JUMP[id][role]) : id;
    if (/^B-1[5-9]$/.test(id) && !ph.draft) { L.A.wizType(ph, id === 'B-19' ? 'experience' : 'paid'); const es = L.lang() === 'es'; Object.assign(ph.draft, { title: es ? 'Menú de invierno en la terraza' : 'Winter terrace menu', photos: [L.img('restaurant')], brief: es ? 'Nuestro menú de invierno en la terraza climatizada. Enseña las vistas y el primer plato.' : 'Our winter menu on the heated terrace. Show the view and the first course.', rate: 180, offer: es ? 'Cena para dos' : 'Dinner for two', value: 120 }); }
    if (SETUP[id] && !L.W.fresh) { SETUP[id](ph); L.applySeedLang(); }
    ph.sheets = [];
    const under = UNDER[id] && !L.W.fresh ? (Array.isArray(UNDER[id]) ? UNDER[id] : UNDER[id][role]) : null;
    if (under) {
      ph.stack = under.map((s) => { const i = s.indexOf(':'); return { id: i < 0 ? s : s.slice(0, i), arg: i < 0 ? undefined : s.slice(i + 1), f: {} }; });
      ph.nav = 'fade'; ph.go(spec);
    } else {
      const def = L.S[spec.split(':')[0]];
      if (def && def.tab && !def.sheet) ph.tab(spec.split(':')[0]); else ph.go(spec);
    }
    L.emit();
    L.setSolo(role);
  };

  /* ───────── tours (inventory §2 flows) ───────── */
  const T = (role, id, text) => ({ role, id, text });
  L.TOURS = [
    { id: 'core', name: 'Paid collab, end to end', ref: '§2.5 · the core loop', preset: 'demo', steps: [
      T('creator', 'C-09', 'Creator: Discover → open “Sunset daybed reel”'), T('creator', 'C-12', 'Creator: Apply with a short pitch'), T('business', 'B-25', 'Business: tap the push (or Home → Needs you) to open Lucía\'s application'),
      T('business', 'PAY', 'Business: Accept & fund €220 (Stripe sheet)'), T('creator', 'S-12', 'Creator: open the collab and set a visit date'), T('creator', 'C-16', 'Creator: Submit post → paste a sample link, add a screenshot'),
      T('business', 'B-27', 'Business: open the submission'), T('creator', 'C-18', 'Business approves → Creator: Profile → Earnings shows the payout')] },
    { id: 'c-onb', name: 'Creator onboarding', ref: '§2.1', preset: 'fresh', steps: [T('creator', 'S-03', 'Get started'), T('creator', 'C-01', 'Choose “I create content”'), T('creator', 'S-19', 'Sign in with Apple, Google or email'), T('creator', 'C-02', 'Accept terms + content rights'), T('creator', 'C-03', 'Name, private surname, username, photo'), T('creator', 'C-04', 'Niches & town'), T('creator', 'S-06', 'Connect Instagram / TikTok'), T('creator', 'S-07', 'Location primer'), T('creator', 'C-00', 'Push primer → Home with profile meter'), T('creator', 'C-11', 'Try to apply → profile gate')] },
    { id: 'b-onb', name: 'Business onboarding', ref: '§2.2', preset: 'fresh', steps: [T('business', 'S-03', 'Get started'), T('business', 'B-01', 'Choose “I run a business”'), T('business', 'B-02', 'Name & category'), T('business', 'B-03', 'Town'), T('business', 'S-19', 'Sign in (step 4)'), T('business', 'S-06', 'Accept terms'), T('business', 'S-07', 'Location primer'), T('business', 'B-00', 'Push primer → Home'), T('business', 'B-24', 'Tap Create → profile gate')] },
    { id: 'unlock', name: 'Discover → unlock handles', ref: '§2.3', preset: 'demo', steps: [T('business', 'B-05', 'Discover tab'), T('business', 'B-08', 'Open a creator'), T('business', 'B-11', 'Unlock handles → no membership → Noir paywall'), T('business', 'IAP', 'Continue with Premium'), T('business', 'B-33', 'Subscribe → admission'), T('business', 'B-09', 'Unlock now → confirm'), T('business', 'B-10', 'Handles unlocked (Noir)')] },
    { id: 'wizard', name: 'Create campaign wizard', ref: '§2.4', preset: 'demo', steps: [T('business', 'B-14', 'Create tab'), T('business', 'B-15', 'Paid'), T('business', 'B-16', 'Essentials (title, photo)'), T('business', 'B-17', 'Brief & deliverables'), T('business', 'B-18', 'Budget & timing'), T('business', 'B-20', 'Publish'), T('creator', 'C-06', 'Creator: Discover shows it under early access')] },
    { id: 'invite', name: 'Invite → accept → fund', ref: '§2.5 alt', preset: 'demo', steps: [T('business', 'B-08', 'Discover → open Lucía'), T('business', 'B-12', 'Invite → pick Daybed for two or Sunset daybed reel'), T('creator', 'C-13', 'Creator: tap the invite push'), T('business', 'B-25', 'Creator accepts → Business: fund to confirm'), T('creator', 'S-12', 'Creator: collab is active')] },
    { id: 'dispute', name: 'Cancel & dispute', ref: '§2.7', preset: 'demo', steps: [T('business', 'B-27', 'Business: Home → Review window → Clara\'s post'), T('business', 'S-13', 'Report a problem → Content not as briefed'), T('business', 'S-12', 'Funds frozen. Resolve it from Lokaly ops in this sidebar'), T('creator', 'S-14', 'Creator: Work → Mar de Olivos collab → Cancel collab')] },
    { id: 'exp', name: 'Experience campaign', ref: '§2.8', preset: 'demo', steps: [T('business', 'B-15', 'Create → Experience'), T('business', 'B-17', 'Essentials, brief'), T('business', 'B-18', 'Offer + value'), T('business', 'B-19', 'Pay €39.99 & publish'), T('business', 'B-20', 'Published (receipt E-02 in outbox)'), T('business', 'B-25', 'Home → New applicants → Sofía → Accept (no payment)')] },
    { id: 'plus', name: 'Creator Plus', ref: '§2.9', preset: 'demo', steps: [T('creator', 'C-06', 'Discover'), T('creator', 'C-21', 'Tap the early-access row → Noir paywall'), T('creator', 'IAP', 'Get Plus'), T('creator', 'C-22', 'Subscribe → admission'), T('creator', 'C-09', 'Apply to Rooftop opening night')] },
    { id: 'auto', name: '72h auto-release', ref: '§3 state machine', preset: 'demo', steps: [T('business', 'B-27', 'Business: open Clara\'s submission (61h left)'), T('business', 'S-12', 'Press “+72h” in the clock, then open the collab: auto-released')] }
  ];
  L.tour = null; L.tourSeen = { business: new Set(), creator: new Set() };
  L.startTour = function (id) {
    const t = L.TOURS.find((x) => x.id === id);
    L.reset(t.preset);
    if (id === 'unlock' && L.W.bizMe.membership) { Object.assign(L.W.bizMe, { membership: null, unlocked: [] }); L.emit(); } // §2.3 starts from a non-member
    L.tour = t; L.tourSeen = { business: new Set(), creator: new Set() };
    const first = t.steps[0].role; L.setSolo(first);
    if (id === 'dispute' || id === 'auto') { /* start on home */ }
    renderSide();
  };

  /* ───────── outbox modal ───────── */
  L.openEmail = function (e) {
    L.seen.add(e.id);
    const m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', 'Email ' + e.id);
    m.innerHTML = '<div class="modal-in">' + L.renderEmail(e) + '<div style="padding:0 32px 24px"><button type="button" class="btn dark sm" data-close-modal="1">Close</button></div></div>';
    m.addEventListener('click', (ev) => { if (ev.target === m || ev.target.closest('[data-close-modal]')) { m.remove(); renderSide(); } });
    document.body.appendChild(m); m.querySelector('[data-close-modal]').focus();
  };

  /* ───────── sidebar ───────── */
  const side = () => document.getElementById('side');
  L.setSolo = function (role) {
    L.focusRole = role; if (L.statusBar) L.statusBar(); const st = document.getElementById('stage'); st.classList.toggle('solo-business', role === 'business'); st.classList.toggle('solo-creator', role === 'creator');
    st.querySelectorAll('[data-solo]').forEach((b) => { const on = b.dataset.solo === role; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    renderSide();
  };
  const sbtn = (label, act, on, extra) => '<button type="button" class="sbtn' + (on ? ' on' : '') + '" data-side="' + act + '"' + (extra || '') + (on !== undefined ? ' aria-pressed="' + !!on + '"' : '') + '>' + label + '</button>';
  function renderSide() {
    const W = L.W; if (!W || !side()) return;
    const sc = W.scen;
    const all = [].concat(L.INVENTORY.Shared, L.INVENTORY.Business, L.INVENTORY.Creator, L.INVENTORY.Emails);
    const seen = all.filter((id) => L.seen.has(id)).length;
    const here = L.phones.map((p) => p.current());
    let h = '<div class="brand"><h1>Lokaly</h1><span>Clickable prototype · v1 · two phones, one world</span><button type="button" class="sbtn side-close" data-menu="close">Done</button></div>' +
      '<div class="sec side-phone"><h2>Phone</h2><div class="row2" role="group" aria-label="Show phone">' + sbtn('Business · Marta', 'solo:business', L.focusRole === 'business') + sbtn('Creator · Lucía', 'solo:creator', L.focusRole === 'creator') + '</div><span class="ops">Two-finger tap anywhere opens these controls.</span><span class="ops" id="diag" style="opacity:.6;font-size:11px"></span></div>';
    if (L.tour) {
      const t = L.tour; let cur = -1;
      const done = t.steps.map((s) => L.tourSeen[s.role].has(s.id));
      cur = done.indexOf(false);
      h += '<div class="sec tourbar"><div class="tour"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:14px">' + esc(t.name) + '</b>' + sbtn('End', 'endtour') + '</div><ol>' + t.steps.map((s, i) => '<li class="' + (done[i] ? 'done' : i === cur ? 'cur' : '') + '">' + esc(s.text) + (done[i] ? ' ✓' : '') + '</li>').join('') + '</ol>' + (cur < 0 ? '<b style="color:var(--ok);font-size:13px">Flow complete.</b>' : '') + '</div></div>';
    }
    h += '<div class="sec"><h2>World</h2><div class="sbtns">' + sbtn('Demo world', 'reset:demo') + sbtn('Fresh install', 'reset:fresh') + '</div>' +
      '<div class="ops" style="margin-top:10px"><span>App language (same as S-17) · ES is a draft pending native review</span><div class="row2" role="group" aria-label="App language">' + sbtn('English', 'lang:en', W.lang === 'en') + sbtn('Español', 'lang:es', W.lang === 'es') + '</div></div>' +
      '<div class="ops" style="margin-top:10px"><span>Open questions for Matt (terms, legal wording, price) · hide for clean demos</span><div class="row2">' + sbtn('Show open questions', 'oq', L.showOQ !== false) + '</div></div>' +
      '<div class="ops" style="margin-top:10px"><span>Prototype hints · the phone you are not holding is the "other demo phone"; sign-in accepts any 6 digits (000000 shows the error)</span></div>' +
      '<div class="ops" style="margin-top:10px"><div class="row2"><span class="clock">' + L.dt(W.now) + '</span></div><div class="row2">' + sbtn('+1h', 'adv:1') + sbtn('+24h', 'adv:24') + sbtn('+72h', 'adv:72') + '</div><span>Time drives the 72h auto-release, reminders and early access.</span></div></div>';
    h += '<div class="sec"><h2>Flows</h2>' + L.TOURS.map((t) => '<button type="button" class="flow" data-side="tour:' + t.id + '"><b>' + esc(t.name) + '</b><span>' + esc(t.ref) + ' · ' + (t.preset === 'fresh' ? 'fresh install' : 'demo world') + '</span></button>').join('') + '</div>';
    h += '<div class="sec"><h2>Scenarios</h2><div class="ops">' +
      '<span>Next card payment</span><div class="row2">' + ['ok', 'decline', '3ds'].map((v) => sbtn({ ok: 'Succeeds', decline: 'Declines', '3ds': '3-D Secure' }[v], 'scen:pay:' + v, sc.pay === v)).join('') + '</div>' +
      '<span>App Store purchase</span><div class="row2">' + ['ok', 'cancel', 'pending', 'fail'].map((v) => sbtn({ ok: 'Succeeds', cancel: 'Cancelled', pending: 'Ask to Buy', fail: 'Fails' }[v], 'scen:iap:' + v, sc.iap === v)).join('') + '</div>' +
      '<span>Instagram connect</span><div class="row2">' + ['pro', 'personal', 'cancel'].map((v) => sbtn({ pro: 'Professional', personal: 'Personal acct', cancel: 'Cancelled' }[v], 'scen:oauth:' + v, sc.oauth === v)).join('') + '</div>' +
      '<span>Stripe KYC</span><div class="row2">' + ['verified', 'action'].map((v) => sbtn({ verified: 'Verifies', action: 'Needs a document' }[v], 'scen:kyc:' + v, sc.kyc === v)).join('') + '</div>' +
      '<span>System</span><div class="row2">' + sbtn('Offline', 'offline', sc.offline) + sbtn('Force update', 'sys:update') + sbtn('Error screen', 'sys:error') + '</div>' +
      '<span>Creator payout account</span><div class="row2">' + ['none', 'review', 'action', 'verified'].map((v) => sbtn({ none: 'None', review: 'In review', action: 'Action', verified: 'Verified' }[v], 'payout:' + v, W.crMe.payout === v)).join('') + '</div>' +
      '<span>Creator profile</span><div class="row2">' + sbtn('Incomplete', 'crmeter:0', L.crMeter() < 100) + sbtn('Complete', 'crmeter:1', L.crMeter() === 100) + sbtn('Use all free applications', 'cap') + '</div>' +
      '<span>Casa Brisa membership</span><div class="row2">' + sbtn('None', 'member:0', !W.bizMe.membership) + sbtn('Premium · 29 of 30 left', 'member:1', !!W.bizMe.membership) + '</div>' +
      '</div></div>';
    const disp = W.collabs.filter((c) => c.status === 'disputed');
    h += '<div class="sec"><h2>Lokaly ops · disputes</h2><div class="ops">' + (disp.length ? disp.map((c) => { const k = L.camp(c.campaignId); return '<div style="border:1px solid var(--desk-line);border-radius:12px;padding:10px" class="ops"><b style="color:var(--desk-ink)">' + esc(L.cr(c.creatorId).first + ' × ' + L.biz(k.bizId).name) + '</b><span>' + esc(k.title + ' · ' + (c.disputeReason || '')) + '</span><div class="row2">' + sbtn('Release to creator', 'resolve:' + c.id + ':rel') + sbtn('Refund business', 'resolve:' + c.id + ':ref') + '</div></div>'; }).join('') : '<span>No open disputes. Report a problem from a collab to see Lokaly\'s manual handling here (stand-in for the future admin panel).</span>') + '</div></div>';
    h += '<div class="sec"><h2>Email outbox · ' + W.emails.length + '</h2>' + (W.emails.length ? W.emails.slice(0, 8).map((e, i) => '<button type="button" class="mail" data-side="mail:' + i + '"><b>' + e.id + ' · ' + esc(e.subject) + '</b><span>To ' + esc(e.to) + ' · ' + L.dt(e.at) + '</span></button>').join('') : '<span class="ops">Funding, releases, refunds, payouts and disputes send receipts here.</span>') + '</div>';
    h += '<div class="sec"><h2>Screen index</h2><div class="cov"><span class="num"><b>' + seen + '</b> / ' + all.length + ' seen</span><span class="cov-bar"><i style="width:' + (100 * seen / all.length) + '%"></i></span></div>' +
      Object.keys(L.INVENTORY).map((g) => '<div class="idx-g">' + g + '</div><div class="idx">' + L.INVENTORY[g].map((id) => {
        const name = id.startsWith('E-') ? L.EMAILS[id] : (L.S[id] ? L.S[id].name : '—');
        return '<button type="button" class="' + (L.seen.has(id) ? 'seen' : '') + (here.includes(id) ? ' here' : '') + '" data-side="jump:' + id + '"><i>' + id + '</i>' + esc(name) + '</button>';
      }).join('') + '</div>').join('') + '</div>';
    h += '<div class="sec"><h2>About</h2><p class="ops" style="margin:0">Screen IDs match SCREEN_INVENTORY.md. B-00 / C-00 are the Home tabs from the reference prototype. Placeholders in [brackets] wait on Matt (Plus price, legal text, dispute SLA). EN + draft ES: switch in S-02, S-17 or here; ES strings live in js/i18n/ and wait on the native reviewer.</p></div>';
    side().innerHTML = h;
    const dg = document.getElementById('diag');
    if (dg) { const pr = document.createElement('div'); pr.style.cssText = 'position:fixed;top:0;height:env(safe-area-inset-top)'; document.body.appendChild(pr);
      dg.textContent = 'Layout ' + screen.height + '/' + window.innerHeight + ' · top inset ' + pr.offsetHeight + ' · ' + (navigator.standalone ? 'home screen' : 'browser'); pr.remove(); }
  }
  L.renderSide = renderSide;
  L.listeners.push(renderSide);

  function onSide(e) {
    const b = e.target.closest('[data-side]'); if (!b) return;
    const [a, x, y] = b.dataset.side.split(':');
    const W = L.W;
    if (a === 'reset') { L.tour = null; L.reset(x); }
    else if (a === 'adv') L.advance(+x);
    else if (a === 'lang') { L.setLang(x); L.emit(); }
    else if (a === 'oq') { L.showOQ = L.showOQ === false; document.body.classList.toggle('hide-oq', !L.showOQ); renderSide(); }
    else if (a === 'tour') L.startTour(x);
    else if (a === 'endtour') { L.tour = null; renderSide(); }
    else if (a === 'scen') { W.scen[x] = y; renderSide(); }
    else if (a === 'offline') { W.scen.offline = !W.scen.offline; L.emit(); }
    else if (a === 'sys') { L.phones.forEach((p) => { p.sheets = []; p.go('S-20:' + x); }); }
    else if (a === 'payout') { W.crMe.payout = x; L.emit(); }
    else if (a === 'member') { Object.assign(W.bizMe, x === '1' ? L.memberSeed(W.now) : { membership: null, unlocked: [] }, { pending: null }); L.emit(); }
    else if (a === 'crmeter') { const m = W.crMe.meter; Object.keys(m).forEach((k) => (m[k] = x === '1')); if (x === '0') m.social = true; L.emit(); }
    else if (a === 'cap') { W.crMe.appsUsed = W.crMe.appsCap; W.crMe.plus = null; L.myCr().plus = false; L.emit(); }
    else if (a === 'resolve') {
      const col = L.col(x); const k = L.camp(col.campaignId); const b2 = L.biz(k.bizId); const cr = L.cr(col.creatorId);
      if (y === 'rel') { L.setStatus(col, 'resolved_released', { releaseReason: 'dispute' }); if (k.type === 'paid') { W.txns.unshift({ id: L.id('tx'), bizId: b2.id, kind: 'released', collabId: col.id, amount: L.payB(k.rate), at: W.now, ref: 'tr_' + W.seq + 'Lk' }); if (cr.id === W.crMe.id) W.payouts.unshift({ id: L.id('po'), creatorId: cr.id, collabId: col.id, gross: k.rate, net: L.netC(k.rate), status: 'pending', at: W.now + 2 * L.D, ref: 'po_' + W.seq + 'Lk' }); } }
      else { L.setStatus(col, 'resolved_refunded'); if (k.type === 'paid') { W.txns.unshift({ id: L.id('tx'), bizId: b2.id, kind: 'refunded', collabId: col.id, amount: L.payB(k.rate) - L.stripeCost(L.payB(k.rate)), at: W.now, ref: 're_' + W.seq + 'Lk' }); L.email('E-05', b2.name, 'Refund after review · {title}', { col: col.id }, { title: { camp: k.id } }); } }
      L.post(b2.id, cr.id, { from: 'sys', deal: 'resolved', collabId: col.id }, k.id);
      L.email('E-08', b2.name, 'Dispute resolved · {title}', { col: col.id }, { title: { camp: k.id } }); L.email('E-08', cr.first, 'Dispute resolved · {title}', { col: col.id }, { title: { camp: k.id } });
      ['business', 'creator'].forEach((r) => L.notify(r, { icon: 'shield', tone: 'mint', msg: 'Lokaly resolved the {title} collab', p: { title: { camp: k.id } }, go: 'S-12:' + col.id }));
      L.emit();
    }
    else if (a === 'mail') L.openEmail(W.emails[+x]);
    else if (a === 'jump') L.jump(x);
    else if (a === 'solo') { L.setSolo(x); renderSide(); }
    // On a phone the desk is a sheet over the app: close it once the action shows something in the app.
    if (/^(reset|tour|sys|jump|mail|adv|resolve|solo)$/.test(a)) setMenu(false);
  }
  const mobile = () => window.matchMedia('(max-width: 500px)').matches;
  function setMenu(open) {
    const d = document.querySelector('.desk'); if (!d || (open && !mobile())) return;
    d.classList.toggle('menu-open', !!open);
    const b = document.querySelector('[data-menu="open"]'); if (b) b.setAttribute('aria-expanded', !!open);
    if (open) { const c = side().querySelector('.side-close'); if (c) c.focus(); }
  }
  L.setMenu = setMenu;

  /* ───────── boot ───────── */
  function fit() {
    const st = document.getElementById('stage'); if (!st) return;
    if (mobile()) {
      document.documentElement.style.setProperty('--s', Math.min(1.2, window.innerWidth / 390).toFixed(4));
      return;
    }
    document.querySelector('.desk').classList.remove('menu-open');
    const narrow = window.innerWidth <= 1180;
    const availH = (narrow ? window.innerHeight * 0.92 : window.innerHeight) - 80;
    const availW = narrow ? window.innerWidth - 16 : (st.clientWidth - 90) / 2;
    const s = Math.max(0.5, Math.min(1, availH / 856, availW / 402));
    document.documentElement.style.setProperty('--s', s.toFixed(3));
  }
  window.addEventListener('DOMContentLoaded', () => {
    side().addEventListener('click', onSide);
    document.addEventListener('click', (e) => { const m = e.target.closest('[data-menu]'); if (m) setMenu(m.dataset.menu === 'open'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.querySelector('.desk.menu-open')) { setMenu(false); const b = document.querySelector('[data-menu="open"]'); if (b) b.focus(); } });
    document.getElementById('stage').addEventListener('click', (e) => { const b = e.target.closest('[data-solo]'); if (b) L.setSolo(b.dataset.solo); });
    const cap = (role) => () => {
      const p = phone(role); const id = p.current(); const d = L.S[id];
      const el = document.getElementById('cap-' + role);
      if (el) el.innerHTML = '<b>' + (role === 'business' ? 'Business · Marta, Casa Brisa' : 'Creator · Lucía') + '</b><span class="dev-id" title="' + esc(d ? d.name : '') + '">' + id + ' · ' + esc(d ? d.name : '') + '</span>';
      L.tourSeen[role].add(id); p.stack.forEach((s) => L.tourSeen[role].add(s.id)); p.sheets.forEach((s) => L.tourSeen[role].add(s.id));
    };
    new L.Phone('business', document.getElementById('ph-business'), cap('business'));
    new L.Phone('creator', document.getElementById('ph-creator'), cap('creator'));
    L.focusRole = 'business';
    const startTour = new URLSearchParams(location.search).get('tour');
    L.reset(new URLSearchParams(location.search).get('preset') === 'fresh' ? 'fresh' : 'demo');
    if (startTour) L.startTour(startTour);
    L.setSolo('business');
    fit(); window.addEventListener('resize', fit);
    if (document.documentElement.classList.contains('app')) {
      // No visible prototype chrome in the installed app: a two-finger tap opens the desk.
      document.addEventListener('touchstart', (e) => { if (e.touches.length === 2 && !document.querySelector('.desk.menu-open')) { e.preventDefault(); setMenu(true); } }, { passive: false });
      document.addEventListener('gesturestart', (e) => e.preventDefault());
      let seenHint = false; try { seenHint = localStorage.getItem('lk-app-hint') === '1'; localStorage.setItem('lk-app-hint', '1'); } catch (e) {}
      if (!seenHint) {
        const h = document.createElement('div'); h.className = 'app-hint'; h.textContent = 'Tap with two fingers for prototype controls';
        document.body.appendChild(h); setTimeout(() => { h.style.opacity = '0'; setTimeout(() => h.remove(), 500); }, 4500);
      }
    }
  });
})();
