/* Seed worlds. Everything a phone shows is derived from one world object, so both phones stay in sync. */
(function () {
  const L = (window.L = window.L || {});
  const H = 3600e3, D = 24 * H;
  const NOW = new Date(2026, 9, 19, 10, 20).getTime(); // Mon 19 Oct 2026, 10:20
  L.H = H; L.D = D;

  L.NICHES = ['Food', 'Beach & lifestyle', 'Fitness', 'Beauty', 'Fashion', 'Nightlife', 'Family', 'Travel'];
  L.CATEGORIES = ['Restaurant', 'Beach club', 'Hotel', 'Spa & beauty', 'Fitness', 'Retail', 'Nightlife', 'Experiences'];
  L.TOWNS = ['Marbella', 'Puerto Banús', 'Estepona', 'Other Costa del Sol'];

  const img = (n) => 'img/' + n + '.webp';
  L.img = img;

  function creators() {
    return [
      { id: 'cr1', first: 'Lucía', last: 'Navarro', username: 'lucia.coast', photo: img('lucia'), niches: ['Food', 'Beach & lifestyle'], town: 'Marbella', km: 1.4,
        bio: 'Slow mornings, long lunches, the coast at golden hour. Marbella born.',
        socials: { ig: { connected: true, handle: '@lucia.coast', followers: 18400, eng: 4.1, synced: NOW - 2 * H }, tt: { connected: true, handle: '@luciacoast', followers: 9100, eng: 6.3, synced: NOW - 2 * H }, other: [] },
        portfolio: ['lucia', 'coast', 'restaurant'].map(img), joined: 'Mar 2026' },
      { id: 'cr2', first: 'Sofía', last: 'Ruiz', username: 'sofiaruiz', photo: img('sofia'), niches: ['Beauty', 'Fashion'], town: 'Puerto Banús', km: 6.8,
        bio: 'Skin, style and the odd sunset. Puerto Banús.',
        socials: { ig: { connected: true, handle: '@sofiaruiz.mbl', followers: 24600, eng: 3.8 }, tt: { connected: true, handle: '@sofia.ruiz', followers: 41200, eng: 7.9 }, other: [] },
        portfolio: ['fashion', 'spa', 'sofia', 'nightlife'].map(img), joined: 'Jan 2026' },
      { id: 'cr3', first: 'Mateo', last: 'García', username: 'mateomoves', photo: img('mateo'), niches: ['Fitness', 'Travel'], town: 'Estepona', km: 21.5,
        bio: 'Runner, swimmer, early riser. Estepona to the rock.',
        socials: { ig: { connected: false }, tt: { connected: false }, other: [{ platform: 'Instagram', handle: '@mateomoves', followers: 6200 }] },
        portfolio: ['fitness', 'coast', 'mateo'].map(img), joined: 'May 2026' },
      { id: 'cr4', first: 'Clara', last: 'Martín', username: 'claraeats', photo: img('clara'), niches: ['Food', 'Family'], town: 'Marbella', km: 2.2,
        bio: 'Where to eat with kids who have opinions.',
        socials: { ig: { connected: true, handle: '@clara.eats', followers: 11800, eng: 5.2 }, tt: { connected: false }, other: [] },
        portfolio: ['brunch', 'restaurant', 'clara'].map(img), joined: 'Apr 2026' },
      { id: 'cr5', first: 'Carlos', last: 'Ortega', username: 'carlosnights', photo: img('carlos'), niches: ['Nightlife', 'Fashion'], town: 'Puerto Banús', km: 7.1,
        bio: 'After dark on the Costa. Rooftops, DJs, the good tables.',
        socials: { ig: { connected: true, handle: '@carlos.ortega', followers: 31200, eng: 3.1 }, tt: { connected: true, handle: '@carlosnights', followers: 18300, eng: 5.5 }, other: [] },
        portfolio: ['nightlife', 'carlos', 'fashion'].map(img), joined: 'Feb 2026' },
      { id: 'cr6', first: 'Isabel', last: 'Torres', username: 'isabel.t', photo: img('isabel'), niches: ['Beach & lifestyle', 'Travel'], town: 'Estepona', km: 19.8,
        bio: 'Moved from Madrid for the light. Beaches, coves and hidden calas.',
        socials: { ig: { connected: true, handle: '@isabel.torres', followers: 15300, eng: 4.6 }, tt: { connected: false }, other: [] },
        portfolio: ['coast', 'isabel'].map(img), joined: 'Oct 2026' },
      { id: 'cr7', first: 'Daniel', last: 'Moreno', username: 'danieltastes', photo: img('daniel'), niches: ['Food'], town: 'Marbella', km: 3.0,
        bio: 'Tapas, honest reviews, no filters on the croquetas.',
        socials: { ig: { connected: false }, tt: { connected: false }, other: [{ platform: 'Instagram', handle: '@danieltastes', followers: 4400 }, { platform: 'YouTube', handle: 'Daniel Tastes', followers: 1200 }] },
        portfolio: ['restaurant', 'brunch', 'daniel'].map(img), joined: 'Jun 2026' },
      { id: 'cr8', first: 'Alex', last: 'Romero', username: 'alexromero', photo: img('alex'), niches: ['Fashion', 'Nightlife'], town: 'Marbella', km: 1.9,
        bio: 'Menswear, Marbella, the occasional film camera.',
        socials: { ig: { connected: true, handle: '@alex.romero', followers: 9700, eng: 4.9 }, tt: { connected: true, handle: '@alexrmro', followers: 12600, eng: 6.1 }, other: [] },
        portfolio: ['fashion', 'alex', 'nightlife'].map(img), joined: 'Jul 2026' }
    ];
  }

  function businesses() {
    return [
      { id: 'b1', name: 'Casa Brisa', owner: 'Marta', category: 'Beach club', town: 'Marbella', address: 'Paseo Marítimo 12, 29602 Marbella', color: '#2F6E96', km: 1.2, cover: img('brunch'), photos: [img('brunch')],
        desc: 'Daybeds, grilled fish and the longest sunset on the Paseo. Open daily 10:00–late.', web: 'casabrisa.es', ig: '@casabrisa.mbl', meter: { logo: true, cover: true, desc: true, address: true } },
      { id: 'b2', name: 'Mar de Olivos', category: 'Restaurant', town: 'Marbella', address: 'Calle Ancha 4, Casco Antiguo, Marbella', color: '#56622E', km: 0.8, cover: img('brunch'), photos: [img('brunch')],
        desc: 'Andalusian tasting menus in the old town. Olive oil from our own grove.', web: 'mardeolivos.es', ig: '@mardeolivos' },
      { id: 'b3', name: 'Spa Agua Clara', category: 'Spa & beauty', town: 'Estepona', address: 'Av. del Carmen 31, Estepona', color: '#0D6B66', km: 20.4, cover: img('spa'), photos: [img('spa')],
        desc: 'Thermal circuit, sea-salt rituals and a quiet rooftop pool.', web: 'aguaclara.spa', ig: '@aguaclara.spa' },
      { id: 'b4', name: 'Azotea Banús', category: 'Nightlife', town: 'Puerto Banús', address: 'Muelle Ribera 2, Puerto Banús', color: '#3B4757', km: 7.0, cover: img('nightlife'), photos: [img('nightlife')],
        desc: 'Rooftop bar over the marina. DJs Thursday to Sunday.', web: 'azoteabanus.com', ig: '@azoteabanus' },
      { id: 'b5', name: 'Forma Studio', category: 'Fitness', town: 'Estepona', address: 'Calle Real 88, Estepona', color: '#8A5A2B', km: 21.0, cover: img('fitness'), photos: [img('fitness')],
        desc: 'Beach bootcamps at sunrise, reformer pilates by night.', web: 'forma.studio', ig: '@forma.studio' },
      { id: 'b6', name: 'Lumen Boutique', category: 'Retail', town: 'Marbella', address: 'Av. Ricardo Soriano 21, Marbella', color: '#6B4E71', km: 1.6, cover: img('fashion'), photos: [img('fashion')],
        desc: 'Independent labels from Andalucía and Lisbon.', web: 'lumen.boutique', ig: '@lumenboutique' },
      { id: 'b7', name: 'Café Sal', category: 'Restaurant', town: 'Marbella', address: 'Plaza de los Naranjos 6, Marbella', color: '#A0522D', km: 0.6, cover: img('restaurant'), photos: [img('restaurant')],
        desc: 'Brunch until four. Sourdough baked at dawn.', web: 'cafesal.es', ig: '@cafesal.mbl' }
    ];
  }

  function campaigns() {
    return [
      { id: 'k1', bizId: 'b1', type: 'paid', title: 'Sunset daybed reel', cover: img('coast'), category: 'Beach club', town: 'Marbella', km: 1.2, rate: 200, slots: 1,
        applyBy: NOW + 11 * D, visitFrom: NOW + 3 * D, visitTo: NOW + 20 * D, status: 'active', published: NOW - 5 * D, niches: ['Beach & lifestyle', 'Food'],
        brief: 'Capture the hour before sunset from one of our front-row daybeds: the light, the cava, the grilled fish coming out. Calm, warm, unhurried. No crowds in shot.',
        deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }, { platform: 'Instagram', format: 'Stories', count: 3 }], mustInclude: '@casabrisa.mbl · #CasaBrisaSunset', donts: 'No other venues or brands in shot.' },
      // One campaign = one creator (v2): Mateo and Clara each have their own Casa Brisa campaign.
      { id: 'k12', bizId: 'b1', type: 'paid', title: 'Sunrise swim & breakfast', cover: img('fitness'), category: 'Beach club', town: 'Marbella', km: 1.2, rate: 200, slots: 1,
        applyBy: NOW + 5 * D, visitFrom: NOW + 1 * D, visitTo: NOW + 14 * D, status: 'active', published: NOW - 6 * D, niches: ['Fitness', 'Beach & lifestyle'],
        brief: 'A first swim off our jetty at seven, then breakfast on the terrace as the beach wakes up. Fresh, bright, quiet.', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }, { platform: 'Instagram', format: 'Stories', count: 3 }], mustInclude: '@casabrisa.mbl', donts: 'No other venues or brands in shot.' },
      { id: 'k13', bizId: 'b1', type: 'paid', title: 'Family Sunday on the sand', cover: img('brunch'), category: 'Beach club', town: 'Marbella', km: 1.2, rate: 200, slots: 1,
        applyBy: NOW - 1 * D, visitFrom: NOW - 4 * D, visitTo: NOW + 10 * D, status: 'active', published: NOW - 9 * D, niches: ['Food', 'Family'],
        brief: 'Lunch with the kids at a shaded front-row table: the paella, the sandcastles, the long table. Warm and real.', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }, { platform: 'Instagram', format: 'Stories', count: 3 }], mustInclude: '@casabrisa.mbl', donts: 'No other venues or brands in shot.' },
      { id: 'k2', bizId: 'b1', type: 'experience', title: 'Daybed for two', cover: img('spa'), category: 'Beach club', town: 'Marbella', km: 1.2, offer: 'Front-row daybed + lunch for two', value: 140, slots: 1,
        applyBy: NOW + 9 * D, visitFrom: NOW + 2 * D, visitTo: NOW + 30 * D, status: 'active', published: NOW - 2 * D, niches: ['Beach & lifestyle'],
        brief: 'Spend an afternoon with us and show what a lazy Sunday on the Paseo feels like.', deliverables: [{ platform: 'Instagram', format: 'Stories', count: 4 }], mustInclude: '@casabrisa.mbl', donts: '' },
      { id: 'k3', bizId: 'b2', type: 'paid', title: 'Autumn tasting menu', cover: img('restaurant'), category: 'Restaurant', town: 'Marbella', km: 0.8, rate: 250, slots: 1,
        applyBy: NOW + 6 * D, visitFrom: NOW + 1 * D, visitTo: NOW + 14 * D, status: 'active', published: NOW - 3 * D, niches: ['Food'],
        brief: 'Seven courses, one story. Film the kitchen pass and the first course reveal.', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }, { platform: 'TikTok', format: 'Video', count: 1 }], mustInclude: '@mardeolivos', donts: 'No flash photography in the dining room.' },
      { id: 'k4', bizId: 'b3', type: 'paid', title: 'Thermal circuit day', cover: img('coast'), category: 'Spa & beauty', town: 'Estepona', km: 20.4, rate: 150, slots: 1,
        applyBy: NOW - 40 * D, visitFrom: NOW - 38 * D, visitTo: NOW - 25 * D, status: 'closed', published: NOW - 50 * D, niches: ['Beauty', 'Beach & lifestyle'],
        brief: 'A full circuit, from the salt room to the rooftop pool.', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }], mustInclude: '@aguaclara.spa', donts: '' },
      { id: 'k5', bizId: 'b4', type: 'paid', title: 'Rooftop opening night', cover: img('nightlife'), category: 'Nightlife', town: 'Puerto Banús', km: 7.0, rate: 300, slots: 1,
        applyBy: NOW + 12 * D, visitFrom: NOW + 5 * D, visitTo: NOW + 5 * D, status: 'active', published: NOW - 2 * H, niches: ['Nightlife', 'Fashion'],
        brief: 'Opening night of the new terrace. Arrive 21:00, capture the first set and the marina view.', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }, { platform: 'Instagram', format: 'Stories', count: 5 }], mustInclude: '@azoteabanus', donts: '' },
      { id: 'k6', bizId: 'b5', type: 'paid', title: '7am beach bootcamp', cover: img('fitness'), category: 'Fitness', town: 'Estepona', km: 21.0, rate: 120, slots: 1,
        applyBy: NOW + 4 * D, visitFrom: NOW + 2 * D, visitTo: NOW + 10 * D, status: 'active', published: NOW - 4 * D, niches: ['Fitness'],
        brief: 'Join a 45-minute session and show the burn and the sunrise.', deliverables: [{ platform: 'TikTok', format: 'Video', count: 1 }], mustInclude: '@forma.studio', donts: '' },
      { id: 'k7', bizId: 'b6', type: 'experience', title: 'AW26 styling session', cover: img('fashion'), category: 'Retail', town: 'Marbella', km: 1.6, offer: '€150 store credit + styling hour', value: 150, slots: 1,
        applyBy: NOW + 8 * D, visitFrom: NOW + 1 * D, visitTo: NOW + 21 * D, status: 'active', published: NOW - 1 * D, niches: ['Fashion'],
        brief: 'Pick three looks with our stylist and show the try-on.', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }], mustInclude: '@lumenboutique', donts: '' },
      { id: 'k8', bizId: 'b7', type: 'experience', title: 'Brunch for two', cover: img('brunch'), category: 'Restaurant', town: 'Marbella', km: 0.6, offer: 'Brunch for two + coffee', value: 60, slots: 1,
        applyBy: NOW + 10 * D, visitFrom: NOW + 1 * D, visitTo: NOW + 30 * D, status: 'active', published: NOW - 6 * D, niches: ['Food', 'Family'],
        brief: 'Weekend brunch on the plaza. Show the sourdough.', deliverables: [{ platform: 'Instagram', format: 'Stories', count: 3 }], mustInclude: '@cafesal.mbl', donts: '' },
      { id: 'k10', bizId: 'b2', type: 'paid', title: 'Sunday paella session', cover: img('restaurant'), category: 'Restaurant', town: 'Marbella', km: 0.8, rate: 220, slots: 1,
        applyBy: NOW - 2 * D, visitFrom: NOW - 1 * D, visitTo: NOW + 13 * D, status: 'closed', published: NOW - 12 * D, niches: ['Food'],
        brief: 'Our chef cooks the Sunday paella over orange wood. Film the fire, the crust and the first spoonful.', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }, { platform: 'Instagram', format: 'Stories', count: 2 }], mustInclude: '@mardeolivos · #PaellaDomingo', donts: 'No flash in the dining room.' },
      { id: 'k11', bizId: 'b1', type: 'paid', title: 'Long lunch on the Paseo', cover: img('brunch'), category: 'Beach club', town: 'Marbella', km: 1.2, rate: 200, slots: 1,
        applyBy: NOW - 4 * D, visitFrom: NOW - 2 * D, visitTo: NOW + 10 * D, status: 'closed', published: NOW - 14 * D, niches: ['Food', 'Beach & lifestyle'],
        brief: 'Two hours at a front-row table: the grilled fish, a cold white, the Paseo going by. Warm, slow, real.', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }, { platform: 'Instagram', format: 'Stories', count: 2 }], mustInclude: '@casabrisa.mbl', donts: 'No other venues or brands in shot.' },
      { id: 'k9', bizId: 'b1', type: 'paid', title: 'Summer closing party', cover: img('nightlife'), category: 'Beach club', town: 'Marbella', km: 1.2, rate: 180, slots: 1,
        applyBy: NOW - 30 * D, visitFrom: NOW - 28 * D, visitTo: NOW - 26 * D, status: 'closed', published: NOW - 45 * D, niches: ['Nightlife'],
        brief: 'Last party of the season.', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }], mustInclude: '@casabrisa.mbl', donts: '' }
    ];
  }

  function collab(id, campaignId, creatorId, status, extra) {
    return Object.assign({ id, campaignId, creatorId, status, pitch: '', visitDate: null, submission: null, submittedAt: null, releaseReason: null, history: [{ s: status, at: NOW - 2 * D }] }, extra || {});
  }

  function collabs() {
    return [
      collab('col1', 'k12', 'cr3', 'active', { visitDate: NOW + 3 * D + 9 * H + 10 * 60e3, history: [{ s: 'applied', at: NOW - 4 * D }, { s: 'active', at: NOW - 3 * D }] }),
      collab('col2', 'k13', 'cr4', 'submitted', { visitDate: NOW - 2 * D, submittedAt: NOW - 11 * H, submission: { url: 'https://www.instagram.com/reel/C9brisaClara/', shots: [img('coast'), img('brunch')] },
        history: [{ s: 'applied', at: NOW - 6 * D }, { s: 'active', at: NOW - 5 * D }, { s: 'submitted', at: NOW - 11 * H }] }),
      collab('col3', 'k4', 'cr1', 'completed', { visitDate: NOW - 33 * D, submittedAt: NOW - 30 * D, releaseReason: 'approved', submission: { url: 'https://www.instagram.com/reel/C8aguaLucia/', shots: [img('lucia')] },
        history: [{ s: 'applied', at: NOW - 40 * D }, { s: 'active', at: NOW - 39 * D }, { s: 'submitted', at: NOW - 30 * D }, { s: 'completed', at: NOW - 29 * D }] }),
      collab('col4', 'k3', 'cr1', 'invited', { note: 'We loved your Café Sal reel. Would you film our autumn menu?', history: [{ s: 'invited', at: NOW - 20 * H }] }),
      collab('col5', 'k6', 'cr1', 'applied', { pitch: 'I swim at Estepona every morning, happy to do the 7am.', history: [{ s: 'applied', at: NOW - 30 * H }] }),
      collab('col6', 'k2', 'cr2', 'applied', { pitch: 'Sunday daybeds are my favourite story format. I can bring a photographer friend.', history: [{ s: 'applied', at: NOW - 6 * H }] }),
      collab('col7', 'k9', 'cr7', 'completed', { visitDate: NOW - 27 * D, submittedAt: NOW - 25 * D, releaseReason: 'auto_released', submission: { url: 'https://www.instagram.com/reel/C7party/', shots: [img('restaurant')] },
        history: [{ s: 'applied', at: NOW - 35 * D }, { s: 'active', at: NOW - 34 * D }, { s: 'submitted', at: NOW - 25 * D }, { s: 'completed', at: NOW - 22 * D }] }),
      collab('col8', 'k9', 'cr5', 'cancelled', { cancelBy: 'creator', cancelReason: 'Schedule clash', history: [{ s: 'applied', at: NOW - 36 * D }, { s: 'active', at: NOW - 35 * D }, { s: 'cancelled', at: NOW - 31 * D }] }),
      // A7: the collab both demo phones share. Funded (€200 held), visit Wed 21 Oct; €200 goes to Lucía's wallet when Marta approves.
      collab('col11', 'k11', 'cr1', 'active', { visitDate: NOW + 2 * D + 3 * H + 10 * 60e3, pitch: 'Long lunches are my whole feed. I would love to film yours.', history: [{ s: 'applied', at: NOW - 8 * D }, { s: 'active', at: NOW - 4 * D }] }),
      // Sunday paella: Lucía visited yesterday (Sun 18 Oct, 13:30); next step is submitting her post.
      collab('col10', 'k10', 'cr1', 'active', { visitDate: NOW - 1 * D + 3 * H + 10 * 60e3, history: [{ s: 'applied', at: NOW - 6 * D }, { s: 'active', at: NOW - 2 * D }] }),
      collab('col9', 'k1', 'cr8', 'applied', { pitch: 'Linen, sunset, a negroni. I know this brief.', history: [{ s: 'applied', at: NOW - 3 * H }] })
    ];
  }

  function threads() {
    return [
      { id: 't1', bizId: 'b1', creatorId: 'cr3', campaignId: 'k12', msgs: [
        { from: 'sys', deal: 'funded', collabId: 'col1', at: NOW - 3 * D },
        { from: 'biz', text: 'Hi Mateo! Thursday at 19:30 works for the sunset slot?', at: NOW - 2 * D },
        { from: 'cr', text: 'Perfect, see you Thursday.', at: NOW - 2 * D + H },
        { from: 'sys', deal: 'visit', collabId: 'col1', at: NOW - 2 * D + H + 60e3 }], unread: { business: 0, creator: 0 } },
      { id: 't2', bizId: 'b1', creatorId: 'cr4', campaignId: 'k13', msgs: [
        { from: 'sys', deal: 'funded', collabId: 'col2', at: NOW - 5 * D },
        { from: 'cr', text: 'Posted! The reel is up, screenshots attached.', at: NOW - 11 * H },
        { from: 'sys', deal: 'submission', collabId: 'col2', at: NOW - 11 * H }], unread: { business: 1, creator: 0 } },
      { id: 't3', bizId: 'b2', creatorId: 'cr1', campaignId: 'k3', msgs: [
        { from: 'sys', deal: 'funded', collabId: 'col10', at: NOW - 2 * D },
        { from: 'biz', text: 'Hola Lucía! Sunday 13:30 for the paella? The fire is lit by one.', at: NOW - 2 * D + 2 * H },
        { from: 'cr', text: 'Perfecto, I\'ll be there at 13:15.', at: NOW - 2 * D + 3 * H },
        { from: 'sys', deal: 'visit', collabId: 'col10', at: NOW - 2 * D + 3 * H + 60e3 },
        { from: 'sys', deal: 'invite', collabId: 'col4', at: NOW - 20 * H },
        { from: 'biz', text: 'We loved your Café Sal reel. Would you film our autumn menu?', at: NOW - 20 * H }], unread: { business: 0, creator: 1 } },
      { id: 't4', bizId: 'b3', creatorId: 'cr1', campaignId: 'k4', msgs: [
        { from: 'biz', text: 'Thank you Lucía, the reel is beautiful.', at: NOW - 29 * D },
        { from: 'sys', deal: 'released', collabId: 'col3', at: NOW - 29 * D }], unread: { business: 0, creator: 0 } },
      { id: 't5', bizId: 'b1', creatorId: 'cr2', campaignId: 'k2', msgs: [
        { from: 'sys', deal: 'application', collabId: 'col6', at: NOW - 6 * H }], unread: { business: 1, creator: 0 } },
      { id: 't6', bizId: 'b1', creatorId: 'cr1', campaignId: 'k11', msgs: [
        { from: 'sys', deal: 'funded', collabId: 'col11', at: NOW - 4 * D },
        { from: 'biz', text: 'Hola Lucía! Wednesday 13:30, front-row table? The fish comes off the grill at two.', at: NOW - 3 * D },
        { from: 'cr', text: 'Perfect. See you Wednesday at 13:30.', at: NOW - 3 * D + H },
        { from: 'sys', deal: 'visit', collabId: 'col11', at: NOW - 3 * D + H + 60e3 }], unread: { business: 0, creator: 0 } }
    ];
  }

  function stripeCost(x) { return Math.round((0.25 + x * 0.015) * 100) / 100; }
  L.stripeCost = stripeCost;

  function bizTxns() {
    return [
      { id: 'tx1', bizId: 'b1', kind: 'funded', collabId: 'col2', amount: 200, at: NOW - 5 * D, ref: 'pi_3Q8bZ2Lk' },
      { id: 'tx2', bizId: 'b1', kind: 'funded', collabId: 'col1', amount: 200, at: NOW - 3 * D, ref: 'pi_3Q9aT1Lk' },
      { id: 'tx8', bizId: 'b1', kind: 'funded', collabId: 'col11', amount: 200, at: NOW - 4 * D, ref: 'pi_3Q9Lc4Lk' },
      { id: 'tx4', bizId: 'b1', kind: 'released', collabId: 'col7', amount: 180, at: NOW - 22 * D, ref: 'tr_1PzQ9Lk' },
      { id: 'tx5', bizId: 'b1', kind: 'funded', collabId: 'col7', amount: 180, at: NOW - 34 * D, ref: 'pi_3PyR2Lk' },
      { id: 'tx6', bizId: 'b1', kind: 'refunded', collabId: 'col8', amount: 180 - stripeCost(180), at: NOW - 31 * D, ref: 're_3PyX1Lk' },
      { id: 'tx7', bizId: 'b1', kind: 'funded', collabId: 'col8', amount: 180, at: NOW - 35 * D, ref: 'pi_3PyW0Lk' }
    ];
  }

  // Creator wallet (v2): released collabs credit the full rate; Clasp keeps 10% of each withdrawal. Lucía's €150 from Spa Agua Clara
  // was released Sun 20 Sep; she withdrew €100 on Wed 23 Sep (€90 landed), so €50 is left in her wallet.
  function withdrawals() {
    return [{ id: 'w1', creatorId: 'cr1', amount: 100, status: 'paid', at: NOW - 26 * D, arrive: NOW - 24 * D, ref: 'po_1PzA4Lk' }];
  }

  function notifs() {
    return {
      business: [
        { id: 'n1', icon: 'user', tone: 'sky', text: 'Alex applied to Sunset daybed reel', msg: '{name} applied to {title}', p: { name: { cr: 'cr8' }, title: { camp: 'k1' } }, at: NOW - 3 * H, go: 'B-25:col9', read: false },
        { id: 'n2', icon: 'user', tone: 'sky', text: 'Sofía applied to Daybed for two', msg: '{name} applied to {title}', p: { name: { cr: 'cr2' }, title: { camp: 'k2' } }, at: NOW - 6 * H, go: 'B-25:col6', read: false },
        { id: 'n3', icon: 'clock', tone: 'lilac', text: 'Submission ready from Clara · 72h to review', msg: 'Submission ready from {name} · 72h to review', p: { name: { cr: 'cr4' } }, at: NOW - 11 * H, go: 'B-27:col2', read: false },
        { id: 'n4', icon: 'shield', tone: 'peach', text: 'You funded Mateo · €200 held', msg: 'You funded {name} · {amt} held', p: { name: { cr: 'cr3' }, amt: { eur: 200 } }, at: NOW - 3 * D, go: 'S-12:col1', read: true },
        { id: 'n8', icon: 'shield', tone: 'peach', text: 'You funded Lucía · €200 held', msg: 'You funded {name} · {amt} held', p: { name: { cr: 'cr1' }, amt: { eur: 200 } }, at: NOW - 4 * D, go: 'S-12:col11', read: true }
      ],
      // newest first, as L.notify adds them
      creator: [
        { id: 'n5', icon: 'mail', tone: 'lilac', text: 'Mar de Olivos invited you to Autumn tasting menu', msg: '{biz} invited you to {title}', p: { biz: { biz: 'b2' }, title: { camp: 'k3' } }, at: NOW - 20 * H, go: 'C-13:col4', read: false },
        { id: 'n7', icon: 'shield', tone: 'peach', text: "You're in · €220 secured with Mar de Olivos", msg: "You're in · {amt} secured with {biz}", p: { amt: { eur: 220 }, biz: { biz: 'b2' } }, at: NOW - 2 * D, go: 'S-12:col10', read: true },
        { id: 'n9', icon: 'shield', tone: 'peach', text: "You're in · €200 secured with Casa Brisa", msg: "You're in · {amt} secured with {biz}", p: { amt: { eur: 200 }, biz: { biz: 'b1' } }, at: NOW - 4 * D, go: 'S-12:col11', read: true },
        { id: 'n6', icon: 'euro', tone: 'peach', text: 'Withdrawal sent · €90 to your bank', msg: 'Withdrawal sent · {amt} to your bank', p: { amt: { eur: 90 } }, at: NOW - 26 * D, go: 'C-19:w1', read: true }
      ]
    };
  }

  // Business model v2: 2 campaigns free, then one subscription (€49.99/mo) to post, browse or invite. Casa Brisa runs several
  // campaigns, so the demo seeds it subscribed; the desk switch sets Free 0/1/2 of 2 used, and the §2.3 tour starts from 2 of 2.
  L.SUB_PRICE = 49.99; L.FREE_CAMPAIGNS = 2;
  L.subSeed = (now) => ({ sub: { renews: now + 11 * D }, freeUsed: L.FREE_CAMPAIGNS });
  // V6: the "Finish your profile" sheets jumped to from the index show 2 of 4 done.
  L.partialMeter = { business: { logo: false, cover: false, desc: true, address: true }, creator: { photo: true, bio: false, portfolio: false, social: true } };

  function base() {
    return {
      now: NOW, lang: 'en', seq: 100,
      creators: creators(), businesses: businesses(), campaigns: campaigns(), collabs: collabs(), threads: threads(),
      txns: bizTxns(), withdrawals: withdrawals(), notifs: notifs(), emails: [],
      drafts: [{ id: 'd1', bizId: 'b1', type: 'paid', step: 2, title: 'Winter terrace menu', edited: NOW - 26 * H, cover: img('restaurant'), category: 'Beach club', town: 'Marbella', rate: 160, slots: 1, brief: '', deliverables: [{ platform: 'Instagram', format: 'Reel', count: 1 }] }],
      bizMe: Object.assign({ id: 'b1', sub: null, freeUsed: 0, cards: [{ id: 'pm1', brand: 'Visa', last4: '4242', exp: '08/28', def: true }], billing: { legal: 'Brisa Marbella S.L.', nif: 'B-93123456', address: 'Paseo Marítimo 12, 29602 Marbella' }, onboarded: true, invites: [] }, L.subSeed(NOW)),
      crMe: { id: 'cr1', payout: 'verified', onboarded: true, meter: { photo: true, bio: true, portfolio: true, social: true } },
      prefs: { business: { push: { collabs: true, messages: true, payments: true, marketing: false }, email: { collabs: true, messages: false, payments: true, marketing: false } },
               creator: { push: { collabs: true, messages: true, payments: true, marketing: false }, email: { collabs: true, messages: false, payments: true, marketing: false } } },
      perms: { business: { location: 'granted', push: 'granted' }, creator: { location: 'granted', push: 'granted' } },
      blocked: [], reports: [],
      scen: { pay: 'ok', iap: 'ok', oauth: 'pro', kyc: 'verified', offline: false, forceUpdate: false }
    };
  }

  L.seedDemo = function () { return base(); };

  // Demo convenience: seed UGC (titles, briefs, bios, chat…) has an ES twin in js/i18n/es-seed.js so the ES walkthrough reads
  // naturally. A field only flips when it still holds the seed text, so anything a tester typed stays as typed.
  const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];
  L.applySeedLang = function () {
    const W = L.W; if (!W) return;
    const es = W.lang === 'es'; const T = L.SEED_ES || {};
    const flip = (o, f, pair) => { if (!o || !pair) return; if (es && o[f] === pair[0]) o[f] = pair[1]; else if (!es && o[f] === pair[1]) o[f] = pair[0]; };
    const each = (o, tr) => { if (o && tr) Object.keys(tr).forEach((f) => flip(o, f, tr[f])); };
    [].concat(W.creators, W.businesses, W.campaigns, W.collabs, W.drafts).forEach((o) => each(o, T[o.id]));
    W.threads.forEach((th) => { const tm = T[th.id]; if (tm) Object.keys(tm).forEach((i) => flip(th.msgs[i], 'text', tm[i])); });
    W.creators.forEach((c) => { const m = /^(\S+) (\d{4})$/.exec(c.joined || ''); if (!m) return; const i = Math.max(MONTHS_EN.indexOf(m[1]), MONTHS_ES.indexOf(m[1])); if (i >= 0) c.joined = (es ? MONTHS_ES : MONTHS_EN)[i] + ' ' + m[2]; });
  };

  // Fresh install: both phones start at the Welcome screen with blank profiles for the phone owners.
  L.seedFresh = function () {
    const w = base();
    const keepC = (c) => c.creatorId !== 'cr1' && w.campaigns.find((k) => k.id === c.campaignId).bizId !== 'b1';
    w.collabs = w.collabs.filter(keepC);
    w.campaigns = w.campaigns.filter((k) => k.bizId !== 'b1');
    w.threads = [];
    w.txns = []; w.withdrawals = []; w.drafts = []; w.notifs = { business: [], creator: [] };
    const b = w.businesses.find((x) => x.id === 'b1');
    Object.assign(b, { name: '', owner: '', category: '', town: '', address: '', desc: '', photos: [], cover: null, web: '', ig: '', meter: { logo: false, cover: false, desc: false, address: false } });
    const c = w.creators.find((x) => x.id === 'cr1');
    Object.assign(c, { first: '', last: '', username: '', photo: null, niches: [], town: '', bio: '', portfolio: [], socials: { ig: { connected: false }, tt: { connected: false }, other: [] }, joined: 'Oct 2026' });
    w.bizMe = Object.assign(w.bizMe, { onboarded: false, cards: [], billing: {}, sub: null, freeUsed: 0 });
    w.crMe = Object.assign(w.crMe, { onboarded: false, payout: 'none', meter: { photo: false, bio: false, portfolio: false, social: false } });
    w.perms = { business: { location: 'unset', push: 'unset' }, creator: { location: 'unset', push: 'unset' } };
    w.fresh = true;
    return w;
  };
})();
