"use strict";

const $ = id => document.getElementById(id);
const KEY = "obsidian-city-github-demo";
const PROFILES_KEY = KEY + "-profiles";
const profileKey = name => name.toLocaleLowerCase("az");
let profiles = new Map();
try {
  const records = JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]");
  profiles = new Map(records.filter(record => typeof record?.name === "string" && validProfileName(record.name))
    .map(record => [profileKey(record.name), record]));
} catch {}

const TICK = 10_000;
const LEASE = 75_000;
const MAX_SHIFT = 8 * 3_600_000;
const WAVE = 5 * 60_000;
const format = new Intl.NumberFormat("az-AZ");
const kr = value => format.format(value) + " kredit";
const day = () => Math.floor((Date.now() + 4 * 3_600_000) / 86_400_000);
const wave = () => Math.floor(Date.now() / WAVE);
function validProfileName(name) { return /^[\p{L}\p{N}_-]{3,22}$/u.test(name); }
const validName = validProfileName;
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
