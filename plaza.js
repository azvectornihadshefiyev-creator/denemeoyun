const locations = [
  "Sahil",
  "Bağlar",
  "Kitabxana",
  "Mərkəz",
  "Körpü",
  "Festival",
];
const reactions = ["", "👋", "👏", "✦"];
const plazaGet = (id) => document.getElementById("plaza-" + id);

function plazaNode(tag, content, className) {
  const node = document.createElement(tag);
  if (content) node.textContent = content;
  if (className) node.className = className;
  return node;
}

export function setupPlaza(api) {
  if (document.body.dataset.demo === "true") {
    plazaGet("tab").hidden = true;
    plazaGet("card").hidden = true;
    return { setVisible() {} };
  }
  let visible = false;
  let joined = false;
  let zone = 0;
  let reaction = 0;
  let busy = false;
  let pausedUntil = 0;
  let challenge;
  let answer = [];
  let snapshotAt = 0;
  let serverTime = 0;
  let revealTimer;
  let departure = false;
  let touched = false;
  const toggle = plazaGet("toggle");
  const status = plazaGet("status");
  const reactionsPanel = plazaGet("reactions");
  const zones = locations.map((name, index) => {
    const cell = plazaNode("article", "", "plaza-location");
    const move = plazaNode("button", name, "secondary");
    const players = plazaNode("ul", "", "plaza-players");
    move.type = "button";
    move.disabled = true;
    move.onclick = () => {
      if (!joined || zone === index || busy) return;
      zone = index;
      refresh();
    };
    cell.append(move, players);
    return { cell, move, players };
  });
  plazaGet("zones").replaceChildren(...zones.map(({ cell }) => cell));

  function controls() {
    toggle.textContent = joined ? "Meydanı tərk et" : "Meydana qoşul";
    reactionsPanel.hidden = !joined;
    zones.forEach(({ move }, index) => {
      move.disabled = !joined || busy;
      move.setAttribute("aria-pressed", String(joined && zone === index));
    });
    const active = joined && challenge?.result === null;
    plazaGet("reveal").disabled = !active;
    plazaGet("reset").disabled = !active || !answer.length;
    plazaGet("send").disabled =
      !active ||
      !touched ||
      answer.length !== challenge.sequence.length ||
      busy;
    for (const option of plazaGet("options").children)
      option.disabled =
        !active || !touched || answer.length >= challenge.sequence.length;
  }

  function drawAnswer() {
    plazaGet("answer").textContent = answer.length
      ? answer.map((index) => challenge.options[index]).join(" › ")
      : "";
    controls();
  }

  function drawChallenge(next) {
    const changed =
      next.round !== challenge?.round || next.result !== challenge?.result;
    challenge = next;
    plazaGet("rule").textContent = next.title + " · " + next.rule;
    if (!changed) return;
    clearTimeout(revealTimer);
    answer = [];
    touched = false;
    plazaGet("sequence").textContent =
      next.result === 1
        ? "Düzgün cavab. Festivala 1 xal yazıldı."
        : next.result === 0
          ? "Bu raundun cəhdi istifadə edildi."
          : "";
    plazaGet("options").replaceChildren(
      ...next.options.map((label, index) => {
        const button = plazaNode("button", label, "secondary");
        button.type = "button";
        button.onclick = () => {
          answer.push(index);
          drawAnswer();
        };
        return button;
      }),
    );
    drawAnswer();
  }

  function draw(snapshot) {
    snapshotAt = performance.now();
    serverTime = snapshot.time;
    zones.forEach(({ players }, index) => {
      const guests = snapshot.crowd.filter(
        (player) => player.zone === index && !player.mine,
      );
      players.replaceChildren(
        ...(joined && zone === index
          ? [plazaNode("li", "Sən", "plaza-self")]
          : []),
        ...guests.map(({ nickname, reaction }) =>
          plazaNode(
            "li",
            (reactions[reaction] ? reactions[reaction] + " " : "") + nickname,
          ),
        ),
      );
    });
    drawChallenge(snapshot.challenge);
    plazaGet("festival").value = snapshot.festival.points;
    plazaGet("goals").textContent =
      snapshot.festival.points +
      " xal · mərhələlər " +
      snapshot.festival.targets
        .map(
          (target) => target + (snapshot.festival.points >= target ? " ✓" : ""),
        )
        .join(" / ");
    plazaGet("ranking").replaceChildren(
      ...snapshot.leaders.map(({ nickname, points, mine }) =>
        plazaNode(
          "li",
          nickname + (mine ? " · sən" : "") + " · " + points + " xal",
        ),
      ),
    );
    if (!snapshot.leaders.length)
      plazaGet("ranking").append(
        plazaNode("li", "İlk düzgün cavab gözlənilir."),
      );
    clock();
  }

  function clock() {
    if (!challenge) return;
    const left = Math.max(
      0,
      challenge.ends -
        serverTime -
        Math.floor((performance.now() - snapshotAt) / 1000),
    );
    plazaGet("clock").textContent =
      "Raundun sonuna " +
      Math.floor(left / 60) +
      ":" +
      String(left % 60).padStart(2, "0");
  }

  async function refresh(submit = false) {
    if (busy || !visible || document.hidden || Date.now() < pausedUntil) return;
    busy = true;
    controls();
    try {
      if (joined) await api("plaza/presence", { zone, reaction });
      reaction = 0;
      if (submit && joined) {
        const result = await api("plaza/complete", {
          round: challenge.round,
          answer,
        });
        if (!result.accepted)
          status.textContent =
            "Cəhd artıq qeydə alınıb və ya meydan sessiyan bitib.";
      }
      if (visible) draw(await api("plaza"));
    } catch (error) {
      if (error.status === 429)
        pausedUntil =
          Date.now() + 1000 * (error.retryAfter > 0 ? error.retryAfter : 10);
      status.textContent = error.message;
    } finally {
      busy = false;
      controls();
      if (departure) leave();
    }
  }

  async function leave() {
    departure = busy;
    if (busy) return;
    if (joined) return;
    try {
      await api("plaza/leave", {});
    } catch {}
  }

  toggle.onclick = () => {
    if (busy) return;
    joined = !joined;
    status.textContent = joined
      ? "Mövqeyini dəyişmək üçün xəritədə məkanı seç."
      : "Qoşulduqda ləqəbin və meydandakı mövqeyin görünür.";
    controls();
    if (joined) refresh();
    else leave().then(() => refresh());
  };
  for (const button of reactionsPanel.querySelectorAll("button")) {
    button.onclick = () => {
      if (!joined || busy) return;
      reaction = Number(button.dataset.reaction);
      refresh();
    };
  }
  plazaGet("reveal").onclick = () => {
    if (!challenge || !joined) return;
    touched = true;
    plazaGet("sequence").textContent = challenge.sequence
      .map((index) => challenge.options[index])
      .join(" › ");
    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => {
      if (challenge.result === null)
        plazaGet("sequence").textContent =
          "Nümunə gizləndi. İstəsən təkrar göstər.";
    }, 6000);
    controls();
  };
  plazaGet("reset").onclick = () => {
    answer = [];
    drawAnswer();
  };
  plazaGet("send").onclick = () => refresh(true);
  setInterval(() => {
    if (visible && !document.hidden) refresh();
  }, 4500);
  setInterval(() => {
    if (visible && !document.hidden) clock();
  }, 1000);
  document.addEventListener("visibilitychange", () => {
    if (visible && !document.hidden) refresh();
  });
  controls();
  return {
    setVisible(next) {
      if (visible === next) return;
      visible = next;
      if (next) refresh();
      else if (joined) {
        joined = false;
        controls();
        leave();
      }
    },
  };
}
