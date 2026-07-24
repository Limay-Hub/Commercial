'use strict';

const APP_VERSION = 'LN_SYS_V.1.12';

/* ============================================================
   Supabase client (optional — falls back to seed data below
   when config.js has no URL/key set)
   ============================================================ */
const supabaseClient = (typeof SUPABASE_URL === 'string' && SUPABASE_URL && typeof supabase !== 'undefined')
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/* ============================================================
   Seed data (used until Supabase is wired up / as offline fallback)
   ============================================================ */
const ICONS = {
  utensils: '<path d="M6 2v7a2 2 0 0 0 2 2v11M6 2v7M10 2v7M6 9h4M18 2v20M18 2a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3"/>',
  bowl: '<path d="M3 11h18a9 3 0 0 1-18 0z" fill="none"/><path d="M3 11a9 3 0 0 1 18 0"/><path d="M12 3v2"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 1 5.4-5.4l-3.3 3.3-2-2z"/>',
  fork: '<path d="M6 2v7a2 2 0 0 0 2 2v11M6 2v7M10 2v7M6 9h4M18 2c-3 4-3 8 0 11v9"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21.5 7H6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  truck: '<path d="M1 3h13v13H1z" fill="none"/><rect x="1" y="3" width="13" height="13"/><path d="M14 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
};

let CATEGORIES = [
  { id: 'carenderia', name: 'Carenderia', count: 24, icon: 'utensils' },
  { id: 'food-stalls', name: 'Food Stalls', count: 18, icon: 'bowl' },
  { id: 'hardware', name: 'Hardware', count: 12, icon: 'wrench' },
  { id: 'restaurants', name: 'Restaurants', count: 31, icon: 'fork' },
  { id: 'grocery', name: 'Grocery', count: 42, icon: 'cart' },
  { id: 'services', name: 'Services', count: 56, icon: 'gear' },
];

const CUISINES = ['All Cuisines', 'Italian', 'Japanese', 'American', 'Cafe'];

let STORES = [
  {
    id: 'hearth-pizzeria',
    name: 'The Hearth Pizzeria',
    category: 'restaurants',
    cuisine: 'Italian',
    rating: 4.8,
    desc: 'Authentic wood-fired sourdough pizzas using locally-sourced ingredients and a 48-hour fermentation process.',
    status: 'open',
    statusLabel: 'Open Now',
    image: 'https://picsum.photos/seed/hearth-pizzeria/400/400',
    address: '45 Market Row, Poblacion District',
    fulfillment: ['Store Pickup', 'Local Delivery'],
    services: [
      { name: 'Classic Margherita', desc: '12" wood-fired, San Marzano tomato', price: '$14.00' },
      { name: 'Truffle Mushroom', desc: '12" wood-fired, wild mushroom blend', price: '$18.00' },
      { name: 'Dine-in Reservation', desc: 'Table for up to 6 guests', price: 'FREE' },
    ],
  },
  {
    id: 'midori-sushi',
    name: 'Midori Sushi Bar',
    category: 'restaurants',
    cuisine: 'Japanese',
    rating: 4.9,
    desc: 'Premium grade sushi and traditional Japanese fare prepared fresh daily by our resident itamae.',
    status: 'open',
    statusLabel: 'Open Now',
    image: 'https://picsum.photos/seed/midori-sushi/400/400',
    address: '12 Sakura Lane, Riverside District',
    fulfillment: ['Store Pickup', 'Curbside', 'Local Delivery'],
    services: [
      { name: "Chef's Omakase", desc: '10-course tasting menu', price: '$65.00' },
      { name: 'Salmon Nigiri Set', desc: '8 pcs, wasabi & pickled ginger', price: '$16.00' },
      { name: 'Sake Pairing', desc: 'Add a 4-glass tasting flight', price: '$22.00' },
    ],
  },
  {
    id: 'burger-lab',
    name: 'The Burger Lab',
    category: 'restaurants',
    cuisine: 'American',
    rating: 4.5,
    desc: 'Science-meets-flavor with our experimental gourmet patties and house-fermented condiments.',
    status: 'closing',
    statusLabel: 'Closing Soon',
    image: 'https://picsum.photos/seed/burger-lab/400/400',
    address: '8 Hop & Grain Alley, Old Town District',
    fulfillment: ['Store Pickup', 'Local Delivery'],
    services: [
      { name: 'The Umami Bomb', desc: 'Double patty, miso-caramel glaze', price: '$12.50' },
      { name: 'Smoked Cheddar Melt', desc: 'Single patty, applewood cheddar', price: '$10.00' },
      { name: 'Loaded Lab Fries', desc: 'Cheese sauce, bacon crumble', price: '$7.50' },
    ],
  },
  {
    id: 'flora-fern',
    name: 'Flora & Fern Cafe',
    category: 'restaurants',
    cuisine: 'Cafe',
    rating: 4.7,
    desc: 'A botanical sanctuary offering plant-based treats, specialty coffee, and a curated houseplant boutique.',
    status: 'closed',
    statusLabel: 'Opens 8:00 AM',
    image: 'https://picsum.photos/seed/flora-fern/400/400',
    address: '124 Garden Street, Old Town District',
    fulfillment: ['Store Pickup', 'Curbside', 'Local Delivery'],
    services: [
      { name: 'Potting Service (Small)', desc: 'Includes soil and drainage', price: '$12.00' },
      { name: 'Plant Consultation', desc: '30-min in-store session', price: '$25.00' },
      { name: 'Home Delivery', desc: 'Within 5 miles radius', price: '$8.00' },
      { name: 'Gift Wrapping', desc: 'Eco-friendly materials', price: 'FREE' },
    ],
  },
  {
    id: 'harbor-coffee',
    name: 'Harbor Coffee Co.',
    category: 'food-stalls',
    cuisine: 'Cafe',
    rating: 4.8,
    desc: 'Single-origin pour-overs and fresh-baked pastries steps from the pier, roasted in-house weekly.',
    status: 'open',
    statusLabel: 'Open Now',
    image: 'https://picsum.photos/seed/harbor-coffee/400/400',
    address: '3 Pier View Road, Riverside District',
    fulfillment: ['Store Pickup', 'Local Delivery'],
    services: [
      { name: 'Pour-Over Flight', desc: '3 single-origin tastings', price: '$9.00' },
      { name: 'Butter Croissant', desc: 'Baked fresh each morning', price: '$3.50' },
    ],
  },
  {
    id: 'bakers-corner',
    name: "Baker's Corner",
    category: 'food-stalls',
    cuisine: 'Cafe',
    rating: 4.7,
    desc: 'Neighborhood bakery known for pandesal, ensaymada, and made-to-order celebration cakes.',
    status: 'open',
    statusLabel: 'Open Now',
    image: 'https://picsum.photos/seed/bakers-corner/400/400',
    address: '19 Baker Street, Poblacion District',
    fulfillment: ['Store Pickup'],
    services: [
      { name: 'Pandesal (dozen)', desc: 'Fresh from the oven', price: '$2.50' },
      { name: 'Custom Cake', desc: '2 days advance order', price: '$28.00' },
    ],
  },
  {
    id: 'street-tacos',
    name: 'Street Tacos',
    category: 'carenderia',
    cuisine: 'American',
    rating: 4.5,
    desc: 'Late-night taco stall serving al pastor and carne asada straight off the griddle.',
    status: 'open',
    statusLabel: 'Open Now',
    image: 'https://picsum.photos/seed/street-tacos/400/400',
    address: 'Night Market Central, Stall 14',
    fulfillment: ['Store Pickup'],
    services: [
      { name: 'Al Pastor Taco', desc: '3 pcs, pineapple salsa', price: '$5.00' },
      { name: 'Carne Asada Taco', desc: '3 pcs, chimichurri', price: '$5.50' },
    ],
  },
  {
    id: 'limay-wellness',
    name: 'Limay Wellness',
    category: 'services',
    cuisine: '',
    rating: 4.7,
    desc: 'Community wellness clinic offering massage therapy, physical rehab, and holistic consultations.',
    status: 'open',
    statusLabel: 'Open Now',
    image: 'https://picsum.photos/seed/limay-wellness/400/400',
    address: '7 Wellness Way, Old Town District',
    fulfillment: ['Store Pickup'],
    services: [
      { name: 'Therapeutic Massage', desc: '60-min session', price: '$35.00' },
      { name: 'Wellness Consultation', desc: 'Initial 30-min assessment', price: '$20.00' },
    ],
  },
  {
    id: 'city-library',
    name: 'City Library',
    category: 'services',
    cuisine: '',
    rating: 4.6,
    desc: 'Public library branch with a community reading room, free wifi, and weekend workshops.',
    status: 'open',
    statusLabel: 'Open Now',
    image: 'https://picsum.photos/seed/city-library/400/400',
    address: '1 Civic Plaza, Poblacion District',
    fulfillment: ['Store Pickup'],
    services: [
      { name: 'Library Card', desc: 'New resident registration', price: 'FREE' },
      { name: 'Meeting Room Rental', desc: 'Per hour, up to 8 people', price: '$10.00' },
    ],
  },
  {
    id: 'eco-cleaners',
    name: 'Eco Cleaners',
    category: 'services',
    cuisine: '',
    rating: 4.4,
    desc: 'Eco-friendly dry cleaning and laundry service using biodegradable detergents.',
    status: 'closed',
    statusLabel: 'Opens 8:00 AM',
    image: 'https://picsum.photos/seed/eco-cleaners/400/400',
    address: '22 Greenway Street, Riverside District',
    fulfillment: ['Store Pickup', 'Local Delivery'],
    services: [
      { name: 'Wash & Fold (per kg)', desc: 'Same-day if dropped before 10am', price: '$2.00' },
      { name: 'Dry Cleaning (per item)', desc: 'Suits, dresses, coats', price: '$6.00' },
    ],
  },
];

const GEM_FEATURE = {
  title: 'Night Market Central',
  sub: 'Best for local street food cravings',
  image: 'https://picsum.photos/seed/night-market-central/600/500',
};

let PROMO_CARDS = [
  { cardId: 'cleanup-drive', title: 'Clean-up Drive', subtitle: 'Saturday, 8:00 AM', buttonLabel: 'Join Task', variant: 'dark' },
  { cardId: 'photo-contest', title: 'Photo Contest', subtitle: 'Share your Limay views', buttonLabel: 'Upload', variant: 'light' },
];

const FULFILLMENT_ICONS = {
  'Store Pickup': ICONS.bag,
  'Curbside': ICONS.truck,
  'Local Delivery': ICONS.truck,
};

/* ============================================================
   Public tab: Community Favorites leaderboard groups
   ============================================================ */
const LEADERBOARD_GROUPS = [
  { label: 'Restaurants', categories: ['restaurants'], icon: 'fork' },
  { label: 'Eateries', categories: ['food-stalls', 'carenderia'], icon: 'bowl' },
  { label: 'Services', categories: ['services', 'hardware'], icon: 'gear' },
];

/* ============================================================
   Public tab: Community Chat (single shared room, no backend
   required to configure — falls back to local-only demo mode)
   ============================================================ */
const DEMO_CHAT_MESSAGES = [
  {
    id: 'demo-1',
    senderName: 'You',
    self: true,
    body: 'Hey Arthur! Yes, the council announced it starts at 6:00 AM this week for the summer season.',
    imageUrl: null,
    createdAt: Date.now() - 8 * 60000,
  },
  {
    id: 'demo-2',
    senderName: 'Elena S.',
    self: false,
    body: "Thanks for the heads up! I'll be there too. Anyone tried the new pastry shop near the harbor? I heard their croissants are amazing.",
    imageUrl: 'https://picsum.photos/seed/pastry-shop/300/200',
    createdAt: Date.now() - 4 * 60000,
  },
];

/* ============================================================
   Supabase data loading (falls back to the seed data above on
   any error, or when config.js has no Supabase keys set)
   ============================================================ */
async function loadDataFromSupabase() {
  if (!supabaseClient) return;

  try {
    const [catRes, storeRes, gemRes] = await Promise.all([
      supabaseClient.from('categories').select('*').order('sort_order'),
      supabaseClient.from('stores').select('*, store_services(*)').order('sort_order'),
      supabaseClient.from('featured_gems').select('*').eq('active', true).order('sort_order').limit(1),
    ]);

    if (!catRes.error && catRes.data && catRes.data.length) {
      CATEGORIES = catRes.data.map(c => ({ id: c.id, name: c.name, count: c.store_count, icon: c.icon }));
    }

    if (!storeRes.error && storeRes.data && storeRes.data.length) {
      STORES = storeRes.data.map(s => ({
        id: s.slug,
        name: s.name,
        category: s.category_id,
        cuisine: s.cuisine,
        rating: s.rating,
        desc: s.description,
        status: s.status,
        statusLabel: s.status_label,
        image: s.image_url,
        address: s.address,
        fulfillment: s.fulfillment_methods || [],
        services: (s.store_services || [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(sv => ({ name: sv.name, desc: sv.description, price: sv.price_label })),
      }));
      const cuisines = ['All Cuisines', ...new Set(STORES.map(s => s.cuisine).filter(Boolean))];
      CUISINES.length = 0;
      CUISINES.push(...cuisines);
    }

    if (!gemRes.error && gemRes.data && gemRes.data.length) {
      GEM_FEATURE.title = gemRes.data[0].title;
      GEM_FEATURE.sub = gemRes.data[0].subtitle;
      GEM_FEATURE.image = gemRes.data[0].image_url;
    }

    const promoRes = await supabaseClient.from('community_promo_cards').select('*').order('sort_order');
    if (!promoRes.error && promoRes.data && promoRes.data.length) {
      PROMO_CARDS = promoRes.data.map(p => ({
        cardId: p.card_id, title: p.title, subtitle: p.subtitle, buttonLabel: p.button_label, variant: p.variant,
      }));
    }
  } catch (err) {
    console.warn('Limay Nexus: Supabase fetch failed, using bundled seed data.', err);
  }
}

/* ============================================================
   State
   ============================================================ */
const state = {
  view: 'home',
  activeCuisine: 'All Cuisines',
  searchQuery: '',
  favorites: new Set(JSON.parse(localStorage.getItem('limayhub_favorites') || '[]')),
  detailStoreId: null,
};

function saveFavorites() {
  localStorage.setItem('limayhub_favorites', JSON.stringify([...state.favorites]));
}

/* ============================================================
   Public tab: client identity (no real auth — same trust model
   as Winfinity: a client-generated id, safe to keep low-stakes)
   ============================================================ */
function getShareKey() {
  let key = localStorage.getItem('limayhub_share_key');
  if (!key) {
    key = (crypto.randomUUID ? crypto.randomUUID() : `lh-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    localStorage.setItem('limayhub_share_key', key);
  }
  return key;
}

function getDisplayName() {
  return localStorage.getItem('limayhub_display_name') || 'Citizen';
}

function setDisplayName(name) {
  localStorage.setItem('limayhub_display_name', name.trim().slice(0, 24) || 'Citizen');
}

function initials(name) {
  return (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// Digital ID: a short, human-shareable identifier (distinct from the
// private share_key above) — same format Winfinity uses (excludes
// 0/O/1/I to avoid look-alike mistakes when read aloud or copied by hand).
const DIGITAL_ID_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function generateDigitalId() {
  let code = '';
  for (let i = 0; i < 6; i++) code += DIGITAL_ID_CHARS[Math.floor(Math.random() * DIGITAL_ID_CHARS.length)];
  return `LH-${code}`;
}
function getOrCreateDigitalId() {
  let id = localStorage.getItem('limayhub_digital_id');
  if (!id) {
    id = generateDigitalId();
    localStorage.setItem('limayhub_digital_id', id);
  }
  return id;
}

/* ============================================================
   First-run registration: User Identification + guided selfie
   ============================================================ */
const SELFIE_STEPS = [
  'Center your face in the circle',
  'Turn your head to the left',
  'Turn your head to the right',
  'Look straight at the camera',
  'Now blink your eyes',
];
const SELFIE_STEP_MS = 2200;
let selfieStream = null;

function isRegistered() {
  return localStorage.getItem('limayhub_registered') === '1';
}

function initRegistrationFlow() {
  if (isRegistered()) return;
  document.getElementById('regOverlay').hidden = false;

  document.getElementById('btnRegSave').addEventListener('click', handleRegFormSave);
  document.getElementById('btnRegContinue').addEventListener('click', finishRegistration);
}

function handleRegFormSave() {
  const note = document.getElementById('regFormNote');
  const nickname = document.getElementById('regNickname').value.trim();
  const firstName = document.getElementById('regFirstName').value.trim();
  const surname = document.getElementById('regSurname').value.trim();
  const houseNo = document.getElementById('regHouseNo').value.trim();
  const barangay = document.getElementById('regBarangay').value.trim();
  const municipality = document.getElementById('regMunicipality').value.trim();
  const province = document.getElementById('regProvince').value.trim();
  const zipCode = document.getElementById('regZipCode').value.trim();
  const mobile = document.getElementById('regMobile').value.trim();
  const email = document.getElementById('regEmail').value.trim();

  if (!nickname || !firstName || !surname || !houseNo || !barangay || !municipality || !province || !zipCode || !mobile || !email) {
    note.textContent = 'Please fill in all required fields.';
    return;
  }

  const landmark = document.getElementById('regLandmark').value.trim();
  const address = [houseNo, barangay, municipality, province, zipCode].join(', ') + (landmark ? ` (near ${landmark})` : '');

  const regData = {
    nickname, firstName, surname, mobile, email,
    houseNo, barangay, municipality, province, zipCode, landmark, address,
    facebook: document.getElementById('regFacebook').value.trim(),
    instagram: document.getElementById('regInstagram').value.trim(),
  };
  localStorage.setItem('limayhub_reg_data', JSON.stringify(regData));

  document.getElementById('regStepForm').hidden = true;
  document.getElementById('regStepSelfie').hidden = false;
  startSelfieCapture().catch((err) => console.warn('Limay Nexus: selfie step failed unexpectedly.', err));
}

async function startSelfieCapture() {
  const note = document.getElementById('regSelfieNote');
  const progressEl = document.getElementById('selfieProgress');
  progressEl.innerHTML = SELFIE_STEPS.map(() => '<span class="selfie-progress-dot"></span>').join('');
  const dots = progressEl.querySelectorAll('.selfie-progress-dot');

  try {
    selfieStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    document.getElementById('selfieVideo').srcObject = selfieStream;
    note.textContent = '';
  } catch (err) {
    note.textContent = "Couldn't access your camera. Check permissions and try again.";
    note.style.color = 'var(--error)';
    return;
  }

  for (let i = 0; i < SELFIE_STEPS.length; i++) {
    document.getElementById('regSelfiePrompt').textContent = SELFIE_STEPS[i];
    dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
    await new Promise((resolve) => setTimeout(resolve, SELFIE_STEP_MS));
    dots[i].classList.remove('is-active');
    dots[i].classList.add('is-done');
  }

  captureSelfieFrame();
}

function captureSelfieFrame() {
  const video = document.getElementById('selfieVideo');

  try {
    const canvas = document.getElementById('selfieCanvas');
    const size = 320;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Mirror horizontally to match the preview (video is CSS-flipped for a
    // natural "looking in a mirror" feel while capturing).
    ctx.translate(size, 0);
    ctx.scale(-1, 1);

    const vw = video.videoWidth, vh = video.videoHeight;
    const cropSize = Math.min(vw, vh) || 1;
    ctx.drawImage(video, (vw - cropSize) / 2, (vh - cropSize) / 2, cropSize, cropSize, 0, 0, size, size);

    const selfieDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    localStorage.setItem('limayhub_selfie', selfieDataUrl);
  } catch (err) {
    // Canvas/video edge case (e.g. zero-dimension frame) — still finish
    // registration below rather than leaving the user stuck on this step.
    console.warn('Limay Nexus: selfie capture failed, continuing without a saved photo.', err);
  }

  if (selfieStream) {
    selfieStream.getTracks().forEach((t) => t.stop());
    selfieStream = null;
  }

  const regData = JSON.parse(localStorage.getItem('limayhub_reg_data') || '{}');
  document.getElementById('regSuccessName').textContent = regData.nickname || '';
  document.getElementById('regStepSelfie').hidden = true;
  document.getElementById('regStepSuccess').hidden = false;
}

function finishRegistration() {
  const regData = JSON.parse(localStorage.getItem('limayhub_reg_data') || '{}');
  if (regData.nickname) setDisplayName(regData.nickname);
  localStorage.setItem('limayhub_registered', '1');
  document.getElementById('regOverlay').hidden = true;
  renderWelcomeHero();
}

/* ============================================================
   Identity: view/edit registered details (Menu tab)
   ============================================================ */
const IDENTITY_FIELD_MAP = {
  idNickname: 'nickname', idFirstName: 'firstName', idSurname: 'surname',
  idHouseNo: 'houseNo', idBarangay: 'barangay', idMunicipality: 'municipality',
  idProvince: 'province', idZipCode: 'zipCode', idLandmark: 'landmark',
  idMobile: 'mobile', idEmail: 'email', idFacebook: 'facebook', idInstagram: 'instagram',
};

function openIdentityOverlay() {
  const regData = JSON.parse(localStorage.getItem('limayhub_reg_data') || '{}');
  Object.entries(IDENTITY_FIELD_MAP).forEach(([elId, key]) => {
    document.getElementById(elId).value = regData[key] || '';
  });
  document.getElementById('identityNote').textContent = '';
  document.getElementById('identityOverlay').hidden = false;
}

function saveIdentity() {
  const note = document.getElementById('identityNote');
  const updated = {};
  Object.entries(IDENTITY_FIELD_MAP).forEach(([elId, key]) => {
    updated[key] = document.getElementById(elId).value.trim();
  });

  if (!updated.nickname || !updated.firstName || !updated.surname || !updated.houseNo ||
      !updated.barangay || !updated.municipality || !updated.province || !updated.zipCode ||
      !updated.mobile || !updated.email) {
    note.textContent = 'Please fill in all required fields.';
    return;
  }

  updated.address = [updated.houseNo, updated.barangay, updated.municipality, updated.province, updated.zipCode].join(', ') +
    (updated.landmark ? ` (near ${updated.landmark})` : '');

  localStorage.setItem('limayhub_reg_data', JSON.stringify(updated));
  setDisplayName(updated.nickname);
  renderWelcomeHero();
  document.getElementById('identityOverlay').hidden = true;
}

function initIdentityWidget() {
  document.getElementById('btnIdentity').addEventListener('click', openIdentityOverlay);
  document.getElementById('btnCloseIdentity').addEventListener('click', () => { document.getElementById('identityOverlay').hidden = true; });
  document.getElementById('identityOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'identityOverlay') document.getElementById('identityOverlay').hidden = true;
  });
  document.getElementById('btnIdentitySave').addEventListener('click', saveIdentity);
}

/* ============================================================
   Add Establishment (public business submission form)
   ============================================================ */
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function wireEstablishmentPhotoInput(inputId, previewId) {
  document.getElementById(inputId).addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = document.getElementById(previewId);
    preview.src = await readFileAsDataUrl(file);
    preview.dataset.source = 'file';
    preview.hidden = false;
  });
}

// Lets a submitter paste an image URL instead of uploading a file — both
// write to the same preview <img>, whose .src is what actually gets
// submitted, so the two entry paths are interchangeable.
function wireEstablishmentUrlInput(urlInputId, previewId) {
  document.getElementById(urlInputId).addEventListener('input', (e) => {
    const url = e.target.value.trim();
    const preview = document.getElementById(previewId);
    if (url) {
      preview.src = url;
      preview.dataset.source = 'url';
      preview.hidden = false;
    } else if (preview.dataset.source === 'url') {
      preview.hidden = true;
      preview.src = '';
      delete preview.dataset.source;
    }
  });
}

function openAddEstablishment() {
  ['aeName', 'aeAddress', 'aeLandmark', 'aeContact', 'aeEmail', 'aeFacebook', 'aeInstagram', 'aeLogoUrl', 'aePhotoUrl']
    .forEach((id) => { document.getElementById(id).value = ''; });
  document.querySelectorAll('.aeService').forEach((cb) => { cb.checked = false; });
  ['aeLogoFile', 'aePhotoFile'].forEach((id) => { document.getElementById(id).value = ''; });
  ['aeLogoPreview', 'aePhotoPreview'].forEach((id) => {
    const el = document.getElementById(id);
    el.hidden = true;
    el.src = '';
    delete el.dataset.source;
  });
  const note = document.getElementById('addEstablishmentNote');
  note.textContent = '';
  note.style.color = '';
  document.getElementById('addEstablishmentOverlay').hidden = false;
}

function closeAddEstablishment() {
  document.getElementById('addEstablishmentOverlay').hidden = true;
}

async function submitEstablishment() {
  const note = document.getElementById('addEstablishmentNote');
  const name = document.getElementById('aeName').value.trim();
  const address = document.getElementById('aeAddress').value.trim();
  const landmark = document.getElementById('aeLandmark').value.trim();
  const contactNumber = document.getElementById('aeContact').value.trim();
  const email = document.getElementById('aeEmail').value.trim();
  const facebook = document.getElementById('aeFacebook').value.trim();
  const instagram = document.getElementById('aeInstagram').value.trim();
  const services = [...document.querySelectorAll('.aeService:checked')].map((cb) => cb.value);
  const logoPreview = document.getElementById('aeLogoPreview');
  const photoPreview = document.getElementById('aePhotoPreview');

  if (!name || !address || !contactNumber) {
    note.style.color = 'var(--error)';
    note.textContent = 'Please fill in business name, address, and contact number.';
    return;
  }
  if (photoPreview.hidden) {
    note.style.color = 'var(--error)';
    note.textContent = 'Please add a photo of your storefront, building, or signage.';
    return;
  }

  const submission = {
    name, address, landmark, contactNumber, email, facebook, instagram, services,
    logo: logoPreview.hidden ? '' : logoPreview.src,
    photo: photoPreview.src,
    submittedAt: new Date().toISOString(),
  };

  note.style.color = '';
  note.textContent = 'Submitting…';

  try {
    if (!supabaseClient) throw new Error('offline');
    const { error } = await supabaseClient.from('store_submissions').insert({
      business_name: submission.name,
      address: submission.address,
      landmark: submission.landmark,
      contact_number: submission.contactNumber,
      email: submission.email,
      facebook: submission.facebook,
      instagram: submission.instagram,
      services: submission.services,
      logo_url: submission.logo,
      photo_url: submission.photo,
    });
    if (error) throw error;
  } catch (err) {
    // Offline/demo fallback — queue locally so nothing the user typed is
    // lost; syncs to Supabase once the project has it configured.
    const queue = JSON.parse(localStorage.getItem('limaynexus_establishment_submissions') || '[]');
    queue.push(submission);
    localStorage.setItem('limaynexus_establishment_submissions', JSON.stringify(queue));
  }

  note.style.color = 'var(--primary)';
  note.textContent = 'Thanks! Your establishment has been submitted for review.';
  setTimeout(closeAddEstablishment, 1400);
}

function initAddEstablishment() {
  document.getElementById('fabAdd').addEventListener('click', openAddEstablishment);
  document.getElementById('btnAddEstablishmentMenu').addEventListener('click', openAddEstablishment);
  document.getElementById('btnCloseAddEstablishment').addEventListener('click', closeAddEstablishment);
  document.getElementById('addEstablishmentOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'addEstablishmentOverlay') closeAddEstablishment();
  });
  document.getElementById('btnAeSubmit').addEventListener('click', submitEstablishment);
  wireEstablishmentPhotoInput('aeLogoFile', 'aeLogoPreview');
  wireEstablishmentPhotoInput('aePhotoFile', 'aePhotoPreview');
  wireEstablishmentUrlInput('aeLogoUrl', 'aeLogoPreview');
  wireEstablishmentUrlInput('aePhotoUrl', 'aePhotoPreview');
}

/* ============================================================
   Rendering helpers
   ============================================================ */
function svgIcon(pathData) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${pathData}</svg>`;
}

function statusClass(status) {
  if (status === 'open') return 'status-open';
  if (status === 'closing') return 'status-closing';
  return 'status-closed';
}

function renderCategories() {
  const grid = document.getElementById('categoryGrid');
  grid.innerHTML = CATEGORIES.map(cat => `
    <button class="category-card" data-category="${cat.id}">
      <div class="category-icon">${svgIcon(ICONS[cat.icon])}</div>
      <p class="category-name">${cat.name}</p>
      <span class="category-count">${cat.count} Stores</span>
    </button>
  `).join('');

  grid.querySelectorAll('.category-card').forEach(btn => {
    btn.addEventListener('click', () => switchView('search'));
  });
}

/* ============================================================
   Welcome hero (Home tab): greeting, live clock, weather, Digital ID
   ============================================================ */
const LIMAY_COORDS = { lat: 14.5647, lng: 120.5941 }; // Limay, Bataan, Philippines

const WEATHER_CODES = {
  0: ['☀️', 'Clear'], 1: ['🌤️', 'Mostly clear'], 2: ['⛅', 'Partly cloudy'], 3: ['☁️', 'Overcast'],
  45: ['🌫️', 'Fog'], 48: ['🌫️', 'Fog'],
  51: ['🌦️', 'Drizzle'], 53: ['🌦️', 'Drizzle'], 55: ['🌦️', 'Drizzle'],
  61: ['🌧️', 'Light rain'], 63: ['🌧️', 'Rain'], 65: ['🌧️', 'Heavy rain'],
  80: ['🌧️', 'Rain showers'], 81: ['🌧️', 'Rain showers'], 82: ['🌧️', 'Heavy showers'],
  95: ['⛈️', 'Thunderstorm'], 96: ['⛈️', 'Thunderstorm'], 99: ['⛈️', 'Thunderstorm'],
};

function greetingForHour(hour) {
  if (hour < 5) return 'Good night,';
  if (hour < 12) return 'Good morning,';
  if (hour < 18) return 'Good afternoon,';
  return 'Good evening,';
}

function updateWelcomeDateTime() {
  const now = new Date();
  const opts = { timeZone: 'Asia/Manila', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
  document.getElementById('welcomeDateTime').textContent = now.toLocaleString('en-US', opts);
  const manilaHour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Manila', hour: 'numeric', hour12: false }), 10);
  document.getElementById('welcomeGreeting').textContent = greetingForHour(manilaHour);
}

function getWeatherLocation() {
  try {
    const saved = JSON.parse(localStorage.getItem('limayhub_weather_location') || 'null');
    if (saved && typeof saved.lat === 'number' && typeof saved.lng === 'number') return saved;
  } catch (err) { /* fall through to default */ }
  return { lat: LIMAY_COORDS.lat, lng: LIMAY_COORDS.lng, label: 'Limay, Bataan' };
}

async function loadWelcomeWeather() {
  const iconEl = document.getElementById('weatherIcon');
  const tempEl = document.getElementById('weatherTemp');
  const loc = getWeatherLocation();
  try {
    const cached = JSON.parse(localStorage.getItem('limayhub_weather_cache') || 'null');
    if (cached && cached.lat === loc.lat && cached.lng === loc.lng && Date.now() - cached.at < 30 * 60000) {
      iconEl.textContent = cached.icon;
      tempEl.textContent = cached.temp;
      return;
    }
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&current=temperature_2m,weather_code&timezone=Asia%2FManila`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    const code = data?.current?.weather_code;
    const temp = data?.current?.temperature_2m;
    const [icon] = WEATHER_CODES[code] || ['🌡️', ''];
    const tempText = typeof temp === 'number' ? `${Math.round(temp)}°C` : '--°';
    iconEl.textContent = icon;
    tempEl.textContent = tempText;
    localStorage.setItem('limayhub_weather_cache', JSON.stringify({ icon, temp: tempText, lat: loc.lat, lng: loc.lng, at: Date.now() }));
  } catch (err) {
    iconEl.textContent = '🌡️';
    tempEl.textContent = '--°';
  }
}

function saveWeatherLocation(lat, lng, label) {
  localStorage.setItem('limayhub_weather_location', JSON.stringify({ lat, lng, label }));
  localStorage.removeItem('limayhub_weather_cache');
  loadWelcomeWeather();
}

function initWeatherWidget() {
  const FB_URL = 'https://www.facebook.com/photo/?fbid=2467303137102259&set=pcb.2467303197102253';
  const overlay = document.getElementById('weatherLocationOverlay');
  const note = document.getElementById('weatherLocationNote');

  document.getElementById('welcomeWeather').addEventListener('click', () => {
    window.open(FB_URL, '_blank', 'noopener');
  });

  document.getElementById('btnWeatherLocation').addEventListener('click', (e) => {
    e.stopPropagation();
    note.textContent = '';
    document.getElementById('weatherLocationResults').innerHTML = '';
    document.getElementById('weatherLocationSearchInput').value = '';
    overlay.hidden = false;
  });

  document.getElementById('btnCloseWeatherLocation').addEventListener('click', () => { overlay.hidden = true; });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.hidden = true; });

  document.getElementById('btnUseGpsLocation').addEventListener('click', () => {
    if (!navigator.geolocation) { note.textContent = 'Geolocation is not supported on this device.'; return; }
    note.textContent = 'Getting your location…';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        saveWeatherLocation(pos.coords.latitude, pos.coords.longitude, 'Current Location');
        overlay.hidden = true;
      },
      () => { note.textContent = 'Could not get your location — check permissions.'; },
      { timeout: 8000 }
    );
  });

  document.getElementById('btnWeatherLocationSearch').addEventListener('click', async () => {
    const query = document.getElementById('weatherLocationSearchInput').value.trim();
    const resultsEl = document.getElementById('weatherLocationResults');
    resultsEl.innerHTML = '';
    if (!query) { note.textContent = 'Type a place name to search.'; return; }
    note.textContent = 'Searching…';
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      const data = await res.json();
      const results = data?.results || [];
      if (!results.length) { note.textContent = 'No matches found.'; return; }
      note.textContent = '';
      resultsEl.className = 'weather-location-results';
      resultsEl.innerHTML = results.map((r, i) => {
        const label = [r.name, r.admin1, r.country].filter(Boolean).join(', ');
        return `<button class="weather-location-result" data-idx="${i}">${label}</button>`;
      }).join('');
      resultsEl.querySelectorAll('.weather-location-result').forEach((btn) => {
        btn.addEventListener('click', () => {
          const r = results[parseInt(btn.dataset.idx, 10)];
          saveWeatherLocation(r.latitude, r.longitude, r.name);
          overlay.hidden = true;
        });
      });
    } catch (err) {
      note.textContent = 'Search failed — check your connection.';
    }
  });
}

let welcomeHeroInitialized = false;
function renderWelcomeHero() {
  document.getElementById('welcomeName').textContent = getDisplayName();
  document.getElementById('welcomeDigitalId').textContent = getOrCreateDigitalId();

  if (welcomeHeroInitialized) return;
  welcomeHeroInitialized = true;

  updateWelcomeDateTime();
  setInterval(updateWelcomeDateTime, 30000);
  loadWelcomeWeather();
  initWeatherWidget();

  document.getElementById('btnCopyDigitalId').addEventListener('click', async () => {
    const id = getOrCreateDigitalId();
    try {
      await navigator.clipboard.writeText(id);
    } catch (err) { /* clipboard API unavailable — id is still visible to copy manually */ }
  });
}

function renderPromoCards() {
  const container = document.getElementById('promoCardsContainer');
  container.innerHTML = PROMO_CARDS.map(c => `
    <div class="promo-card promo-card-${c.variant}">
      <h3>${c.title}</h3>
      <p>${c.subtitle}</p>
      <button class="${c.variant === 'dark' ? 'btn-pill-light' : 'btn-pill-dark'}">${c.buttonLabel}</button>
    </div>
  `).join('');
}

function renderGemBanner() {
  document.getElementById('gemImg').src = GEM_FEATURE.image;
  document.getElementById('gemTitle').textContent = GEM_FEATURE.title;
  document.getElementById('gemSub').textContent = GEM_FEATURE.sub;
  document.getElementById('gemBanner').addEventListener('click', () => switchView('search'));
}

function rankBadgeClass(rank) {
  if (rank === 1) return '';
  if (rank === 2) return 'rank-2';
  return 'rank-3';
}

function renderLeaderboardGroups() {
  const container = document.getElementById('leaderboardGroups');
  container.innerHTML = LEADERBOARD_GROUPS.map(group => {
    const ranked = STORES
      .filter(s => group.categories.includes(s.category))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    if (ranked.length === 0) return '';

    const rows = ranked.map((s, i) => `
      <button class="rank-row" data-store="${s.id}">
        <span class="rank-badge ${rankBadgeClass(i + 1)}">#${i + 1}</span>
        <div class="rank-info">
          <p class="rank-name">${s.name}</p>
          <span class="rank-rating">★ ${s.rating}</span>
        </div>
        <span class="rank-icon">${svgIcon(ICONS[group.icon])}</span>
      </button>
    `).join('');

    return `
      <div class="leaderboard-group">
        <div class="leaderboard-group-header">
          <h3>${group.label}</h3>
          <button class="link-btn" data-group-cta="${group.label}">View Full Leaderboard</button>
        </div>
        ${rows}
      </div>
    `;
  }).join('');

  container.querySelectorAll('.rank-row').forEach(row => {
    row.addEventListener('click', () => openDetail(row.dataset.store));
  });
  container.querySelectorAll('[data-group-cta]').forEach(btn => {
    btn.addEventListener('click', () => switchView('search'));
  });
}

/* ============================================================
   Public tab: Community Chat
   ============================================================ */
let chatMessages = [];
let pendingImageDataUrl = null;
let chatRealtimeChannel = null;
let chatPresenceChannel = null;

// 'public' | 'groups' | 'dms' — which dropdown tab is selected
let currentChatView = 'public';
// null while viewing a room LIST (groups/dms); set to a room's uuid (or
// null for Public) once a specific thread is open
let activeRoomId = null;
let viewingRoomThread = true; // Public starts as a thread, not a list
let currentRoomName = 'Public';
let currentRoomIsDm = false;

let myGroupRooms = [];
let myDmRooms = [];
let pendingGroupInvites = [];
let dmUnreadRoomIds = new Set();
let newGroupInviteIds = [];
let chatUserMenuTarget = null;

function timeLabel(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').hidden = false;
}
function closeLightbox() {
  document.getElementById('lightbox').hidden = true;
  document.getElementById('lightboxImg').src = '';
}

function setChatPresence(text) {
  document.getElementById('chatPresence').textContent = text;
}

/* ---- Friends list (local-only quick-access list, no backend) ---- */
function getFriends() {
  try { return JSON.parse(localStorage.getItem('limayhub_friends') || '[]'); }
  catch (err) { return []; }
}
function addFriend(digitalId, codeName) {
  const friends = getFriends();
  if (friends.some((f) => f.digitalId === digitalId)) return;
  friends.push({ digitalId, codeName });
  localStorage.setItem('limayhub_friends', JSON.stringify(friends));
}

/* ---- Identity registry sync (lets others invite/DM you by Digital ID) ---- */
async function syncChatIdentity() {
  if (!supabaseClient) return;
  try {
    await supabaseClient.from('chat_identities').upsert({
      share_key: getShareKey(),
      digital_id: getOrCreateDigitalId(),
      code_name: getDisplayName(),
      updated_at: new Date().toISOString(),
    });
  } catch (err) { /* best effort — chat still works locally without this */ }
}

function renderChatAvatarStack() {
  const stack = document.getElementById('chatAvatarStack');
  const names = [];
  for (let i = chatMessages.length - 1; i >= 0 && names.length < 3; i--) {
    const n = chatMessages[i].senderName;
    if (n && n !== getDisplayName() && !names.includes(n)) names.push(n);
  }
  if (names.length === 0) names.push(getDisplayName());
  const overflow = supabaseClient ? '' : '+12';

  stack.innerHTML = names.map(n => `<span class="avatar" title="${n}">${initials(n)}</span>`).join('') +
    (overflow ? `<span class="avatar avatar-overflow">${overflow}</span>` : '');
}

function renderChatMessages() {
  const list = document.getElementById('chatMessages');
  const wasNearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
  const showNameLabels = !currentRoomIsDm; // DM header already names who you're talking to

  list.innerHTML = chatMessages.map(m => `
    <div class="chat-msg ${m.self ? 'chat-msg-self' : ''}">
      ${m.self ? '' : `<span class="chat-msg-avatar">${initials(m.senderName)}</span>`}
      <div class="chat-msg-body">
        <div class="chat-msg-meta">
          <span class="chat-msg-name ${!m.self && showNameLabels ? 'chat-msg-name-link' : ''}" ${!m.self && showNameLabels ? `data-user-name="${escapeHtml(m.senderName)}" data-user-digital-id="${m.senderDigitalId || ''}"` : ''}>${m.self ? 'You' : m.senderName}</span>
          <span class="chat-msg-time">${timeLabel(m.createdAt)}</span>
        </div>
        ${m.body ? `<div class="chat-msg-bubble">${escapeHtml(m.body)}</div>` : ''}
        ${m.imageUrl ? `<img class="chat-msg-image" src="${m.imageUrl}" alt="Shared photo" data-lightbox="${m.imageUrl}">` : ''}
      </div>
    </div>
  `).join('') || '<p class="chat-empty-hint">No messages yet — say hello 👋</p>';

  list.querySelectorAll('[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.dataset.lightbox));
  });
  list.querySelectorAll('[data-user-name]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (!el.dataset.userDigitalId) return;
      openChatUserMenu(el.dataset.userName, el.dataset.userDigitalId, e.clientX, e.clientY);
    });
  });

  if (wasNearBottom) list.scrollTop = list.scrollHeight;
  renderChatAvatarStack();
}

function unsubscribeChatRealtime() {
  if (chatRealtimeChannel) { supabaseClient.removeChannel(chatRealtimeChannel); chatRealtimeChannel = null; }
  if (chatPresenceChannel) { supabaseClient.removeChannel(chatPresenceChannel); chatPresenceChannel = null; }
}

function mapMessageRow(row, myKey) {
  return {
    id: row.id,
    senderName: row.sender_name,
    senderDigitalId: row.sender_digital_id,
    self: row.sender_share_key === myKey,
    body: row.body,
    imageUrl: row.image_url,
    createdAt: new Date(row.created_at).getTime(),
  };
}

async function loadRoomMessages(roomId) {
  const myKey = getShareKey();

  if (!supabaseClient) {
    chatMessages = roomId === null ? DEMO_CHAT_MESSAGES.slice() : [];
    renderChatMessages();
    setChatPresence(roomId === null ? '4 Citizens online (demo mode)' : 'Requires Supabase setup');
    return;
  }

  unsubscribeChatRealtime();

  try {
    let q = supabaseClient.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(50);
    q = roomId === null ? q.is('room_id', null) : q.eq('room_id', roomId);
    const { data, error } = await q;
    if (error) throw error;
    chatMessages = (data || []).map((row) => mapMessageRow(row, myKey));
    renderChatMessages();
  } catch (err) {
    console.warn('Limay Nexus: room message load failed.', err);
    chatMessages = roomId === null ? DEMO_CHAT_MESSAGES.slice() : [];
    renderChatMessages();
  }

  chatRealtimeChannel = supabaseClient
    .channel(`chat-room-${roomId || 'public'}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
      const row = payload.new;
      const rowRoomId = row.room_id || null;
      if (rowRoomId !== roomId) {
        if (rowRoomId && dmRoomIsMine(rowRoomId) && row.sender_share_key !== myKey) {
          dmUnreadRoomIds.add(rowRoomId);
          updateChatNotifDots();
        }
        return;
      }
      if (chatMessages.some((m) => m.id === row.id)) return;
      chatMessages.push(mapMessageRow(row, myKey));
      if (chatMessages.length > 200) chatMessages.shift();
      renderChatMessages();
    })
    .subscribe();

  if (roomId === null) {
    chatPresenceChannel = supabaseClient.channel('public-chat-presence', { config: { presence: { key: myKey } } });
    chatPresenceChannel
      .on('presence', { event: 'sync' }, () => {
        const count = Object.keys(chatPresenceChannel.presenceState()).length;
        setChatPresence(`${count} ${count === 1 ? 'Citizen' : 'Citizens'} online`);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') chatPresenceChannel.track({ name: getDisplayName(), online_at: Date.now() });
      });
  } else if (currentRoomIsDm) {
    setChatPresence('Direct Message');
  } else {
    setChatPresence('Group Chat');
  }
}

function dmRoomIsMine(roomId) {
  return myDmRooms.some((r) => r.id === roomId);
}

/* ---- Room-type dropdown + list/thread switching ---- */
function toggleChatRoomDropdown() {
  const dropdown = document.getElementById('chatRoomDropdown');
  dropdown.hidden = !dropdown.hidden;
  document.getElementById('chatNotifPopover').hidden = true;
}

async function switchChatView(view) {
  currentChatView = view;
  document.getElementById('chatRoomDropdown').hidden = true;
  closeChatUserMenu();
  document.getElementById('chatNewGroupForm').hidden = true;
  document.getElementById('chatNewDmForm').hidden = true;

  document.querySelectorAll('.chat-room-dropdown-item').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.roomView === view);
  });

  if (view === 'public') {
    viewingRoomThread = true;
    activeRoomId = null;
    currentRoomName = 'Public';
    currentRoomIsDm = false;
    document.getElementById('chatRoomSelectorLabel').textContent = 'Public';
    document.getElementById('btnChatBack').hidden = true;
    document.getElementById('chatRoomList').hidden = true;
    document.getElementById('chatMessages').hidden = false;
    document.getElementById('chatInputRow').hidden = false;
    await loadRoomMessages(null);
    return;
  }

  viewingRoomThread = false;
  document.getElementById('chatRoomSelectorLabel').textContent = view === 'groups' ? 'Group Chats' : 'Direct Messages';
  document.getElementById('btnChatBack').hidden = true;
  document.getElementById('chatMessages').hidden = true;
  document.getElementById('chatInputRow').hidden = true;
  document.getElementById('chatRoomList').hidden = false;
  unsubscribeChatRealtime();

  if (view === 'groups') await renderGroupRoomList();
  else await renderDmRoomList();
}

async function openChatRoom(roomId, roomName, isDm) {
  viewingRoomThread = true;
  activeRoomId = roomId;
  currentRoomName = roomName;
  currentRoomIsDm = isDm;
  document.getElementById('chatRoomSelectorLabel').textContent = roomName;
  document.getElementById('btnChatBack').hidden = false;
  document.getElementById('chatRoomList').hidden = true;
  document.getElementById('chatNewGroupForm').hidden = true;
  document.getElementById('chatNewDmForm').hidden = true;
  document.getElementById('chatMessages').hidden = false;
  document.getElementById('chatInputRow').hidden = false;

  if (isDm) {
    dmUnreadRoomIds.delete(roomId);
    updateChatNotifDots();
  }

  await loadRoomMessages(roomId);
}

async function backFromChatRoom() {
  await switchChatView(currentChatView === 'public' ? 'public' : currentChatView);
}

/* ---- Group Chats list ---- */
async function renderGroupRoomList() {
  const list = document.getElementById('chatRoomList');
  if (!supabaseClient) {
    list.innerHTML = '<p class="chat-notif-empty">Group chats require Supabase setup.</p>';
    return;
  }
  list.innerHTML = '<p class="chat-notif-empty">Loading…</p>';
  try {
    const myKey = getShareKey();
    const { data: memberRows, error } = await supabaseClient
      .from('chat_room_members')
      .select('room_id, chat_rooms!inner(id, name, is_dm)')
      .eq('share_key', myKey).eq('status', 'joined').eq('chat_rooms.is_dm', false);
    if (error) throw error;
    myGroupRooms = (memberRows || []).map((r) => ({ id: r.chat_rooms.id, name: r.chat_rooms.name || 'Group Chat' }));

    list.innerHTML = (myGroupRooms.length
      ? myGroupRooms.map((r) => `
        <button class="chat-room-list-item" data-open-room="${r.id}" data-open-room-name="${escapeHtml(r.name)}">
          <span class="chat-room-list-avatar">${initials(r.name)}</span>
          <div class="chat-room-list-info">
            <p class="chat-room-list-name">${escapeHtml(r.name)}</p>
            <span class="chat-room-list-meta">Group Chat</span>
          </div>
        </button>
      `).join('')
      : '<p class="chat-notif-empty">No group chats yet.</p>'
    ) + '<button class="chat-room-list-new-btn" id="btnOpenNewGroup">+ New Group Chat</button>';

    list.querySelectorAll('[data-open-room]').forEach((btn) => {
      btn.addEventListener('click', () => openChatRoom(btn.dataset.openRoom, btn.dataset.openRoomName, false));
    });
    document.getElementById('btnOpenNewGroup').addEventListener('click', openNewGroupForm);
  } catch (err) {
    list.innerHTML = '<p class="chat-notif-empty">Could not load group chats.</p>';
  }
}

/* ---- Direct Messages list ---- */
async function renderDmRoomList() {
  const list = document.getElementById('chatRoomList');
  if (!supabaseClient) {
    list.innerHTML = '<p class="chat-notif-empty">Direct messages require Supabase setup.</p>';
    return;
  }
  list.innerHTML = '<p class="chat-notif-empty">Loading…</p>';
  try {
    const myKey = getShareKey();
    const { data: memberRows, error } = await supabaseClient
      .from('chat_room_members')
      .select('room_id, chat_rooms!inner(id, is_dm)')
      .eq('share_key', myKey).eq('status', 'joined').eq('chat_rooms.is_dm', true);
    if (error) throw error;

    const roomIds = (memberRows || []).map((r) => r.room_id);
    let otherMembers = [];
    if (roomIds.length) {
      const { data } = await supabaseClient
        .from('chat_room_members')
        .select('room_id, share_key, digital_id, code_name')
        .in('room_id', roomIds).neq('share_key', myKey);
      otherMembers = data || [];
    }
    myDmRooms = roomIds.map((id) => {
      const other = otherMembers.find((m) => m.room_id === id);
      return { id, otherName: other?.code_name || 'Citizen', otherDigitalId: other?.digital_id || '' };
    });

    const friends = getFriends();
    const friendsHtml = friends.length
      ? '<p class="chat-room-list-section-label">Friends</p>' + friends.map((f) => `
        <button class="chat-room-list-item" data-friend-digital-id="${f.digitalId}" data-friend-name="${escapeHtml(f.codeName)}">
          <span class="chat-room-list-avatar">${initials(f.codeName)}</span>
          <div class="chat-room-list-info">
            <p class="chat-room-list-name">${escapeHtml(f.codeName)}</p>
            <span class="chat-room-list-meta">${f.digitalId}</span>
          </div>
        </button>
      `).join('')
      : '';

    const dmsHtml = myDmRooms.length
      ? '<p class="chat-room-list-section-label">Conversations</p>' + myDmRooms.map((r) => `
        <button class="chat-room-list-item" data-open-room="${r.id}" data-open-room-name="${escapeHtml(r.otherName)}">
          <span class="chat-room-list-avatar">${initials(r.otherName)}${dmUnreadRoomIds.has(r.id) ? ' <span class=\"chat-notif-dot chat-notif-dot-red\" style=\"position:static;display:inline-block;margin-left:2px;\"></span>' : ''}</span>
          <div class="chat-room-list-info">
            <p class="chat-room-list-name">${escapeHtml(r.otherName)}</p>
            <span class="chat-room-list-meta">${r.otherDigitalId}</span>
          </div>
        </button>
      `).join('')
      : '<p class="chat-notif-empty">No conversations yet.</p>';

    list.innerHTML = friendsHtml + dmsHtml + '<button class="chat-room-list-new-btn" id="btnOpenNewDm">+ New Message</button>';

    list.querySelectorAll('[data-open-room]').forEach((btn) => {
      btn.addEventListener('click', () => openChatRoom(btn.dataset.openRoom, btn.dataset.openRoomName, true));
    });
    list.querySelectorAll('[data-friend-digital-id]').forEach((btn) => {
      btn.addEventListener('click', () => startDmByDigitalId(btn.dataset.friendDigitalId));
    });
    document.getElementById('btnOpenNewDm').addEventListener('click', openNewDmForm);
  } catch (err) {
    list.innerHTML = '<p class="chat-notif-empty">Could not load direct messages.</p>';
  }
}

/* ---- New Group Chat form ---- */
function openNewGroupForm() {
  newGroupInviteIds = [];
  document.getElementById('newGroupNameInput').value = '';
  document.getElementById('newGroupInviteInput').value = '';
  document.getElementById('newGroupInviteChips').innerHTML = '';
  document.getElementById('newGroupNote').textContent = '';
  document.getElementById('chatRoomList').hidden = true;
  document.getElementById('chatNewGroupForm').hidden = false;
}

function renderNewGroupChips() {
  document.getElementById('newGroupInviteChips').innerHTML = newGroupInviteIds.map((id) => `
    <span class="chat-invite-chip">${id}<button data-remove-invite="${id}">✕</button></span>
  `).join('');
  document.querySelectorAll('[data-remove-invite]').forEach((btn) => {
    btn.addEventListener('click', () => {
      newGroupInviteIds = newGroupInviteIds.filter((id) => id !== btn.dataset.removeInvite);
      renderNewGroupChips();
    });
  });
}

async function createGroupChat() {
  const note = document.getElementById('newGroupNote');
  const name = document.getElementById('newGroupNameInput').value.trim();
  if (!name) { note.textContent = 'Enter a group name.'; return; }
  if (!supabaseClient) { note.textContent = 'Requires Supabase setup.'; return; }
  note.textContent = 'Creating…';
  try {
    const { data: roomId, error } = await supabaseClient.rpc('create_group_room', {
      p_creator_share_key: getShareKey(),
      p_creator_digital_id: getOrCreateDigitalId(),
      p_creator_code_name: getDisplayName(),
      p_room_name: name,
      p_invite_digital_ids: newGroupInviteIds,
    });
    if (error) throw error;
    document.getElementById('chatNewGroupForm').hidden = true;
    await openChatRoom(roomId, name, false);
  } catch (err) {
    note.textContent = 'Could not create group: ' + (err.message || 'unknown error');
  }
}

/* ---- New Direct Message form ---- */
function openNewDmForm() {
  document.getElementById('newDmDigitalIdInput').value = '';
  document.getElementById('newDmNote').textContent = '';
  document.getElementById('chatRoomList').hidden = true;
  document.getElementById('chatNewDmForm').hidden = false;
}

async function startDmByDigitalId(digitalId) {
  const note = document.getElementById('newDmNote');
  if (!digitalId) { note.textContent = 'Enter a Digital ID.'; return; }
  if (!supabaseClient) { note.textContent = 'Requires Supabase setup.'; return; }
  note.textContent = 'Connecting…';
  try {
    const { data: roomId, error } = await supabaseClient.rpc('create_dm_room', {
      p_a_share_key: getShareKey(),
      p_a_digital_id: getOrCreateDigitalId(),
      p_a_code_name: getDisplayName(),
      p_b_digital_id: digitalId,
    });
    if (error) throw error;
    document.getElementById('chatNewDmForm').hidden = true;
    await openChatRoom(roomId, digitalId, true);
  } catch (err) {
    note.textContent = 'Could not start chat: ' + (err.message || 'unknown error');
  }
}

/* ---- Username click menu ---- */
function openChatUserMenu(name, digitalId, x, y) {
  chatUserMenuTarget = { name, digitalId };
  const menu = document.getElementById('chatUserMenu');
  document.getElementById('chatUserMenuName').textContent = name;
  menu.hidden = false;
  const menuWidth = 220;
  menu.style.left = Math.max(8, Math.min(x, window.innerWidth - menuWidth - 12)) + 'px';
  menu.style.top = Math.max(8, Math.min(y, window.innerHeight - 180)) + 'px';
}
function closeChatUserMenu() {
  document.getElementById('chatUserMenu').hidden = true;
  chatUserMenuTarget = null;
}

/* ---- Notifications: pending group invites (green) + unread DMs (red) ---- */
async function refreshChatNotifications() {
  if (!supabaseClient) return;
  try {
    const myKey = getShareKey();
    const { data, error } = await supabaseClient
      .from('chat_room_members')
      .select('room_id, chat_rooms!inner(id, name, is_dm)')
      .eq('share_key', myKey).eq('status', 'invited').eq('chat_rooms.is_dm', false);
    if (error) throw error;
    pendingGroupInvites = (data || []).map((r) => ({ roomId: r.chat_rooms.id, roomName: r.chat_rooms.name || 'Group Chat' }));
  } catch (err) { /* best effort */ }
  updateChatNotifDots();
}

function updateChatNotifDots() {
  document.getElementById('chatNotifDotGreen').hidden = pendingGroupInvites.length === 0;
  document.getElementById('chatNotifDotRed').hidden = dmUnreadRoomIds.size === 0;
}

function renderNotifPopover() {
  const list = document.getElementById('chatNotifList');
  const items = [];

  pendingGroupInvites.forEach((inv) => {
    items.push(`
      <div class="chat-notif-item">
        <div class="chat-notif-item-text">Invited to <span class="chat-notif-item-name">${escapeHtml(inv.roomName)}</span></div>
        <div class="chat-notif-item-actions">
          <button class="chat-notif-accept" data-accept-invite="${inv.roomId}" data-invite-name="${escapeHtml(inv.roomName)}">Accept</button>
          <button class="chat-notif-decline" data-decline-invite="${inv.roomId}">Decline</button>
        </div>
      </div>
    `);
  });

  dmUnreadRoomIds.forEach((roomId) => {
    const room = myDmRooms.find((r) => r.id === roomId);
    items.push(`
      <div class="chat-notif-item">
        <div class="chat-notif-item-text">New message from <span class="chat-notif-item-name">${escapeHtml(room?.otherName || 'someone')}</span></div>
        <div class="chat-notif-item-actions">
          <button class="chat-notif-accept" data-open-dm="${roomId}" data-open-dm-name="${escapeHtml(room?.otherName || 'Direct Message')}">Open</button>
        </div>
      </div>
    `);
  });

  list.innerHTML = items.join('') || '<p class="chat-notif-empty">No notifications.</p>';

  list.querySelectorAll('[data-accept-invite]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await supabaseClient.rpc('accept_group_invite', { p_room_id: btn.dataset.acceptInvite, p_share_key: getShareKey() });
        pendingGroupInvites = pendingGroupInvites.filter((i) => i.roomId !== btn.dataset.acceptInvite);
        updateChatNotifDots();
        document.getElementById('chatNotifPopover').hidden = true;
        await switchChatView('groups');
        await openChatRoom(btn.dataset.acceptInvite, btn.dataset.inviteName, false);
      } catch (err) { /* best effort */ }
    });
  });
  list.querySelectorAll('[data-decline-invite]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await supabaseClient.rpc('decline_group_invite', { p_room_id: btn.dataset.declineInvite, p_share_key: getShareKey() });
        pendingGroupInvites = pendingGroupInvites.filter((i) => i.roomId !== btn.dataset.declineInvite);
        updateChatNotifDots();
        renderNotifPopover();
      } catch (err) { /* best effort */ }
    });
  });
  list.querySelectorAll('[data-open-dm]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      document.getElementById('chatNotifPopover').hidden = true;
      await switchChatView('dms');
      await openChatRoom(btn.dataset.openDm, btn.dataset.openDmName, true);
    });
  });
}

function clearPendingImage() {
  pendingImageDataUrl = null;
  document.getElementById('chatPendingImage').hidden = true;
  document.getElementById('chatImageInput').value = '';
}

async function sendChatMessage() {
  const input = document.getElementById('chatTextInput');
  const body = input.value.trim();
  if (!body && !pendingImageDataUrl) return;

  const senderName = getDisplayName();
  const myKey = getShareKey();
  const localImageUrl = pendingImageDataUrl;

  input.value = '';
  clearPendingImage();

  if (supabaseClient) {
    try {
      let imageUrl = null;
      if (localImageUrl) imageUrl = await uploadChatImage(localImageUrl, myKey);

      const { error } = await supabaseClient.from('chat_messages').insert({
        room_id: activeRoomId,
        sender_share_key: myKey,
        sender_name: senderName,
        sender_digital_id: getOrCreateDigitalId(),
        body: body || null,
        image_url: imageUrl,
      });
      if (error) throw error;
      // The realtime INSERT subscription above will append it to the thread.
      return;
    } catch (err) {
      console.warn('Limay Nexus: send failed, showing locally only.', err);
    }
  }

  chatMessages.push({ id: `local-${Date.now()}`, senderName, self: true, body, imageUrl: localImageUrl, createdAt: Date.now() });
  renderChatMessages();
}

async function uploadChatImage(dataUrl, shareKey) {
  const blob = await (await fetch(dataUrl)).blob();
  const ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const path = `${shareKey}/${Date.now()}.${ext}`;
  const { error } = await supabaseClient.storage.from('chat-images').upload(path, blob, { contentType: blob.type });
  if (error) throw error;
  return supabaseClient.storage.from('chat-images').getPublicUrl(path).data.publicUrl;
}

function initChatComposer() {
  const attachBtn = document.getElementById('chatAttachBtn');
  const fileInput = document.getElementById('chatImageInput');
  const textInput = document.getElementById('chatTextInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const pendingWrap = document.getElementById('chatPendingImage');
  const pendingPreview = document.getElementById('chatPendingImagePreview');

  attachBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      pendingImageDataUrl = reader.result;
      pendingPreview.src = pendingImageDataUrl;
      pendingWrap.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('chatPendingImageRemove').addEventListener('click', clearPendingImage);

  sendBtn.addEventListener('click', sendChatMessage);
  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  document.getElementById('lightbox').addEventListener('click', closeLightbox);

  const expandBtn = document.getElementById('btnChatExpand');
  const backdrop = document.getElementById('chatExpandBackdrop');
  expandBtn.addEventListener('click', toggleChatExpanded);
  backdrop.addEventListener('click', () => setChatExpanded(false));

  document.getElementById('chatRoomSelector').addEventListener('click', toggleChatRoomDropdown);
  document.querySelectorAll('.chat-room-dropdown-item').forEach((btn) => {
    btn.addEventListener('click', () => switchChatView(btn.dataset.roomView));
  });
  document.getElementById('btnChatBack').addEventListener('click', backFromChatRoom);

  document.getElementById('btnChatRefresh').addEventListener('click', async () => {
    await refreshChatNotifications();
    if (!viewingRoomThread) {
      if (currentChatView === 'groups') await renderGroupRoomList();
      else if (currentChatView === 'dms') await renderDmRoomList();
    } else {
      await loadRoomMessages(activeRoomId);
    }
  });

  document.getElementById('btnChatNotifications').addEventListener('click', () => {
    const popover = document.getElementById('chatNotifPopover');
    const wasHidden = popover.hidden;
    document.getElementById('chatRoomDropdown').hidden = true;
    popover.hidden = !wasHidden;
    if (wasHidden) renderNotifPopover();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.chat-room-selector') && !e.target.closest('.chat-room-dropdown')) {
      document.getElementById('chatRoomDropdown').hidden = true;
    }
    if (!e.target.closest('.chat-bell-wrap')) {
      document.getElementById('chatNotifPopover').hidden = true;
    }
    if (!e.target.closest('.chat-user-menu') && !e.target.closest('[data-user-name]')) {
      closeChatUserMenu();
    }
  });

  document.getElementById('btnNewGroupAddInvite').addEventListener('click', () => {
    const input = document.getElementById('newGroupInviteInput');
    const id = input.value.trim().toUpperCase();
    if (id && !newGroupInviteIds.includes(id)) {
      newGroupInviteIds.push(id);
      renderNewGroupChips();
    }
    input.value = '';
  });
  document.getElementById('btnNewGroupCancel').addEventListener('click', () => switchChatView('groups'));
  document.getElementById('btnNewGroupCreate').addEventListener('click', createGroupChat);

  document.getElementById('btnNewDmCancel').addEventListener('click', () => switchChatView('dms'));
  document.getElementById('btnNewDmStart').addEventListener('click', () => {
    const id = document.getElementById('newDmDigitalIdInput').value.trim().toUpperCase();
    startDmByDigitalId(id);
  });

  document.getElementById('btnChatUserInvite').addEventListener('click', async () => {
    if (!chatUserMenuTarget) return;
    const target = chatUserMenuTarget;
    closeChatUserMenu();

    if (viewingRoomThread && activeRoomId && !currentRoomIsDm) {
      // Already inside a group room — invite them into this one directly.
      try {
        await supabaseClient.rpc('invite_to_group_room', {
          p_room_id: activeRoomId,
          p_inviter_share_key: getShareKey(),
          p_invitee_digital_id: target.digitalId,
        });
      } catch (err) { /* best effort */ }
      return;
    }

    // Otherwise, start a new group with them pre-added as an invite.
    await switchChatView('groups');
    openNewGroupForm();
    if (target.digitalId && !newGroupInviteIds.includes(target.digitalId)) {
      newGroupInviteIds.push(target.digitalId);
      renderNewGroupChips();
    }
  });
  document.getElementById('btnChatUserDm').addEventListener('click', () => {
    if (!chatUserMenuTarget) return;
    const target = chatUserMenuTarget;
    closeChatUserMenu();
    if (target.digitalId) startDmByDigitalId(target.digitalId);
  });
  document.getElementById('btnChatUserAddFriend').addEventListener('click', () => {
    if (!chatUserMenuTarget) return;
    addFriend(chatUserMenuTarget.digitalId, chatUserMenuTarget.name);
    closeChatUserMenu();
  });
}

const ICON_EXPAND = '<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5"/>';
const ICON_MINIMIZE = '<path d="M9 3v5H4M15 3v5h5M9 21v-5H4M15 21v-5h5"/>';

function setChatExpanded(expanded) {
  const card = document.getElementById('chatCard');
  const backdrop = document.getElementById('chatExpandBackdrop');
  const btn = document.getElementById('btnChatExpand');

  card.classList.toggle('is-expanded', expanded);
  backdrop.hidden = !expanded;
  btn.innerHTML = svgIcon(expanded ? ICON_MINIMIZE : ICON_EXPAND);
  btn.title = expanded ? 'Minimize' : 'Expand';
  btn.setAttribute('aria-label', expanded ? 'Minimize chat' : 'Expand chat');
  document.body.style.overflow = expanded ? 'hidden' : '';

  if (expanded) {
    const list = document.getElementById('chatMessages');
    list.scrollTop = list.scrollHeight;
  }
}

function toggleChatExpanded() {
  const isExpanded = document.getElementById('chatCard').classList.contains('is-expanded');
  setChatExpanded(!isExpanded);
}

function renderCuisineChips() {
  const row = document.getElementById('cuisineChips');
  row.innerHTML = CUISINES.map(c => `
    <button class="chip ${c === state.activeCuisine ? 'active' : ''}" data-cuisine="${c}">${c}</button>
  `).join('');

  row.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.activeCuisine = chip.dataset.cuisine;
      renderCuisineChips();
      renderStoreList();
    });
  });
}

function getFilteredStores() {
  return STORES.filter(s => {
    const matchesCuisine = state.activeCuisine === 'All Cuisines' || s.cuisine === state.activeCuisine;
    const matchesQuery = !state.searchQuery || s.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCuisine && matchesQuery;
  });
}

function storeCardHtml(store) {
  return `
    <button class="store-card" data-store="${store.id}">
      <img class="store-thumb" src="${store.image}" alt="${store.name}" loading="lazy">
      <div class="store-body">
        <div class="store-top">
          <h3 class="store-name">${store.name}</h3>
          <span class="rating-chip">★ ${store.rating}</span>
        </div>
        <p class="store-desc">${store.desc}</p>
        <div class="store-bottom">
          <span class="status-chip ${statusClass(store.status)}">${store.statusLabel}</span>
          <span class="view-menu-link">View Menu ${svgIcon('<path d="M9 18l6-6-6-6"/>')}</span>
        </div>
      </div>
    </button>
  `;
}

function renderStoreList() {
  const list = document.getElementById('storeList');
  const filtered = getFilteredStores();
  document.getElementById('resultCount').textContent = `${filtered.length} results`;
  list.innerHTML = filtered.map(storeCardHtml).join('') ||
    '<div class="empty-state"><p>No restaurants found</p><span>Try a different search or cuisine.</span></div>';

  list.querySelectorAll('.store-card').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.store));
  });
}

function renderFavorites() {
  const list = document.getElementById('favoritesList');
  const empty = document.getElementById('favoritesEmpty');
  const favStores = STORES.filter(s => state.favorites.has(s.id));

  if (favStores.length === 0) {
    list.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  list.innerHTML = favStores.map(storeCardHtml).join('');
  list.querySelectorAll('.store-card').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.store));
  });
}

function renderDetail(store) {
  document.getElementById('detailImg').src = store.image;
  document.getElementById('detailImg').alt = store.name;
  document.getElementById('detailName').textContent = store.name;
  document.getElementById('detailDesc').textContent = store.desc;
  document.getElementById('detailRating').textContent = `★ ${store.rating}`;

  const statusEl = document.getElementById('detailStatus');
  statusEl.textContent = store.statusLabel;
  statusEl.className = `status-chip ${statusClass(store.status)}`;

  document.getElementById('servicesCard').innerHTML = store.services.map(s => `
    <div class="service-row">
      <div>
        <p class="service-name">${s.name}</p>
        <p class="service-desc">${s.desc}</p>
      </div>
      <span class="service-price ${s.price === 'FREE' ? 'free' : ''}">${s.price}</span>
    </div>
  `).join('');

  document.getElementById('detailAddress').textContent = store.address;

  document.getElementById('fulfillmentRow').innerHTML = store.fulfillment.map(f => `
    <span class="fulfillment-chip">${svgIcon('<path d="M20 6 9 17l-5-5"/>')} ${f}</span>
  `).join('');

  document.getElementById('orderBtn').textContent =
    store.fulfillment.includes('Store Pickup') ? 'Order for Pickup' : 'Order Now';

  updateFavButton();
}

function updateFavButton() {
  const btn = document.getElementById('detailFav');
  const isFav = state.detailStoreId && state.favorites.has(state.detailStoreId);
  btn.style.color = isFav ? 'var(--error)' : 'var(--on-surface)';
  btn.querySelector('svg').setAttribute('fill', isFav ? 'currentColor' : 'none');
}

/* ============================================================
   Navigation
   ============================================================ */
function switchView(name) {
  if (typeof setChatExpanded === 'function') setChatExpanded(false);
  state.view = name;
  document.querySelectorAll('[data-view]').forEach(v => v.hidden = true);
  document.getElementById(`view-${name}`).hidden = false;
  updateAnnouncementStripVisibility();

  const topbar = document.getElementById('topbar');
  topbar.style.display = (name !== 'profile') ? 'flex' : 'none';

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.nav === name);
  });
  document.getElementById('bottomNav').style.display = 'flex';

  window.scrollTo(0, 0);
}

function openDetail(storeId) {
  const store = STORES.find(s => s.id === storeId);
  if (!store) return;
  state.detailStoreId = storeId;
  renderDetail(store);

  document.querySelectorAll('[data-view]').forEach(v => v.hidden = true);
  document.getElementById('view-detail').hidden = false;
  document.getElementById('topbar').style.display = 'none';
  document.getElementById('bottomNav').style.display = 'none';
  document.getElementById('announcementStrip').hidden = true;
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  window.scrollTo(0, 0);
}

function closeDetail() {
  state.detailStoreId = null;
  switchView(state.view === 'detail' ? 'home' : state.view);
}

/* ============================================================
   Public Announcement (marquee strip, admin-postable)
   ============================================================ */
let currentAnnouncementText = '';

function setMarqueeSpeed() {
  const track = document.getElementById('announcementMarqueeTrack');
  const singleWidth = track.children[0] ? track.children[0].getBoundingClientRect().width : 0;
  const pxPerSecond = 55;
  track.style.animationDuration = Math.max(6, singleWidth / pxPerSecond) + 's';
}

function renderAnnouncement(message) {
  currentAnnouncementText = message || '';
  document.querySelectorAll('.announcement-marquee-text').forEach((span) => {
    span.textContent = currentAnnouncementText;
  });
  if (currentAnnouncementText) setMarqueeSpeed();
  updateAnnouncementStripVisibility();
}

// Shown on every tab except Menu, and only when there's actually a
// message to show — no empty strip taking up space.
function updateAnnouncementStripVisibility() {
  const strip = document.getElementById('announcementStrip');
  strip.hidden = !currentAnnouncementText || state.view === 'profile';
}

async function loadAnnouncement() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('community_announcements').select('message').eq('id', 1).maybeSingle();
    if (error) throw error;
    renderAnnouncement(data && data.message);
  } catch (err) { /* best effort — strip just stays hidden */ }
}

function initAnnouncementAdminWidget() {
  document.getElementById('btnPostAnnouncement').addEventListener('click', async () => {
    const note = document.getElementById('announcementAdminNote');
    const message = document.getElementById('announcementInput').value.trim();
    note.textContent = 'Posting…';
    try {
      await adminRpc('admin_set_announcement', { p_message: message });
      renderAnnouncement(message);
      note.textContent = 'Posted.';
    } catch (err) {
      note.textContent = 'Could not post: ' + (err.message || 'unknown error');
    }
  });

  document.getElementById('btnClearAnnouncement').addEventListener('click', async () => {
    const note = document.getElementById('announcementAdminNote');
    document.getElementById('announcementInput').value = '';
    note.textContent = 'Clearing…';
    try {
      await adminRpc('admin_set_announcement', { p_message: '' });
      renderAnnouncement('');
      note.textContent = 'Cleared.';
    } catch (err) {
      note.textContent = 'Could not clear: ' + (err.message || 'unknown error');
    }
  });
}

/* ============================================================
   Admin Panel
   ============================================================ */
let adminSession = { password: null };
try {
  const saved = JSON.parse(localStorage.getItem('limayhub_admin_session'));
  if (saved && saved.password) adminSession = saved;
} catch (e) { /* ignore malformed/missing saved session */ }

function isAdminLoggedIn() { return !!adminSession.password; }

function refreshAdminUI() {
  const loggedIn = isAdminLoggedIn();
  document.getElementById('adminDrawerTab').hidden = !loggedIn;
  document.getElementById('adminLoginMenuLabel').textContent = loggedIn ? 'Admin Logout' : 'Admin Login';
  if (!loggedIn) closeAdminDrawerAll();

  // Admin panels are also reachable directly from the Menu tab for the
  // meantime, alongside the edge-tab pill.
  ['btnMenuStoreManager', 'btnMenuGemManager', 'btnMenuPromoManager', 'btnMenuChatModeration'].forEach((id) => {
    document.getElementById(id).hidden = !loggedIn;
  });

  const widget = document.getElementById('adminAnnouncementWidget');
  widget.hidden = !loggedIn;
  if (loggedIn) document.getElementById('announcementInput').value = currentAnnouncementText;
}

let adminPillOpen = false;
let adminPanelOpen = false;
function syncAdminBackdrop() {
  document.getElementById('adminDrawerBackdrop').hidden = !(adminPillOpen || adminPanelOpen);
}
function openAdminPill() {
  adminPillOpen = true;
  document.getElementById('adminDrawerPill').hidden = false;
  syncAdminBackdrop();
}
function closeAdminPill() {
  adminPillOpen = false;
  document.getElementById('adminDrawerPill').hidden = true;
  syncAdminBackdrop();
}
function openAdminPanel() {
  adminPanelOpen = true;
  document.getElementById('adminDrawer').hidden = false;
  syncAdminBackdrop();
}
function closeAdminPanel() {
  adminPanelOpen = false;
  document.getElementById('adminDrawer').hidden = true;
  syncAdminBackdrop();
}
function closeAdminDrawerAll() {
  closeAdminPill();
  closeAdminPanel();
}
function openAdminSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach(el => { el.hidden = (el.id !== sectionId); });
  closeAdminPill();
  openAdminPanel();
  if (sectionId === 'adminStoreManagerSection') renderAdminStoreList();
  if (sectionId === 'adminGemManagerSection') openGemManagerForm();
  if (sectionId === 'adminPromoManagerSection') renderAdminPromoCards();
  if (sectionId === 'adminChatModerationSection') renderAdminChatModeration();
}

async function adminRpc(fnName, params) {
  if (!supabaseClient) throw new Error('Supabase is not configured yet — add SUPABASE_URL/SUPABASE_ANON_KEY to config.js.');
  const { data, error } = await supabaseClient.rpc(fnName, { p_password: adminSession.password, ...params });
  if (error) throw error;
  return data;
}

/* ---- Store Manager ---- */
function renderAdminStoreList() {
  const list = document.getElementById('adminStoreList');
  list.innerHTML = STORES.map(s => `
    <div class="admin-store-item">
      <div>
        <p class="admin-store-item-name">${s.name}</p>
        <span class="admin-store-item-meta">${s.category || '—'} · ★ ${s.rating}</span>
      </div>
      <div class="admin-store-item-actions">
        <button class="admin-icon-btn-sm" data-edit="${s.id}">✏️</button>
        <button class="admin-icon-btn-sm" data-delete="${s.id}">🗑️</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openStoreForm(STORES.find(s => s.id === btn.dataset.edit)));
  });
  list.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteStore(btn.dataset.delete));
  });
}

function addServiceRow(data) {
  const row = document.createElement('div');
  row.className = 'admin-service-row';
  row.innerHTML = `
    <input type="text" placeholder="Name" class="svc-name" value="${data?.name || ''}">
    <input type="text" placeholder="Description" class="svc-desc" value="${data?.desc || ''}">
    <input type="text" placeholder="Price" class="svc-price" value="${data?.price || ''}">
    <button type="button">✕</button>
  `;
  row.querySelector('button').addEventListener('click', () => row.remove());
  document.getElementById('asServicesList').appendChild(row);
}

function openStoreForm(store) {
  const categorySelect = document.getElementById('asCategory');
  categorySelect.innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  document.getElementById('asStoreId').value = store?.id || '';
  document.getElementById('asName').value = store?.name || '';
  document.getElementById('asSlug').value = store?.id || '';
  categorySelect.value = store?.category || CATEGORIES[0]?.id || '';
  document.getElementById('asCuisine').value = store?.cuisine || '';
  document.getElementById('asRating').value = store?.rating ?? 4.5;
  document.getElementById('asDescription').value = store?.desc || '';
  document.getElementById('asStatus').value = store?.status || 'open';
  document.getElementById('asStatusLabel').value = store?.statusLabel || 'Open Now';
  document.getElementById('asImageUrl').value = store?.image || '';
  document.getElementById('asAddress').value = store?.address || '';

  document.querySelectorAll('.asFulfillment').forEach(cb => {
    cb.checked = !!store?.fulfillment?.includes(cb.value);
  });

  document.getElementById('asServicesList').innerHTML = '';
  (store?.services || []).forEach(addServiceRow);

  document.getElementById('adminStoreFormNote').textContent = '';
  document.getElementById('adminStoreForm').hidden = false;
  document.getElementById('adminStoreForm').scrollIntoView({ behavior: 'smooth' });
}

async function saveStore() {
  const note = document.getElementById('adminStoreFormNote');
  const id = document.getElementById('asStoreId').value || null;
  const slug = document.getElementById('asSlug').value.trim();
  const name = document.getElementById('asName').value.trim();
  if (!slug || !name) { note.textContent = 'Name and slug are required.'; return; }

  const fulfillment = [...document.querySelectorAll('.asFulfillment:checked')].map(cb => cb.value);
  const services = [...document.querySelectorAll('#asServicesList .admin-service-row')].map((row, i) => ({
    name: row.querySelector('.svc-name').value.trim(),
    description: row.querySelector('.svc-desc').value.trim(),
    price_label: row.querySelector('.svc-price').value.trim(),
    sort_order: i + 1,
  })).filter(s => s.name);

  note.textContent = 'Saving…';
  try {
    const existing = STORES.find(s => s.id === (id || slug));
    const storeId = await adminRpc('admin_upsert_store', {
      p_id: existing && !id ? null : (id ? await resolveStoreDbId(id) : null),
      p_slug: slug,
      p_category_id: document.getElementById('asCategory').value,
      p_name: name,
      p_cuisine: document.getElementById('asCuisine').value.trim(),
      p_rating: parseFloat(document.getElementById('asRating').value) || 0,
      p_description: document.getElementById('asDescription').value.trim(),
      p_status: document.getElementById('asStatus').value,
      p_status_label: document.getElementById('asStatusLabel').value.trim(),
      p_image_url: document.getElementById('asImageUrl').value.trim(),
      p_address: document.getElementById('asAddress').value.trim(),
      p_fulfillment_methods: fulfillment,
      p_sort_order: STORES.length + 1,
    });
    await adminRpc('admin_set_store_services', { p_store_id: storeId, p_services: services });

    await loadDataFromSupabase();
    renderCategories(); renderStoreList(); renderFavorites(); renderLeaderboardGroups(); renderGemBanner();
    document.getElementById('adminStoreForm').hidden = true;
    renderAdminStoreList();
  } catch (err) {
    note.textContent = 'Save failed: ' + (err.message || 'unknown error');
  }
}

// The client keeps stores keyed by slug, but the DB primary key is a uuid —
// this looks that uuid up by slug right before an update RPC call.
async function resolveStoreDbId(slug) {
  const { data } = await supabaseClient.from('stores').select('id').eq('slug', slug).maybeSingle();
  return data?.id || null;
}

async function deleteStore(slug) {
  if (!confirm('Delete this store? This cannot be undone.')) return;
  try {
    const dbId = await resolveStoreDbId(slug);
    if (dbId) await adminRpc('admin_delete_store', { p_id: dbId });
    await loadDataFromSupabase();
    renderCategories(); renderStoreList(); renderFavorites(); renderLeaderboardGroups(); renderGemBanner();
    renderAdminStoreList();
  } catch (err) {
    alert('Delete failed: ' + (err.message || 'unknown error'));
  }
}

/* ---- Featured Gem Manager ---- */
function openGemManagerForm() {
  document.getElementById('agTitle').value = GEM_FEATURE.title;
  document.getElementById('agSubtitle').value = GEM_FEATURE.sub;
  document.getElementById('agImageUrl').value = GEM_FEATURE.image;
  document.getElementById('adminGemNote').textContent = '';
}

async function saveGem() {
  const note = document.getElementById('adminGemNote');
  note.textContent = 'Saving…';
  try {
    await adminRpc('admin_set_featured_gem', {
      p_title: document.getElementById('agTitle').value.trim(),
      p_subtitle: document.getElementById('agSubtitle').value.trim(),
      p_image_url: document.getElementById('agImageUrl').value.trim(),
    });
    await loadDataFromSupabase();
    renderGemBanner();
    note.textContent = 'Saved.';
  } catch (err) {
    note.textContent = 'Save failed: ' + (err.message || 'unknown error');
  }
}

/* ---- Promo Cards Manager ---- */
function renderAdminPromoCards() {
  const container = document.getElementById('adminPromoCardsList');
  container.innerHTML = PROMO_CARDS.map((c, i) => `
    <div class="admin-promo-card">
      <h4>${c.cardId}</h4>
      <label class="field-label">Title</label>
      <input class="field-input pc-title" type="text" value="${c.title}">
      <label class="field-label">Subtitle</label>
      <input class="field-input pc-subtitle" type="text" value="${c.subtitle}">
      <label class="field-label">Button Label</label>
      <input class="field-input pc-button" type="text" value="${c.buttonLabel}">
      <div class="admin-form-actions">
        <button class="btn-primary" data-save-promo="${i}">Save</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('[data-save-promo]').forEach(btn => {
    btn.addEventListener('click', () => savePromoCard(parseInt(btn.dataset.savePromo, 10)));
  });
}

async function savePromoCard(index) {
  const note = document.getElementById('adminPromoNote');
  const card = PROMO_CARDS[index];
  const wrap = document.querySelectorAll('.admin-promo-card')[index];
  note.textContent = 'Saving…';
  try {
    await adminRpc('admin_set_promo_card', {
      p_card_id: card.cardId,
      p_title: wrap.querySelector('.pc-title').value.trim(),
      p_subtitle: wrap.querySelector('.pc-subtitle').value.trim(),
      p_button_label: wrap.querySelector('.pc-button').value.trim(),
    });
    await loadDataFromSupabase();
    renderPromoCards();
    note.textContent = 'Saved.';
  } catch (err) {
    note.textContent = 'Save failed: ' + (err.message || 'unknown error');
  }
}

/* ---- Chat Moderation ---- */
function renderAdminChatModeration() {
  const list = document.getElementById('adminChatModerationList');
  const recent = chatMessages.slice(-30).reverse();
  list.innerHTML = recent.map(m => `
    <div class="admin-chat-msg-item">
      <div>
        <span>${m.senderName} · ${timeLabel(m.createdAt)}</span>
        <p>${escapeHtml(m.body || '(image)')}</p>
      </div>
      <button class="admin-icon-btn-sm" data-del-msg="${m.id}">🗑️</button>
    </div>
  `).join('') || '<p class="field-note">No messages yet.</p>';

  list.querySelectorAll('[data-del-msg]').forEach(btn => {
    btn.addEventListener('click', () => deleteChatMessage(btn.dataset.delMsg));
  });
}

async function deleteChatMessage(id) {
  if (!confirm('Delete this message?')) return;
  try {
    if (!id.startsWith('local-') && !id.startsWith('demo-')) {
      await adminRpc('admin_delete_chat_message', { p_message_id: id });
    }
    chatMessages = chatMessages.filter(m => m.id !== id);
    renderChatMessages();
    renderAdminChatModeration();
  } catch (err) {
    alert('Delete failed: ' + (err.message || 'unknown error'));
  }
}

/* ---- Init / wiring ---- */
function initAdminSystem() {
  refreshAdminUI();

  document.getElementById('btnAdminLoginMenuItem').addEventListener('click', () => {
    if (isAdminLoggedIn()) {
      adminSession = { password: null };
      localStorage.removeItem('limayhub_admin_session');
      refreshAdminUI();
      return;
    }
    document.getElementById('adminLoginNote').textContent = '';
    document.getElementById('adminLoginPassword').value = '';
    document.getElementById('adminLoginOverlay').hidden = false;
  });

  const loginOverlay = document.getElementById('adminLoginOverlay');
  document.getElementById('btnCloseAdminLogin').addEventListener('click', () => { loginOverlay.hidden = true; });
  loginOverlay.addEventListener('click', (e) => { if (e.target === loginOverlay) loginOverlay.hidden = true; });

  document.getElementById('btnAdminLoginSubmit').addEventListener('click', async () => {
    const pw = document.getElementById('adminLoginPassword').value;
    const note = document.getElementById('adminLoginNote');
    if (!pw) { note.textContent = 'Enter the admin password.'; return; }
    if (!supabaseClient) { note.textContent = 'Supabase is not set up yet — see the README/setup steps.'; return; }
    note.textContent = 'Checking…';
    try {
      const { data, error } = await supabaseClient.rpc('verify_admin_login', { p_password: pw });
      if (error) throw error;
      if (data === true) {
        adminSession = { password: pw };
        localStorage.setItem('limayhub_admin_session', JSON.stringify(adminSession));
        loginOverlay.hidden = true;
        refreshAdminUI();
      } else {
        note.textContent = 'Incorrect password.';
      }
    } catch (err) {
      note.textContent = 'Login failed — try again.';
    }
  });

  document.getElementById('btnMenuStoreManager').addEventListener('click', () => openAdminSection('adminStoreManagerSection'));
  document.getElementById('btnMenuGemManager').addEventListener('click', () => openAdminSection('adminGemManagerSection'));
  document.getElementById('btnMenuPromoManager').addEventListener('click', () => openAdminSection('adminPromoManagerSection'));
  document.getElementById('btnMenuChatModeration').addEventListener('click', () => openAdminSection('adminChatModerationSection'));

  const tab = document.getElementById('adminDrawerTab');
  tab.addEventListener('click', () => { adminPillOpen ? closeAdminPill() : openAdminPill(); });
  document.getElementById('adminDrawerBackdrop').addEventListener('click', closeAdminDrawerAll);
  document.getElementById('btnCloseAdminDrawer').addEventListener('click', () => { closeAdminPanel(); openAdminPill(); });
  document.getElementById('btnAdminLogoutPill').addEventListener('click', () => {
    adminSession = { password: null };
    localStorage.removeItem('limayhub_admin_session');
    refreshAdminUI();
  });

  document.querySelectorAll('.admin-drawer-pill-item[data-target]').forEach(btn => {
    btn.addEventListener('click', () => openAdminSection(btn.dataset.target));
  });

  document.getElementById('btnAdminNewStore').addEventListener('click', () => openStoreForm(null));
  document.getElementById('btnAsCancel').addEventListener('click', () => { document.getElementById('adminStoreForm').hidden = true; });
  document.getElementById('btnAsAddService').addEventListener('click', () => addServiceRow(null));
  document.getElementById('btnAsSave').addEventListener('click', saveStore);
  document.getElementById('btnAgSave').addEventListener('click', saveGem);
}

/* ============================================================
   Wiring
   ============================================================ */
async function init() {
  await loadDataFromSupabase();

  // First-run registration is hidden for the meantime — the app opens
  // directly to the main page instead of prompting for it.
  // initRegistrationFlow();
  renderWelcomeHero();
  renderCategories();
  renderGemBanner();
  renderCuisineChips();
  renderStoreList();
  renderFavorites();
  renderLeaderboardGroups();
  renderPromoCards();
  initChatComposer();
  await syncChatIdentity();
  await switchChatView('public');
  await refreshChatNotifications();
  await loadAnnouncement();
  initAdminSystem();

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.nav));
  });

  document.getElementById('homeSearchBar').addEventListener('click', () => switchView('search'));

  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderStoreList();
  });

  document.getElementById('detailBack').addEventListener('click', closeDetail);

  document.getElementById('detailFav').addEventListener('click', () => {
    if (!state.detailStoreId) return;
    if (state.favorites.has(state.detailStoreId)) {
      state.favorites.delete(state.detailStoreId);
    } else {
      state.favorites.add(state.detailStoreId);
    }
    saveFavorites();
    updateFavButton();
    renderFavorites();
  });

  document.getElementById('directionsBtn').addEventListener('click', () => {
    const store = STORES.find(s => s.id === state.detailStoreId);
    if (store) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`, '_blank');
    }
  });

  document.getElementById('appVersionLabel').textContent = `Version ${APP_VERSION}`;
  document.getElementById('btnCheckUpdate').addEventListener('click', checkForUpdate);
  initThemeToggle();
  initIdentityWidget();
  initAddEstablishment();
  initAnnouncementAdminWidget();

  switchView('home');
}

function applyStoredTheme() {
  const saved = localStorage.getItem('limayhub_theme');
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
  }
  document.getElementById('darkModeToggle').checked = saved === 'dark'
    || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

function initThemeToggle() {
  applyStoredTheme();
  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    const theme = e.target.checked ? 'dark' : 'light';
    localStorage.setItem('limayhub_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  });
}

async function checkForUpdate() {
  const note = document.getElementById('updateCheckNote');
  if (!('serviceWorker' in navigator)) { note.textContent = 'Updates are not supported in this browser.'; return; }
  note.textContent = 'Checking…';
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) { note.textContent = 'Update service not active yet — try reloading the page.'; return; }
    await reg.update();
    if (reg.waiting) {
      note.textContent = 'A new version is ready.';
      showUpdateBanner(reg);
    } else {
      note.textContent = "You're on the latest version.";
    }
  } catch (err) {
    note.textContent = 'Could not check for updates — check your connection.';
  }
}

document.addEventListener('DOMContentLoaded', init);

/* ============================================================
   Service worker registration + update banner
   ============================================================ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
      reg.addEventListener('updatefound', () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner(reg);
          }
        });
      });
    });
  });

  let reloadedOnce = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadedOnce) return;
    reloadedOnce = true;
    window.location.reload();
  });
}

function showUpdateBanner(reg) {
  const banner = document.getElementById('updateBanner');
  banner.hidden = false;
  document.getElementById('updateBtn').addEventListener('click', () => {
    if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
  }, { once: true });
}
