"use strict";

const $ = id => document.getElementById(id);
const KEY = "obsidian-city-github-demo";
const TICK = 10_000;
const MAX_SHIFT = 8 * 3_600_000;
const format = new Intl.NumberFormat("az-AZ");
const kr = value => format.format(value) + " kredit";
const day = () => Math.floor((Date.now() + 4 * 3_600_000) / 86_400_000);
const validName = name => /^[\p{L}\p{N}_-]{3,22}$/u.test(name);

const jobs = [
  ["Kuryer", 6, 0], ["Barista", 9, 20], ["Mexanik", 15, 80],
  ["Dizayner", 23, 200], ["Mühəndis", 34, 450], ["Layihə rəhbəri", 50, 900]
];

// İlk 15 əşyanın sırası əvvəlki versiya ilə eynidir.
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
const emblems = ["◆", "☀", "✦", "♜", "⚡", "◈"];
const places = [
  ["center", "Mərkəz", 350, 195, "İş"],
  ["shore", "Sahil", 590, 273, "Mağaza"],
  ["bank", "Maliyyə", 530, 90, "Bank"],
  ["garage", "Qaraj", 118, 274, "Əmlakım"],
  ["cafe", "Kafe rayonu", 190, 100, "Tapşırıqlar"],
  ["park", "Şəhər parkı", 338, 344, "Hədəflər"]
];
const tickets = [
  ["Bağlamanı çatdır", ["Bağlamanı yoxla", "Marşrutu seç", "Ünvana çatdır", "Qəbzi təsdiqlə"], ["Bağlamanı aç", "Marşrutu ləğv et"]],
  ["Kafe sifarişini hazırla", ["Sifarişi oxu", "Qəhvəni üyüt", "İçkini hazırla", "Fincanı təqdim et"], ["Sifarişi sil", "Fincanı boşalt"]],
  ["Qaraj yoxlaması", ["Maşını qəbul et", "Nasazlığı tap", "Hissəni dəyiş", "Yekun sınağı apar"], ["Açarı itir", "Sınağı ləğv et"]],
  ["Şəhər afişası", ["Tapşırığı oxu", "Eskiz çək", "Maketi hazırla", "Faylı təhvil ver"], ["Mətni sil", "Faylı bağla"]],
  ["Şəbəkə yoxlaması", ["Ölçünü götür", "Nasazlığı tap", "Parametri tənzimlə", "Sınağı qeyd et"], ["Ölçünü sil", "Şəbəkəni bağla"]],
  ["Layihəni təhvil ver", ["Hədəfi müəyyən et", "Komandanı bölüşdür", "Nəticəni yoxla", "Layihəni təhvil ver"], ["Büdcəni sil", "Planı at"]]
];

function normalize(saved) {
  const integer = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
  const list = value => Array.isArray(value) ? value : [];
  const shift = saved.shift;
  const task = saved.task;
  return {
    ...saved,
    cash: integer(saved.cash), bank: integer(saved.bank), xp: integer(saved.xp),
    owned: [...new Set(list(saved.owned).filter(id => Number.isInteger(id) && stock[id]))],
    shift: shift && Number.isInteger(shift.job) && jobs[shift.job] &&
      Number.isFinite(shift.start) && Number.isFinite(shift.paid) &&
      shift.paid >= shift.start ? shift : null,
    business: saved.business ?? {},
    visited: [...new Set(list(saved.visited).filter(id => places.some(place => place[0] === id)))],
    claimed: list(saved.claimed),
    equipped: saved.equipped ?? {},
    history: list(saved.history).slice(0, 18),
    totalTasks: integer(saved.totalTasks),
    taskCount: integer(saved.taskCount),
    taskReady: integer(saved.taskReady),
    task: task && Array.isArray(task.answer) && task.answer.length === 4 &&
      Array.isArray(task.options) && task.options.length === 6 &&
      Number.isFinite(task.expires) ? task : null,
    cityProfile: {
      bio: String(saved.cityProfile?.bio ?? "").slice(0, 160),
      emblem: emblems.includes(saved.cityProfile?.emblem) ? saved.cityProfile.emblem : "◆"
    }
  };
}

let state = null;
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved?.name && Array.isArray(saved.owned)) state = normalize(saved);
} catch {}

let screen = "Şəhər";
let filter = "Hamısı";
let selection = [];
let position = [350, 195];
let mapFrame = 0;
let previousWealth;

function el(tag, text, css) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (css) node.className = css;
  return node;
}
function btn(text, click, disabled = false, secondary = false) {
  const node = el("button", text, secondary ? "secondary" : "");
  node.type = "button";
  node.disabled = disabled;
  node.addEventListener("click", click);
  return node;
}
function card(title, description) {
  const node = el("article", undefined, "panel");
  node.append(el("h3", title));
  if (description) node.append(el("p", description));
  return node;
}
function actions(...children) {
  const node = el("div", undefined, "actions");
  node.append(...children);
  return node;
}
function tell(text) { $("message").textContent = text; }
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { tell("Brauzer yaddaşı əlçatan deyil. Dəyişikliklər bu sessiyada qala bilər."); }
}
function finish(text) {
  state.history.unshift({ text, time: Date.now() });
  state.history = state.history.slice(0, 18);
  tell(text);
  save();
  render();
}
function go(target) {
  screen = target;
  tell("");
  render();
  $("screen-title").focus();
}
function settle(now = Date.now()) {
  const shift = state?.shift;
  if (!shift) return false;
  const end = shift.start + MAX_SHIFT;
  const count = Math.max(0, Math.floor((Math.min(now, end) - shift.paid) / TICK));
  state.cash += count * jobs[shift.job][1];
  state.xp += count;
  shift.paid += count * TICK;
  if (now >= end) {
    state.shift = null;
    state.task = null;
    selection = [];
  }
  return count > 0 || now >= end;
}
function assetsValue() {
  return state.owned.reduce((total, id) => total + stock[id][2], 0);
}
function balances() {
  $("cash").textContent = kr(state.cash);
  $("bank").textContent = kr(state.bank);
  $("xp").textContent = format.format(state.xp) + " XP";
  const shift = state.shift;
  $("shift").textContent = shift
    ? jobs[shift.job][0] + " · " + Math.max(1, Math.ceil((shift.paid + TICK - Date.now()) / 1000)) + " san"
    : "Dayanıb";

  const wealth = state.cash + state.bank + assetsValue();
  const output = $("leader-value");
  if (output) {
    output.textContent = kr(wealth);
    if (previousWealth !== undefined && wealth > previousWealth) {
      output.classList.remove("grew");
      void output.offsetWidth;
      output.classList.add("grew");
    }
  }
  previousWealth = wealth;
}

function dialog(symbol, title, summary, content, preview = false) {
  $("dialog-icon").textContent = symbol;
  $("dialog-title").textContent = title;
  $("dialog-summary").textContent = summary;
  $("dialog-head").classList.toggle("preview", preview);
  $("dialog-body").replaceChildren(content);
  if (!$("dialog").open) $("dialog").showModal();
}

function portfolio() {
  const list = el("div", undefined, "grid");
  for (const kind of Object.keys(icons)) {
    const owned = state.owned.map(id => stock[id]).filter(item => item[1] === kind);
    const group = card(icons[kind] + " " + kind + " · " + owned.length,
      owned.length ? "" : "Bu kateqoriyada əşya yoxdur.");
    if (owned.length) {
      const details = el("ul");
      details.append(...owned.map(([name, , price]) => el("li", name + " · " + kr(price))));
      group.append(details);
    }
    list.append(group);
  }
  const bio = state.cityProfile.bio;
  dialog(state.cityProfile.emblem, state.name,
    (bio ? bio + " · " : "") + "Əmlak dəyəri " + kr(assetsValue()), list);
}

function home(root, grid) {
  const ranking = card("Şəhər reytinqi", "Bu brauzerdəki oyunçu");
  ranking.classList.add("leader");
  const value = el("strong", "", "leader-value");
  value.id = "leader-value";
  ranking.append(el("h3", state.cityProfile.emblem + " " + state.name),
    value, el("p", state.owned.length + " əşya"), btn("Əmlak portfeli", portfolio));
  root.append(ranking);

  const reward = card("Gündəlik mükafat", "Bakı vaxtı ilə gündə bir dəfə 150 kredit.");
  const claimed = state.daily === day();
  reward.append(btn(claimed ? "Götürülüb" : "150 kredit götür", () => {
    if (state.daily === day()) return;
    state.daily = day();
    state.cash += 150;
    finish("Gündəlik mükafat alındı.");
  }, claimed));
  grid.append(reward);
  for (const [title, text] of [
    ["Xəritə", "Altı məhəlləni kəşf et və pasporta möhür vur."],
    ["Tapşırıqlar", "Növbə zamanı vaxtlı iş biletlərini həll et."],
    ["Hədəflər", "Mükafat açmaq üçün şəhərdə irəlilə."]
  ]) {
    const entry = card(title, text);
    entry.append(btn("Bölməni aç", () => go(title)));
    grid.append(entry);
  }
}

function showJobs(grid) {
  jobs.forEach(([name, pay, xp], job) => {
    const entry = card(name, kr(pay) + " / 10 saniyə · " + xp + " XP");
    if (state.shift?.job === job) {
      entry.append(actions(btn("Növbəni dayandır", () => {
        settle();
        state.shift = null;
        state.task = null;
        selection = [];
        finish("Növbə dayandırıldı.");
      }), btn("Tapşırıqlara keç", () => go("Tapşırıqlar"), false, true)));
    } else {
      entry.append(btn("İşə başla", () => {
        if (state.shift || state.xp < xp) return;
        const now = Date.now();
        state.shift = { job, start: now, paid: now };
        finish(name + " növbəsi başladı.");
      }, Boolean(state.shift) || state.xp < xp));
    }
    grid.append(entry);
  });
}

function market(root, grid) {
  const labels = ["Hamısı", ...Object.keys(icons)];
  const controls = actions(...labels.map(label => {
    const option = btn(label, () => { filter = label; render(); }, false, true);
    option.setAttribute("aria-pressed", String(filter === label));
    return option;
  }));
  controls.classList.add("filters");
  root.append(controls);

  stock.forEach(([name, kind, price, income], id) => {
    if (filter !== "Hamısı" && filter !== kind) return;
    const item = card(name, kind + " · " + kr(price));
    item.prepend(el("span", icons[kind], "asset-icon"));
    const owned = state.owned.includes(id);
    item.append(btn(owned ? "Sənindir" : "Məhsula bax", () => {
      const content = el("div");
      const note = el("p");
      note.setAttribute("role", "status");
      content.append(btn("Alışı təsdiqlə", () => {
        settle();
        if (state.owned.includes(id)) { note.textContent = "Bu əşya artıq sənindir."; return; }
        if (state.cash < price) { note.textContent = "Cüzdanda kifayət qədər kredit yoxdur."; return; }
        state.cash -= price;
        state.owned.push(id);
        $("dialog").close();
        finish(name + " alındı.");
      }), note);
      dialog(icons[kind], name, kr(price) + (income ? " · Gündəlik gəlir " + kr(income) : ""), content, true);
    }, owned));
    grid.append(item);
  });
}

function assets(grid) {
  if (!state.owned.length) grid.append(card("Kolleksiya boşdur", "İlk əşyanı mağazadan al."));
  for (const id of state.owned) {
    const [name, kind, price, income] = stock[id];
    const item = card(name, kind + " · " + kr(price));
    item.prepend(el("span", icons[kind], "asset-icon"));
    const controls = actions();
    if (income) {
      const paid = state.business[id] === day();
      controls.append(btn(paid ? "Gəlir götürülüb" : "Gəliri götür", () => {
        if (state.business[id] === day() || !state.owned.includes(id)) return;
        state.business[id] = day();
        state.cash += income;
        finish("Biznes gəliri · " + kr(income));
      }, paid));
    } else {
      const active = state.equipped[kind] === id;
      controls.append(btn(active ? "Aktivdir" : "Aktiv seç", () => {
        state.equipped[kind] = id;
        finish(name + " aktiv seçildi.");
      }, active));
    }
    const resale = Math.floor(price * .65);
    controls.append(btn("Sat · " + kr(resale), () => {
      if (!state.owned.includes(id) || !confirm(name + " satılsın?")) return;
      state.cash += resale;
      state.owned = state.owned.filter(item => item !== id);
      if (state.equipped[kind] === id) delete state.equipped[kind];
      finish(name + " satıldı.");
    }, false, true));
    item.append(controls);
    grid.append(item);
  }
}

function bank(root) {
  const form = el("form", undefined, "panel");
  const label = el("label", "Məbləğ, kredit");
  const input = el("input");
  input.id = "bank-amount";
  input.type = "number";
  input.min = "1";
  input.step = "1";
  label.htmlFor = input.id;
  function move(from, to) {
    settle();
    const value = Number(input.value);
    if (!Number.isSafeInteger(value) || value < 1 || value > state[from]) {
      tell("Məbləği və balansı yoxla.");
      return;
    }
    state[from] -= value;
    state[to] += value;
    finish(kr(value) + " köçürüldü.");
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    move("cash", "bank");
  });
  form.append(label, actions(input, btn("Banka yatır", () => move("cash", "bank")),
    btn("Bankdan çıxar", () => move("bank", "cash"), false, true)));
  root.append(form);
}

function mapScreen(root) {
  const map = el("canvas");
  map.width = 710;
  map.height = 405;
  map.tabIndex = 0;
  map.setAttribute("aria-label", "Şəhər xəritəsi. Ox düymələri ilə hərəkət et.");
  const ctx = map.getContext("2d");
  const side = card("Məhəllə pasportu", "Xəritəyə toxun və ya ox düymələri ilə gəz.");
  const controls = actions();
  const location = el("div");
  location.id = "map-place";
  let target = [...position];
  let nearby;

  function draw() {
    if (ctx) {
      ctx.fillStyle = "#142631";
      ctx.fillRect(0, 0, 710, 405);
      ctx.fillStyle = "#23515c";
      ctx.fillRect(644, 0, 66, 405);
      ctx.strokeStyle = "#3a505d";
      ctx.lineWidth = 17;
      for (const [a,b,c,d] of [
        [65,94,634,94], [65,194,635,194], [65,275,635,275],
        [118,58,118,350], [350,45,350,369], [530,45,530,350]
      ]) {
        ctx.beginPath(); ctx.moveTo(a,b); ctx.lineTo(c,d); ctx.stroke();
      }
      ctx.fillStyle = "#35594b";
      ctx.fillRect(278, 303, 120, 72);
      ctx.font = "700 16px system-ui";
      ctx.textAlign = "center";
      for (const [id,name,x,y] of places) {
        ctx.fillStyle = state.visited.includes(id) ? "#a6efd5" : "#ffdc96";
        ctx.beginPath(); ctx.arc(x,y,8,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = "#f4fbff";
        ctx.fillText(name,x,y-15);
      }
      ctx.strokeStyle = "#d9fff8";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(...position,12,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle = "#5adfff";
      ctx.beginPath(); ctx.arc(...position,5,0,Math.PI*2); ctx.fill();
    }

    const place = places.find(([, , x, y]) => Math.hypot(position[0]-x, position[1]-y) < 20);
    if (nearby === place?.[0] && location.children.length) return;
    nearby = place?.[0];
    if (!place) {
      location.replaceChildren(el("p", "Möhür üçün məhəlləyə yaxınlaş."));
      return;
    }
    const [id,name,,,destination] = place;
    const stamped = state.visited.includes(id);
    location.replaceChildren(el("h3", name), actions(
      btn(stamped ? "Pasportda var" : "Möhür vur", () => {
        if (state.visited.includes(id)) return;
        state.visited.push(id);
        finish(name + " pasporta əlavə olundu.");
      }, stamped),
      btn("Məhəlləyə daxil ol", () => go(destination), false, true)
    ));
  }

  function animate() {
    if (!map.isConnected) { mapFrame = 0; return; }
    const dx = target[0] - position[0], dy = target[1] - position[1];
    const distance = Math.hypot(dx, dy);
    if (distance <= 7) {
      position = [...target];
      mapFrame = 0;
    } else {
      position = [position[0] + dx/distance*7, position[1] + dy/distance*7];
      mapFrame = requestAnimationFrame(animate);
    }
    draw();
  }
  function move(x, y) {
    target = [Math.max(16, Math.min(694, x)), Math.max(16, Math.min(389, y))];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      position = [...target];
      draw();
    } else if (!mapFrame) mapFrame = requestAnimationFrame(animate);
  }

  map.addEventListener("click", event => {
    const box = map.getBoundingClientRect();
    move((event.clientX-box.left)/box.width*710, (event.clientY-box.top)/box.height*405);
  });
  map.addEventListener("keydown", event => {
    const step = { ArrowLeft:[-23,0], ArrowRight:[23,0], ArrowUp:[0,-23], ArrowDown:[0,23] }[event.key];
    if (!step) return;
    event.preventDefault();
    move(target[0]+step[0], target[1]+step[1]);
  });
  for (const [,name,x,y] of places) controls.append(btn(name, () => move(x,y), false, true));
  side.append(el("p", state.visited.length + " / 6 möhür"), controls, location);
  const layout = el("div", undefined, "map-layout");
  layout.append(map, side);
  root.append(layout);
  draw();
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function taskScreen(root) {
  const box = card("Növbə masası", "Dörd düzgün addımı ardıcıllıqla seç.");
  root.append(box);

  if (!state.shift) {
    box.append(btn("İşə başla", () => go("İş")));
    return;
  }

  const clock = el("p", "", "clock");
  clock.id = "task-clock";
  box.append(clock);
  if (!state.task) {
    const next = btn("Bilet götür", () => {
      const now = Date.now();
      settle(now);
      if (!state.shift || now < Math.max(state.shift.start + TICK, state.taskReady)) return;
      if (state.taskDay === day() && state.taskCount >= 8) return;
      const [title, answer, decoys] = tickets[state.shift.job];
      state.task = { title, answer, options: shuffle([...answer, ...decoys]), expires: now + 90_000 };
      state.taskReady = now + 25_000;
      selection = [];
      finish("Yeni iş bileti götürüldü.");
    });
    next.id = "task-next";
    box.append(next);
    taskClock(Date.now());
    return;
  }

  const task = state.task;
  box.append(el("h3", task.title));
  const order = el("ol");
  const choices = actions();
  const send = btn("Ardıcıllığı göndər", () => {
    const now = Date.now();
    settle(now);
    if (!state.shift || state.task !== task || now >= task.expires || selection.length !== 4) return;
    const result = selection.every((index, step) => task.options[index] === task.answer[step]);
    state.task = null;
    selection = [];
    if (!result) { finish("Ardıcıllıq səhv idi. Növbəti bileti sına."); return; }
    if (state.taskDay !== day()) { state.taskDay = day(); state.taskCount = 0; }
    state.taskCount++;
    state.totalTasks++;
    const pay = jobs[state.shift.job][1] * 5;
    state.cash += pay;
    state.xp += 3;
    finish("Tapşırıq tamamlandı · " + kr(pay) + " və 3 XP.");
  });

  function redraw() {
    order.replaceChildren(...selection.map(index => el("li", task.options[index])));
    [...choices.children].forEach((choice, index) => {
      const selected = selection.indexOf(index);
      choice.textContent = (selected >= 0 ? (selected + 1) + ". " : "") + task.options[index];
      choice.setAttribute("aria-pressed", String(selected >= 0));
    });
    send.disabled = selection.length !== 4;
  }
  task.options.forEach((text, index) => {
    choices.append(btn(text, () => {
      const selected = selection.indexOf(index);
      if (selected >= 0) selection.splice(selected,1);
      else if (selection.length < 4) selection.push(index);
      redraw();
    }, false, true));
  });
  box.append(choices, order, actions(btn("Təmizlə", () => { selection = []; redraw(); }, false, true), send));
  redraw();
  taskClock(Date.now());
}

function taskClock(now) {
  const clock = $("task-clock");
  if (!clock || !state.shift) return;
  if (state.task) {
    clock.textContent = Math.max(0, Math.ceil((state.task.expires-now)/1000)) + " saniyə";
    return;
  }
  const count = state.taskDay === day() ? state.taskCount : 0;
  const wait = Math.max(0, Math.ceil((Math.max(state.shift.start + TICK, state.taskReady)-now)/1000));
  const next = $("task-next");
  if (next) next.disabled = count >= 8 || wait > 0;
  clock.textContent = count >= 8 ? "Bugünkü limit tamamlanıb."
    : wait ? "Yeni biletə " + wait + " saniyə"
    : "Bu gün · " + count + " / 8 bilet";
}

function goals(grid) {
  const owned = kind => state.owned.filter(id => stock[id][1] === kind).length;
  for (const [id,name,label,target,reward,current] of [
    ["first-shift","İlk növbə","10 XP topla.",10,80,state.xp],
    ["first-buy","İlk alış","Bir əşya al.",1,120,state.owned.length],
    ["bank","Ehtiyat fondu","Bankda 500 kredit saxla.",500,200,state.bank],
    ["home","Öz açarın","Bir ev al.",1,350,owned("Ev")],
    ["car","İlk qaraj","Bir maşın al.",1,260,owned("Maşın")],
    ["wardrobe","Şəhər tərzi","Üç geyim al.",3,460,owned("Geyim")],
    ["districts","Şəhər bələdçisi","Altı məhəlləni kəşf et.",6,500,state.visited.length],
    ["tasks","Növbə ustası","Beş bilet tamamla.",5,650,state.totalTasks],
    ["business","Sahibkar","Bir biznes al.",1,1800,owned("Biznes")],
    ["veteran","Şəhər veteranı","1200 XP topla.",1200,5000,state.xp]
  ]) {
    const progress = Math.min(current,target);
    const entry = card(name, label + " " + progress + " / " + target);
    const meter = el("progress", undefined, "progress");
    meter.max = target;
    meter.value = progress;
    meter.setAttribute("aria-label", name);
    const claimed = state.claimed.includes(id);
    entry.append(meter, btn(claimed ? "Götürülüb" : kr(reward) + " götür", () => {
      if (state.claimed.includes(id)) return;
      state.claimed.push(id);
      state.cash += reward;
      finish(name + " mükafatı götürüldü.");
    }, claimed || progress < target));
    grid.append(entry);
  }
}

function profile(root, grid) {
  const summary = card(state.cityProfile.emblem + " " + state.name,
    state.cityProfile.bio || "Bio hələ yazılmayıb.");
  for (const kind of ["Ev","Maşın","Geyim"]) {
    const id = state.equipped[kind];
    summary.append(el("p", kind + " · " + (state.owned.includes(id) ? stock[id][0] : "Seçilməyib")));
  }
  summary.append(btn("Əmlak portfeli", portfolio));

  const history = card("Son əməliyyatlar", state.history.length ? "" : "Hələ əməliyyat yoxdur.");
  const list = el("ul");
  list.append(...state.history.map(event => el("li", event.text)));
  history.append(list);

  const form = el("form", undefined, "panel editor");
  const name = el("input");
  const bio = el("textarea");
  const emblem = el("select");
  name.id = "edit-name";
  name.value = state.name;
  name.required = true;
  name.maxLength = 22;
  bio.id = "edit-bio";
  bio.value = state.cityProfile.bio;
  bio.maxLength = 160;
  bio.rows = 3;
  emblem.id = "edit-emblem";
  for (const symbol of emblems) {
    const option = el("option", symbol);
    option.value = symbol;
    emblem.append(option);
  }
  emblem.value = state.cityProfile.emblem;
  form.append(el("h3", "Profili düzəlt"));
  for (const [text,field] of [["Ləqəb",name],["Bio",bio],["Şəhər nişanı",emblem]]) {
    const label = el("label", text);
    label.htmlFor = field.id;
    form.append(label, field);
  }
  form.append(el("button", "Profili saxla"));
  form.addEventListener("submit", event => {
    event.preventDefault();
    const nickname = name.value.trim().normalize("NFC");
    if (!validName(nickname)) { tell("Ləqəb 3–22 hərf, rəqəm, alt xətt və ya tire ola bilər."); return; }
    state.name = nickname;
    state.cityProfile = { bio: bio.value.trim().slice(0,160), emblem: emblem.value };
    finish("Profil saxlanıldı.");
  });
  grid.append(summary, form, history);
}

function render() {
  $("entry").hidden = Boolean(state);
  $("game").hidden = !state;
  if (!state) return;
  if (mapFrame) cancelAnimationFrame(mapFrame);
  mapFrame = 0;

  $("player").textContent = "Oyunçu · " + state.name;
  const tabs = ["Şəhər","Xəritə","İş","Tapşırıqlar","Mağaza","Bank","Əmlakım","Hədəflər","Kabinet"];
  $("tabs").replaceChildren(...tabs.map(label => {
    const tab = btn(label, () => go(label), false, true);
    tab.setAttribute("aria-pressed", String(screen === label));
    return tab;
  }));
  const root = $("screen");
  const title = el("h2", screen);
  title.id = "screen-title";
  title.tabIndex = -1;
  root.replaceChildren(title);
  const grid = el("div", undefined, "grid");

  switch (screen) {
    case "Şəhər": home(root, grid); break;
    case "Xəritə": mapScreen(root); break;
    case "İş": showJobs(grid); break;
    case "Tapşırıqlar": taskScreen(root); break;
    case "Mağaza": market(root, grid); break;
    case "Bank": bank(root); break;
    case "Əmlakım": assets(grid); break;
    case "Hədəflər": goals(grid); break;
    case "Kabinet": profile(root, grid); break;
  }
  if (grid.children.length) root.append(grid);
  balances();
}

$("entry").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("nickname").value.trim().normalize("NFC");
  if (!validName(name)) {
    $("entry-status").textContent = "3–22 hərf, rəqəm, alt xətt və ya tire yaz.";
    return;
  }
  state = normalize({ name, cash: 300, bank: 0, xp: 0, owned: [] });
  finish("Şəhərə xoş gəldin.");
});

if (settle()) save();
render();

setInterval(() => {
  if (!state) return;
  const now = Date.now();
  const wasWorking = Boolean(state.shift);
  if (settle(now)) save();
  if (wasWorking && !state.shift) {
    render();
    return;
  }
  if (state.task && now >= state.task.expires) {
    state.task = null;
    selection = [];
    finish("İş biletinin vaxtı bitdi.");
    return;
  }
  balances();
  if (screen === "Tapşırıqlar") taskClock(now);
}, 1000);
