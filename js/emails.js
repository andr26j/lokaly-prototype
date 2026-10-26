/* Transactional email templates E-01, E-03 … E-08 (EN + draft ES, follows the app language). E-02 went with the Experience fee. Rendered in the desk outbox, not in a phone. */
(function () {
  const L = window.L, esc = L.esc, t = L.t;
  L.EMAILS = {
    'E-01': 'Sign-in code', 'E-03': 'Funding confirmation', 'E-04': 'Release receipt',
    'E-05': 'Refund confirmation', 'E-06': 'Withdrawal sent', 'E-07': 'Payout action required', 'E-08': 'Dispute opened / resolved'
  };
  const table = (rows) => '<table class="em-table">' + rows.map((r) => '<tr><td>' + esc(t(r[0])) + '</td><td>' + (r[2] ? '<b>' + r[1] + '</b>' : r[1]) + '</td></tr>').join('') + '</table>';
  const ctx = (e) => { const col = e.data.col && L.col(e.data.col); const k = col ? L.camp(col.campaignId) : e.data.campaign ? L.camp(e.data.campaign) : null; return { col, k, b: k ? L.biz(k.bizId) : L.myBiz(), cr: col ? L.cr(col.creatorId) : L.myCr() }; };
  L.renderEmail = function (e) {
    const { col, k, b, cr } = ctx(e);
    let body;
    switch (e.id) {
      case 'E-01': body = '<h3>' + t('Your sign-in code') + '</h3><p>' + t('Enter this code in the Clasp app. It expires in 10 minutes.') + '</p><p style="font-size:40px;letter-spacing:.3em;font-variant-numeric:tabular-nums;margin:20px 0">482 913</p><p>' + t('Didn\'t ask for this? Ignore this email. Nobody can sign in without the code.') + '</p>'; break;
      case 'E-03': body = '<h3>' + t('You funded {name}', { name: esc(cr.first) }) + '</h3><p>' + t('{amt} is held safely by Stripe for <b>{title}</b>.', { amt: L.eur(L.payB(k.rate), 2), title: esc(k.title) }) + '</p>' + table([['Creator rate', L.eur(k.rate, 2)], ['Of which IVA 21%', L.eur(L.iva(k.rate), 2)], ['Held', L.eur(L.payB(k.rate), 2), 1]]) + '<p>' + t('It\'s released when you approve the post, or automatically 72 hours after it\'s submitted. Cancel before submission for a refund minus non-refundable charges.') + '</p>'; break;
      case 'E-04': body = '<h3>' + t('Released to {name}', { name: esc(cr.first) }) + '</h3><p>' + t(col && col.releaseReason === 'auto_released' ? '<b>{title}</b> is complete (auto-released after 72 hours).' : '<b>{title}</b> is complete.', { title: esc(k.title) }) + '</p>' + table([['Creator rate', L.eur(k.rate, 2)], ['Of which IVA 21%', L.eur(L.iva(k.rate), 2)], ['Total paid', L.eur(L.payB(k.rate), 2), 1]]); break;
      case 'E-05': body = '<h3>' + t('Your refund is on its way') + '</h3><p>' + t('The collab with {name} for <b>{title}</b> was cancelled.', { name: esc(cr.first), title: esc(k.title) }) + '</p>' + table([['Funded', L.eur(L.payB(k.rate), 2)], ['Non-refundable charges', '−' + L.eur(L.stripeCost(L.payB(k.rate)), 2)], ['Refunded to your card', L.eur(L.payB(k.rate) - L.stripeCost(L.payB(k.rate)), 2), 1]]) + '<p>' + t('Refunds take 5–10 business days to appear.') + '</p>'; break;
      case 'E-06': { const w = (e.data.w && L.W.withdrawals.find((y) => y.id === e.data.w)) || L.W.withdrawals[0] || { amount: 100 }; const fee = L.wFee(w.amount);
        body = '<h3>' + t('{amt} is on its way, {name}', { amt: L.eur(L.wNet(w.amount), 2), name: esc(cr.first) }) + '</h3><p>' + t('Withdrawal from your Clasp wallet to {bank}.', { bank: L.bankLabel }) + '</p>' + table([['Withdraw from wallet', L.eur(w.amount, 2)], ['Clasp fee 10%', '−' + L.eur(fee, 2)], ['Of which IVA 21%', L.eur(L.iva(fee), 2)], ['You receive', L.eur(L.wNet(w.amount), 2), 1]]) + '<p>' + t('Expect it in your bank in 1–3 business days.') + '</p>'; break; }
      case 'E-07': body = '<h3>' + t('Your payouts need one thing') + '</h3><p>' + t('Hi {name}, Stripe needs a little more information before we can pay you. It takes about three minutes.', { name: esc(cr.first) }) + '</p><p><a href="#" style="display:inline-block;background:#14171A;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">' + t('Finish in the app') + '</a></p>'; break;
      case 'E-08': body = '<h3>' + t('Clasp is reviewing a collab') + '</h3><p>' + t(col && col.disputeReason ? 'A problem was reported on <b>{title}</b> ({reason}). The payment is frozen and the 72-hour timer is paused.' : 'A problem was reported on <b>{title}</b>. The payment is frozen and the 72-hour timer is paused.', { title: esc(k.title), reason: col && col.disputeReason ? esc(t(col.disputeReason)) : '' }) + '</p><p>' + t('We\'ll contact both sides soon. Reply to this email to add information.') + ' <span style="background:#FFF4E5;color:#6B3E07;border-radius:999px;padding:1px 8px;font-size:12px">' + esc(t('Open question')) + ' · ' + esc(t('Response time (days): Clasp to set.')) + '</span>' + '</p>' + (col && /resolved/.test(col.status) ? '<p>' + t(col.status === 'resolved_released' ? '<b>Update:</b> resolved, released to the creator.' : '<b>Update:</b> resolved, refunded to the business.') + '</p>' : ''); break;
      default: body = '<p>Unknown template</p>';
    }
    return '<div class="em-head"><span><b style="color:#14171A">' + e.id + '</b> · ' + t('To: {to}', { to: esc(e.to) }) + '</span><span>' + L.dt(e.at) + '</span></div><div class="em-body" lang="' + L.lang() + '"><div style="font-family:var(--serif);font-size:24px;margin-bottom:22px">Clasp</div><div style="font-size:13px;color:#5C636B;margin-bottom:8px">' + esc(L.etext(e)) + '</div>' + body + '<div class="em-foot">' + t('Clasp · Marbella, Spain · You get this email because of activity on your account. Transactional emails can\'t be switched off. EN/ES follows your app language.') + '</div></div>';
  };
  L.sampleEmail = function (id) {
    const col = { 'E-03': 'col2', 'E-04': 'col7', 'E-05': 'col8', 'E-06': 'col3', 'E-08': 'col2' }[id];
    const e = { id, to: id === 'E-06' || id === 'E-07' ? 'Lucía' : 'Casa Brisa', msg: '{name} (sample)', p: { name: { t: L.EMAILS[id] } }, at: L.W.now, data: { col: col && L.col(col) ? col : null, campaign: 'k2', w: id === 'E-06' ? 'w1' : null } };
    e.subject = L.inLang('en', () => L.etext(e));
    return e;
  };
})();
