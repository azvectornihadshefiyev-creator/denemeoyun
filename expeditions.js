// Cell numbers follow a five-by-five grid, starting in its upper-left corner.
const expeditionDistricts = [
  {
    id: "center",
    name: "Mərkəz",
    theme: "copper",
    blocked: [6, 8, 16],
    rough: [1, 7, 12, 17],
    missions: [
      ["Səhər poçtu", "Məktubları poçt məntəqəsinə apar.", [0, 4]],
      [
        "Bazar qəbzi",
        "Bazar anbarından qəbzi götür, meydanda təhvil ver.",
        [3, 11, 24],
      ],
      [
        "Memar eskizi",
        "Eskizi emalatxanadan kitabxanaya və sərgi zalına daşı.",
        [20, 12, 2, 14],
      ],
      [
        "Saat ustası",
        "Köhnə saatın hissələrini iki ustadan topla.",
        [4, 10, 23, 1],
      ],
      [
        "Meydan paradı",
        "Paradın hazırlıq dayanacaqlarını sıra ilə yoxla.",
        [24, 7, 22, 5, 14],
      ],
    ],
  },
  {
    id: "shore",
    name: "Sahil",
    theme: "marine",
    blocked: [6, 11, 18],
    rough: [3, 8, 13, 21],
    missions: [
      ["Sahil poçtu", "Sahil prospektində ilk çatdırılmanı tamamla.", [0, 10]],
      [
        "Mayak işığı",
        "Mayak lampasını köhnə limandan patrula apar.",
        [4, 14, 22],
      ],
      [
        "Balıq bazarı",
        "Soyuq anbarı, bazarı və təhvil nöqtəsini sıra ilə ziyarət et.",
        [20, 5, 24, 12],
      ],
      [
        "Dalğaqıran",
        "Dalğaqırandakı təmir qrupu üçün ehtiyat hissələri topla.",
        [2, 16, 4, 23],
      ],
      [
        "Liman növbəsi",
        "Dörd dayanacaq boyunca limanın gecə yoxlamasını tamamla.",
        [23, 7, 22, 3, 15],
      ],
    ],
  },
  {
    id: "garden",
    name: "Bağlar",
    theme: "moss",
    blocked: [7, 16, 18],
    rough: [2, 6, 13, 20],
    missions: [
      ["Bağ dəvəti", "İlk dəvəti icma bağına apar.", [4, 9]],
      [
        "Toxum bankı",
        "Toxumları istixanadan götürüb bağçaya çatdır.",
        [0, 12, 24],
      ],
      [
        "Quş sayımı",
        "Quşların müşahidə nöqtələrinə sıra ilə get.",
        [15, 2, 19, 21],
      ],
      [
        "Su kanalı",
        "Bağların su qapaqlarını göstərilən sıra ilə yoxla.",
        [9, 20, 5, 23],
      ],
      [
        "Bahar festivalı",
        "Festivalın dörd dayanacağında hazırlığı yoxla.",
        [22, 14, 0, 21, 4],
      ],
    ],
  },
  {
    id: "garage",
    name: "Qaraj",
    theme: "steel",
    blocked: [6, 13, 17],
    rough: [3, 8, 11, 21],
    missions: [
      ["Alət qutusu", "Alət qutusunu təmir körpüsünə çatdır.", [0, 3]],
      [
        "Ehtiyat təkər",
        "Servisdən ehtiyat təkəri götür və trasda təhvil ver.",
        [20, 12, 4],
      ],
      [
        "Emalatxana növbəsi",
        "Emalatxanaların təmir jurnallarını topla.",
        [4, 10, 18, 2],
      ],
      [
        "Qaraj yoxlaması",
        "Açarı, ehtiyat hissəsini və təmir jurnalını nəzarətçiyə apar.",
        [23, 11, 24, 7],
      ],
      [
        "Gecə servisi",
        "Gecə xidmətində dörd çağırışa ardıcıl get.",
        [5, 22, 1, 19, 2],
      ],
    ],
  },
  {
    id: "cafe",
    name: "Kafe rayonu",
    theme: "plum",
    blocked: [8, 11, 16],
    rough: [1, 6, 14, 23],
    missions: [
      ["İlk fincan", "Səhər kofesini məhəllə dükanına apar.", [0, 2]],
      [
        "Şirniyyat qutusu",
        "Sobadan çıxan sifarişi götür və kafeyə çatdır.",
        [20, 12, 4],
      ],
      [
        "Səyyar kafe",
        "Mobil kafenin üç xidmət nöqtəsinə baş çək.",
        [4, 15, 7, 24],
      ],
      [
        "Mətbəx siyahısı",
        "Aşpazın sifarişlərini anbarlardan topla.",
        [2, 22, 5, 19],
      ],
      [
        "Gecə yarmarkası",
        "Dörd yarmarka dayanacağında sifarişləri yoxla.",
        [24, 7, 21, 3, 10],
      ],
    ],
  },
  {
    id: "park",
    name: "Texnologiya parkı",
    theme: "violet",
    blocked: [7, 13, 16],
    rough: [3, 6, 12, 18],
    missions: [
      ["Sınaq siqnalı", "Sınaq cihazını ilk terminala apar.", [0, 3]],
      [
        "Enerji modulu",
        "Enerji modulunu laboratoriyadan sərgiyə çatdır.",
        [24, 12, 4],
      ],
      [
        "Sensor şəbəkəsi",
        "Şəbəkənin üç ölçmə cihazını sıra ilə işə sal.",
        [4, 10, 21, 2],
      ],
      [
        "Sərgi prototipi",
        "Prototipin hissələrini texniki məntəqələrdən topla.",
        [23, 11, 24, 8],
      ],
      [
        "Şəhər protokolu",
        "Son sınağın dörd terminalına göstərilən sıra ilə get.",
        [5, 22, 1, 19, 2],
      ],
    ],
  },
];

function expeditionNeighbors(cell, blocked) {
  return [
    cell >= 5 ? cell - 5 : -1,
    cell % 5 ? cell - 1 : -1,
    cell % 5 < 4 ? cell + 1 : -1,
    cell < 20 ? cell + 5 : -1,
  ].filter((next) => next >= 0 && !blocked.includes(next));
}

function expeditionEnergy(rough, cell) {
  return rough.includes(cell) ? 2 : 1;
}

function expeditionDistance(from, to, district) {
  const scores = Array(25).fill(Infinity);
  const pending = new Set(scores.keys());
  scores[from] = 0;
  while (pending.size) {
    const cell = [...pending].reduce((best, next) =>
      scores[next] < scores[best] ? next : best,
    );
    if (cell === to) return scores[cell];
    pending.delete(cell);
    for (const next of expeditionNeighbors(cell, district.blocked))
      scores[next] = Math.min(
        scores[next],
        scores[cell] + expeditionEnergy(district.rough, next),
      );
  }
  return Infinity;
}

const expeditionBoard = expeditionDistricts.map(
  ({ missions, ...district }) => ({
    ...district,
    missions: missions.map(([title, brief, stops], position) => ({
      id: district.id + "-" + (position + 1),
      title,
      brief,
      stops,
      optimal: stops
        .slice(1)
        .reduce(
          (total, stop, index) =>
            total + expeditionDistance(stops[index], stop, district),
          0,
        ),
    })),
  }),
);

export function expeditionView(state, now) {
  const medals = state.expedition?.medals ?? {};
  const districts = expeditionBoard.map((district) => ({
    ...district,
    missions: district.missions.map((mission, index) => ({
      ...mission,
      unlocked: index === 0 || Boolean(medals[district.missions[index - 1].id]),
      record: medals[mission.id] ?? null,
    })),
  }));
  const spotlight =
    districts[
      ((Math.floor((now + 4 * 3600) / 86400) % districts.length) +
        districts.length) %
        districts.length
    ].missions[0].id;
  return {
    districts,
    spotlight,
    score: state.expedition?.score ?? 0,
    completed: Object.keys(medals).length,
    mastered: Object.values(medals).filter(({ grade }) => grade === 3).length,
  };
}

export function scoreExpedition(state, action, now) {
  const district = expeditionBoard.find(({ id }) => id === action.district);
  const index =
    district?.missions.findIndex(({ id }) => id === action.mission) ?? -1;
  if (index < 0) return null;
  const mission = district.missions[index];
  const progress = state.expedition ?? { medals: {}, score: 0 };
  if (index > 0 && !progress.medals[district.missions[index - 1].id])
    return null;
  const route = action.route;
  if (
    !Array.isArray(route) ||
    route.length < 2 ||
    route.length > 46 ||
    route[0] !== mission.stops[0]
  )
    return null;
  let energy = 0;
  let checkpoint = 1;
  for (let i = 1; i < route.length; i++) {
    const cell = route[i];
    if (
      !Number.isInteger(cell) ||
      !expeditionNeighbors(route[i - 1], district.blocked).includes(cell) ||
      checkpoint === mission.stops.length
    )
      return null;
    energy += expeditionEnergy(district.rough, cell);
    if (cell === mission.stops[checkpoint]) checkpoint++;
  }
  if (checkpoint !== mission.stops.length || energy > mission.optimal + 6)
    return null;
  const grade =
    energy === mission.optimal ? 3 : energy <= mission.optimal + 2 ? 2 : 1;
  const previous = progress.medals[mission.id];
  if (previous && previous.energy <= energy) return null;
  progress.score += grade - (previous?.grade ?? 0);
  progress.medals[mission.id] = { grade, energy, at: now };
  state.expedition = progress;
  return (
    "Ekspedisiya · " +
    mission.title +
    " · " +
    ["", "Bürünc", "Gümüş", "Qızıl"][grade]
  );
}
