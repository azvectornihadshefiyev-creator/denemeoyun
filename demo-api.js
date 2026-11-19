import { expeditionView } from "./expeditions.js";
import {
  jobs,
  catalog,
  cityProjects,
  operationsView,
  carLevel,
  newPlayer,
  stateView,
  apply,
  RuleError,
  shiftLimit,
  interval,
  day,
  goals,
  cityProgress,
} from "./economy.js";

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
  return { nickname: old.name, state, activity: [] };
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
    operations: current ? operationsView(current, now) : null,
    expedition: current ? expeditionView(current, now) : null,
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
export async function demoFetch(path, options = {}) {
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
