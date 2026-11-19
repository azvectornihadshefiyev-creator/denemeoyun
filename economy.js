import { scoreExpedition } from "./expeditions.js";
export const jobs = [
  ["courier", "Kuryer", "Mərkəz", 6, 0, "Mərkəzi küçələrdə sifariş daşı."],
  [
    "barista",
    "Barista",
    "Kafe rayonu",
    9,
    20,
    "Səhər növbəsini götür və fincanları hazırla.",
  ],
  [
    "mechanic",
    "Mexanik",
    "Sənaye rayonu",
    15,
    80,
    "Qarajda şəhərin maşınlarına xidmət et.",
  ],
  [
    "designer",
    "Dizayner",
    "Yaradıcı məhəllə",
    23,
    200,
    "Studiyada şəhərin brendləri üçün işlə.",
  ],
  [
    "engineer",
    "Mühəndis",
    "Texnologiya parkı",
    34,
    450,
    "Yeni enerji şəbəkəsində növbə götür.",
  ],
  [
    "director",
    "Layihə rəhbəri",
    "Maliyyə mərkəzi",
    50,
    900,
    "Şəhər layihələrinə rəhbərlik et.",
  ],
].map(([id, name, district, rate, xp, description]) => ({
  id,
  name,
  district,
  rate,
  xp,
  description,
}));

const baseCatalog = [
  [
    "home-studio",
    "Sahil studiyası",
    "Ev",
    1250,
    "Sahil",
    "Kiçik studiya və səhər işığı.",
  ],
  [
    "home-loft",
    "Mərkəz loftu",
    "Ev",
    6200,
    "Mərkəz",
    "Yüksək tavan və açıq iş sahəsi.",
  ],
  [
    "home-terrace",
    "Terraslı mənzil",
    "Ev",
    14200,
    "Bağlar",
    "Geniş terras və bağa baxış.",
  ],
  [
    "home-penthouse",
    "Panorama penthausu",
    "Ev",
    38000,
    "Maliyyə mərkəzi",
    "Şəhərə yuxarıdan baxış.",
  ],
  [
    "home-villa",
    "Sahil villası",
    "Ev",
    95000,
    "Sahil",
    "Həyət, qaraj və dəniz mənzərəsi.",
  ],
  [
    "car-hatch",
    "Şəhər hetçbeki",
    "Maşın",
    950,
    "Qaraj",
    "Kompakt gündəlik avtomobil.",
  ],
  [
    "car-classic",
    "Klassik kupe",
    "Maşın",
    4800,
    "Qaraj",
    "Retro model və krem salon.",
  ],
  [
    "car-electric",
    "Elektrik sedanı",
    "Maşın",
    12600,
    "Qaraj",
    "Sakit elektrik avtomobili.",
  ],
  [
    "car-gt",
    "Sahil GT",
    "Maşın",
    33000,
    "Qaraj",
    "Uzun səfərlər üçün idman kupe.",
  ],
  [
    "car-vista",
    "Vista 4×4",
    "Maşın",
    52000,
    "Qaraj",
    "Dağ yolu üçün tam ötürücü.",
  ],
  [
    "wear-coat",
    "Şəhər paltosu",
    "Geyim",
    180,
    "Butik",
    "Gündəlik minimal üslub.",
  ],
  [
    "wear-sneakers",
    "Mərkəz idman ayaqqabısı",
    "Geyim",
    270,
    "Butik",
    "Rahat, açıq rəngli cüt.",
  ],
  [
    "wear-jacket",
    "Studiya gödəkçəsi",
    "Geyim",
    630,
    "Butik",
    "Mövsümlük dizayner geyimi.",
  ],
  [
    "wear-suit",
    "Maliyyə kostyumu",
    "Geyim",
    1650,
    "Butik",
    "Klassik tünd kostyum.",
  ],
  [
    "wear-watch",
    "Sahil saatı",
    "Geyim",
    3400,
    "Butik",
    "Mexaniki kolleksiya saatı.",
  ],
  [
    "business-coffee",
    "Məhəllə kafesi",
    "Biznes",
    9500,
    "Kafe rayonu",
    "Şəxsi kafe · gündəlik 320 kredit.",
  ],
  [
    "business-studio",
    "Dizayn studiyası",
    "Biznes",
    23500,
    "Yaradıcı məhəllə",
    "Şəxsi studiya · gündəlik 850 kredit.",
  ],
  [
    "business-garage",
    "Təmir emalatxanası",
    "Biznes",
    42000,
    "Sənaye rayonu",
    "Şəxsi emalatxana · gündəlik 1 600 kredit.",
  ],
].map(([id, name, category, price, district, description]) => ({
  id,
  name,
  category,
  price,
  district,
  description,
}));

const carSpecs = {
  "car-hatch": [178, 104, 22, 58, "#82cdb9", "city"],
  "car-classic": [225, 72, 62, 55, "#e5af7f", "classic"],
  "car-electric": [260, 39, 71, 88, "#afafd9", "gt"],
  "car-gt": [320, 32, 76, 64, "#c889b0", "sport"],
  "car-vista": [238, 64, 83, 92, "#aad293", "suv"],
};
const advancedCars = [
  ["car-supra", "Toyota GR Supra", 278, 41, 60, 65, 26500, "#ef9f7c", "sport"],
  ["car-gtr", "Nissan GT-R", 315, 29, 65, 65, 47000, "#80c5f2", "sport"],
  [
    "car-911",
    "Porsche 911 Turbo S",
    330,
    27,
    81,
    74,
    81000,
    "#dedce6",
    "sport",
  ],
  ["car-r8", "Audi R8 V10", 331, 31, 76, 74, 73000, "#9de3da", "sport"],
  [
    "car-ferrari",
    "Ferrari 296 GTB",
    330,
    29,
    80,
    64,
    120000,
    "#ff898d",
    "hyper",
  ],
  [
    "car-revuelto",
    "Lamborghini Revuelto",
    350,
    25,
    82,
    59,
    170000,
    "#f6c774",
    "hyper",
  ],
  ["car-mclaren", "McLaren 750S", 332, 28, 75, 59, 140000, "#f4a06f", "hyper"],
  [
    "car-valkyrie",
    "Aston Martin Valkyrie",
    355,
    26,
    80,
    48,
    255000,
    "#abd293",
    "hyper",
  ],
  [
    "car-bentley",
    "Bentley Continental GT",
    335,
    32,
    93,
    94,
    175000,
    "#add3cc",
    "gt",
  ],
  [
    "car-maybach",
    "Mercedes-Maybach S 680",
    250,
    45,
    99,
    99,
    207000,
    "#b4b0c9",
    "gt",
  ],
  [
    "car-phantom",
    "Rolls-Royce Phantom",
    250,
    53,
    100,
    100,
    310000,
    "#d3c9ba",
    "gt",
  ],
  [
    "car-cullinan",
    "Rolls-Royce Cullinan",
    250,
    52,
    99,
    98,
    345000,
    "#b5c3d7",
    "suv",
  ],
  [
    "car-chiron",
    "Bugatti Chiron Super Sport",
    440,
    24,
    97,
    79,
    415000,
    "#84b8f8",
    "hyper",
  ],
  ["car-bolide", "Bugatti Bolide", 380, 22, 69, 24, 365000, "#88d7e1", "hyper"],
  [
    "car-jesko",
    "Koenigsegg Jesko Attack",
    410,
    25,
    84,
    52,
    389000,
    "#efb6dc",
    "hyper",
  ],
  ["car-gemera", "Koenigsegg Gemera", 400, 21, 92, 88, 480000, "#a1e0b2", "gt"],
  ["car-nevera", "Rimac Nevera", 412, 19, 89, 70, 390000, "#b4a0f2", "hyper"],
  [
    "car-speedtail",
    "McLaren Speedtail",
    403,
    30,
    92,
    69,
    370000,
    "#8ae0ed",
    "hyper",
  ],
].map(([id, name, speed, sprint, lux, comfort, price, color, shape]) => ({
  id,
  name,
  category: "Maşın",
  price,
  district: "Avtomobil salonu",
  description: "Şəhər qarajına əlavə et və yarış üçün təkmilləşdir.",
  spec: { speed, sprint, lux, comfort, color, shape },
}));
export const catalog = [
  ...baseCatalog.map((item) => {
    if (!carSpecs[item.id]) return item;
    const [speed, sprint, lux, comfort, color, shape] = carSpecs[item.id];
    return { ...item, spec: { speed, sprint, lux, comfort, color, shape } };
  }),
  ...advancedCars,
];
export const presenceWindow = 75;
export const carLevel = (xp) => Math.floor(xp / 25) + 1;
export function carPerformance(item, state) {
  const stage = state.upgrades?.[item.id] ?? 0;
  return {
    ...item.spec,
    stage,
    speed: item.spec.speed + stage * 9,
    sprint: Math.max(12, item.spec.sprint - stage * 2),
  };
}
export function upgradePrice(item, stage) {
  return Math.max(200, Math.floor(item.price * (0.035 + stage * 0.025)));
}
export function bestCar(state) {
  return catalog
    .filter((item) => item.spec && state.owned.includes(item.id))
    .map((item) => {
      const spec = carPerformance(item, state);
      return { item, spec, value: spec.speed * 10 - spec.sprint * 5 };
    })
    .sort((a, b) => b.value - a.value)[0];
}
const businessIncome = {
  "business-coffee": 320,
  "business-studio": 850,
  "business-garage": 1600,
};
export const day = (now) => Math.floor((now + 4 * 3600) / 86400);
export const interval = 10;
export const shiftLimit = 8 * 60 * 60;
const maximumMoney = 1_000_000_000;
const economyItemIds = new Set(catalog.map(({ id }) => id));
export function checkEconomy(state) {
  const validMoney = (value) =>
    Number.isSafeInteger(value) && value >= 0 && value <= maximumMoney;
  if (
    !validMoney(state.cash) ||
    !validMoney(state.bank) ||
    !Number.isSafeInteger(state.assetValue) ||
    state.assetValue < 0 ||
    !Array.isArray(state.owned) ||
    new Set(state.owned).size !== state.owned.length ||
    state.owned.some((id) => !economyItemIds.has(id))
  )
    throw new Error("Invalid economy state");
}
export const districts = [
  {
    id: "center",
    name: "Mərkəz",
    icon: "◆",
    target: "jobs",
    info: "İş birjası və gündəlik şəhər həyatı.",
  },
  {
    id: "shore",
    name: "Sahil",
    icon: "◒",
    target: "market",
    info: "Dəniz kənarı mənzillər və yeni əmlaklar.",
  },
  {
    id: "finance",
    name: "Maliyyə",
    icon: "▥",
    target: "vault",
    info: "Əmanət hesabı və kredit köçürmələri.",
  },
  {
    id: "garage",
    name: "Qaraj",
    icon: "▰",
    target: "garage",
    info: "Maşınlar, kolleksiya və şəxsi əmlak.",
  },
  {
    id: "cafe",
    name: "Kafe rayonu",
    icon: "◍",
    target: "desk",
    info: "Növbəyə uyğun operativ tapşırıqlar.",
  },
  {
    id: "park",
    name: "Şəhər parkı",
    icon: "✿",
    target: "goals",
    info: "Şəhər hədəfləri və yeni mərhələlər.",
  },
];
const tasks = {
  courier: [
    "Göndərişi ünvana çatdır",
    ["Bağlamanı yoxla", "Marşrutu seç", "Ünvana çatdır", "Qəbzi təsdiqlə"],
    ["Bağlamanı aç", "Marşrutu bağla"],
  ],
  barista: [
    "Səhər sifarişini hazırla",
    ["Sifarişi oxu", "Qəhvəni üyüt", "İçkini hazırla", "Fincanı təqdim et"],
    ["Sifarişi sil", "Fincanı boşalt"],
  ],
  mechanic: [
    "Qaraj yoxlaması",
    [
      "Avtomobili qəbul et",
      "Nasazlığı müəyyən et",
      "Hissəni dəyiş",
      "Yekun sınağı apar",
    ],
    ["Açarı itir", "Sınağı ləğv et"],
  ],
  designer: [
    "Şəhər afişasını hazırla",
    ["Tapşırığı oxu", "Eskizi çək", "Maketi hazırla", "Faylı təhvil ver"],
    ["Mətni sil", "Faylı bağla"],
  ],
  engineer: [
    "Şəbəkəni yoxla",
    ["Ölçünü götür", "Nasazlığı tap", "Parametri dəyiş", "Sınağı qeyd et"],
    ["Ölçünü sil", "Şəbəkəni bağla"],
  ],
  director: [
    "Layihəni təhvil ver",
    [
      "Hədəfi müəyyən et",
      "Komandanı bölüşdür",
      "Nəticəni yoxla",
      "Layihəni təhvil ver",
    ],
    ["Büdcəni sil", "Planı at"],
  ],
};
function shuffled(values) {
  const items = [...values];
  for (let i = items.length - 1; i > 0; i--) {
    const value = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [items[i], items[value]] = [items[value], items[i]];
  }
  return items;
}
export function cityProgress(state, now) {
  const work = state.cityTask;
  const live = work && work.expires > now && state.active?.job === work.job;
  return {
    districts,
    visited: state.visited ?? [],
    task: live
      ? {
          id: work.id,
          title: work.title,
          choices: work.choices,
          expires: work.expires,
        }
      : null,
    readyAt: state.taskReadyAt ?? 0,
    completed: state.taskDay === day(now) ? state.taskCount : 0,
    limit: 8,
  };
}
const milestones = [
  ["first-shift", "İlk növbə", "10 XP topla.", 10, 80, (s) => s.xp],
  [
    "first-item",
    "Şəhərdə ilk alış",
    "Mağazadan bir əşya al.",
    1,
    120,
    (s) => s.owned.length,
  ],
  [
    "bank-500",
    "Ehtiyat fondu",
    "Bankda 500 kredit saxla.",
    500,
    200,
    (s) => s.bank,
  ],
  [
    "first-home",
    "Öz açarın",
    "Şəxsi ev al.",
    1,
    350,
    (s) => s.owned.filter((id) => id.startsWith("home-")).length,
  ],
  [
    "first-car",
    "Qarajı aç",
    "Bir maşın al.",
    1,
    260,
    (s) => s.owned.filter((id) => id.startsWith("car-")).length,
  ],
  [
    "wardrobe",
    "Şəhər tərzi",
    "Üç geyim və ya aksesuar topla.",
    3,
    460,
    (s) => s.owned.filter((id) => id.startsWith("wear-")).length,
  ],
  ["professional", "Peşəkar", "200 XP topla.", 200, 750, (s) => s.xp],
  [
    "business-owner",
    "Sahibkar",
    "Şəxsi biznes al.",
    1,
    1800,
    (s) => s.owned.filter((id) => id.startsWith("business-")).length,
  ],
  [
    "diversified",
    "Geniş portfel",
    "Əmlak dəyərini 25 000 kreditə çatdır.",
    25000,
    3000,
    (s) => s.assetValue,
  ],
  [
    "city-veteran",
    "Şəhər veteranı",
    "1 200 XP topla.",
    1200,
    5000,
    (s) => s.xp,
  ],
];
export function goals(state) {
  return milestones.map(([id, name, description, target, reward, measure]) => ({
    id,
    name,
    description,
    target,
    reward,
    progress: Math.min(target, measure(state)),
    claimed: state.claimed?.includes(id) ?? false,
  }));
}
export const cityProjects = [
  {
    id: "garden",
    name: "Dam bağları",
    description: "Şəhərin damlarını ictimai bağlara çevir.",
    level: 5,
    costs: [35000, 65000, 125000],
  },
  {
    id: "observatory",
    name: "Rəsədxana",
    description: "Təpədə teleskop və müşahidə meydançası qur.",
    level: 10,
    costs: [75000, 150000, 300000],
  },
  {
    id: "marina",
    name: "Sahil limanı",
    description: "Sahil boyunca yeni yanalma və gəzinti zonası yarat.",
    level: 15,
    costs: [140000, 260000, 500000],
  },
  {
    id: "museum",
    name: "Şəhər muzeyi",
    description: "Şəhərin tarixini daimi sərgidə topla.",
    level: 20,
    costs: [220000, 400000, 800000],
  },
];

const operationsCatalog = [
  {
    id: "baker",
    title: "Səhər çörəyi",
    district: "Mərkəz",
    brief: "Çörək sifarişini səhər bazarına çatdır.",
    cost: 0,
    payout: 90,
    seconds: 45,
    reputation: 1,
    xp: 3,
    level: 1,
  },
  {
    id: "books",
    title: "Kitabxana arxivi",
    district: "Bağlar",
    brief: "Yeni kitabları zədələnmədən məhəllə kitabxanasına təhvil ver.",
    cost: 50,
    payout: 205,
    seconds: 90,
    reputation: 2,
    xp: 5,
    level: 1,
  },
  {
    id: "cafe",
    title: "Kafe təchizatı",
    district: "Kafe rayonu",
    brief: "Məhəllə kafelərinə həftəlik təchizat payla.",
    cost: 125,
    payout: 340,
    seconds: 150,
    reputation: 3,
    xp: 7,
    level: 2,
  },
  {
    id: "lights",
    title: "Sahil işıqları",
    district: "Sahil",
    brief: "Bulvarın işıqlandırılması üçün ehtiyat avadanlıq gətir.",
    cost: 240,
    payout: 550,
    seconds: 210,
    reputation: 4,
    xp: 10,
    level: 3,
  },
  {
    id: "parts",
    title: "Qaraj ehtiyatı",
    district: "Qaraj",
    brief: "Təmir emalatxanasına hissə və diaqnostika avadanlığı gətir.",
    cost: 440,
    payout: 920,
    seconds: 300,
    reputation: 5,
    xp: 14,
    level: 5,
  },
  {
    id: "exhibit",
    title: "Səyahət edən sərgi",
    district: "Şəhər parkı",
    brief: "Şəhər parkındakı sərgi üçün eksponatları hazırla.",
    cost: 750,
    payout: 1460,
    seconds: 450,
    reputation: 7,
    xp: 20,
    level: 8,
  },
  {
    id: "solar",
    title: "Günəş şəbəkəsi",
    district: "Texnologiya parkı",
    brief: "Yeni enerji avadanlığını quraşdırma briqadasına çatdır.",
    cost: 1350,
    payout: 2380,
    seconds: 600,
    reputation: 9,
    xp: 28,
    level: 12,
  },
  {
    id: "harbor",
    title: "Limanın açılışı",
    district: "Sahil limanı",
    brief: "Limanın açılışından əvvəl son təchizat karvanını koordinasiya et.",
    cost: 2600,
    payout: 4150,
    seconds: 900,
    reputation: 12,
    xp: 35,
    level: 18,
  },
];
const operationPlans = [
  { id: "standard", name: "Standart", cost: 0, timePercent: 100, bonus: 0 },
  { id: "express", name: "Ekspres", cost: 30, timePercent: 60, bonus: 0 },
  { id: "careful", name: "Planlı", cost: 0, timePercent: 150, bonus: 25 },
];

export function operationsView(state, now) {
  const today = day(now);
  const history = state.operations ?? {};
  const reputation = history.reputation ?? 0;
  const rotation = ((today % 3) + 3) % 3;
  return {
    day: today,
    openSlots: reputation >= 18 ? 2 : 1,
    rank:
      reputation >= 60
        ? "Şəhər koordinatoru"
        : reputation >= 18
          ? "Dispetçer"
          : "İcraçı",
    reputation,
    completed: history.completed ?? 0,
    net: history.net ?? 0,
    queue: history.queue ?? [],
    recent: history.recent ?? [],
    offers: operationsCatalog
      .filter((_, index) => index < 2 || (index - 2) % 3 === rotation)
      .map((offer) => ({
        ...offer,
        accepted:
          history.offerDay === today && history.accepted.includes(offer.id),
        plans: operationPlans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          cost: offer.cost + plan.cost,
          payout:
            offer.payout +
            Math.floor(((offer.payout - offer.cost) * plan.bonus) / 100),
          seconds: Math.ceil((offer.seconds * plan.timePercent) / 100),
        })),
      })),
  };
}

function applyOperation(state, action, now) {
  const view = operationsView(state, now);
  const history = (state.operations ??= {
    queue: [],
    recent: [],
    reputation: 0,
    completed: 0,
    net: 0,
  });
  if (action.type === "operation-start") {
    requireThat(
      action.day === view.day,
      "Şəhər lövhəsi yenilənib. Sifarişləri yenilə.",
    );
    const offer = view.offers.find(({ id }) => id === action.offer);
    const plan = offer?.plans.find(({ id }) => id === action.plan);
    requireThat(
      plan && !offer.accepted,
      "Bu sifariş artıq qəbul edilib və ya lövhədə yoxdur.",
    );
    requireThat(
      carLevel(state.xp) >= offer.level,
      "Sifariş üçün səviyyən çatmır.",
    );
    requireThat(
      history.queue.length < view.openSlots,
      "Əvvəl açıq sifarişlərdən birini tamamla.",
    );
    requireThat(
      state.cash >= plan.cost,
      "Cüzdanda sifariş xərci üçün kredit çatmır.",
    );
    if (history.offerDay !== view.day) {
      history.offerDay = view.day;
      history.accepted = [];
    }
    state.cash -= plan.cost;
    history.accepted.push(offer.id);
    history.queue.push({
      id: action.requestId,
      title: offer.title,
      district: offer.district,
      plan: plan.name,
      started: now,
      ends: now + plan.seconds,
      cost: plan.cost,
      payout: plan.payout,
      xp: offer.xp,
      reputation: offer.reputation,
    });
    return "Sifariş qəbul edildi · " + offer.title;
  }

  const order = history.queue.find(({ id }) => id === action.order);
  requireThat(
    order && now >= order.ends,
    "Sifariş hələ hazır deyil və ya artıq təhvil verilib.",
  );
  requireThat(
    state.cash + order.payout <= maximumMoney,
    "Mükafat üçün cüzdanda yer aç.",
  );
  state.cash += order.payout;
  state.xp += order.xp;
  history.reputation += order.reputation;
  history.completed++;
  const net = order.payout - order.cost;
  history.net += net;
  history.queue = history.queue.filter(({ id }) => id !== order.id);
  history.recent = [
    { title: order.title, plan: order.plan, net, at: now },
    ...history.recent,
  ].slice(0, 8);
  return (
    "Sifariş təhvil verildi · " + order.title + " · " + order.payout + " kredit"
  );
}

export const newPlayer = () => ({
  cash: 300,
  bank: 0,
  xp: 0,
  assetValue: 0,
  owned: [],
  active: null,
  history: {},
  daily: null,
  claimed: [],
  businessDay: {},
  preferred: { Ev: null, Maşın: null, Geyim: null },
});

export class RuleError extends Error {}
const requireThat = (condition, message) => {
  if (!condition) throw new RuleError(message);
};
export function pending(state, now) {
  if (!state.active) return { ticks: 0, income: 0 };
  const ticks = Math.max(
    0,
    Math.floor(
      (Math.min(
        now,
        state.active.started + shiftLimit,
        state.active.onlineUntil ?? state.active.paid,
      ) -
        state.active.paid) /
        interval,
    ),
  );
  return { ticks, income: ticks * state.active.rate };
}
export function settle(state, now) {
  const result = pending(state, now);
  if (!state.active) return 0;
  const { job, started } = state.active;
  if (result.ticks) {
    state.cash = Math.min(maximumMoney, state.cash + result.income);
    state.xp += result.ticks;
    state.history[job] = (state.history[job] ?? 0) + result.income;
    state.active.paid += result.ticks * interval;
  }
  if (
    now - started >= shiftLimit ||
    now >= (state.active.onlineUntil ?? state.active.paid)
  )
    state.active = null;
  return result.income;
}
export function stateView(state, now) {
  const view = structuredClone(state);
  settle(view, now);
  return view;
}
const amountIsValid = (n) =>
  Number.isSafeInteger(n) && n > 0 && n <= 10_000_000;
export function apply(state, action, now) {
  settle(state, now);
  let label;
  const item = catalog.find(({ id }) => id === action.item);
  switch (action.type) {
    case "expedition-finish": {
      label = scoreExpedition(state, action, now);
      requireThat(
        label,
        "Marşrutu, açıq missiyanı və ya əvvəlki rekordunu yoxla.",
      );
      break;
    }
    case "operation-start":
    case "operation-claim":
      return applyOperation(state, action, now);
    case "city-project": {
      const project = cityProjects.find(({ id }) => id === action.project);
      requireThat(project, "Layihə tapılmadı.");
      const stage = state.projects?.[project.id] ?? 0;
      const price = project.costs[stage];
      requireThat(price, "Layihə artıq tamamlanıb.");
      requireThat(action.stage === stage, "Layihənin mərhələsi dəyişib.");
      requireThat(
        carLevel(state.xp) >= project.level,
        "Bu layihə üçün səviyyən çatmır.",
      );
      requireThat(state.cash >= price, "Cüzdanda kifayət qədər kredit yoxdur.");
      state.cash -= price;
      state.projects ??= {};
      state.projects[project.id] = stage + 1;
      label = project.name + " · mərhələ " + (stage + 1);
      break;
    }
    case "car-upgrade": {
      requireThat(
        item?.spec && state.owned.includes(item.id),
        "Bu maşın sənin deyil.",
      );
      const stage = state.upgrades?.[item.id] ?? 0;
      requireThat(stage < 4, "Bu maşın maksimum mərhələdədir.");
      requireThat(
        carLevel(state.xp) >= (stage + 1) * 5,
        "Lazım olan səviyyə: " + (stage + 1) * 5 + ".",
      );
      const fee = upgradePrice(item, stage);
      requireThat(state.cash >= fee, "Cüzdanda kifayət qədər kredit yoxdur.");
      state.upgrades ??= {};
      state.upgrades[item.id] = stage + 1;
      state.cash -= fee;
      label = "Maşın təkmilləşdi · " + item.name + " · " + (stage + 1) + "/4";
      break;
    }
    case "visit": {
      const district = districts.find(({ id }) => id === action.district);
      requireThat(district, "Bu məhəllə tapılmadı.");
      state.visited ??= [];
      requireThat(
        !state.visited.includes(district.id),
        "Bu məhəllə artıq pasportundadır.",
      );
      state.visited.push(district.id);
      label = "Məhəllə kəşf edildi · " + district.name;
      break;
    }
    case "task-start": {
      const task = tasks[state.active?.job];
      requireThat(
        task && now - state.active.started >= 10,
        "Ən azı 10 saniyə aktiv növbədə ol.",
      );
      const progress = cityProgress(state, now);
      requireThat(!progress.task, "Mövcud tapşırığı tamamla.");
      requireThat(
        progress.completed < progress.limit && now >= progress.readyAt,
        "Yeni tapşırıq hələ hazır deyil.",
      );
      const [title, steps, decoys] = task;
      const choices = shuffled([...steps, ...decoys]);
      state.cityTask = {
        id: crypto.randomUUID(),
        job: state.active.job,
        title,
        choices,
        answer: steps.map((step) => choices.indexOf(step)),
        start: now,
        expires: now + 90,
      };
      state.taskReadyAt = now + 25;
      label = "Tapşırıq götürüldü · " + title;
      break;
    }
    case "task-finish": {
      const task = state.cityTask;
      requireThat(
        task && cityProgress(state, now).task?.id === action.task,
        "Bu tapşırıq bitib və ya artıq işlənib.",
      );
      requireThat(
        now >= task.start + 3,
        "Tapşırığı tamamlamaq üçün bir neçə saniyə keçməlidir.",
      );
      requireThat(
        Array.isArray(action.steps) &&
          action.steps.length === task.answer.length &&
          action.steps.every((step) => Number.isInteger(step)) &&
          new Set(action.steps).size === task.answer.length &&
          action.steps.every((step) => step >= 0 && step < task.choices.length),
        "Dörd fərqli addım seç.",
      );
      state.cityTask = null;
      const correct = task.answer.every(
        (step, index) => action.steps[index] === step,
      );
      if (correct) {
        if (state.taskDay !== day(now)) {
          state.taskDay = day(now);
          state.taskCount = 0;
        }
        state.taskCount += 1;
        state.cash = Math.min(maximumMoney, state.cash + state.active.rate * 5);
        state.xp += 3;
      }
      label = correct
        ? "Tapşırıq tamamlandı · " + state.active.rate * 5 + " kredit və 3 XP"
        : "Addım sırası yanlışdır · tapşırıq bağlandı";
      break;
    }
    case "work-start": {
      const job = jobs.find(({ id }) => id === action.job);
      requireThat(job && state.xp >= job.xp, "Bu iş üçün təcrübən çatmır.");
      requireThat(!state.active, "Əvvəl hazırkı növbəni dayandır.");
      state.active = {
        job: job.id,
        rate: job.rate,
        started: now,
        paid: now,
        onlineUntil: now + presenceWindow,
      };
      label = job.name + " növbəsi başladı";
      break;
    }
    case "work-stop":
      requireThat(state.active, "Aktiv növbə yoxdur.");
      state.active = null;
      state.cityTask = null;
      label = "Növbə dayandırıldı";
      break;
    case "deposit":
    case "withdraw": {
      const [from, to] =
        action.type === "deposit" ? ["cash", "bank"] : ["bank", "cash"];
      requireThat(amountIsValid(action.amount), "Məbləği tam kreditlə yaz.");
      requireThat(
        state[from] >= action.amount &&
          state[to] + action.amount <= maximumMoney,
        "Bu məbləği köçürmək mümkün deyil.",
      );
      state[from] -= action.amount;
      state[to] += action.amount;
      label =
        (action.type === "deposit"
          ? "Banka yatırıldı · "
          : "Bankdan çıxarıldı · ") + action.amount;
      break;
    }
    case "buy":
      requireThat(
        item && !state.owned.includes(item.id),
        "Bu əşyanı almaq mümkün deyil.",
      );
      requireThat(
        state.cash >= item.price,
        "Cüzdanda kifayət qədər kredit yoxdur.",
      );
      state.cash -= item.price;
      grantItem(state, item, now);
      label = "Alındı · " + item.name;
      break;
    case "sell":
      requireThat(
        item && state.owned.includes(item.id),
        "Bu əşya sənin deyil.",
      );
      requireThat(
        state.cash + Math.floor(item.price * 0.65) <= maximumMoney,
        "Cüzdan limiti dolub.",
      );
      state.cash += Math.floor(item.price * 0.65);
      state.assetValue -= item.price;
      state.owned = state.owned.filter((id) => id !== item.id);
      if (state.upgrades) delete state.upgrades[item.id];
      if (state.preferred[item.category] === item.id)
        state.preferred[item.category] = null;
      label = "Satıldı · " + item.name;
      break;
    case "equip":
      requireThat(
        item &&
          state.owned.includes(item.id) &&
          Object.hasOwn(state.preferred, item.category),
        "Bu əşyanı aktiv seçmək mümkün deyil.",
      );
      state.preferred[item.category] = item.id;
      label = "Aktiv seçildi · " + item.name;
      break;
    case "goal": {
      const goal = goals(state).find(({ id }) => id === action.goal);
      requireThat(
        goal && !goal.claimed && goal.progress >= goal.target,
        "Bu hədəfin mükafatı hazır deyil.",
      );
      state.claimed ??= [];
      state.claimed.push(goal.id);
      state.cash = Math.min(maximumMoney, state.cash + goal.reward);
      label = "Hədəf mükafatı · " + goal.name;
      break;
    }
    case "daily":
      requireThat(state.daily !== day(now), "Bugünkü mükafat artıq götürülüb.");
      state.daily = day(now);
      state.cash = Math.min(maximumMoney, state.cash + 150);
      label = "Gündəlik giriş · 150 kredit";
      break;
    case "business":
      requireThat(
        item &&
          state.owned.includes(item.id) &&
          Object.hasOwn(businessIncome, item.id),
        "Bu biznes sənin deyil.",
      );
      requireThat(
        state.businessDay[item.id] !== day(now),
        "Bugünkü biznes gəliri artıq götürülüb.",
      );
      const earning =
        businessIncome[item.id] *
        Math.min(
          7,
          Math.max(1, day(now) - (state.businessDay[item.id] ?? day(now) - 1)),
        );
      state.cash = Math.min(maximumMoney, state.cash + earning);
      state.businessDay[item.id] = day(now);
      label = "Biznes gəliri · " + item.name;
      break;
    default:
      throw new RuleError("Əməliyyat tanınmadı.");
  }
  return label;
}
export function adjust(state, delta, now) {
  settle(state, now);
  requireThat(
    Number.isSafeInteger(delta) && amountIsValid(Math.abs(delta)),
    "Admin məbləği etibarsızdır.",
  );
  requireThat(
    state.cash + delta >= 0 && state.cash + delta <= maximumMoney,
    "Nəticə cüzdan limitindən kənardır.",
  );
  state.cash += delta;
}

function grantItem(state, item, now) {
  state.assetValue += item.price;
  state.owned.push(item.id);
  if (Object.hasOwn(businessIncome, item.id))
    state.businessDay[item.id] = day(now) - 1;
}
export function giftItem(state, assetId, now) {
  settle(state, now);
  const item = catalog.find(({ id }) => id === assetId);
  requireThat(
    item && !state.owned.includes(item.id),
    "Bu əşyanı hədiyyə etmək mümkün deyil.",
  );
  grantItem(state, item, now);
  return item.name;
}
