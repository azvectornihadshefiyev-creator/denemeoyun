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
export function vehicleDrawing(spec = {}) {
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
export function displaySpecs(item, stage = 0) {
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

export function setupRacing({ api, getPlayer, refresh }) {
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
    const stage = waiting
      ? "waiting"
      : running
        ? spot && !race.boosted
          ? "boost"
          : "running"
        : race
          ? "finished"
          : "idle";
    const arena = $("race-clock").closest(".race-arena");
    if (arena.dataset.stage !== stage) {
      arena.dataset.stage = stage;
      for (const marker of arena.querySelectorAll("[data-race-stage]")) {
        if (marker.dataset.raceStage === stage)
          marker.setAttribute("aria-current", "step");
        else marker.removeAttribute("aria-current");
      }
      $("race-phase-status").textContent = {
        waiting: "Start gözlənilir.",
        running: "Yarış gedir.",
        boost: "Sürətlənmə açıqdır.",
        finished: "Yarış bitdi.",
        idle: "Növbəti yarışı gözlə.",
      }[stage];
    }
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
