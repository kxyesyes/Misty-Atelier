import type { WeatherKind } from "./weather-engine";

export interface WeatherMotionPreset {
  density: number;
  speed: number;
  drift: number;
  opacity: number;
  scale: number;
  sway: number;
  spin: number;
  twinkle: number;
  layers: number;
  windVariance: number;
  pulse: number;
  blur: number;
}

export function getWeatherMotionPreset(
  type: Extract<WeatherKind, "mist" | "rain" | "rain-heavy" | "snow" | "starlight">
): WeatherMotionPreset {
  switch (type) {
    case "rain-heavy":
      return {
        density: 1.28,
        speed: 1.18,
        drift: 1.12,
        opacity: 1,
        scale: 1.06,
        sway: 0,
        spin: 0,
        twinkle: 0,
        layers: 3,
        windVariance: 1.15,
        pulse: 0.22,
        blur: 0.24,
      };
    case "rain":
      return {
        density: 1,
        speed: 1,
        drift: 1,
        opacity: 0.86,
        scale: 1,
        sway: 0,
        spin: 0,
        twinkle: 0,
        layers: 3,
        windVariance: 0.82,
        pulse: 0.16,
        blur: 0.18,
      };
    case "mist":
      return {
        density: 0.78,
        speed: 0.38,
        drift: 0.22,
        opacity: 0.74,
        scale: 1.28,
        sway: 0,
        spin: 0,
        twinkle: 0,
        layers: 2,
        windVariance: 0.18,
        pulse: 0.08,
        blur: 0.88,
      };
    case "snow":
      return {
        density: 1.36,
        speed: 0.72,
        drift: 0.48,
        opacity: 1,
        scale: 1.18,
        sway: 1.18,
        spin: 1.08,
        twinkle: 0,
        layers: 1,
        windVariance: 0.34,
        pulse: 0.1,
        blur: 0.22,
      };
    case "starlight":
      return {
        density: 0.86,
        speed: 0.42,
        drift: 0.42,
        opacity: 0.86,
        scale: 1,
        sway: 0,
        spin: 0,
        twinkle: 1,
        layers: 2,
        windVariance: 0,
        pulse: 0.12,
        blur: 0.36,
      };
  }
}
