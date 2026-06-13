import assert from "node:assert/strict";
import {
  WEATHER_MAX_DELAY_MS,
  WEATHER_MIN_DELAY_MS,
  getNextWeatherDelayMs,
  getWeatherPoolForSeason,
  getWeatherProfile,
  pickWeatherForSeason,
} from "./weather-engine";

assert.deepEqual(
  getWeatherPoolForSeason("spring").map((entry) => entry.type),
  ["clear", "mist", "rain"],
  "spring weather should come from the global seasonal pool"
);

assert.deepEqual(
  getWeatherPoolForSeason("summer").map((entry) => entry.type),
  ["clear", "rain-heavy", "starlight"],
  "summer weather should allow heavy rain and starlight without artwork tags"
);

assert.equal(
  pickWeatherForSeason("autumn", () => 0),
  "rain",
  "weighted selection should start with autumn rain"
);

assert.equal(
  pickWeatherForSeason("winter", () => 0.69),
  "snow",
  "winter should strongly prefer snow so users can actually encounter it"
);

assert.equal(
  pickWeatherForSeason("winter", () => 0.999),
  "starlight",
  "weighted selection should reach the final winter pool entry"
);

assert.deepEqual(
  getWeatherProfile("rain-heavy"),
  { type: "rain-heavy", intensity: 0.84, mistLevel: 0.38, active: true },
  "weather profiles should carry display parameters separately from artwork data"
);

const minDelay = getNextWeatherDelayMs(() => 0);
const maxDelay = getNextWeatherDelayMs(() => 1);

assert.equal(minDelay, WEATHER_MIN_DELAY_MS);
assert.equal(maxDelay, WEATHER_MAX_DELAY_MS);
assert.ok(
  getNextWeatherDelayMs(() => 0.5) >= WEATHER_MIN_DELAY_MS &&
    getNextWeatherDelayMs(() => 0.5) <= WEATHER_MAX_DELAY_MS,
  "weather delay should stay in the 20-30 second range"
);

console.log("weather-engine contract passed");
