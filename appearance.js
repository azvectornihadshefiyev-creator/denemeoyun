const root = document.documentElement;
const motionToggle = document.getElementById("motion-toggle");
const systemMotion = matchMedia("(prefers-reduced-motion: reduce)");
const precisePointer = matchMedia("(hover: hover) and (pointer: fine)");
let motionOverride;
try {
  motionOverride = localStorage.getItem("obsidian-appearance-motion");
} catch {}

function syncMotion() {
  const enabled = motionOverride !== "off" && !systemMotion.matches;
  root.dataset.motion = enabled ? "on" : "off";
  if (!enabled) resetHero();
  motionToggle.setAttribute("aria-pressed", String(enabled));
  motionToggle.title = systemMotion.matches
    ? "Cihazın azaldılmış hərəkət ayarı aktivdir"
    : "";
  motionToggle.disabled = systemMotion.matches;
}

motionToggle.hidden = false;
motionToggle.addEventListener("click", () => {
  motionOverride = root.dataset.motion === "on" ? "off" : "on";
  try {
    localStorage.setItem("obsidian-appearance-motion", motionOverride);
  } catch {}
  syncMotion();
});
systemMotion.addEventListener("change", syncMotion);

const world = document.getElementById("world");
const enter = document.getElementById("sky-enter");
const play = document.getElementById("sky-play");
const skyline = document.querySelector(".skyline");
if (document.body.dataset.demo === "true")
  document.getElementById("sky-ranking").hidden = true;

function syncEntry() {
  enter.hidden = !world.hidden;
  play.hidden = world.hidden;
}
new MutationObserver(syncEntry).observe(world, {
  attributes: true,
  attributeFilter: ["hidden"],
});
syncEntry();

let frame = 0;
let pointer;
function resetHero() {
  pointer = undefined;
  skyline.style.removeProperty("--scene-x");
  skyline.style.removeProperty("--scene-y");
}
skyline.addEventListener("pointerleave", resetHero);
skyline.addEventListener(
  "pointermove",
  (event) => {
    if (!precisePointer.matches || root.dataset.motion !== "on") return;
    pointer = [event.clientX, event.clientY];
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!pointer || root.dataset.motion !== "on") return;
      const box = skyline.getBoundingClientRect();
      const x = (pointer[0] - box.left) / box.width - 0.5;
      const y = (pointer[1] - box.top) / box.height - 0.5;
      skyline.style.setProperty("--scene-x", (x * 15).toFixed(1) + "px");
      skyline.style.setProperty("--scene-y", (y * 10).toFixed(1) + "px");
    });
  },
  { passive: true },
);

syncMotion();
if ("IntersectionObserver" in window)
  new IntersectionObserver(([entry]) => {
    skyline.dataset.offscreen = String(!entry.isIntersecting);
    if (!entry.isIntersecting) resetHero();
  }).observe(skyline);

const sceneChoices = ["twilight", "night", "dawn"];
const sceneControls = document.getElementById("scene-controls");
const sceneButtons = [...sceneControls.querySelectorAll("[data-scene]")];
let savedScene;
try {
  savedScene = localStorage.getItem("obsidian-city-scene");
} catch {}

function chooseScene(scene, store = false) {
  const valid = sceneChoices.includes(scene) ? scene : sceneChoices[0];
  root.dataset.scene = valid;
  for (const button of sceneButtons)
    button.setAttribute("aria-pressed", String(button.dataset.scene === valid));
  if (!store) return;
  try {
    localStorage.setItem("obsidian-city-scene", valid);
  } catch {}
}
chooseScene(savedScene);
for (const button of sceneButtons)
  button.addEventListener("click", () =>
    chooseScene(button.dataset.scene, true),
  );
sceneControls.hidden = false;

function syncVisibility() {
  root.dataset.paused = String(document.hidden);
  if (document.hidden) resetHero();
}
document.addEventListener("visibilitychange", syncVisibility);
syncVisibility();

const tabs = document.getElementById("tabs");
function revealActiveTab() {
  if (world.hidden) return;
  const active = tabs.querySelector("[aria-current='page']");
  if (!active || tabs.scrollWidth <= tabs.clientWidth) return;
  const menu = tabs.getBoundingClientRect();
  const selected = active.getBoundingClientRect();
  if (selected.left >= menu.left && selected.right <= menu.right) return;
  tabs.scrollTo({
    left: tabs.scrollLeft + selected.left - menu.left - 8,
    behavior: root.dataset.motion === "on" ? "smooth" : "instant",
  });
}
new MutationObserver(revealActiveTab).observe(tabs, {
  subtree: true,
  attributes: true,
  attributeFilter: ["aria-current"],
});
window.addEventListener("resize", revealActiveTab, { passive: true });
