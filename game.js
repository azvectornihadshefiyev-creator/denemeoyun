"use strict";

const $ = id => document.getElementById(id);
const saveKey = "obsidian-city-github-demo";
const tick = 10_000;
const maxShift = 8 * 3_600_000;
const format = new Intl.NumberFormat("az-AZ");
const credits = value => format.format(value) + " kredit";
const today = () => Math.floor((Date.now() + 4 * 3_600_000) / 86_400_000);

const jobs = [
  ["Kuryer", 6, 0],
  ["Barista", 9, 20],
  ["Mexanik", 15, 80],
  ["Dizayner", 23, 200],
  ["Mühəndis", 34, 450],
  ["Layihə rəhbəri", 50, 900],
];

// İlk 15 məhsulun sırası əvvəlki oyunla eynidir.
const stock = [
  ["Sahil studiyası", "Ev", 1250],
  ["Mərkəz loftu", "Ev", 6200],
  ["Terraslı mənzil", "Ev", 14200],
  ["Sahil villası", "Ev", 95000],
  ["Şəhər hetçbeki", "Maşın", 950],
  ["Klassik kupe", "Maşın", 4800],
  ["Elektrik sedanı", "Maşın", 12600],
  ["Sahil GT", "Maşın", 33000],
  ["Şəhər paltosu", "Geyim", 180],
  ["İdman ayaqqabısı", "Geyim", 270],
  ["Studiya gödəkçəsi", "Geyim", 630],
  ["Maliyyə kostyumu", "Geyim", 1650],
  ["Məhəllə kafesi", "Biznes", 9500, 320],
  ["Dizayn studiyası", "Biznes", 23500, 850],
  ["Təmir emalatxanası", "Biznes", 42000, 1600],
  ["Panorama mənzili", "Ev", 38000],
  ["Vista 4×4", "Maşın", 52000],
  ["Sahil saatı", "Geyim", 3400]
];

const icons = { Ev: "⌂", Maşın: "▰", Geyim: "◇", Biznes: "▥" };

const districts = [
  { id: "center", name: "Mərkəz", x: 350, y: 195, target: "İş", desc: "Şəhərin iş birjası burada yerləşir." },
  { id: "shore", name: "Sahil", x: 590, y: 273, target: "Mağaza", desc: "Sahil evlərinə və yeni avtomobillərə bax." },
  { id: "bank", name: "Maliyyə", x: 530, y: 90, target: "Bank", desc: "Pulunu saxla və yığımını böyüt." },
  { id: "garage", name: "Qaraj", x: 118, y: 274, target: "Əmlakım", desc: "Şəxsi kolleksiyanı burada idarə et." },
  { id: "cafe", name: "Kafe rayonu", x: 190, y: 100, target: "Tapşırıqlar", desc: "Aktiv növbədə iş bileti götür." },
  { id: "park", name: "Şəhər parkı", x: 338, y: 344, target: "Hədəflər", desc: "Şəhər hədəflərinə və mükafatlarına bax." }
];

const tasks = [
  ["Bağlamanı çatdır", ["Bağlamanı yoxla", "Marşrutu seç", "Ünvana çatdır", "Qəbzi təsdiqlə"], ["Bağlamanı aç", "Marşrutu ləğv et"]],
  ["Kafe sifarişini hazırla", ["Sifarişi oxu", "Qəhvəni üyüt", "İçkini hazırla", "Fincanı təqdim et"], ["Sifarişi sil", "Fincanı boşalt"]],
  ["Qaraj yoxlaması", ["Maşını qəbul et", "Nasazlığı tap", "Hissəni dəyiş", "Yekun sınağı apar"], ["Açarı itir", "Sınağı ləğv et"]],
  ["Şəhər afişasını hazırla", ["Tapşırığı oxu", "Eskiz çək", "Maketi hazırla", "Faylı təhvil ver"], ["Mətni sil", "Faylı bağla"]],
  ["Şəbəkəni yoxla", ["Ölçünü götür", "Nasazlığı tap", "Parametri tənzimlə", "Sınağı qeyd et"], ["Ölçünü sil", "Şəbəkəni bağla"]],
  ["Layihəni təhvil ver", ["Hədəfi müəyyən et", "Komandanı bölüşdür", "Nəticəni yoxla", "Layihəni təhvil ver"], ["Büdcəni sil", "Planı at"]]
];

const goals = [
  ["first-shift", "İlk növbə", "10 XP topla.", 10, 80, s => s.xp],
  ["first-buy", "İlk alış", "Mağazadan bir əşya al.", 1, 120, s => s.owned.length],
  ["bank", "Ehtiyat fondu", "Bankda 500 kredit saxla.", 500, 200, s => s.bank],
  ["home", "Öz açarın", "Bir ev al.", 1, 350, s => countOwned(s, "Ev")],
  ["car", "İlk qaraj", "Bir maşın al.", 1, 260, s => countOwned(s, "Maşın")],
  ["wardrobe", "Şəhər tərzi", "Üç geyim al.", 3, 460, s => countOwned(s, "Geyim")],
  ["districts", "Şəhər bələdçisi", "Altı məhəlləni pasporta əlavə et.", 6, 500, s => s.visited.length],
  ["tasks", "Növbə ustası", "Beş iş bileti tamamla.", 5, 650, s => s.totalTasks],
  ["business", "Sahibkar", "Bir biznes al.", 1, 1800, s => countOwned(s, "Biznes")],
  ["veteran", "Şəhər veteranı", "1 200 XP topla.", 1200, 5000, s => s.xp]
];

let state = read();
let screen = "Şəhər";
let category = "Hamısı";
let selectedProduct = null;
let taskSelection = [];
let drawMap = null;
let playerPosition = { x: 350, y: 195 };
let mapDestination = null;
let mapFrame = 0;

function read() {
  try {
    const old = JSON.parse(localStorage.getItem(saveKey));
    if (!old?.name || !Array.isArray(old.owned)) return null;
    return normalize(old);
  } catch {
    return null;
  }
}

function normalize(old) {
  const valid = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
  const owned = [...new Set(old.owned.filter(id => Number.isInteger(id) && stock[id]))];
  const priorShift = old.shift;
  const shift = priorShift && jobs[priorShift.job] &&
    Number.isFinite(priorShift.start) && Number.isFinite(priorShift.paid) &&
    priorShift.paid >= priorShift.start ? priorShift : null;

  return {
    ...old,
    cash: valid(old.cash),
    bank: valid(old.bank),
    xp: valid(old.xp),
    owned,
    shift,
    business: old.business && typeof old.business === "object" ? old.business : {},
    visited: Array.isArray(old.visited)
      ? [...new Set(old.visited.filter(id => districts.some(d => d.id === id)))] : [],
    claimed: Array.isArray(old.claimed) ? old.claimed : [],
    equipped: old.equipped && typeof old.equipped === "object" ? old.equipped : {},
    history: Array.isArray(old.history) ? old.history.slice(0, 18) : [],
    totalTasks: valid(old.totalTasks),
    taskCount: valid(old.taskCount),
    taskDay: valid(old.taskDay),
    taskReady: valid(old.taskReady),
    task: old.task ?? null
  };
}

function save() {
  try {
    localStorage.setItem(saveKey, JSON.stringify(state));
  } catch {
    message("Brauzer yaddaşı əlçatan deyil. Bu sessiyadakı dəyişikliklər saxlanmaya bilər.");
  }
}

function countOwned(player, kind) {
  return player.owned.filter(id => stock[id][1] === kind).length;
}

function settle(now = Date.now()) {
  const shift = state?.shift;
  if (!shift) return false;
  const end = shift.start + maxShift;
  const turns = Math.max(0, Math.floor((Math.min(now, end) - shift.paid) / tick));
  state.cash += turns * jobs[shift.job][1];
  state.xp += turns;
  shift.paid += turns * tick;

  if (now >= end) {
    state.shift = null;
    state.task = null;
  }
  return Boolean(turns || !state.shift);
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(label, action, disabled = false, secondary = false) {
  const node = element("button", label, secondary ? "secondary" : "");
  node.type = "button";
  node.disabled = disabled;
  node.addEventListener("click", action);
  return node;
}

function panel(title, description) {
  const card = element("article", undefined, "panel");
  card.append(element("h3", title));
  if (description) card.append(element("p", description));
  return card;
}

function icon(kind) {
  const symbol = element("span", icons[kind] || "◆", "asset-icon");
  symbol.setAttribute("aria-hidden", "true");
  return symbol;
}

function message(text) {
  $("message").textContent = text;
}

function finish(text) {
  state.history.unshift({ text, time: Date.now() });
  state.history = state.history.slice(0, 18);
  message(text);
  save();
  render();
}

function go(next) {
  screen = next;
  message("");
  render();
  $("screen-title").focus();
}

function showBalances() {
  $("cash").textContent = credits(state.cash);
  $("bank").textContent = credits(state.bank);
  $("xp").textContent = format.format(state.xp) + " XP";
  const shift = state.shift;
  const next = shift ? Math.max(1, Math.ceil((shift.paid + tick - Date.now()) / 1000)) : 0;
  $("shift").textContent = shift ? jobs[shift.job][0] + " · " + next + " san" : "Dayanıb";
}

function showCity(grid) {
  const daily = panel("☀ Gündəlik mükafat", "Bakı vaxtı ilə hər gün 150 kredit.");
  const claimed = state.daily === today();
  daily.append(button(claimed ? "Götürülüb" : "150 kredit götür", () => {
    if (state.daily === today()) return;
    state.daily = today();
    state.cash += 150;
    finish("Gündəlik 150 kredit əlavə olundu.");
  }, claimed));
  grid.append(daily);

  for (const [title, description, destination] of [
    ["⌖ Şəhər xəritəsi", "Xəritədə gəz və altı məhəlləyə möhür vur.", "Xəritə"],
    ["▣ Növbə masası", "Peşən üzrə vaxtlı tapşırıqları həll et.", "Tapşırıqlar"],
    ["◇ Mağaza", "Ev, maşın, geyim və biznes seç.", "Mağaza"],
    ["★ Hədəflər", "Şəhərdə irəlilə və mükafat qazan.", "Hədəflər"]
  ]) {
    const card = panel(title, description);
    card.append(button("Bölməni aç", () => go(destination)));
    grid.append(card);
  }
}

function showJobs(grid) {
  jobs.forEach(([name, pay, minimum], job) => {
    const card = panel(name, credits(pay) + " / 10 saniyə · " + minimum + " XP");
    if (state.shift?.job === job) {
      const actions = element("div", undefined, "actions");
      actions.append(
        button("Növbəni dayandır", () => {
          settle();
          state.shift = null;
          state.task = null;
          taskSelection = [];
          finish("Növbə dayandırıldı.");
        }),
        button("Növbə masası", () => go("Tapşırıqlar"), false, true)
      );
      card.append(actions);
    } else {
      card.append(button("İşə başla", () => {
        const now = Date.now();
        state.shift = { job, start: now, paid: now };
        finish(name + " növbəsi başladı.");
      }, Boolean(state.shift) || state.xp < minimum));
    }
    grid.append(card);
  });
}

function showMap(root) {
  const layout = element("div", undefined, "map-layout");
  const map = element("canvas");
  map.width = 710;
  map.height = 405;
  map.tabIndex = 0;
  map.setAttribute("aria-label", "Şəhər xəritəsi. Ox düymələri ilə hərəkət et.");
  const side = panel("Məhəllə pasportu", "Xəritəyə toxun və ya ox düymələrindən istifadə et.");
  side.classList.add("map-panel");
  const count = element("p");
  const controls = element("div", undefined, "actions");
  const location = element("div");
  const ctx = map.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let near;

  function refreshLocation() {
    const current = districts.find(district =>
      Math.hypot(district.x - playerPosition.x, district.y - playerPosition.y) < 20
    );

    count.textContent = state.visited.length + " / " + districts.length + " möhür";
    if (near === current?.id && location.children.length) return;
    near = current?.id;

    if (!current) {
      location.replaceChildren(element("p", "Möhür üçün məhəllə nöqtəsinə yaxınlaş."));
      return;
    }

    const done = state.visited.includes(current.id);
    const links = element("div", undefined, "actions");
    links.append(
      button(done ? "Pasportda var" : "Möhür vur", () => {
        if (state.visited.includes(current.id)) return;
        state.visited.push(current.id);
        finish(current.name + " pasporta əlavə olundu.");
      }, done),
      button("Məhəlləyə daxil ol", () => go(current.target), false, true)
    );
    location.replaceChildren(element("h3", current.name), element("p", current.desc), links);
  }

  function paint() {
    if (!ctx) return;
    ctx.fillStyle = "#142631";
    ctx.fillRect(0, 0, 710, 405);
    ctx.fillStyle = "#1e4652";
    ctx.beginPath();
    ctx.moveTo(657, 0);
    ctx.lineTo(710, 0);
    ctx.lineTo(710, 405);
    ctx.lineTo(480, 405);
    ctx.lineTo(647, 317);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#354a58";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    for (const [x1, y1, x2, y2] of [
      [64, 94, 634, 94], [64, 194, 640, 194], [64, 275, 632, 275],
      [118, 65, 118, 355], [350, 48, 350, 366], [530, 58, 530, 350]
    ]) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.fillStyle = "#2d4959";
    for (const [x, y, w, h] of [
      [145, 126, 85, 42], [257, 125, 58, 45], [391, 120, 84, 54],
      [152, 217, 75, 34], [270, 218, 47, 36], [380, 218, 94, 35],
      [154, 311, 69, 36], [385, 312, 72, 44], [560, 130, 50, 34]
    ]) ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "#325a48";
    ctx.fillRect(277, 296, 115, 81);

    ctx.font = "700 16px system-ui";
    ctx.textAlign = "center";
    for (const district of districts) {
      ctx.fillStyle = state.visited.includes(district.id) ? "#a6efd5" : "#f4c788";
      ctx.beginPath();
      ctx.arc(district.x, district.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#142631";
      ctx.lineWidth = 4;
      ctx.strokeText(district.name, district.x, district.y - 16);
      ctx.fillStyle = "#f4fbff";
      ctx.fillText(district.name, district.x, district.y - 16);
    }

    ctx.strokeStyle = "#d9fff8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(playerPosition.x, playerPosition.y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#5adfff";
    ctx.beginPath();
    ctx.arc(playerPosition.x, playerPosition.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate() {
    if (!mapDestination || !map.isConnected) {
      mapFrame = 0;
      return;
    }
    const dx = mapDestination.x - playerPosition.x;
    const dy = mapDestination.y - playerPosition.y;
    const distance = Math.hypot(dx, dy);
    const step = 7;

    if (distance <= step) {
      playerPosition = { ...mapDestination };
      mapDestination = null;
      mapFrame = 0;
    } else {
      playerPosition.x += dx / distance * step;
      playerPosition.y += dy / distance * step;
      mapFrame = requestAnimationFrame(animate);
    }

    paint();
    refreshLocation();
  }

  function move(x, y) {
    mapDestination = {
      x: Math.max(18, Math.min(690, x)),
      y: Math.max(18, Math.min(385, y))
    };
    if (reduced) {
      playerPosition = { ...mapDestination };
      mapDestination = null;
      paint();
      refreshLocation();
    } else if (!mapFrame) {
      mapFrame = requestAnimationFrame(animate);
    }
  }

  map.addEventListener("click", event => {
    const box = map.getBoundingClientRect();
    move((event.clientX - box.left) / box.width * map.width,
      (event.clientY - box.top) / box.height * map.height);
  });
  map.addEventListener("keydown", event => {
    const direction = { ArrowUp: [0, -23], ArrowDown: [0, 23], ArrowLeft: [-23, 0], ArrowRight: [23, 0] }[event.key];
    if (!direction) return;
    event.preventDefault();
    const from = mapDestination ?? playerPosition;
    move(from.x + direction[0], from.y + direction[1]);
  });

  for (const district of districts) {
    controls.append(button(district.name, () => move(district.x, district.y), false, true));
  }
  side.append(count, controls, location);
  layout.append(map, side);
  root.append(layout);
  drawMap = paint;
  paint();
  refreshLocation();
}

function shuffle(list) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function showTask(root) {
  const card = panel("▣ Növbə masası", "Dörd addımı düzgün sıraya düz. Artıq addımlar da var.");
  const shift = state.shift;
  const now = Date.now();
  const completed = state.taskDay === today() ? state.taskCount : 0;

  if (!shift) {
    card.append(element("p", "Əvvəl aktiv növbə başlat."),
      button("İş birjasına keç", () => go("İş")));
    root.append(card);
    return;
  }

  const task = state.task;
  if (!task) {
    const availableAt = Math.max(shift.start + tick, state.taskReady);
    const wait = Math.max(0, Math.ceil((availableAt - now) / 1000));
    const status = element("p", "", "task-clock");
    status.id = "task-clock";
    const next = button("Bilet götür", () => {
      const stamp = Date.now();
      if (!state.shift || stamp < availableAt || completed >= 8) return;
      const [title, answer, decoys] = tasks[state.shift.job];
      state.task = { title, answer, options: shuffle([...answer, ...decoys]), expires: stamp + 90_000 };
      state.taskReady = stamp + 25_000;
      taskSelection = [];
      finish("Yeni iş bileti götürüldü.");
    }, wait > 0 || completed >= 8);
    next.id = "next-ticket";
    next.dataset.ready = String(availableAt);
    next.dataset.limit = String(completed >= 8);

    status.textContent = completed >= 8 ? "Bugünkü 8 bilet tamamlanıb."
      : wait ? "Növbəti biletə " + wait + " saniyə" : "Bu gün tamamladın: " + completed + " / 8";
    card.append(status, next);
    root.append(card);
    return;
  }

  const clock = element("p", Math.max(0, Math.ceil((task.expires - now) / 1000)) + " saniyə", "task-clock");
  clock.id = "task-clock";
  const options = element("div", undefined, "actions");
  const order = element("ol", undefined, "task-steps");

  function redrawChoices() {
    order.replaceChildren(...taskSelection.map(index => element("li", task.options[index])));
    for (const [index, option] of [...options.children].entries()) {
      const number = taskSelection.indexOf(index);
      option.textContent = (number >= 0 ? (number + 1) + ". " : "") + task.options[index];
      option.setAttribute("aria-pressed", String(number >= 0));
    }
    submit.disabled = taskSelection.length !== task.answer.length;
  }

  const submit = button("Ardıcıllığı göndər", () => {
    if (!state.shift || state.task !== task || Date.now() >= task.expires) return;
    if (taskSelection.length !== task.answer.length) return;
    const correct = taskSelection.every((index, position) => task.options[index] === task.answer[position]);
    state.task = null;
    taskSelection = [];
    if (!correct) {
      finish("Addım sırası səhv idi. Növbəti bileti sına.");
      return;
    }
    if (state.taskDay !== today()) {
      state.taskDay = today();
      state.taskCount = 0;
    }
    const pay = jobs[state.shift.job][1] * 5;
    state.taskCount++;
    state.totalTasks++;
    state.cash += pay;
    state.xp += 3;
    finish("Tapşırıq tamamlandı · " + credits(pay) + " və 3 XP.");
  });

  task.options.forEach((label, index) => {
    options.append(button(label, () => {
      const position = taskSelection.indexOf(index);
      if (position >= 0) taskSelection.splice(position, 1);
      else if (taskSelection.length < task.answer.length) taskSelection.push(index);
      redrawChoices();
    }, false, true));
  });
  const actions = element("div", undefined, "actions");
  actions.append(button("Təmizlə", () => { taskSelection = []; redrawChoices(); }, false, true), submit);
  card.append(element("h3", task.title), clock, options, order, actions);
  root.append(card);
  redrawChoices();
}

function openProduct(id) {
  selectedProduct = id;
  const [name, kind, price, income] = stock[id];
  $("product-title").textContent = name;
  $("product-icon").replaceChildren(icon(kind));
  $("product-price").textContent = credits(price) + (income ? " · Gündəlik gəlir " + credits(income) : "");
  $("product-error").textContent = "";
  $("product-dialog").showModal();
}

function showMarket(root, grid) {
  const filters = element("div", undefined, "actions store-filters");
  for (const kind of ["Hamısı", "Ev", "Maşın", "Geyim", "Biznes"]) {
    const filter = button(kind, () => {
      category = kind;
      render();
      $("screen").querySelector(".store-filters [aria-pressed=true]")?.focus();
    }, false, true);
    filter.setAttribute("aria-pressed", String(category === kind));
    filters.append(filter);
  }
  root.append(filters);

  stock.forEach(([name, kind, price, income], id) => {
    if (category !== "Hamısı" && category !== kind) return;
    const owned = state.owned.includes(id);
    const card = panel(name, kind + " · " + credits(price) +
      (income ? " · Gəlir " + credits(income) + "/gün" : ""));
    card.prepend(icon(kind));
    card.append(button(owned ? "Sənindir" : "Məhsula bax", () => openProduct(id), owned));
    grid.append(card);
  });
}

function showAssets(grid) {
  if (!state.owned.length) {
    const empty = panel("Kolleksiyan boşdur", "İlk əşyanı şəhər mağazasında seç.");
    empty.append(button("Mağazanı aç", () => go("Mağaza")));
    grid.append(empty);
    return;
  }

  for (const id of state.owned) {
    const [name, kind, price, income] = stock[id];
    const card = panel(name, kind + " · " + credits(price));
    card.prepend(icon(kind));
    const actions = element("div", undefined, "actions");

    if (income) {
      const claimed = state.business[id] === today();
      actions.append(button(claimed ? "Gəlir götürülüb" : "Gəliri götür", () => {
        if (state.business[id] === today()) return;
        state.business[id] = today();
        state.cash += income;
        finish("Biznes gəliri · " + credits(income));
      }, claimed));
    } else {
      const active = state.equipped[kind] === id;
      actions.append(button(active ? "Aktivdir" : "Aktiv seç", () => {
        state.equipped[kind] = id;
        finish(name + " aktiv seçildi.");
      }, active));
    }

    const resale = Math.floor(price * .65);
    actions.append(button("Sat · " + credits(resale), () => {
      if (!confirm(name + " satılsın?")) return;
      state.cash += resale;
      state.owned = state.owned.filter(item => item !== id);
      if (state.equipped[kind] === id) delete state.equipped[kind];
      finish(name + " satıldı.");
    }, false, true));

    card.append(actions);
    grid.append(card);
  }
}

function showBank(root) {
  const form = element("form", undefined, "panel");
  const label = element("label", "Məbləğ, kredit");
  label.htmlFor = "bank-amount";
  const input = element("input");
  input.id = "bank-amount";
  input.type = "number";
  input.min = "1";
  input.step = "1";

  function move(from, to) {
    settle();
    const amount = Number(input.value);
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > state[from]) {
      message("Məbləği və mövcud balansı yoxla.");
      return;
    }
    state[from] -= amount;
    state[to] += amount;
    finish(credits(amount) + " köçürüldü.");
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    move("cash", "bank");
  });

  const actions = element("div", undefined, "actions");
  actions.append(input, button("Banka yatır", () => move("cash", "bank")),
    button("Bankdan çıxar", () => move("bank", "cash"), false, true));
  form.append(label, actions);
  root.append(form);
}

function showGoals(grid) {
  for (const [id, name, description, target, reward, measure] of goals) {
    const progress = Math.min(target, measure(state));
    const claimed = state.claimed.includes(id);
    const card = panel(name, description + " " + progress + " / " + target);
    const meter = element("progress", undefined, "progress");
    meter.max = target;
    meter.value = progress;
    meter.setAttribute("aria-label", name);
    card.append(meter, button(claimed ? "Mükafat götürülüb" : credits(reward) + " götür", () => {
      if (state.claimed.includes(id) || measure(state) < target) return;
      state.claimed.push(id);
      state.cash += reward;
      finish(name + " · " + credits(reward) + " mükafat.");
    }, claimed || progress < target));
    grid.append(card);
  }
}

function showProfile(grid) {
  const ownedValue = state.owned.reduce((sum, id) => sum + stock[id][2], 0);
  const profile = panel(state.name, "Ümumi sərvət · " + credits(state.cash + state.bank + ownedValue));
  profile.append(element("p", state.owned.length + " əşya · " + state.totalTasks + " iş bileti"));
  for (const kind of ["Ev", "Maşın", "Geyim"]) {
    const id = state.equipped[kind];
    profile.append(element("p", kind + " · " + (state.owned.includes(id) ? stock[id][0] : "Seçilməyib")));
  }

  const label = element("label", "Ləqəbi dəyiş");
  label.htmlFor = "change-name";
  const input = element("input");
  input.id = "change-name";
  input.value = state.name;
  input.maxLength = 22;
  profile.append(label, input, button("Saxla", () => {
    const name = input.value.trim().normalize("NFC");
    if (!validName(name)) { message("Ləqəb 3–22 hərf, rəqəm, alt xətt və ya tire ola bilər."); return; }
    state.name = name;
    finish("Ləqəb dəyişdirildi.");
  }));

  const history = panel("Son əməliyyatlar", state.history.length ? "" : "İlk əməliyyatın burada görünəcək.");
  const list = element("ul");
  for (const event of state.history) list.append(element("li", event.text));
  history.append(list);
  grid.append(profile, history);
}

function render() {
  $("entry").hidden = Boolean(state);
  $("game").hidden = !state;
  if (!state) return;

  if (mapFrame) cancelAnimationFrame(mapFrame);
  mapFrame = 0;
  mapDestination = null;
  drawMap = null;

  showBalances();
  $("player").textContent = "Oyunçu · " + state.name;
  const tabs = [
    ["◆", "Şəhər"], ["⌖", "Xəritə"], ["▤", "İş"], ["▣", "Tapşırıqlar"],
    ["◇", "Mağaza"], ["▥", "Bank"], ["⌂", "Əmlakım"], ["★", "Hədəflər"], ["◉", "Kabinet"]
  ];
  $("tabs").replaceChildren(...tabs.map(([symbol, label]) => {
    const tab = button(symbol + " " + label, () => go(label), false, true);
    tab.setAttribute("aria-pressed", String(label === screen));
    return tab;
  }));

  const root = $("screen");
  const title = element("h2", screen);
  title.id = "screen-title";
  title.tabIndex = -1;
  root.replaceChildren(title);
  const grid = element("div", undefined, "grid");

  if (screen === "Şəhər") showCity(grid);
  if (screen === "Xəritə") showMap(root);
  if (screen === "İş") showJobs(grid);
  if (screen === "Tapşırıqlar") showTask(root);
  if (screen === "Mağaza") showMarket(root, grid);
  if (screen === "Bank") showBank(root);
  if (screen === "Əmlakım") showAssets(grid);
  if (screen === "Hədəflər") showGoals(grid);
  if (screen === "Kabinet") showProfile(grid);

  if (grid.children.length) root.append(grid);
}

function validName(name) {
  return /^[\p{L}\p{N}_-]{3,22}$/u.test(name);
}

$("entry").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("nickname").value.trim().normalize("NFC");
  if (!validName(name)) {
    $("entry-error").textContent = "3–22 hərf, rəqəm, alt xətt və ya tire yaz.";
    return;
  }
  state = normalize({ name, cash: 300, bank: 0, xp: 0, owned: [], shift: null });
  finish("Şəhərə xoş gəldin.");
});

$("confirm-buy").addEventListener("click", () => {
  const id = selectedProduct;
  if (id === null || !stock[id]) return;
  settle();
  const [name, , price] = stock[id];

  if (state.owned.includes(id)) {
    $("product-error").textContent = "Bu əşya artıq sənindir.";
    return;
  }
  if (state.cash < price) {
    $("product-error").textContent = "Cüzdanda kifayət qədər kredit yoxdur.";
    return;
  }

  state.cash -= price;
  state.owned.push(id);
  $("product-dialog").close();
  selectedProduct = null;
  finish(name + " alındı.");
  const balance = $("cash").parentElement;
  balance.classList.remove("received");
  requestAnimationFrame(() => balance.classList.add("received"));
});

if (settle()) save();
render();

setInterval(() => {
  if (!state) return;
  const now = Date.now();
  const working = Boolean(state.shift);
  if (settle(now)) save();

  if (working && !state.shift) {
    taskSelection = [];
    render();
    return;
  }
  if (state.task && now >= state.task.expires) {
    state.task = null;
    taskSelection = [];
    finish("İş biletinin vaxtı bitdi.");
    return;
  }

  showBalances();
  if (screen !== "Tapşırıqlar") return;
  const status = $("task-clock");
  if (!status) return;

  if (state.task) {
    status.textContent = Math.max(0, Math.ceil((state.task.expires - now) / 1000)) + " saniyə";
    return;
  }

  const next = $("next-ticket");
  if (!next || next.dataset.limit === "true") return;
  const wait = Math.max(0, Math.ceil((Number(next.dataset.ready) - now) / 1000));
  const completed = state.taskDay === today() ? state.taskCount : 0;
  next.disabled = wait > 0;
  status.textContent = wait ? "Növbəti biletə " + wait + " saniyə" : "Bu gün tamamladın: " + completed + " / 8";
}, 1000);
