import assert from "node:assert/strict";
import { getWeatherMotionPreset } from "./weather-motion";

const snow = getWeatherMotionPreset("snow");
assert.ok(snow.density >= 1.25, "snow should be prominent enough to read on paper");
assert.ok(snow.sway >= 1, "snow should have lateral sway");
assert.ok(snow.spin >= 1, "snow should use the previous visible snow-crystal rotation");
assert.ok(snow.blur <= 0.4, "snow should return to crisp crystal flakes");

const mist = getWeatherMotionPreset("mist");
assert.ok(mist.drift > 0 && mist.drift < 0.6, "mist should drift slowly");
assert.ok(mist.opacity <= 0.9, "mist should remain atmospheric");
assert.ok(mist.layers >= 2, "mist should render as layered air, not isolated bubbles");

const rain = getWeatherMotionPreset("rain");
const heavyRain = getWeatherMotionPreset("rain-heavy");
assert.ok(rain.layers >= 3, "rain should have far, middle, and near layers");
assert.ok(rain.windVariance > 0, "rain should include changing wind");
assert.ok(rain.pulse > 0, "rain should vary density over time");
assert.ok(heavyRain.density > rain.density, "heavy rain should be denser than rain");
assert.ok(heavyRain.speed >= rain.speed, "heavy rain should move at least as quickly as rain");

const stars = getWeatherMotionPreset("starlight");
assert.ok(stars.twinkle > 0, "starlight should twinkle");
assert.ok(stars.speed < 0.8, "starlight should drift slowly");

console.log("weather-motion contract passed");
