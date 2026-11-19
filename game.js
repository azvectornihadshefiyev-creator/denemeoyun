"use strict";

const $ = id => document.getElementById(id);
const KEY = "obsidian-city-github-demo";
const TICK = 10_000;
const LEASE = 75_000;
const MAX_SHIFT = 8 * 3_600_000;
const WAVE = 5 * 60_000;
const format = new Intl.NumberFormat("az-AZ");
const kr = value => format.format(value) + " kredit";
const day = () => Math.floor((Date.now() + 4 * 3_600_000) / 86_400_000);
const wave = () => Math.floor(Date.now() / WAVE);
const validName = name => /^[\p{L}\p{N}_-]{3,22}$/u.test(name);
const kinds = ["Ev", "Maşın", "Geyim", "Biznes"];
const symbols = { Ev: "⌂", Maşın: "▰", Geyim: "◇", Biznes: "▥" };
const emblems = ["◆", "☀", "✦", "♜", "⚡", "◈"];

const jobs = [
  ["Kuryer", 6, 0],
  ["Barista", 9, 20],
  ["Mexanik", 15, 80],
  ["Dizayner", 23, 200],
  ["Mühəndis", 34, 450],
  ["Layihə rəhbəri", 50, 900]
];

function car(name, price, speed, sprint, luxury, comfort, color, shape = "sport") {
  return { name, kind: "Maşın", price, spec: { speed, sprint, luxury, comfort, color, shape } };
}

function item(name, kind, price, income = 0) {
  return { name, kind, price, income };
}

// İlk 18 əşyanın sırası əvvəlki versiyada olduğu kimi saxlanılır.
const stock = [
  item("Sahil studiyası", "Ev", 1250),
  item("Mərkəz loftu", "Ev", 6200),
  item("Terraslı mənzil", "Ev", 14200),
  item("Sahil villası", "Ev", 95000),
  car("Şəhər hetçbeki", 950, 178, 104, 22, 58, "#82cdb9", "suv"),
  car("Klassik kupe", 4800, 225, 72, 62, 55, "#e5af7f", "classic"),
  car("Elektrik sedanı", 12600, 260, 39, 71, 88, "#afafd9", "classic"),
  car("Sahil GT", 33000, 320, 32, 76, 64, "#c889b0"),
  item("Şəhər paltosu", "Geyim", 180),
  item("İdman ayaqqabısı", "Geyim", 270),
  item("Studiya gödəkçəsi", "Geyim", 630),
  item("Maliyyə kostyumu", "Geyim", 1650),
  item("Məhəllə kafesi", "Biznes", 9500, 320),
  item("Dizayn studiyası", "Biznes", 23500, 850),
  item("Təmir emalatxanası", "Biznes", 42000, 1600),
  item("Panorama mənzili", "Ev", 38000),
  car("Vista 4×4", 52000, 238, 64, 83, 92, "#aad293", "suv"),
  item("Sahil saatı", "Geyim", 3400),
  car("Toyota GR Supra", 26500, 278, 41, 60, 65, "#ef9f7c"),
  car("Nissan GT-R", 47000, 315, 29, 65, 65, "#80c5f2"),
  car("Porsche 911 Turbo S", 81000, 330, 27, 81, 74, "#dedce6"),
  car("Audi R8 V10", 73000, 331, 31, 76, 74, "#9de3da"),
  car("Ferrari 296 GTB", 120000, 330, 29, 80, 64, "#ff898d"),
  car("Lamborghini Revuelto", 170000, 350, 25, 82, 59, "#f6c774"),
  car("McLaren 750S", 140000, 332, 28, 75, 59, "#f4a06f"),
  car("Aston Martin Valkyrie", 255000, 355, 26, 80, 48, "#abd293"),
  car("Bentley Continental GT", 175000, 335, 32, 93, 94, "#add3cc", "classic"),
  car("Mercedes-Maybach S 680", 207000, 250, 45, 99, 99, "#b4b0c9", "classic"),
  car("Rolls-Royce Phantom", 310000, 250, 53, 100, 100, "#d3c9ba", "classic"),
  car("Rolls-Royce Cullinan", 345000, 250, 52, 99, 98, "#b5c3d7", "suv"),
  car("Bugatti Chiron Super Sport", 415000, 440, 24, 97, 79, "#84b8f8"),
  car("Bugatti Bolide", 365000, 380, 22, 69, 24, "#88d7e1"),
  car("Koenigsegg Jesko Attack", 389000, 410, 25, 84, 52, "#efb6dc"),
  car("Koenigsegg Gemera", 480000, 400, 21, 92, 88, "#a1e0b2"),
  car("Rimac Nevera", 390000, 412, 19, 89, 70, "#b4a0f2"),
  car("McLaren Speedtail", 370000, 403, 30, 92, 69, "#8ae0ed")
];

const places = [
  ["center", "Mərkəz", 350, 190, "İş"],
  ["shore", "Sahil", 580, 250, "Yarış"],
  ["bank", "Maliyyə", 520, 88, "Bank"],
  ["garage", "Qaraj", 118, 250, "Qaraj"],
  ["cafe", "Kafe rayonu", 190, 95, "Tapşırıqlar"],
  ["park", "Şəhər parkı", 330, 322, "Hədəflər"]
];

const tickets = [
  ["Bağlamanı yoxla", "Marşrutu seç", "Ünvana çatdır", "Qəbzi təsdiqlə"],
  ["Sifarişi oxu", "Qəhvəni üyüt", "İçkini hazırla", "Fincanı təqdim et"],
  ["Maşını qəbul et", "Nasazlığı tap", "Hissəni dəyiş", "Yekun sınağı apar"],
  ["Tapşırığı oxu", "Eskiz çək", "Maketi hazırla", "Faylı təhvil ver"],
  ["Ölçünü götür", "Nasazlığı tap", "Parametri tənzimlə", "Sınağı qeyd et"],
  ["Hədəfi müəyyən et", "Komandanı bölüşdür", "Nəticəni yoxla", "Layihəni təhvil ver"]
];

const tabs = [
  ["◆", "Şəhər"], ["⌖", "Xəritə"], ["⚑", "Yarış"], ["▤", "İş"],
  ["▣", "Tapşırıqlar"], ["◇", "Mağaza"], ["▰", "Qaraj"], ["▥", "Bank"],
  ["⌂", "Əmlakım"], ["★", "Hədəflər"], ["◉", "Kabinet"]
];

function normalize(old) {
  const number = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
  const array = value => Array.isArray(value) ? value : [];
  const object = value => value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const owned = [...new Set(array(old.owned).filter(id => Number.isInteger(id) && stock[id]))];
  const shift = old.shift;
  const active = shift && Number.isInteger(shift.job) && jobs[shift.job] &&
    Number.isFinite(shift.start) && Number.isFinite(shift.paid) && shift.paid >= shift.start
    ? { ...shift, until: Number.isFinite(shift.until) ? shift.until : shift.paid }
    : null;
  const upgrades = {};
  for (const id of owned) {
    const stage = object(old.upgrades)[id];
    if (stock[id].spec && Number.isInteger(stage) && stage > 0 && stage <= 4) upgrades[id] = stage;
  }
  const profile = object(old.cityProfile);
  return {
    ...old, owned, upgrades, shift: active,
    cash: number(old.cash), bank: number(old.bank), xp: number(old.xp),
    business: object(old.business), equipped: object(old.equipped),
    history: array(old.history).filter(event => typeof event?.text === "string").slice(0, 18),
    visited: [...new Set(array(old.visited).filter(id => places.some(place => place[0] === id)))],
    claimed: array(old.claimed), totalTasks: number(old.totalTasks),
    cityProfile: {
      bio: typeof profile.bio === "string" ? profile.bio.slice(0, 160) : "",
      emblem: emblems.includes(profile.emblem) ? profile.emblem : "◆"
    }
  };
}

let state = null;
try {
  const old = JSON.parse(localStorage.getItem(KEY));
  if (old?.name && Array.isArray(old.owned)) state = normalize(old);
} catch {}

let screen = "Şəhər";
let category = "Hamısı";
let lastWealth;
let nextAction = 0;
let mapFrame = 0;
let locationPoint = [350, 190];
let task = null;
let race = null;

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function btn(text, handler, { disabled = false, secondary = false } = {}) {
  const node = el("button", text, secondary ? "secondary" : "");
  node.type = "button";
  node.disabled = disabled;
  node.addEventListener("click", handler);
  return node;
}

function panel(title, text) {
  const node = el("article", undefined, "panel");
  node.append(el("h3", title));
  if (text) node.append(el("p", text));
  return node;
}

function actions(...nodes) {
  const box = el("div", undefined, "actions");
  box.append(...nodes);
  return box;
}

function tell(text) { $("message").textContent = text; }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { tell("Brauzer yaddaşı əlçatan deyil. Dəyişikliklər bu sessiya üçündür."); }
}

function notice(text) {
  state.history.unshift({ text, time: Date.now() });
  state.history = state.history.slice(0, 18);
  tell(text);
  save();
  render();
}

function allowAction(status = tell) {
  const now = performance.now();
  if (now < nextAction) {
    status("Növbəti əməliyyat üçün bir saniyə gözlə.");
    return false;
  }
  nextAction = now + 1000;
  return true;
}

function go(page) {
  screen = page;
  tell("");
  render();
  $("title")?.focus();
}

const level = () => Math.floor(state.xp / 25) + 1;
const valueOfAssets = () => state.owned.reduce((sum, id) => sum + stock[id].price, 0);
const countKind = kind => state.owned.filter(id => stock[id].kind === kind).length;

function settle(now = Date.now()) {
  const shift = state?.shift;
  if (!shift) return false;
  const limit = Math.min(shift.start + MAX_SHIFT, shift.until);
  const count = Math.max(0, Math.floor((Math.min(now, limit) - shift.paid) / TICK));
  if (count) {
    state.cash += count * jobs[shift.job][1];
    state.xp += count;
    shift.paid += count * TICK;
  }
  if (now >= limit) {
    state.shift = null;
    task = null;
  }
  return Boolean(count || !state.shift);
}

function heartbeat() {
  if (!state?.shift) return;
  const now = Date.now();
  if (settle(now)) save();
  if (state.shift) {
    state.shift.until = now + LEASE;
    save();
  }
}

function balances() {
  $("cash").textContent = kr(state.cash);
  $("bank").textContent = kr(state.bank);
  $("level").textContent = level() + " · " + format.format(state.xp) + " XP";
  const active = state.shift;
  $("shift").textContent = active
    ? jobs[active.job][0] + " · " + Math.max(1, Math.ceil((active.paid + TICK - Date.now()) / 1000)) + " san"
    : "Dayanıb";
  const wealth = state.cash + state.bank + valueOfAssets();
  const score = $("wealth");
  if (score) {
    score.textContent = kr(wealth);
    if (lastWealth !== undefined && wealth > lastWealth) {
      score.classList.remove("wealth-up");
      void score.offsetWidth;
      score.classList.add("wealth-up");
    }
  }
  lastWealth = wealth;
}

function details(title, art, body) {
  $("modal-title").textContent = title;
  $("modal-art").replaceChildren(art);
  $("modal-content").replaceChildren(body);
  if (!$("modal").open) $("modal").showModal();
}

function vector(spec) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 226 108");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("car-art");
  const silhouettes = {
    sport: "M13 72 L25 57 L53 52 L81 31 Q108 20 138 28 L173 51 L202 55 L215 69 L209 80 H13Z",
    classic: "M15 67 L24 53 L60 48 L85 26 L133 26 L161 48 L200 54 L210 67 L208 80 H15Z",
    suv: "M13 67 L23 46 L52 42 L65 19 H144 L170 43 L205 49 L213 66 L209 80 H13Z"
  };
  function shape(tag, attrs) {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    svg.append(node);
  }
  shape("ellipse", { cx:113, cy:92, rx:98, ry:8, fill:"#09151a" });
  shape("path", { d:silhouettes[spec.shape] ?? silhouettes.sport, fill:spec.color, stroke:"#f0fbf7", "stroke-width":1.5 });
  shape("path", { d:"M71 48 Q108 22 140 36 L156 49Z", fill:"#182c34" });
  shape("path", { d:"M189 61 H207 M16 65 H29", stroke:"#fff1c9", "stroke-width":3 });
  for (const x of [50, 172]) {
    shape("circle", { cx:x, cy:79, r:15, fill:"#10191d", stroke:"#81949b", "stroke-width":2 });
    shape("circle", { cx:x, cy:79, r:6, fill:"#91aeb1" });
  }
  return svg;
}

function art(product) {
  return product.spec ? vector(product.spec) : el("span", symbols[product.kind], "modal-symbol");
}

function performanceOf(id, stage = state.upgrades[id] ?? 0) {
  const spec = stock[id].spec;
  return { ...spec, speed:spec.speed + stage * 9, sprint:Math.max(12, spec.sprint - stage * 2) };
}

function carStats(id, stage) {
  const spec = performanceOf(id, stage);
  const list = el("dl", undefined, "data");
  for (const [name, value] of [
    ["Sürət", spec.speed + " km/saat"],
    ["0–100", (spec.sprint / 10).toFixed(1).replace(".", ",") + " san"],
    ["Lüks", spec.luxury + "/100"],
    ["Rahatlıq", spec.comfort + "/100"]
  ]) {
    const box = el("div");
    box.append(el("dt", name), el("dd", value));
    list.append(box);
  }
  return list;
}

function bestCar() {
  return state.owned.filter(id => stock[id].spec).map(id => {
    const spec = performanceOf(id);
    return { id, spec, score:spec.speed * 10 - spec.sprint * 5 };
  }).sort((a, b) => b.score - a.score)[0];
}

function portfolio() {
  const body = el("div");
  body.append(el("p", state.cityProfile.bio || "Bio əlavə edilməyib."),
    el("p", "Əmlak dəyəri · " + kr(valueOfAssets())));
  const grid = el("div", undefined, "grid");
  for (const kind of kinds) {
    const owned = state.owned.filter(id => stock[id].kind === kind);
    const group = panel(kind + " · " + owned.length, owned.length ? "" : "Bu kateqoriyada əşya yoxdur.");
    const list = el("ul");
    list.append(...owned.map(id => el("li", stock[id].name + " · " + kr(stock[id].price))));
    if (owned.length) group.append(list);
    grid.append(group);
  }
  body.append(grid);
  details(state.name, el("span", state.cityProfile.emblem, "modal-symbol"), body);
}

function home(root, grid) {
  const score = panel(state.cityProfile.emblem + " " + state.name, "Bu brauzerdəki oyunçu");
  score.classList.add("leader");
  const wealth = el("strong", kr(state.cash + state.bank + valueOfAssets()));
  wealth.id = "wealth";
  score.append(wealth, el("p", state.owned.length + " əşya"), btn("Əmlak portfeli", portfolio));
  root.append(score);

  const reward = panel("Gündəlik mükafat", "Bakı vaxtı ilə gündə bir dəfə 150 kredit.");
  const claimed = state.daily === day();
  reward.append(btn(claimed ? "Götürülüb" : "150 kredit götür", () => {
    if (state.daily === day() || !allowAction()) return;
    state.daily = day();
    state.cash += 150;
    notice("Gündəlik mükafat alındı.");
  }, { disabled:claimed }));
  grid.append(reward);

  for (const [title, text] of [
    ["Xəritə", "Məhəllələri kəşf et və pasporta möhür vur."],
    ["Yarış", "Qarajındakı ən sürətli avtomobillə məşqə çıx."],
    ["Qaraj", "Maşınlarının göstəricilərini və təkmilləşdirmələrini yoxla."]
  ]) {
    const box = panel(title, text);
    box.append(btn("Bölməni aç", () => go(title)));
    grid.append(box);
  }
}

function jobPage(grid) {
  jobs.forEach(([name, salary, xp], index) => {
    const box = panel(name, kr(salary) + " / 10 saniyə · " + xp + " XP");
    const active = state.shift?.job === index;
    box.append(btn(active ? "Növbəni dayandır" : "İşə başla", () => {
      if (!allowAction()) return;
      settle();
      if (active) {
        state.shift = null;
        task = null;
        notice("Növbə dayandırıldı.");
      } else if (!state.shift && state.xp >= xp) {
        const now = Date.now();
        state.shift = { job:index, start:now, paid:now, until:now+LEASE };
        notice(name + " növbəsi başladı.");
      }
    }, { disabled:!active && (Boolean(state.shift) || state.xp < xp) }));
    grid.append(box);
  });
}

function market(root, grid) {
  const filters = actions(...["Hamısı", ...kinds].map(kind => {
    const filter = btn(kind, () => { category = kind; render(); }, { secondary:true });
    filter.setAttribute("aria-pressed", String(kind === category));
    return filter;
  }));
  filters.classList.add("filters");
  root.append(filters);
  stock.forEach((product, id) => {
    if (category !== "Hamısı" && product.kind !== category) return;
    const box = panel(product.name, product.kind + " · " + kr(product.price));
    if (product.spec) box.prepend(vector(product.spec));
    const owned = state.owned.includes(id);
    box.append(btn(owned ? "Sənindir" : "Məhsula bax", () => {
      const body = el("div");
      const status = el("p");
      status.setAttribute("role", "status");
      if (product.spec) body.append(carStats(id, 0));
      if (product.income) body.append(el("p", "Oflayn gəlir · " + kr(product.income) + " / gün"));
      body.append(el("p", kr(product.price)), btn("Alışı təsdiqlə", () => {
        if (!allowAction(text => { status.textContent = text; })) return;
        settle();
        if (state.owned.includes(id)) { status.textContent = "Bu əşya artıq sənindir."; return; }
        if (state.cash < product.price) { status.textContent = "Cüzdanda kifayət qədər kredit yoxdur."; return; }
        state.cash -= product.price;
        state.owned.push(id);
        if (product.income) state.business[id] = day() - 1;
        $("modal").close();
        notice(product.name + " alındı.");
      }), status);
      details(product.name, art(product), body);
    }, { disabled:owned }));
    grid.append(box);
  });
}

function ownedPage(grid, onlyCars) {
  const visible = state.owned.filter(id => !onlyCars || stock[id].spec);
  if (!visible.length) {
    const empty = panel("Kolleksiya boşdur", "Mağazadan ilk əşyanı seç.");
    empty.append(btn("Mağazaya keç", () => go("Mağaza")));
    grid.append(empty);
    return;
  }

  for (const id of visible) {
    const product = stock[id];
    const box = panel(product.name, product.kind + " · " + kr(product.price));
    const buttons = actions();
    if (product.spec) {
      box.prepend(vector(product.spec));
      const stage = state.upgrades[id] ?? 0;
      const required = (stage + 1) * 5;
      const cost = Math.max(200, Math.floor(product.price * (.035 + stage * .025)));
      box.append(carStats(id), el("p", "Təkmilləşdirmə · " + stage + " / 4"));
      buttons.append(btn(
        stage >= 4 ? "Maksimum pillə" : level() < required ? "Lazım olan səviyyə · " + required : "Təkmilləşdir · " + kr(cost),
        () => {
          if (!allowAction() || !state.owned.includes(id)) return;
          settle();
          if ((state.upgrades[id] ?? 0) !== stage || stage >= 4 || level() < required) return;
          if (state.cash < cost) { tell("Təkmilləşdirmə üçün kredit çatmır."); return; }
          state.cash -= cost;
          state.upgrades[id] = stage + 1;
          notice(product.name + " · " + (stage + 1) + "/4 pillə açıldı.");
        }, { disabled:stage >= 4 || level() < required }
      ));
    }

    if (product.income) {
      const days = Math.min(7, Math.max(0, day() - (state.business[id] ?? day() - 1)));
      box.append(el("p", "Sən oflayn olanda da gəlir yığılır. Hazır gəlir · " + kr(days * product.income)));
      buttons.append(btn("Gəliri götür", () => {
        if (!allowAction() || !state.owned.includes(id)) return;
        const unpaid = Math.min(7, Math.max(0, day() - (state.business[id] ?? day() - 1)));
        if (!unpaid) return;
        state.cash += unpaid * product.income;
        state.business[id] = day();
        notice("Biznes gəliri · " + kr(unpaid * product.income));
      }, { disabled:days === 0 }));
    } else {
      const active = state.equipped[product.kind] === id;
      buttons.append(btn(active ? "Aktivdir" : "Aktiv seç", () => {
        if (!allowAction() || !state.owned.includes(id)) return;
        state.equipped[product.kind] = id;
        notice(product.name + " aktiv seçildi.");
      }, { disabled:active, secondary:true }));
    }

    const resale = Math.floor(product.price * .65);
    buttons.append(btn("Sat · " + kr(resale), () => {
      if (!state.owned.includes(id) || !confirm(product.name + " satılsın?")) return;
      if (!allowAction()) return;
      state.cash += resale;
      state.owned = state.owned.filter(value => value !== id);
      delete state.upgrades[id];
      if (state.equipped[product.kind] === id) delete state.equipped[product.kind];
      notice(product.name + " satıldı.");
    }, { secondary:true }));

    box.append(buttons);
    grid.append(box);
  }
}

function bank(root) {
  const box = panel("Şəhər bankı", "Kreditlərini bank və cüzdan arasında köçür.");
  const label = el("label", "Məbləğ, kredit");
  const input = el("input");
  input.id = "amount";
  input.type = "number";
  input.min = "1";
  input.step = "1";
  label.htmlFor = input.id;
  function move(from, to) {
    if (!allowAction()) return;
    settle();
    const value = Number(input.value);
    if (!Number.isSafeInteger(value) || value < 1 || value > state[from]) {
      tell("Məbləği və balansı yoxla.");
      return;
    }
    state[from] -= value;
    state[to] += value;
    notice(kr(value) + " köçürüldü.");
  }
  box.append(label, actions(input, btn("Banka yatır", () => move("cash", "bank")),
    btn("Bankdan çıxar", () => move("bank", "cash"), { secondary:true })));
  root.append(box);
}

function mapPage(root) {
  const canvas = el("canvas");
  canvas.width = 710;
  canvas.height = 375;
  canvas.tabIndex = 0;
  canvas.setAttribute("aria-label", "Şəhər xəritəsi. Ox düymələri ilə hərəkət et.");
  const side = panel("Məhəllə pasportu", state.visited.length + " / 6 möhür");
  const location = el("div");
  location.id = "map-place";
  const ctx = canvas.getContext("2d");
  let target = [...locationPoint];
  let lastPlace;

  function draw() {
    if (ctx) {
      ctx.fillStyle = "#16313e";
      ctx.fillRect(0, 0, 710, 375);
      ctx.fillStyle = "#235565";
      ctx.fillRect(639, 0, 71, 375);
      ctx.lineWidth = 17;
      ctx.strokeStyle = "#415a63";
      for (const [a,b,c,d] of [
        [65,90,630,90], [65,190,630,190], [65,250,630,250],
        [118,55,118,347], [350,48,350,348], [520,52,520,344]
      ]) {
        ctx.beginPath(); ctx.moveTo(a,b); ctx.lineTo(c,d); ctx.stroke();
      }
      ctx.fillStyle = "#36634f";
      ctx.fillRect(265, 282, 122, 77);
      ctx.font = "650 16px system-ui";
      ctx.textAlign = "center";
      for (const [id,name,x,y] of places) {
        ctx.fillStyle = state.visited.includes(id) ? "#a7efd9" : "#ffda96";
        ctx.beginPath(); ctx.arc(x,y,8,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = "#f0faf7"; ctx.fillText(name,x,y-15);
      }
      ctx.strokeStyle = "#a7efd9";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(...locationPoint,12,0,Math.PI*2); ctx.stroke();
    }

    const place = places.find(([, , x, y]) => Math.hypot(locationPoint[0]-x, locationPoint[1]-y) < 20);
    if (place?.[0] === lastPlace && location.children.length) return;
    lastPlace = place?.[0];
    if (!place) { location.replaceChildren(el("p", "Məhəlləyə yaxınlaş.")); return; }
    const [id, name, , , destination] = place;
    location.replaceChildren(el("h3", name), actions(
      btn(state.visited.includes(id) ? "Pasportda var" : "Möhür vur", () => {
        if (state.visited.includes(id) || !allowAction()) return;
        state.visited.push(id);
        notice(name + " pasporta əlavə olundu.");
      }, { disabled:state.visited.includes(id) }),
      btn("Bölməyə keç", () => go(destination), { secondary:true })
    ));
  }

  function animate() {
    if (!canvas.isConnected) { mapFrame = 0; return; }
    const dx = target[0] - locationPoint[0], dy = target[1] - locationPoint[1];
    const length = Math.hypot(dx, dy);
    if (length <= 7) { locationPoint = [...target]; mapFrame = 0; }
    else {
      locationPoint = [locationPoint[0]+dx/length*7, locationPoint[1]+dy/length*7];
      mapFrame = requestAnimationFrame(animate);
    }
    draw();
  }

  function move(x, y) {
    target = [Math.max(16, Math.min(694, x)), Math.max(16, Math.min(359, y))];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { locationPoint = [...target]; draw(); }
    else if (!mapFrame) mapFrame = requestAnimationFrame(animate);
  }

  canvas.addEventListener("click", event => {
    const rect = canvas.getBoundingClientRect();
    move((event.clientX - rect.left) / rect.width * 710, (event.clientY - rect.top) / rect.height * 375);
  });
  canvas.addEventListener("keydown", event => {
    const step = { ArrowLeft:[-20,0], ArrowRight:[20,0], ArrowUp:[0,-20], ArrowDown:[0,20] }[event.key];
    if (!step) return;
    event.preventDefault();
    move(target[0]+step[0], target[1]+step[1]);
  });

  side.append(actions(...places.map(([,name,x,y]) => btn(name, () => move(x,y), { secondary:true }))), location);
  const box = el("div", undefined, "map-layout");
  box.append(canvas, side);
  root.append(box);
  draw();
}

function shuffled(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function taskPage(root) {
  const box = panel("Növbə masası", "Dörd düzgün addımı seç və ardıcıllığını təsdiqlə.");
  root.append(box);
  if (!state.shift) { box.append(btn("İş birjasına keç", () => go("İş"))); return; }

  if (!task) {
    const status = el("p");
    status.id = "task-ready";
    const start = btn("Bilet götür", () => {
      const now = Date.now();
      settle(now);
      if (!state.shift || now < Math.max(state.shift.start + TICK, state.taskReady ?? 0)) return;
      if (state.taskDay === day() && state.taskCount >= 8) return;
      if (!allowAction()) return;
      const correct = tickets[state.shift.job];
      task = { correct, choices:shuffled([...correct, "Bileti sil", "İşi yarıda saxla"]),
        steps:[], until:now+90_000, job:state.shift.job };
      state.taskReady = now + 25_000;
      save();
      render();
    });
    start.id = "task-start";
    box.append(status, start);
    tickTask();
    return;
  }

  const current = task;
  const clock = el("p");
  clock.id = "task-clock";
  const order = el("ol");
  const choices = actions();
  const send = btn("Ardıcıllığı göndər", () => {
    settle();
    if (!state.shift || task !== current || Date.now() >= current.until || current.steps.length !== 4 || !allowAction()) return;
    const good = current.steps.every((choice,index) => choice === current.correct[index]);
    task = null;
    if (!good) { notice("Ardıcıllıq səhv idi. Yeni bileti sına."); return; }
    if (state.taskDay !== day()) { state.taskDay = day(); state.taskCount = 0; }
    state.taskCount = (state.taskCount ?? 0) + 1;
    state.totalTasks++;
    state.xp += 3;
    const pay = jobs[current.job][1] * 5;
    state.cash += pay;
    notice("Tapşırıq tamamlandı · " + kr(pay) + " və 3 XP.");
  });

  function refresh() {
    order.replaceChildren(...current.steps.map(step => el("li", step)));
    for (const button of choices.children) {
      button.setAttribute("aria-pressed", String(current.steps.includes(button.textContent)));
    }
    send.disabled = current.steps.length !== 4;
  }
  for (const choice of current.choices) choices.append(btn(choice, () => {
    const index = current.steps.indexOf(choice);
    if (index >= 0) current.steps.splice(index, 1);
    else if (current.steps.length < 4) current.steps.push(choice);
    refresh();
  }, { secondary:true }));
  box.append(clock, choices, order, send);
  refresh();
  tickTask();
}

function tickTask() {
  if (screen !== "Tapşırıqlar" || !state.shift) return;
  if (task && $("task-clock")) {
    $("task-clock").textContent = Math.max(0, Math.ceil((task.until - Date.now()) / 1000)) + " saniyə";
  } else if ($("task-ready")) {
    const wait = Math.max(0, Math.ceil((Math.max(state.shift.start + TICK, state.taskReady ?? 0)-Date.now())/1000));
    const count = state.taskDay === day() ? state.taskCount ?? 0 : 0;
    $("task-ready").textContent = wait ? "Yeni biletə " + wait + " saniyə" : "Bu gün · " + count + " / 8";
    $("task-start").disabled = wait > 0 || count >= 8;
  }
}

function racePage(root) {
  const arena = el("div", undefined, "arena");
  const header = el("h3", "Sahil trası · tək sürücülü məşq");
  const clock = el("strong", "", "clock");
  clock.id = "race-clock";
  arena.append(header, clock);
  root.append(arena);

  const candidate = race ?? bestCar();
  if (!candidate) {
    const empty = panel("Maşın tələb olunur", "Yarış üçün salondan bir avtomobil al.");
    empty.append(btn("Salona keç", () => { category = "Maşın"; go("Mağaza"); }));
    root.append(empty);
    tickRace();
    return;
  }

  const road = el("div", undefined, "road");
  const driving = vector(candidate.spec);
  driving.id = "driving";
  road.append(driving);
  root.append(road, el("p", stock[candidate.id].name + " · " + candidate.spec.speed + " km/saat", "race-label"));

  if (!race) {
    root.append(btn("Məşqə qoşul", () => {
      const next = bestCar();
      const currentWave = wave();
      if (!next || state.lastRaceWave === currentWave || !allowAction()) return;
      const starts = Date.now() + 10_000;
      race = { id:next.id, spec:next.spec, starts, ends:starts + 24_000 };
      state.lastRaceWave = currentWave;
      notice("Məşq başladı. Starta 10 saniyə.");
    }, { disabled:state.lastRaceWave === wave() }));
  } else if (Date.now() >= race.ends) {
    root.append(btn("Məşqi bağla", () => { race = null; render(); }, { secondary:true }));
  }
  root.append(el("p", "Yerli məşq nəticəsi ortaq reytinqə yazılmır və kredit mükafatı vermir."));
  tickRace();
}

function tickRace() {
  const now = Date.now();
  const clock = $("race-clock");
  const seconds = Math.max(0, Math.ceil(((wave() + 1) * WAVE - now) / 1000));
  if (!race || now >= race.ends) {
    $("invite-text").textContent = state.lastRaceWave === wave()
      ? "Növbəti dəvətə " + Math.floor(seconds / 60) + " dəq " + seconds % 60 + " san"
      : bestCar() ? "Məşq dəvəti açıqdır." : "Dəvəti istifadə etmək üçün maşın al.";
  } else {
    $("invite-text").textContent = now < race.starts
      ? "Starta " + Math.ceil((race.starts - now) / 1000) + " saniyə"
      : "Məşq yarışı gedir.";
  }
  if (clock) clock.textContent = !race ? "HAZIR" : now < race.starts
    ? Math.ceil((race.starts - now) / 1000) : now < race.ends ? "YARIŞ" : "FİNİŞ";
  const vehicle = $("driving");
  if (vehicle && race) vehicle.style.left = Math.min(80, Math.max(0, (now - race.starts) / (race.ends - race.starts) * 80)) + "%";
  if (race && now >= race.ends && !race.finished) {
    race.finished = true;
    if (screen === "Yarış") render();
  }
}

function goalPage(grid) {
  for (const [id, title, progress, target, reward] of [
    ["first-shift", "İlk növbə · 10 XP", state.xp, 10, 80],
    ["first-buy", "İlk alış", state.owned.length, 1, 120],
    ["bank", "Ehtiyat fondu · 500 kredit", state.bank, 500, 200],
    ["home", "Öz açarın · bir ev", countKind("Ev"), 1, 350],
    ["car", "İlk qaraj · bir maşın", countKind("Maşın"), 1, 260],
    ["wardrobe", "Şəhər tərzi · üç geyim", countKind("Geyim"), 3, 460],
    ["districts", "Bələdçi · altı məhəllə", state.visited.length, 6, 500],
    ["tasks", "Növbə ustası · beş bilet", state.totalTasks, 5, 650],
    ["business", "Sahibkar · bir biznes", countKind("Biznes"), 1, 1800],
    ["veteran", "Şəhər veteranı · 1200 XP", state.xp, 1200, 5000]
  ]) {
    const box = panel(title, Math.min(progress,target) + " / " + target);
    const meter = el("progress", undefined, "progress");
    meter.max = target;
    meter.value = Math.min(progress,target);
    meter.setAttribute("aria-label", title);
    const claimed = state.claimed.includes(id);
    box.append(meter, btn(claimed ? "Götürülüb" : kr(reward) + " götür", () => {
      if (state.claimed.includes(id) || !allowAction()) return;
      state.claimed.push(id);
      state.cash += reward;
      notice("Hədəf mükafatı · " + kr(reward));
    }, { disabled:claimed || progress < target }));
    grid.append(box);
  }
}

function profile(grid) {
  const summary = panel(state.cityProfile.emblem + " " + state.name, state.cityProfile.bio);
  summary.append(btn("Əmlak portfeli", portfolio));
  const form = el("form", undefined, "panel editor");
  const name = el("input"), bio = el("textarea"), badge = el("select");
  name.value = state.name;
  name.maxLength = 22;
  bio.value = state.cityProfile.bio;
  bio.maxLength = 160;
  bio.rows = 3;
  for (const emblem of emblems) {
    const option = el("option", emblem);
    option.value = emblem;
    badge.append(option);
  }
  badge.value = state.cityProfile.emblem;
  for (const [labelText, field, id] of [["Ləqəb",name,"edit-name"], ["Bio",bio,"edit-bio"], ["Nişan",badge,"edit-badge"]]) {
    const label = el("label", labelText);
    field.id = id;
    label.htmlFor = id;
    form.append(label, field);
  }
  form.append(el("button", "Profili saxla"));
  form.addEventListener("submit", event => {
    event.preventDefault();
    const value = name.value.trim().normalize("NFC");
    if (!validName(value)) { tell("Ləqəb 3–22 hərf, rəqəm, tire və ya alt xətdən ibarət olmalıdır."); return; }
    if (!allowAction()) return;
    state.name = value;
    state.cityProfile = { bio:bio.value.trim().slice(0, 160), emblem:badge.value };
    notice("Profil saxlanıldı.");
  });
  const history = panel("Son əməliyyatlar", "");
  const list = el("ul");
  list.append(...state.history.map(event => el("li", event.text)));
  history.append(list);
  grid.append(summary, form, history);
}

function render() {
  $("entry").hidden = Boolean(state);
  $("game").hidden = !state;
  if (!state) return;
  if (mapFrame) cancelAnimationFrame(mapFrame);
  mapFrame = 0;
  $("player").textContent = "Oyunçu · " + state.name;
  $("tabs").replaceChildren(...tabs.map(([icon, title]) => {
    const option = btn(icon + " " + title, () => go(title), { secondary:true });
    option.setAttribute("aria-pressed", String(screen === title));
    return option;
  }));
  const root = $("screen");
  const title = el("h2", screen);
  title.id = "title";
  title.tabIndex = -1;
  root.replaceChildren(title);
  const grid = el("div", undefined, "grid");

  switch (screen) {
    case "Şəhər": home(root, grid); break;
    case "Xəritə": mapPage(root); break;
    case "Yarış": racePage(root); break;
    case "İş": jobPage(grid); break;
    case "Tapşırıqlar": taskPage(root); break;
    case "Mağaza": market(root, grid); break;
    case "Qaraj": ownedPage(grid, true); break;
    case "Bank": bank(root); break;
    case "Əmlakım": ownedPage(grid, false); break;
    case "Hədəflər": goalPage(grid); break;
    case "Kabinet": profile(grid); break;
  }
  if (grid.children.length) root.append(grid);
  balances();
  tickRace();
}

$("invite-action").addEventListener("click", () => go("Yarış"));
$("entry").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("nickname").value.trim().normalize("NFC");
  if (!validName(name)) {
    $("entry-status").textContent = "3–22 hərf, rəqəm, tire və ya alt xətt yaz.";
    return;
  }
  state = normalize({ name, cash:300, bank:0, xp:0, owned:[] });
  notice("Şəhərə xoş gəldin.");
});

if (settle()) save();
render();
setInterval(heartbeat, 25_000);
setInterval(() => {
  if (!state) return;
  const working = Boolean(state.shift);
  if (settle()) save();
  if (working && !state.shift) render();
  if (task && Date.now() >= task.until) {
    task = null;
    notice("İş biletinin vaxtı bitdi.");
  }
  balances();
  tickRace();
  tickTask();
}, 1000);
