import assert from "node:assert/strict";
import {
  AUTUMN_LEAF_SPRITES,
  RAIN_LAYER_PRESETS,
  createAutumnLeaves,
  createRainField,
} from "./atmospheric-particles";

function seededRandom(seed = 7) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

const rain = createRainField({
  width: 1440,
  height: 900,
  type: "rain-heavy",
  intensity: 0.84,
  random: seededRandom(),
});

const rainLayers = new Set(rain.drops.map((drop) => drop.layer));
assert.deepEqual(
  Array.from(rainLayers).sort(),
  ["back", "front", "middle"],
  "rain should render as back, middle, and front depth layers"
);
assert.equal(
  RAIN_LAYER_PRESETS.length,
  3,
  "rain presets should define exactly three visual depth layers"
);
assert.ok(
  rain.mistBands.length >= 2 && rain.drops.some((drop) => drop.splashChance > 0),
  "rain should mix lightweight wet-air bands and occasional near-field splashes"
);
assert.ok(
  Math.max(...rain.drops.map((drop) => drop.length)) >
    Math.min(...rain.drops.map((drop) => drop.length)) * 2,
  "rain drops should vary enough in length to avoid uniform streaks"
);

assert.ok(
  AUTUMN_LEAF_SPRITES.length >= 5,
  "autumn should use several recognizable leaf silhouettes"
);
assert.ok(
  AUTUMN_LEAF_SPRITES.some((sprite) => sprite.id === "ginkgo") &&
    AUTUMN_LEAF_SPRITES.some((sprite) => sprite.id === "maple"),
  "autumn leaf sprites should include distinct ginkgo and maple shapes"
);

const leaves = createAutumnLeaves({
  width: 1440,
  height: 900,
  count: 28,
  random: seededRandom(11),
});
assert.equal(leaves.length, 28, "autumn leaves should honor the requested count");
assert.ok(
  new Set(leaves.map((leaf) => leaf.sprite.id)).size >= 5,
  "autumn leaves should distribute multiple sprite silhouettes"
);
assert.ok(
  leaves.some((leaf) => leaf.flutterPause > 0.35) &&
    leaves.some((leaf) => Math.abs(leaf.rotationSpeed) > 0.008),
  "autumn leaves should have gust pauses and visible rotation variance"
);
assert.ok(
  leaves.every((leaf) => leaf.alpha >= 0.3 && leaf.alpha <= 0.78),
  "autumn leaves should stay visible without becoming opaque stickers"
);

console.log("atmospheric-particles contract passed");
