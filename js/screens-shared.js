/* Shared screens S-01 … S-22 plus the Stripe PaymentSheet and the App Store subscription sheet. */
(function () {
  const L = window.L, C = L.C, I = L.I, esc = L.esc;
  const t = L.t;
  const S = (id, def) => { L.S[id] = def; };
  const home = (ph) => (ph.role === 'business' ? 'B-00' : 'C-00');

  /* ───────── S-01 Launch ───────── */
  S('S-01', { name: 'Launch', bleed: true, render:() => '<div style="height:844px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px"><span class="serif" style="font-size:56px;line-height:1">Lokaly</span><span class="meta">Costa del Sol</span></div>' });

  /* ───────── S-02 Welcome ───────── */
  S('S-02', { name: 'Welcome', dark: true, bleed: true, render:(x) => {
    const lang = x.w.lang;
    return '<div style="position:relative;height:844px;min-height:100%;color:#fff">' + C.ph(L.img('welcome'), 'position:absolute;inset:0;background-position:center top', t('An infinity pool above the Marbella coastline at golden hour')) +
      '<div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(rgba(18,24,33,.55) 0%,rgba(18,24,33,0) 22%,rgba(10,12,14,0) 30%,rgba(10,12,14,.75) 72%,rgba(10,12,14,.92))"></div>' +
      '<div style="position:absolute;top:58px;left:20px;right:20px;display:flex;justify-content:space-between;align-items:center"><span class="serif" style="font-size:28px">Lokaly</span>' +
      '<div class="seg" role="radiogroup" aria-label="' + esc(t('Language')) + '" style="background:rgba(255,255,255,.18);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)">' +
      ['en', 'es'].map((l) => '<button type="button" role="radio" aria-checked="' + (lang === l) + '" class="' + (lang === l ? 'on' : '') + '" data-act="setLang" data-arg="' + l + '" style="min-width:52px;' + (lang === l ? '' : 'color:#fff') + '">' + l.toUpperCase() + '</button>').join('') + '</div></div>' +
      '<div style="position:absolute;left:24px;right:24px;bottom:44px;display:flex;flex-direction:column;gap:14px">' +
      '<h1 class="lt xl" style="color:#fff">' + t('The coast,<br><i>as locals</i> post it.') + '</h1>' +
      '<p style="margin:0;font-size:16px;line-height:23px;color:rgba(255,255,255,.86)">' + t('Marbella businesses meet the creators who already love them. Payments held safely until the post is live.') + '</p>' +
      '<div class="stack g10 mt12">' + C.btn(t('Get started'), { kind: 'white', full: 1, go: 'S-03' }) + C.btn(t('I already have an account'), { kind: 'ghost', full: 1, go: 'S-04:returning', style: 'color:#fff' }) + '</div></div></div>';
  } });
  L.A.setLang = (ph, l) => { L.setLang(l); if (l === 'es') ph.toast(t('Español · draft copy pending native review')); };

  /* ───────── S-03 Role ───────── */
  // v2 role picker: two selectable rows (photo, promise, what it costs) and one Continue, instead of two tap-to-go photo cards.
  S('S-03', { name: 'Onboarding · Role', render: (x) => {
    const sel = x.f.role;
    const opt = (role, title, sub, perk, photo) => '<button type="button" class="card p hrow g14" role="radio" aria-checked="' + (sel === role) + '" data-set="role" data-val="' + role + '" style="width:100%;text-align:left;align-items:center;box-shadow:none;border:1.5px solid ' + (sel === role ? 'var(--ink)' : 'var(--border)') + '">' + C.ph(photo, 'width:76px;height:96px;border-radius:16px;flex-shrink:0;background-position:center 30%') +
      '<span class="grow stack g4"><b class="serif" style="font-size:25px;font-weight:400;line-height:27px">' + title + '</b><span class="sub" style="font-size:14px;line-height:19px">' + sub + '</span><span class="meta hrow" style="gap:4px">' + I('check', 13, 2.4) + perk + '</span></span><span class="radio' + (sel === role ? ' on' : '') + '"></span></button>';
    x.fix(C.top({ title: '' }));
    x.fix(C.abar({ btn: C.btn(t('Continue'), { kind: 'dark', full: 1, act: 'pickRole', arg: sel || '', dis: !sel }) }));
    return '<div class="pad top-pad stack g20" style="padding-top:110px">' + C.stepHead(1, t('Which side of the table are you on?'), null, t('Step {n} of {total}', { n: 1, total: 4 })) +
      '<div class="stack g12" role="radiogroup" aria-label="' + esc(t('Your role')) + '">' + opt('business', t('I run a business'), t('Find local creators for your venue'), t('First 2 campaigns free'), L.img('restaurant')) + opt('creator', t('I create content'), t('Get paid to post about places you love'), t('Free · keep 90% when you withdraw'), L.img('lucia')) + '</div></div>';
  } });
  L.A.pickRole = (ph, role) => {
    if (!role) return;
    if (role !== ph.role) { ph.toast(role === 'business' ? t('That flow runs on the business phone') : t('That flow runs on the creator phone')); return; }
    ph.ob.role = role;
    ph.go(role === 'business' ? 'B-01' : 'C-01');
  };

  /* ───────── S-04 Sign in ───────── */
  const signInBody = (x, ctx) => {
    const busy = x.ph.busy;
    const link = (label) => '<button type="button" class="link" data-go="S-19:view" style="min-height:0">' + label + '</button>';
    return '<div class="stack g12">' +
      C.btn(t('Continue with Apple'), { kind: 'apple', full: 1, act: 'authProvider', arg: ctx + '|apple', icon: I.apple(20), busy: busy === 'apple', busyLabel: t('Signing in…') }) +
      C.btn(t('Continue with Google'), { kind: 'google', full: 1, act: 'authProvider', arg: ctx + '|google', icon: I.google(20), busy: busy === 'google', busyLabel: t('Signing in…') }) +
      '<div class="hrow" style="margin:6px 0"><span class="grow" style="height:1px;background:var(--border)"></span><span class="meta">' + t('or with email') + '</span><span class="grow" style="height:1px;background:var(--border)"></span></div>' +
      C.field({ label: t('Email'), bind: 'o.email', value: x.ph.ob.email, ph: t('you@example.com'), type: 'email', auto: 'email', mode: 'email', live: 1 }) +
      C.btn(t('Email me a code'), { kind: 'dark', full: 1, act: 'authEmail', arg: ctx, dis: !/\S+@\S+\.\S+/.test(x.ph.ob.email || '') }) +
      (x.ph.ob.authErr ? C.banner('bad', 'alert', esc(x.ph.ob.authErr)) : '') +
      '<p class="meta center" style="margin:6px 0 0;line-height:18px">' + t('By continuing you agree to Lokaly\'s {terms} and {privacy}. No passwords, ever.', { terms: link(t('Terms')), privacy: link(t('Privacy Policy')) }) + '</p></div>';
  };
  L.signInBody = signInBody;
  S('S-04', { name: 'Sign in', render: (x) => {
    x.fix(C.top({}));
    const ret = x.arg === 'returning';
    return '<div class="pad top-pad stack g24" style="padding-top:120px"><div class="stack g8"><h1 class="lt">' + (ret ? t('Welcome back.') : t('Sign in')) + '</h1><p class="sub" style="margin:0">' + (ret ? (x.role === 'business' ? t('Pick how you signed up. We\'ll take you straight to your business.') : t('Pick how you signed up. We\'ll take you straight to your profile.')) : t('Create your account in one tap.')) + '</p></div>' + signInBody(x, x.arg || 'returning') + '</div>';
  } });
  L.A.authProvider = (ph, arg) => {
    const [ctx, prov] = arg.split('|');
    ph.busy = prov; ph.ob.method = prov; ph.ob.authErr = null;
    ph.later(800, () => { ph.busy = null; L.authNext(ph, ctx); });
  };
  L.A.authEmail = (ph, ctx) => { ph.ob.ctx = ctx; ph.go('S-05:' + ctx); };
  L.authNext = (ph, ctx) => {
    ph.sheets = [];
    if (ctx === 'returning') {
      const demo = L.seedDemo();
      if (ph.role === 'business') { Object.assign(L.myBiz(), demo.businesses.find((b) => b.id === 'b1')); Object.assign(L.W.bizMe, demo.bizMe); }
      else { Object.assign(L.myCr(), demo.creators.find((c) => c.id === 'cr1')); Object.assign(L.W.crMe, demo.crMe); }
      ph.go(home(ph), { root: 1 }); ph.toast(t('Signed in'));
      return;
    }
    ph.go('S-19:' + ctx);
  };

  /* ───────── S-05 Email code ───────── */
  S('S-05', { name: 'Email code', render: (x) => {
    x.fix(C.top({}));
    const code = x.ph.ob.code || '';
    const err = x.ph.ob.codeErr;
    const boxes = [0, 1, 2, 3, 4, 5].map((i) => '<span aria-hidden="true" style="height:60px;border-radius:14px;border:' + (i === code.length ? '2px solid var(--ink)' : '1px solid var(--border)') + ';background:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;font-variant-numeric:tabular-nums">' + esc(code[i] || '') + '</span>').join('');
    return '<div class="pad top-pad stack g20" style="padding-top:120px"><div class="stack g8"><h1 class="lt">' + t('Check your email') + '</h1><p class="sub" style="margin:0">' + t('We sent a 6-digit code to {email}.', { email: '<b style="color:var(--ink)">' + esc(x.ph.ob.email || t('your email')) + '</b>' }) + '</p></div>' +
      '<label style="position:relative;display:block"><span class="sr">' + t('6-digit code') + '</span><span class="otp">' + boxes + '</span><input data-bind="o.code" data-live="1" inputmode="numeric" autocomplete="one-time-code" maxlength="6" value="' + esc(code) + '" style="position:absolute;inset:0;opacity:0;font-size:16px" aria-label="' + esc(t('6-digit code')) + '"></label>' +
      (err ? '<p class="red" style="margin:0;font-weight:600;font-size:14px">' + t('That code didn\'t work or has expired. Try again or resend.') + '</p>' : '') +
      C.btn(x.ph.busy === 'code' ? '' : t('Verify'), { kind: 'dark', full: 1, act: 'verifyCode', dis: code.length !== 6, busy: x.ph.busy === 'code', busyLabel: t('Checking…') }) +
      '<div class="hrow between"><span class="meta num">' + t('Resend in {time}', { time: '0:28' }) + '</span><button type="button" class="link" data-back="1">' + t('Change email') + '</button></div></div>';
  } });
  L.A.verifyCode = (ph) => {
    if (ph.ob.code === '000000') { ph.ob.codeErr = true; ph.ob.code = ''; return; }
    ph.ob.codeErr = false; ph.busy = 'code';
    ph.later(600, () => { ph.busy = null; L.authNext(ph, ph.ob.ctx || ph.top().arg); });
  };

  /* ───────── S-06 Location primer ───────── */
  S('S-06', { name: 'Location primer', render: (x) => '<div style="position:relative;height:420px">' + C.ph(L.img('coast'), 'position:absolute;inset:0', t('Coastline map-like photo')) + '<div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(rgba(245,246,244,0) 40%,var(--ground))"></div>' +
    '<span style="position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:32px;background:rgba(255,255,255,.86);display:flex;align-items:center;justify-content:center;color:var(--ink)">' + I('pin', 28, 2) + '</span></div>' +
    '<div class="pad stack g16"><h1 class="lt">' + t('Show what\'s near you') + '</h1><p class="sub" style="margin:0">' + (x.role === 'business' ? t('Lokaly uses your location to sort creators by distance. We never show your exact location to anyone.') : t('Lokaly uses your location to sort campaigns by distance. We never show your exact location to anyone.')) + '</p>' +
    '<div class="stack g10 mt12">' + C.btn(t('Allow location'), { kind: 'dark', full: 1, act: 'perm', arg: 'location|granted' }) + C.btn(t('Not now'), { kind: 'ghost', full: 1, act: 'perm', arg: 'location|denied' }) + '</div></div>' });
  /* ───────── S-07 Push primer ───────── */
  S('S-07', { name: 'Notifications primer', render: (x) => {
    const ex = x.role === 'business'
      ? [t('{name} applied to {title}', { name: 'Lucía', title: t('Sunset daybed reel') }), t('Submission ready · {h}h to review', { h: 72 })]
      : [t('You\'re in · {amt} secured', { amt: L.eur(200) }), t('{biz} approved your post', { biz: 'Casa Brisa' })];
    return '<div class="pad stack g20" style="padding-top:150px"><div class="stack g10">' + ex.map((s, i) => '<div class="push" style="position:static;animation:none;opacity:' + (i ? '.7' : '1') + ';transform:scale(' + (i ? '.96' : '1') + ')"><span class="pi">L</span><span class="pt"><b>Lokaly</b><span>' + esc(s) + '</span></span><span class="meta">' + (i ? t('{h}h', { h: 2 }) : t('now')) + '</span></div>').join('') + '</div>' +
      '<h1 class="lt mt16">' + t('Know the moment it matters') + '</h1><p class="sub" style="margin:0">' + t('Applications, funding, submissions and payouts. One notification per event, never more.') + '</p>' +
      '<div class="stack g10 mt12">' + C.btn(t('Turn on notifications'), { kind: 'dark', full: 1, act: 'perm', arg: 'push|granted' }) + C.btn(t('Not now'), { kind: 'ghost', full: 1, act: 'perm', arg: 'push|denied' }) + '</div></div>';
  } });
  L.A.perm = (ph, arg) => {
    const [k, v] = arg.split('|');
    L.W.perms[ph.role][k] = v;
    if (ph.top().id === 'S-06' && ph.stack.length > 1 && ph.stack[0].id !== 'S-06' && ph.ob.fromSettings) { ph.back(); return; }
    if (k === 'location') ph.go('S-07');
    else {
      // v2: profiles are complete before entering the app, so onboarding ends on the required profile step until it's 100%.
      const done = (ph.role === 'business' ? L.bizMeter() : L.crMeter()) >= 100;
      ph.go(done ? home(ph) : ph.role === 'business' ? 'B-04' : 'C-05', { root: 1 });
      if (ph.role === 'business') L.W.bizMe.onboarded = true; else L.W.crMe.onboarded = true; L.W.fresh = false;
    }
  };
  L.A.profileDone = (ph) => ph.go(home(ph), { root: 1 });

  /* ───────── S-08 Notifications inbox ───────── */
  S('S-08', { name: 'Notifications', render: (x) => {
    const list = L.W.notifs[x.role];
    x.fix(C.top({ title: t('Notifications'), solid: 1, right: list.some((n) => !n.read) ? C.gbtn('check', { act: 'readAll', aria: t('Mark all read') }) : '' }));
    if (!list.length) return '<div style="padding-top:140px">' + C.empty({ icon: 'bell', title: t('Nothing yet'), body: x.role === 'business' ? t('We\'ll tell you when creators apply, post or need you.') : t('We\'ll tell you when businesses invite you, fund a collab or pay you.') }) + '</div>';
    // newest first, grouped by calendar day
    const sod = new Date(L.W.now).setHours(0, 0, 0, 0); const sorted = list.slice().sort((a, z) => z.at - a.at);
    const today = sorted.filter((n) => n.at >= sod), yday = sorted.filter((n) => n.at < sod && n.at >= sod - 24 * L.H), earlier = sorted.filter((n) => n.at < sod - 24 * L.H);
    const row = (n) => '<button type="button" class="row" data-row="n:' + n.id + '" data-act="openNotif" data-arg="' + n.id + '"><span class="ico ' + n.tone + '">' + I(n.icon, 18, 2) + '</span><span class="rt"><b style="font-weight:' + (n.read ? 500 : 600) + ';font-size:14.5px">' + esc(L.ntext(n)) + '</b><span>' + L.ago(n.at) + '</span></span>' + (n.read ? '' : '<span aria-label="' + esc(t('Unread')) + '" style="width:9px;height:9px;border-radius:5px;background:var(--detail);flex-shrink:0"></span>') + '</button>';
    return '<div class="pad stack g20" style="padding-top:116px">' + (today.length ? '<div class="stack g10"><h2 class="h2">' + t('Today') + '</h2>' + C.list(today.map(row)) + '</div>' : '') + (yday.length ? '<div class="stack g10"><h2 class="h2">' + t('Yesterday') + '</h2>' + C.list(yday.map(row)) + '</div>' : '') + (earlier.length ? '<div class="stack g10"><h2 class="h2">' + t('Earlier') + '</h2>' + C.list(earlier.map(row)) + '</div>' : '') + '</div>';
  } });
  L.A.readAll = (ph) => L.W.notifs[ph.role].forEach((n) => (n.read = true));
  L.A.openNotif = (ph, id) => { const n = L.W.notifs[ph.role].find((x) => x.id === id); n.read = true; if (n.go) ph.go(n.go); };

  /* ───────── S-09 Messages ───────── */
  const myThreads = (role) => L.W.threads.filter((th) => (role === 'business' ? th.bizId === L.W.bizMe.id : th.creatorId === L.W.crMe.id) && !L.W.blocked.includes(role === 'business' ? th.creatorId : th.bizId));
  const lastText = (th, role) => {
    const m = th.msgs[th.msgs.length - 1]; if (!m) return '';
    if (m.img) return t('Photo');
    if (m.deal) return dealTitle(m, role);
    return m.from === (role === 'business' ? 'biz' : 'cr') ? t('You: {text}', { text: m.text }) : m.text;
  };
  S('S-09', { name: 'Messages', tab: 'S-09', render: (x) => {
    const q = (x.f.q || '').toLowerCase();
    let ts = myThreads(x.role);
    if (q) ts = ts.filter((th) => (x.role === 'business' ? L.cr(th.creatorId).first : L.biz(th.bizId).name).toLowerCase().includes(q) || (L.camp(th.campaignId) || {}).title.toLowerCase().includes(q));
    const head = '<div class="pad top-pad stack g16"><div class="hrow between"><h1 class="lt">' + t('Messages') + '</h1>' + C.bell(x.role) + '</div><label class="search">' + I('search', 18, 2) + '<span class="sr">' + t('Search messages') + '</span><input data-bind="q" data-live="1" placeholder="' + esc(t('Search names or campaigns')) + '" value="' + esc(x.f.q || '') + '"></label></div>';
    if (!myThreads(x.role).length) return head + C.empty({ icon: 'chat', title: t('No conversations yet'), body: x.role === 'business' ? t('Message any creator from their profile. It\'s free.') : t('Apply to a campaign and the business can message you here.'), cta: C.btn(x.role === 'business' ? t('Find creators') : t('Find campaigns'), { kind: 'dark', sm: 1, tab: x.role === 'business' ? 'B-05' : 'C-06' }) });
    if (!ts.length) return head + C.empty({ icon: 'search', title: t('No matches'), body: t('No conversations match "{q}".', { q: x.f.q }) });
    const rows = ts.map((th) => {
      const name = x.role === 'business' ? L.cr(th.creatorId).first : L.biz(th.bizId).name;
      const av = x.role === 'business' ? C.av(L.cr(th.creatorId).photo, 50) : C.logo(L.biz(th.bizId), 50);
      const un = th.unread[x.role]; const last = th.msgs[th.msgs.length - 1];
      return '<button type="button" class="row" data-go="S-10:' + th.id + '" style="min-height:72px">' + av + '<span class="rt"><span class="hrow between"><b>' + esc(name) + '</b><span class="meta">' + (last ? L.ago(last.at) : '') + '</span></span><span class="ell" style="' + (un ? 'color:var(--ink);font-weight:600' : '') + '">' + esc(lastText(th, x.role)) + '</span><span class="hrow" style="gap:6px;margin-top:4px">' + C.pill((L.camp(th.campaignId) || {}).title || t('General'), 'grey') + '</span></span>' + (un ? '<span class="cnt" aria-label="' + esc(t('{n} unread', { n: un })) + '">' + un + '</span>' : '') + '</button>';
    });
    return head + '<div class="pad mt16">' + C.list(rows) + '</div>';
  } });

  /* ───────── S-10 Chat thread ───────── */
  function dealTitle(m, role) {
    const col = L.col(m.collabId); if (!col) return '';
    const k = L.camp(col.campaignId), cr = L.cr(col.creatorId), b = L.biz(k.bizId);
    const paid = k.type === 'paid';
    switch (m.deal) {
      case 'application': return t('{name} applied to {title}', { name: cr.first, title: k.title });
      case 'invite': return role === 'business' ? t('{biz} invited {name} to {title}', { biz: b.name, name: cr.first, title: k.title }) : t('{biz} invited you to {title}', { biz: b.name, title: k.title });
      case 'accepted': return paid ? t('Invite accepted · waiting for funding') : t('Invite accepted · waiting for confirmation');
      case 'funded': return paid ? (role === 'business' ? t('Accepted & funded · {amt} held', { amt: L.eur(L.payB(k.rate)) }) : t('You\'re in · {amt} secured', { amt: L.eur(L.netC(k.rate)) })) : t('Accepted · no payment held');
      case 'visit': return t('Visit set · {dt}', { dt: col.visitDate ? L.dt(col.visitDate) : '' });
      case 'submission': return t('Post submitted · {h}h review', { h: 72 });
      case 'released': return paid ? t('Approved · {amt} released', { amt: L.eur(role === 'business' ? L.payB(k.rate) : L.netC(k.rate)) }) : t('Marked complete');
      case 'auto': return paid ? t('Auto-released after {h}h', { h: 72 }) : t('Completed after {h}h', { h: 72 });
      case 'cancelled': return t('Collab cancelled');
      case 'disputed': return t('Problem reported · funds frozen');
      case 'resolved': return t('Lokaly resolved this collab');
      case 'declined': return t('Not selected this time');
      case 'withdrawn': return t('Application withdrawn');
    }
    return m.deal;
  }
  const dealCard = (m, role) => {
    const col = L.col(m.collabId); if (!col) return '';
    const k = L.camp(col.campaignId);
    const label = { application: 'Application', invite: 'Invite', accepted: 'Accepted', funded: k.type === 'paid' ? 'Funded' : 'Accepted', visit: 'Visit date', submission: 'Submission', released: 'Released', auto: 'Auto-released', cancelled: 'Cancelled', disputed: 'Problem reported', resolved: 'Resolved', declined: 'Update', withdrawn: 'Update' }[m.deal];
    const tone = { funded: 'peach', released: 'ok', auto: 'ok', submission: 'lilac', disputed: 'red', cancelled: 'grey', visit: 'sky' }[m.deal] || 'sky';
    let cta = 'View collab', go = 'S-12:' + col.id;
    if (role === 'business' && m.deal === 'application' && col.status === 'applied') { cta = 'Review application'; go = 'B-25:' + col.id; }
    if (role === 'business' && m.deal === 'submission' && col.status === 'submitted') { cta = 'Review post'; go = 'B-27:' + col.id; }
    if (role === 'creator' && m.deal === 'invite' && col.status === 'invited') { cta = 'Respond'; go = 'C-13:' + col.id; }
    return '<button type="button" class="deal" data-go="' + go + '"><span class="dh">' + C.pill(label ? t(label) : label, tone) + '<span class="grow"></span><span class="meta" style="text-transform:none;letter-spacing:0;font-weight:500">' + L.time(m.at) + '</span></span><b>' + esc(dealTitle(m, role)) + '</b><span class="meta">' + esc(k.title) + ' · ' + (k.type === 'paid' ? t('{amt} rate', { amt: L.eur(k.rate) }) : t('Experience')) + '</span><span class="det" style="font-weight:600;font-size:14px">' + t(cta) + ' →</span></button>';
  };
  const PII = /(\+?\d[\d\s().-]{7,}\d)|([^\s@]+@[^\s@]+\.[a-z]{2,})|((^|\s)@[a-z0-9._]{3,})|((https?:\/\/|www\.)\S+)/i;
  S('S-10', { name: 'Chat', render: (x) => {
    const th = L.W.threads.find((y) => y.id === x.arg);
    if (!th) return C.empty({ icon: 'chat', title: t('Conversation not found'), body: '' });
    th.unread[x.role] = 0;
    const cr = L.cr(th.creatorId), b = L.biz(th.bizId);
    const shared = L.W.campaigns.filter((k) => k.bizId === b.id && L.W.collabs.some((c) => c.campaignId === k.id && c.creatorId === cr.id));
    const name = x.role === 'business' ? cr.first : b.name;
    const av = x.role === 'business' ? C.av(cr.photo, 36) : C.logo(b, 36);
    const curK = L.camp(th.campaignId);
    const col = curK ? L.W.collabs.find((c) => c.campaignId === curK.id && c.creatorId === cr.id) : null;
    // Collab context card. With one shared campaign the whole card opens the collab. With several, it splits in two:
    // a campaign row that opens the app list picker (writes th.campaignId via chatK), and the collab status row.
    x.f.k = th.campaignId;
    const ctxStyle = 'position:absolute;top:108px;left:12px;right:12px;z-index:19';
    const card = !col ? '' : shared.length > 1
      ? '<div class="ctxcard" style="' + ctxStyle + '"><button type="button" class="hrow ctx-k" data-act="pick" data-arg="' + esc(JSON.stringify({ bind: 'k', kind: 'list', label: t('Campaign'), opts: shared.map((k) => ({ v: k.id, label: k.title })), after: 'chatK' })) + '" aria-haspopup="dialog" aria-label="' + esc(t('Campaign') + ', ' + curK.title) + '">' + C.ph(curK.cover, 'width:36px;height:36px;border-radius:10px;flex-shrink:0') + '<b class="grow">' + esc(curK.title) + '</b>' + I('down', 16, 2) + '</button>' +
        '<button type="button" class="hrow ctx-s" data-go="S-12:' + col.id + '"><b class="grow ell">' + esc(x.role === 'business' ? C.nextB(col) : C.nextC(col)) + '</b>' + C.status(col.status, col.id) + I('chev', 16, 2) + '</button></div>'
      : '<div style="' + ctxStyle + '"><button type="button" class="hrow" data-go="S-12:' + col.id + '" style="width:100%;padding:10px 12px;border-radius:18px;background:rgba(255,255,255,.86);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border:1px solid var(--border)">' + C.ph(curK.cover, 'width:36px;height:36px;border-radius:10px;flex-shrink:0') + '<span class="stack grow" style="min-width:0;text-align:left"><span class="meta ell">' + esc(curK.title) + '</span><b style="font-size:13.5px" class="ell">' + esc(x.role === 'business' ? C.nextB(col) : C.nextC(col)) + '</b></span>' + C.status(col.status, col.id) + '</button></div>';
    const right = C.gbtn('more', { go: 'S-22:' + (x.role === 'business' ? 'cr:' + cr.id : 'biz:' + b.id), aria: t('More options') });
    x.fix('<div class="topbar solid">' + C.gbtn('back', { back: 1, aria: t('Back') }) + '<button type="button" class="hrow grow" style="gap:10px;min-height:44px" data-go="' + (x.role === 'business' ? 'B-08:' + cr.id : 'C-08:' + b.id) + '" aria-label="' + t('Open {name} profile', { name: esc(name) }) + '">' + av + '<span class="stack" style="min-width:0"><b style="font-size:16px">' + esc(name) + '</b></span></button>' + right + '</div>' +
      card);
    const me = x.role === 'business' ? 'biz' : 'cr';
    let html = '<div class="chat" style="padding-top:' + (col ? (shared.length > 1 ? 220 : 178) : 120) + 'px;padding-bottom:' + (x.f.warn ? 150 : 90) + 'px">';
    let lastDay = '';
    th.msgs.forEach((m, mi) => {
      const rk = ' data-row="m:' + th.id + ':' + mi + '"';
      const day = L.date(m.at); if (day !== lastDay) { html += '<span class="bub-t">' + day + '</span>'; lastDay = day; }
      if (m.deal) html += dealCard(m, x.role).replace('<button type="button" class="deal"', '<button type="button" class="deal"' + rk);
      else if (m.img) html += '<button type="button" class="bub img' + (m.from === me ? ' me' : '') + '"' + rk + ' data-go="S-11:view:' + m.img + '" aria-label="' + esc(t('Open photo')) + '">' + C.ph(m.img) + '</button>';
      else html += '<div class="bub' + (m.from === me ? ' me' : '') + '"' + rk + '>' + esc(m.text) + '</div>';
      if (m.failed) html += '<button type="button" class="bub-fail" data-act="retryMsg" data-arg="' + th.id + '">' + t('Not delivered · Tap to retry') + '</button>';
    });
    if (!th.msgs.length) html += C.empty({ icon: 'chat', title: t('Say hello'), body: x.role === 'business' ? t('Try: "Hi {name}, would you like to film our sunset menu?"', { name: cr.first }) : t('Introduce yourself and suggest a visit time.') });
    html += '</div>';
    const draft = x.f.msg || '';
    const warn = x.f.warn ? '<div class="warn" role="alert"><b>' + t('Keep it on Lokaly') + '</b><span>' + t('Payments are only protected when you agree things here. Sharing phone numbers, emails or handles is discouraged.') + '</span><div class="hrow">' + C.btn(t('Edit'), { kind: 'sec', sm: 1, act: 'warnEdit' }) + C.btn(t('Send anyway'), { kind: 'dark', sm: 1, act: 'sendMsg', arg: th.id + '|force' }) + '</div></div>' : '';
    x.fix('<div class="composer">' + warn + '<div class="comp-row">' + C.gbtn('image', { go: 'S-11:' + th.id, aria: t('Attach a photo') }) + '<label class="comp-in"><span class="sr">' + t('Message') + '</span><input data-bind="msg" data-enter="sendMsg" data-arg="' + th.id + '" placeholder="' + t('Message {name}', { name: esc(name) }) + '" value="' + esc(draft) + '"><button type="button" class="send" data-act="sendMsg" data-arg="' + th.id + '" aria-label="' + esc(t('Send')) + '">' + I('send', 18, 2.4) + '</button></label></div></div>');
    return html;
  } });
  // The S-10 campaign picker writes the page's f.k; this moves the thread onto that campaign.
  L.A.chatK = (ph) => { const e = ph.top(); const th = L.W.threads.find((y) => y.id === e.arg); if (th && e.f.k) th.campaignId = e.f.k; };
  L.A.warnEdit = (ph) => { ph.top().f.warn = false; };
  L.A.sendMsg = (ph, arg) => {
    const [tid, force] = (arg || '').split('|');
    const f = ph.top().f; const text = (f.msg || '').trim(); if (!text) return;
    if (!force && PII.test(text)) { f.warn = true; return; }
    const th = L.W.threads.find((y) => y.id === tid);
    const from = ph.role === 'business' ? 'biz' : 'cr';
    const msg = { from, text, at: L.W.now };
    if (L.W.scen.offline) msg.failed = true;
    th.msgs.push(msg); f.msg = ''; f.warn = false;
    if (!msg.failed) { th.unread[ph.role === 'business' ? 'creator' : 'business']++; notifyMsg(ph, th); }
  };
  const notifyMsg = (ph, th) => {
    const other = ph.role === 'business' ? 'creator' : 'business';
    const n = th.unread[other];
    const name = ph.role === 'business' ? { biz: th.bizId } : { cr: th.creatorId };
    const existing = L.W.notifs[other].find((y) => y.thread === th.id && !y.read);
    if (existing) { L.setNotifText(existing, '{n} new messages from {name}', { n, name }); existing.at = L.W.now; L.W.notifs[other] = [existing].concat(L.W.notifs[other].filter((y) => y !== existing)); L.phones.filter((p) => p.role === other).forEach((p) => p.showPush(existing)); }
    else L.notify(other, { icon: 'chat', tone: 'sky', cat: 'messages', thread: th.id, msg: 'New message from {name}', p: { name }, go: 'S-10:' + th.id });
  };
  L.A.retryMsg = (ph, tid) => {
    if (L.W.scen.offline) { ph.toast(t('Still offline')); return; }
    const th = L.W.threads.find((y) => y.id === tid); th.msgs.forEach((m) => { if (m.failed) { m.failed = false; th.unread[ph.role === 'business' ? 'creator' : 'business']++; } }); notifyMsg(ph, th);
  };

  /* ───────── S-11 Attach sheet / image viewer ───────── */
  S('S-11', { name: 'Photo picker & viewer', sheet: true, full: false, render: (x) => {
    if (x.arg && x.arg.startsWith('view:')) {
      const src = x.arg.slice(5);
      return C.sheetHead(t('Photo')) + C.ph(src, 'height:420px;border-radius:24px;background-size:contain;background-repeat:no-repeat;background-color:#0E0F11', t('Shared photo')) + '<div class="hrow mt16">' + C.btn(t('Done'), { kind: 'dark', full: 1, close: 1 }) + '</div>';
    }
    const pics = ['coast', 'brunch', 'restaurant', 'spa', 'fitness', 'fashion', 'nightlife', 'lucia'].map(L.img);
    return C.sheetHead(t('Send a photo')) + '<div class="hrow g8" style="margin-bottom:14px">' + C.btn(t('Camera'), { kind: 'sec', sm: 1, icon: I('camera', 18, 2), act: 'attachCamera' }) + C.btn(t('All photos'), { kind: 'sec', sm: 1, icon: I('image', 18, 2), act: 'attachCamera' }) + '</div>' +
      '<div class="thumbs" style="grid-template-columns:repeat(3,1fr)">' + pics.map((p) => '<button type="button" class="ph" data-act="sendImg" data-arg="' + x.arg + '|' + p + '" aria-label="' + esc(t('Send this photo')) + '" style="background-image:url(' + p + ')"></button>').join('') + '</div>' +
      '<p class="meta mt12">' + t('Lokaly asks for photo access the first time. Images are compressed before upload.') + '</p>';
  } });
  L.A.attachCamera = (ph) => ph.toast(t('Camera opens here on device'));
  L.A.sendImg = (ph, arg) => {
    const [tid, src] = arg.split('|');
    const th = L.W.threads.find((y) => y.id === tid);
    th.msgs.push({ from: ph.role === 'business' ? 'biz' : 'cr', img: src, at: L.W.now });
    th.unread[ph.role === 'business' ? 'creator' : 'business']++; ph.sheets = []; notifyMsg(ph, th);
  };

  /* ───────── S-12 Collab workspace ───────── */
  S('S-12', { name: 'Collab workspace', render: (x) => {
    const col = L.col(x.arg); const k = L.camp(col.campaignId), b = L.biz(k.bizId), cr = L.cr(col.creatorId);
    const paid = k.type === 'paid', biz = x.role === 'business';
    const th = L.threadFor(b.id, cr.id);
    x.fix(C.top({ title: t('Collab'), solid: 1, right: th ? C.gbtn('chat', { go: 'S-10:' + th.id, aria: t('Open chat') }) : '' }));
    let html = '<div class="pad stack g20" style="padding-top:116px">';
    html += '<div class="stack g12"><div class="hrow" style="gap:0">' + C.av(cr.photo, 52, cr.first) + '<span style="margin-left:-10px;border:3px solid var(--ground);border-radius:50%">' + C.logo(b, 52) + '</span><span class="grow"></span>' + C.status(col.status, col.id) + '</div>' +
      '<div class="stack g4"><h1 class="lt" style="font-size:34px;line-height:36px">' + esc(cr.first) + ' × ' + esc(b.name) + '</h1><span class="sub">' + esc(k.title) + ' · ' + (paid ? t('Paid') : t('Experience')) + '</span></div></div>';

    // contextual banner
    if (col.status === 'submitted') html += '<div class="tile lilac wide" style="cursor:default"><span class="tl">' + t('Review window') + '</span><span class="tv">' + L.hoursLeft(col) + '<small>h</small></span><span class="ts">' + (biz ? t('left to review, then it releases automatically') : paid ? t('until {amt} releases unless {biz} reports a problem', { amt: L.eur(L.netC(k.rate)), biz: b.name }) : t('until it completes unless {biz} reports a problem', { biz: b.name })) + '</span></div>';
    if (col.status === 'disputed') html += C.banner('bad', 'alert', t('<b>Lokaly is reviewing this collab.</b><br>Funds are frozen and the {h}h timer is paused. We\'ll contact both sides within [X] business days.', { h: 72 }));
    if (col.status === 'completed' || col.status === 'resolved_released') html += C.banner('ok', 'check', '<b>' + (paid ? (biz ? t('{amt} released to {name}.', { amt: L.eur(L.netC(k.rate)), name: cr.first }) : t('{amt} is in your wallet.', { amt: L.eur(L.netC(k.rate)) })) : t('Collab complete.')) + '</b><br>' + t('A {pair} card now shows on both profiles.', { pair: esc(cr.first) + ' × ' + esc(b.name) }));

    html += '<div class="card p stack g12"><h2 class="h2">' + t('Status') + '</h2>' + C.timeline(col) + '</div>';

    // money
    if (paid) {
      // v2: no Lokaly fee on the collab. Business: the rate with its IVA; creator: the full rate goes to the wallet.
      const lines = biz ? [[t('Creator rate'), L.eur(k.rate, 2)], [t('Of which IVA 21%'), L.eur(L.iva(k.rate), 2)], [col.status === 'cancelled' || col.status === 'resolved_refunded' ? t('Refunded to you') : t('You pay'), L.eur(L.payB(k.rate), 2), 1]] : [[t('Rate'), L.eur(k.rate, 2)], [t('To your wallet'), L.eur(L.netC(k.rate), 2), 1]];
      html += '<div class="card p stack g12"><div class="hrow between"><h2 class="h2">' + t('Payment') + '</h2>' + C.pill(t('Protected by Stripe'), 'peach', 'shield') + '</div>' + (['applied', 'invited', 'awaiting'].includes(col.status) ? C.banner('grey', 'clock', biz ? t('Nothing is charged until you accept and fund.') : t('The business funds when they accept you. Then it\'s held for you.')) : C.escrow(col)) + C.money(lines) + (biz ? '' : '<span class="meta">' + t('Lokaly takes 10% only when you withdraw.') + '</span>') + '</div>';
    } else {
      html += '<div class="card p stack g8"><div class="hrow between"><h2 class="h2">' + t('The offer') + '</h2>' + C.pill(t('No payment held'), 'grey') + '</div><b style="font-size:16px">' + esc(k.offer) + '</b><span class="meta">' + t('Estimated value {amt} · no fee', { amt: L.eur(k.value) }) + '</span></div>';
    }

    // visit date
    if (['active', 'submitted', 'completed', 'disputed'].includes(col.status)) {
      const editable = col.status === 'active';
      const v = x.f.visit !== undefined ? x.f.visit : col.visitDate ? L.toLocalInput(col.visitDate) : '';
      html += '<div class="card p stack g10"><div class="hrow between"><h2 class="h2">' + t('Visit') + '</h2>' + (col.visitDate ? C.pill(L.dt(col.visitDate), 'sky', 'cal') : C.pill(t('Not set'), 'grey')) + '</div>' +
        (editable ? '<p class="meta" style="margin:0">' + t('Agree a time in chat, then either of you sets it here.') + '</p>' + C.list([C.pick({ label: t('Date and time'), bind: 'visit', kind: 'datetime', value: v, min: L.toLocalInput(L.W.now) })], 'inset') + C.btn(col.visitDate ? t('Update visit') : t('Save visit'), { kind: 'sec', full: 1, act: 'saveVisit', arg: col.id, dis: !v || v === (col.visitDate ? L.toLocalInput(col.visitDate) : '') }) : '') + '</div>';
    }

    // submission
    if (col.submission) {
      html += '<div class="card p stack g12"><div class="hrow between"><h2 class="h2">' + t('Submission') + '</h2><span class="meta">' + L.dt(col.submittedAt) + '</span></div><button type="button" class="row" data-act="openUrl" data-arg="' + esc(col.submission.url) + '" style="padding:4px 0;min-height:48px"><span class="ico grey">' + I('link', 18, 2) + '</span><span class="rt"><b class="ell" style="font-size:14px">' + esc(col.submission.url.replace('https://www.', '')) + '</b><span>' + t('Opens in Instagram') + '</span></span>' + I('ext', 16, 2) + '</button>' +
        '<div class="thumbs">' + col.submission.shots.map((s) => '<button type="button" class="ph" data-go="S-11:view:' + s + '" aria-label="' + esc(t('Open screenshot')) + '" style="background-image:url(' + s + ')"></button>').join('') + '</div></div>';
    }

    // deliverables
    html += '<div class="card p stack g8"><h2 class="h2">' + t('Brief') + '</h2><span class="sub">' + esc(k.brief) + '</span><div class="chips wrap mt8">' + k.deliverables.map((d) => C.pill(t('{n} × {platform} {format}', { n: d.count, platform: d.platform, format: t(d.format) }), 'sand')).join('') + '</div><span class="meta">' + t('Must include: {x}', { x: esc(k.mustInclude) }) + '</span></div>';

    // secondary actions
    const sec = [];
    if (['awaiting', 'active'].includes(col.status)) sec.push(C.row({ icon: 'close', tone: 'grey', title: t('Cancel collab'), sub: biz ? (paid ? t('Refund minus non-refundable charges') : t('Free before submission')) : t('Before you submit only'), go: 'S-14:' + col.id }));
    if (['active', 'submitted'].includes(col.status) && (biz || col.status === 'active')) sec.push(C.row({ icon: 'flag', tone: 'red', title: t('Report a problem'), sub: biz ? t('No-show, content not as briefed…') : t('Business no-show or didn\'t honour the brief'), go: 'S-13:' + col.id }));
    if (col.status === 'submitted' && !biz) sec.push(C.row({ icon: 'help', tone: 'grey', title: t('Need help?'), sub: t('Cancelling isn\'t possible after you submit'), go: 'S-18' }));
    if (col.status === 'disputed') sec.push(C.row({ icon: 'help', tone: 'grey', title: t('Add information for Lokaly'), sub: t('Photos, messages, anything useful'), go: 'S-18' }));
    if (!biz && col.status === 'applied') sec.push(C.row({ icon: 'close', tone: 'grey', title: t('Withdraw application'), act: 'withdraw', arg: col.id, chev: false }));
    if (sec.length) html += C.list(sec);
    html += '</div>';

    // primary action bar
    let bar = '';
    if (biz) {
      if (col.status === 'applied') bar = C.abar({ title: paid ? L.eur(L.payB(k.rate)) : t('Experience'), sub: paid ? t('to accept & fund') : esc(k.offer), btn: C.btn(t('Review'), { go: 'B-25:' + col.id }) });
      if (col.status === 'awaiting') bar = C.abar({ title: paid ? L.eur(L.payB(k.rate)) : t('Confirm'), sub: t('{name} accepted your invite', { name: cr.first }), btn: C.btn(paid ? t('Fund now') : t('Confirm'), { go: 'B-25:' + col.id, kind: paid ? 'pri' : 'dark' }) });
      if (col.status === 'submitted') bar = C.abar({ title: t('{h}h left', { h: L.hoursLeft(col) }), sub: t('then it releases automatically'), btn: C.btn(t('Review post'), { go: 'B-27:' + col.id }) });
    } else {
      if (col.status === 'invited') bar = C.abar({ title: paid ? L.eur(L.netC(k.rate)) : t('Experience'), sub: paid ? t('You receive · invite from {biz}', { biz: esc(b.name) }) : t('Invite from {biz}', { biz: esc(b.name) }), btn: C.btn(t('Respond'), { go: 'C-13:' + col.id }) });
      if (col.status === 'active') bar = C.abar({ title: col.visitDate ? t('Visit {date}', { date: L.date(col.visitDate) }) : t('Set a visit date'), sub: t('Then post and submit'), btn: C.btn(t('Submit post'), { go: 'C-15:' + col.id }) });
    }
    if (bar) x.fix(bar);
    return html;
  } });
  L.A.openUrl = (ph) => ph.toast(t('Opens the post in Instagram'));
  L.A.saveVisit = (ph, id) => {
    const col = L.col(id); const v = ph.top().f.visit; if (!v) return;
    col.visitDate = new Date(v).getTime(); ph.top().f.visit = undefined;
    const k = L.camp(col.campaignId), b = L.biz(k.bizId), cr = L.cr(col.creatorId);
    L.post(b.id, cr.id, { from: 'sys', deal: 'visit', collabId: col.id }, k.id);
    if (ph.role === 'business') L.notify('creator', { icon: 'cal', tone: 'sky', msg: '{biz} set your visit · {dt}', p: { biz: { biz: b.id }, dt: { dt: col.visitDate } }, go: 'S-12:' + col.id });
    else L.notify('business', { icon: 'cal', tone: 'sky', msg: '{name} set the visit · {dt}', p: { name: { cr: cr.id }, dt: { dt: col.visitDate } }, go: 'S-12:' + col.id });
    ph.toast(t('Visit saved'));
  };
  L.A.withdraw = (ph, id) => {
    const col = L.col(id); L.setStatus(col, 'withdrawn');
    const k = L.camp(col.campaignId);
    L.post(k.bizId, col.creatorId, { from: 'sys', deal: 'withdrawn', collabId: col.id }, k.id);
    L.notify('business', { icon: 'user', tone: 'grey', msg: '{name} withdrew from {title}', p: { name: { cr: col.creatorId }, title: { camp: k.id } }, go: 'S-12:' + col.id });
    ph.toast(t('Application withdrawn'));
  };

  /* ───────── S-13 Report a problem ───────── */
  S('S-13', { name: 'Report a problem', render: (x) => {
    const col = L.col(x.arg); const biz = x.role === 'business';
    const reasons = biz ? ['No-show', 'Content not as briefed', 'Post removed', 'Other'] : ['Business no-show', 'Offer not honoured', 'Other'];
    x.fix(C.top({ title: t('Report a problem'), solid: 1 }));
    const r = x.f.reason;
    x.fix(C.abar({ btn: C.btn(t('Report & freeze funds'), { kind: 'dang', full: 1, act: 'dispute', arg: col.id, dis: !r }) }));
    return '<div class="pad stack g20" style="padding-top:116px"><p class="sub" style="margin:0">' + t('Reporting freezes the payment and pauses the {h}h timer. Lokaly reviews every report by hand.', { h: 72 }) + '</p>' +
      '<div class="list" role="radiogroup" aria-label="' + esc(t('Reason')) + '">' + reasons.map((v) => '<button type="button" class="row" role="radio" aria-checked="' + (r === v) + '" data-set="reason" data-val="' + v + '"><span class="rt"><b>' + t(v) + '</b></span><span class="radio' + (r === v ? ' on' : '') + '"></span></button>').join('') + '</div>' +
      C.field({ label: t('What happened?'), bind: 'note', value: x.f.note, textarea: 1, ph: t('Give Lokaly the details. Times, messages, anything useful.') }) +
      '<button type="button" class="upl" data-toggle="photo">' + (x.f.photo ? C.ph(L.img('restaurant'), 'width:80px;height:60px;border-radius:10px') + t('Photo added · tap to remove') : I('camera', 22, 2) + t('Add a photo (optional)')) + '</button></div>';
  } });
  L.A.dispute = (ph, id) => {
    const col = L.col(id); const reason = ph.top().f.reason; const k = L.camp(col.campaignId), b = L.biz(k.bizId), cr = L.cr(col.creatorId);
    L.setStatus(col, 'disputed', { disputeReason: reason, disputeBy: ph.role });
    L.post(b.id, cr.id, { from: 'sys', deal: 'disputed', collabId: col.id }, k.id);
    L.email('E-08', b.name, 'Dispute opened · {title}', { col: col.id, opened: true }, { title: { camp: k.id } }); L.email('E-08', cr.first, 'Dispute opened · {title}', { col: col.id, opened: true }, { title: { camp: k.id } });
    L.notify('business', { icon: 'alert', tone: 'red', msg: 'Lokaly is reviewing the {title} collab', p: { title: { camp: k.id } }, go: 'S-12:' + col.id });
    L.notify('creator', { icon: 'alert', tone: 'red', msg: 'Lokaly is reviewing the {title} collab', p: { title: { camp: k.id } }, go: 'S-12:' + col.id });
    ph.go('S-12:' + col.id, { replace: 1 }); ph.toast(t('Reported · funds frozen'));
  };

  /* ───────── S-14 Cancel collab ───────── */
  S('S-14', { name: 'Cancel collab', render: (x) => {
    const col = L.col(x.arg); const k = L.camp(col.campaignId), b = L.biz(k.bizId), cr = L.cr(col.creatorId); const biz = x.role === 'business';
    x.fix(C.top({ title: t('Cancel collab'), solid: 1 }));
    if (!['awaiting', 'active', 'invited', 'applied'].includes(col.status)) return '<div class="pad stack g16" style="padding-top:120px">' + C.empty({ icon: 'lock', title: t('Cancelling has closed'), body: t('Collabs can only be cancelled before the post is submitted. If something is wrong, report a problem and Lokaly will step in.'), cta: col.status === 'submitted' && biz ? C.btn(t('Report a problem'), { kind: 'dark', sm: 1, go: 'S-13:' + col.id }) : C.btn(t('Get help'), { kind: 'dark', sm: 1, go: 'S-18' }) }) + '</div>';
    const funded = col.history.some((h) => h.s === 'active') && k.type === 'paid';
    const lines = funded ? (biz ? [[t('Held for this collab'), L.eur(L.payB(k.rate), 2)], [t('Non-refundable charges'), '−' + L.eur(L.stripeCost(L.payB(k.rate)), 2)], [t('Refunded to your card'), L.eur(L.payB(k.rate) - L.stripeCost(L.payB(k.rate)), 2), 1]] : [[t('Your rate'), L.eur(k.rate, 2)], [t('You receive'), L.eur(0, 2), 1]]) : null;
    const r = x.f.reason;
    const what = biz
      ? (funded ? t('Non-refundable charges are the card processing costs, shown in one line. Refunds reach your card in 5–10 days. {name} is told straight away.', { name: cr.first }) : t('{name} is told straight away.', { name: cr.first }))
      : (funded ? t('{name} is refunded, minus non-refundable charges.', { name: b.name }) : t('{name} is told straight away.', { name: b.name }));
    x.fix(C.abar({ btn: C.btn(t('Cancel collab'), { kind: 'dang', full: 1, act: 'cancelCollab', arg: col.id, dis: !r }) }));
    return '<div class="pad stack g20" style="padding-top:116px"><h1 class="lt" style="font-size:32px;line-height:34px">' + t('Cancel with {name}?', { name: esc(biz ? cr.first : b.name) }) + '</h1>' +
      '<div class="card p stack g10"><b>' + t('What happens') + '</b>' + (lines ? C.money(lines) : '') + '<span class="sub">' + what + '</span></div>' +
      '<div class="stack g10"><b style="font-size:15px">' + t('Reason') + '</b><div class="chips wrap">' + (biz ? ['Plans changed', 'Creator unresponsive', 'Found another creator', 'Other'] : ['Can\'t make the visit', 'Unwell', 'Business unresponsive', 'Other']).map((v) => C.chip(t(v), { on: r === v, set: 'reason', val: v })).join('') + '</div></div></div>';
  } });
  L.A.cancelCollab = (ph, id) => {
    const col = L.col(id); const k = L.camp(col.campaignId), b = L.biz(k.bizId), cr = L.cr(col.creatorId);
    const funded = col.history.some((h) => h.s === 'active') && k.type === 'paid';
    L.setStatus(col, 'cancelled', { cancelBy: ph.role, cancelReason: ph.top().f.reason });
    if (funded) {
      const amt = L.payB(k.rate) - L.stripeCost(L.payB(k.rate));
      L.W.txns.unshift({ id: L.id('tx'), bizId: b.id, kind: 'refunded', collabId: col.id, amount: amt, at: L.W.now, ref: 're_' + L.W.seq + 'Lk' });
      L.email('E-05', b.name, 'Refund on its way · {amt}', { col: col.id, amount: amt }, { amt: { eur: amt, d: 2 } });
    }
    L.post(b.id, cr.id, { from: 'sys', deal: 'cancelled', collabId: col.id }, k.id);
    if (ph.role === 'business') L.notify('creator', { icon: 'close', tone: 'grey', msg: '{biz} cancelled {title}', p: { biz: { biz: b.id }, title: { camp: k.id } }, go: 'S-12:' + col.id });
    else L.notify('business', { icon: 'close', tone: 'grey', msg: funded ? '{name} cancelled {title} · refund on its way' : '{name} cancelled {title}', p: { name: { cr: cr.id }, title: { camp: k.id } }, go: 'S-12:' + col.id });
    ph.go('S-12:' + col.id, { replace: 1 }); ph.toast(t('Collab cancelled'));
  };

  /* ───────── S-15 Settings ───────── */
  S('S-15', { name: 'Settings', render: (x) => {
    x.fix(C.top({ title: t('Settings'), solid: 1 }));
    const p = L.W.perms[x.role];
    return '<div class="pad stack g16" style="padding-top:116px">' + C.list([
      C.row({ icon: 'globe', title: t('Language'), right: L.lang() === 'es' ? 'Español' : 'English', go: 'S-17' }),
      C.row({ icon: 'bell', title: t('Notifications'), right: p.push === 'granted' ? t('On') : t('Off'), go: 'S-16' }),
      C.row({ icon: 'pin', title: t('Location'), right: p.location === 'granted' ? t('While using') : t('Off'), act: 'locSetting' }),
      x.role === 'business' ? C.row({ icon: 'card', title: t('Payment methods'), go: 'B-31' }) : C.row({ icon: 'euro', title: t('Payout account'), right: t({ verified: 'Verified@@payout', review: 'In review', action: 'Action needed', none: 'Not set up' }[L.W.crMe.payout]), go: 'C-17' })
    ]) + C.list([C.row({ icon: 'doc', title: t('Terms & privacy'), go: 'S-19:view' }), C.row({ icon: 'help', title: t('Help'), go: 'S-18' })]) +
      C.list([C.row({ icon: 'logout', title: t('Sign out'), act: 'signOut', chev: false }), C.row({ icon: 'trash', tone: 'red', title: t('Delete account'), go: 'S-21', dang: 1 })]) + '<p class="meta center">' + t('Lokaly 1.0 (prototype) · EN/ES') + '</p></div>';
  } });
  L.A.locSetting = (ph) => { const p = L.W.perms[ph.role]; p.location = p.location === 'granted' ? 'denied' : 'granted'; ph.toast(p.location === 'granted' ? t('Location on') : t('Location off · distance filter hidden')); };
  L.A.signOut = (ph) => { ph.sheets = []; ph.stack = [{ id: 'S-02', f: {} }]; ph.ob = {}; ph.render(); };

  /* ───────── S-16 Notification prefs ───────── */
  S('S-16', { name: 'Notification settings', render: (x) => {
    x.fix(C.top({ title: t('Notifications'), solid: 1 }));
    const pr = L.W.prefs[x.role]; const denied = L.W.perms[x.role].push !== 'granted';
    const cats = [['collabs', t('Collabs'), t('Applications, invites, status changes')], ['messages', t('Messages'), t('New messages, bundled per chat')], ['payments', t('Payments'), x.role === 'business' ? t('Funding, releases, refunds') : t('Funding, releases, payouts')], ['marketing', t('News from Lokaly'), t('New features, local events')]];
    return '<div class="pad stack g20" style="padding-top:116px">' + (denied ? '<button type="button" class="banner warn2" data-act="perm2" style="width:100%;text-align:left">' + I('alert', 18, 2) + '<span>' + t('<b>Notifications are off for Lokaly.</b><br>Turn them on in iOS Settings to get pushes. Tap to open Settings.') + '</span></button>' : '') +
      '<div class="stack g10"><h2 class="h2">' + t('Push') + '</h2>' + C.list(cats.map((c) => C.togRow(c[1], c[2], pr.push[c[0]] && !denied, { act: 'pref', arg: 'push|' + c[0] }))) + '</div>' +
      '<div class="stack g10"><h2 class="h2">' + t('Email') + '</h2>' + C.list(cats.map((c) => c[0] === 'payments' ? C.togRow(c[1], t('Receipts and payouts are always emailed'), true, { lock: 1, act: 'prefLocked' }) : C.togRow(c[1], c[2], pr.email[c[0]], { act: 'pref', arg: 'email|' + c[0] }))) + '</div></div>';
  } });
  L.A.pref = (ph, arg) => { const [ch, k] = arg.split('|'); if (ch === 'push' && L.W.perms[ph.role].push !== 'granted') { ph.toast(t('Turn on notifications in iOS Settings first')); return; } const pr = L.W.prefs[ph.role][ch]; pr[k] = !pr[k]; };
  L.A.prefLocked = (ph) => ph.toast(t('Transactional emails can\'t be turned off'));
  L.A.perm2 = (ph) => { L.W.perms[ph.role].push = 'granted'; ph.toast(t('Notifications on')); };

  /* ───────── S-17 Language ───────── */
  S('S-17', { name: 'Language', render: (x) => {
    x.fix(C.top({ title: t('Language'), solid: 1 }));
    const cur = L.lang();
    // Language names are endonyms and stay untranslated.
    return '<div class="pad stack g16" style="padding-top:116px"><div class="list" role="radiogroup" aria-label="' + esc(t('Language')) + '">' + [['en', 'English'], ['es', 'Español']].map((l) => '<button type="button" class="row" role="radio" aria-checked="' + (cur === l[0]) + '" data-act="setLang" data-arg="' + l[0] + '"><span class="rt"><b>' + l[1] + '</b></span><span class="radio' + (cur === l[0] ? ' on' : '') + '"></span></button>').join('') + '</div>' +
      (cur === 'es' ? C.banner('info', 'globe', t('The Spanish copy is a draft, pending review by a native speaker before the design gate.')) : '<p class="meta">' + t('Applies instantly. Emails and notifications follow this setting.') + '</p>') + '</div>';
  } });

  /* ───────── S-18 Help ───────── */
  // [question, answer, params()] — answers keep money/percent/hours as params so they format per locale.
  const FAQ = {
    business: [
      ['When am I charged?', 'When you accept a creator, you fund their rate (IVA included). There are no Lokaly fees on collabs. Lokaly holds it until you approve the post, or {h} hours pass after submission.', () => ({ h: 72 })],
      ['What does the subscription include?', 'Your first {n} campaigns are free. After that, {price}/mo lets you post campaigns, browse every creator and send invites.', () => ({ n: L.FREE_CAMPAIGNS, price: L.eur(L.SUB_PRICE, 2) })],
      ['How many creators per campaign?', 'One. To work with more creators, post another campaign.'],
      ['Can I cancel?', 'Either side can cancel before the post is submitted. You\'re refunded, minus non-refundable charges.'],
      ['What if a creator doesn\'t show up?', 'Report a problem from the collab. Funds freeze and Lokaly reviews it by hand.']
    ],
    creator: [
      ['When do I get paid?', 'When the business approves your post, or automatically {h} hours after you submit, the full rate goes to your Lokaly wallet. Withdraw to your bank whenever you like.', () => ({ h: 72 })],
      ['What does Lokaly take?', '{pct} when you withdraw, nothing before. Withdraw {gross} and {net} lands in your bank.', () => ({ pct: L.pct(10), gross: L.eur(200), net: L.eur(180) })],
      ['Who sees my surname?', 'Nobody. Businesses see your first name and your social handles, and notifications only ever use your first name.'],
      ['Is there a limit on applications?', 'No. Apply to as many campaigns as you like.'],
      ['Can I cancel?', 'Yes, before you submit. After that, contact Lokaly via Help.']
    ]
  };
  S('S-18', { name: 'Help', render: (x) => {
    x.fix(C.top({ title: t('Help'), solid: 1 }));
    const open = x.f.open;
    return '<div class="pad stack g20" style="padding-top:116px"><h1 class="lt">' + t('How can we help?') + '</h1><div class="list">' + FAQ[x.role].map((q, i) => '<div><button type="button" class="row" data-set="open" data-val="' + (open === String(i) ? '' : i) + '" aria-expanded="' + (open === String(i)) + '"><span class="rt"><b>' + t(q[0]) + '</b></span>' + I(open === String(i) ? 'down' : 'chev', 16, 2) + '</button>' + (open === String(i) ? '<p class="sub" style="margin:0 0 14px">' + t(q[1], q[2] ? q[2]() : undefined) + '</p>' : '') + '</div>').join('') + '</div>' +
      '<div class="card p stack g10"><b>' + t('Still stuck?') + '</b><span class="sub">' + t('We reply within one business day, in English or Spanish.') + '</span>' + C.btn(t('Email Lokaly'), { kind: 'dark', full: 1, icon: I('mail', 18, 2), act: 'emailSupport' }) + '</div>' + C.list([C.row({ icon: 'doc', title: t('Fees, cancellations & disputes'), sub: t('The full terms'), go: 'S-19:view' })]) + '</div>';
  } });
  L.A.emailSupport = (ph) => ph.toast(t('Opens Mail to {email}', { email: 'support@lokaly.app' }));

  /* ───────── S-19 Legal & consent ───────── */
  S('S-19', { name: 'Terms & consent', render: (x) => {
    const view = x.arg === 'view';
    x.fix(C.top({ title: view ? t('Terms & privacy') : t('Before you start'), solid: 1 }));
    const f = x.f; const creator = x.role === 'creator';
    const ok = f.terms && (!creator || (f.rights && f.cterms));
    const ck = (key, title, sub, req) => '<button type="button" class="row" role="checkbox" aria-checked="' + !!f[key] + '" data-toggle="' + key + '"><span class="check' + (f[key] ? ' on' : '') + '">' + (f[key] ? I('check', 15, 3) : '') + '</span><span class="rt"><b style="font-size:14.5px">' + title + (req ? '' : ' <span class="meta">' + t('(optional)') + '</span>') + '</b><span>' + sub + '</span></span></button>';
    const pct = L.pct(10);
    const body = '<div class="card p stack g10" style="max-height:' + (view ? 'none' : '250px') + ';overflow:auto"><span class="caps ink3">' + t('Version {v} · {date}', { v: '1.0', date: L.dshort(new Date(2026, 9, 19).getTime()) + ' 2026' }) + '</span><b>' + t('Terms of Service') + '</b><p class="sub" style="margin:0">' + C.oq(t('Final wording supplied by Lokaly\'s lawyer.')) + ' ' + t('Lokaly connects local businesses with creators. Businesses get {n} campaigns free, then subscribe for {price}/mo; there are no fees on collabs. Payments for paid collabs are processed and held by Stripe Connect. Either side may cancel before submission. Disputes freeze funds and are reviewed by Lokaly.', { n: L.FREE_CAMPAIGNS, price: L.eur(L.SUB_PRICE, 2) }) + '</p>' +
      (creator || view ? '<b>' + t('Creator Terms of Service') + '</b><p class="sub" style="margin:0">' + C.oq(t('Final wording supplied by Lokaly\'s lawyer.')) + ' ' + t('Lokaly is free for creators. Approved collabs pay the full rate into your Lokaly wallet, on approval or automatically 72 hours after you submit. Lokaly keeps {pct} of each withdrawal (IVA included). You deliver what the brief asks for, label it as an ad where the law requires, and can cancel only before you submit.', { pct }) + '</p>' : '') +
      '<b>' + t('Privacy Policy') + '</b><p class="sub" style="margin:0">' + C.oq(t('GDPR wording from Lokaly\'s lawyer.')) + ' ' + t('Data is stored in the EU. Creators\' surnames are never shown.') + '</p><b>' + t('Content rights') + '</b><p class="sub" style="margin:0">' + C.oq(t('Clause pending.')) + ' ' + t('Businesses may repost delivered content on their own channels with credit for 12 months.') + '</p></div>';
    if (view) return '<div class="pad stack g16" style="padding-top:116px">' + body + '</div>';
    x.fix(C.abar({ btn: C.btn(t('Agree & continue'), { kind: 'dark', full: 1, act: 'consent', arg: x.arg, dis: !ok }) }));
    return '<div class="pad stack g16" style="padding-top:116px">' + body + C.list([ck('terms', t('I agree to the Terms and Privacy Policy'), t('Required'), 1)].concat(creator ? [ck('cterms', t('I agree to the Creator Terms of Service'), t('Required'), 1), ck('rights', t('I grant content rights for delivered posts'), t('Required to apply to campaigns'), 1)] : []).concat([ck('mkt', t('Send me Lokaly news'), t('Max one email a month'), 0)])) + '</div>';
  } });
  L.A.consent = (ph, ctx) => {
    if (ph.role === 'business') { L.finishBizOnboarding(ph); ph.go('S-06'); }
    else ph.go('C-02');
  };

  /* ───────── S-20 Offline / system ───────── */
  S('S-20', { name: 'System states', render: (x) => {
    if (x.arg === 'update') return '<div class="pad stack g16" style="padding-top:220px;text-align:center;align-items:center"><span class="serif" style="font-size:40px">Lokaly</span><h1 class="lt" style="font-size:32px">' + t('Time for an update') + '</h1><p class="sub" style="margin:0;max-width:280px">' + t('This version is no longer supported. Update to keep your payments protected.') + '</p><div class="mt16" style="width:100%">' + C.btn(t('Update in the App Store'), { kind: 'dark', full: 1, act: 'dismissSystem' }) + '</div></div>';
    return '<div class="pad" style="padding-top:200px">' + C.empty({ icon: 'wifioff', title: t('Something went wrong'), body: t('We couldn\'t load this. Check your connection and try again.'), cta: C.btn(t('Try again'), { kind: 'dark', sm: 1, icon: I('refresh', 16, 2), act: 'dismissSystem' }) }) + '</div>';
  } });
  L.A.dismissSystem = (ph) => { L.W.scen.forceUpdate = false; if (ph.stack.length > 1) ph.back(); else ph.go(home(ph), { root: 1 }); };

  /* ───────── S-21 Delete account ───────── */
  S('S-21', { name: 'Delete account', render: (x) => {
    x.fix(C.top({ title: t('Delete account'), solid: 1 }));
    const mine = x.role === 'business' ? L.myCollabsB() : L.myCollabsC();
    const open = mine.filter((c) => ['active', 'submitted', 'disputed', 'awaiting'].includes(c.status));
    if (open.length) return '<div class="pad stack g16" style="padding-top:116px">' + C.empty({ icon: 'lock', title: open.length === 1 ? t('Finish or cancel 1 collab first') : t('Finish or cancel {n} collabs first', { n: open.length }), body: t('Money is held or under review. You can delete your account once every collab is complete or cancelled.') }) + C.list(open.map((c) => C.collabRow(c, x.role))) + '</div>';
    // EN 'DELETE' is always accepted; ES also accepts its own confirm word.
    const word = t('DELETE');
    const typed = (x.f.confirm || '').trim().toUpperCase();
    const ok = typed === 'DELETE' || typed === word;
    x.fix(C.abar({ btn: C.btn(t('Delete my account'), { kind: 'dang', full: 1, act: 'deleteAccount', dis: !ok }) }));
    return '<div class="pad stack g16" style="padding-top:116px"><h1 class="lt" style="font-size:32px;line-height:34px">' + t('This can\'t be undone') + '</h1><div class="card p stack g8"><span class="sub">• ' + t('Your profile, messages and portfolio are deleted.') + '</span><span class="sub">• ' + t('Completed collab cards are anonymised.') + '</span><span class="sub">• ' + t('Payment records are kept for 6 years, as Spanish tax law requires.') + '</span>' + (x.role === 'business' ? '<span class="sub">• ' + t('Cancel your subscription in the App Store separately.') + '</span>' : '') + '</div>' + C.field({ label: t('Type {word} to confirm', { word }), bind: 'confirm', value: x.f.confirm, live: 1, auto: 'off' }) + '</div>';
  } });
  L.A.deleteAccount = (ph) => { ph.stack = [{ id: 'S-02', f: {} }]; ph.sheets = []; ph.toast(t('Account deleted')); };

  /* ───────── S-22 Report / block ───────── */
  S('S-22', { name: 'Report or block', sheet: true, render: (x) => {
    const [kind, id] = x.arg.split(':');
    const name = kind === 'cr' ? L.cr(id).first : L.biz(id).name;
    if (x.f.mode === 'report') return C.sheetHead(t('Report {name}', { name })) + '<div class="list">' + ['Spam or scam', 'Inappropriate content', 'Asked to pay outside Lokaly', 'Pretending to be someone else', 'Something else'].map((r) => '<button type="button" class="row" data-act="reportUser" data-arg="' + x.arg + '|' + r + '"><span class="rt"><b>' + t(r) + '</b></span>' + I('chev', 16, 2) + '</button>').join('') + '</div>';
    if (x.f.mode === 'block') return C.sheetHead(t('Block {name}?', { name }), t('They won\'t be able to message or invite you, and you won\'t see each other in Discover. They aren\'t told.')) + '<div class="stack g10">' + C.btn(t('Block {name}', { name }), { kind: 'dang', full: 1, act: 'blockUser', arg: x.arg }) + C.btn(t('Cancel'), { kind: 'ghost', full: 1, close: 1 }) + '</div>';
    return C.sheetHead(name) + C.list([C.row({ icon: 'flag', tone: 'red', title: t('Report'), sub: t('Lokaly reviews every report'), set: 'mode', val: 'report' }), C.row({ icon: 'block', tone: 'grey', title: t('Block'), sub: t('Stop all contact'), set: 'mode', val: 'block' })]);
  } });
  L.A.reportUser = (ph, arg) => { L.W.reports.push(arg); ph.sheets = []; ph.toast(t('Thanks. Lokaly will review this')); };
  L.A.blockUser = (ph, arg) => { const id = arg.split(':')[1]; L.W.blocked.push(id); ph.sheets = []; ph.toast(t('Blocked')); if (ph.base().id === 'S-10') ph.back(); };

  /* ───────── Stripe PaymentSheet (funding a collab) ───────── */
  const paySheet = (x, amount, label, purpose, arg) => {
    const st = x.ph.payState || 'idle';
    const card = L.W.bizMe.cards.find((c) => c.def) || L.W.bizMe.cards[0];
    if (st === '3ds') return '<div class="grab"></div><div class="stack g16" style="padding:6px 0 0"><div class="hrow between"><b>' + t('Secure checkout') + '</b><span class="meta">Banco Sabadell</span></div><h2 class="h2" style="font-size:22px">' + t('Confirm it\'s you') + '</h2><p class="sub" style="margin:0">' + t('Your bank needs you to approve {amt} to Lokaly in your banking app.', { amt: L.eur(amount, 2) }) + '</p>' + C.btn(t('I\'ve approved it'), { kind: 'dark', full: 1, act: 'pay3ds', arg: purpose + '|' + arg }) + C.btn(t('Cancel'), { kind: 'ghost', full: 1, act: 'payCancel' }) + '</div>';
    return C.sheetHead(label) +
      '<div class="stack g16"><div class="card line p stack g4"><span class="meta">' + t('Held by Stripe until you approve, or 72h after the post is submitted') + '</span><span class="num" style="font-size:40px;letter-spacing:-0.04em">' + L.eur(amount, 2) + '</span></div>' +
      (st === 'declined' ? C.banner('bad', 'alert', t('<b>Your card was declined.</b><br>Try again or use a different card.')) : '') +
      // 'Pay' next to the Apple logo is the Apple Pay button mark: it stays as-is in every language.
      C.btn('Pay', { kind: 'apple', full: 1, icon: I.apple(20), act: 'payNow', arg: purpose + '|' + arg + '|apple', busy: st === 'processing', busyLabel: t('Processing…') }) +
      '<div class="hrow"><span class="grow" style="height:1px;background:var(--border)"></span><span class="meta">' + t('or pay by card') + '</span><span class="grow" style="height:1px;background:var(--border)"></span></div>' +
      (card ? '<div class="cardrow on"><span class="visa">VISA</span><span class="grow"><b style="font-size:15px">•••• ' + card.last4 + '</b><br><span class="meta">' + t('Expires {exp}', { exp: card.exp }) + '</span></span>' + I('check', 18, 2.4) + '</div>' : '<button type="button" class="cardrow" data-act="addCard">' + I('plus', 18, 2) + '<b>' + t('Add a card') + '</b></button>') +
      C.btn(t('Pay {amt}', { amt: L.eur(amount, 2) }), { kind: 'dark', full: 1, act: 'payNow', arg: purpose + '|' + arg + '|card', dis: !card || st === 'processing' }) +
      '<div class="stripe-badge">' + I('lock', 13, 2) + t('Payments by Stripe · Receipt by email') + '</div></div>';
  };
  L.paySheet = paySheet;
  S('PAY', { name: 'Stripe checkout · fund collab', sheet: true, render: (x) => { const col = L.col(x.arg); const k = L.camp(col.campaignId); return paySheet(x, L.payB(k.rate), t('Fund {name}', { name: L.cr(col.creatorId).first }), 'fund', col.id); } });
  L.A.addCard = (ph) => { L.W.bizMe.cards.push({ id: L.id('pm'), brand: 'Visa', last4: '4242', exp: '08/28', def: true }); ph.toast(t('Card added')); };
  L.A.payCancel = (ph) => { ph.payState = 'idle'; ph.sheets.pop(); };
  L.A.payNow = (ph, arg) => {
    const [purpose, id] = arg.split('|');
    ph.payState = 'processing';
    ph.later(900, () => {
      const sc = L.W.scen.pay;
      if (sc === 'decline') { ph.payState = 'declined'; return; }
      if (sc === '3ds' && ph.payState !== '3ds-done') { ph.payState = '3ds'; return; }
      ph.payState = 'idle'; L.paid(ph, purpose, id);
    });
  };
  L.A.pay3ds = (ph, arg) => { const [purpose, id] = arg.split('|'); ph.payState = 'processing'; ph.later(700, () => { ph.payState = 'idle'; L.paid(ph, purpose, id); }); };
  L.paid = (ph, purpose, id) => { ph.sheets = []; L.fundCollab(ph, id); };

  /* ───────── App Store purchase sheet (RevenueCat) ───────── */
  S('IAP', { name: 'App Store purchase', sheet: true, render: (x) => {
    // One product in v2: the business subscription. Its name stays as-is.
    const info = { name: 'Lokaly', price: L.eur(L.SUB_PRICE, 2) };
    const st = x.ph.iapState;
    return '<div class="grab"></div><div class="stack g16"><div class="hrow between"><b style="font-size:17px">App Store</b>' + C.gbtn('close', { act: 'iapCancel', aria: t('Cancel purchase') }) + '</div>' +
      '<div class="hrow g12"><span class="logo" style="width:56px;height:56px;border-radius:14px;background:#17181B;color:#D9DCE1;font-size:28px">L</span><span class="stack"><b>' + esc(info.name) + '</b><span class="meta">' + t('Lokaly · Subscription') + '</span></span></div>' +
      C.money([[t('Price'), t('{price} per month', { price: info.price })], [t('Renews'), t('Monthly until cancelled')], [t('Account'), 'andres@icloud.example']]) +
      (st === 'failed' ? C.banner('bad', 'alert', t('Purchase couldn\'t be completed. You weren\'t charged.')) : '') +
      C.btn(t('Subscribe'), { kind: 'dark', full: 1, act: 'iapBuy', arg: x.arg, busy: st === 'processing', busyLabel: t('Confirming…') }) + '<p class="meta center" style="margin:0">' + t('Double-click the side button to confirm on device.') + '</p></div>';
  } });
  L.A.iapCancel = (ph) => { ph.iapState = null; ph.sheets.pop(); ph.toast(t('Purchase cancelled')); };
  L.A.iapBuy = (ph, arg) => {
    ph.iapState = 'processing';
    ph.later(900, () => {
      const sc = L.W.scen.iap;
      if (sc === 'fail') { ph.iapState = 'failed'; return; }
      ph.iapState = null; ph.sheets = [];
      if (sc === 'cancel') { ph.toast(t('Purchase cancelled')); return; }
      if (sc === 'pending') { L.W.bizMe.pending = true; ph.toast(t('Waiting for approval (Ask to Buy)')); return; }
      L.W.bizMe.sub = { renews: L.W.now + 30 * L.D }; L.W.bizMe.pending = false;
      ph.go('B-38', { replace: ph.base().id === 'B-37' });
    });
  };
  L.A.restore = (ph, who) => {
    ph.toast(t('Checking the App Store…'));
    ph.later(700, () => {
      ph.toast(L.W.bizMe.sub ? t('Subscription restored') : t('No purchases to restore'));
    });
  };
})();
