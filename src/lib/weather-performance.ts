import type { WeatherKind } from "./weather-engine";
import { getWeatherMotionPreset } from "./weather-motion";

export interface ParticleWeatherBudget {
  count: number;
  frameIntervalMs: number;
}

export function getParticleWeatherBudget(
  type: Extract<WeatherKind, "mist" | "rain" | "rain-heavy" | "snow" | "starlight">,
  intensity = 1,
  viewportWidth = 1440
): ParticleWeatherBudget {
  const mobile = viewportWidth < 768;
  const clampedIntensity = Math.min(Math.max(intensity, 0.25), 1);
  const motion = getWeatherMotionPreset(type);
  const density = clampedIntensity * motion.density;

  if (type === "rain-heavy") {
    return {
      count: Math.round((mobile ? 52 : 92) * density),
      frameIntervalMs: mobile ? 58 : 50,
    };
  }

  if (type === "rain") {
    return {
      count: Math.round((mobile ? 42 : 72) * density),
      frameIntervalMs: mobile ? 66 : 58,
    };
  }

  if (type === "mist") {
    return {
      count: Math.round((mobile ? 16 : 28) * density),
      frameIntervalMs: mobile ? 90 : 76,
    };
  }

  if (type === "snow") {
    return {
      count: Math.round((mobile ? 108 : 160) * density),
      frameIntervalMs: mobile ? 50 : 42,
    };
  }

  return {
    count: Math.round((mobile ? 32 : 48) * density),
    frameIntervalMs: mobile ? 58 : 50,
  };
}
