/* Creator screens C-00 … C-26. */
(function () {
  const L = window.L, C = L.C, I = L.I, esc = L.esc;
  const t = L.t;
  const S = (id, def) => { L.S[id] = Object.assign({ role: 'creator' }, def); };
  L.cfz = (ph) => (ph.cfz = ph.cfz || { town: 'All towns', type: 'all', cats: [], km: 35, minRate: 0, q: '' });
  /* deliverable labels: '2 × Instagram Reel' and the short '2 Reel' */
  const dlv = (d) => t('{n} × {platform} {format}', { n: d.count, platform: d.platform, format: t(d.format) });
  const dlvShort = (d) => t('{n} {format}', { n: d.count, format: t(d.format) });
  const payoutLabel = (st) => t({ verified: 'Verified', review: 'In review', action: 'Action needed', none: 'Not set up' }[st]);
  const wStatus = (w) => ({ paid: [t('Paid@@payout'), 'mint'], pending: [t('On its way'), 'lilac'], failed: [t('Failed'), 'red'] }[w.status]);

  /* ───────── C-00 Home ───────── */
  S('C-00', { name: 'Creator home', tab: 'C-00', render: (x) => {
    const me = x.me, mine = L.myCollabsC();
    const active = mine.filter((c) => ['active', 'submitted'].includes(c.status));
    const heldCol = active.find((c) => L.camp(c.campaignId).type === 'paid');
    const held = active.filter((c) => L.camp(c.campaignId).type === 'paid').reduce((s, c) => s + L.netC(L.camp(c.campaignId).rate), 0);
    const bal = L.walletBalance();
    const next = active.filter((c) => c.status === 'active' && !(c.visitDate && c.visitDate < L.W.now)).sort((a, z) => (a.visitDate || 9e15) - (z.visitDate || 9e15))[0];
    const open = L.W.campaigns.filter((k) => k.status === 'active' && L.slotsLeft(k) > 0);
    const nearby = open.filter((k) => k.km <= 35).length;
    const ig = me.socials.ig;
    let h = '<div class="pad stack g20" style="padding-top:58px"><div class="hrow"><span class="serif grow" style="font-size:26px;line-height:1">Lokaly</span><span class="meta num">' + L.date(L.W.now) + '</span>' + C.bell('creator') + '</div>' +
      '<div class="stack g4"><span style="font-size:17px;color:var(--ink3)">' + t('Hello,') + '</span><h1 class="lt xl">' + esc(me.first || t('there')) + '.</h1><span class="sub">' + t("Here's your week on the coast.") + '</span></div></div>';
    h += '<div style="position:relative;height:360px;margin-top:-6px">' + (me.photo ? '<div class="ph mist mist-face" role="img" aria-label="' + esc(me.first) + '" style="position:absolute;left:70px;top:0;width:290px;height:400px;background-position:center 18%;background-image:url(' + me.photo + ')"></div>' : '') + '<div aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(rgba(245,246,244,0),var(--ground) 85%)"></div>' +
      (ig.connected ? '<span style="position:absolute;left:10px;top:100px;padding:8px 10px;border-radius:30px;background:rgba(245,246,244,.86);box-shadow:0 0 20px 12px rgba(245,246,244,.86)" class="stack num"><span class="meta" style="color:var(--ink2)">' + t('Followers') + '</span><span style="font-size:24px;line-height:26px;letter-spacing:-0.03em">' + L.k(ig.followers) + '</span><span class="meta" style="color:var(--ink2)">' + t('Instagram · verified') + '</span></span>' +
        '<span style="position:absolute;left:10px;top:250px;padding:8px 10px;border-radius:30px;background:rgba(245,246,244,.86);box-shadow:0 0 20px 12px rgba(245,246,244,.86)" class="stack num"><span class="meta" style="color:var(--ink2)">' + t('Engagement') + '</span><span style="font-size:24px;line-height:26px;letter-spacing:-0.03em">' + L.pct(ig.eng) + '</span><span class="meta" style="color:var(--ink2)">' + t('Last 30 days') + '</span></span>' : '') +
      '<button type="button" data-go="' + (heldCol ? 'S-12:' + heldCol.id : 'C-18') + '" style="position:absolute;right:6px;top:237px;padding:8px 12px;border-radius:30px;background:rgba(245,246,244,.86);box-shadow:0 0 20px 12px rgba(245,246,244,.86);text-align:right;align-items:flex-end" class="stack num"><span class="meta" style="color:var(--ink2)">' + t('Held for you') + '</span><span style="font-size:24px;line-height:26px;letter-spacing:-0.03em"' + L.tk('c:held', held, 'num', 'eur') + '>' + L.eur(held) + '</span><span class="meta" style="color:var(--ink2)">' + (heldCol ? esc(L.colBiz(heldCol).name) : t('Nothing held yet')) + '</span></button></div>';
    h += '<div class="pad stack g28" style="margin-top:-26px;position:relative">';
    if (L.crMeter() < 100) h += C.meterCard('creator');
    h += '<div class="tiles">' +
      C.tile({ tone: 'peach', label: t('Wallet'), value: t('<sup>€</sup>{n}', { n: '<span' + L.tk('c:wallet', Math.round(bal), 'num') + '>' + Math.round(bal) + '</span>' }), sub: t('ready to withdraw'), foot: t('10% when you withdraw'), foot2: held ? t('{amt} held', { amt: L.eur(held) }) : '', go: 'C-18' }) +
      C.tile({ tone: 'lilac', label: t('Next collab'), value: next && next.visitDate ? (() => { const sod = (v) => new Date(v).setHours(0, 0, 0, 0); const n = Math.max(0, Math.round((sod(next.visitDate) - sod(L.W.now)) / L.D)); return n === 1 ? t('{n}<small> day</small>', { n }) : t('{n}<small> days</small>', { n }); })() : next ? t('Set<small> date</small>') : '—', sub: next ? L.colBiz(next).name + (next.visitDate ? ' · ' + L.date(next.visitDate) : '') : t('nothing booked'), foot: next ? L.camp(next.campaignId).title : t('Apply to start'), go: next ? 'S-12:' + next.id : 'C-06' }) +
      C.tile({ tone: 'mint', label: t('Applications'), value: String(mine.filter((c) => c.history[0].s === 'applied' && L.W.now - c.history[0].at < 30 * L.D).length), sub: t('sent this month · no limit'), foot: t('{n} pending', { n: mine.filter((c) => c.status === 'applied').length }), go: 'C-14' }) +
      C.tile({ tone: 'sky', label: t('Open near you'), value: String(nearby), sub: t('campaigns within 35 km'), foot: t('{n} new this week', { n: open.filter((k) => L.W.now - k.published < 7 * L.D).length }), go: 'C-06' }) + '</div>';
    const todo = mine.filter((c) => ['invited', 'active', 'submitted', 'awaiting', 'applied'].includes(c.status));
    h += '<div class="stack g12"><div class="hrow between"><h2 class="h2">' + t('On your plate') + '</h2><button type="button" class="link" data-tab="C-14">' + t('All work') + '</button></div>' + (todo.length ? C.list(todo.map((c) => C.collabRow(c, 'creator'))) : C.empty({ icon: 'work', title: t('Nothing yet'), body: t('Find a campaign you love and apply. It takes a minute.'), cta: C.btn(t('Find campaigns'), { kind: 'dark', sm: 1, tab: 'C-06' }) })) + '</div>';
    const act = L.W.notifs.creator.slice().sort((a, z) => z.at - a.at).slice(0, 4);
    if (act.length) h += '<div class="stack g12"><h2 class="h2">' + t('Recent activity') + '</h2>' + C.list(act.map((n) => C.row({ icon: n.icon, tone: n.tone, title: '<span style="font-weight:500;font-size:14px">' + esc(L.ntext(n)) + '</span>', sub: L.ago(n.at), act: 'openNotif', arg: n.id }))) + '</div>';
    return h + '</div>';
  } });

  /* ───────── C-01 Auth sheet ───────── */
  S('C-01', { name: 'Creator sign in', sheet: true, render: (x) => C.sheetHead(t('Create your account'), t('Before we ask anything personal. No passwords.')) + L.signInBody(x, 'creator') });

  /* ───────── C-02…C-04 Onboarding ───────── */
  const obFrame = (x, step, title, sub, body, act, ok, skip) => {
    x.fix(C.top({ right: skip ? '<button type="button" class="gpill" data-act="' + skip + '">' + t('Skip') + '</button>' : '' }));
    x.fix(C.abar({ btn: C.btn(t('Continue'), { kind: 'dark', full: 1, act, dis: !ok }) }));
    return '<div class="pad stack g20" style="padding-top:110px">' + C.stepHead(step, title, sub) + body + '</div>';
  };
  S('C-02', { name: 'Onboarding · Name & handle', render: (x) => {
    const o = x.ph.ob; const u = (o.username || '').toLowerCase();
    const taken = ['lucia', 'lucia.coast', 'sofia', 'admin'].includes(u);
    const bad = u && !/^[a-z0-9._]{3,24}$/.test(u);
    const ok = (o.first || '').trim() && (o.last || '').trim() && u && !taken && !bad;
    return obFrame(x, 2, t('What should we call you?'), null,
      '<div class="hrow g16"><button type="button" data-set="o.photo" data-val="' + (o.photo ? '' : L.img('lucia')) + '" aria-label="' + (o.photo ? t('Remove photo') : t('Add profile photo')) + '">' + (o.photo ? C.av(o.photo, 80) : '<span class="upl" style="width:80px;height:80px;min-height:0;border-radius:40px">' + I('camera', 22, 2) + '</span>') + '</button><span class="stack"><b>' + t('Profile photo') + '</b><span class="meta">' + t('A clear face photo gets more invites') + '</span></span></div>' +
      C.field({ label: t('First name'), bind: 'o.first', value: o.first, live: 1, auto: 'given-name' }) +
      C.field({ label: t('Last name'), bind: 'o.last', value: o.last, live: 1, auto: 'family-name', help: t('Private. Never shown to businesses or in notifications.') }) +
      C.field({ label: t('Lokaly username'), bind: 'o.username', value: o.username, pre: '@', live: 1, auto: 'username', err: taken ? t('That username is taken') : bad ? t('3–24 letters, numbers, dots or underscores') : null, help: t('For signing in and support. Not shown on your profile.') }) +
      C.banner('info', 'lock', t('Businesses see your <b>first name</b>. Your surname is never shown.')), 'cob2', ok);
  } });
  L.A.cob2 = (ph) => ph.go('C-03');
  S('C-03', { name: 'Onboarding · Niches & town', render: (x) => {
    const o = x.ph.ob; o.niches = o.niches || [];
    return obFrame(x, 3, t('What do you post about?'), t('Pick at least one. We match you with campaigns that fit.'), '<div class="chips wrap">' + L.NICHES.map((n) => C.chip(t(n), { on: o.niches.includes(n), multi: 'o.niches', val: n })).join('') + '</div>' +
      '<div class="field"><span>' + t('Your town') + '</span><div class="chips wrap">' + L.TOWNS.map((tw) => C.chip(t(tw), { on: o.town === tw, set: 'o.town', val: tw, icon: I('pin', 14, 2) })).join('') + '</div></div>', 'cob3', o.niches.length && o.town);
  } });
  L.A.cob3 = (ph) => ph.go('C-04');
  S('C-04', { name: 'Onboarding · Connect socials', render: (x) => {
    const o = x.ph.ob; o.other = o.other || [];
    const row = (k, name, icon) => {
      const st = o[k];
      if (st && st.connected) return '<div class="row"><span class="ico mint">' + I(icon, 18, 2) + '</span><span class="rt"><b>' + t('{platform} connected', { platform: name }) + '</b><span>' + t('{n} followers · {pct} engagement', { n: L.k(st.followers), pct: L.pct(st.eng) }) + '</span></span>' + I.verified(18) + '</div>';
      return '<div class="row"><span class="ico grey">' + I(icon, 18, 2) + '</span><span class="rt"><b>' + name + '</b><span>' + (k === 'ig' ? t('Professional account required') : t('Creator or personal account')) + '</span></span>' + C.btn(x.ph.busy === k ? '' : t('Connect'), { kind: 'dark', sm: 1, act: 'oauth', arg: k, busy: x.ph.busy === k, busyLabel: '…' }) + '</div>';
    };
    const anyV = (o.ig && o.ig.connected) || (o.tt && o.tt.connected);
    let body = C.list([row('ig', 'Instagram', 'insta'), row('tt', 'TikTok', 'tiktok')]);
    if (o.igErr) body += '<div class="card p stack g8" role="alert" style="border:1px solid #F3D9B1"><b>' + t('That Instagram account is personal') + '</b><span class="sub">' + t("Instagram only shares stats for Professional accounts. It's free and takes a minute: Settings → Account type and tools → Switch to professional account.") + '</span><div class="hrow">' + C.btn(t('Try again'), { kind: 'sec', sm: 1, act: 'oauth', arg: 'ig' }) + '</div></div>';
    body += '<div class="card p stack g10"><span class="hrow g8">' + I.verified(20) + '<b>' + t('Get the Verified badge') + '</b></span><span class="sub">' + t('Connect Instagram or TikTok and businesses see real, verified stats. Verified creators rank higher in Discover.') + '</span></div>';
    body += '<div class="stack g10"><b style="font-size:13px;color:var(--ink2)">' + t('Other platforms (self-reported)') + '</b>' + (o.other.length ? C.list(o.other.map((p) => C.row({ icon: p.platform === 'YouTube' ? 'youtube' : 'globe', title: esc(t(p.platform) + ' · ' + p.handle), sub: t('{n} followers · self-reported', { n: L.k(+p.followers) }), chev: false }))) : '') +
      (x.f.addOther ? '<div class="card line p stack g10">' + C.list([C.pick({ label: t('Platform'), bind: 'op', kind: 'list', value: x.f.op || 'YouTube', opts: ['YouTube', 'Facebook', 'Pinterest', 'Other'].map((p) => ({ v: p, label: t(p) })) })], 'inset') + C.field({ label: t('Handle or channel'), bind: 'oh', value: x.f.oh, live: 1 }) + C.field({ label: t('Followers'), bind: 'of', value: x.f.of, type: 'number', mode: 'numeric', live: 1 }) + C.btn(t('Add'), { kind: 'dark', sm: 1, act: 'addOther', dis: !(x.f.oh && +x.f.of > 0) }) + '</div>' : C.btn(t('Add another platform'), { kind: 'sec', sm: 1, icon: I('plus', 16, 2), toggle: 'addOther', style: 'align-self:flex-start' })) + '</div>';
    return obFrame(x, 4, t('Connect your socials'), t('Read-only access to your follower count and engagement. We never post for you.'), body, 'cobDone', anyV || o.other.length, 'cobDone');
  } });
  L.A.oauth = (ph, k) => {
    const o = ph.ob; ph.busy = k; o.igErr = false;
    ph.later(900, () => {
      ph.busy = null; const sc = L.W.scen.oauth;
      if (sc === 'cancel') { ph.toast(t('Connection cancelled')); return; }
      if (k === 'ig' && sc === 'personal') { o.igErr = true; return; }
      o[k] = k === 'ig' ? { connected: true, handle: '@' + (o.username || 'you'), followers: 18400, eng: 4.1, synced: L.W.now } : { connected: true, handle: '@' + (o.username || 'you'), followers: 9100, eng: 6.3, synced: L.W.now };
    });
  };
  L.A.addOther = (ph) => { const f = ph.top().f; ph.ob.other.push({ platform: f.op || 'YouTube', handle: f.oh, followers: +f.of }); f.addOther = false; f.oh = ''; f.of = ''; };
  L.A.cobDone = (ph) => {
    const o = ph.ob, c = L.myCr();
    Object.assign(c, { first: (o.first || 'Creator').trim(), last: (o.last || '').trim(), username: o.username || '', photo: o.photo || null, niches: o.niches || [], town: o.town || 'Marbella', socials: { ig: o.ig || { connected: false }, tt: o.tt || { connected: false }, other: o.other || [] } });
    L.W.crMe.meter = { photo: !!o.photo, bio: false, portfolio: false, social: !!((o.ig && o.ig.connected) || (o.tt && o.tt.connected) || (o.other && o.other.length)) };
    L.email('E-01', c.first, 'Your Lokaly sign-in code', {}, {});
    ph.go('S-06');
  };

  /* ───────── C-05 Checklist ───────── */
  const crChecklist = () => {
    const m = L.W.crMe.meter;
    const item = (k, title, sub, go) => '<div class="row"><span class="check' + (m[k] ? ' on' : '') + '" aria-hidden="true">' + (m[k] ? I('check', 15, 3) : '') + '</span><span class="rt"><b>' + t(title) + '</b><span>' + t(sub) + '</span></span>' + (m[k] ? '<span class="meta">' + t('Done') + '</span>' : C.btn(t('Add'), { kind: 'sec', sm: 1, go, aria: t('Add {item}', { item: t(title) }) })) + '</div>';
    return C.list([item('photo', 'Profile photo', 'A clear face photo', 'C-24'), item('bio', 'Bio', 'Two lines about your style', 'C-24'), item('portfolio', 'Portfolio', '3 or more photos of your work', 'C-25'), item('social', 'A connected social', 'Instagram or TikTok, or self-reported', 'C-26')]);
  };
  // v2: profiles are complete before entering the app. Required step after the primers: no close, Continue at 100%.
  S('C-05', { name: 'Finish your profile', render: (x) => {
    const pct = L.crMeter();
    x.fix(C.abar({ btn: C.btn(t('Continue'), { kind: 'dark', full: 1, act: 'profileDone', dis: pct < 100 }) }));
    return '<div class="pad stack g20" style="padding-top:110px"><div class="stack g6"><span class="meta">' + t('Last step') + '</span><h1 class="lt">' + t('Finish your profile') + '</h1><p class="sub" style="margin:0">' + t('Businesses only see complete profiles. Finish it to enter Lokaly. You\'re at {pct}.', { pct: L.pct(pct) }) + '</p></div>' + C.meter(pct) + crChecklist() + '</div>';
  } });

  /* ───────── C-06 Discover campaigns ───────── */
  L.filterCampaigns = (ph) => {
    const f = L.cfz(ph); const loc = L.W.perms.creator.location === 'granted'; const q = (f.q || '').toLowerCase();
    return L.W.campaigns.filter((k) => k.status === 'active' && !L.W.blocked.includes(k.bizId))
      .filter((k) => f.town === 'All towns' || k.town === f.town)
      .filter((k) => f.type === 'all' || k.type === f.type)
      .filter((k) => !f.cats.length || f.cats.includes(k.category))
      .filter((k) => !+f.minRate || (k.type === 'paid' && k.rate >= +f.minRate))
      .filter((k) => !loc || k.km <= f.km)
      .filter((k) => !q || k.title.toLowerCase().includes(q) || L.biz(k.bizId).name.toLowerCase().includes(q) || k.category.toLowerCase().includes(q) || t(k.category).toLowerCase().includes(q))
      .sort((a, z) => z.published - a.published);
  };
  const typeSeg = (cur) => C.seg('z.type', [{ v: 'all', label: t('All') }, { v: 'paid', label: t('Paid') }, { v: 'experience', label: t('Experience') }], cur);
  S('C-06', { name: 'Discover campaigns', tab: 'C-06', render: (x) => {
    const f = L.cfz(x.ph); const open = L.filterCampaigns(x.ph);
    const loc = L.W.perms.creator.location === 'granted';
    let h = '<div class="pad top-pad stack g16"><div class="hrow between"><span class="meta">' + t('Discover') + '</span>' + C.bell('creator') + '</div><h1 class="lt">' + t("What's on in<br><i>{place}</i>", { place: esc(f.town === 'All towns' ? t('the Costa del Sol') : t(f.town)) }) + '</h1>' +
      '<div class="hrow g8"><label class="search grow">' + I('search', 18, 2) + '<span class="sr">' + t('Search campaigns') + '</span><input data-bind="z.q" data-live="1" placeholder="' + esc(t('Venue, campaign or category')) + '" value="' + esc(f.q || '') + '"></label><button type="button" class="gbtn" data-go="C-07" aria-label="' + esc(t('Filters')) + '" style="width:50px;height:50px;border-radius:25px">' + I('sliders', 20, 2) + ((f.cats.length || +f.minRate) ? '<span class="dot"></span>' : '') + '</button></div>' +
      typeSeg(f.type) +
      '<div class="chips">' + ['All towns'].concat(L.TOWNS.slice(0, 3)).map((tw) => C.chip(t(tw), { on: f.town === tw, set: 'z.town', val: tw, icon: tw === 'All towns' ? '' : I('pin', 14, 2) })).join('') + '</div>';
    if (!loc) h += '<button type="button" class="banner info" data-act="locSetting" style="text-align:left;width:100%">' + I('pin', 18, 2) + '<span>' + t('Location is off, so distance is hidden. <b>Turn on</b>') + '</span></button>';
    h += '</div><div class="pad stack g24 mt20">';
    if (!open.length) return h + C.empty({ icon: 'search', title: t('No campaigns match'), body: t('Try another town, or clear filters.'), cta: C.btn(t('Clear filters'), { kind: 'dark', sm: 1, act: 'clearCfz' }) }) + '</div>';
    h += '<div class="stack g8"><h2 class="h2">' + t('Open now') + '</h2><span class="meta">' + (open.length === 1 ? t('1 campaign · newest first') : t('{n} campaigns · newest first', { n: open.length })) + '</span></div>' + open.map((k) => C.campaignCard(k)).join('');
    return h + '</div>';
  } });
  L.A.clearCfz = (ph) => { ph.cfz = null; };

  /* ───────── C-07 Filters ───────── */
  S('C-07', { name: 'Campaign filters', sheet: true, render: (x) => {
    const f = L.cfz(x.ph); const loc = L.W.perms.creator.location === 'granted';
    return C.sheetHead(t('Filters')) + '<div class="stack g20">' + (loc ? '<label class="field"><span>' + t('Distance · within {km} km', { km: f.km }) + '</span><input class="range" type="range" min="1" max="50" value="' + f.km + '" data-bind="z.km" aria-label="' + esc(t('Distance in km')) + '"></label>' : C.banner('grey', 'pin', t('Distance needs location.'))) +
      '<div class="field"><span>' + t('Type') + '</span>' + typeSeg(f.type) + '</div>' +
      '<div class="stack g10"><b style="font-size:13px;color:var(--ink2)">' + t('Categories') + '</b><div class="chips wrap">' + L.CATEGORIES.map((c) => C.chip(t(c), { on: f.cats.includes(c), multi: 'z.cats', val: c })).join('') + '</div></div>' +
      '<label class="field"><span>' + t('Minimum rate · {amt}', { amt: +f.minRate ? L.eur(+f.minRate) : t('Any') }) + '</span><input class="range" type="range" min="0" max="300" step="25" value="' + (+f.minRate || 0) + '" data-bind="z.minRate" aria-label="' + esc(t('Minimum rate')) + '"></label>' +
      '<div class="hrow">' + C.btn(t('Clear'), { kind: 'ghost', act: 'clearCfz' }) + (() => { const n = L.filterCampaigns(x.ph).length; return C.btn(n === 1 ? t('Show 1 campaign') : t('Show {n} campaigns', { n }), { kind: 'dark', full: 1, close: 1, style: 'flex:1' }); })() + '</div></div>';
  } });

  /* ───────── C-08 Business profile (creator view) ───────── */
  S('C-08', { name: 'Business profile', render: (x) => L.bizProfile(x, L.biz(x.arg), false) });

  /* ───────── C-09 Campaign detail ───────── */
  S('C-09', { name: 'Campaign detail', render: (x) => {
    const k = L.camp(x.arg); const b = L.biz(k.bizId); const paid = k.type === 'paid';
    const mine = L.W.collabs.find((c) => c.campaignId === k.id && c.creatorId === L.W.crMe.id && !['withdrawn'].includes(c.status));
    const full = L.slotsLeft(k) <= 0; const closed = k.status !== 'active';
    x.fix('<div class="topbar">' + C.gbtn('back', { back: 1, aria: t('Back'), clear: 1 }) + '<span class="grow"></span>' + C.gbtn('more', { go: 'S-22:biz:' + b.id, aria: t('Report'), clear: 1 }) + '</div>');
    let h = '<div class="hero" style="height:380px">' + C.ph(k.cover, '', k.title) + '</div><div class="pad stack g20" style="margin-top:-40px;position:relative">' +
      '<button type="button" class="hrow g10" data-go="C-08:' + b.id + '" style="text-align:left;min-height:52px">' + C.logo(b, 40) + '<span class="stack grow"><b>' + esc(b.name) + '</b><span class="meta">' + esc(t(b.category) + ' · ' + t(k.town) + ' · ' + k.km + ' km') + '</span></span>' + I('chev', 16, 2) + '</button>' +
      '<div class="stack g8"><span class="hrow wrap g8">' + C.pill(paid ? t('Paid') : t('Experience'), paid ? 'peach' : 'sky', paid ? 'euro' : 'gift') + (mine ? C.status(mine.status, mine.id) : '') + '</span><h1 class="lt">' + esc(k.title) + '</h1></div>';
    if (closed && !mine) h += C.banner('grey', 'lock', t('This campaign has closed.'));
    else if (full && !mine) h += C.banner('grey', 'users', t('This campaign already has its creator.'));
    if (mine) h += '<button type="button" class="banner info" data-go="' + (mine.status === 'invited' ? 'C-13:' : 'S-12:') + mine.id + '" style="width:100%;text-align:left">' + I('work', 18, 2) + '<span><b>' + esc(t(L.STATUS[mine.status][0])) + '.</b> ' + esc(C.nextC(mine)) + ' →</span></button>';
    h += paid ? '<div class="card p stack g8"><div class="hrow between"><span class="meta">' + t('Rate per creator') + '</span>' + C.pill(t('Held by Stripe'), 'peach', 'shield') + '</div><span class="num" style="font-size:40px;letter-spacing:-0.04em;line-height:42px">' + L.eur(k.rate) + '</span><span class="sub">' + t("All {amt} goes to your Lokaly wallet when {biz} approves, or automatically 72h after you submit. Lokaly takes 10% only when you withdraw.", { amt: '<b style="color:var(--ink)">' + L.eur(L.netC(k.rate)) + '</b>', biz: esc(b.name) }) + '</span></div>'
      : '<div class="card p stack g8"><span class="meta">' + t('What you get') + '</span><b class="serif" style="font-size:28px;font-weight:400;line-height:30px">' + esc(k.offer) + '</b><span class="sub">' + t('Estimated value {amt}. No money changes hands.', { amt: L.eur(k.value) }) + '</span></div>';
    h += '<div class="stack g10"><h2 class="h2">' + t('The brief') + '</h2><p style="margin:0;font-size:15px;line-height:23px">' + esc(k.brief) + '</p></div>';
    h += '<div class="card p stack g10"><h2 class="h2">' + t('Deliverables') + '</h2>' + k.deliverables.map((d) => '<div class="hrow g10">' + I(d.platform === 'TikTok' ? 'tiktok' : d.platform === 'YouTube' ? 'youtube' : 'insta', 18, 2) + '<span>' + dlv(d) + '</span></div>').join('') + '<span class="meta">' + t('Must include {what}', { what: esc(k.mustInclude) }) + (k.donts ? ' · ' + t('Avoid: {what}', { what: esc(k.donts) }) : '') + '</span></div>';
    const left = Math.max(0, L.slotsLeft(k));
    h += C.list([C.row({ icon: 'cal', tone: 'sky', title: t('Visit window'), sub: L.date(k.visitFrom) + ' – ' + L.date(k.visitTo) + ' · ' + t('exact time agreed in chat'), chev: false }), C.row({ icon: 'clock', tone: 'lilac', title: t('Apply by {date}', { date: L.date(k.applyBy) }), sub: left ? t('One creator · still open') : t('One creator · taken'), chev: false }), C.row({ icon: 'pin', title: esc(b.address || t(k.town)), sub: t('Open in Maps'), act: 'openMaps', right: I('ext', 16, 2), chev: false })]);
    h += '</div>';
    if (!mine && !closed && !full) x.fix(C.abar({ title: paid ? L.eur(L.netC(k.rate)) : t('Experience'), sub: paid ? t('to your wallet') : esc(k.offer.split(' + ')[0]), btn: C.btn(t('Apply'), { act: 'applyStart', arg: k.id }) }));
    return h;
  } });
  L.A.applyStart = (ph, id) => {
    if (L.crMeter() < 100) { ph.go('C-05'); return; } // profiles are complete in v2; this only catches a profile edited back down
    ph.go('C-10:' + id);
  };

  /* ───────── C-10 Apply sheet ───────── */
  S('C-10', { name: 'Apply', sheet: true, render: (x) => {
    const k = L.camp(x.arg); const b = L.biz(k.bizId);
    return C.sheetHead(t('Apply to {biz}', { biz: b.name })) + '<div class="stack g16">' + C.field({ label: t('Your pitch'), bind: 'pitch', value: x.f.pitch, textarea: 1, live: 1, ph: t('Why you, why this place. Two or three lines is perfect.'), max: 400, help: (x.f.pitch || '').length + '/400' }) +
      '<button type="button" class="row" role="checkbox" aria-checked="' + !!x.f.ok + '" data-toggle="ok" style="border:0;align-items:flex-start"><span class="check' + (x.f.ok ? ' on' : '') + '">' + (x.f.ok ? I('check', 15, 3) : '') + '</span><span class="rt"><b style="font-size:14.5px">' + t('I can deliver {list}', { list: k.deliverables.map(dlvShort).join(' + ') }) + '</b><span>' + t('and visit between {from} and {to}', { from: L.dshort(k.visitFrom), to: L.dshort(k.visitTo) }) + '</span></span></button>' +
      '<span class="meta">' + t('Apply to as many campaigns as you like.') + '</span>' +
      C.btn(x.ph.busy === 'apply' ? '' : t('Send application'), { kind: 'dark', full: 1, act: 'apply', arg: k.id, dis: !x.f.ok || (x.f.pitch || '').trim().length < 10, busy: x.ph.busy === 'apply', busyLabel: t('Sending…') }) + '</div>';
  } });
  L.A.apply = (ph, id) => {
    const k = L.camp(id); const b = L.biz(k.bizId); const me = L.myCr(); const pitch = ph.top().f.pitch.trim();
    ph.busy = 'apply';
    ph.later(500, () => {
      ph.busy = null;
      if (L.W.scen.offline) { ph.toast(t("You're offline. Try again when connected")); return; }
      const col = { id: L.id('col'), campaignId: k.id, creatorId: me.id, status: 'applied', pitch, visitDate: null, submission: null, submittedAt: null, history: [{ s: 'applied', at: L.W.now }] };
      L.W.collabs.push(col);
      L.post(b.id, me.id, { from: 'sys', deal: 'application', collabId: col.id }, k.id);
      L.post(b.id, me.id, { from: 'cr', text: pitch }, k.id);
      L.notify('business', { icon: 'user', tone: 'sky', msg: '{name} applied to {title}', p: { name: { cr: me.id }, title: { camp: k.id } }, go: 'B-25:' + col.id });
      ph.sheets = []; ph.go('C-12:' + col.id, { replace: 1 });
    });
  };

  /* ───────── C-12 Applied ───────── */
  S('C-12', { name: 'Applied', render: (x) => {
    const col = L.col(x.arg); const k = L.camp(col.campaignId); const b = L.biz(k.bizId);
    const step = (n, title, s) => '<div class="hrow g12" data-in="up" data-d="' + (160 + n * 70) + '" style="align-items:flex-start"><span class="serif" style="font-size:28px;line-height:28px;width:22px;flex-shrink:0;color:var(--detail)">' + n + '</span><span class="stack"><b>' + title + '</b><span class="meta">' + s + '</span></span></div>';
    x.fix(C.top({ close: 1 }));
    x.fix(C.abar({ btn: C.btn(t('Keep browsing'), { kind: 'sec', tab: 'C-06', style: 'flex:1' }) + C.btn(t('Go to Work'), { tab: 'C-14', style: 'flex:1' }) }));
    return C.success({ icon: 'send', title: t('Sent to {biz}.', { biz: esc(b.name) }), sub: t('{title}. They usually reply within two days.', { title: esc(k.title) }),
      body: '<div class="card p stack g16">' + step(1, k.type === 'paid' ? t('{biz} accepts and funds {amt}', { biz: b.name, amt: L.eur(L.payB(k.rate)) }) : t('{biz} accepts you', { biz: b.name }), k.type === 'paid' ? t('The money is held by Stripe before you do anything.') : t('No money is held for Experience collabs.')) + step(2, t('You visit and post'), t('Agree a time in chat. Then submit your post link and a screenshot.')) + step(3, k.type === 'paid' ? t('{amt} lands in your wallet', { amt: L.eur(L.netC(k.rate)) }) : t('Done'), t('When they approve, or automatically 72h after you submit.')) + '</div>' });
  } });

  /* ───────── C-13 Invite detail ───────── */
  S('C-13', { name: 'Invite', render: (x) => {
    const col = L.col(x.arg); const k = L.camp(col.campaignId); const b = L.biz(k.bizId); const paid = k.type === 'paid';
    x.fix(C.top({ title: t('Invite'), solid: 1 }));
    const closed = k.status !== 'active' || col.status === 'expired';
    let h = '<div class="pad stack g20" style="padding-top:116px"><div class="hrow g12">' + C.logo(b, 56) + '<span class="stack"><span class="meta">' + t('Invite from') + '</span><b style="font-size:19px">' + esc(b.name) + '</b></span></div>';
    if (closed) h += C.banner('grey', 'clock', t('This invite has expired because the campaign closed.'));
    if (col.status !== 'invited' && !closed) h += C.banner('info', 'check', col.status === 'declined' ? t('You declined this invite.') : t('You accepted this invite.'));
    if (col.note) h += '<div class="card p stack g6"><span class="meta">' + t('Their note') + '</span><p style="margin:0;font-size:16px;line-height:23px">' + t('"{note}"', { note: esc(col.note) }) + '</p></div>';
    h += '<button type="button" style="text-align:left;display:block;width:100%" data-go="C-09:' + k.id + '">' + C.ph(k.cover, 'height:180px;border-radius:24px', k.title) + '<span class="hrow between mt12"><b style="font-size:17px">' + esc(k.title) + '</b><span class="num" style="font-size:18px;font-weight:600">' + (paid ? L.eur(k.rate) : t('Experience')) + '</span></span><span class="meta">' + (paid ? t('You receive {amt}', { amt: L.eur(L.netC(k.rate)) }) : esc(k.offer)) + ' · ' + k.deliverables.map(dlvShort).join(' + ') + ' · ' + t('Visits {from}–{to}', { from: L.dshort(k.visitFrom), to: L.dshort(k.visitTo) }) + '</span></button>';
    h += C.banner('grey', 'shield', paid ? t('If you accept, {biz} funds {amt} to confirm. Nothing starts until the money is held.', { biz: esc(b.name), amt: L.eur(L.payB(k.rate)) }) : t('If you accept, {biz} confirms and you agree a visit time in chat.', { biz: esc(b.name) })) + '</div>';
    if (col.status === 'invited' && !closed) x.fix(C.abar({ btn: C.btn(t('Decline'), { kind: 'sec', act: 'declineInvite', arg: col.id }) + C.btn(t('Accept invite'), { act: 'acceptInvite', arg: col.id, style: 'flex:1' }) }));
    return h;
  } });
  L.A.acceptInvite = (ph, id) => {
    const col = L.col(id); const k = L.camp(col.campaignId); const me = L.myCr();
    L.setStatus(col, 'awaiting');
    L.post(k.bizId, me.id, { from: 'sys', deal: 'accepted', collabId: col.id }, k.id);
    L.notify('business', { icon: 'user', tone: 'peach', msg: k.type === 'paid' ? '{name} accepted your invite · fund to confirm' : '{name} accepted your invite · confirm to start', p: { name: { cr: me.id } }, go: 'B-25:' + col.id });
    ph.go('S-12:' + col.id, { replace: 1 }); ph.toast(t('Accepted · waiting for {biz}', { biz: L.biz(k.bizId).name }));
  };
  L.A.declineInvite = (ph, id) => {
    const col = L.col(id); const k = L.camp(col.campaignId);
    L.setStatus(col, 'declined');
    L.post(k.bizId, col.creatorId, { from: 'sys', deal: 'declined', collabId: col.id }, k.id);
    L.notify('business', { icon: 'user', tone: 'grey', msg: '{name} declined your invite to {title}', p: { name: { cr: L.myCr().id }, title: { camp: k.id } }, go: 'B-23:' + k.id });
    ph.back(); ph.toast(t('Invite declined'));
  };

  /* ───────── C-14 Work tab ───────── */
  S('C-14', { name: 'Work', tab: 'C-14', render: (x) => {
    const seg = x.f.seg || 'active'; const mine = L.myCollabsC();
    const g = { apps: mine.filter((c) => ['applied', 'invited', 'awaiting'].includes(c.status)), active: mine.filter((c) => ['active', 'submitted', 'disputed'].includes(c.status)), done: mine.filter((c) => ['completed', 'resolved_released', 'resolved_refunded'].includes(c.status)), closed: mine.filter((c) => ['cancelled', 'declined', 'withdrawn', 'expired'].includes(c.status)) };
    const list = g[seg];
    const empty = { apps: ['No applications', 'Apply to campaigns from Discover. Invites from businesses land here too.'], active: ['No active collabs', 'When a business accepts and funds, the collab starts here.'], done: ['Nothing completed yet', 'Your first collab earnings will show here.'], closed: ['Nothing closed', 'Declined, withdrawn and cancelled collabs move here.'] }[seg];
    return '<div class="pad top-pad stack g16"><div class="hrow between"><h1 class="lt">' + t('Work') + '</h1>' + C.bell('creator') + '</div>' + C.seg('seg', [{ v: 'apps', label: t('Applied@@seg'), count: g.apps.filter((c) => c.status === 'invited').length }, { v: 'active', label: t('Active@@seg'), count: g.active.length }, { v: 'done', label: t('Done@@seg') }, { v: 'closed', label: t('Closed') }], seg) +
      (list.length ? C.list(list.map((c) => C.collabRow(c, 'creator'))) : C.empty({ icon: 'work', title: t(empty[0]), body: t(empty[1]), cta: seg === 'apps' || seg === 'active' ? C.btn(t('Find campaigns'), { kind: 'dark', sm: 1, tab: 'C-06' }) : '' })) + '</div>';
  } });

  /* ───────── C-15 Submit content ───────── */
  const urlOk = (u) => /^https?:\/\/(www\.)?(instagram\.com\/(reel|p|stories)\/|tiktok\.com\/@[^/]+\/video\/|vm\.tiktok\.com\/)\S+/i.test((u || '').trim());
  S('C-15', { name: 'Submit content', render: (x) => {
    const col = L.col(x.arg); const k = L.camp(col.campaignId); const b = L.biz(k.bizId); const f = x.f;
    f.shots = f.shots || []; f.chk = f.chk || {};
    x.fix(C.top({ title: t('Submit your post'), solid: 1 }));
    if (col.status !== 'active') return '<div style="padding-top:140px">' + C.empty({ icon: 'lock', title: col.status === 'submitted' ? t('Already submitted') : t('Not ready to submit'), body: col.status === 'submitted' ? t('Your post is with {biz} for review.', { biz: b.name }) : t('You can submit once {biz} has accepted and funded the collab.', { biz: b.name }), cta: C.btn(t('Back to collab'), { kind: 'dark', sm: 1, back: 1 }) }) + '</div>';
    const bad = f.url && !urlOk(f.url);
    const allChk = k.deliverables.every((_, i) => f.chk[i]);
    const ok = urlOk(f.url) && f.shots.length && allChk;
    x.fix(C.abar({ btn: C.btn(t('Submit for review'), { kind: 'dark', full: 1, act: 'submitPost', arg: col.id, dis: !ok }) }));
    return '<div class="pad stack g20" style="padding-top:116px">' + C.field({ label: t('Link to your post'), bind: 'url', value: f.url, live: 1, type: 'url', mode: 'url', ph: 'https://www.instagram.com/reel/…', err: bad ? t('Paste an Instagram or TikTok post link') : null, help: t('Instagram reel, post or story, or a TikTok video.') }) +
      '<button type="button" class="link" data-set="url" data-val="https://www.instagram.com/reel/C9' + Math.random().toString(36).slice(2, 8) + '/" style="font-size:13px;align-self:flex-start;margin-top:-10px">' + t('Paste a sample link') + '</button>' +
      '<div class="field"><span>' + t('Screenshots') + ' <span class="meta">(' + f.shots.length + '/5)</span></span><div class="thumbs">' + f.shots.map((s, i) => '<div class="ph" style="background-image:url(' + s + ')"><button type="button" class="x" data-act="shotDel" data-arg="' + i + '" aria-label="' + esc(t('Remove screenshot')) + '">' + I('close', 14, 2.4) + '</button></div>').join('') + (f.shots.length < 5 ? '<button type="button" class="upl" style="min-height:0;aspect-ratio:1" data-act="shotAdd" data-arg="' + (k.cover) + '" aria-label="' + esc(t('Add screenshot')) + '">' + I('plus', 22, 2) + '</button>' : '') + '</div><small>' + t('Include one showing views or reach if you can.') + '</small></div>' +
      '<div class="field"><span>' + t('Delivered') + '</span><div class="list">' + k.deliverables.map((d, i) => '<button type="button" class="row" role="checkbox" aria-checked="' + !!f.chk[i] + '" data-toggle="chk.' + i + '"><span class="check' + (f.chk[i] ? ' on' : '') + '">' + (f.chk[i] ? I('check', 15, 3) : '') + '</span><span class="rt"><b>' + dlv(d) + '</b></span></button>').join('') + '</div></div>' +
      C.banner('info', 'clock', k.type === 'paid' ? t('Submitting starts a 72-hour review. {biz} approves or reports a problem; if they do nothing, {amt} releases to you automatically.', { biz: esc(b.name), amt: L.eur(L.netC(k.rate)) }) : t('Submitting starts a 72-hour review. {biz} approves or reports a problem; if they do nothing, the collab completes automatically.', { biz: esc(b.name) })) + '</div>';
  } });
  L.A.shotAdd = (ph, src) => { const f = ph.top().f; const pool = [src, L.img('coast'), L.img('brunch'), L.img('restaurant'), L.img('spa')]; f.shots.push(pool[f.shots.length % pool.length]); };
  L.A.shotDel = (ph, i) => ph.top().f.shots.splice(+i, 1);
  L.A.submitPost = (ph, id) => {
    const col = L.col(id); const f = ph.top().f; const k = L.camp(col.campaignId); const me = L.myCr();
    L.setStatus(col, 'submitted', { submittedAt: L.W.now, submission: { url: f.url.trim(), shots: f.shots.slice() }, reminded: false });
    L.post(k.bizId, me.id, { from: 'sys', deal: 'submission', collabId: col.id }, k.id);
    L.notify('business', { icon: 'clock', tone: 'lilac', msg: 'Submission ready from {name} · 72h to review', p: { name: { cr: me.id } }, go: 'B-27:' + col.id });
    ph.go('C-16:' + col.id, { replace: 1 });
  };

  /* ───────── C-16 Submitted ───────── */
  S('C-16', { name: 'Submitted', render: (x) => {
    const col = L.col(x.arg); const k = L.camp(col.campaignId); const b = L.biz(k.bizId); const paid = k.type === 'paid';
    const p = { biz: esc(b.name), amt: L.eur(L.netC(k.rate)), when: L.dt(col.submittedAt + 72 * L.H) };
    x.fix(C.top({ close: 1 }));
    x.fix(C.abar({ btn: C.btn(t('Back to collab'), { kind: 'dark', full: 1, act: 'toCollab', arg: col.id }) }));
    return C.success({ tone: 'lilac', title: t('Submitted.'), sub: t('Nice work. {biz} has been told.', p), body:
      '<div class="tile lilac wide" style="cursor:default;min-height:170px"><span class="tl">' + t('Auto-release') + '</span><span class="tv">' + t('{h}<small>h</small>', { h: '<span data-in="count" data-d="100" data-v="' + L.hoursLeft(col) + '">' + L.hoursLeft(col) + '</span>' }) + '</span><span class="ts">' + (paid ? t('{amt} releases automatically on {when} unless {biz} reports a problem', p) : t('Completes automatically on {when} unless {biz} reports a problem', p)) + '</span></div>' +
      '<div class="card p stack g10"><b>' + t('What happens next') + '</b><span class="sub">' + t('• {biz} checks your post against the brief.', p) + '</span><span class="sub">' + (paid ? t('• Approved: {amt} goes to your Lokaly wallet.', p) : t('• Approved: the collab card appears on both profiles.')) + '</span><span class="sub">' + t('• A problem: Lokaly reviews it and contacts you.') + '</span></div>' });
  } });
  L.A.toCollab = (ph, id) => ph.go('S-12:' + id, { replace: 1 });

  /* ───────── C-17 Payout account (bank details) ─────────
     v2: added at the first withdrawal (Stripe-hosted, so Lokaly never sees the ID), saved, and confirmed on every withdrawal. */
  S('C-17', { name: 'Payout account', render: (x) => {
    const st = L.W.crMe.payout;
    x.fix(C.top({ title: t('Payout account'), solid: 1 }));
    const head = { none: ['Add your bank account', 'Withdrawals from your wallet go to your bank. Add it once, at your first withdrawal; we save it and you confirm it every time.', 'grey'], review: ['Stripe is checking your details', 'Usually a few minutes, at most two business days. Your wallet keeps growing meanwhile.', 'lilac'], action: ['Stripe needs one more thing', 'Upload a photo of your DNI or NIE to finish verification. Withdrawals are paused until then.', 'red'], verified: ['Bank account saved', 'Withdrawals land in your bank in 1–3 business days.', 'ok'] }[st];
    const fromWithdraw = x.ph.stack.some((e) => e.id === 'C-27');
    let h = '';
    if (st === 'verified') h += C.list([C.row({ icon: 'card', title: L.bankLabel, sub: t('CaixaBank · confirmed on every withdrawal'), chev: false }), C.row({ icon: 'user', title: t('Identity verified'), sub: t('NIF and address held by Stripe, not Lokaly'), chev: false }), C.row({ icon: 'ext', title: t('Update details in Stripe'), go: 'KYC' })]);
    else if (st === 'none') h += '<div class="card p stack g10"><b>' + t("You'll need") + '</b><span class="sub">' + t('• Your DNI, NIE or passport') + '</span><span class="sub">' + t('• Your NIF and home address') + '</span><span class="sub">' + t('• A Spanish or EU bank account (IBAN)') + '</span></div>' + C.banner('grey', 'lock', t('Stripe collects this for tax rules (DAC7). Lokaly never sees your ID.'));
    h = C.success({ tone: head[2], icon: st === 'verified' ? 'check' : st === 'action' ? 'alert' : st === 'review' ? 'clock' : 'euro', title: t(head[0]), sub: t(head[1]), xl: false, body: h });
    if (st === 'none') x.fix(C.abar({ btn: C.btn(t('Continue to Stripe'), { kind: 'dark', full: 1, go: 'KYC', icon: I('ext', 16, 2) }) }));
    if (st === 'action') x.fix(C.abar({ btn: C.btn(t('Fix in Stripe'), { kind: 'dark', full: 1, go: 'KYC' }) }));
    if (st === 'review') x.fix(C.abar({ btn: C.btn(t('Refresh status'), { kind: 'sec', full: 1, act: 'kycRefresh' }) }));
    if (st === 'verified' && fromWithdraw) x.fix(C.abar({ btn: C.btn(t('Back to withdraw'), { kind: 'dark', full: 1, back: 1 }) }));
    return h;
  } });
  S('KYC', { name: 'Stripe Connect onboarding', sheet: true, full: true, render: (x) => {
    const f = x.f;
    return '<div class="grab"></div><div class="hrow between" style="margin-bottom:16px"><b style="font-size:18px;color:#635BFF">stripe</b>' + C.gbtn('close', { close: 1, aria: t('Close Stripe') }) + '</div><div class="stack g16"><h2 class="h2" style="font-size:22px">' + t('Verify your details for Lokaly') + '</h2><p class="sub" style="margin:0">' + t("Hosted by Stripe. Lokaly can't see what you enter here.") + '</p>' +
      C.field({ label: t('NIF / NIE'), bind: 'nif', value: f.nif === undefined ? 'X1234567L' : f.nif }) + C.field({ label: t('Home address'), bind: 'addr', value: f.addr === undefined ? 'Calle Málaga 3, 29601 Marbella' : f.addr }) + C.field({ label: t('IBAN'), bind: 'iban', value: f.iban === undefined ? 'ES91 2100 0418 4502 0005 4821' : f.iban }) +
      '<button type="button" class="upl" data-toggle="id">' + (f.id ? I('check', 22, 2) + t('DNI photo added') : I('camera', 22, 2) + t('Photo of your ID')) + '</button>' + C.btn(t('Submit to Stripe'), { kind: 'dark', full: 1, act: 'kycSubmit', style: 'background:#635BFF' }) + '<p class="meta center" style="margin:0">' + t('Demo values. Never type real details into a prototype.') + '</p></div>';
  } });
  L.A.kycSubmit = (ph) => { ph.sheets = []; L.W.crMe.payout = 'review'; ph.toast(t('Back in Lokaly · Stripe is checking')); ph.later(1200, () => { L.W.crMe.payout = L.W.scen.kyc === 'action' && !ph.kycTried ? 'action' : 'verified'; ph.kycTried = true; if (L.W.crMe.payout === 'action') L.email('E-07', L.myCr().first, 'Stripe needs one more document', {}, {}); }); };
  L.A.kycRefresh = (ph) => { L.W.crMe.payout = L.W.scen.kyc === 'action' && !ph.kycTried ? 'action' : 'verified'; };

  /* ───────── C-18 Earnings + wallet ───────── */
  S('C-18', { name: 'Earnings', render: (x) => {
    const mine = L.myCollabsC().filter((c) => L.camp(c.campaignId).type === 'paid');
    const held = mine.filter((c) => c.status === 'active' || c.status === 'disputed').reduce((s, c) => s + L.netC(L.camp(c.campaignId).rate), 0);
    const rel = mine.filter((c) => c.status === 'submitted').reduce((s, c) => s + L.netC(L.camp(c.campaignId).rate), 0);
    const bal = L.walletBalance(); const ws = L.myWithdrawals();
    const out = ws.filter((w) => w.status === 'paid').reduce((s, w) => s + L.wNet(w.amount), 0);
    x.fix(C.top({ title: t('Earnings'), solid: 1, right: C.gbtn('download', { act: 'exportCsv', arg: 'creator', aria: t('Export CSV') }) }));
    let h = '<div class="pad stack g16" style="padding-top:116px">';
    h += '<div class="card p stack g12" style="background:#17181B;color:#F4F4F2"><span class="caps" style="color:#D9DCE1;font-size:10px">' + t('Wallet') + '</span><span class="num" style="font-size:48px;line-height:50px;letter-spacing:-0.045em"' + L.tk('c:bal', bal, 'num', 'eur') + '>' + L.eur(bal, 2) + '</span><span style="font-size:13px;color:#A3A6AC">' + t('Available to withdraw. Lokaly takes 10% when you withdraw, nothing before.') + '</span>' +
      C.btn(t('Withdraw'), { kind: 'white', full: 1, go: 'C-27', dis: bal < L.MIN_WITHDRAW }) + '</div>';
    h += '<div class="tiles">' + C.tile({ tone: 'peach', label: t('Held'), value: t('<sup>€</sup>{n}', { n: '<span' + L.tk('c:held18', Math.round(held), 'num') + '>' + Math.round(held) + '</span>' }), sub: t('in active collabs'), foot: t('safe with Stripe') }) + C.tile({ tone: 'lilac', label: t('Releasing'), value: t('<sup>€</sup>{n}', { n: Math.round(rel) }), sub: t('in a 72h window'), foot: t('{n} submitted', { n: mine.filter((c) => c.status === 'submitted').length }) }) + C.tile({ tone: 'mint', label: t('Withdrawn@@wallet'), value: t('<sup>€</sup>{n}', { n: '<span' + L.tk('c:out', Math.round(out), 'num') + '>' + Math.round(out) + '</span>' }), sub: t('all time, after fees'), foot: L.pl(ws.length, 'withdrawal'), wide: true }) + '</div>';
    h += C.list([C.row({ icon: 'card', title: t('Payout account'), right: L.W.crMe.payout === 'verified' ? L.bankLabel : payoutLabel(L.W.crMe.payout), go: 'C-17' })]);
    const going = mine.filter((c) => ['active', 'submitted', 'disputed'].includes(c.status));
    const acts = L.walletCredits(L.W.crMe.id).map((c) => ({ at: c.at, credit: c })).concat(ws.map((w) => ({ at: w.at, w }))).sort((a, z) => z.at - a.at);
    if (!going.length && !acts.length) return h + C.empty({ icon: 'euro', title: t('No earnings yet'), body: t('Your first collab earnings will show here.'), cta: C.btn(t('Find paid campaigns'), { kind: 'dark', sm: 1, act: 'findPaid' }) }) + '</div>';
    if (going.length) h += '<h2 class="h2 mt8">' + t('On the way to your wallet') + '</h2>' + C.list(going.map((c) => { const k = L.camp(c.campaignId);
      return C.row({ av: C.logo(L.biz(k.bizId), 44), title: esc(L.biz(k.bizId).name), sub: esc(k.title) + ' · ' + C.nextC(c), right: '<span class="stack" style="align-items:flex-end;gap:4px"><span class="num" style="color:var(--ink);font-weight:600">' + L.eur(L.netC(k.rate)) + '</span>' + (c.status === 'disputed' ? C.status('disputed') : c.status === 'submitted' ? C.pill(t('Releasing in {h}h', { h: L.hoursLeft(c) }), 'lilac') : C.pill(t('Held'), 'peach')) + '</span>', go: 'S-12:' + c.id }); }));
    if (acts.length) h += '<h2 class="h2 mt8">' + t('Wallet activity') + '</h2>' + C.list(acts.map((a) => {
      if (a.credit) { const k = L.camp(a.credit.col.campaignId); return C.row({ av: C.logo(L.biz(k.bizId), 44), title: esc(L.biz(k.bizId).name), sub: esc(k.title) + ' · ' + L.dshort(a.at), right: '<span class="stack" style="align-items:flex-end;gap:4px"><span class="num" style="color:var(--ink);font-weight:600">+' + L.eur(a.credit.amount) + '</span>' + C.pill(t('In wallet'), 'mint') + '</span>', go: 'S-12:' + a.credit.col.id }); }
      const st = wStatus(a.w);
      return C.row({ icon: 'download', tone: 'grey', title: t('Withdrawal'), sub: L.bankLabel + ' · ' + L.dshort(a.at), right: '<span class="stack" style="align-items:flex-end;gap:4px"><span class="num" style="color:var(--ink);font-weight:600">−' + L.eur(a.w.amount) + '</span>' + C.pill(st[0], st[1]) + '</span>', go: 'C-19:' + a.w.id });
    }));
    return h + C.btn(t('Export CSV'), { kind: 'sec', full: 1, icon: I('download', 18, 2), act: 'exportCsv', arg: 'creator' }) + '</div>';
  } });
  L.A.findPaid = (ph) => { L.cfz(ph).type = 'paid'; ph.tab('C-06'); };

  /* ───────── C-27 Withdraw ─────────
     The saved bank account is confirmed on every withdrawal; the 10% fee (IVA 21% included) comes off the amount. */
  const wLines = (amt) => [[t('Withdraw from wallet'), L.eur(amt, 2)], [t('Lokaly fee 10%'), '−' + L.eur(L.wFee(amt), 2)], [t('Of which IVA 21%'), L.eur(L.iva(L.wFee(amt)), 2)], [t('You receive'), L.eur(L.wNet(amt), 2), 1]];
  S('C-27', { name: 'Withdraw', render: (x) => {
    const bal = L.walletBalance(); const f = x.f; const st = L.W.crMe.payout;
    if (f.amt === undefined) f.amt = String(bal);
    const amt = Math.round((+String(f.amt).replace(',', '.') || 0) * 100) / 100;
    const bad = amt < L.MIN_WITHDRAW ? t('The minimum is {amt}', { amt: L.eur(L.MIN_WITHDRAW) }) : amt > bal ? t('You have {amt} available', { amt: L.eur(bal, 2) }) : null;
    x.fix(C.top({ title: t('Withdraw'), solid: 1 }));
    let bank;
    if (st === 'verified') bank = '<div class="list"><button type="button" class="row" role="checkbox" aria-checked="' + !!f.ok + '" data-toggle="ok"><span class="check' + (f.ok ? ' on' : '') + '">' + (f.ok ? I('check', 15, 3) : '') + '</span><span class="rt"><b>' + t('Send to {bank}', { bank: L.bankLabel }) + '</b><span>' + t('CaixaBank · saved account') + '</span></span></button>' + C.row({ icon: 'edit', tone: 'grey', title: t('Use a different account'), go: 'C-17' }) + '</div>';
    else if (st === 'review') bank = C.banner('info', 'clock', t('<b>Stripe is checking your bank details.</b><br>You can withdraw as soon as they\'re verified.')) + C.btn(t('Refresh status'), { kind: 'sec', sm: 1, act: 'kycRefresh' });
    else bank = '<div class="card p stack g10"><b>' + t(st === 'action' ? 'Stripe needs one more thing' : 'Add your bank account') + '</b><span class="sub">' + t(st === 'action' ? 'Finish verification in Stripe, then come back to withdraw.' : 'Your first withdrawal: add your bank details once. We save them for next time.') + '</span>' + C.btn(t(st === 'action' ? 'Fix in Stripe' : 'Add bank account'), { kind: 'dark', sm: 1, go: 'C-17' }) + '</div>';
    x.fix(C.abar({ title: L.eur(L.wNet(bad ? 0 : amt), 2), sub: t('you receive'), btn: C.btn(x.ph.busy === 'cashout' ? '' : t('Withdraw'), { kind: 'pri', act: 'cashOut', dis: !!bad || st !== 'verified' || !f.ok, busy: x.ph.busy === 'cashout', busyLabel: t('Processing…') }) }));
    return '<div class="pad stack g20" style="padding-top:116px">' + C.field({ label: t('Amount'), bind: 'amt', value: f.amt, pre: '€', type: 'number', mode: 'decimal', live: 1, err: bad, help: t('{amt} available', { amt: L.eur(bal, 2) }) }) +
      (amt !== bal ? '<button type="button" class="link" data-set="amt" data-val="' + bal + '" style="font-size:13px;align-self:flex-start;margin-top:-10px">' + t('Withdraw everything') + '</button>' : '') +
      '<div class="stack g10"><h2 class="h2">' + t('To your bank') + '</h2>' + bank + '</div>' +
      '<div class="card p stack g8"><b>' + t('Breakdown') + '</b>' + C.money(wLines(bad ? 0 : amt)) + '<span class="meta">' + t('Arrives in 1–3 business days.') + '</span>' + C.oq(t('IVA on the fee and any withholding: accountant to confirm.')) + '</div></div>';
  } });
  L.A.cashOut = (ph) => {
    const f = ph.top().f; const amt = Math.round((+String(f.amt).replace(',', '.') || 0) * 100) / 100; const me = L.myCr();
    ph.busy = 'cashout';
    ph.later(700, () => {
      ph.busy = null;
      const w = { id: L.id('w'), creatorId: me.id, amount: amt, status: 'pending', at: L.W.now, arrive: L.W.now + 2 * L.D, ref: 'po_' + L.W.seq + 'Lk' };
      L.W.withdrawals.unshift(w);
      L.email('E-06', me.first, 'Withdrawal on its way · {amt}', { w: w.id }, { amt: { eur: L.wNet(amt), d: 2 } });
      L.notify('creator', { icon: 'euro', tone: 'peach', cat: 'payments', msg: 'Withdrawal sent · {amt} to your bank', p: { amt: { eur: L.wNet(amt), d: 2 } }, go: 'C-19:' + w.id });
      ph.go('C-28:' + w.id, { replace: 1 });
    });
  };

  /* ───────── C-28 Withdrawal sent ───────── */
  S('C-28', { name: 'Withdrawal sent', render: (x) => {
    const w = L.W.withdrawals.find((y) => y.id === x.arg);
    x.fix(C.top({ close: 1 }));
    x.fix(C.abar({ btn: C.btn(t('View withdrawal'), { kind: 'sec', go: 'C-19:' + w.id, style: 'flex:1' }) + C.btn(t('Done'), { back: 1, style: 'flex:1' }) }));
    return C.success({ icon: 'send', title: t('On its way.'), sub: t('{amt} to {bank}. Arrives by {date}.', { amt: L.eur(L.wNet(w.amount), 2), bank: L.bankLabel, date: L.date(w.arrive) }), body: '<div class="card p">' + C.money(wLines(w.amount)) + '</div>' });
  } });

  /* ───────── C-19 Withdrawal detail ───────── */
  S('C-19', { name: 'Withdrawal detail', render: (x) => {
    const w = L.W.withdrawals.find((y) => y.id === x.arg); const st = wStatus(w);
    x.fix(C.top({ title: t('Withdrawal'), solid: 1 }));
    const when = { paid: t('Landed {date}', { date: L.date(w.arrive) }), pending: t('Expected {date}', { date: L.date(w.arrive) }), failed: t('Your bank rejected it') }[w.status];
    return '<div class="pad stack g20" style="padding-top:116px"><div class="stack g6" style="align-items:center;text-align:center"><span class="ico ' + (w.status === 'failed' ? 'red' : 'peach') + '" style="width:56px;height:56px;border-radius:28px">' + I('download', 24, 2) + '</span><span class="num" style="font-size:48px;letter-spacing:-0.04em">' + L.eur(L.wNet(w.amount), 2) + '</span>' + C.pill(st[0], st[1]) + '<span class="meta">' + when + '</span></div>' +
      (w.status === 'failed' ? C.banner('bad', 'alert', t("<b>Fix your bank details in Stripe.</b> The amount is back in your wallet.")) : '') +
      '<div class="card p">' + C.money(wLines(w.amount)) + '</div>' +
      C.list([C.row({ icon: 'card', title: L.bankLabel, sub: t('CaixaBank'), chev: false }), C.row({ icon: 'doc', title: t('Stripe reference'), right: '<span class="num">' + w.ref + '</span>', chev: false })]) +
      '<p class="meta" style="margin:0">' + C.oq(t('Keep this screen, or drop it because withdrawals go straight to the bank? Omar to decide.')) + '</p>' +
      (w.status === 'failed' ? C.btn(t('Fix in Stripe'), { kind: 'dark', full: 1, go: 'C-17' }) : '') + '</div>';
  } });

  /* ───────── C-20 Profile tab ───────── */
  S('C-20', { name: 'Creator profile tab', tab: 'C-20', render: (x) => {
    const me = x.me; const pct = L.crMeter();
    return '<div class="pad top-pad stack g20"><div class="hrow between"><h1 class="lt">' + t('Profile') + '</h1>' + C.gbtn('gear', { go: 'S-15', aria: t('Settings') }) + '</div>' +
      '<button type="button" class="card stack" data-go="C-20P" style="width:100%;text-align:left;overflow:hidden;padding:0"><div class="ph" style="height:250px;background-position:center 20%;background-image:url(' + (me.photo || L.img('coast')) + ')"></div><span class="stack g6" style="padding:14px 16px 16px"><span class="meta">' + t('As businesses see you') + '</span><span class="hrow" style="gap:8px"><b style="font-size:22px">' + esc(me.first || t('You')) + '</b>' + C.badges(me) + '</span><span class="meta">' + esc(me.niches.map((n) => t(n)).join(' · ') + ' · ' + t(me.town)) + ' · ' + t('surname and handles hidden') + '</span></span></button>' +
      (pct < 100 ? C.meterCard('creator') : '') +
      C.list([C.row({ icon: 'edit', title: t('Edit profile'), go: 'C-24' }), C.row({ icon: 'image', title: t('Portfolio'), right: me.portfolio.length === 1 ? t('1 photo') : t('{n} photos', { n: me.portfolio.length }), go: 'C-25' }), C.row({ icon: 'link', title: t('Connected accounts'), right: L.verified(me) ? t('Verified') : t('Not verified'), go: 'C-26' })]) +
      C.list([C.row({ icon: 'euro', tone: 'peach', title: t('Earnings & wallet'), right: L.eur(L.walletBalance(), 2), go: 'C-18' }), C.row({ icon: 'card', title: t('Payout account'), right: payoutLabel(L.W.crMe.payout), go: 'C-17' })]) +
      C.list([C.row({ icon: 'gear', title: t('Settings'), go: 'S-15' }), C.row({ icon: 'help', title: t('Help'), go: 'S-18' })]) + '</div>';
  } });
  S('C-20P', { name: 'Profile preview (as businesses see it)', render: (x) => { x.fix(C.top({ title: t('Preview'), clear: 1 })); return L.creatorProfile(x, x.me, 'own'); } });

  /* ───────── C-24 Edit profile ───────── */
  S('C-24', { name: 'Edit creator profile', render: (x) => {
    const me = x.me; const f = x.f;
    if (f.bio === undefined) Object.assign(f, { bio: me.bio, niches: me.niches.slice(), town: me.town, photo: me.photo });
    x.fix('<div class="topbar solid">' + C.gbtn('back', { act: 'crEditBack', aria: t('Back') }) + '<div class="tt">' + t('Edit profile') + '</div><button type="button" class="gpill" data-act="saveCr">' + t('Save') + '</button></div>');
    return '<div class="pad stack g20" style="padding-top:116px"><div class="hrow g16"><button type="button" data-set="photo" data-val="' + (f.photo ? '' : L.img('lucia')) + '" aria-label="' + (f.photo ? t('Remove photo') : t('Add photo')) + '">' + (f.photo ? C.av(f.photo, 84) : '<span class="upl" style="width:84px;height:84px;min-height:0;border-radius:42px">' + I('camera', 22, 2) + '</span>') + '</button><span class="stack"><b>' + esc(me.first) + '</b><span class="meta">' + t('Name changes go through support') + '</span></span></div>' +
      C.field({ label: t('Bio'), bind: 'bio', value: f.bio, textarea: 1, live: 1, max: 160, ph: t('Your style in two lines'), help: (f.bio || '').length + '/160' }) +
      '<div class="field"><span>' + t('Niches') + '</span><div class="chips wrap">' + L.NICHES.map((n) => C.chip(t(n), { on: f.niches.includes(n), multi: 'niches', val: n })).join('') + '</div></div>' +
      '<div class="field"><span>' + t('Town') + '</span><div class="chips wrap">' + L.TOWNS.map((tw) => C.chip(t(tw), { on: f.town === tw, set: 'town', val: tw })).join('') + '</div></div>' +
      C.list([C.row({ icon: 'link', title: t('Social accounts'), sub: t('Connect or add self-reported platforms'), go: 'C-26' })]) + '</div>';
  } });
  L.A.saveCr = (ph) => { const f = ph.top().f; const me = L.myCr(); Object.assign(me, { bio: f.bio, niches: f.niches.length ? f.niches : me.niches, town: f.town, photo: f.photo }); L.W.crMe.meter.photo = !!f.photo; L.W.crMe.meter.bio = (f.bio || '').trim().length >= 10; ph.back(); ph.toast(t('Profile saved · {pct}', { pct: L.pct(L.crMeter()) })); };
  L.A.crEditBack = (ph) => { const f = ph.top().f; const me = L.myCr(); const dirty = f.bio !== me.bio || f.town !== me.town || f.photo !== me.photo || f.niches.join() !== me.niches.join(); if (dirty) ph.go('DISCARD'); else ph.back(); };

  /* ───────── C-25 Portfolio ───────── */
  S('C-25', { name: 'Portfolio manager', render: (x) => {
    const me = x.me; const pool = ['coast', 'brunch', 'restaurant', 'spa', 'fitness', 'fashion', 'nightlife'].map(L.img).filter((p) => !me.portfolio.includes(p));
    x.fix(C.top({ title: t('Portfolio'), solid: 1 }));
    return '<div class="pad stack g16" style="padding-top:116px"><p class="sub" style="margin:0">' + t('Free for every business to see. Show 3 or more of your best. The first one leads.') + '</p>' +
      (me.portfolio.length ? '<div class="thumbs" style="grid-template-columns:repeat(3,1fr)">' + me.portfolio.map((p, i) => '<div class="ph" style="background-image:url(' + p + ')"><button type="button" class="x" data-act="pfDel" data-arg="' + i + '" aria-label="' + esc(t('Remove photo {n}', { n: i + 1 })) + '">' + I('close', 14, 2.4) + '</button>' + (i ? '<button type="button" class="x" style="left:4px;right:auto" data-act="pfFirst" data-arg="' + i + '" aria-label="' + esc(t('Move photo {n} first', { n: i + 1 })) + '">' + I('back', 14, 2.4) + '</button>' : '<span class="pill ink" style="position:absolute;left:6px;bottom:6px;height:20px;font-size:10px">' + t('Cover') + '</span>') + '</div>').join('') + '</div>' : C.empty({ icon: 'image', title: t('No photos yet'), body: t('Add at least 3 to finish your profile.') })) +
      (pool.length ? C.btn(t('Add photo'), { kind: 'sec', full: 1, icon: I('plus', 18, 2), act: 'pfAdd', arg: pool[0] }) : '') + '</div>';
  } });
  const pfMeter = () => { L.W.crMe.meter.portfolio = L.myCr().portfolio.length >= 3; };
  L.A.pfAdd = (ph, p) => { L.myCr().portfolio.push(p); pfMeter(); };
  L.A.pfDel = (ph, i) => { L.myCr().portfolio.splice(+i, 1); pfMeter(); };
  L.A.pfFirst = (ph, i) => { const a = L.myCr().portfolio; a.unshift(a.splice(+i, 1)[0]); };

  /* ───────── C-26 Connected accounts ───────── */
  S('C-26', { name: 'Connected accounts', render: (x) => {
    const me = x.me; const s = me.socials;
    x.fix(C.top({ title: t('Connected accounts'), solid: 1 }));
    const row = (k, name, icon) => {
      const v = s[k];
      if (v.connected && v.expired) return '<div class="card p stack g10"><div class="hrow g12"><span class="ico red">' + I(icon, 18, 2) + '</span><span class="grow stack"><b>' + t('{platform} · reconnect', { platform: name }) + '</b><span class="meta">' + t('Access expired. Stats stopped syncing.') + '</span></span></div>' + C.btn(t('Reconnect'), { kind: 'dark', sm: 1, act: 'reconnect', arg: k }) + '</div>';
      if (v.connected) return '<div class="card p stack g10"><div class="hrow g12"><span class="ico mint">' + I(icon, 18, 2) + '</span><span class="grow stack"><b>' + name + '</b><span class="meta">' + t('{n} followers · {pct} · synced {ago}', { n: L.k(v.followers), pct: L.pct(v.eng), ago: L.ago(v.synced || L.W.now - L.H) }) + '</span></span>' + I.verified(18) + '</div><div class="hrow g8">' + C.btn(t('Disconnect'), { kind: 'sec', sm: 1, act: 'disconnect', arg: k }) + '</div></div>';
      return '<div class="card p hrow g12"><span class="ico grey">' + I(icon, 18, 2) + '</span><span class="grow stack"><b>' + name + '</b><span class="meta">' + t('Not connected') + '</span></span>' + C.btn(x.ph.busy === k ? '' : t('Connect'), { kind: 'dark', sm: 1, act: 'connect2', arg: k, busy: x.ph.busy === k, busyLabel: '…' }) + '</div>';
    };
    return '<div class="pad stack g16" style="padding-top:116px">' + (x.f.confirm ? '<div class="warn" role="alert"><b>' + t('Disconnect {platform}?', { platform: x.f.confirm === 'ig' ? 'Instagram' : 'TikTok' }) + '</b><span>' + ((x.f.confirm === 'ig' ? s.tt.connected : s.ig.connected) ? t('Its stats disappear from your profile.') : t("You'll lose your Verified badge and rank lower in Discover.")) + '</span><div class="hrow">' + C.btn(t('Keep it'), { kind: 'sec', sm: 1, set: 'confirm', val: '' }) + C.btn(t('Disconnect'), { kind: 'dang', sm: 1, act: 'disconnectYes', arg: x.f.confirm }) + '</div></div>' : '') +
      row('ig', 'Instagram', 'insta') + row('tt', 'TikTok', 'tiktok') + '<h2 class="h2 mt8">' + t('Self-reported') + '</h2>' + (s.other.length ? C.list(s.other.map((o) => C.row({ icon: 'globe', title: esc(t(o.platform) + ' · ' + o.handle), sub: t('{n} followers · not verified', { n: L.k(o.followers) }), chev: false }))) : '<div class="card p sub">' + t('None. Add YouTube, Facebook or others from Edit profile.') + '</div>') + '<p class="meta">' + t('Lokaly reads follower count and engagement only. We never post for you.') + '</p></div>';
  } });
  L.A.disconnect = (ph, k) => { ph.top().f.confirm = k; };
  L.A.disconnectYes = (ph, k) => { L.myCr().socials[k] = { connected: false }; ph.top().f.confirm = ''; const s = L.myCr().socials; L.W.crMe.meter.social = !!(s.ig.connected || s.tt.connected || s.other.length); ph.toast(t('Disconnected')); };
  L.A.reconnect = (ph, k) => { L.myCr().socials[k].expired = false; L.myCr().socials[k].synced = L.W.now; ph.toast(t('Reconnected')); };
  L.A.connect2 = (ph, k) => {
    ph.busy = k;
    ph.later(800, () => { ph.busy = null; const sc = L.W.scen.oauth; if (sc === 'cancel') { ph.toast(t('Connection cancelled')); return; } if (k === 'ig' && sc === 'personal') { ph.toast(t('Switch Instagram to a Professional account first')); return; } L.myCr().socials[k] = { connected: true, handle: '@' + (L.myCr().username || 'you'), followers: k === 'ig' ? 18400 : 9100, eng: k === 'ig' ? 4.1 : 6.3, synced: L.W.now }; L.W.crMe.meter.social = true; });
  };
})();
/* guards for screens that need context */
(function () {
  const L = window.L;
  L.S['C-16'].guard = (ph, arg) => { const c = L.col(arg); return c && c.submittedAt ? null : 'C-15:' + arg; };
})();
