const grades = ["", "Bürünc", "Gümüş", "Qızıl"];
const get = (id) => document.getElementById("expedition-" + id);

function element(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function control(label, callback, className = "secondary") {
  const button = element("button", label, className);
  button.type = "button";
  button.addEventListener("click", callback);
  return button;
}

export function setupExpeditions(action) {
  let view;
  let signature;
  let account;
  let selectedDistrict;
  let selectedMission;
  let route = [];
  let energy = 0;
  let next = 1;
  let sending = false;
  const grid = get("grid");
  const board = Array.from({ length: 25 }, (_, cell) =>
    control("", () => move(cell), "expedition-cell"),
  );
  grid.replaceChildren(...board);

  function choose(district, mission) {
    selectedDistrict = district.id;
    selectedMission = mission.id;
    route = [mission.stops[0]];
    get("result").textContent = "";
    render();
  }

  function current() {
    const district =
      view.districts.find(({ id }) => id === selectedDistrict) ??
      view.districts[0];
    const mission =
      district.missions.find(({ id }) => id === selectedMission) ??
      district.missions[0];
    return { district, mission };
  }

  function status(district, mission) {
    energy = 0;
    next = 1;
    for (const cell of route.slice(1)) {
      energy += district.rough.includes(cell) ? 2 : 1;
      if (cell === mission.stops[next]) next++;
    }
  }

  function adjacent(from, to) {
    return (
      Math.abs((from % 5) - (to % 5)) +
        Math.abs(Math.floor(from / 5) - Math.floor(to / 5)) ===
      1
    );
  }

  function move(cell) {
    if (!view || sending) return;
    const { district, mission } = current();
    if (
      next >= mission.stops.length ||
      district.blocked.includes(cell) ||
      !adjacent(route.at(-1), cell) ||
      energy + (district.rough.includes(cell) ? 2 : 1) > mission.optimal + 6
    )
      return;
    route.push(cell);
    drawRoute(district, mission);
  }

  function drawRoute(district, mission) {
    status(district, mission);
    const visited = new Set(route);
    const last = route.at(-1);
    const finished = next >= mission.stops.length;
    const budget = mission.optimal + 6;
    let moves = 0;
    for (const [cell, button] of board.entries()) {
      const blocked = district.blocked.includes(cell);
      const rough = district.rough.includes(cell);
      const stop = mission.stops.indexOf(cell);
      const available =
        !finished &&
        !blocked &&
        adjacent(last, cell) &&
        energy + (rough ? 2 : 1) <= budget;
      if (available) moves++;
      button.dataset.cell = blocked
        ? "blocked"
        : last === cell
          ? "current"
          : visited.has(cell)
            ? "visited"
            : rough
              ? "rough"
              : "clear";
      button.dataset.next = String(!finished && stop === next);
      button.textContent = blocked
        ? "×"
        : last === cell
          ? "●"
          : stop === 0
            ? "S"
            : stop > 0
              ? String(stop)
              : rough
                ? "≈"
                : "·";
      button.setAttribute(
        "aria-label",
        Math.floor(cell / 5) +
          1 +
          "-ci sıra, " +
          ((cell % 5) + 1) +
          "-ci xana" +
          (last === cell
            ? ", mövqeyin"
            : blocked
              ? ", bağlı"
              : rough
                ? ", iki enerji"
                : ", bir enerji") +
          (stop > 0 ? ", " + stop + "-ci dayanacaq" : ""),
      );
      button.setAttribute("aria-disabled", String(!available || sending));
      button.tabIndex = available || last === cell ? 0 : -1;
    }
    get("energy").textContent =
      energy + " / " + budget + " enerji · Qızıl həddi " + mission.optimal;
    get("meter").max = budget;
    get("meter").value = energy;
    const grade =
      energy === mission.optimal ? 3 : energy <= mission.optimal + 2 ? 2 : 1;
    const canImprove = !mission.record || energy < mission.record.energy;
    const prompt = finished
      ? canImprove
        ? grades[grade] + " marşrut hazırdır. Nəticəni təsdiqlə."
        : "Bu marşrut rekordunu yaxşılaşdırmadı."
      : moves
        ? "Növbəti dayanacaq: " + next + " / " + (mission.stops.length - 1)
        : "Bu istiqamətdə enerji çatmır. Bir addım geri qayıt.";
    if (get("status").textContent !== prompt)
      get("status").textContent = prompt;
    get("undo").disabled = route.length < 2 || sending;
    get("reset").disabled = route.length < 2 || sending;
    get("finish").disabled = !finished || !canImprove || sending;
  }

  function render() {
    const { district, mission } = current();
    if (!route.length) route = [mission.stops[0]];
    const focused = document.activeElement?.dataset.expeditionChoice;
    get("districts").replaceChildren(
      ...view.districts.map((area) => {
        const count = area.missions.filter(({ record }) => record).length;
        const mastery = area.missions.every(
          ({ record }) => record?.grade === 3,
        );
        const button = control(
          area.name + " · " + count + "/5" + (mastery ? " ★" : ""),
          () =>
            choose(
              area,
              area.missions.find(
                ({ unlocked, record }) => unlocked && !record,
              ) ?? area.missions[0],
            ),
        );
        button.setAttribute("aria-pressed", String(area.id === district.id));
        button.dataset.expeditionChoice = area.id;
        button.disabled = sending;
        return button;
      }),
    );
    get("missions").replaceChildren(
      ...district.missions.map((entry, index) => {
        const title =
          index +
          1 +
          ". " +
          entry.title +
          (entry.record ? " · " + grades[entry.record.grade] : "");
        const button = control(
          entry.unlocked ? title : title + " · Bağlı",
          () => choose(district, entry),
        );
        button.disabled = !entry.unlocked || sending;
        button.setAttribute("aria-pressed", String(entry.id === mission.id));
        button.dataset.expeditionChoice = entry.id;
        return button;
      }),
    );
    get("title").textContent = mission.title;
    get("brief").textContent = mission.brief;
    const cleared = district.missions.filter(({ record }) => record).length;
    get("award").textContent =
      cleared === district.missions.length
        ? district.name + " · Məhəllə nişanı qazanılıb"
        : district.name +
          " · Məhəllə nişanı üçün " +
          (district.missions.length - cleared) +
          " missiya qalıb";
    get("record").textContent = mission.record
      ? "Rekordun: " +
        grades[mission.record.grade] +
        " · " +
        mission.record.energy +
        " enerji"
      : "Bu missiyada hələ rekordun yoxdur.";
    get("summary").textContent =
      view.completed +
      " / 30 missiya · " +
      view.mastered +
      " qızıl · " +
      view.score +
      " xal";
    grid.dataset.theme = district.theme;
    drawRoute(district, mission);
    if (focused)
      [...document.querySelectorAll("[data-expedition-choice]")]
        .find(
          (button) =>
            button.dataset.expeditionChoice === focused && !button.disabled,
        )
        ?.focus();
  }

  get("spotlight").onclick = () => {
    if (!view || sending) return;
    const district = view.districts.find(({ missions }) =>
      missions.some(({ id }) => id === view.spotlight),
    );
    if (district)
      choose(
        district,
        district.missions.find(({ id }) => id === view.spotlight),
      );
  };
  get("undo").onclick = () => {
    if (route.length < 2 || sending) return;
    route.pop();
    const { district, mission } = current();
    drawRoute(district, mission);
  };
  get("reset").onclick = () => {
    if (!view || sending) return;
    const { district, mission } = current();
    route = [mission.stops[0]];
    drawRoute(district, mission);
  };
  get("finish").onclick = async () => {
    if (sending || get("finish").disabled) return;
    const { district, mission } = current();
    sending = true;
    render();
    try {
      const saved = await action("expedition-finish", {
        district: district.id,
        mission: mission.id,
        route: [...route],
      });
      if (saved) {
        const result = get("result");
        result.textContent = mission.title + " · rekord saxlanıldı.";
        result.classList.remove("expedition-saved");
        requestAnimationFrame(() => result.classList.add("expedition-saved"));
      }
    } finally {
      sending = false;
      render();
    }
  };
  grid.addEventListener("keydown", (event) => {
    const last = route.at(-1);
    const offset = { ArrowUp: -5, ArrowDown: 5, ArrowLeft: -1, ArrowRight: 1 }[
      event.key
    ];
    if (offset === undefined) return;
    event.preventDefault();
    const cell = last + offset;
    if (cell >= 0 && cell < 25) {
      move(cell);
      if (route.at(-1) === cell) board[cell].focus();
    }
  });

  return {
    update(nextView, nextAccount) {
      if (!nextView) return;
      if (account !== nextAccount) {
        account = nextAccount;
        signature = undefined;
        selectedDistrict = undefined;
        selectedMission = undefined;
        route = [];
        get("result").textContent = "";
      }
      view = nextView;
      get("profile").textContent =
        view.completed + " / 30 missiya · " + view.score + " xal";
      const nextSignature = JSON.stringify(view);
      if (signature !== nextSignature) {
        signature = nextSignature;
        render();
      }
    },
  };
}
