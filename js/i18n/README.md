# Lokaly prototype · EN/ES strings

**Status: the ES copy is a DRAFT.** Matt's native reviewer has to sign it off before the Phase 1 design gate.

## How it works
- `js/i18n.js` contains `L.t('EN source string {param}', { param })`. The English source string is the key, so the code still reads in English.
- The ES drafts live in four files:
  - `es-core.js`: tabs, status pills, shared vocabulary, emails, notifications
  - `es-shared.js`: S-xx screens
  - `es-business.js`: B-xx screens
  - `es-creator.js`: C-xx screens
- `es-seed.js` holds EN/ES pairs for the demo content (campaign titles, bios, chat). In the real app this is user-written and isn't translated.
- **Switching language:** S-02 (EN/ES pill), S-17 (Settings → Language) or the desk sidebar (World → App language). The switch is instant on both phones, and stored notifications and emails re-render in the new language.
- **Context keys:** `'Paid@@receipt'` renders "Paid" in EN but has its own ES entry. Use one where one English word needs two Spanish forms.
- **Singular:** `'{n} photos@@one'` is used when `n === 1`.
- **Money:** EN shows `€1,234.56`, ES shows `€1.234,56`. Dates use Spanish abbreviations (`lun 19 oct`). Percentages are `10 %` and hours `72 h`.
- **Checks:**
  - `cd tests && npm run judge` switches to ES and checks every screen for missing keys, English leftovers and ES-only truncation, wrapping or overflow.
  - `node shots.mjs --es` renders contact sheets to `tests/shots/es/`.

## Decisions for the native reviewer
1. **Creator collabs tab:** the label is **"Collabs"**, not "Colaboraciones". "Colaboraciones" measured 75 px in a 68 px tab cell (Instrument Sans 700, 10 px) and stuck out of the active pill. That makes the inventory §0.1 / §7 #14 fallback apply. The EN label is "Work".
2. **Euro format:** the brief asked for `€1.234,56` (symbol first). Spanish convention is `1.234,56 €`. If you prefer that, it's a one-line change in `L.eur` (core.js).
3. **Follower counts:** they show as `18,4K`. "18,4 mil" wrapped in the B-08 stat tiles.
4. **Register:** Castilian Spanish, tú throughout.
5. **Key terms to confirm:**
   - colaboración
   - solicitar / solicitud (for apply)
   - depositar (for fund)
   - retenido (held)
   - liberar (release)
   - cobro / cuenta de cobro (payout)
   - entregar / entrega (submit)
   - briefing
   - suscripción (subscription)
   - monedero (wallet)
   - retirar / retirada (withdraw)
   - declarados (self-reported)
   - Denunciar (report a user)
   - Informar de un problema (dispute)
6. **Kept in English as product or brand names:** App Store, Apple Pay ("Pay"), Stripe, Reel, beach club, fitness.
7. **[Bracketed placeholders]** for Matt are translated. They are still placeholders.
