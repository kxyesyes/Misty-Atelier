import type { WeatherKind } from "./weather-engine";

export type RandomSource = () => number;

export type RainVisualLayer = "back" | "middle" | "front";

export interface RainLayerPreset {
  layer: RainVisualLayer;
  countRatio: number;
  length: [number, number];
  width: [number, number];
  speed: [number, number];
  alpha: [number, number];
  blur: number;
  splashChance: number;
}

export interface RainDrop {
  layer: RainVisualLayer;
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
  width: number;
  depth: number;
  phase: number;
  slant: number;
  blur: number;
  splashChance: number;
}

export interface RainMistBand {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  alpha: number;
  phase: number;
}

export interface RainField {
  drops: RainDrop[];
  mistBands: RainMistBand[];
}

export interface AutumnLeafSprite {
  id: "maple" | "ginkgo" | "willow" | "elm" | "oak" | "birch";
  path: string;
  vein: string;
  palette: [string, string, string];
}

export interface AutumnLeaf {
  sprite: AutumnLeafSprite;
  x: number;
  y: number;
  size: number;
  depth: number;
  fallSpeed: number;
  driftAmplitude: number;
  driftSpeed: number;
  windOffset: number;
  phase: number;
  rotation: number;
  rotationSpeed: number;
  flutterPause: number;
  alpha: number;
}

type RainType = Extract<WeatherKind, "mist" | "rain" | "rain-heavy">;

const TWO_PI = Math.PI * 2;

export const RAIN_LAYER_PRESETS: RainLayerPreset[] = [
  {
    layer: "back",
    countRatio: 0.46,
    length: [10, 24],
    width: [0.35, 0.72],
    speed: [3.2, 5.2],
    alpha: [0.07, 0.15],
    blur: 0,
    splashChance: 0,
  },
  {
    layer: "middle",
    countRatio: 0.38,
    length: [22, 46],
    width: [0.52, 1.05],
    speed: [5.4, 8.4],
    alpha: [0.12, 0.28],
    blur: 0,
    splashChance: 0.012,
  },
  {
    layer: "front",
    countRatio: 0.16,
    length: [44, 86],
    width: [0.8, 1.65],
    speed: [8.2, 12.8],
    alpha: [0.18, 0.42],
    blur: 0,
    splashChance: 0.045,
  },
];

export const AUTUMN_LEAF_SPRITES: AutumnLeafSprite[] = [
  {
    id: "maple",
    path:
      "M0 -48 L10 -24 L28 -38 L24 -15 L46 -16 L28 2 L38 24 L12 16 L4 48 L-4 48 L-12 16 L-38 24 L-28 2 L-46 -16 L-24 -15 L-28 -38 L-10 -24 Z",
    vein: "M0 -42 L0 42 M0 -10 L26 -30 M0 -6 L32 -12 M0 0 L26 16 M0 -10 L-26 -30 M0 -6 L-32 -12 M0 0 L-26 16",
    palette: ["#a85c31", "#d39a4c", "#70402c"],
  },
  {
    id: "ginkgo",
    path:
      "M0 48 C-22 32 -48 12 -44 -18 C-34 -50 -6 -38 0 -20 C6 -38 34 -50 44 -18 C48 12 22 32 0 48 Z",
    vein: "M0 44 L0 -16 M0 24 L-28 -10 M0 24 L28 -10 M0 30 L-18 12 M0 30 L18 12",
    palette: ["#d7b865", "#f0d88d", "#94713a"],
  },
  {
    id: "willow",
    path:
      "M0 -52 C18 -26 20 18 0 52 C-20 18 -18 -26 0 -52 Z",
    vein: "M0 -44 C4 -18 4 20 0 44 M0 -18 L12 -4 M0 6 L-12 18",
    palette: ["#b6793f", "#d8a85c", "#76513a"],
  },
  {
    id: "elm",
    path:
      "M-4 -50 C26 -36 42 -8 30 22 C18 48 -14 54 -30 22 C-44 -8 -28 -38 -4 -50 Z",
    vein: "M-3 -42 C0 -14 0 16 -8 42 M-1 -22 L18 -28 M0 -5 L24 2 M-4 10 L14 24 M-3 -18 L-22 -26 M-4 4 L-24 10 M-7 20 L-20 32",
    palette: ["#c98947", "#e2b66d", "#805137"],
  },
  {
    id: "oak",
    path:
      "M0 -50 C18 -42 12 -26 28 -20 C46 -14 32 2 42 14 C28 20 34 38 12 42 C6 48 -6 48 -12 42 C-34 38 -28 20 -42 14 C-32 2 -46 -14 -28 -20 C-12 -26 -18 -42 0 -50 Z",
    vein: "M0 -42 L0 42 M0 -18 L20 -24 M0 -4 L24 6 M0 14 L18 28 M0 -18 L-20 -24 M0 -4 L-24 6 M0 14 L-18 28",
    palette: ["#8d4e31", "#bf7440", "#663b2b"],
  },
  {
    id: "birch",
    path:
      "M2 -50 C28 -26 32 10 5 50 C-24 26 -32 -10 2 -50 Z",
    vein: "M2 -42 C4 -12 2 18 4 42 M4 -24 L22 -14 M4 -6 L26 8 M4 12 L18 26 M2 -18 L-16 -28 M2 2 L-22 12 M3 20 L-12 34",
    palette: ["#c09a58", "#e0c07c", "#7b5b38"],
  },
];

function range(min: number, max: number, random: RandomSource) {
  return min + (max - min) * random();
}

function makeRainDrop(
  width: number,
  height: number,
  preset: RainLayerPreset,
  type: RainType,
  intensity: number,
  random: RandomSource,
  fromTop = false
): RainDrop {
  const heavy = type === "rain-heavy" ? 1.18 : 1;
  const mist = type === "mist" ? 0.3 : 1;
  const depth =
    preset.layer === "front" ? range(1.05, 1.42, random) : preset.layer === "middle" ? range(0.68, 1.04, random) : range(0.34, 0.64, random);

  return {
    layer: preset.layer,
    x: range(-width * 0.08, width * 1.08, random),
    y: fromTop ? range(-height * 0.28, -10, random) : range(-height * 0.08, height, random),
    length: range(preset.length[0], preset.length[1], random) * heavy * mist,
    speed: range(preset.speed[0], preset.speed[1], random) * heavy * Math.max(0.5, intensity),
    alpha: range(preset.alpha[0], preset.alpha[1], random) * (type === "rain" ? 0.86 : 1),
    width: range(preset.width[0], preset.width[1], random) * heavy,
    depth,
    phase: range(0, TWO_PI, random),
    slant: range(-0.32, -0.14, random) * (type === "rain-heavy" ? 1.26 : 1),
    blur: preset.blur,
    splashChance: preset.splashChance * (type === "rain-heavy" ? 1.65 : 1),
  };
}

function makeMistBand(width: number, height: number, random: RandomSource): RainMistBand {
  return {
    x: range(-width * 0.2, width * 1.05, random),
    y: range(height * 0.08, height * 0.92, random),
    width: width * range(0.28, 0.58, random),
    height: range(80, 210, random),
    speed: range(0.05, 0.2, random),
    alpha: range(0.024, 0.07, random),
    phase: range(0, TWO_PI, random),
  };
}

export function createRainField({
  width,
  height,
  type,
  intensity = 1,
  random = Math.random,
}: {
  width: number;
  height: number;
  type: RainType;
  intensity?: number;
  random?: RandomSource;
}): RainField {
  const clampedIntensity = Math.min(Math.max(intensity, 0.25), 1);
  const baseCount = type === "mist" ? 18 : type === "rain-heavy" ? 92 : 58;
  const drops =
    type === "mist"
      ? []
      : RAIN_LAYER_PRESETS.flatMap((preset) =>
          Array.from(
            {
              length: Math.max(
                preset.layer === "front" ? 5 : 8,
                Math.round(baseCount * preset.countRatio * clampedIntensity)
              ),
            },
            () => makeRainDrop(width, height, preset, type, clampedIntensity, random)
          )
        );

  const mistCount =
    type === "mist"
      ? Math.round(baseCount * 0.58)
      : type === "rain-heavy"
        ? 4
        : 2;
  const mistBands = Array.from({ length: mistCount }, () =>
    makeMistBand(width, height, random)
  );

  return { drops, mistBands };
}

export function resetRainDrop(
  drop: RainDrop,
  width: number,
  height: number,
  type: RainType,
  intensity = 1,
  random: RandomSource = Math.random
) {
  const preset =
    RAIN_LAYER_PRESETS.find((entry) => entry.layer === drop.layer) ??
    RAIN_LAYER_PRESETS[1];
  Object.assign(
    drop,
    makeRainDrop(width, height, preset, type, intensity, random, true)
  );
}

export function resetRainMistBand(
  band: RainMistBand,
  width: number,
  height: number,
  random: RandomSource = Math.random
) {
  Object.assign(band, makeMistBand(width, height, random));
  band.x = -band.width * 0.55;
}

function makeAutumnLeaf(
  width: number,
  height: number,
  index: number,
  random: RandomSource,
  fromTop = false
): AutumnLeaf {
  const sprite = AUTUMN_LEAF_SPRITES[index % AUTUMN_LEAF_SPRITES.length];
  const depth = range(0.58, 1.18, random);

  return {
    sprite,
    x: range(-width * 0.08, width * 1.02, random),
    y: fromTop ? range(-height * 0.28, -24, random) : range(-height * 0.12, height * 1.02, random),
    size: range(14, 34, random) * depth,
    depth,
    fallSpeed: range(0.28, 0.92, random) * depth,
    driftAmplitude: range(22, 82, random) * depth,
    driftSpeed: range(0.18, 0.58, random),
    windOffset: range(-0.28, 0.46, random),
    phase: range(0, TWO_PI, random),
    rotation: range(-Math.PI, Math.PI, random),
    rotationSpeed: range(-0.014, 0.014, random) || 0.009,
    flutterPause: range(0.18, 0.68, random),
    alpha: range(0.34, 0.68, random),
  };
}

export function createAutumnLeaves({
  width,
  height,
  count = 28,
  random = Math.random,
}: {
  width: number;
  height: number;
  count?: number;
  random?: RandomSource;
}) {
  return Array.from({ length: count }, (_, index) =>
    makeAutumnLeaf(width, height, index, random)
  );
}

export function resetAutumnLeaf(
  leaf: AutumnLeaf,
  width: number,
  height: number,
  index: number,
  random: RandomSource = Math.random
) {
  Object.assign(leaf, makeAutumnLeaf(width, height, index, random, true));
}
