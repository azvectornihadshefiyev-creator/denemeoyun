// economy.js
const jobs = [
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
const catalog = [
  ...baseCatalog.map((item) => {
    if (!carSpecs[item.id]) return item;
    const [speed, sprint, lux, comfort, color, shape] = carSpecs[item.id];
    return { ...item, spec: { speed, sprint, lux, comfort, color, shape } };
  }),
  ...advancedCars,
];
const presenceWindow = 75;
const carLevel = (xp) => Math.floor(xp / 25) + 1;
function carPerformance(item, state) {
  const stage = state.upgrades?.[item.id] ?? 0;
  return {
    ...item.spec,
    stage,
    speed: item.spec.speed + stage * 9,
    sprint: Math.max(12, item.spec.sprint - stage * 2),
  };
}
function upgradePrice(item, stage) {
  return Math.max(200, Math.floor(item.price * (0.035 + stage * 0.025)));
}
function bestCar(state) {
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
const day = (now) => Math.floor((now + 4 * 3600) / 86400);
const interval = 10;
const shiftLimit = 8 * 60 * 60;
const maximumMoney = 1_000_000_000;
const districts = [
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
function cityProgress(state, now) {
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
function goals(state) {
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
const cityProjects = [
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

const newPlayer = () => ({
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

class RuleError extends Error {}
const requireThat = (condition, message) => {
  if (!condition) throw new RuleError(message);
};
function pending(state, now) {
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
function settle(state, now) {
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
function stateView(state, now) {
  const view = structuredClone(state);
  settle(view, now);
  return view;
}
const amountIsValid = (n) =>
  Number.isSafeInteger(n) && n > 0 && n <= 10_000_000;
function apply(state, action, now) {
  settle(state, now);
  let label;
  const item = catalog.find(({ id }) => id === action.item);
  switch (action.type) {
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
function adjust(state, delta, now) {
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
function giftItem(state, assetId, now) {
  settle(state, now);
  const item = catalog.find(({ id }) => id === assetId);
  requireThat(
    item && !state.owned.includes(item.id),
    "Bu əşyanı hədiyyə etmək mümkün deyil.",
  );
  grantItem(state, item, now);
  return item.name;
}

// demo-api.js

const key = "obsidian-city-demo-v2";
const originalKey = "obsidian-city-github-demo";
const originalItems = [
  "home-studio",
  "home-loft",
  "home-terrace",
  "home-villa",
  "car-hatch",
  "car-classic",
  "car-electric",
  "car-gt",
  "wear-coat",
  "wear-sneakers",
  "wear-jacket",
  "wear-suit",
  "business-coffee",
  "business-studio",
  "business-garage",
  "home-penthouse",
  "car-vista",
  "wear-watch",
  "car-supra",
  "car-gtr",
  "car-911",
  "car-r8",
  "car-ferrari",
  "car-revuelto",
  "car-mclaren",
  "car-valkyrie",
  "car-bentley",
  "car-maybach",
  "car-phantom",
  "car-cullinan",
  "car-chiron",
  "car-bolide",
  "car-jesko",
  "car-gemera",
  "car-nevera",
  "car-speedtail",
];
let memory;
const json = (value, status = 200) => Response.json(value, { status });
const validAmount = (value) =>
  Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000_000;
function migrate(old) {
  if (
    typeof old?.name !== "string" ||
    !validAmount(old.cash) ||
    !validAmount(old.bank) ||
    !validAmount(old.xp)
  )
    return null;
  const owned = [
    ...new Set(
      (Array.isArray(old.owned) ? old.owned : [])
        .map((index) => originalItems[index])
        .filter(Boolean),
    ),
  ];
  const state = {
    ...newPlayer(),
    cash: old.cash,
    bank: old.bank,
    xp: old.xp,
    owned,
    assetValue: catalog
      .filter((item) => owned.includes(item.id))
      .reduce((total, item) => total + item.price, 0),
  };
  if (Number.isSafeInteger(old.daily)) state.daily = old.daily;
  for (const [index, id] of originalItems.entries()) {
    if (
      id.startsWith("business-") &&
      Number.isSafeInteger(old.business?.[index])
    )
      state.businessDay[id] = old.business[index];
  }
  const shift = old.shift;
  if (
    Number.isInteger(shift?.job) &&
    jobs[shift.job] &&
    Number.isSafeInteger(shift.start) &&
    Number.isSafeInteger(shift.paid) &&
    shift.paid >= shift.start &&
    shift.paid <= shift.start + shiftLimit * 1000
  ) {
    state.active = {
      job: jobs[shift.job].id,
      rate: jobs[shift.job].rate,
      started: Math.floor(shift.start / 1000),
      paid: Math.floor(shift.paid / 1000),
    };
  }
  state.upgrades = Object.fromEntries(
    Object.entries(old.upgrades ?? {}).flatMap(([index, stage]) => {
      const id = originalItems[index];
      return owned.includes(id) && id.startsWith("car-") &&
        Number.isInteger(stage) && stage >= 1 && stage <= 4 ? [[id, stage]] : [];
    }),
  );
  for (const category of Object.keys(state.preferred)) {
    const id = originalItems[old.equipped?.[category]];
    if (owned.includes(id) && catalog.find((item) => item.id === id)?.category === category)
      state.preferred[category] = id;
  }
  state.visited = Array.isArray(old.visited)
    ? [...new Set(old.visited.map((id) => id === "bank" ? "finance" : id))]
    : [];
  const activity = Array.isArray(old.history)
    ? old.history.filter(({ text, time }) => typeof text === "string" && Number.isFinite(time))
      .slice(0, 18).map(({ text, time }) => ({ label: text, at: Math.floor(time / 1000) }))
    : [];
  const profile = {
    bio: typeof old.cityProfile?.bio === "string" ? old.cityProfile.bio.slice(0, 160) : "",
    emblem: typeof old.cityProfile?.emblem === "string" ? old.cityProfile.emblem : "◆",
  };
  return { nickname: old.name, state, profile, activity };
}
function write(record) {
  memory = record;
  try {
    localStorage.setItem(key, JSON.stringify(record));
  } catch {}
}
function read() {
  try {
    const record = JSON.parse(localStorage.getItem(key) ?? "null");
    if (record?.state) return record;
    if (memory) return memory;
    const previous = JSON.parse(
      localStorage.getItem("obsidian-city-demo-v1") ?? "null",
    );
    const migrated = previous?.state
      ? previous
      : migrate(JSON.parse(localStorage.getItem(originalKey) ?? "null"));
    if (migrated) write(migrated);
    return migrated;
  } catch {
    return memory;
  }
}
function response(record, now) {
  const current = record ? stateView(record.state, now) : null;
  return {
    player: current
      ? Object.fromEntries(
          Object.entries(current).filter(([key]) => key !== "cityTask"),
        )
      : null,
    city: current ? cityProgress(current, now) : null,
    level: current ? carLevel(current.xp) : 1,
    goals: current ? goals(current) : [],
    nickname: record?.nickname ?? null,
    profile: record?.profile ?? null,
    activity: record?.activity ?? [],
    time: now,
    day: day(now),
    admin: false,
    accountId: "Brauzer demosu",
    jobs,
    catalog,
    cityProjects,
    interval,
    shiftLimit,
  };
}
async function demoFetch(path, options = {}) {
  const now = Math.floor(Date.now() / 1000);
  let record = read();
  if (path === "/api/me") return json(response(record, now));
  if (path.startsWith("/api/ranking")) {
    if (!record) return json({ players: [] });
    const term = new URL(path, "https://demo.test").searchParams
      .get("q")
      ?.trim()
      .toLocaleLowerCase("az");
    if (term && !record.nickname.toLocaleLowerCase("az").includes(term))
      return json({ players: [] });
    const player = stateView(record.state, now);
    return json({
      players: [
        {
          nickname: record.nickname,
          rank: 1,
          mine: true,
          wealth: player.cash + player.bank + player.assetValue,
          xp: player.xp,
          assets: player.owned.length,
          emblem: record.profile?.emblem,
        },
      ],
    });
  }
  if (path.startsWith("/api/portfolio?") && record) {
    return json({
      nickname: record.nickname,
      ...record.profile,
      items: catalog.filter((item) => record.state.owned.includes(item.id)),
    });
  }
  if (options.method !== "POST")
    return json({ error: "Bölmə tapılmadı." }, 404);
  const payload = JSON.parse(options.body);
  if (path === "/api/profile") {
    const nickname = String(payload.nickname ?? "")
      .trim()
      .normalize("NFC");
    if (!/^[\p{L}\p{N}_-]{3,22}$/u.test(nickname))
      return json(
        { error: "Ləqəb 3–22 hərf və ya rəqəmdən ibarət olmalıdır." },
        400,
      );
    if (!record)
      write((record = { nickname, state: newPlayer(), activity: [] }));
    return json(response(record, now));
  }
  if (path === "/api/profile/update" && record) {
    const nickname = String(payload.nickname ?? "")
      .trim()
      .normalize("NFC");
    if (!/^[\p{L}\p{N}_-]{3,22}$/u.test(nickname))
      return json({ error: "Ləqəb 3–22 simvol olmalıdır." }, 400);
    record.nickname = nickname;
    record.profile = {
      bio: String(payload.bio ?? "").slice(0, 160),
      emblem: String(payload.emblem ?? "◆").slice(0, 3),
    };
    write(record);
    return json(response(record, now));
  }
  if (path === "/api/work/presence" && record) {
    const shift = record.state.active;
    if (shift?.onlineUntil > now && now < shift.started + shiftLimit) {
      shift.onlineUntil = now + 75;
      write(record);
    }
    return json({ ok: true });
  }
  if (path !== "/api/actions" || !record)
    return json({ error: "Bu əməliyyat demoda əlçatan deyil." }, 403);
  try {
    const next = structuredClone(record);
    const label = apply(next.state, payload, now);
    next.activity = [{ label, at: now }, ...next.activity].slice(0, 20);
    write(next);
    return json(response(next, now));
  } catch (error) {
    if (error instanceof RuleError) return json({ error: error.message }, 400);
    throw error;
  }
}

// map.js
const spots = {
  center: [354, 206],
  shore: [585, 293],
  finance: [520, 105],
  garage: [148, 288],
  cafe: [199, 115],
  park: [337, 345],
};
const roads = [
  [
    [75, 112],
    [643, 112],
  ],
  [
    [74, 205],
    [655, 205],
  ],
  [
    [83, 292],
    [645, 292],
  ],
  [
    [146, 58],
    [146, 349],
  ],
  [
    [351, 57],
    [351, 370],
  ],
  [
    [521, 58],
    [521, 347],
  ],
];
const blocks = [
  [115, 77, 44, 13],
  [181, 66, 63, 30],
  [263, 70, 57, 28],
  [384, 70, 84, 29],
  [551, 68, 70, 29],
  [94, 140, 34, 45],
  [175, 145, 56, 38],
  [252, 135, 70, 53],
  [380, 135, 74, 44],
  [549, 135, 55, 41],
  [88, 230, 35, 41],
  [171, 231, 61, 39],
  [260, 232, 60, 46],
  [379, 228, 44, 46],
  [448, 234, 44, 43],
  [556, 232, 63, 49],
  [184, 318, 57, 43],
  [390, 320, 76, 45],
];
function cityMap(canvas, onArrival) {
  const ctx = canvas.getContext("2d");
  let districts = [];
  let visited = [];
  let position = [...spots.center];
  let destination = [...position];
  let frame = 0,
    last = 0,
    near;
  const quiet = matchMedia("(prefers-reduced-motion: reduce)");
  function paint() {
    if (!ctx) return;
    ctx.clearRect(0, 0, 720, 420);
    ctx.fillStyle = "#12232b";
    ctx.fillRect(0, 0, 720, 420);
    ctx.fillStyle = "#173e48";
    ctx.beginPath();
    ctx.moveTo(660, 0);
    ctx.lineTo(720, 0);
    ctx.lineTo(720, 420);
    ctx.lineTo(493, 420);
    ctx.lineTo(650, 337);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#293e46";
    ctx.lineCap = "round";
    for (const [[a, b], [c, d]] of roads) {
      ctx.beginPath();
      ctx.moveTo(a, b);
      ctx.lineTo(c, d);
      ctx.stroke();
    }
    for (const [x, y, w, h] of blocks) {
      ctx.fillStyle = "#253945";
      ctx.fillRect(x + 5, y + 5, w, h);
      ctx.fillStyle = "#36545e";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#658085";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    }
    ctx.fillStyle = "#264c3e";
    ctx.fillRect(278, 315, 122, 65);
    for (const district of districts) {
      const [x, y] = spots[district.id];
      ctx.fillStyle = visited.includes(district.id) ? "#a6f3c8" : "#fdd096";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "600 17px system-ui";
      ctx.textAlign = "center";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#12232b";
      ctx.strokeText(district.name, x, y - 17);
      ctx.fillStyle = "#f5faf6";
      ctx.fillText(district.name, x, y - 17);
    }
    ctx.strokeStyle = "#d5fff1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(position[0], position[1], 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#78dcff";
    ctx.beginPath();
    ctx.arc(position[0], position[1], 5, 0, Math.PI * 2);
    ctx.fill();
  }
  function report() {
    const current = districts.find(
      (district) =>
        Math.hypot(
          position[0] - spots[district.id][0],
          position[1] - spots[district.id][1],
        ) <= 18,
    );
    if (current?.id !== near) {
      near = current?.id;
      onArrival(current);
    }
  }
  function animate(now) {
    const [dx, dy] = [
      destination[0] - position[0],
      destination[1] - position[1],
    ];
    const distance = Math.hypot(dx, dy);
    const jump = Math.min(
      distance,
      Math.max(1, Math.min(40, last ? now - last : 16) * 0.46),
    );
    if (distance > 0)
      position = [
        position[0] + (dx * jump) / distance,
        position[1] + (dy * jump) / distance,
      ];
    last = now;
    paint();
    report();
    if (distance > jump) frame = requestAnimationFrame(animate);
    else {
      frame = 0;
      last = 0;
    }
  }
  function move(x, y) {
    destination = [
      Math.max(18, Math.min(702, x)),
      Math.max(18, Math.min(402, y)),
    ];
    if (quiet.matches || canvas.hidden) {
      position = [...destination];
      paint();
      report();
    } else if (!frame) frame = requestAnimationFrame(animate);
  }
  canvas.addEventListener("click", (event) => {
    const bounds = canvas.getBoundingClientRect();
    move(
      ((event.clientX - bounds.left) / bounds.width) * 720,
      ((event.clientY - bounds.top) / bounds.height) * 420,
    );
  });
  canvas.addEventListener("keydown", (event) => {
    const step = {
      ArrowLeft: [-24, 0],
      ArrowRight: [24, 0],
      ArrowUp: [0, -24],
      ArrowDown: [0, 24],
    }[event.key];
    if (!step) return;
    event.preventDefault();
    move(destination[0] + step[0], destination[1] + step[1]);
  });
  return {
    sync(next, stamps) {
      districts = next;
      visited = stamps;
      paint();
      report();
    },
    go(id) {
      if (spots[id]) move(...spots[id]);
    },
  };
}

// racing.js
const svgNS = "http://www.w3.org/2000/svg";
const roof = {
  city: "M18 67 L28 53 L47 48 L69 25 Q109 18 143 28 L166 48 L194 53 L207 66 L207 80 H18Z",
  classic:
    "M15 67 L24 53 L60 48 L85 26 L133 26 L161 48 L200 54 L210 67 L208 80 H15Z",
  gt: "M16 69 L27 55 L51 50 L77 27 Q108 19 142 25 L172 50 L204 55 L214 68 L209 80 H16Z",
  sport:
    "M13 72 L25 57 L53 52 L81 31 Q108 20 138 28 L173 51 L202 55 L215 69 L209 80 H13Z",
  hyper:
    "M10 73 L28 59 L64 53 L88 34 Q112 24 140 32 L177 55 L199 58 L212 47 L215 72 L209 81 H10Z",
  suv: "M13 67 L23 46 L52 42 L65 19 H144 L170 43 L205 49 L213 66 L209 80 H13Z",
};
function vehicleDrawing(spec = {}) {
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 226 108");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("car-vector");
  function add(tag, values) {
    const shape = document.createElementNS(svgNS, tag);
    for (const [key, value] of Object.entries(values))
      shape.setAttribute(key, value);
    svg.append(shape);
  }
  add("ellipse", {
    cx: 113,
    cy: 92,
    rx: 98,
    ry: 8,
    fill: "#071419",
    opacity: 0.7,
  });
  add("path", {
    d: roof[spec.shape] ?? roof.sport,
    fill: spec.color ?? "#a8d6e7",
    stroke: "#f6fffd",
    "stroke-opacity": 0.64,
    "stroke-width": 1.6,
  });
  add("path", {
    d: "M72 48 Q102 22 140 37 L156 49Z",
    fill: "#142731",
    opacity: 0.88,
  });
  add("path", {
    d: "M26 65 Q96 54 199 66 L205 72 H23Z",
    fill: "#151e25",
    opacity: 0.35,
  });
  add("path", {
    d: "M188 61 H207 M16 65 H29",
    stroke: "#fff3d0",
    "stroke-width": 3,
    "stroke-linecap": "round",
  });
  for (const x of [50, 172]) {
    add("circle", {
      cx: x,
      cy: 79,
      r: 15,
      fill: "#0e161a",
      stroke: "#879b9e",
      "stroke-width": 2,
    });
    add("circle", { cx: x, cy: 79, r: 7, fill: "#678184" });
    add("circle", { cx: x, cy: 79, r: 2, fill: "#e4f5ef" });
  }
  return svg;
}
function displaySpecs(item, stage = 0) {
  const list = document.createElement("dl");
  list.className = "car-specs";
  const spec = item.spec;
  for (const [label, value] of [
    ["Sürət", spec.speed + stage * 9 + " km/saat"],
    [
      "0–100",
      (Math.max(12, spec.sprint - stage * 2) / 10)
        .toFixed(1)
        .replace(".", ",") + " san",
    ],
    ["Lüks", spec.lux + "/100"],
    ["Rahatlıq", spec.comfort + "/100"],
  ]) {
    const row = document.createElement("div");
    const key = document.createElement("dt");
    const text = document.createElement("dd");
    key.textContent = label;
    text.textContent = value;
    row.append(key, text);
    list.append(row);
  }
  return list;
}

function setupRacing({ api, getPlayer, refresh }) {
  const $ = (id) => document.getElementById(id);
  if (document.body.dataset.demo === "true") {
    $("race-banner").hidden = true;
    $("race-tab").hidden = true;
    return;
  }
  let view;
  let offset = 0;
  let busy = false;
  let polledAt = 0;
  let autoOpen;
  let payoutRefresh;
  let laneElements = [];
  let previousSignature;
  const amount = new Intl.NumberFormat("az-AZ");
  const now = () => Math.floor(Date.now() / 1000) + offset;
  function update(next) {
    view = next;
    offset = next.time - Math.floor(Date.now() / 1000);
    const race = next.race;
    const signature = JSON.stringify(race);
    if (signature !== previousSignature) {
      previousSignature = signature;
      $("race-lanes").replaceChildren();
      laneElements = [];
      if (race) {
        for (const entrant of race.entrants) {
          const line = document.createElement("article");
          line.className = "race-lane";
          const title = document.createElement("strong");
          title.textContent = entrant.nickname + (entrant.mine ? " · Sən" : "");
          const meta = document.createElement("span");
          meta.textContent = entrant.rank
            ? entrant.rank +
              ". yer · " +
              amount.format(entrant.payout) +
              " kredit"
            : entrant.car + " · " + entrant.speed + " km/saat";
          const track = document.createElement("progress");
          track.max = 100;
          track.value = 0;
          track.setAttribute(
            "aria-label",
            entrant.nickname + " yarış irəliləyişi",
          );
          const roadway = document.createElement("div");
          roadway.className = "lane-roadway";
          const model = vehicleDrawing({
            color: entrant.mine ? "#a8efd4" : "#f3cf94",
          });
          roadway.append(track, model);
          line.append(title, meta, roadway);
          $("race-lanes").append(line);
          laneElements.push({ entrant, track, model });
        }
      }
    }
    if (race?.claimed && payoutRefresh !== race.wave) {
      payoutRefresh = race.wave;
      refresh();
    }
    paint();
  }
  function paint() {
    if (!view || !getPlayer()) return;
    const race = view.race;
    const stamp = now();
    const waiting = Boolean(race && stamp < race.starts);
    const running = Boolean(race && stamp >= race.starts && stamp < race.ends);
    const countdown = waiting ? race.starts - stamp : 0;
    if (race && !waiting && autoOpen === race.wave) {
      autoOpen = null;
      location.hash = "race";
    }
    $("race-banner").hidden = false;
    $("race-invite").textContent = waiting
      ? "Starta " + countdown + " saniyə"
      : running
        ? "Yarış gedir"
        : view.joined && stamp < view.nextWave
          ? "Yeni dəvətə " + (view.nextWave - stamp) + " saniyə"
          : "Sahil yarışına dəvət";
    const player = getPlayer();
    const carReady = player.owned.some((id) => id.startsWith("car-"));
    $("race-join").disabled =
      busy ||
      waiting ||
      running ||
      (view.joined && stamp < view.nextWave) ||
      !carReady;
    $("race-join").textContent = carReady
      ? "Yarışa qoşul"
      : "Qarajda maşın tələb olunur";
    $("race-clock").textContent = waiting
      ? String(countdown)
      : running
        ? "YARIŞ"
        : race
          ? "FİNİŞ"
          : "—";
    $("race-caption").textContent = race
      ? "Otaq " + race.room + " · " + race.entrants.length + " / 10 sürücü"
      : "İlk yarışın üçün dəvətə toxun.";
    const boost = $("race-boost");
    const spot = Boolean(
      running && stamp >= race.starts + 7 && stamp < race.starts + 14,
    );
    boost.hidden = !running;
    boost.disabled = busy || !spot || race.boosted;
    boost.textContent = race?.boosted
      ? "Sürətlənmə istifadə olundu"
      : "Sürətlən";
    $("race-boost-note").textContent = !running
      ? ""
      : race.boosted
        ? "Bonus qeydə alındı."
        : spot
          ? "İndi bas!"
          : stamp < race.starts + 7
            ? "Sürətlənməyə " + (race.starts + 7 - stamp) + " saniyə"
            : "Sürətlənmə pəncərəsi bağlandı.";
    $("race-claim").hidden =
      !race ||
      race.phase !== "results" ||
      race.claimed ||
      !race.entrants.some((item) => item.mine && item.payout);
    for (const { entrant, track, model } of laneElements) {
      const elapsed = race ? Math.max(0, stamp - race.starts) : 0;
      const duration = race ? race.ends - race.starts : 24;
      track.value =
        stamp >= race.ends
          ? 100
          : Math.min(
              98,
              (elapsed / duration) *
                100 *
                (0.83 + Math.min(400, entrant.speed) / 2600),
            );
      model.style.setProperty(
        "--car-progress",
        Math.min(92, track.value * 0.92) + "%",
      );
    }
  }
  async function request(path, payload) {
    if (busy || !getPlayer()) return;
    busy = true;
    polledAt = Date.now();
    try {
      const next = await api(path, payload);
      if (path === "race/join" && next.race?.phase === "waiting")
        autoOpen = next.race.wave;
      update(next);
      $("race-status").textContent =
        next.race?.phase === "results" &&
        !next.race.entrants.some((item) => item.payout)
          ? "Tək sürücü ilə keçirilən sınaq turunda mükafat verilmir."
          : "";
    } catch (error) {
      $("race-status").textContent = error.message;
    } finally {
      busy = false;
      paint();
    }
  }
  $("race-boost").addEventListener("click", () => request("race/boost", {}));
  $("race-join").addEventListener("click", () => request("race/join", {}));
  $("race-claim").addEventListener("click", () => request("race/claim", {}));
  setInterval(paint, 1000);
  setInterval(() => {
    const active = view?.race && now() < view.race.ends + 4;
    if (
      !document.hidden &&
      getPlayer() &&
      (active || now() >= view?.nextWave || Date.now() - polledAt >= 20000)
    )
      request("race");
  }, 4000);
  return () => request("race");
}

// city.js
const get = (id) => document.getElementById(id);
const money = new Intl.NumberFormat("az-AZ");
const date = new Intl.DateTimeFormat("az-AZ", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Baku",
});
const units = (value) => money.format(value) + " kr";
let data;
let observedAt;
let busy = false;
let availableAt = 0;
let raceLoaded = false;
let category = "Hamısı";
let screen = "city";
let map;
let locationDistrict;
let taskKey;
let taskSteps = [];
let pendingAsset;
const assetIcons = { Ev: "⌂", Maşın: "▰", Geyim: "♢", Biznes: "▥" };
function assetIcon(item) {
  if (item.spec) return vehicleDrawing(item.spec);
  const icon = node("span", assetIcons[item.category] ?? "◆", "asset-symbol");
  icon.setAttribute("aria-hidden", "true");
  return icon;
}
function showAsset(item) {
  pendingAsset = item;
  get("asset-preview").replaceChildren(assetIcon(item));
  get("asset-title").textContent = item.name;
  get("asset-description").textContent = item.description;
  get("asset-price").textContent = units(item.price);
  get("asset-specs").replaceChildren(
    ...(item.spec ? [displaySpecs(item)] : []),
  );
  get("asset-buy").disabled = data.player.owned.includes(item.id);
  get("asset-dialog").showModal();
}
function mapArrival(district) {
  locationDistrict = district;
  if (data?.city) drawMapLocation();
}
function drawMapLocation() {
  const target = get("map-location");
  if (!locationDistrict) {
    target.replaceChildren(
      node("p", "Məhəlləyə çatmaq üçün xəritədə hərəkət et."),
    );
    return;
  }
  const district = locationDistrict;
  const stamped = data.city.visited.includes(district.id);
  const mark = button(stamped ? "Pasportda var" : "Pasporta əlavə et", () =>
    action("visit", { district: district.id }),
  );
  mark.disabled = stamped;
  const link = node("a", "Məhəlləyə daxil ol", "button secondary");
  link.href = "#" + district.target;
  const actions = node("div", undefined, "actions");
  actions.append(mark, link);
  target.replaceChildren(
    node("h3", district.name),
    node("p", district.info),
    actions,
  );
}
function drawMap() {
  if (!data.city) return;
  map ??= cityMap(get("city-map"), mapArrival);
  get("passport-count").textContent =
    data.city.visited.length + " / " + data.city.districts.length + " möhür";
  get("map-districts").replaceChildren(
    ...data.city.districts.map((district) =>
      button(
        district.icon + " " + district.name,
        () => map.go(district.id),
        true,
      ),
    ),
  );
  map.sync(data.city.districts, data.city.visited);
  drawMapLocation();
}
function deskClock() {
  if (!data?.city) return;
  const current = data.city;
  const now = secondsNow();
  const active = data.player.active;
  const wait = active
    ? Math.max(0, Math.max(current.readyAt, active.started + 10) - now)
    : 0;
  const open = Boolean(current.task && current.task.expires > now);
  const start = get("task-start");
  start.disabled =
    !active ||
    now >= active.started + data.shiftLimit ||
    wait > 0 ||
    open ||
    current.completed >= current.limit;
  start.textContent = !active
    ? "Əvvəl işə başla"
    : open
      ? "Tapşırıq açıqdır"
      : wait
        ? "Hazır olur · " + wait + " san"
        : current.completed >= current.limit
          ? "Gündəlik limit dolub"
          : "Tapşırıq götür";
  const clock = get("task-clock");
  if (clock)
    clock.textContent =
      Math.max(0, current.task.expires - now) +
      " saniyə · " +
      current.completed +
      " / " +
      current.limit +
      " gündəlik nəticə";
  const submit = get("task-submit");
  if (submit) submit.disabled = taskSteps.length !== 4 || !open;
}
function drawDesk() {
  if (!data.city) return;
  const { task, completed, limit } = data.city;
  if (taskKey !== task?.id) {
    taskKey = task?.id;
    taskSteps = [];
  }
  const area = get("task-panel");
  if (!task) {
    const link = node("a", "İş birjasına keç", "button secondary");
    link.href = "#jobs";
    area.replaceChildren(
      node(
        "h3",
        data.player.active ? "Növbə zamanı sınaq" : "Aktiv növbə tələb olunur",
      ),
      node(
        "p",
        "Bu gün tamamladın: " +
          completed +
          " / " +
          limit +
          ". Hər bilet üçün 90 saniyən var.",
      ),
      link,
    );
    deskClock();
    return;
  }
  const choices = node("div", undefined, "actions task-options");
  for (const [index, label] of task.choices.entries()) {
    const picked = taskSteps.indexOf(index);
    const pick = button(
      picked >= 0 ? picked + 1 + ". " + label : label,
      () => {
        if (picked >= 0) taskSteps.splice(picked, 1);
        else if (taskSteps.length < 4) taskSteps.push(index);
        drawDesk();
        get("task-panel")
          .querySelectorAll(".task-options button")
          [index]?.focus();
      },
      true,
    );
    pick.setAttribute("aria-pressed", String(picked >= 0));
    choices.append(pick);
  }
  const ordering = node("ol", undefined, "order-steps");
  ordering.append(...taskSteps.map((index) => node("li", task.choices[index])));
  const clock = node("p");
  clock.id = "task-clock";
  const send = button("Ardıcıllığı göndər", () =>
    action("task-finish", { task: task.id, steps: [...taskSteps] }),
  );
  send.id = "task-submit";
  const controls = node("div", undefined, "actions");
  controls.append(
    button(
      "Seçimi təmizlə",
      () => {
        taskSteps = [];
        drawDesk();
      },
      true,
    ),
    send,
  );
  area.replaceChildren(
    node("h3", task.title),
    clock,
    choices,
    ordering,
    controls,
  );
  deskClock();
}

function node(tag, text, className) {
  const result = document.createElement(tag);
  if (text !== undefined) result.textContent = text;
  if (className) result.className = className;
  return result;
}
function button(text, listener, secondary = false) {
  const result = node("button", text, secondary ? "secondary" : undefined);
  result.type = "button";
  result.addEventListener("click", listener);
  return result;
}
function panel(title, description, meta) {
  const result = node("article", undefined, "panel catalog-card");
  result.append(node("h3", title));
  if (meta) result.append(node("span", meta, "meta"));
  if (description) result.append(node("p", description));
  return result;
}
function signInError() {
  const error = new Error("Sessiyanı yeniləmək üçün ChatGPT ilə daxil ol.");
  error.status = 401;
  return error;
}
async function api(path, payload) {
  const response = await demoFetch(
    "/api/" + path,
    payload === undefined
      ? { cache: "no-store", signal: AbortSignal.timeout?.(12000) }
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
  );
  if (response.status === 401) throw signInError();
  if (!response.headers.get("Content-Type")?.includes("application/json")) {
    const page = await response.text();
    if (
      /<title>Sign in required<\/title>|href="[^"]*signin-with-chatgpt/i.test(
        page,
      )
    ) {
      throw signInError();
    }
    throw new Error("Server cavabı oxunmadı. Bir az sonra yenidən yoxla.");
  }
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.error ?? "Sorğu alınmadı.");
    error.status = response.status;
    error.gate = result.gate;
    throw error;
  }
  return result;
}
let loginMode = null;
let editedProfile = false;
function showCityGate(mode) {
  loginMode = mode;
  data = {};
  editedProfile = false;
  get("gate").hidden = false;
  get("world").hidden = true;
  get("profile-form").hidden = true;
  get("signin").hidden = true;
  get("retry").hidden = true;
  get("city-login").hidden = false;
  get("identity").textContent = "";
  get("gate-status").textContent =
    mode === "setup"
      ? "İlk giriş üçün ad, ən azı 12 simvolluq parol və fərqli, ən azı 10 simvolluq Şəhər açarı yarat."
      : "Şəhər hesabına giriş məlumatlarını yaz.";
  get("city-login").querySelector('[name="password"]').autocomplete =
    mode === "setup" ? "new-password" : "current-password";
  get("login-submit").textContent =
    mode === "setup" ? "Giriş məlumatlarını yarat" : "Daxil ol";
}
function showEntryError(error) {
  if (error.gate) {
    showCityGate(error.gate);
    return;
  }
  get("city-login").hidden = true;
  const needsLogin = error.status === 401;
  if (needsLogin) data = undefined;
  get("world").hidden = true;
  get("gate").hidden = false;
  get("profile-form").hidden = needsLogin || !data || Boolean(data.player);
  get("signin").hidden = !needsLogin;
  get("retry").hidden = needsLogin || !get("profile-form").hidden;
  get("gate-status").textContent =
    error.name === "TimeoutError"
      ? "Server gec cavab verdi. Yenidən yoxla."
      : error.message;
}
function feedback(message, error = false) {
  const output = get("feedback");
  output.hidden = !message;
  output.dataset.error = String(error);
  output.textContent = message;
}
function update(next) {
  if (next.gate) {
    showCityGate(next.gate);
    return;
  }
  loginMode = null;
  get("city-login").hidden = true;
  data = { ...data, ...next };
  observedAt = performance.now();
  const hasPlayer = Boolean(data.player);
  get("logout").hidden = data.accountId === "Brauzer demosu";
  get("gate").hidden = hasPlayer;
  get("world").hidden = !hasPlayer;
  get("profile-form").hidden = hasPlayer;
  get("signin").hidden = true;
  get("retry").hidden = true;
  if (!hasPlayer) {
    get("gate-status").textContent = "Şəhərdə görünəcək ləqəbini seç.";
    return;
  }
  get("identity").textContent = data.nickname;
  get("admin-tab").hidden = !data.admin;
  draw();
  if (!raceLoaded) {
    raceLoaded = true;
    startRacing?.();
  }
}
function secondsNow() {
  return data.time + Math.floor((performance.now() - observedAt) / 1000);
}
function balances() {
  if (!data?.player) return;
  const { player, interval, shiftLimit } = data;
  const active = player.active;
  const now = secondsNow();
  const extra = active
    ? Math.max(
        0,
        Math.floor(
          (Math.min(
            now,
            active.started + shiftLimit,
            active.onlineUntil ?? active.paid,
          ) -
            active.paid) /
            interval,
        ),
      )
    : 0;
  get("cash").textContent = units(player.cash + extra * (active?.rate ?? 0));
  get("bank").textContent = units(player.bank);
  get("xp").textContent = money.format(player.xp + extra) + " XP";
  if (
    active &&
    now <
      Math.min(active.started + shiftLimit, active.onlineUntil ?? active.paid)
  ) {
    const next = Math.max(1, interval - ((now - active.paid) % interval));
    get("shift").textContent = "+" + active.rate + " kr · " + next + " san";
  } else {
    get("shift").textContent = "Dayanıb";
  }
}
async function action(type, fields = {}) {
  if (busy) return;
  if (performance.now() < availableAt) {
    feedback("Növbəti əməliyyat üçün bir saniyə gözlə.");
    return;
  }
  availableAt = performance.now() + 1000;
  busy = true;
  try {
    const next = await api("actions", {
      type,
      ...fields,
      requestId: crypto.randomUUID(),
    });
    update(next);
    feedback(next.activity?.[0]?.label ?? "Əməliyyat tamamlandı.");
    if (type === "buy") {
      get("asset-dialog").close();
      get("cash").parentElement.classList.remove("panel-arrival");
      requestAnimationFrame(() =>
        get("cash").parentElement.classList.add("panel-arrival"),
      );
    }
  } catch (error) {
    if (error.gate || error.status === 401) showEntryError(error);
    else feedback(error.message, true);
  } finally {
    busy = false;
  }
}
function drawProjects() {
  const { player, level, cityProjects } = data;
  get("completed-projects").textContent =
    cityProjects
      .filter(
        (project) => player.projects?.[project.id] === project.costs.length,
      )
      .map(({ name }) => name)
      .join(" · ") || "Hələ tamamlanan layihə yoxdur.";
  if (screen !== "projects") return;
  get("project-list").replaceChildren(
    ...cityProjects.map((project) => {
      const stage = player.projects?.[project.id] ?? 0;
      const price = project.costs[stage];
      const card = panel(
        project.name,
        project.description,
        stage + " / " + project.costs.length + " mərhələ",
      );
      const progress = node("progress");
      progress.max = project.costs.length;
      progress.value = stage;
      progress.setAttribute("aria-label", project.name + " üzrə irəliləyiş");
      const fund = button(
        !price
          ? "Tamamlandı"
          : level < project.level
            ? project.level + "-ci səviyyə tələb olunur"
            : "Maliyyələşdir · " + units(price),
        () => {
          if (
            confirm(project.name + " · " + units(price) + ". Təsdiqləyirsən?")
          )
            action("city-project", { project: project.id, stage });
        },
      );
      fund.disabled = !price || level < project.level;
      if (price && level >= project.level && player.cash < price)
        card.append(node("p", "Cüzdanda kifayət qədər kredit yoxdur."));
      card.append(progress, fund);
      return card;
    }),
  );
}
function draw() {
  drawProjects();
  const { player, jobs, catalog, day, activity } = data;
  const job = jobs.find((item) => item.id === player.active?.job);
  get("daily").disabled = player.daily === day;
  get("daily").textContent =
    player.daily === day ? "Bugünkü mükafat götürülüb" : "Gündəlik 150 kredit";
  get("stop").hidden = !job;
  get("jobs-list").replaceChildren(
    ...jobs.map((item) => {
      const card = panel(
        item.name,
        item.description,
        item.district + " · " + units(item.rate) + " / 10 san",
      );
      const start = button(
        job?.id === item.id
          ? "Növbədədir"
          : player.xp < item.xp
            ? item.xp + " XP tələb olunur"
            : "İşə başla",
        () => action("work-start", { job: item.id }),
      );
      start.disabled = Boolean(job) || player.xp < item.xp;
      card.append(start);
      return card;
    }),
  );
  drawMarket();
  drawMap();
  drawDesk();
  get("owned-list").replaceChildren(
    ...player.owned.map((id) => {
      const item = catalog.find((entry) => entry.id === id);
      if (!item) return node("p", id);
      const card = panel(
        item.name,
        item.description,
        item.category + " · " + units(item.price),
      );
      card.prepend(assetIcon(item));
      const controls = node("div", undefined, "actions");
      if (item.spec) {
        const stage = player.upgrades?.[id] ?? 0;
        const level = Math.floor(player.xp / 25) + 1;
        const need = (stage + 1) * 5;
        const fee = Math.max(
          200,
          Math.floor(item.price * (0.035 + stage * 0.025)),
        );
        card.append(
          displaySpecs(item, stage),
          node("p", "Təkmilləşdirmə " + stage + " / 4 · Səviyyən " + level),
        );
        const upgrade = button(
          stage >= 4
            ? "Maksimum mərhələ"
            : level < need
              ? "Lazım olan səviyyə · " + need
              : "Təkmilləşdir · " + units(fee),
          () => action("car-upgrade", { item: id }),
        );
        upgrade.disabled = stage >= 4 || level < need;
        controls.append(upgrade);
      }
      if (item.category === "Biznes") {
        const collect = button("Gəliri götür", () =>
          action("business", { item: id }),
        );
        collect.disabled = player.businessDay[id] === day;
        controls.append(collect);
      } else {
        const active = player.preferred[item.category] === id;
        const equip = button(active ? "Aktivdir" : "Aktiv seç", () =>
          action("equip", { item: id }),
        );
        equip.disabled = active;
        controls.append(equip);
      }
      controls.append(
        button(
          "Sat · " + units(Math.floor(item.price * 0.65)),
          () => {
            if (confirm(item.name + " satılsın?")) action("sell", { item: id });
          },
          true,
        ),
      );
      card.append(controls);
      return card;
    }),
  );
  if (!player.owned.length)
    get("owned-list").append(
      node("p", "Əmlak siyahın boşdur. Mağazadan ilk əşyanı seç."),
    );
  get("profile-name").textContent = data.nickname;
  get("account-id").textContent = data.accountId;
  get("goals-list").replaceChildren(
    ...(data.goals ?? []).map((goal) => {
      const card = panel(
        goal.name,
        goal.description,
        money.format(goal.progress) + " / " + money.format(goal.target),
      );
      const reward = button(
        goal.claimed ? "Mükafat götürülüb" : "Mükafat · " + units(goal.reward),
        () => action("goal", { goal: goal.id }),
      );
      reward.disabled = goal.claimed || goal.progress < goal.target;
      card.append(reward);
      return card;
    }),
  );
  if (!editedProfile) {
    const form = get("profile-edit");
    form.elements.namedItem("nickname").value = data.nickname;
    form.elements.namedItem("bio").value = data.profile?.bio ?? "";
    form.elements.namedItem("emblem").value = data.profile?.emblem ?? "◆";
  }
  get("profile-assets").textContent =
    player.owned.length + " əşya · əmlak dəyəri " + units(player.assetValue);
  get("profile-active").replaceChildren(
    ...Object.entries(player.preferred).map(([kind, id]) =>
      node(
        "p",
        kind +
          " · " +
          (catalog.find((item) => item.id === id)?.name ?? "Seçilməyib"),
      ),
    ),
  );
  get("earnings").replaceChildren(
    ...jobs
      .filter((item) => player.history[item.id])
      .map((item) =>
        node("li", item.name + " · " + units(player.history[item.id])),
      ),
  );
  if (!get("earnings").children.length)
    get("earnings").append(node("li", "Hələ iş gəlirin yoxdur."));
  get("activity").replaceChildren(
    ...activity.map((event) =>
      node("li", date.format(event.at * 1000) + " · " + event.label),
    ),
  );
  if (!activity.length)
    get("activity").append(node("li", "İlk əməliyyatın burada görünəcək."));
  balances();
}
function drawMarket() {
  const { player, catalog } = data;
  const kinds = ["Hamısı", ...new Set(catalog.map((item) => item.category))];
  get("filters").replaceChildren(
    ...kinds.map((kind) => {
      const filter = button(
        kind,
        () => {
          category = kind;
          drawMarket();
          get("filters").querySelector('[aria-pressed="true"]').focus();
        },
        true,
      );
      filter.setAttribute("aria-pressed", String(kind === category));
      return filter;
    }),
  );
  get("market-list").replaceChildren(
    ...catalog
      .filter((item) => category === "Hamısı" || item.category === category)
      .map((item) => {
        const card = panel(
          item.name,
          item.description,
          item.category + " · " + item.district,
        );
        const owned = player.owned.includes(item.id);
        card.prepend(assetIcon(item));
        if (item.spec) card.append(displaySpecs(item));
        const buy = button(
          owned ? "Sənindir" : "Bax · " + units(item.price),
          () => showAsset(item),
        );
        buy.disabled = owned;
        card.append(buy);
        return card;
      }),
  );
}
let rankingBusy = false;
let previousRanking = new Map();
let portfolioRequest = 0;
async function showPortfolio(nickname) {
  const request = ++portfolioRequest;
  const dialog = get("portfolio-dialog");
  get("portfolio-title").textContent = nickname;
  get("portfolio-emblem").textContent = "◆";
  get("portfolio-bio").textContent = "";
  get("portfolio-items").replaceChildren(node("p", "Portfel yüklənir…"));
  if (!dialog.open) dialog.showModal();
  try {
    const details = await api("portfolio?name=" + encodeURIComponent(nickname));
    if (request !== portfolioRequest || !dialog.open) return;
    get("portfolio-title").textContent = details.nickname;
    get("portfolio-emblem").textContent = details.emblem ?? "◆";
    get("portfolio-bio").textContent = details.bio ?? "";
    const groups = ["Ev", "Maşın", "Geyim", "Biznes"];
    get("portfolio-items").replaceChildren(
      ...groups.map((category) => {
        const list = node("ul");
        const section = node("section", undefined, "panel");
        const items = details.items.filter(
          (item) => item.category === category,
        );
        section.append(node("h3", category + " · " + items.length));
        list.append(
          ...items.map((item) =>
            node(
              "li",
              item.name + " · " + units(item.price) + " · " + item.district,
            ),
          ),
        );
        section.append(items.length ? list : node("p", "Hələ əşya yoxdur."));
        return section;
      }),
    );
  } catch (error) {
    if (request === portfolioRequest)
      get("portfolio-items").replaceChildren(node("p", error.message));
  }
}
const rankingLabels = { wealth: "Sərvət", assets: "Əmlak sayı", xp: "Təcrübə" };
let rankingPage = 1;
let rankingRequest = 0;
let typingTimer;
function raceScore(player, sort) {
  if (sort === "assets") return money.format(player.assets) + " əşya";
  if (sort === "xp") return money.format(player.xp) + " XP";
  return units(player.wealth);
}
function syncRacePages(page, pageSize, total) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  get("ranking-page").textContent = page + " / " + pages;
  get("ranking-prev").disabled = page <= 1;
  get("ranking-next").disabled = page >= pages;
  get("ranking-pages").hidden =
    get("ranking-table").hidden || (pages <= 1 && page <= 1);
}
async function ranking(force = false) {
  if (document.body.dataset.demo === "true") return;
  if (rankingBusy && !force) return;
  rankingBusy = true;
  const seq = ++rankingRequest;
  const sort = get("ranking-sort").value;
  const term = get("ranking-search").value.trim();
  const requestedPage = rankingPage;
  const status = get("ranking-status");
  const query = new URLSearchParams({
    sort,
    q: term,
    page: String(requestedPage),
  });
  try {
    const {
      players,
      time,
      total = players.length,
      pageSize = 25,
      page = requestedPage,
    } = await api("ranking?" + query);
    if (seq !== rankingRequest) return;
    if (!players.length && requestedPage > 1) {
      rankingPage = 1;
      return ranking(true);
    }
    const signature = JSON.stringify([sort, term, page, players]);
    if (ranking.signature !== signature) {
      ranking.signature = signature;
      const focus = document.activeElement;
      get("ranking-metric").textContent = rankingLabels[sort] ?? "Sərvət";
      const podium =
        !term && page === 1
          ? players.slice(0, 10).map((player) => {
              const card = panel(
                (player.emblem ?? "◆") + " " + player.nickname,
                undefined,
                "#" + player.rank,
              );
              card.classList.add("podium-card");
              if (player.mine) card.classList.add("rank-self");
              if (player.rank === 1) card.classList.add("rank-first");
              const score = node(
                "strong",
                raceScore(player, sort),
                "podium-money",
              );
              if (
                sort === "wealth" &&
                previousRanking.has(player.nickname) &&
                previousRanking.get(player.nickname) < player.wealth
              )
                score.classList.add("wealth-up");
              const open = button(
                "Əmlak portfeli · " + player.assets,
                () => showPortfolio(player.nickname),
                true,
              );
              open.dataset.portfolio = player.nickname;
              const collection = node("div", undefined, "rank-collection");
              collection.append(
                node("span", "Maşın " + money.format(player.cars)),
                node("span", "Ev " + money.format(player.homes)),
                node("span", "Biznes " + money.format(player.businesses)),
                node("span", "Qələbə " + money.format(player.wins ?? 0)),
              );
              card.append(
                score,
                collection,
                node("p", "Portfel · " + units(player.property_value ?? 0)),
                open,
              );
              return card;
            })
          : [];
      get("leader-podium").replaceChildren(...podium);
      get("ranking-list").replaceChildren(
        ...players.map((player) => {
          const row = node("tr");
          if (player.mine) row.classList.add("race-self");
          const action = node("td");
          const open = button(
            "Əmlak · " + player.assets,
            () => showPortfolio(player.nickname),
            true,
          );
          open.dataset.portfolio = player.nickname;
          action.append(open);
          row.append(
            node("td", player.rank),
            node("td", player.nickname + (player.mine ? " · Sən" : "")),
            node("td", raceScore(player, sort)),
            action,
          );
          return row;
        }),
      );
      get("ranking-more").hidden = !players.length;
      get("ranking-table").hidden =
        !players.length ||
        get("ranking-more").getAttribute("aria-expanded") !== "true";
      previousRanking = new Map(
        players.map((player) => [player.nickname, player.wealth]),
      );
      if (focus?.dataset.portfolio) {
        const region = focus.closest("table")
          ? get("ranking-list")
          : get("leader-podium");
        [...region.querySelectorAll("button")]
          .find((item) => item.dataset.portfolio === focus.dataset.portfolio)
          ?.focus();
      }
    }
    ranking.page = { page, pageSize, total };
    syncRacePages(page, pageSize, total);
    status.textContent = players.length
      ? total +
        " oyunçu · " +
        date.format((time ?? Math.floor(Date.now() / 1000)) * 1000)
      : term
        ? "Bu ləqəbə uyğun oyunçu tapılmadı."
        : "Reytinqdə ilk oyunçu hələ yoxdur.";
  } catch (error) {
    if (seq === rankingRequest)
      status.textContent =
        error.status === 401
          ? "Reytinqə baxmaq üçün giriş tələb olunur."
          : error.message;
  } finally {
    if (seq === rankingRequest) rankingBusy = false;
  }
}
async function administration() {
  try {
    const [{ players }, { entries }] = await Promise.all([
      api("admin/players"),
      api("admin/history"),
    ]);
    const list = get("admin-players");
    list.replaceChildren(
      ...players.map(({ nickname }) => {
        const option = node("option");
        option.value = nickname;
        return option;
      }),
    );
    get("admin-history").replaceChildren(
      ...entries.map((event) =>
        node("li", event.nickname + " · " + event.label),
      ),
    );
    if (!entries.length)
      get("admin-history").append(node("li", "Hələ admin əməliyyatı yoxdur."));
  } catch (error) {
    feedback(error.message, true);
  }
}
function route() {
  if (!data?.player) return;
  const requested = location.hash.slice(1);
  const allowed = [
    "city",
    "race",
    "map",
    "desk",
    "jobs",
    "market",
    "vault",
    "garage",
    "ranking",
    "goals",
    "profile",
    "projects",
    "vip",
    ...(data.admin ? ["admin"] : []),
  ];
  screen = allowed.includes(requested) ? requested : "city";
  document
    .querySelectorAll(".screen")
    .forEach((panel) => (panel.hidden = panel.id !== screen));
  for (const link of get("tabs").querySelectorAll("a")) {
    if (link.hash === "#" + screen) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  if (screen === "ranking") ranking();
  if (screen === "projects") drawProjects();
  if (screen === "admin") administration();
}
async function load() {
  if (busy) return;
  busy = true;
  try {
    const first = !data?.player;
    update(await api("me"));
    if (first) route();
  } catch (error) {
    if (data?.player && error.status !== 401) feedback(error.message, true);
    else showEntryError(error);
  } finally {
    busy = false;
  }
}
get("ranking-more").addEventListener("click", () => {
  const table = get("ranking-table");
  table.hidden = !table.hidden;
  get("ranking-more").setAttribute("aria-expanded", String(!table.hidden));
  get("ranking-more").textContent = table.hidden
    ? "Oyunçu siyahısını aç"
    : "Siyahını yığ";
  if (ranking.page)
    syncRacePages(ranking.page.page, ranking.page.pageSize, ranking.page.total);
});
get("ranking-sort").addEventListener("change", () => {
  rankingPage = 1;
  ranking(true);
});
get("ranking-search").addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    rankingPage = 1;
    get("ranking-more").setAttribute("aria-expanded", "true");
    get("ranking-more").textContent = "Siyahını yığ";
    ranking(true);
  }, 250);
});
get("ranking-prev").addEventListener("click", () => {
  if (rankingPage > 1) {
    rankingPage--;
    ranking(true);
  }
});
get("ranking-next").addEventListener("click", () => {
  if (!get("ranking-next").disabled) {
    rankingPage++;
    ranking(true);
  }
});
get("city-login").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy || !loginMode) return;
  const form = event.currentTarget;
  const fields = new FormData(form);
  busy = true;
  get("login-submit").disabled = true;
  try {
    await api("session/" + loginMode, {
      name: fields.get("name"),
      password: fields.get("password"),
      phrase: fields.get("phrase"),
      remember: fields.has("remember"),
    });
    form.reset();
    update(await api("me"));
    route();
  } catch (error) {
    get("gate-status").textContent = error.message;
  } finally {
    busy = false;
    get("login-submit").disabled = false;
  }
});
get("logout").addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  try {
    await api("session/logout", {});
    showCityGate("login");
    get("gate").scrollIntoView({ block: "center" });
  } catch (error) {
    feedback(error.message, true);
  } finally {
    busy = false;
  }
});
get("profile-edit").addEventListener("input", () => {
  editedProfile = true;
});
get("profile-edit").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  busy = true;
  try {
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const next = await api("profile/update", fields);
    editedProfile = false;
    update(next);
    feedback("Profil saxlanıldı.");
    ranking();
  } catch (error) {
    if (error.gate || error.status === 401) showEntryError(error);
    else feedback(error.message, true);
  } finally {
    busy = false;
  }
});
get("task-start").addEventListener("click", () => action("task-start"));
get("asset-buy").addEventListener("click", () => {
  if (pendingAsset) action("buy", { item: pendingAsset.id });
});
get("retry").addEventListener("click", load);
get("profile-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  busy = true;
  try {
    update(
      await api("profile", {
        nickname: new FormData(event.currentTarget).get("nickname"),
      }),
    );
    route();
  } catch (error) {
    showEntryError(error);
  } finally {
    busy = false;
  }
});
get("stop").addEventListener("click", () => action("work-stop"));
get("daily").addEventListener("click", () => action("daily"));
get("ranking-reload").addEventListener("click", () => ranking(true));
get("bank-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(new FormData(event.currentTarget).get("amount"));
  action(event.submitter?.value ?? "deposit", { amount });
});
let inspectedPlayer;
let inspectionRequest = 0;
get("admin-name").addEventListener("input", () => {
  inspectionRequest++;
  inspectedPlayer = undefined;
  get("admin-detail").replaceChildren();
  get("admin-form").hidden = true;
});
async function inspectPlayer(name) {
  const sequence = ++inspectionRequest;
  try {
    const player = await api("admin/player?" + new URLSearchParams({ name }));
    if (sequence !== inspectionRequest) return;
    inspectedPlayer = player.nickname;
    const assets = data.catalog.filter((item) =>
      player.owned.includes(item.id),
    );
    get("admin-detail").replaceChildren(
      node("h3", player.nickname),
      node(
        "p",
        "Cüzdan " +
          units(player.cash) +
          " · Bank " +
          units(player.bank) +
          " · " +
          money.format(player.xp) +
          " XP",
      ),
      node("p", assets.map(({ name }) => name).join(", ") || "Əmlakı yoxdur."),
    );
    get("admin-items").replaceChildren(
      ...data.catalog
        .filter((item) => !player.owned.includes(item.id))
        .map((item) => {
          const option = node("option", item.category + " · " + item.name);
          option.value = item.id;
          return option;
        }),
    );
    get("admin-form").hidden = false;
  } catch (error) {
    if (sequence === inspectionRequest) feedback(error.message, true);
  }
}
get("admin-lookup").addEventListener("submit", (event) => {
  event.preventDefault();
  if (data?.admin && !busy) inspectPlayer(get("admin-name").value);
});
get("admin-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy || !data?.admin || !inspectedPlayer) return;
  const form = event.currentTarget;
  const fields = new FormData(form);
  const nickname = inspectedPlayer;
  const mode = event.submitter?.value ?? "adjust";
  const delta = Number(fields.get("delta"));
  const item = fields.get("item");
  const detail =
    mode === "gift"
      ? data.catalog.find((asset) => asset.id === item)?.name
      : delta && delta + " kredit";
  if (!detail) {
    feedback("Məbləği və ya hədiyyəni seç.", true);
    return;
  }
  if (!confirm(nickname + " · " + detail + ". Təsdiqləyirsən?")) return;
  busy = true;
  try {
    await api("admin/" + mode, {
      nickname,
      delta,
      item,
      reason: fields.get("reason"),
      requestId: crypto.randomUUID(),
    });
    form.reset();
    update(await api("me"));
    await administration();
    if (inspectedPlayer === nickname) await inspectPlayer(nickname);
    feedback(mode === "gift" ? "Hədiyyə verildi." : "Balans dəyişdirildi.");
  } catch (error) {
    feedback(error.message, true);
  } finally {
    busy = false;
  }
});
const soundToggle = get("sound-toggle");
let soundEnabled = false;
let audio;
try {
  soundEnabled = localStorage.getItem("obsidian-ui-sound") === "on";
} catch {}
soundToggle.setAttribute("aria-pressed", String(soundEnabled));
function playClick() {
  if (!soundEnabled || !window.AudioContext) return;
  try {
    audio ??= new AudioContext();
    if (audio.state === "suspended") audio.resume().catch(() => {});
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;
    oscillator.frequency.setValueAtTime(490, now);
    oscillator.frequency.exponentialRampToValueAtTime(335, now + 0.08);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.09);
  } catch {}
}
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  try {
    localStorage.setItem("obsidian-ui-sound", soundEnabled ? "on" : "off");
  } catch {}
});
document.addEventListener("click", (event) => {
  if (event.target.closest("button:not(:disabled), a[href^='#']")) playClick();
});
get("releases-open").addEventListener("click", () =>
  get("releases").showModal(),
);
window.addEventListener("hashchange", route);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) load();
});
setInterval(() => {
  if (!document.hidden) {
    balances();
    deskClock();
  }
}, 1000);
setInterval(() => {
  if (!document.hidden && data?.player) load();
}, 30000);
const startRacing = setupRacing({
  api,
  getPlayer: () => data?.player,
  refresh: load,
});
setInterval(async () => {
  if (!data?.player?.active) return;
  try {
    await api("work/presence", {});
    await load();
  } catch {}
}, 25000);

load();
ranking();
setInterval(() => {
  if (!document.hidden) ranking();
}, 10000);
