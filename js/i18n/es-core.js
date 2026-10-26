/* ES draft for core.js, emails.js and data.js vocabulary · DRAFT pending native review (Matt's reviewer signs off before
   the Phase 1 design gate). Keys are the EN source strings used in t(); {placeholders} and inline markup stay identical. */
L.addES({
  /* ── tab bar (inventory §0.1 ES stress test) ── */
  'Home': 'Inicio', 'Discover': 'Descubrir', 'Create': 'Crear', 'Work': 'Colaboraciones', 'Messages': 'Mensajes', 'Profile': 'Perfil',
  // Creator collabs tab in ES. 'Colaboraciones' measured 75px in a 68px tab cell (Instrument Sans 700, 10px) and pokes out of the
  // active pill, so per inventory §0.1 / §7 #14 the ES label falls back to 'Collabs'. Native reviewer to confirm.
  'Collabs tab': 'Collabs',
  'Business tabs': 'Pestañas del negocio', 'Creator tabs': 'Pestañas del creador', '{tab}, {n} unread': '{tab}, {n} sin leer',

  /* ── status pills (L.STATUS) ── */
  'Invited': 'Invitada', 'Applied': 'Solicitada', 'Awaiting funding': 'Pendiente de depósito', 'Active': 'Activa',
  'In review': 'En revisión', 'Completed': 'Completada', 'Under review': 'En disputa', 'Resolved': 'Resuelta',
  'Refunded': 'Reembolsada', 'Cancelled': 'Cancelada', 'Not selected': 'No seleccionada', 'Withdrawn': 'Retirada', 'Expired': 'Caducada',

  /* ── shared vocabulary owned by data.js (stored EN, shown via t) ── */
  'Food': 'Gastronomía', 'Beach & lifestyle': 'Playa y estilo de vida', 'Fitness': 'Fitness', 'Beauty': 'Belleza', 'Fashion': 'Moda',
  'Nightlife': 'Vida nocturna', 'Family': 'Familia', 'Travel': 'Viajes',
  'Restaurant': 'Restaurante', 'Beach club': 'Beach club', 'Hotel': 'Hotel', 'Spa & beauty': 'Spa y belleza', 'Retail': 'Tienda', 'Experiences': 'Experiencias',
  'Marbella': 'Marbella', 'Puerto Banús': 'Puerto Banús', 'Estepona': 'Estepona', 'Other Costa del Sol': 'Resto de la Costa del Sol',
  'Instagram': 'Instagram', 'TikTok': 'TikTok', 'YouTube': 'YouTube',
  'Reel': 'Reel', 'Stories': 'Historias', 'Video': 'Vídeo', 'Post': 'Publicación',
  'Schedule clash': 'Coincidencia de horarios',

  /* ── generic components ── */
  'Processing…': 'Procesando…', 'Back': 'Atrás', 'Close': 'Cerrar',
  'Notifications': 'Notificaciones', 'Notifications, {n} unread': 'Notificaciones, {n} sin leer',
  'Verified': 'Perfil verificado', 'Step {n} of 4': 'Paso {n} de 4', 'Profile {pct}% complete': 'Perfil completado al {pct} %',
  'Experience': 'Experiencia', 'Paid': 'De pago','per creator': 'por creador',
  '{town} · {km} km · Apply by {date}': '{town} · {km} km · Hasta el {date}',
'{n} self-reported': '{n} declarados', 'New': 'Nuevo',
  'Profile {pct}%': 'Perfil {pct} %', 'Finish to publish campaigns': 'Complétalo para publicar campañas', 'Finish to apply': 'Complétalo para solicitar',
  'Logo, photos, description, address': 'Logo, fotos, descripción, dirección', 'Photo, bio, portfolio, a social': 'Foto, bio, portfolio y una red social',
  'Finish': 'Completar',
  'Offline · showing saved data': 'Sin conexión · datos guardados', 'Notification: {text}': 'Notificación: {text}', 'now': 'ahora',
  'Payment status': 'Estado del pago', 'Refunded@@escrow': 'Reembolsado','Frozen': 'Congelado', 'Held': 'Retenido', 'In review · 72h': 'En revisión · 72 h', 'Released': 'Liberado',

  /* ── relative time ── */
  'Just now': 'Ahora mismo', '{n} min ago': 'hace {n} min', '{n}h ago': 'hace {n} h', 'Yesterday': 'Ayer', '{n} days ago': 'hace {n} días',

  /* ── next action lines (collab rows) ── */
  'Review application': 'Revisar solicitud', 'Invite sent · waiting for {name}': 'Invitación enviada · esperando a {name}',
  'Fund to confirm {name}': 'Deposita para confirmar a {name}', 'Confirm {name}': 'Confirmar a {name}',
  'Visit {when}': 'Visita {when}', 'Agree a visit date': 'Acuerda una fecha de visita', 'Review · {h}h left': 'Revisar · quedan {h} h',
  'Auto-released': 'Liberado automáticamente', 'Approved & released': 'Aprobado y liberado', 'Lokaly is reviewing': 'Lokaly lo está revisando',
  'Respond to invite': 'Responder a la invitación', 'Waiting for {biz}': 'Esperando a {biz}', 'Waiting for funding': 'Esperando el depósito',
  'Waiting for confirmation': 'Esperando confirmación', 'Set visit date': 'Fija la fecha de visita', 'Submit your post': 'Entrega tu publicación',
  'Releasing in {h}h': 'Se libera en {h} h', 'Completes in {h}h': 'Se completa en {h} h',

  /* ── collab timeline ── */
  'Invited & accepted': 'Invitado y aceptado', 'Accepted & funded': 'Aceptado y depositado', 'Accepted': 'Aceptado', 'Visit': 'Visita',
  'Post submitted': 'Publicación entregada', '{date} · {amt} held': '{date} · {amt} retenidos', '{date} · No payment held': '{date} · Sin pago retenido',
  'Agree a time in chat, then set it here': 'Acuerda la hora en el chat y fíjala aquí', '{when} · 72h review': '{when} · revisión de 72 h',
  'Post URL + screenshot': 'Enlace de la publicación + captura', 'Auto-released after 72h': 'Liberado automáticamente a las 72 h', 'Approved': 'Aprobado',
  'Approve, or automatic after 72h': 'Aprobación, o automático a las 72 h',
  'Problem reported': 'Problema notificado', 'Funds frozen · Lokaly is reviewing': 'Fondos congelados · Lokaly lo está revisando',
  'Cancelled by creator': 'Cancelada por el creador', 'Cancelled by business': 'Cancelada por el negocio',
  'Cancelled by creator · business refunded': 'Cancelada por el creador · negocio reembolsado', 'Cancelled by business · business refunded': 'Cancelada por el negocio · negocio reembolsado',
  'Lokaly refunded the business': 'Lokaly reembolsó al negocio',

  /* ── notifications + email subjects raised by core / seed ── */
  "Reminder · 24h left to review {name}'s post": 'Recordatorio · quedan 24 h para revisar la publicación de {name}',
  '{biz} marked your collab complete': '{biz} ha marcado tu colaboración como completada',
  'Auto-released to {name} · {title}': 'Liberado automáticamente a {name} · {title}', 'Released to {name} · {title}': 'Liberado a {name} · {title}',
  'Released {amt} to {name} · {title}': '{amt} liberados a {name} · {title}',
  '{name} applied to {title}': '{name} ha solicitado {title}', 'Submission ready from {name} · 72h to review': 'Entrega lista de {name} · 72 h para revisar',
  'You funded {name} · {amt} held': 'Has depositado para {name} · {amt} retenidos', "You're in · {amt} secured with {biz}": 'Estás dentro · {amt} asegurados con {biz}',
  '{biz} invited you to {title}': '{biz} te ha invitado a {title}',

  /* ── emails E-01 … E-08 ── */
  'Sign-in code': 'Código de acceso','Funding confirmation': 'Confirmación de depósito',
  'Release receipt': 'Recibo de liberación', 'Refund confirmation': 'Confirmación de reembolso',
  'Payout action required': 'Acción necesaria para cobrar', 'Dispute opened / resolved': 'Disputa abierta / resuelta', '{name} (sample)': '{name} (muestra)',
  'Your sign-in code': 'Tu código de acceso', 'Enter this code in the Lokaly app. It expires in 10 minutes.': 'Introduce este código en la app de Lokaly. Caduca en 10 minutos.',
  "Didn't ask for this? Ignore this email. Nobody can sign in without the code.": '¿No lo has pedido? Ignora este correo. Nadie puede entrar sin el código.',
  'You funded {name}': 'Has depositado para {name}', '{amt} is held safely by Stripe for <b>{title}</b>.': 'Stripe retiene {amt} de forma segura para <b>{title}</b>.',
  'Creator rate': 'Tarifa del creador', 'Lokaly fee 10%': 'Comisión de Lokaly 10 %',
  'Released to {name}': 'Liberado a {name}', '<b>{title}</b> is complete.': '<b>{title}</b> se ha completado.',
  '<b>{title}</b> is complete (auto-released after 72 hours).': '<b>{title}</b> se ha completado (liberado automáticamente a las 72 horas).', 'Total paid': 'Total pagado',
  'Your refund is on its way': 'Tu reembolso está en camino', 'The collab with {name} for <b>{title}</b> was cancelled.': 'Se ha cancelado la colaboración con {name} para <b>{title}</b>.',
  'Funded': 'Depositado','Refunded to your card': 'Reembolsado a tu tarjeta',
  'Refunds take 5–10 business days to appear.': 'Los reembolsos tardan de 5 a 10 días hábiles en aparecer.',
  '{amt} is on its way, {name}': '{name}, {amt} van de camino', 'Rate': 'Tarifa',
  'Your payouts need one thing': 'A tus cobros les falta una cosa',
  'Hi {name}, Stripe needs a little more information before we can pay you. It takes about three minutes.': 'Hola, {name}: Stripe necesita algo más de información para poder pagarte. Son unos tres minutos.',
  'Finish in the app': 'Terminar en la app', 'Lokaly is reviewing a collab': 'Lokaly está revisando una colaboración',
  'A problem was reported on <b>{title}</b>. The payment is frozen and the 72-hour timer is paused.': 'Se ha notificado un problema en <b>{title}</b>. El pago está congelado y el plazo de 72 horas, en pausa.',
  'A problem was reported on <b>{title}</b> ({reason}). The payment is frozen and the 72-hour timer is paused.': 'Se ha notificado un problema en <b>{title}</b> ({reason}). El pago está congelado y el plazo de 72 horas, en pausa.',
  "We'll contact both sides soon. Reply to this email to add information.": 'Contactaremos con ambas partes en breve. Responde a este correo para añadir información.',
  '<b>Update:</b> resolved, released to the creator.': '<b>Actualización:</b> resuelta, liberado al creador.', '<b>Update:</b> resolved, refunded to the business.': '<b>Actualización:</b> resuelta, reembolsado al negocio.',
  'To: {to}': 'Para: {to}',
  "Lokaly · Marbella, Spain · You get this email because of activity on your account. Transactional emails can't be switched off. EN/ES follows your app language.": 'Lokaly · Marbella, España · Recibes este correo por actividad en tu cuenta. Los correos transaccionales no se pueden desactivar. El idioma (EN/ES) sigue el de tu app.'
});

/* ── ES singulars: L.t picks '…@@one' when p.n === 1 (EN templates are unchanged) ── */
L.addES({
  '{n} live campaigns on the coast.@@one': '1 campaña activa en la costa.', '{n} live@@one': '1 activa', '{n} new@@one': '1 nueva', '{n} pending@@one': '1 pendiente',
  '{n} photos@@one': '1 foto', '{n} results@@one': '1 resultado', '{n} saved automatically@@one': '1 guardado automáticamente', '{n} submitted@@one': '1 entregada',
  '{n} campaigns · newest first@@one': '1 campaña', '{n} creators · Recommended@@one': '1 creador · Recomendado', 'Show {n} campaigns@@one': 'Ver 1 campaña', 'Show {n} creators@@one': 'Ver 1 creador',
  'CSV exported · {n} rows@@one': 'CSV exportado · 1 fila', 'Finish or cancel {n} collabs first@@one': 'Primero termina o cancela 1 colaboración', '{n} days ago@@one': 'hace 1 día',
  '{n} new messages from {name}@@one': '1 mensaje nuevo de {name}'
});

/* ── Business model v2 (2026-10-26): subscription, creator wallet, no fees. DRAFT pending native review. ── */
L.addES({
  "{n} on {platform}": "{n} en {platform}",
  "{n} on {platform} · self-reported": "{n} en {platform} · declarados",
  "{amt} in your wallet": "{amt} en tu monedero",
  "Approved · {amt} is in your wallet": "Aprobada · {amt} ya está en tu monedero",
  "Auto-released · {amt} is in your wallet": "Liberada automáticamente · {amt} ya está en tu monedero",
  "Withdrawal sent · {amt} to your bank": "Retirada enviada · {amt} a tu banco",
  "Withdrawal on its way · {amt}": "Retirada en camino · {amt}",
  "Withdrawal sent": "Retirada enviada",
  "withdrawal": "retirada",
  "It's released when you approve the post, or automatically 72 hours after it's submitted. Cancel before submission for a refund minus non-refundable charges.": "Se libera cuando apruebas la publicación o, automáticamente, 72 horas después de la entrega. Si cancelas antes de la entrega, se te reembolsa menos los cargos no reembolsables.",
  "Withdrawal from your Lokaly wallet to {bank}.": "Retirada de tu monedero de Lokaly a {bank}.",
  "Expect it in your bank in 1–3 business days.": "Llegará a tu banco en 1–3 días hábiles.",
  "Response time (days): Lokaly to set.": "Plazo de respuesta (días): pendiente de Lokaly.",
  "Of which IVA 21%": "IVA 21 % incluido",
  "Non-refundable charges": "Cargos no reembolsables",
  "Withdraw from wallet": "Retirar del monedero",
  "Lokaly subscription": "Suscripción a Lokaly",
  "Subscription restored": "Suscripción restaurada"
});
