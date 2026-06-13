export type ExhibitionPalette = {
  background: string;
  foreground: string;
  accent: string;
};

export type Exhibition = {
  slug: string;
  titleEn: string;
  titleZh: string;
  works: string[];
  summary: string;
  coverArtworkSlug: string;
  palette: ExhibitionPalette;
  keywords: string[];
  curatorNote: string;
  featuredWorkSlugs: string[];
  pathLabel: string;
  pathDescription: string;
  sortOrder: number;
  featured: boolean;
};

export const exhibitions: Exhibition[] = [
  {
    slug: "blue-rooms",
    titleEn: "Blue Rooms",
    titleZh: "蓝调房间",
    works: [
      "winter-blue-window-room",
      "morning-reading-room-0",
      "morning-reading-room-1",
      "cool-sky-mood",
      "winter-white-window",
      "misty-morning-bedroom",
      "reading-corner-before-dusk",
      "warm-brown-attic-library",
      "lazy-bedroom-under-night-lights",
      "quiet-letter-by-the-window",
    ],
    summary: "Rooms where blue light gathers slowly around books, windows, and quiet weather.",
    keywords: ["window light", "books", "blue rooms", "interior weather"],
    curatorNote:
      "Blue Rooms is the archive's opening temperature: cool interiors, reading corners, and winter windows where ordinary rooms become places for watching light change.",
    featuredWorkSlugs: [
      "winter-blue-window-room",
      "morning-reading-room-0",
      "quiet-letter-by-the-window",
    ],
    pathLabel: "Begin in the blue rooms",
    pathDescription:
      "Start with rooms that treat blue light as a threshold: a window, a reading hour, and a letter held before the weather changes.",
    coverArtworkSlug: "winter-blue-window-room",
    palette: {
      background: "#edf4f6",
      foreground: "#22323b",
      accent: "#6f93a1",
    },
    sortOrder: 0,
    featured: true,
  },
  {
    slug: "rain-archive",
    titleEn: "Rain Archive",
    titleZh: "雨的档案",
    works: [
      "balcony-after-rain",
      "rainy-headphones-desk",
      "misty-tea-garden-after-rain",
      "rain-water-season",
      "red-maple-night-rain",
      "grain-rain",
      "window-whisper-after-rain-0",
      "clear-girl-by-raindrop-window",
    ],
    summary: "A soft record of wet balconies, listening desks, tea gardens, and the silence after rain.",
    keywords: ["after rain", "listening rooms", "wet glass", "soft weather"],
    curatorNote:
      "Rain Archive treats weather as a quiet instrument. The works are built from damp edges, indoor listening, and the small domestic calm that arrives after rain has moved through.",
    featuredWorkSlugs: [
      "balcony-after-rain",
      "rainy-headphones-desk",
      "clear-girl-by-raindrop-window",
    ],
    pathLabel: "Follow the rain archive",
    pathDescription:
      "Move from the balcony into quieter rain interiors, where glass, headphones, and damp night light turn weather into a private instrument.",
    coverArtworkSlug: "balcony-after-rain",
    palette: {
      background: "#e8eff0",
      foreground: "#26363d",
      accent: "#78918c",
    },
    sortOrder: 1,
    featured: true,
  },
  {
    slug: "glasshouse-dreams",
    titleEn: "Glasshouse Dreams",
    titleZh: "玻璃温室梦",
    works: [
      "blue-white-glasshouse-dream",
      "glasshouse-morning-dew",
      "fresh-green-glasshouse-morning",
      "moss-deer-at-glasshouse-end",
      "vintage-film-flower-shop",
      "ice-crystal-greenhouse",
      "crystal-flower-room",
      "winter-greenhouse-bench",
    ],
    summary: "Botanical interiors held inside glass, dew, pale flowers, and winter-green reflections.",
    keywords: ["glasshouse", "botanical rooms", "dew", "pale green"],
    curatorNote:
      "Glasshouse Dreams gathers images where plants and rooms share the same skin. Reflections, flowers, and pale greens make each scene feel protected but not sealed.",
    featuredWorkSlugs: [
      "blue-white-glasshouse-dream",
      "moss-deer-at-glasshouse-end",
      "winter-greenhouse-bench",
    ],
    pathLabel: "Enter the glasshouse",
    pathDescription:
      "Step into protected green light, where reflections, botanical rooms, and winter benches make the archive feel grown rather than arranged.",
    coverArtworkSlug: "blue-white-glasshouse-dream",
    palette: {
      background: "#edf3ec",
      foreground: "#26382e",
      accent: "#86a888",
    },
    sortOrder: 2,
    featured: true,
  },
  {
    slug: "seasonal-stations",
    titleEn: "Seasonal Stations",
    titleZh: "季节候车室",
    works: [
      "minimal-snow-station",
      "winter-waiting-for-train",
      "beginning-of-spring",
      "winter-cottage-nap",
      "snow-night-rooftop",
      "spring-lakeside-green-skirt",
      "warm-orange-dusk-rooftop",
      "pale-orange-evening-mist",
      "clear-sea-breeze-white-lighthouse",
    ],
    summary: "Stations, cottages, shorelines, and rooftops arranged like pauses between seasons.",
    keywords: ["snow stations", "solar terms", "waiting", "seasonal travel"],
    curatorNote:
      "Seasonal Stations is arranged like a calendar of departures. Snow platforms, spring water, cottages, and rooftops hold the pause before a season fully arrives.",
    featuredWorkSlugs: [
      "minimal-snow-station",
      "beginning-of-spring",
      "clear-sea-breeze-white-lighthouse",
    ],
    pathLabel: "Travel by season",
    pathDescription:
      "Leave the rooms for stations, spring water, and coastal air, following pauses where each season seems to wait before becoming itself.",
    coverArtworkSlug: "minimal-snow-station",
    palette: {
      background: "#f1f2ef",
      foreground: "#2f3435",
      accent: "#c7a878",
    },
    sortOrder: 3,
    featured: true,
  },
  {
    slug: "atelier-hours",
    titleEn: "Atelier Hours",
    titleZh: "画室时刻",
    works: [
      "blue-white-atelier-girl",
      "atelier-girl",
      "afternoon-atelier-tidying",
      "ballpoint-anime-study",
      "ballpoint-drawing-study",
      "modern-composition-poster",
      "girl-with-luminous-paper-crane",
      "transparent-umbrella-warm-light",
      "warm-brown-record-store-corner",
    ],
    summary: "Studio hours for sketches, paper light, transparent umbrellas, and quiet composition studies.",
    keywords: ["studio life", "paper light", "drawing studies", "composition"],
    curatorNote:
      "Atelier Hours keeps the making visible. It collects sketch studies, studio portraits, paper objects, and graphic compositions as traces of a room in use.",
    featuredWorkSlugs: [
      "blue-white-atelier-girl",
      "afternoon-atelier-tidying",
      "girl-with-luminous-paper-crane",
    ],
    pathLabel: "Return to the studio",
    pathDescription:
      "Return to the making table: studio light, tidied afternoons, and small paper objects show the archive being composed by hand.",
    coverArtworkSlug: "blue-white-atelier-girl",
    palette: {
      background: "#f4efe7",
      foreground: "#332f2b",
      accent: "#c69262",
    },
    sortOrder: 4,
    featured: true,
  },
  {
    slug: "distant-fables",
    titleEn: "Distant Fables",
    titleZh: "远方寓言",
    works: [
      "tide-postman-and-cloud-whale",
      "paper-wing-guardian-in-clocktower",
      "lantern-fox-station-at-snowfield",
      "desert-starlight-traveler",
      "red-shrine-fox-mask-girl-0",
      "red-shrine-fox-mask-girl-1",
      "midnight-library-spellbook",
      "amber-of-time",
      "mercury-reverie",
      "deep-sea-whale-shadow",
    ],
    summary: "Small myths from elsewhere, held in amber, clocktowers, lantern stations, and moonlit libraries.",
    keywords: ["amber memory", "quiet myths", "symbolic time", "warm fables"],
    curatorNote:
      "Distant Fables lets the archive step outside the room without losing its hush. The stories stay small, held in amber, old errands, clocktowers, and night reading.",
    featuredWorkSlugs: [
      "amber-of-time",
      "paper-wing-guardian-in-clocktower",
      "lantern-fox-station-at-snowfield",
    ],
    pathLabel: "Leave by fable",
    pathDescription:
      "End by stepping beyond domestic rooms into amber memory, clocktowers, and lantern stations, where each distant place stays quiet enough to keep.",
    coverArtworkSlug: "amber-of-time",
    palette: {
      background: "#eee8df",
      foreground: "#352f32",
      accent: "#a86f62",
    },
    sortOrder: 5,
    featured: true,
  },
  {
    slug: "porcelain-silence",
    titleEn: "Porcelain Silence",
    titleZh: "瓷白静物",
    works: [],
    summary: "Pale porcelain, quiet surfaces, and still compositions held outside the main route.",
    keywords: ["porcelain", "stillness", "pale objects"],
    curatorNote:
      "Porcelain Silence is a holding exhibition for pale 9:16 works whose quiet object language expands the archive without changing the six-route structure.",
    featuredWorkSlugs: [],
    pathLabel: "Rest in porcelain silence",
    pathDescription:
      "A side room for pale objects, porcelain surfaces, and still compositions that should be curated more carefully after the main vertical import.",
    coverArtworkSlug: "0-31",
    palette: {
      background: "#f4f0eb",
      foreground: "#303034",
      accent: "#b9a98f",
    },
    sortOrder: 6,
    featured: false,
  },
  {
    slug: "holding-room",
    titleEn: "Holding Room",
    titleZh: "待整理房间",
    works: [],
    summary: "A temporary room for 9:16 imports that need a second curation pass.",
    keywords: ["review", "vertical studies", "archive holding"],
    curatorNote:
      "Holding Room keeps uncertain vertical works visible and searchable while protecting the main exhibitions from premature categorization.",
    featuredWorkSlugs: [],
    pathLabel: "Hold for review",
    pathDescription:
      "A temporary side room for vertical works that belong in the archive but still need a more precise exhibition assignment.",
    coverArtworkSlug: "pale-orange-evening-mist-chestnut-girl",
    palette: {
      background: "#f1eee8",
      foreground: "#30343a",
      accent: "#9aa5a8",
    },
    sortOrder: 7,
    featured: false,
  },
];
