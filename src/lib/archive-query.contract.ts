import assert from "node:assert/strict";
import { artworks } from "../data/artworks";
import { getArchiveFacets, getArchiveResults } from "./archive-query";

const allResults = getArchiveResults(artworks, {});
assert.equal(allResults.length, artworks.length, "empty filters should return every artwork");

const landscapeResults = getArchiveResults(artworks, { orientation: "landscape" });
assert.deepEqual(
  landscapeResults.map((artwork) => artwork.slug),
  [
    "moss-deer-at-glasshouse-end",
    "tide-postman-and-cloud-whale",
    "paper-wing-guardian-in-clocktower",
    "lantern-fox-station-at-snowfield",
  ],
  "orientation filter should isolate landscape works in archive order",
);

const clocktowerResults = getArchiveResults(artworks, { query: "clocktower" });
assert.deepEqual(
  clocktowerResults.map((artwork) => artwork.slug),
  ["paper-wing-guardian-in-clocktower"],
  "text search should match title, slug, description, and tags",
);

const quietBlueRooms = getArchiveResults(artworks, {
  exhibition: "blue-rooms",
  mood: "quiet",
});
assert.ok(quietBlueRooms.length > 0, "combined filters should still find matching artworks");
assert.ok(
  quietBlueRooms.every((artwork) => artwork.exhibition === "blue-rooms" && artwork.moodTags.includes("quiet")),
  "combined filters should apply exhibition and mood together",
);

const facets = getArchiveFacets(artworks);
assert.ok(facets.moods.includes("quiet"), "mood facets should include known mood tags");
assert.ok(facets.colors.includes("blue"), "color facets should include known color tags");
assert.ok(facets.scenes.includes("glasshouse"), "scene facets should include known scene tags");
assert.deepEqual(facets.orientations, ["landscape", "portrait"], "orientation facets should be sorted and unique");
