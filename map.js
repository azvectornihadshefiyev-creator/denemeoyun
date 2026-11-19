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
export function cityMap(canvas, onArrival) {
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
  function finishMove() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    position = [...destination];
    paint();
    report();
  }
  const still = () =>
    quiet.matches || document.documentElement.dataset.motion === "off";
  function animate(now) {
    if (still() || canvas.closest("[hidden]")) {
      finishMove();
      return;
    }
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
    if (still() || canvas.closest("[hidden]")) finishMove();
    else if (!frame) frame = requestAnimationFrame(animate);
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
