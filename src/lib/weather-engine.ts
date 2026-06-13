export type WeatherSeason = "spring" | "summer" | "autumn" | "winter";

export type WeatherKind =
  | "clear"
  | "mist"
  | "rain"
  | "rain-heavy"
  | "snow"
  | "starlight";

export interface WeightedWeather {
  type: WeatherKind;
  weight: number;
}

export interface WeatherProfile {
  type: WeatherKind;
  intensity: number;
  mistLevel: number;
  active: true;
}

export const WEATHER_MIN_DELAY_MS = 20_000;
export const WEATHER_MAX_DELAY_MS = 30_000;

export const SEASONAL_WEATHER_POOLS: Record<WeatherSeason, WeightedWeather[]> = {
  spring: [
    { type: "clear", weight: 0.46 },
    { type: "mist", weight: 0.34 },
    { type: "rain", weight: 0.2 },
  ],
  summer: [
    { type: "clear", weight: 0.44 },
    { type: "rain-heavy", weight: 0.36 },
    { type: "starlight", weight: 0.2 },
  ],
  autumn: [
    { type: "rain", weight: 0.34 },
    { type: "rain-heavy", weight: 0.26 },
    { type: "mist", weight: 0.4 },
  ],
  winter: [
    { type: "snow", weight: 0.72 },
    { type: "clear", weight: 0.1 },
    { type: "starlight", weight: 0.18 },
  ],
};

export function getWeatherPoolForSeason(season: WeatherSeason) {
  return SEASONAL_WEATHER_POOLS[season];
}

export function pickWeatherForSeason(
  season: WeatherSeason,
  random: () => number = Math.random
): WeatherKind {
  const pool = getWeatherPoolForSeason(season);
  const totalWeight = pool.reduce((total, entry) => total + entry.weight, 0);
  const roll = Math.min(Math.max(random(), 0), 0.999999) * totalWeight;

  let cursor = 0;
  for (const entry of pool) {
    cursor += entry.weight;
    if (roll < cursor) return entry.type;
  }

  return pool[pool.length - 1].type;
}

export function getWeatherProfile(type: WeatherKind): WeatherProfile {
  switch (type) {
    case "clear":
      return { type, intensity: 0.48, mistLevel: 0, active: true };
    case "mist":
      return { type, intensity: 0.12, mistLevel: 0.72, active: true };
    case "rain":
      return { type, intensity: 0.42, mistLevel: 0.24, active: true };
    case "rain-heavy":
      return { type, intensity: 0.84, mistLevel: 0.38, active: true };
    case "snow":
      return { type, intensity: 0.92, mistLevel: 0, active: true };
    case "starlight":
      return { type, intensity: 0.68, mistLevel: 0, active: true };
  }
}

export function getNextWeatherDelayMs(random: () => number = Math.random) {
  const clampedRandom = Math.min(Math.max(random(), 0), 1);
  return Math.round(
    WEATHER_MIN_DELAY_MS +
      clampedRandom * (WEATHER_MAX_DELAY_MS - WEATHER_MIN_DELAY_MS)
  );
}
