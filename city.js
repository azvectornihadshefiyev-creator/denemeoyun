import { demoFetch } from "./demo-api.js";
import { setupExpeditions } from "./expedition-ui.js?v=1";
import { setupPlaza } from "./plaza.js?v=2";
import { vehicleDrawing, displaySpecs, setupRacing } from "./racing.js?v=3";
import { cityMap } from "./map.js?v=2";
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
    error.retryAfter = Number(response.headers.get("Retry-After"));
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
  plaza.setVisible(false);
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
  plaza.setVisible(false);
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
  get("logout-all").hidden = get("logout").hidden;
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
    return true;
  } catch (error) {
    if (error.gate || error.status === 401) showEntryError(error);
    else feedback(error.message, true);
  } finally {
    busy = false;
  }
}
const chosenPlans = new Map();

function operationDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? minutes + " dəq " + remainder + " san" : remainder + " san";
}

function updateOperationTimers() {
  const now = secondsNow();
  for (const card of get("operation-queue").querySelectorAll("[data-ends]")) {
    const seconds = Math.max(0, Number(card.dataset.ends) - now);
    card.querySelector("progress").value =
      Number(card.dataset.ends) - Number(card.dataset.started) - seconds;
    card.querySelector(".operation-time").textContent = seconds
      ? operationDuration(seconds) + " qalıb"
      : "Təhvilə hazır";
    card.querySelector("button").disabled = seconds > 0;
  }
}

function drawOperations() {
  const board = data.operations;
  if (!board) return;
  get("profile-operations").textContent =
    board.rank +
    " · " +
    board.completed +
    " təhvil · " +
    board.reputation +
    " nüfuz";
  if (screen !== "operations") return;
  const focused = document.activeElement?.dataset.operationFocus;
  get("operation-metrics").replaceChildren(
    node("strong", board.rank + " · " + board.reputation + " nüfuz"),
    node("span", board.queue.length + " / " + board.openSlots + " icra yeri"),
    node("span", "Xalis gəlir " + units(board.net)),
  );
  get("operation-queue").replaceChildren(
    ...board.queue.map((order) => {
      const card = panel(order.title, order.district + " · " + order.plan);
      card.dataset.ends = order.ends;
      card.dataset.started = order.started;
      const progress = node("progress");
      progress.max = order.ends - order.started;
      progress.setAttribute("aria-label", order.title);
      const claim = button("Təhvil ver · " + units(order.payout), () =>
        action("operation-claim", { order: order.id }),
      );
      claim.dataset.operationFocus = order.id;
      card.append(progress, node("p", "", "operation-time"), claim);
      return card;
    }),
  );
  if (!board.queue.length)
    get("operation-queue").append(node("p", "İcrada olan sifariş yoxdur."));
  get("operation-board").replaceChildren(
    ...board.offers.map((offer) => {
      const card = panel(
        offer.title,
        offer.brief,
        offer.district + " · " + offer.level + "-ci səviyyə",
      );
      card.classList.add("operation-card");
      const select = node("select");
      select.setAttribute("aria-label", offer.title + " üçün çatdırılma planı");
      select.dataset.operationFocus = offer.id;
      for (const plan of offer.plans) {
        const option = node("option", plan.name);
        option.value = plan.id;
        select.append(option);
      }
      select.value = chosenPlans.get(offer.id) ?? offer.plans[0].id;
      select.disabled = offer.accepted;
      const details = node("p");
      const accept = button("Sifarişi qəbul et", () => {
        const plan = offer.plans.find(({ id }) => id === select.value);
        if (
          confirm(
            offer.title +
              " · " +
              plan.name +
              " · xərc " +
              units(plan.cost) +
              ". Qəbul edirsən?",
          )
        )
          action("operation-start", {
            day: board.day,
            offer: offer.id,
            plan: plan.id,
          });
      });
      accept.dataset.operationFocus = offer.id + "-accept";
      const describe = () => {
        const plan = offer.plans.find(({ id }) => id === select.value);
        details.textContent =
          operationDuration(plan.seconds) +
          " · Xərc " +
          units(plan.cost) +
          " · Xalis gəlir " +
          units(plan.payout - plan.cost) +
          " · +" +
          offer.reputation +
          " nüfuz · +" +
          offer.xp +
          " XP";
        const unavailable = offer.accepted
          ? "Bu gün qəbul edilib"
          : data.level < offer.level
            ? "Səviyyə çatmır"
            : board.queue.length >= board.openSlots
              ? "İcra yeri doludur"
              : data.player.cash < plan.cost
                ? "Kredit çatmır"
                : "";
        accept.disabled = Boolean(unavailable);
        accept.textContent = unavailable || "Sifarişi qəbul et";
      };
      select.onchange = () => {
        chosenPlans.set(offer.id, select.value);
        describe();
      };
      describe();
      card.append(select, details, accept);
      return card;
    }),
  );
  get("operation-history").replaceChildren(
    ...board.recent.map((entry) =>
      node(
        "li",
        entry.title +
          " · " +
          entry.plan +
          " · +" +
          units(entry.net) +
          " · " +
          date.format(entry.at * 1000),
      ),
    ),
  );
  if (!board.recent.length)
    get("operation-history").append(
      node("li", "İlk sifarişini təhvil verəndə burada görünəcək."),
    );
  updateOperationTimers();
  if (focused)
    [...get("operations").querySelectorAll("[data-operation-focus]")]
      .find(
        (control) =>
          control.dataset.operationFocus === focused && !control.disabled,
      )
      ?.focus();
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
  drawOperations();
  expeditions.update(data.expedition, data.accountId);
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
const rankingLabels = {
  wealth: "Sərvət",
  assets: "Əmlak sayı",
  xp: "Təcrübə",
  operations: "Sifariş nüfuzu",
  expedition: "Ekspedisiya xalları",
};
let rankingPage = 1;
let rankingRequest = 0;
let typingTimer;
function raceScore(player, sort) {
  if (sort === "expedition") return money.format(player.medals) + " xal";
  if (sort === "operations") return money.format(player.reputation) + " nüfuz";
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
              if (sort === "operations")
                collection.append(
                  node("span", "Təhvil " + money.format(player.deliveries)),
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
    ...(document.body.dataset.demo === "true" ? [] : ["plaza"]),
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
    "operations",
    "expedition",
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
  plaza.setVisible(screen === "plaza");
  if (screen === "ranking") ranking();
  if (screen === "projects") drawProjects();
  if (screen === "operations") drawOperations();
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
async function logout(path) {
  if (busy) return;
  busy = true;
  try {
    await api(path, {});
    showCityGate("login");
    get("gate").scrollIntoView({ block: "center" });
  } catch (error) {
    feedback(error.message, true);
  } finally {
    busy = false;
  }
}
get("logout").addEventListener("click", () => logout("session/logout"));
get("logout-all").addEventListener("click", () => {
  if (
    confirm("Bütün cihazlarda Obsidian City sessiyalarını bağlamaq istəyirsən?")
  )
    logout("session/logout-all");
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
    if (screen === "operations") updateOperationTimers();
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

const plaza = setupPlaza(api);
const expeditions = setupExpeditions(action);
load();
ranking();
setInterval(() => {
  if (!document.hidden) ranking();
}, 10000);
