/* i18n runtime. The EN source string is the key (gettext-style), so the EN copy reads in place in the code.
   ES lives in js/i18n/es-*.js and is a DRAFT pending the native reviewer's sign-off (LOKALY_SCOPE_BRIEF §Phase 1 gate).
   t('Fund to confirm {name}', { name }) → looks up ES, then fills {placeholders}. Missing ES keys fall back to EN and are logged in L.missing. */
(function () {
  const L = (window.L = window.L || {});
  L.ES = {};
  L.missing = new Set();
  L.addES = (o) => Object.assign(L.ES, o);
  L.LANGS = ['en', 'es'];
  L.lang = () => L.forceLang || (L.W && L.W.lang) || 'en';
  L.inLang = (lang, fn) => { const prev = L.forceLang; L.forceLang = lang; try { return fn(); } finally { L.forceLang = prev; } };

  // Param values can be refs, resolved at render time so stored notifications/emails re-render in the current language.
  L.pv = (v) => {
    if (v == null || typeof v !== 'object') return v == null ? '' : v;
    if (v.camp) { const k = L.camp(v.camp); return k ? k.title : ''; }
    if (v.biz) { const b = L.biz(v.biz); return b ? b.name : ''; }
    if (v.cr) { const c = L.cr(v.cr); return c ? c.first : ''; }
    if ('eur' in v) return L.eur(v.eur, v.d);
    if (v.dt) return L.dt(v.dt);
    if (v.date) return L.date(v.date);
    if (v.t) return L.t(v.t, v.p);
    return '';
  };
  const fill = (s, p) => (p ? s.replace(/\{(\w+)\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(p, k) ? String(L.pv(p[k])) : m)) : s);
  // 'Paid@@receipt' = msgid with a context: EN renders 'Paid', ES looks up the full key first, then the bare one.
  L.t = (s, p) => {
    if (s == null) return '';
    s = String(s);
    const at = s.indexOf('@@'); const base = at < 0 ? s : s.slice(0, at);
    let out = base;
    // plural: with p.n === 1, ES['… @@one'] wins (EN templates stay as they are)
    if (L.lang() === 'es') { const one = p && Number(p.n) === 1 ? L.ES[s + '@@one'] : null; const v = one != null ? one : L.ES[s] != null ? L.ES[s] : at >= 0 ? L.ES[base] : null; if (v != null) out = v; else if (/[A-Za-z]{2}/.test(base)) L.missing.add(s); }
    return fill(out, p);
  };

  /* stored messages: notifications + email subjects keep {msg, p}; .text/.subject keep the EN render for logs and the judge */
  L.ntext = (n, lang) => (n.msg ? (lang ? L.inLang(lang, () => L.t(n.msg, n.p)) : L.t(n.msg, n.p)) : n.text || '');
  L.setNotifText = (n, msg, p) => { n.msg = msg; n.p = p || {}; n.text = L.ntext(n, 'en'); };
  L.etext = (e) => (e.msg ? L.t(e.msg, e.p) : e.subject || '');

  /* switch language for the whole world (both demo phones share one world) */
  L.setLang = (lang) => {
    if (!L.LANGS.includes(lang) || !L.W) return;
    L.W.lang = lang;
    if (L.applySeedLang) L.applySeedLang();
    document.documentElement.lang = lang;
  };
})();
