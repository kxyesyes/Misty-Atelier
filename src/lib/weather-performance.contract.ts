import assert from "node:assert/strict";
import { getParticleWeatherBudget } from "./weather-performance";

const desktopHeavy = getParticleWeatherBudget("rain-heavy", 1440);
assert.ok(
  desktopHeavy.count <= 120,
  "heavy rain should stay within the lightweight particle budget"
);
assert.ok(
  desktopHeavy.frameIntervalMs >= 50,
  "heavy rain should not render at unrestricted raf speed"
);

const mobileRain = getParticleWeatherBudget("rain", 1, 390);
assert.ok(
  mobileRain.count <= 42,
  "mobile rain should use a sparse particle budget"
);
assert.ok(
  mobileRain.frameIntervalMs >= 58,
  "mobile rain should use a calmer frame interval"
);

const mist = getParticleWeatherBudget("mist", 1, 1440);
assert.ok(mist.count <= 28, "mist should be the cheapest rain-family layer");
assert.ok(mist.frameIntervalMs >= 76, "mist should animate very slowly");

const snow = getParticleWeatherBudget("snow", 1, 1440);
assert.ok(snow.count >= 190, "snow should be visible on a light paper background");
assert.ok(snow.count <= 220, "snow should keep a bounded full-screen particle count");
assert.ok(snow.frameIntervalMs >= 42, "snow should not animate at unrestricted raf speed");

const mobileStars = getParticleWeatherBudget("starlight", 1, 390);
assert.ok(mobileStars.count <= 32, "mobile starlight should stay sparse");
assert.ok(mobileStars.frameIntervalMs >= 50, "mobile starlight should use a calm frame interval");

console.log("weather-performance contract passed");
