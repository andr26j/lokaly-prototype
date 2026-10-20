/* Business screens B-00 … B-36. */
(function () {
  const L = window.L, C = L.C, I = L.I, esc = L.esc;
  const t = L.t;
  /* locale helpers: EN output stays byte-identical to the pre-i18n build */
  const isES = () => L.lang() === 'es';
  const N0 = (n) => (isES() && L.num ? L.num(n, 0) : String(n));
  const PCT = (n) => (isES() && L.pct ? L.pct(n) : n + '%');
  const SUP = (n, key) => '<sup>€</sup>' + (key ? '<span' + L.tk(key, n, 'num', 'n0') + '>' + N0(n) + '</span>' : N0(n));
  const DLV = (d) => t('{n} × {platform} {format}', { n: d.count, platform: d.platform, format: t(d.format) });
  const SLOTS = (n) => (n === 1 ? t('1 slot left') : t('{n} slots left', { n }));
  const NICHE = (c) => c.niches.map((n) => t(n)).join(' · ');
  const S = (id, def) => { L.S[id] = Object.assign({ role: 'business' }, def); };
  const DAY_IN = (t) => { const d = new Date(t); const p = (n) => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); };

  /* ───────── B-00 Home ───────── */
  S('B-00', { name: 'Business home', tab: 'B-00', render: (x) => {
    const b = x.me, mine = L.myCollabsB();
    const held = mine.filter((c) => ['active', 'submitted', 'disputed'].includes(c.status) && L.camp(c.campaignId).type === 'paid').reduce((s, c) => s + L.payB(L.camp(c.campaignId).rate), 0);
    const sub = mine.filter((c) => c.status === 'submitted').sort((a, z) => a.submittedAt - z.submittedAt);
    const apps = mine.filter((c) => c.status === 'applied');
    const visits = mine.filter((c) => c.status === 'active' && c.visitDate && c.visitDate > L.W.now && c.visitDate < L.W.now + 7 * L.D).sort((a, z) => a.visitDate - z.visitDate);
    const action = mine.filter((c) => ['applied', 'awaiting', 'submitted'].includes(c.status) || (c.status === 'active' && !c.visitDate));
    const camps = L.W.campaigns.filter((k) => k.bizId === b.id && k.status === 'active');
    const mem = L.W.bizMe.membership;
    let h = '<div class="pad stack g20" style="padding-top:58px"><div class="hrow"><span class="serif grow" style="font-size:26px;line-height:1">Lokaly</span><span class="meta num">' + L.date(L.W.now) + '</span>' + C.bell('business') + '</div>' +
      '<div class="stack g4"><span style="font-size:17px;color:var(--ink3)">' + t(new Date(L.W.now).getHours() < 12 ? 'Good morning,' : 'Good afternoon,') + '</span><h1 class="lt xl">' + esc(b.name || t('Your business')) + '.</h1><span class="sub">' + (camps.length ? (camps.length > 1 ? t('{n} live campaigns on the coast.', { n: camps.length }) : t('1 live campaign on the coast.')) : t('Post your first campaign to meet local creators.')) + '</span></div></div>';
    h += '<div style="position:relative;height:260px;margin-top:-4px">' + (b.cover ? '<div class="ph mist mist-wide" role="img" aria-label="' + esc(b.name) + '" style="position:absolute;left:80px;right:-30px;top:0;height:290px;background-image:url(' + b.cover + ')"></div>' : '') + '<div aria-hidden="true" style="position:absolute;left:0;right:0;bottom:0;height:120px;background:linear-gradient(rgba(245,246,244,0),var(--ground) 85%)"></div>' +
      '<button type="button" data-go="B-28" style="position:absolute;left:12px;top:40px;padding:8px 12px;border-radius:30px;background:rgba(245,246,244,.86);box-shadow:0 0 20px 12px rgba(245,246,244,.86);text-align:left" class="stack num"><span class="meta" style="color:var(--ink2)">' + t('Held in collabs') + '</span><span style="font-size:24px;letter-spacing:-0.03em"' + L.tk('b:held', held, 'num', 'eur') + '>' + L.eur(held) + '</span><span class="meta" style="color:var(--ink2)">' + t('Released on approval or after 72h') + '</span></button>' +
      '<button type="button" data-go="B-26" style="position:absolute;right:10px;top:150px;padding:8px 12px;border-radius:30px;background:rgba(245,246,244,.86);box-shadow:0 0 20px 12px rgba(245,246,244,.86);text-align:right;align-items:flex-end" class="stack num"><span class="meta" style="color:var(--ink2)">' + t('Needs you') + '</span><span style="font-size:24px;letter-spacing:-0.03em"' + L.tk('b:needs', action.length, 'num') + '>' + action.length + '</span><span class="meta" style="color:var(--ink2)">' + t(action.length ? 'collabs waiting' : 'All caught up') + '</span></button></div>';
    h += '<div class="pad stack g28" style="margin-top:-10px">';
    if (L.bizMeter() < 100) h += C.meterCard('business');
    h += '<div class="tiles">' +
      C.tile({ tone: 'mint', label: t(apps.length === 1 ? 'New applicant' : 'New applicants'), value: '<span' + L.tk('b:apps', apps.length, 'num') + '>' + apps.length + '</span>', sub: t(apps.length ? 'waiting for a yes or no' : 'none right now'), foot: t('{n} live', { n: camps.length }), foot2: apps[0] ? t('{name} latest', { name: L.cr(apps[0].creatorId).first }) : '', go: apps.length ? 'B-23:' + apps[0].campaignId : 'B-13' }) +
      C.tile({ tone: 'lilac', label: t('Review window'), value: sub.length ? t('{h}<small>h</small>', { h: '<span' + L.tk('b:rev:' + sub[0].id, L.hoursLeft(sub[0]), 'num') + '>' + L.hoursLeft(sub[0]) + '</span>' }) : '—', sub: sub.length ? t('to review {name}\'s post', { name: L.cr(sub[0].creatorId).first }) : t('nothing to review'), foot: t('{n} submitted', { n: sub.length }), foot2: t('auto-release'), go: sub.length ? 'B-27:' + sub[0].id : 'B-26' }) +
      C.tile({ tone: 'peach', label: t('Spent this month'), value: SUP(Math.round(L.W.txns.filter((t) => t.bizId === b.id && (t.kind === 'funded' || t.kind === 'fee') && L.W.now - t.at < 30 * L.D).reduce((s, y) => s + y.amount, 0)), 'b:spent'), sub: t('funded + fees, incl. 10%'), foot: t('Export CSV'), foot2: '', go: 'B-28' }) +
      C.tile({ tone: 'sky', label: t('Visits'), value: String(visits.length), sub: t(visits.length === 1 ? 'creator booked this week' : 'creators booked this week'), foot: visits[0] ? t('Next {date}', { date: L.date(visits[0].visitDate) }) : t('Mon–Sun'), foot2: visits[0] ? L.time(visits[0].visitDate) : '', go: 'B-26' }) + '</div>';
    h += '<div class="stack g12"><div class="hrow between"><h2 class="h2">' + t('Needs you') + '</h2><button type="button" class="link" data-go="B-26">' + t('All collabs') + '</button></div>' + (action.length ? C.list(action.slice(0, 4).map((c) => C.collabRow(c, 'business'))) : '<div class="card p sub">' + t('All caught up. New applications land here.') + '</div>') + '</div>';
    h += '<div class="stack g12"><div class="hrow between"><h2 class="h2">' + t('Your campaigns') + '</h2><button type="button" class="link" data-go="B-13">' + t('See all') + '</button></div>' +
      (camps.length ? '<div class="mini-h">' + camps.map((k) => '<button type="button" data-go="B-22:' + k.id + '" class="stack g8" style="width:220px;flex-shrink:0;text-align:left">' + C.ph(k.cover, 'height:130px;border-radius:20px', k.title) + '<b style="font-size:15px">' + esc(k.title) + '</b><span class="meta">' + (L.slotsLeft(k) === 1 ? t('{n} applicants · 1 slot left', { n: L.W.collabs.filter((c) => c.campaignId === k.id && c.status === 'applied').length }) : t('{n} applicants · {s} slots left', { n: L.W.collabs.filter((c) => c.campaignId === k.id && c.status === 'applied').length, s: L.slotsLeft(k) })) + '</span></button>').join('') + '</div>'
        : C.empty({ icon: 'plus', title: t('No live campaigns'), body: t('Paid or Experience. Takes about four minutes.'), cta: C.btn(t('Create campaign'), { kind: 'dark', sm: 1, tab: 'B-14' }) })) + '</div>';
    h += mem ? '<button type="button" class="card p hrow" data-go="B-32" style="width:100%;text-align:left"><span class="ico" style="background:#17181B;color:#D9DCE1">' + I('unlock', 18, 2) + '</span><span class="grow stack"><b>' + (L.unlocksLeft() === 1 ? t('1 unlock left') : t('{n} unlocks left', { n: L.unlocksLeft() })) + '</b><span class="meta">' + t('{plan} · renews {date}', { plan: esc(mem.plan.charAt(0).toUpperCase() + mem.plan.slice(1)), date: L.dshort(mem.renews) }) + '</span></span>' + I('chev', 16, 2) + '</button>'
      : '<button type="button" data-go="B-11" class="hrow" style="width:100%;text-align:left;background:#17181B;color:#F4F4F2;border-radius:24px;padding:18px"><span class="grow stack g4"><span class="caps" style="color:#D9DCE1;font-size:10px">' + t('Lokaly membership') + '</span><b style="font-size:16px">' + t('See who you\'re working with') + '</b><span style="font-size:13px;color:#A3A6AC">' + t('Unlock creators\' real handles · from {price}/mo', { price: L.eur(59.99, 2) }) + '</span></span>' + I('chev', 18, 2) + '</button>';
    return h + '</div>';
  } });

  /* ───────── B-01…B-03 Onboarding ───────── */
  const obFrame = (x, step, title, sub, body, next, ok) => {
    x.fix(C.top({}));
    x.fix(C.abar({ btn: C.btn(t('Continue'), { kind: 'dark', full: 1, act: next, dis: !ok }) }));
    return '<div class="pad stack g20" style="padding-top:110px">' + C.stepHead(step, title, sub) + body + '</div>';
  };
  S('B-01', { name: 'Onboarding · Business name & category', render: (x) => {
    const o = x.ph.ob;
    return obFrame(x, 2, t('What\'s your business called?'), t('Creators see this on every campaign.'), C.field({ label: t('Business name'), bind: 'o.name', value: o.name, ph: t('e.g. Casa Brisa'), live: 1, auto: 'organization' }) +
      '<div class="stack g10"><b style="font-size:13px;color:var(--ink2)">' + t('Category') + '</b><div class="chips wrap">' + L.CATEGORIES.map((c) => C.chip(t(c), { on: o.category === c, set: 'o.category', val: c })).join('') + '</div></div>', 'obNext', (o.name || '').trim().length >= 2 && o.category);
  } });
  S('B-02', { name: 'Onboarding · Town', render: (x) => {
    const o = x.ph.ob;
    return obFrame(x, 3, t('Where are you?'), t('We show you creators nearby first. No map, just your town.'), '<div class="list" role="radiogroup" aria-label="' + t('Town') + '">' + L.TOWNS.map((tw) => '<button type="button" class="row" role="radio" aria-checked="' + (o.town === tw) + '" data-set="o.town" data-val="' + tw + '"><span class="ico grey">' + I('pin', 18, 2) + '</span><span class="rt"><b>' + t(tw) + '</b></span><span class="radio' + (o.town === tw ? ' on' : '') + '"></span></button>').join('') + '</div>' +
      C.field({ label: t('Street address (optional)'), bind: 'o.address', value: o.address, ph: 'Paseo Marítimo 12', help: t('Shown to creators you work with, so they can find you.'), auto: 'street-address' }), 'obNext2', !!o.town);
  } });
  L.A.obNext = (ph) => ph.go('B-02');
  L.A.obNext2 = (ph) => ph.go('B-03');
  S('B-03', { name: 'Onboarding · Sign in', render: (x) => {
    x.fix(C.top({}));
    return '<div class="pad stack g20" style="padding-top:110px">' + C.stepHead(4, t('Save {name}', { name: esc(x.ph.ob.name || t('your business')) }), t('Sign in so you can post campaigns and pay creators safely.')) + L.signInBody(x, 'business') + '</div>';
  } });
  L.finishBizOnboarding = (ph) => {
    const o = ph.ob, b = L.myBiz();
    Object.assign(b, { name: o.name || t('My business'), category: o.category || 'Restaurant', town: o.town || 'Marbella', address: o.address || '', owner: '' });
    b.meter = { logo: false, cover: false, desc: false, address: !!o.address };
    L.email('E-01', b.name, 'Your Lokaly sign-in code', {});
  };

  /* ───────── B-04 Profile checklist ───────── */
  const bizChecklist = (x) => {
    const m = x.me.meter;
    const item = (k, title, sub, act) => '<div class="row"><span class="check' + (m[k] ? ' on' : '') + '" aria-hidden="true">' + (m[k] ? I('check', 15, 3) : '') + '</span><span class="rt"><b>' + title + '</b><span>' + sub + '</span></span>' + (m[k] ? '<span class="meta">' + t('Done') + '</span>' : C.btn(t('Add'), { kind: 'sec', sm: 1, act: act[0], arg: act[1], go: act[2], aria: t('Add {item}', { item: title }) })) + '</div>';
    return C.list([item('logo', t('Logo'), t('Square, at least 400px'), ['quickAdd', 'logo']), item('cover', t('Cover photos'), t('Your venue at its best'), ['quickAdd', 'cover']), item('desc', t('Description'), t('What makes you, you'), [null, null, 'B-36']), item('address', t('Address'), t('So creators can find you'), [null, null, 'B-36'])]);
  };
  S('B-04', { name: 'Profile checklist', sheet: true, render: (x) => C.sheetHead(t('Finish your profile'), t('Profile {pct}% · complete it to publish campaigns.', { pct: L.bizMeter() })) + C.meter(L.bizMeter()) + '<div class="mt16">' + bizChecklist(x) + '</div>' });
  L.A.quickAdd = (ph, k) => {
    const b = L.myBiz(); b.meter[k] = true;
    if (k === 'cover') { b.cover = b.cover || L.img('restaurant'); b.photos = b.photos && b.photos.length ? b.photos : [L.img('restaurant'), L.img('brunch')]; }
    ph.toast(t(k === 'logo' ? 'Logo added' : 'Photos added'));
  };

  /* ───────── B-05 Discover creators ───────── */
  const fz = (ph) => (ph.fz = ph.fz || { town: 'All towns', niches: [], km: 25, plats: [], ver: false, q: '' });
  L.filterCreators = (ph) => {
    const f = fz(ph); const loc = L.W.perms.business.location === 'granted';
    return L.W.creators.filter((c) => c.first && !L.W.blocked.includes(c.id))
      .filter((c) => f.town === 'All towns' || c.town === f.town)
      .filter((c) => !f.niches.length || c.niches.some((n) => f.niches.includes(n)))
      .filter((c) => !f.ver || L.verified(c))
      .filter((c) => !f.plats.length || f.plats.some((p) => (p === 'Instagram' && (c.socials.ig.connected || c.socials.other.some((o) => o.platform === 'Instagram'))) || (p === 'TikTok' && c.socials.tt.connected) || (p === 'Other' && c.socials.other.length)))
      .filter((c) => !loc || c.km <= f.km)
      .sort((a, z) => (L.verified(z) + z.plus * 1.5) - (L.verified(a) + a.plus * 1.5) || a.km - z.km);
  };
  S('B-05', { name: 'Discover creators', tab: 'B-05', render: (x) => {
    const f = fz(x.ph); const list = L.filterCreators(x.ph); const mem = L.W.bizMe.membership;
    const loc = L.W.perms.business.location === 'granted';
    const towns = ['All towns'].concat(L.TOWNS.slice(0, 3));
    let h = '<div class="pad top-pad stack g16"><div class="hrow between"><span class="meta">' + t('Discover') + '</span><span class="hrow g8"><button type="button" class="gpill" data-go="' + (mem ? 'B-32' : 'B-11') + '" style="font-size:13px">' + I('unlock', 16, 2) + (mem ? t('{n} unlocks', { n: L.unlocksLeft() + '/' + mem.unlocks }) : t('Get unlocks')) + '</button>' + C.bell('business') + '</span></div>' +
      '<h1 class="lt">' + t('Creators in<br><i>{place}</i>', { place: esc(f.town === 'All towns' ? t('the Costa del Sol') : t(f.town)) }) + '</h1>' +
      '<div class="hrow g8"><button type="button" class="search grow" data-go="B-07" style="text-align:left">' + I('search', 18, 2) + '<span>' + t('Search name or niche') + '</span></button><button type="button" class="gbtn" data-go="B-06" aria-label="' + t(f.niches.length || f.ver || f.plats.length ? 'Filters, active' : 'Filters') + '" style="width:50px;height:50px;border-radius:25px">' + I('sliders', 20, 2) + ((f.niches.length || f.ver || f.plats.length) ? '<span class="dot"></span>' : '') + '</button></div>' +
      '<div class="chips">' + towns.map((tw) => C.chip(t(tw), { on: f.town === tw, set: 'z.town', val: tw, icon: tw === 'All towns' ? '' : I('pin', 14, 2) })).join('') + '</div>' +
      '<div class="chips">' + L.NICHES.map((n) => C.chip(t(n), { on: f.niches.includes(n), multi: 'z.niches', val: n })).join('') + '</div>';
    if (!loc) h += '<button type="button" class="banner info" data-act="locSetting" style="text-align:left;width:100%">' + I('pin', 18, 2) + '<span>' + t('Location is off, so distance is hidden. <b>Turn on</b>') + '</span></button>';
    h += '<div class="hrow between"><span class="meta">' + (list.length === 1 ? t('1 creator · Recommended') : t('{n} creators · Recommended', { n: list.length })) + '</span><span class="meta">' + t('Verified & Plus first') + '</span></div></div>';
    if (!list.length) return h + C.empty({ icon: 'search', title: t('No creators match'), body: t('Your filters are a little narrow. Try another town or fewer niches.'), cta: C.btn(t('Clear filters'), { kind: 'dark', sm: 1, act: 'clearFz' }) });
    return h + '<div class="pad mt16"><div class="crgrid">' + list.map(C.creatorCard).join('') + '</div></div>';
  } });
  L.A.clearFz = (ph) => { ph.fz = null; };
  // phone-level filter root
  const origGetPath = L.Phone.prototype.getPath;
  L.Phone.prototype.getPath = function (path) {
    if (path.startsWith('z.')) { const o = this.role === 'business' ? fz(this) : L.cfz(this); return [o, path.slice(2)]; }
    return origGetPath.call(this, path);
  };

  /* ───────── B-06 Filters ───────── */
  S('B-06', { name: 'Creator filters', sheet: true, render: (x) => {
    const f = fz(x.ph); const loc = L.W.perms.business.location === 'granted';
    return C.sheetHead(t('Filters')) + '<div class="stack g20">' +
      (loc ? '<label class="field"><span>' + t('Distance · within {km} km', { km: f.km }) + '</span><input class="range" type="range" min="1" max="50" value="' + f.km + '" data-bind="z.km" aria-label="' + t('Distance in km') + '"></label>' : C.banner('grey', 'pin', t('Distance needs location. Turn it on in Settings.'))) +
      '<div class="stack g10"><b style="font-size:13px;color:var(--ink2)">' + t('Niches') + '</b><div class="chips wrap">' + L.NICHES.map((n) => C.chip(t(n), { on: f.niches.includes(n), multi: 'z.niches', val: n })).join('') + '</div></div>' +
      '<div class="stack g10"><b style="font-size:13px;color:var(--ink2)">' + t('Platforms') + '</b><div class="chips wrap">' + ['Instagram', 'TikTok', 'Other'].map((n) => C.chip(n === 'Other' ? t('Other') : n, { on: f.plats.includes(n), multi: 'z.plats', val: n, icon: I(n === 'Instagram' ? 'insta' : n === 'TikTok' ? 'tiktok' : 'globe', 15, 2) })).join('') + '</div></div>' +
      C.list([C.togRow(t('Verified only'), t('Stats connected via Instagram or TikTok'), f.ver, { toggle: 'z.ver' })]) +
      '<div class="hrow">' + C.btn(t('Clear'), { kind: 'ghost', act: 'clearFz' }) + C.btn(L.filterCreators(x.ph).length === 1 ? t('Show 1 creator') : t('Show {n} creators', { n: L.filterCreators(x.ph).length }), { kind: 'dark', full: 1, close: 1, style: 'flex:1' }) + '</div></div>';
  } });

  /* ───────── B-07 Search ───────── */
  S('B-07', { name: 'Search creators', render: (x) => {
    const q = (x.f.q || '').trim().toLowerCase();
    x.fix('<div class="topbar solid">' + C.gbtn('back', { back: 1, aria: t('Back') }) + '<label class="search grow" style="min-height:44px">' + I('search', 18, 2) + '<span class="sr">' + t('Search creators') + '</span><input data-bind="q" data-live="1" placeholder="' + esc(t('Name or niche')) + '" value="' + esc(x.f.q || '') + '" autofocus style="min-height:42px"></label></div>');
    let h = '<div class="pad stack g16" style="padding-top:116px">';
    if (!q) {
      return h + '<b class="h2">' + t('Recent') + '</b><div class="chips wrap">' + ['Food', 'Sofía', 'Nightlife', 'Estepona'].map((r) => C.chip(L.NICHES.includes(r) ? t(r) : r, { set: 'q', val: r, icon: I('clock', 14, 2) })).join('') + '</div><b class="h2 mt8">' + t('Suggested') + '</b>' + C.list(L.W.creators.filter((c) => c.first && c.plus).map((c) => C.row({ av: C.av(c.photo, 44), title: esc(c.first) + ' ' + (L.verified(c) ? L.I.verified(14) : ''), sub: esc(NICHE(c) + ' · ' + t(c.town)), go: 'B-08:' + c.id }))) + '</div>';
    }
    const res = L.W.creators.filter((c) => c.first && !L.W.blocked.includes(c.id) && (c.first.toLowerCase().includes(q) || c.niches.some((n) => n.toLowerCase().includes(q) || t(n).toLowerCase().includes(q)) || c.town.toLowerCase().includes(q)));
    if (!res.length) return h + C.empty({ icon: 'search', title: t('No creators match "{q}"', { q: x.f.q }), body: t('Try a niche like Food or Fitness, or a town.') }) + '</div>';
    return h + '<span class="meta">' + (res.length === 1 ? t('1 result') : t('{n} results', { n: res.length })) + '</span>' + C.list(res.map((c) => C.row({ av: C.av(c.photo, 44), title: esc(c.first) + ' ' + (L.verified(c) ? L.I.verified(14) : ''), sub: esc(NICHE(c) + ' · ' + t(c.town)), go: 'B-08:' + c.id }))) + '</div>';
  } });

  /* ───────── B-08 Creator profile (business view) ───────── */
  L.creatorProfile = (x, cr, mode) => {
    const own = mode === 'own';
    const unlocked = !own && L.isUnlocked(cr.id);
    const done = L.W.collabs.filter((c) => c.creatorId === cr.id && c.status === 'completed');
    const ig = cr.socials.ig, tt = cr.socials.tt;
    if (!own) x.fix('<div class="topbar">' + C.gbtn('back', { back: 1, aria: t('Back'), clear: 1 }) + '<span class="grow"></span>' + C.gbtn('more', { go: 'S-22:cr:' + cr.id, aria: t('Report or block'), clear: 1 }) + '</div>');
    let h = '<div class="hero" style="height:' + (own ? 300 : 400) + 'px">' + C.ph(cr.photo || L.img('coast'), 'background-position:center 22%', cr.first) + '</div>' +
      '<div class="pad stack g20" style="margin-top:-40px;position:relative">' +
      '<div class="stack g8"><div class="hrow wrap" style="gap:8px">' + C.badges(cr) + '</div><h1 class="lt xl">' + esc(cr.first || t('You')) + '</h1><span class="sub">' + esc(NICHE(cr)) + ' · ' + esc(t(cr.town)) + ' · ' + t('On Lokaly since {date}', { date: esc(cr.joined) }) + '</span>' + (cr.bio ? '<p style="margin:4px 0 0;font-size:15px;line-height:22px">' + esc(cr.bio) + '</p>' : '') + '</div>';
    const statTiles = [];
    if (ig.connected) statTiles.push(C.tile({ tone: 'mint', label: 'Instagram', value: L.k(ig.followers), sub: t('followers · verified'), foot: t('{pct} engagement', { pct: PCT(ig.eng) }), foot2: t('30 days') }));
    if (tt.connected) statTiles.push(C.tile({ tone: 'sky', label: 'TikTok', value: L.k(tt.followers), sub: t('followers · verified'), foot: t('{pct} engagement', { pct: PCT(tt.eng) }), foot2: t('30 days') }));
    cr.socials.other.forEach((o) => statTiles.push('<div class="tile" style="background:#fff;border:1px solid var(--border)"><span class="tl">' + esc(o.platform) + '</span><span class="tv">' + L.k(o.followers) + '</span><span class="ts ink3">' + t('followers') + '</span><span class="tf"><span class="pill grey">' + t('Self-reported') + '</span></span></div>'));
    if (statTiles.length) h += '<div class="tiles">' + statTiles.join('') + '</div>';
    // handles
    const handles = [];
    if (ig.connected) handles.push(['insta', 'Instagram', ig.handle]);
    if (tt.connected) handles.push(['tiktok', 'TikTok', tt.handle]);
    cr.socials.other.forEach((o) => handles.push([o.platform === 'YouTube' ? 'youtube' : 'insta', o.platform, o.handle]));
    if (handles.length && !own) {
      h += '<div class="card p stack g8"><div class="hrow between"><h2 class="h2">' + t('Social handles') + '</h2>' + (unlocked ? C.pill(t('Unlocked@@handles'), 'ok', 'unlock') : C.pill(t('Locked'), 'grey', 'lock')) + '</div>' +
        handles.map((hd) => '<div class="handle"><span class="ico grey">' + I(hd[0], 18, 2) + '</span><span class="grow stack"><span class="meta">' + hd[1] + '</span><b class="' + (unlocked ? '' : 'blur') + '" aria-hidden="' + (!unlocked) + '">' + esc(unlocked ? hd[2] : '@' + 'xxxxxxxx'.slice(0, 6 + hd[1].length % 3)) + '</b>' + (unlocked ? '' : '<span class="sr">' + t('Hidden until unlocked') + '</span>') + '</span>' + (unlocked ? C.gbtn('copy', { act: 'copyHandle', aria: t('Copy {platform} handle', { platform: hd[1] }) }) + C.gbtn('ext', { act: 'openHandle', aria: t('Open {platform}', { platform: hd[1] }) }) : '') + '</div>').join('') +
        (unlocked ? '' : C.btn(t('Unlock handles'), { kind: 'dark', full: 1, icon: I('unlock', 18, 2), act: 'unlockStart', arg: cr.id }) + '<span class="meta center">' + t('Portfolio, stats, messages and invites are always free.') + '</span>') + '</div>';
    }
    if (own && handles.length) h += '<div class="card p stack g8"><div class="hrow between"><h2 class="h2">' + t('Your handles') + '</h2>' + C.pill(t('Hidden from businesses'), 'grey', 'lock') + '</div><span class="sub">' + t('Businesses see them only after they unlock you. Notifications always use your first name.') + '</span></div>';
    // portfolio
    h += '<div class="stack g12"><h2 class="h2">' + t('Portfolio') + '</h2>' + (cr.portfolio.length ? '<div class="thumbs" style="grid-template-columns:repeat(3,1fr)">' + cr.portfolio.map((p) => '<button type="button" class="ph" data-go="S-11:view:' + p + '" aria-label="' + t('Open portfolio photo') + '" style="background-image:url(' + p + ')"></button>').join('') + '</div>' : '<div class="card p sub">' + t(own ? 'Add 3 or more photos so businesses can see your style.' : 'No portfolio yet.') + '</div>') + '</div>';
    // collabs
    h += '<div class="stack g12"><h2 class="h2">' + t('Collabs on Lokaly') + '</h2>' + (done.length ? '<div class="mini-h">' + done.map(C.xcard).join('') + '</div>' : '<div class="card p hrow"><span class="ico sand" style="background:var(--tint);color:var(--detail)">' + I('spark', 18, 2) + '</span><span class="stack"><b>' + t('New on Lokaly') + '</b><span class="meta">' + t('No completed collabs yet') + '</span></span></div>') + '</div>';
    return h + '</div>';
  };
  S('B-08', { name: 'Creator profile', render: (x) => {
    const cr = L.cr(x.arg);
        x.fix(C.abar({ btn: C.btn(t('Message@@verb'), { kind: 'sec', act: 'messageCreator', arg: cr.id, style: 'flex:1' }) + C.btn(t('Invite@@verb'), { go: 'B-12:' + cr.id, style: 'flex:1.3' }) }));
    return L.creatorProfile(x, cr, 'biz');
  } });
  L.A.copyHandle = (ph) => ph.toast(t('Handle copied'));
  L.A.openHandle = (ph) => ph.toast(t('Opens the profile in the app'));
  L.A.messageCreator = (ph, id) => {
    let t = L.threadFor(L.W.bizMe.id, id);
    if (!t) { t = { id: L.id('t'), bizId: L.W.bizMe.id, creatorId: id, campaignId: (L.W.campaigns.find((k) => k.bizId === L.W.bizMe.id && k.status === 'active') || {}).id, msgs: [], unread: { business: 0, creator: 0 } }; L.W.threads.unshift(t); }
    ph.go('S-10:' + t.id);
  };
  L.A.unlockStart = (ph, id) => {
    ph.pendingUnlock = id;
    if (L.W.bizMe.membership && L.unlocksLeft() > 0) ph.go('B-09:' + id); else ph.go('B-11');
  };

  /* ───────── B-09 Unlock confirm ───────── */
  S('B-09', { name: 'Unlock confirm', sheet: true, render: (x) => {
    const cr = L.cr(x.arg); const m = L.W.bizMe.membership;
    return C.sheetHead(t('Unlock {name}?', { name: cr.first })) + '<div class="stack g16"><div class="hrow g12">' + C.av(cr.photo, 56, cr.first) + '<span class="stack"><b style="font-size:17px">' + esc(cr.first) + '</b><span class="meta">' + t('Use 1 of {n} unlocks left this month', { n: m.unlocks - m.used }) + '</span></span></div>' +
      C.list([C.row({ icon: 'insta', title: t('Instagram and TikTok handles'), chev: false }), C.row({ icon: 'link', title: t('Links to their profiles'), chev: false }), C.row({ icon: 'check', title: t('Stays unlocked for good'), sub: t('Even if your plan changes'), chev: false })]) +
      C.btn(t('Unlock · 1 credit'), { kind: 'dark', full: 1, act: 'unlockConfirm', arg: cr.id }) + '</div>';
  } });
  L.A.unlockConfirm = (ph, id) => { L.W.bizMe.membership.used++; L.W.bizMe.unlocked.push(id); ph.pendingUnlock = null; ph.sheets = []; ph.go('B-10:' + id); };

  /* ───────── B-10 Handles unlocked (Noir) ───────── */
  S('B-10', { name: 'Handles unlocked', noir: true, render: (x) => {
    const cr = L.cr(x.arg);
    const hs = []; if (cr.socials.ig.connected) hs.push(['insta', 'Instagram', cr.socials.ig.handle, cr.socials.ig.followers]); if (cr.socials.tt.connected) hs.push(['tiktok', 'TikTok', cr.socials.tt.handle, cr.socials.tt.followers]); cr.socials.other.forEach((o) => hs.push(['globe', o.platform, o.handle, o.followers]));
    x.fix('<div class="topbar">' + C.gbtn('close', { act: 'unlockDone', aria: t('Close') }) + '</div>');
    x.fix(C.abar({ btn: C.btn(t('Back to {name}', { name: cr.first }), { kind: 'white', full: 1, act: 'unlockDone' }) }));
    return '<div class="pad stack g24" style="padding-top:90px;align-items:center;text-align:center"><span class="caps" style="color:var(--n-mark);letter-spacing:.32em">' + t('Unlocked') + '</span>' +
      '<span data-in="pop" style="width:150px;height:150px;border-radius:75px;padding:4px;border:1px solid var(--n-line)">' + C.av(cr.photo, 140, cr.first) + '</span><h1 class="lt xl" style="color:var(--n-text)">' + esc(cr.first) + '</h1><p class="sub" style="margin:-8px 0 0">' + t('Now you know exactly who you\'re working with.') + '</p>' +
      '<div class="list" style="width:100%;text-align:left">' + hs.map((h, hi) => '<div class="row" data-in="up" data-d="' + (180 + hi * 60) + '"><span class="ico" style="background:var(--n-sel);color:var(--n-mark)">' + I(h[0], 18, 2) + '</span><span class="rt"><b>' + esc(h[2]) + '</b><span>' + h[1] + ' · ' + L.k(h[3]) + '</span></span>' + C.gbtn('copy', { act: 'copyHandle', aria: t('Copy {platform} handle', { platform: h[1] }) }) + C.gbtn('ext', { act: 'openHandle', aria: t('Open {platform}', { platform: h[1] }) }) + '</div>').join('') + '</div>' +
      (L.W.bizMe.membership ? '<span class="meta">' + (L.unlocksLeft() === 1 ? t('1 unlock left this month') : t('{n} unlocks left this month', { n: L.unlocksLeft() })) + '</span>' : '') + '</div>';
  } });
  L.A.unlockDone = (ph) => { while (ph.stack.length > 1 && ph.base().id !== 'B-08') ph.stack.pop(); ph.render(true); };

  /* ───────── B-11 Membership paywall (Noir) ───────── */
  S('B-11', { name: 'Membership paywall', noir: true, render: (x) => {
    const sel = x.f.plan || 'premium'; const cur = L.W.bizMe.membership;
    const plan = (k, name, desc) => {
      const p = L.PLANS[k]; const on = sel === k;
      return '<button type="button" class="plan' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" data-set="plan" data-val="' + k + '">' + (k === 'premium' ? '<span class="rec">' + t('RECOMMENDED') + '</span>' : '') + '<span class="pr">' + (on ? I('check', 12, 3) : '') + '</span><span class="grow stack"><span class="pn">' + (cur && cur.plan === k ? t('{plan} · CURRENT', { plan: name }) : name) + '</span><span class="pd">' + desc + '</span><span class="pbar"><i style="width:' + p.unlocks + '%;opacity:' + (on ? 1 : 0.55) + '"></i></span></span><span class="pp">' + SUP(Math.floor(p.price)) + '<small>' + (isES() ? ',' : '.') + '99</small></span></button>';
    };
    const p = L.PLANS[sel];
    x.fix('<div class="topbar">' + C.gbtn('close', { back: 1, aria: t('Close') }) + '<span class="grow"></span><span class="caps" style="color:var(--n-mark);letter-spacing:.28em;font-size:11px">' + t('Lokaly membership') + '</span></div>');
    x.fix(C.abar({ btn: C.btn(cur && cur.plan === sel ? t('Your current plan') : t(cur ? 'Switch to {plan} · {price}/mo' : 'Continue with {plan} · {price}/mo', { plan: sel.charAt(0).toUpperCase() + sel.slice(1), price: L.eur(p.price, 2) }), { kind: 'white', full: 1, go: 'IAP:biz:' + sel, dis: cur && cur.plan === sel }) }));
    return '<div class="pad stack g24" style="padding-top:120px"><div class="stack g12"><h1 class="lt xl" style="font-size:46px;line-height:46px">' + t('Know exactly who you\'re <i>working with.</i>').replace('<i>', '<i style="color:var(--n-mark)">') + '</h1><p class="sub" style="margin:0;font-size:15px;line-height:22px">' + t('Unlock a creator\'s Instagram and TikTok handles. Browsing, messaging and invites stay free.') + '</p></div>' +
      (cur ? '<div class="banner" style="background:var(--n-raised);color:var(--n-muted)">' + I('check', 18, 2) + '<span>' + t('You\'re on {plan}. Upgrades apply now; downgrades from your next renewal.', { plan: cur.plan }) + '</span></div>' : '') +
      '<div class="stack g12" role="radiogroup" aria-label="' + t('Plans') + '">' + plan('minimum', 'MINIMUM', t('{n} unlocks a month', { n: 10 })) + plan('premium', 'PREMIUM', t('{n} unlocks a month', { n: 30 })) + plan('exclusive', 'EXCLUSIVE', t('{n} unlocks a month', { n: 100 })) + '<span class="meta" style="text-align:right">' + t('Prices per month, VAT included') + '</span></div>' +
      '<div class="stack g16"><div class="perk"><span class="pk">' + I('lock', 18, 1.8) + '</span><span><b>' + t('Handles and links, one tap') + '</b><span>' + t('Open the creator\'s real profiles before you invest.') + '</span></span></div><div class="perk"><span class="pk">' + I('check', 18, 1.8) + '</span><span><b>' + t('Unlocked stays unlocked') + '</b><span>' + t('Unused unlocks reset each month.') + '</span></span></div></div>' +
      '<p class="legal">' + t('Billed monthly to your Apple ID. Renews automatically unless cancelled at least 24 hours before the period ends. Manage or cancel in Settings.') + ' <button type="button" class="link" data-go="S-19:view" style="min-height:0;font-size:11px">' + t('Terms') + '</button> · <button type="button" class="link" data-go="S-19:view" style="min-height:0;font-size:11px">' + t('Privacy') + '</button></p>' +
      '<div class="center">' + C.btn(t('Restore purchases'), { kind: 'ghost', act: 'restore', arg: 'biz', style: 'color:var(--n-text)' }) + '</div></div>';
  } });

  /* ───────── B-12 Invite sheet ───────── */
  S('B-12', { name: 'Invite to campaign', sheet: true, render: (x) => {
    const cr = L.cr(x.arg);
    const camps = L.W.campaigns.filter((k) => k.bizId === L.W.bizMe.id && k.status === 'active');
    if (!camps.length) return C.sheetHead(t('Invite {name}', { name: cr.first })) + C.empty({ icon: 'plus', title: t('No live campaigns'), body: t('Create a campaign first, then invite {name} to it.', { name: cr.first }), cta: C.btn(t('Create campaign'), { kind: 'dark', sm: 1, act: 'toCreate' }) });
    const sel = x.f.k;
    const rows = camps.map((k) => {
      const ex = L.W.collabs.find((c) => c.campaignId === k.id && c.creatorId === cr.id && !['declined', 'withdrawn', 'expired', 'cancelled'].includes(c.status));
      return '<button type="button" class="row" role="radio" aria-checked="' + (sel === k.id) + '"' + (ex ? ' aria-disabled="true" style="opacity:.45;pointer-events:none"' : ' data-set="k" data-val="' + k.id + '"') + '>' + C.ph(k.cover, 'width:48px;height:48px;border-radius:12px;flex-shrink:0') + '<span class="rt"><b>' + esc(k.title) + '</b><span>' + (ex ? t('Already {status}', { status: t(L.STATUS[ex.status][0]).toLowerCase() }) : k.type === 'paid' ? L.eur(k.rate) + ' · ' + SLOTS(L.slotsLeft(k)) : t('Experience · {offer}', { offer: esc(k.offer) })) + '</span></span><span class="radio' + (sel === k.id ? ' on' : '') + '"></span></button>';
    });
    return C.sheetHead(t('Invite {name}', { name: cr.first }), t('Invites are free. {name} sees the rate and brief, then accepts or declines.', { name: cr.first })) + '<div class="list" role="radiogroup" aria-label="' + t('Campaign') + '">' + rows.join('') + '</div><div class="mt16">' + C.field({ label: t('Note (optional)'), bind: 'note', value: x.f.note, textarea: 1, ph: t('Why you\'d love to work with them') }) + '</div><div class="mt16">' + C.btn(t('Send invite'), { kind: 'dark', full: 1, act: 'sendInvite', arg: cr.id, dis: !sel }) + '</div>';
  } });
  L.A.toCreate = (ph) => { ph.sheets = []; ph.tab('B-14'); };
  L.A.sendInvite = (ph, crId) => {
    const f = ph.top().f; const k = L.camp(f.k); const b = L.myBiz(); const cr = L.cr(crId);
    const col = { id: L.id('col'), campaignId: k.id, creatorId: crId, status: 'invited', note: f.note || '', visitDate: null, submission: null, submittedAt: null, history: [{ s: 'invited', at: L.W.now }] };
    L.W.collabs.push(col);
    L.post(b.id, crId, { from: 'sys', deal: 'invite', collabId: col.id }, k.id);
    if (f.note) L.post(b.id, crId, { from: 'biz', text: f.note }, k.id);
    L.notify('creator', { icon: 'mail', tone: 'lilac', msg: '{biz} invited you to {title}', p: { biz: { biz: b.id }, title: { camp: k.id } }, go: 'C-13:' + col.id });
    ph.sheets = []; ph.toast(t('Invite sent to {name}', { name: cr.first }));
  };

  /* ───────── B-13 Campaigns ───────── */
  S('B-13', { name: 'Campaigns', render: (x) => {
    const seg = x.f.seg || 'active';
    const mine = L.W.campaigns.filter((k) => k.bizId === L.W.bizMe.id);
    const list = mine.filter((k) => k.status === seg);
    const drafts = L.W.drafts.filter((d) => d.bizId === L.W.bizMe.id);
    x.fix(C.top({ title: '', right: C.btn(t('Create'), { sm: 1, icon: I('plus', 18, 2.2), tab: 'B-14' }) }));
    let h = '<div class="pad stack g16" style="padding-top:110px"><h1 class="lt">' + t('Campaigns') + '</h1>' + C.seg('seg', [{ v: 'active', label: t('Active@@campaigns'), count: mine.filter((k) => k.status === 'active').length }, { v: 'closed', label: t('Closed') }], seg);
    if (drafts.length) h += C.list([C.row({ icon: 'edit', tone: 'sand', title: t('Drafts'), sub: t('{n} saved automatically', { n: drafts.length }), right: String(drafts.length), go: 'B-21' })]);
    if (!list.length) return h + (seg === 'active' ? C.empty({ icon: 'plus', title: t('No live campaigns'), body: t('Post a Paid or Experience campaign and local creators can apply today.'), cta: C.btn(t('Create campaign'), { kind: 'dark', sm: 1, tab: 'B-14' }) }) : C.empty({ icon: 'doc', title: t('Nothing closed yet'), body: t('Finished campaigns move here.') })) + '</div>';
    return h + C.list(list.map((k) => { const ap = L.W.collabs.filter((c) => c.campaignId === k.id && c.status === 'applied').length; return '<button type="button" class="row" data-go="B-22:' + k.id + '">' + C.ph(k.cover, 'width:60px;height:60px;border-radius:14px;flex-shrink:0') + '<span class="rt"><b>' + esc(k.title) + '</b><span>' + (k.type === 'paid' ? t('{rate} per creator', { rate: L.eur(k.rate) }) : t('Experience')) + ' · ' + (k.status === 'active' ? t('Apply by {date}', { date: L.dshort(k.applyBy) }) : t('Closed@@campaign')) + '</span><span class="hrow" style="gap:6px;margin-top:4px">' + C.pill(t(k.type === 'paid' ? 'Paid' : 'Experience'), k.type === 'paid' ? 'peach' : 'sky') + (ap ? C.pill(t('{n} new', { n: ap }), 'mint') : '') + '</span></span>' + I('chev', 16, 2) + '</button>'; })) + '</div>';
  } });

  /* ───────── B-14…B-18 Wizard ───────── */
  const newDraft = (type) => ({ id: L.id('d'), bizId: L.W.bizMe.id, type, step: 1, title: '', photos: [], category: L.myBiz().category || '', town: L.myBiz().town || '', address: L.myBiz().address || '', brief: '', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }], mustInclude: L.myBiz().ig || '', donts: '', rate: '', slots: 2, offer: '', value: '', applyBy: DAY_IN(L.W.now + 10 * L.D), visitFrom: DAY_IN(L.W.now + 2 * L.D), visitTo: DAY_IN(L.W.now + 21 * L.D) });
  // Same stepper as onboarding (C.stepHead): the top bar names the flow, the page carries the 4-segment bar and the step title.
  const wizTop = (x, step, title) => {
    const d = x.ph.draft, saved = d && d.savedAt;
    x.fix('<div class="topbar solid">' + C.gbtn('back', { back: 1, aria: t('Back') }) + '<div class="tt">' + t(d && d.editing ? 'Edit campaign' : 'New campaign') + '</div>' + C.gbtn('close', { act: 'wizExit', aria: t('Save draft and exit') }) + '</div>');
    return C.stepHead(step, title, null, t(saved ? 'Step {n} of 4 · Draft saved' : 'Step {n} of 4', { n: step }));
  };
  const wizValid = (d, step) => {
    const e = {};
    if (step === 1) { if ((d.title || '').trim().length < 4) e.title = t('Give it a title of at least 4 characters'); if (!d.photos.length) e.photos = t('Add at least one cover photo'); if (!d.category) e.category = t('Pick a category'); if (!d.town) e.town = t('Pick a town'); }
    if (step === 2) { if ((d.brief || '').trim().length < 20) e.brief = t('Describe what you want in at least 20 characters'); if (!d.deliverables.length) e.deliv = t('Add at least one deliverable'); }
    if (step === 3) {
      if (d.type === 'paid') { if (!(+d.rate >= 50)) e.rate = t('Minimum rate is {amt}', { amt: L.eur(50) }); }
      else { if (!(d.offer || '').trim()) e.offer = t('Say what creators get'); if (!(+d.value > 0)) e.value = t('Add an estimated value'); }
      if (!d.applyBy) e.applyBy = t('Required'); if (!d.visitFrom || !d.visitTo) e.visit = t('Set the visit window'); else if (d.visitTo < d.visitFrom) e.visit = t('The window ends before it starts');
    }
    return e;
  };
  const saveDraft = (ph) => { const d = ph.draft; if (d.editing) return; d.edited = L.W.now; d.savedAt = L.W.now; d.cover = d.photos[0] || null; const i = L.W.drafts.findIndex((y) => y.id === d.id); if (i >= 0) L.W.drafts[i] = d; else L.W.drafts.unshift(d); };
  L.A.wizNext = (ph, step) => {
    step = +step; const d = ph.draft; const e = wizValid(d, step);
    if (Object.keys(e).length) { d.tried = step; return; }
    d.tried = 0; d.step = Math.max(d.step || 1, step + 1); saveDraft(ph);
    ph.go(['B-15', 'B-16', 'B-17', 'B-18'][step]);
  };
  L.A.wizExit = (ph) => { saveDraft(ph); ph.toast(t(ph.draft.editing ? 'Changes discarded' : 'Draft saved')); ph.tab('B-13'); };
  const wizFooter = (x, step, label) => x.fix(C.abar({ btn: C.btn(label || t('Next'), { kind: 'dark', full: 1, act: 'wizNext', arg: step }) }));
  const err = (d, step, k) => (d.tried === step ? wizValid(d, step)[k] : null);

  S('B-14', { name: 'Wizard · Campaign type', tab: 'B-14', guard: (ph) => (L.bizMeter() < 100 ? 'B-24' : null), render: (x) => {
    const drafts = L.W.drafts.filter((d) => d.bizId === L.W.bizMe.id);
    const card = (t, title, sub, icon, tone) => '<button type="button" class="card p stack g10" data-act="wizType" data-arg="' + t + '" style="width:100%;text-align:left;border:1px solid var(--border);box-shadow:none"><span class="ico ' + tone + '" style="width:48px;height:48px;border-radius:24px">' + I(icon, 22, 2) + '</span><b class="serif" style="font-size:28px;font-weight:400;line-height:30px">' + title + '</b><span class="sub">' + sub + '</span></button>';
    return '<div class="pad top-pad stack g16"><div class="hrow between"><span class="meta">' + t('New campaign') + '</span>' + C.bell('business') + '</div><h1 class="lt">' + t('What are you offering?') + '</h1>' +
      card('paid', t('Paid'), t('You pay creators a fixed rate. Funds are held safely and released when you approve the post, or automatically 72h after it is submitted.'), 'euro', 'peach') +
      card('experience', t('Experience'), t('Offer your service in kind: a dinner, a treatment, a daybed. {amt} booking fee at publish.', { amt: L.eur(39.99, 2) }), 'gift', 'sky') +
      (drafts.length ? C.list([C.row({ icon: 'edit', tone: 'grey', title: t('Resume a draft'), sub: drafts[0].title || t('Untitled · saved {ago}', { ago: L.ago(drafts[0].edited) }), right: drafts.length > 1 ? String(drafts.length) : '', go: 'B-21' })]) : '') + '</div>';
  } });
  L.A.wizType = (ph, t) => { ph.draft = newDraft(t); ph.go('B-15'); };

  S('B-15', { name: 'Wizard · Essentials', render: (x) => {
    const d = x.ph.draft; const head = wizTop(x, 1, t('Essentials')); wizFooter(x, 1);
    const pics = ['coast', 'brunch', 'restaurant', 'spa', 'nightlife', 'fitness', 'fashion'].map(L.img).filter((p) => !d.photos.includes(p));
    return '<div class="pad stack g20" style="padding-top:110px">' + head + C.pill(t(d.type === 'paid' ? 'Paid campaign' : 'Experience campaign'), d.type === 'paid' ? 'peach' : 'sky') +
      C.field({ label: t('Campaign title'), bind: 'd.title', value: d.title, ph: t('e.g. Sunset daybed reel'), err: err(d, 1, 'title'), max: 60 }) +
      '<div class="field"><span>' + t('Cover photos') + ' <span class="meta">(' + d.photos.length + '/6)</span></span><div class="thumbs">' + d.photos.map((p, i) => '<div class="ph" style="background-image:url(' + p + ')"><button type="button" class="x" data-act="wizPhotoDel" data-arg="' + i + '" aria-label="' + t('Remove photo') + '">' + I('close', 14, 2.4) + '</button></div>').join('') + (d.photos.length < 6 ? '<button type="button" class="upl" style="min-height:0;aspect-ratio:1" data-act="wizPhoto" data-arg="' + (pics[0] || '') + '" aria-label="' + t('Add photo') + '">' + I('plus', 22, 2) + '</button>' : '') + '</div>' + (err(d, 1, 'photos') ? '<small class="err">' + err(d, 1, 'photos') + '</small>' : '<small>' + t('The first photo is the cover creators see.') + '</small>') + '</div>' +
      '<div class="field"><span>' + t('Category') + '</span><div class="chips wrap">' + L.CATEGORIES.map((c) => C.chip(t(c), { on: d.category === c, set: 'd.category', val: c })).join('') + '</div></div>' +
      '<div class="field"><span>' + t('Town') + '</span><div class="chips wrap">' + L.TOWNS.map((c) => C.chip(t(c), { on: d.town === c, set: 'd.town', val: c })).join('') + '</div></div>' +
      C.field({ label: t('Venue address'), bind: 'd.address', value: d.address, ph: t('Street, number, town'), help: t('Shown as text with an Open in Maps link. No map in the app.') }) + '</div>';
  } });
  L.A.wizPhoto = (ph, p) => { if (p) ph.draft.photos.push(p); };
  L.A.wizPhotoDel = (ph, i) => { ph.draft.photos.splice(+i, 1); };

  const PLATFORMS = ['Instagram', 'TikTok', 'YouTube'], FORMATS = { Instagram: ['Reel', 'Stories', 'Post', 'Carousel'], TikTok: ['Video'], YouTube: ['Short', 'Video'] };
  S('B-16', { name: 'Wizard · Brief', render: (x) => {
    const d = x.ph.draft; const head = wizTop(x, 2, t('Brief')); wizFooter(x, 2);
    // Each deliverable is a grouped list: Platform and Format open list pickers, How many is a stepper row.
    const rows = d.deliverables.map((v, i) => '<div class="stack g8"><div class="hrow between" style="min-height:44px"><b style="font-size:14px">' + t('Deliverable {n}', { n: i + 1 }) + '</b>' + (d.deliverables.length > 1 ? '<button type="button" class="btn ghost sm" data-act="delivDel" data-arg="' + i + '" aria-label="' + t('Remove deliverable {n}', { n: i + 1 }) + '">' + I('trash', 16, 2) + '</button>' : '') + '</div>' +
      C.list([C.pick({ label: t('Platform'), bind: 'd.deliverables.' + i + '.platform', kind: 'list', value: v.platform, opts: PLATFORMS.map((p) => ({ v: p, label: p })), after: 'delivFix' }),
        C.pick({ label: t('Format'), bind: 'd.deliverables.' + i + '.format', kind: 'list', value: v.format, opts: (FORMATS[v.platform] || FORMATS.Instagram).map((p) => ({ v: p, label: t(p) })) }),
        '<div class="row" style="min-height:52px;padding:4px 0"><span class="rt"><b style="font-weight:500">' + t('How many') + '</b></span><span class="stepper"><button type="button" data-act="delivCnt" data-arg="' + i + '|-1" aria-label="' + t('Fewer') + '">−</button><span aria-live="polite">' + v.count + '</span><button type="button" data-act="delivCnt" data-arg="' + i + '|1" aria-label="' + t('More') + '">+</button></span></div>']) + '</div>').join('');
    return '<div class="pad stack g20" style="padding-top:110px">' + head + C.field({ label: t('What should creators capture?'), bind: 'd.brief', value: d.brief, textarea: 1, ph: t('The mood, the moment, what must be in shot…'), err: err(d, 2, 'brief'), help: t('Write it like you\'d brief a friend. Spanish runs about 30% longer, so keep it tight.') }) +
      '<div class="field"><span>' + t('Deliverables') + '</span>' + rows + '<button type="button" class="btn sec sm" data-act="delivAdd" style="align-self:flex-start">' + I('plus', 16, 2) + t('Add deliverable') + '</button></div>' +
      C.field({ label: t('Must include'), bind: 'd.mustInclude', value: d.mustInclude, ph: t('@yourhandle · #YourHashtag') }) + C.field({ label: t('Please avoid (optional)'), bind: 'd.donts', value: d.donts, ph: t('e.g. No other brands in shot') }) +
      C.banner('grey', 'doc', t('You may repost delivered content on your own channels with credit for 12 months.') + '<br>' + C.oq(t('Clause pending Matt\'s terms.'))) + '</div>';
  } });
  L.A.delivFix = (ph, bind) => { const v = ph.draft.deliverables[+bind.split('.')[2]]; const ok = FORMATS[v.platform] || FORMATS.Instagram; if (!ok.includes(v.format)) v.format = ok[0]; };
  L.A.delivAdd = (ph) => ph.draft.deliverables.push({ platform: 'Instagram', format: 'Stories', count: 3 });
  L.A.delivDel = (ph, i) => ph.draft.deliverables.splice(+i, 1);
  L.A.delivCnt = (ph, a) => { const [i, dlt] = a.split('|'); const v = ph.draft.deliverables[+i]; v.count = Math.max(1, Math.min(10, v.count + +dlt)); };

  S('B-17', { name: 'Wizard · Budget & timing', render: (x) => {
    const d = x.ph.draft; const head = wizTop(x, 3, t('Budget & timing')); wizFooter(x, 3);
    let money;
    if (d.type === 'paid') {
      const r = +d.rate || 0;
      money = C.field({ label: t('Rate per creator'), bind: 'd.rate', value: d.rate, pre: '€', type: 'number', mode: 'decimal', live: 1, err: err(d, 3, 'rate'), ph: '200' }) +
        '<div class="field"><span>' + t('How many creators?') + '</span><span class="hrow between"><span class="sub">' + t('Up to {n} can be accepted', { n: d.slots }) + '</span><span class="stepper"><button type="button" data-act="slots" data-arg="-1" aria-label="' + t('Fewer creators') + '">−</button><span>' + d.slots + '</span><button type="button" data-act="slots" data-arg="1" aria-label="' + t('More creators') + '">+</button></span></span></div>' +
        '<div class="card p stack g8"><b>' + t('What you pay') + '</b>' + C.money([[t('Creator rate'), L.eur(r, 2)], [t('Lokaly fee 10%'), L.eur(r * 0.1, 2)], [t('Per creator'), L.eur(r * 1.1, 2), 1], [t('If all {n} are filled', { n: d.slots }), L.eur(r * 1.1 * d.slots, 2)]]) + '<span class="meta">' + t('Charged only when you accept someone. Held by Stripe until you approve, or 72h after the post is submitted.') + '</span></div>';
    } else {
      money = C.field({ label: t('What creators get'), bind: 'd.offer', value: d.offer, ph: t('e.g. Dinner for two with wine'), err: err(d, 3, 'offer') }) + C.field({ label: t('Estimated value'), bind: 'd.value', value: d.value, pre: '€', type: 'number', mode: 'decimal', err: err(d, 3, 'value'), ph: '120', help: t('Helps creators judge the offer. Not charged.') }) +
        '<div class="field"><span>' + t('How many creators?') + '</span><span class="hrow between"><span class="sub">' + t('Up to {n}', { n: d.slots }) + '</span><span class="stepper"><button type="button" data-act="slots" data-arg="-1" aria-label="' + t('Fewer creators') + '">−</button><span>' + d.slots + '</span><button type="button" data-act="slots" data-arg="1" aria-label="' + t('More creators') + '">+</button></span></span></div>' +
        C.banner('info', 'gift', t('No money is held for Experience collabs. You pay a flat {amt} booking fee when you publish.', { amt: L.eur(39.99, 2) }));
    }
    // Dates are app rows that open the wheel picker; values stay 'YYYY-MM-DD' on the same draft paths.
    const ve = err(d, 3, 'visit'), ae = err(d, 3, 'applyBy');
    return '<div class="pad stack g20" style="padding-top:110px">' + head + money +
      '<div class="field">' + C.list([
        C.pick({ label: t('Applications close'), bind: 'd.applyBy', kind: 'date', value: d.applyBy, min: DAY_IN(L.W.now), err: ae }),
        C.pick({ label: t('Visit from'), bind: 'd.visitFrom', kind: 'date', value: d.visitFrom, min: DAY_IN(L.W.now), err: ve }),
        C.pick({ label: t('Visit to'), bind: 'd.visitTo', kind: 'date', value: d.visitTo, min: DAY_IN(L.W.now), err: ve })]) +
      (ae || ve ? '<small class="err">' + (ae ? t('Applications close') + ': ' + ae : ve) + '</small>' : '<small>' + t('Each creator agrees an exact time with you in chat.') + '</small>') + '</div></div>';
  } });
  L.A.slots = (ph, dlt) => { ph.draft.slots = Math.max(1, Math.min(20, ph.draft.slots + +dlt)); };

  S('B-18', { name: 'Wizard · Review & publish', render: (x) => {
    const d = x.ph.draft; const head = wizTop(x, 4, t('Review'));
    const r = +d.rate || 0;
    const edit = (step) => '<button type="button" class="link" data-act="wizEdit" data-arg="' + step + '">' + t('Edit') + '</button>';
    const preview = { id: 'preview', bizId: L.W.bizMe.id, type: d.type, title: d.title, cover: d.photos[0], town: d.town, km: L.myBiz().km || 1.2, rate: r, offer: d.offer || '', applyBy: new Date(d.applyBy).getTime() };
    x.fix(C.abar({ title: d.type === 'paid' ? L.eur(r * 1.1, 2) : L.eur(39.99, 2), sub: t(d.type === 'paid' ? 'per creator, when you accept' : 'booking fee, today'), btn: C.btn(t(d.editing ? 'Save changes' : d.type === 'paid' ? 'Publish' : 'Pay & publish'), { act: 'publish', kind: !d.editing && d.type !== 'paid' ? 'pri' : 'dark' }) }));
    return '<div class="pad stack g20" style="padding-top:110px">' + head + '<span class="meta">' + t('As creators will see it') + '</span><div style="pointer-events:none">' + C.campaignCard(preview, { go: '' }) + '</div>' +
      '<div class="card p stack g10"><div class="hrow between"><h2 class="h2">' + t('Essentials') + '</h2>' + edit(1) + '</div><span class="sub">' + esc(t(d.category)) + ' · ' + esc(t(d.town)) + (d.address ? ' · ' + esc(d.address) : '') + ' · ' + (d.photos.length === 1 ? t('1 photo') : t('{n} photos', { n: d.photos.length })) + '</span></div>' +
      '<div class="card p stack g10"><div class="hrow between"><h2 class="h2">' + t('Brief') + '</h2>' + edit(2) + '</div><span class="sub">' + esc(d.brief) + '</span><div class="chips wrap">' + d.deliverables.map((v) => C.pill(DLV(v), 'sand')).join('') + '</div></div>' +
      '<div class="card p stack g10"><div class="hrow between"><h2 class="h2">' + t('Budget & timing') + '</h2>' + edit(3) + '</div>' + (d.type === 'paid' ? C.money([[t('Rate per creator'), L.eur(r, 2)], [t('Lokaly fee 10%'), L.eur(r * 0.1, 2)], [t('You pay per creator'), L.eur(r * 1.1, 2), 1], [t('Creators'), String(d.slots)]]) : C.money([[t('Offer'), esc(d.offer)], [t('Estimated value'), L.eur(+d.value || 0)], [t('Creators'), String(d.slots)], [t('Booking fee today'), L.eur(39.99, 2), 1]])) + '<span class="meta">' + t('Applications close {date} · Visits {from}–{to}', { date: L.date(new Date(d.applyBy).getTime()), from: L.dshort(new Date(d.visitFrom).getTime()), to: L.dshort(new Date(d.visitTo).getTime()) }) + '</span></div>' +
      C.banner('grey', 'bolt', t('Creator Plus members see new campaigns 24 hours before everyone else.')) + '</div>';
  } });
  L.A.wizEdit = (ph, step) => { const ids = ['B-15', 'B-16', 'B-17']; while (ph.stack.length > 1 && ph.base().id !== ids[step - 1]) ph.stack.pop(); ph.render(true); };
  L.A.publish = (ph) => {
    const d = ph.draft;
    if (d.editing) { const k = L.camp(d.editing); Object.assign(k, { title: d.title, cover: d.photos[0], brief: d.brief, deliverables: d.deliverables, mustInclude: d.mustInclude, donts: d.donts, applyBy: new Date(d.applyBy).getTime() }); ph.toast(t('Campaign updated')); ph.go('B-22:' + k.id, { root: 1 }); return; }
    if (L.bizMeter() < 100) { ph.go('B-24'); return; }
    if (d.type === 'experience') { ph.go('B-19'); return; }
    L.publishDraft(ph, false);
  };
  L.publishDraft = (ph, feePaid) => {
    const d = ph.draft; const b = L.myBiz();
    const k = { id: L.id('k'), bizId: b.id, type: d.type, title: d.title, cover: d.photos[0], category: d.category, town: d.town, km: b.km || 1.2, rate: +d.rate || 0, offer: d.offer, value: +d.value || 0, slots: d.slots, applyBy: new Date(d.applyBy).getTime() + 20 * L.H, visitFrom: new Date(d.visitFrom).getTime(), visitTo: new Date(d.visitTo).getTime(), status: 'active', published: L.W.now, earlyUntil: L.W.now + 24 * L.H, niches: [], brief: d.brief, deliverables: d.deliverables, mustInclude: d.mustInclude, donts: d.donts };
    k.niches = { Restaurant: ['Food'], 'Beach club': ['Beach & lifestyle', 'Food'], Hotel: ['Travel'], 'Spa & beauty': ['Beauty'], Fitness: ['Fitness'], Retail: ['Fashion'], Nightlife: ['Nightlife'], Experiences: ['Travel'] }[d.category] || [];
    L.W.campaigns.unshift(k);
    L.W.drafts = L.W.drafts.filter((y) => y.id !== d.id);
    if (feePaid) { L.W.txns.unshift({ id: L.id('tx'), bizId: b.id, kind: 'fee', campaignId: k.id, amount: 39.99, at: L.W.now, ref: 'pi_' + L.W.seq + 'Lk' }); L.email('E-02', b.name, 'Receipt · Experience booking fee {amt}', { campaign: k.id }, { amt: { eur: 39.99, d: 2 } }); }
    L.notify('creator', { icon: 'bolt', tone: 'sky', msg: L.W.crMe.plus ? 'Early access · {biz}: {title}' : 'New near you · {biz}: {title}', p: { biz: { biz: b.id }, title: { camp: k.id } }, go: 'C-09:' + k.id, cat: 'collabs' });
    ph.lastPublished = k.id; ph.draft = null;
    ph.go('B-20:' + k.id, { root: 1 });
  };

  /* ───────── B-19 Experience fee checkout ───────── */
  S('B-19', { name: 'Experience fee checkout', sheet: true, render: (x) => L.paySheet(x, 39.99, t('Publish {title}', { title: x.ph.draft ? x.ph.draft.title : '' }), 'fee', 'draft') });

  /* ───────── B-20 Published ───────── */
  S('B-20', { name: 'Published', render: (x) => {
    const k = L.camp(x.arg);
    x.fix('<div class="topbar">' + C.gbtn('close', { tab: 'B-00', aria: t('Close') }) + '</div>');
    return C.success({ title: t('It\'s live.'), sub: t('{title} is on Lokaly. Plus creators see it first, then everyone in {town} tomorrow.', { title: esc(k.title), town: esc(t(k.town)) }),
      body: '<div style="pointer-events:none">' + C.campaignCard(k, { go: '' }) + '</div>' +
        '<div class="stack g10">' + C.btn(t('Invite creators'), { kind: 'dark', full: 1, act: 'inviteFromPublished', arg: k.id }) + C.btn(t('View campaign'), { kind: 'sec', full: 1, go: 'B-22:' + k.id }) + C.btn(t('Done'), { kind: 'ghost', full: 1, tab: 'B-00' }) + '</div>' });
  } });
  L.A.inviteFromPublished = (ph, id) => { const k = L.camp(id); ph.fz = { town: 'All towns', niches: k.niches.slice(), km: 25, plats: [], ver: false }; ph.tab('B-05'); ph.toast(k.niches.length ? t('Showing {niches} creators', { niches: k.niches.map((n) => t(n)).join(', ') }) : t('Showing all creators')); };

  /* ───────── B-21 Drafts ───────── */
  S('B-21', { name: 'Drafts', render: (x) => {
    const ds = L.W.drafts.filter((d) => d.bizId === L.W.bizMe.id);
    x.fix(C.top({ title: t('Drafts'), solid: 1 }));
    if (!ds.length) return '<div style="padding-top:140px">' + C.empty({ icon: 'edit', title: t('No drafts'), body: t('Anything you start in the wizard saves here automatically.'), cta: C.btn(t('Create campaign'), { kind: 'dark', sm: 1, tab: 'B-14' }) }) + '</div>';
    return '<div class="pad stack g16" style="padding-top:116px">' + C.list(ds.map((d) => '<div class="row">' + (d.cover ? C.ph(d.cover, 'width:56px;height:56px;border-radius:14px;flex-shrink:0') : '<span class="ico grey" style="width:56px;height:56px;border-radius:14px">' + I('image', 20, 2) + '</span>') + '<button type="button" class="rt" data-act="resumeDraft" data-arg="' + d.id + '" style="text-align:left;min-height:48px;justify-content:center"><b>' + esc(d.title || t('Untitled campaign')) + '</b><span>' + t('{type} · Step {n} of 4 · {ago}', { type: t(d.type === 'paid' ? 'Paid' : 'Experience'), n: Math.min(d.step, 4), ago: L.ago(d.edited) }) + '</span></button>' + C.gbtn('trash', { act: 'delDraft', arg: d.id, aria: t('Delete draft {title}', { title: d.title || t('Untitled') }) }) + '</div>')) + '<p class="meta center">' + t('Drafts autosave after every step.') + '</p></div>';
  } });
  L.A.resumeDraft = (ph, id) => {
    const d = L.W.drafts.find((y) => y.id === id);
    ph.draft = Object.assign(newDraft(d.type), d, { photos: d.photos || (d.cover ? [d.cover] : []), deliverables: d.deliverables || [] });
    const step = Math.min(d.step || 1, 4);
    ph.stack = [{ id: 'B-13', f: {} }]; ['B-15', 'B-16', 'B-17', 'B-18'].slice(0, step).forEach((s) => ph.stack.push({ id: s, f: {} }));
    ph.sheets = []; ph.render(true);
  };
  L.A.delDraft = (ph, id) => { L.W.drafts = L.W.drafts.filter((d) => d.id !== id); ph.toast(t('Draft deleted')); };

  /* ───────── B-22 Campaign detail (owner) ───────── */
  S('B-22', { name: 'Campaign detail (owner)', render: (x) => {
    const k = L.camp(x.arg); const cols = L.W.collabs.filter((c) => c.campaignId === k.id);
    const apps = cols.filter((c) => c.status === 'applied'), live = cols.filter((c) => !['applied', 'declined', 'withdrawn', 'expired', 'invited'].includes(c.status));
    const closed = k.status === 'closed';
    x.fix('<div class="topbar">' + C.gbtn('back', { back: 1, aria: t('Back'), clear: 1 }) + '<span class="grow"></span>' + (closed ? '' : C.gbtn('edit', { act: 'editCampaign', arg: k.id, aria: t('Edit campaign'), clear: 1 })) + '</div>');
    let h = '<div class="hero" style="height:300px">' + C.ph(k.cover, '', k.title) + '</div><div class="pad stack g20" style="margin-top:-30px;position:relative"><div class="stack g6"><span class="hrow g8">' + C.pill(k.type === 'paid' ? t('Paid · {rate}', { rate: L.eur(k.rate) }) : t('Experience'), k.type === 'paid' ? 'peach' : 'sky') + (closed ? C.pill(t('Closed@@campaign'), 'grey') : C.pill(t('Live'), 'mint')) + (L.isEarly(k) ? C.pill(t('Plus early access'), 'ink', 'bolt') : '') + '</span><h1 class="lt">' + esc(k.title) + '</h1><span class="sub">' + (closed ? t('Closed · Visits {from}–{to}', { from: L.dshort(k.visitFrom), to: L.dshort(k.visitTo) }) : t('Applications close {date} · Visits {from}–{to}', { date: L.date(k.applyBy), from: L.dshort(k.visitFrom), to: L.dshort(k.visitTo) })) + '</span></div>';
    if (closed) h += C.banner('grey', 'lock', t('This campaign is closed. It\'s read-only; completed collabs stay on your profile.'));
    else if (L.slotsLeft(k) <= 0) h += C.banner('ok', 'check', t('All slots are filled. New applicants can\'t be accepted.'));
    h += '<div class="tiles" style="grid-template-columns:repeat(3,1fr)">' + [['Applicants', apps.length, 'mint'], ['Accepted@@count', live.length, 'peach'], ['Slots left', Math.max(0, L.slotsLeft(k)), 'sky']].map((y) => '<div class="tile ' + y[2] + '" style="height:104px"><span class="tl">' + t(y[0]) + '</span><span class="tv" style="font-size:34px;line-height:38px">' + y[1] + '</span></div>').join('') + '</div>';
    h += C.list([C.row({ icon: 'users', tone: 'mint', title: t('Applicants'), sub: apps.length ? apps.map((c) => L.cr(c.creatorId).first).join(', ') : t('No new applications'), right: apps.length ? '<span class="cnt">' + apps.length + '</span>' : '', go: 'B-23:' + k.id })]);
    h += '<div class="stack g10"><h2 class="h2">' + t('Collabs') + '</h2>' + (live.length ? C.list(live.map((c) => C.collabRow(c, 'business'))) : '<div class="card p sub">' + t('Accepted creators appear here.') + '</div>') + '</div>';
    h += '<div class="card p stack g8"><h2 class="h2">' + t('Brief') + '</h2><span class="sub">' + esc(k.brief) + '</span><div class="chips wrap">' + k.deliverables.map((d) => C.pill(DLV(d), 'sand')).join('') + '</div></div>';
    if (!closed) h += C.list([C.row({ icon: 'edit', title: t('Edit campaign'), sub: t('Type and rate are locked after publishing'), act: 'editCampaign', arg: k.id }), C.row({ icon: 'close', tone: 'red', title: t('Close campaign'), sub: t('Stops new applications. Active collabs continue.'), act: 'closeCampaign', arg: k.id, dang: 1, chev: false })]);
    return h + '</div>';
  } });
  L.A.editCampaign = (ph, id) => { const k = L.camp(id); ph.draft = Object.assign(newDraft(k.type), { editing: k.id, title: k.title, photos: [k.cover], category: k.category, town: k.town, brief: k.brief, deliverables: JSON.parse(JSON.stringify(k.deliverables)), mustInclude: k.mustInclude, donts: k.donts, rate: k.rate, slots: k.slots, offer: k.offer, value: k.value, applyBy: DAY_IN(k.applyBy), visitFrom: DAY_IN(k.visitFrom), visitTo: DAY_IN(k.visitTo), step: 4 }); ph.go('B-15'); };
  L.A.closeCampaign = (ph, id) => { const k = L.camp(id); k.status = 'closed'; L.W.collabs.filter((c) => c.campaignId === id && ['applied', 'invited'].includes(c.status)).forEach((c) => L.setStatus(c, 'expired')); ph.toast(t('Campaign closed')); };

  /* ───────── B-23 Applicants ───────── */
  S('B-23', { name: 'Applicants', render: (x) => {
    const k = L.camp(x.arg); const seg = x.f.seg || 'applied';
    const all = L.W.collabs.filter((c) => c.campaignId === k.id);
    const list = all.filter((c) => (seg === 'applied' ? c.status === 'applied' : seg === 'invited' ? ['invited', 'awaiting'].includes(c.status) : ['declined', 'withdrawn', 'expired'].includes(c.status)));
    x.fix(C.top({ title: t('Applicants'), solid: 1 }));
    let h = '<div class="pad stack g16" style="padding-top:116px"><span class="sub">' + esc(k.title) + ' · ' + SLOTS(Math.max(0, L.slotsLeft(k))) + '</span>' + C.seg('seg', [{ v: 'applied', label: t('New@@applicants'), count: all.filter((c) => c.status === 'applied').length }, { v: 'invited', label: t('Invited@@applicants') }, { v: 'declined', label: t('Declined') }], seg);
    if (!list.length) return h + C.empty({ icon: 'users', title: t(seg === 'applied' ? 'No applications yet' : seg === 'invited' ? 'No pending invites' : 'Nobody declined'), body: seg === 'applied' ? t('Invite creators who fit. Invites are free.') : '', cta: seg === 'applied' ? C.btn(t('Find creators'), { kind: 'dark', sm: 1, act: 'inviteFromPublished', arg: k.id }) : '' }) + '</div>';
    return h + list.map((c) => {
      const cr = L.cr(c.creatorId); const f = cr.socials.ig.connected ? t('{n} Instagram', { n: L.k(cr.socials.ig.followers) }) : cr.socials.other[0] ? t('{n} self-reported', { n: L.k(cr.socials.other[0].followers) }) : '';
      return '<div class="card p stack g12"><button type="button" class="hrow g12" data-go="B-08:' + cr.id + '" style="text-align:left">' + C.av(cr.photo, 56, cr.first) + '<span class="stack grow"><span class="hrow" style="gap:6px"><b style="font-size:17px">' + esc(cr.first) + '</b>' + (L.verified(cr) ? L.I.verified(15) : '') + (cr.plus ? '<span class="badge-p">PLUS</span>' : '') + '</span><span class="meta">' + esc(NICHE(cr)) + ' · ' + f + '</span></span>' + C.status(c.status, c.id) + '</button>' +
        (c.pitch || c.note ? '<p class="sub" style="margin:0">' + t('"{q}"', { q: esc(c.pitch || c.note) }) + '</p>' : '') +
        (c.status === 'applied' ? '<div class="hrow g8">' + C.btn(t('Decline'), { kind: 'sec', sm: 1, act: 'declineApp', arg: c.id, style: 'flex:1' }) + C.btn(t('View & accept'), { kind: 'dark', sm: 1, go: 'B-25:' + c.id, style: 'flex:1.4' }) + '</div>' : c.status === 'awaiting' ? C.btn(t(k.type === 'paid' ? 'Fund to confirm' : 'Confirm'), { kind: 'dark', sm: 1, full: 1, go: 'B-25:' + c.id }) : '') + '</div>';
    }).join('') + '</div>';
  } });
  L.A.declineApp = (ph, id) => {
    const col = L.col(id); const k = L.camp(col.campaignId); const b = L.biz(k.bizId);
    L.setStatus(col, 'declined');
    L.post(b.id, col.creatorId, { from: 'sys', deal: 'declined', collabId: col.id }, k.id);
    L.notify('creator', { icon: 'mail', tone: 'grey', msg: '{biz} went with other creators for {title} this time', p: { biz: { biz: b.id }, title: { camp: k.id } }, go: 'C-14' });
    ph.toast(t('Declined · {name} is told kindly', { name: L.cr(col.creatorId).first }));
    if (ph.base().id === 'B-25') ph.back();
  };

  /* ───────── B-24 Profile gate ───────── */
  S('B-24', { name: 'Profile incomplete gate', sheet: true, render: (x) => C.sheetHead(t('Finish your profile to publish'), t('Creators apply more to businesses with a logo, photos and an address. You\'re at {pct}%.', { pct: L.bizMeter() })) + C.meter(L.bizMeter()) + '<div class="mt16">' + bizChecklist(x) + '</div>' + (L.bizMeter() >= 100 ? '<div class="mt16">' + C.btn(t('Create campaign'), { kind: 'dark', full: 1, act: 'toCreate' }) + '</div>' : '') });

  /* ───────── B-25 Applicant detail → Accept & fund ───────── */
  S('B-25', { name: 'Accept & fund', render: (x) => {
    const col = L.col(x.arg); const k = L.camp(col.campaignId); const cr = L.cr(col.creatorId); const paid = k.type === 'paid';
    x.fix(C.top({ title: col.status === 'awaiting' ? t('Confirm {name}', { name: cr.first }) : t('Application'), solid: 1 }));
    const full = L.slotsLeft(k) <= 0 && ['applied', 'awaiting'].includes(col.status);
    let h = '<div class="pad stack g20" style="padding-top:116px"><button type="button" class="card p hrow g12" data-go="B-08:' + cr.id + '" style="width:100%;text-align:left">' + C.av(cr.photo, 64, cr.first) + '<span class="stack grow"><span class="hrow" style="gap:6px"><b style="font-size:19px">' + esc(cr.first) + '</b>' + (L.verified(cr) ? L.I.verified(16) : '') + '</span><span class="meta">' + esc(NICHE(cr) + ' · ' + t(cr.town)) + '</span><span class="meta">' + (cr.socials.ig.connected ? t('{n} Instagram · {pct}', { n: L.k(cr.socials.ig.followers), pct: PCT(cr.socials.ig.eng) }) : t('Self-reported stats')) + '</span></span>' + I('chev', 16, 2) + '</button>';
    if (col.status === 'withdrawn') h += C.banner('grey', 'alert', t('{name} withdrew this application.', { name: esc(cr.first) }));
    if (full) h += C.banner('bad', 'alert', t('All {n} slots are filled. Close a collab or add slots to accept {name}.', { n: k.slots, name: esc(cr.first) }));
    if (col.pitch || col.note) h += '<div class="card p stack g6"><span class="meta">' + (col.pitch ? t('{name}\'s pitch', { name: cr.first }) : t('Your invite note')) + '</span><p style="margin:0;font-size:16px;line-height:23px">' + t('"{q}"', { q: esc(col.pitch || col.note) }) + '</p></div>';
    h += '<div class="card p stack g10"><h2 class="h2">' + esc(k.title) + '</h2><div class="chips wrap">' + k.deliverables.map((d) => C.pill(DLV(d), 'sand')).join('') + '</div><span class="meta">' + t('Visit window {from}–{to} · agree the exact time in chat', { from: L.dshort(k.visitFrom), to: L.dshort(k.visitTo) }) + '</span></div>';
    if (paid) h += '<div class="card p stack g10"><div class="hrow between"><h2 class="h2">' + t('Accept at the posted rate') + '</h2></div>' + C.money([[t('Creator rate'), L.eur(k.rate, 2)], [t('Lokaly fee 10%'), L.eur(k.rate * 0.1, 2)], [t('Held today'), L.eur(L.payB(k.rate), 2), 1]]) + '<span class="meta">' + t('Held by Stripe. Released when you approve the post, or 72h after it\'s submitted. Cancel before submission for a full refund minus Stripe costs.') + '</span></div>';
    else h += C.banner('info', 'gift', t('Experience collab: nothing is charged. {name} gets {offer}.', { name: esc(cr.first), offer: esc(k.offer) }));
    h += '</div>';
    if (['applied', 'awaiting'].includes(col.status)) x.fix(C.abar({ btn: (col.status === 'applied' ? C.btn(t('Decline'), { kind: 'sec', act: 'declineApp', arg: col.id }) : '') + C.btn(paid ? t('Accept & fund {amt}', { amt: L.eur(L.payB(k.rate)) }) : t('Accept'), { kind: paid ? 'pri' : 'dark', act: 'acceptApp', arg: col.id, dis: full, style: 'flex:1' }) }));
    return h;
  } });
  L.A.acceptApp = (ph, id) => {
    const col = L.col(id); const k = L.camp(col.campaignId);
    if (k.type === 'paid') { ph.payState = 'idle'; ph.go('PAY:' + id); }
    else L.fundCollab(ph, id);
  };
  L.fundCollab = (ph, id) => {
    const col = L.col(id); const k = L.camp(col.campaignId); const b = L.biz(k.bizId); const cr = L.cr(col.creatorId); const paid = k.type === 'paid';
    L.setStatus(col, 'active');
    if (paid) { L.W.txns.unshift({ id: L.id('tx'), bizId: b.id, kind: 'funded', collabId: col.id, amount: L.payB(k.rate), at: L.W.now, ref: 'pi_' + L.W.seq + 'Lk' }); L.email('E-03', b.name, 'Funded {amt} · {name} · {title}', { col: col.id }, { amt: { eur: L.payB(k.rate), d: 2 }, name: { cr: cr.id }, title: { camp: k.id } }); }
    L.post(b.id, cr.id, { from: 'sys', deal: 'funded', collabId: col.id }, k.id);
    L.notify('creator', Object.assign({ icon: 'shield', tone: 'peach', cat: 'payments', go: 'S-12:' + col.id }, paid ? { msg: 'You\'re in · {amt} secured with {biz}', p: { amt: { eur: L.netC(k.rate) }, biz: { biz: b.id } } } : { msg: 'You\'re in · {biz} accepted you for {title}', p: { biz: { biz: b.id }, title: { camp: k.id } } }));
    if (paid && col.creatorId === L.W.crMe.id && L.W.crMe.payout !== 'verified') L.email('E-07', cr.first, 'Add a payout account to get paid', {});
    ph.go('S-12:' + col.id, { replace: ph.base().id === 'B-25' }); ph.toast(paid ? t('Funded · {amt} held', { amt: L.eur(L.payB(k.rate)) }) : t('Accepted'));
  };

  /* ───────── B-26 Collabs ───────── */
  S('B-26', { name: 'Collabs', render: (x) => {
    const seg = x.f.seg || 'action'; const mine = L.myCollabsB();
    const groups = { action: mine.filter((c) => ['applied', 'awaiting', 'submitted'].includes(c.status) || (c.status === 'active' && !c.visitDate)), active: mine.filter((c) => ['active', 'submitted', 'awaiting', 'disputed'].includes(c.status)), completed: mine.filter((c) => ['completed', 'resolved_released', 'resolved_refunded'].includes(c.status)), cancelled: mine.filter((c) => ['cancelled', 'declined', 'withdrawn', 'expired'].includes(c.status)) };
    x.fix(C.top({ title: t('Collabs'), solid: 1 }));
    const list = groups[seg];
    const empty = { action: ['Nothing needs you', 'New applications and submissions show up here.'], active: ['No active collabs', 'Accept an applicant to start one.'], completed: ['No completed collabs yet', 'Finished collabs become cards on your profile.'], cancelled: ['Nothing cancelled', 'Good.'] }[seg];
    return '<div class="pad stack g16" style="padding-top:116px">' + C.seg('seg', [{ v: 'action', label: t('To do'), count: groups.action.length }, { v: 'active', label: t('Active@@collabs') }, { v: 'completed', label: t('Done@@collabs') }, { v: 'cancelled', label: t('Closed') }], seg) + (list.length ? C.list(list.map((c) => C.collabRow(c, 'business'))) : C.empty({ icon: 'work', title: t(empty[0]), body: t(empty[1]) })) + '</div>';
  } });

  /* ───────── B-27 Review submission ───────── */
  S('B-27', { name: 'Review submission', render: (x) => {
    const col = L.col(x.arg); const k = L.camp(col.campaignId); const cr = L.cr(col.creatorId); const paid = k.type === 'paid';
    x.fix(C.top({ title: t('Review {name}\'s post', { name: cr.first }), solid: 1 }));
    const checks = x.f.chk || {};
    let h = '<div class="pad stack g20" style="padding-top:116px">';
    if (col.status !== 'submitted') h += C.banner(col.status === 'disputed' ? 'bad' : 'ok', col.status === 'disputed' ? 'alert' : 'check', t(col.status === 'disputed' ? 'You reported a problem. Lokaly is reviewing.' : col.releaseReason === 'auto_released' ? 'Auto-released after 72 hours. This is read-only.' : 'Approved. This is read-only.'));
    else h += '<div class="tile lilac wide" style="cursor:default"><span class="tl">' + t('Review window') + '</span><span class="tv">' + t('{h}<small>h left</small>', { h: L.hoursLeft(col) }) + '</span><span class="ts">' + (paid ? t('Then {amt} releases to {name} automatically', { amt: L.eur(L.netC(k.rate)), name: esc(cr.first) }) : t('Then it completes automatically')) + '</span></div>';
    h += '<button type="button" class="card p row" data-act="openUrl" style="padding:14px 16px">' + '<span class="ico grey">' + I('insta', 18, 2) + '</span><span class="rt"><b class="ell">' + esc(col.submission.url.replace('https://www.', '')) + '</b><span>' + t('Open the live post') + '</span></span>' + I('ext', 16, 2) + '</button>';
    h += '<div class="stack g10"><h2 class="h2">' + t('Screenshots') + '</h2><div class="mini-h">' + col.submission.shots.map((s) => '<button type="button" class="ph" data-go="S-11:view:' + s + '" aria-label="' + t('Open screenshot') + '" style="width:200px;height:260px;border-radius:20px;flex-shrink:0;background-image:url(' + s + ')"></button>').join('') + '</div></div>';
    h += '<div class="stack g10"><h2 class="h2">' + t('Check the brief') + '</h2><div class="list">' + k.deliverables.map((d, i) => '<button type="button" class="row" role="checkbox" aria-checked="' + !!checks[i] + '" data-toggle="chk.' + i + '"><span class="check' + (checks[i] ? ' on' : '') + '">' + (checks[i] ? I('check', 15, 3) : '') + '</span><span class="rt"><b>' + esc(DLV(d)) + '</b></span></button>').join('') + '<button type="button" class="row" role="checkbox" aria-checked="' + !!checks.m + '" data-toggle="chk.m"><span class="check' + (checks.m ? ' on' : '') + '">' + (checks.m ? I('check', 15, 3) : '') + '</span><span class="rt"><b>' + t('Includes {tag}', { tag: esc(k.mustInclude) }) + '</b></span></button></div></div>';
    if (col.status === 'submitted') h += C.list([C.row({ icon: 'flag', tone: 'red', title: t('Report a problem'), sub: t('Pauses the timer and freezes funds'), go: 'S-13:' + col.id })]);
    h += '</div>';
    if (col.status === 'submitted') x.fix(C.abar({ title: paid ? t('{net} to {name}', { net: L.eur(L.netC(k.rate)), name: esc(cr.first) }) : t('Experience'), sub: paid ? t('{held} held · {fees} Lokaly fees', { held: L.eur(L.payB(k.rate)), fees: L.eur(L.payB(k.rate) - L.netC(k.rate)) }) : t('nothing to pay'), btn: C.btn(t(paid ? 'Approve & release' : 'Mark complete'), { act: 'approve', arg: col.id, kind: paid ? 'pri' : 'dark' }) }));
    return h;
  } });
  L.A.approve = (ph, id) => { const col = L.col(id); L.release(col, 'approved'); ph.go('S-12:' + id, { replace: 1 }); ph.toast(L.camp(col.campaignId).type === 'paid' ? t('Released to {name}', { name: L.cr(col.creatorId).first }) : t('Marked complete')); };

  /* ───────── B-28 Payments ───────── */
  const txLabel = (tx) => {
    if (tx.kind === 'fee') return [t('Experience fee'), (L.camp(tx.campaignId) || {}).title || '', 'sky', 'gift'];
    const col = L.col(tx.collabId); const k = L.camp(col.campaignId); const cr = L.cr(col.creatorId);
    return { funded: [t('Funded · {name}', { name: cr.first }), k.title, 'peach', 'shield'], released: [t('Released · {name}', { name: cr.first }), k.title, 'mint', 'check'], refunded: [t('Refunded · {name}', { name: cr.first }), k.title, 'grey', 'refresh'] }[tx.kind];
  };
  S('B-28', { name: 'Payments', render: (x) => {
    const tx = L.W.txns.filter((t) => t.bizId === L.W.bizMe.id);
    const mon = x.f.mon || 'all';
    const list = tx.filter((t) => mon === 'all' || new Date(t.at).getMonth() === +mon);
    const mine = L.myCollabsB();
    const held = mine.filter((c) => ['active', 'submitted', 'disputed'].includes(c.status) && L.camp(c.campaignId).type === 'paid').reduce((s, c) => s + L.payB(L.camp(c.campaignId).rate), 0);
    const rel = tx.filter((t) => t.kind === 'released' && new Date(t.at).getMonth() === new Date(L.W.now).getMonth()).reduce((s, t) => s + t.amount, 0);
    const ref = tx.filter((t) => t.kind === 'refunded').reduce((s, t) => s + t.amount, 0);
    x.fix(C.top({ title: t('Payments'), solid: 1, right: C.gbtn('download', { act: 'exportCsv', arg: 'business', aria: t('Export CSV') }) }));
    let h = '<div class="pad stack g16" style="padding-top:116px"><div class="tiles">' + C.tile({ tone: 'peach', label: t('Held now'), value: SUP(Math.round(held)), sub: t('in active collabs'), foot: 'Stripe' }) + C.tile({ tone: 'mint', label: t('Released'), value: SUP(Math.round(rel)), sub: t('this month'), foot: t('to creators') }) + '</div>' +
      '<div class="card p hrow between"><span class="stack"><b>' + t('Refunded') + '</b><span class="meta">' + t('All time, minus Stripe costs') + '</span></span><span class="num" style="font-size:20px">' + L.eur(ref, 2) + '</span></div>' +
      '<div class="chips">' + [['all', 'All'], ['9', 'October'], ['8', 'September']].map((m) => C.chip(t(m[1]), { on: mon === m[0], set: 'mon', val: m[0] })).join('') + '</div>';
    if (!list.length) return h + C.empty({ icon: 'euro', title: t('No payments yet'), body: t('Funding, releases, refunds and Experience fees show up here.') }) + '</div>';
    h += C.list(list.map((tx) => { const l = txLabel(tx); return C.row({ icon: l[3], tone: l[2], title: esc(l[0]), sub: esc(l[1]) + ' · ' + L.dshort(tx.at), right: '<span class="num" style="color:var(--ink);font-weight:600">' + (tx.kind === 'refunded' ? '+' : tx.kind === 'released' ? '' : '−') + L.eur(tx.amount, 2) + '</span>', go: 'B-29:' + tx.id }); }));
    return h + C.btn(t('Export CSV'), { kind: 'sec', full: 1, icon: I('download', 18, 2), act: 'exportCsv', arg: 'business' }) + '</div>';
  } });
  L.A.exportCsv = (ph, role) => {
    let rows;
    if (role === 'business') rows = [['date', 'type', 'description', 'amount_eur', 'stripe_ref']].concat(L.W.txns.filter((t) => t.bizId === L.W.bizMe.id).map((tx) => { const l = L.inLang('en', () => txLabel(tx)); return [new Date(tx.at).toISOString().slice(0, 10), tx.kind, l[0] + ' / ' + l[1], tx.amount.toFixed(2), tx.ref]; }));
    else rows = [['date', 'business', 'campaign', 'gross_eur', 'lokaly_fee_eur', 'net_eur', 'status']].concat(L.W.payouts.filter((p) => p.creatorId === L.W.crMe.id).map((p) => { const col = L.col(p.collabId); const k = L.camp(col.campaignId); return [new Date(p.at).toISOString().slice(0, 10), L.biz(k.bizId).name, k.title, p.gross.toFixed(2), (p.gross - p.net).toFixed(2), p.net.toFixed(2), p.status]; }));
    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    L.lastCsv = csv;
    try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'lokaly-' + role + '-' + new Date(L.W.now).toISOString().slice(0, 10) + '.csv'; document.body.appendChild(a); a.click(); a.remove(); } catch (_) {}
    ph.toast(t('CSV exported · {n} rows', { n: rows.length - 1 }));
  };

  /* ───────── B-29 Transaction detail ───────── */
  S('B-29', { name: 'Transaction receipt', render: (x) => {
    const tx = L.W.txns.find((y) => y.id === x.arg); const l = txLabel(tx);
    x.fix(C.top({ title: t('Receipt'), solid: 1 }));
    let lines;
    if (tx.kind === 'fee') lines = [[t('Experience booking fee'), L.eur(39.99, 2)], [t('VAT included'), L.eur(39.99 * 0.21 / 1.21, 2)], [t('Total'), L.eur(39.99, 2), 1]];
    else { const k = L.camp(L.col(tx.collabId).campaignId); lines = tx.kind === 'refunded' ? [[t('Funded'), L.eur(L.payB(k.rate), 2)], [t('Stripe costs (not refundable)'), '−' + L.eur(L.stripeCost(L.payB(k.rate)), 2)], [t('Refunded'), L.eur(tx.amount, 2), 1]] : [[t('Creator rate'), L.eur(k.rate, 2)], [t('Lokaly fee 10%'), L.eur(k.rate * 0.1, 2)], [t(tx.kind === 'released' ? 'Released' : 'Held'), L.eur(L.payB(k.rate), 2), 1]]; }
    return '<div class="pad stack g20" style="padding-top:116px"><div class="stack g6" style="align-items:center;text-align:center"><span class="ico ' + l[2] + '" style="width:56px;height:56px;border-radius:28px">' + I(l[3], 24, 2) + '</span><span class="num" style="font-size:44px;letter-spacing:-0.04em">' + L.eur(tx.amount, 2) + '</span><b>' + esc(l[0]) + '</b><span class="meta">' + esc(l[1]) + ' · ' + L.dt(tx.at) + '</span></div>' +
      '<div class="card p">' + C.money(lines) + '</div>' + C.list([C.row({ icon: 'doc', title: t('Status'), right: t({ funded: 'Held by Stripe', released: 'Released', refunded: 'Refunded', fee: 'Paid@@receipt' }[tx.kind]), chev: false }), C.row({ icon: 'card', title: t('Stripe reference'), right: '<span class="num">' + tx.ref + '</span>', chev: false })].concat(tx.collabId ? [C.row({ icon: 'work', title: t('View collab'), go: 'S-12:' + tx.collabId })] : [])) +
      C.btn(t('Email receipt'), { kind: 'sec', full: 1, icon: I('mail', 18, 2), act: 'emailReceipt', arg: tx.id }) + '</div>';
  } });
  L.A.emailReceipt = (ph, id) => { const tx = L.W.txns.find((y) => y.id === id); const map = { funded: 'E-03', released: 'E-04', refunded: 'E-05', fee: 'E-02' }; L.email(map[tx.kind], L.myBiz().name, 'Receipt copy · {amt}', { col: tx.collabId, campaign: tx.campaignId, amount: tx.amount }, { amt: { eur: tx.amount, d: 2 } }); ph.toast(t('Receipt sent')); };

  /* ───────── B-30 Billing details ───────── */
  S('B-30', { name: 'Billing details', render: (x) => {
    const b = L.W.bizMe.billing; const f = x.f;
    if (f.legal === undefined) Object.assign(f, { legal: b.legal || '', nif: b.nif || '', address: b.address || '' });
    const nifOk = /^[A-HJ-NP-SUVW]-?\d{7}[0-9A-J]$|^\d{8}-?[A-Z]$/i.test((f.nif || '').trim());
    x.fix(C.top({ title: t('Billing details'), solid: 1 }));
    x.fix(C.abar({ btn: C.btn(t('Save'), { kind: 'dark', full: 1, act: 'saveBilling' }) }));
    return '<div class="pad stack g16" style="padding-top:116px"><p class="sub" style="margin:0">' + t('Shown on your receipts.') + ' ' + C.oq(t('Fields depend on Matt\'s DAC7 / invoicing advice.')) + '</p>' + C.field({ label: t('Legal name'), bind: 'legal', value: f.legal, auto: 'organization' }) + C.field({ label: 'CIF / NIF', bind: 'nif', value: f.nif, ph: 'B-12345678', err: f.tried && !nifOk ? t('That doesn\'t look like a Spanish CIF or NIF') : null, help: t('Company CIF (B-12345678) or personal NIF (12345678Z)') }) + C.field({ label: t('Billing address'), bind: 'address', value: f.address, textarea: 1, auto: 'street-address' }) + '</div>';
  } });
  L.A.saveBilling = (ph) => { const f = ph.top().f; const ok = /^[A-HJ-NP-SUVW]-?\d{7}[0-9A-J]$|^\d{8}-?[A-Z]$/i.test((f.nif || '').trim()); if (!ok) { f.tried = 1; return; } L.W.bizMe.billing = { legal: f.legal, nif: f.nif, address: f.address }; ph.back(); ph.toast(t('Billing details saved')); };

  /* ───────── B-31 Payment methods ───────── */
  S('B-31', { name: 'Payment methods', render: (x) => {
    const cards = L.W.bizMe.cards;
    x.fix(C.top({ title: t('Payment methods'), solid: 1 }));
    return '<div class="pad stack g16" style="padding-top:116px">' + (cards.length ? C.list(cards.map((c) => '<div class="row"><span class="visa">VISA</span><span class="rt"><b>•••• ' + c.last4 + '</b><span>' + t(c.def ? 'Expires {exp} · Default' : 'Expires {exp}', { exp: c.exp }) + '</span></span>' + (c.def ? C.pill(t('Default'), 'ok') : C.btn(t('Make default'), { kind: 'ghost', sm: 1, act: 'cardDefault', arg: c.id })) + C.gbtn('trash', { act: 'cardDel', arg: c.id, aria: t('Remove card ending {n}', { n: c.last4 }) }) + '</div>')) : C.empty({ icon: 'card', title: t('No cards saved'), body: t('Add a card to fund collabs in one tap. Apple Pay works too.') })) +
      C.btn(t('Add card'), { kind: 'sec', full: 1, icon: I('plus', 18, 2), act: 'addCard' }) + '<div class="stripe-badge">' + I('lock', 13, 2) + t('Cards are stored by Stripe, never by Lokaly') + '</div></div>';
  } });
  L.A.cardDefault = (ph, id) => L.W.bizMe.cards.forEach((c) => (c.def = c.id === id));
  L.A.cardDel = (ph, id) => { L.W.bizMe.cards = L.W.bizMe.cards.filter((c) => c.id !== id); if (L.W.bizMe.cards[0] && !L.W.bizMe.cards.some((c) => c.def)) L.W.bizMe.cards[0].def = true; ph.toast(t('Card removed')); };

  /* ───────── B-32 Membership ───────── */
  S('B-32', { name: 'Membership', render: (x) => {
    const m = L.W.bizMe.membership;
    x.fix(C.top({ title: t('Membership'), solid: 1 }));
    let h = '<div class="pad stack g16" style="padding-top:116px">';
    if (L.W.bizMe.pending) h += C.banner('warn2', 'clock', t('<b>Purchase pending approval.</b><br>{plan} starts once Ask to Buy is approved.', { plan: L.W.bizMe.pending.charAt(0).toUpperCase() + L.W.bizMe.pending.slice(1) }));
    // Not a member: the Graphite paywall hero on this light page (balanced title: "See who you're / working with.").
    const perk = (icon, title, s) => '<div class="perk"><span class="pk">' + I(icon, 18, 1.8) + '</span><span><b>' + title + '</b><span>' + s + '</span></span></div>';
    if (!m) return h + '<div class="gra"><span class="caps">' + t('Not a member') + '</span><h1 class="lt">' + t('See who you\'re working with.') + '</h1><p class="sub">' + t('10, 30 or 100 creator unlocks a month. From {price}.', { price: L.eur(59.99, 2) }) + '</p>' +
      '<div class="stack g16">' + perk('lock', t('Handles and links, one tap'), t('Open the creator\'s real profiles before you invest.')) + perk('check', t('Unlocked stays unlocked'), t('Unused unlocks reset each month.')) + '</div>' +
      C.btn(t('See plans'), { kind: 'white', full: 1, go: 'B-11' }) + '</div></div>';
    const unl = L.W.bizMe.unlocked.map(L.cr);
    h += '<div style="background:#17181B;color:#F4F4F2;border-radius:28px;padding:22px" class="stack g12"><span class="caps" style="color:#D9DCE1;font-size:10px">' + t('{plan} · {price}/MO', { plan: m.plan.toUpperCase(), price: L.eur(L.PLANS[m.plan].price, 2) }) + '</span><span class="num" style="font-size:52px;line-height:52px;letter-spacing:-0.045em">' + (m.unlocks - m.used) + '<span style="font-size:18px;color:#A3A6AC;letter-spacing:0"> ' + t('of {n} unlocks left', { n: m.unlocks }) + '</span></span><span style="height:6px;border-radius:3px;background:#33363C;display:flex"><i style="width:' + (100 * (m.unlocks - m.used) / m.unlocks) + '%;background:#D9DCE1;border-radius:3px"></i></span><span style="font-size:13px;color:#A3A6AC">' + t('Renews {date}. Unused unlocks reset then.', { date: L.date(m.renews) }) + '</span></div>';
    h += '<div class="stack g10"><h2 class="h2">' + t('Unlocked creators') + '</h2>' + (unl.length ? C.list(unl.map((c) => C.row({ av: C.av(c.photo, 44), title: esc(c.first), sub: esc(NICHE(c)), go: 'B-08:' + c.id }))) : '<div class="card p sub">' + t('Creators you unlock stay here for good.') + '</div>') + '</div>';
    return h + C.list([C.row({ icon: 'spark', title: t('Change plan'), go: 'B-11' }), C.row({ icon: 'store', title: t('Manage in App Store'), sub: t('Cancel or change billing'), act: 'manageStore', chev: false })]) + '</div>';
  } });
  L.A.manageStore = (ph) => ph.toast(t('Opens App Store subscriptions'));

  /* ───────── B-33 Membership success (Noir) ───────── */
  S('B-33', { name: 'Membership welcome', noir: true, render: (x) => {
    const m = L.W.bizMe.membership; const pend = x.ph.pendingUnlock && L.cr(x.ph.pendingUnlock);
    x.fix(C.top({ close: 1 }));
    x.fix(C.abar({ btn: pend ? C.btn(t('Unlock {name} now', { name: pend.first }), { kind: 'white', full: 1, act: 'afterJoin' }) : C.btn(t('Discover creators'), { kind: 'white', full: 1, tab: 'B-05' }) }));
    return '<div class="pad stack g20" style="padding-top:150px;text-align:center;align-items:center"><span class="caps" style="color:var(--n-mark);letter-spacing:.32em">' + t('Welcome to {plan}', { plan: m.plan }) + '</span><span class="num" data-in="count" data-v="' + m.unlocks + '" style="font-size:120px;line-height:110px;letter-spacing:-0.06em;font-weight:300">' + m.unlocks + '</span><span class="caps" style="color:var(--n-muted);letter-spacing:.24em">' + t('Unlocks this month') + '</span><p class="sub" style="max-width:280px;margin:8px 0 0">' + t('Every creator you unlock stays unlocked. Your receipt comes from Apple.') + '</p></div>';
  } });
  L.A.afterJoin = (ph) => { const id = ph.pendingUnlock; while (ph.stack.length > 1 && ph.base().id !== 'B-08') ph.stack.pop(); ph.go('B-09:' + id); };

  /* ───────── B-34 Account (Profile tab) ───────── */
  S('B-34', { name: 'Business account', tab: 'B-34', render: (x) => {
    const b = x.me; const pct = L.bizMeter(); const m = L.W.bizMe.membership;
    return '<div class="pad top-pad stack g20"><div class="hrow between"><h1 class="lt">' + t('Profile') + '</h1>' + C.gbtn('gear', { go: 'S-15', aria: t('Settings') }) + '</div>' +
      '<button type="button" class="card p stack g12" data-go="B-35" style="width:100%;text-align:left"><span class="hrow g12">' + C.logo(b, 60) + '<span class="stack grow"><b style="font-size:19px">' + esc(b.name) + '</b><span class="meta">' + esc(t(b.category) + ' · ' + t(b.town)) + '</span></span>' + I('chev', 16, 2) + '</span>' + (pct < 100 ? '<span class="stack g6"><span class="hrow between"><span class="meta">' + t('Profile {pct}%', { pct }) + '</span><span class="meta det" style="font-weight:600">' + t('Finish to publish') + '</span></span>' + C.meter(pct) + '</span>' : '<span class="hrow g6 meta">' + I('check', 14, 2.4) + t('Profile complete · View as creators see it') + '</span>') + '</button>' +
      C.list([C.row({ icon: 'doc', tone: 'sand', title: t('Campaigns'), go: 'B-13' }), C.row({ icon: 'work', tone: 'mint', title: t('Collabs'), go: 'B-26' }), C.row({ icon: 'unlock', tone: 'grey', title: t('Membership'), right: m ? m.plan.charAt(0).toUpperCase() + m.plan.slice(1) : t('None'), go: 'B-32' })]) +
      C.list([C.row({ icon: 'euro', tone: 'peach', title: t('Payments'), go: 'B-28' }), C.row({ icon: 'card', title: t('Payment methods'), go: 'B-31' }), C.row({ icon: 'doc', title: t('Billing details'), go: 'B-30' })]) +
      C.list([C.row({ icon: 'gear', title: t('Settings'), go: 'S-15' }), C.row({ icon: 'help', title: t('Help'), go: 'S-18' })]) + '</div>';
  } });

  /* ───────── B-35 Business profile (own) + shared business profile ───────── */
  L.bizProfile = (x, b, own) => {
    const camps = L.W.campaigns.filter((k) => k.bizId === b.id && k.status === 'active');
    const done = L.W.collabs.filter((c) => L.camp(c.campaignId).bizId === b.id && c.status === 'completed');
    x.fix('<div class="topbar">' + C.gbtn('back', { back: 1, aria: t('Back'), clear: 1 }) + '<span class="grow"></span>' + (own ? C.gbtn('edit', { go: 'B-36', aria: t('Edit profile'), clear: 1 }) : C.gbtn('more', { go: 'S-22:biz:' + b.id, aria: t('Report or block'), clear: 1 })) + '</div>');
    let h = '<div class="hero">' + (b.cover ? C.ph(b.cover, '', b.name) : '<div class="ph" style="background:#DADDD8"></div>') + '</div><div class="pad stack g20" style="margin-top:-56px;position:relative"><div class="stack g10"><span style="border:4px solid var(--ground);border-radius:50%;align-self:flex-start">' + C.logo(b, 72) + '</span>' + (own ? C.pill(t('Preview · as creators see you'), 'sand', 'eye') : '') + '<h1 class="lt xl">' + esc(b.name) + '</h1><span class="sub">' + esc(t(b.category) + ' · ' + t(b.town)) + '</span>' + (b.desc ? '<p style="margin:0;font-size:15px;line-height:22px">' + esc(b.desc) + '</p>' : own ? '<p class="sub" style="margin:0">' + t('Add a description so creators know what you\'re about.') + '</p>' : '') + '</div>';
    if (b.address) h += '<div class="card p hrow g12"><span class="ico grey">' + I('pin', 18, 2) + '</span><span class="grow stack"><b style="font-size:14.5px">' + esc(b.address) + '</b><span class="meta">' + esc(t(b.town)) + '</span></span>' + C.btn(t('Open in Maps'), { kind: 'sec', sm: 1, act: 'openMaps' }) + '</div>';
    if (b.web || b.ig) h += C.list([b.web ? C.row({ icon: 'globe', title: esc(b.web), act: 'openUrl', chev: false, right: I('ext', 16, 2) }) : '', b.ig ? C.row({ icon: 'insta', title: esc(b.ig), act: 'openUrl', chev: false, right: I('ext', 16, 2) }) : ''].filter(Boolean));
    if (b.photos && b.photos.length > 1) h += '<div class="mini-h">' + b.photos.map((p) => '<button type="button" class="ph" data-go="S-11:view:' + p + '" aria-label="' + t('Open photo') + '" style="width:220px;height:150px;border-radius:20px;flex-shrink:0;background-image:url(' + p + ')"></button>').join('') + '</div>';
    h += '<div class="stack g12"><h2 class="h2">' + t('Open campaigns') + '</h2>' + (camps.length ? camps.map((k) => C.campaignCard(k, own ? { go: 'B-22:' + k.id } : undefined)).join('') : '<div class="card p sub">' + t('No open campaigns right now.') + '</div>') + '</div>';
    h += '<div class="stack g12"><h2 class="h2">' + t('Collabs on Lokaly') + '</h2>' + (done.length ? '<div class="mini-h">' + done.map(C.xcard).join('') + '</div>' : '<div class="card p hrow"><span class="ico" style="background:var(--tint);color:var(--detail)">' + I('spark', 18, 2) + '</span><span class="stack"><b>' + t('New on Lokaly') + '</b><span class="meta">' + t('No completed collabs yet') + '</span></span></div>') + '</div>';
    return h + '</div>';
  };
  L.A.openMaps = (ph) => ph.toast(t('Opens Apple Maps'));
  S('B-35', { name: 'Business profile (own)', render: (x) => {
    let h = '';
    if (L.bizMeter() < 100) h = '<div class="pad" style="position:relative;z-index:2;padding-top:0"></div>';
    x.fix(L.bizMeter() < 100 ? '<div style="position:absolute;left:14px;right:14px;bottom:24px;z-index:19">' + C.meterCard('business') + '</div>' : '');
    return L.bizProfile(x, x.me, true) + h;
  } });

  /* ───────── B-36 Edit business profile ───────── */
  S('B-36', { name: 'Edit business profile', render: (x) => {
    const b = x.me; const f = x.f;
    if (f.name === undefined) Object.assign(f, { name: b.name, category: b.category, town: b.town, address: b.address, desc: b.desc, web: b.web, ig: b.ig, cover: b.cover, logo: b.meter.logo });
    x.fix('<div class="topbar solid">' + C.gbtn('back', { act: 'editBack', aria: t('Back') }) + '<div class="tt">' + t('Edit profile') + '</div><button type="button" class="gpill" data-act="saveBiz">' + t('Save') + '</button></div>');
    return '<div class="pad stack g20" style="padding-top:116px"><div class="hrow g16"><button type="button" data-toggle="logo" aria-label="' + t(f.logo ? 'Change logo' : 'Add logo') + '" style="position:relative">' + (f.logo ? C.logo(Object.assign({}, b, { name: f.name }), 76) : '<span class="upl" style="width:76px;height:76px;min-height:0;border-radius:38px">' + I('camera', 20, 2) + '</span>') + '</button><span class="stack"><b>' + t('Logo') + '</b><span class="meta">' + t(f.logo ? 'Tap to remove' : 'Tap to add a square logo') + '</span></span></div>' +
      '<div class="field"><span>' + t('Cover photo') + '</span>' + (f.cover ? '<button type="button" class="ph" data-set="cover" data-val="" aria-label="' + t('Remove cover photo') + '" style="height:150px;border-radius:20px;background-image:url(' + f.cover + ')"></button><small>' + t('Tap to remove') + '</small>' : '<button type="button" class="upl" data-set="cover" data-val="' + L.img('restaurant') + '">' + I('image', 22, 2) + t('Add a cover photo') + '</button>') + '</div>' +
      C.field({ label: t('Business name'), bind: 'name', value: f.name, err: !(f.name || '').trim() ? t('Required') : null }) +
      '<div class="field"><span>' + t('Category') + '</span><div class="chips wrap">' + L.CATEGORIES.map((c) => C.chip(t(c), { on: f.category === c, set: 'category', val: c })).join('') + '</div></div>' +
      '<div class="field"><span>' + t('Town') + '</span><div class="chips wrap">' + L.TOWNS.map((c) => C.chip(t(c), { on: f.town === c, set: 'town', val: c })).join('') + '</div></div>' +
      C.field({ label: t('Address'), bind: 'address', value: f.address, auto: 'street-address' }) + C.field({ label: t('Description'), bind: 'desc', value: f.desc, textarea: 1, ph: t('What should creators know about you?') }) +
      C.field({ label: t('Website'), bind: 'web', value: f.web, ph: t('yourvenue.es'), help: t('Your own links are always visible to creators.') }) + C.field({ label: 'Instagram', bind: 'ig', value: f.ig, ph: t('@yourvenue') }) + '</div>';
  } });
  L.A.saveBiz = (ph) => {
    const f = ph.top().f; const b = L.myBiz(); if (!(f.name || '').trim()) return;
    Object.assign(b, { name: f.name, category: f.category, town: f.town, address: f.address, desc: f.desc, web: f.web, ig: f.ig, cover: f.cover || null });
    if (f.cover && (!b.photos || !b.photos.length)) b.photos = [f.cover];
    b.meter = { logo: !!f.logo, cover: !!f.cover, desc: (f.desc || '').trim().length > 10, address: !!(f.address || '').trim() };
    ph.back(); ph.toast(t('Profile saved · {pct}%', { pct: L.bizMeter() }));
  };
  L.A.editBack = (ph) => {
    const f = ph.top().f; const b = L.myBiz();
    const dirty = ['name', 'category', 'town', 'address', 'desc', 'web', 'ig', 'cover'].some((k) => (f[k] || '') !== (b[k] || '')) || !!f.logo !== !!b.meter.logo;
    if (dirty) ph.go('DISCARD'); else ph.back();
  };
  S('DISCARD', { name: 'Unsaved changes', sheet: true, render: () => C.sheetHead(t('Discard changes?'), t('You have unsaved edits to your profile.')) + '<div class="stack g10">' + C.btn(t('Discard'), { kind: 'dang', full: 1, act: 'discard' }) + C.btn(t('Keep editing'), { kind: 'ghost', full: 1, close: 1 }) + '</div>' });
  L.A.discard = (ph) => { ph.sheets = []; ph.stack.pop(); };
})();
/* guards for screens that need context */
(function () {
  const L = window.L;
  L.S['B-09'].guard = () => (!L.W.bizMe.membership || L.unlocksLeft() <= 0 ? 'B-11' : null);
  ['B-15', 'B-16', 'B-17', 'B-18'].forEach((id) => { L.S[id].guard = (ph) => (ph.draft ? null : 'B-14'); });
  L.S['B-19'].guard = (ph) => (ph.draft ? null : 'B-14');
  L.S['B-33'].guard = () => (L.W.bizMe.membership ? null : 'B-11');
})();
