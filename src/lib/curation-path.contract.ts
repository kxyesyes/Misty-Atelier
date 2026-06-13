import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getCurationPathForExhibition, getCurationRouteForArtwork, getHomeCurationPath } from "./curation-path";

const homePath = getHomeCurationPath();
assert.equal(homePath.length, 6);
assert.equal(homePath[0].exhibition.slug, "blue-rooms");
assert.equal(homePath[0].featuredWorks.length, 3);
assert.equal(
  homePath.flatMap((entry) =>
    entry.featuredWorks.filter((work) => work.orientation !== "landscape" && !work.wideThumbnail),
  ).length,
  0,
);
assert.equal(
  homePath.flatMap((entry) => entry.featuredWorks.filter((work) => !work.caption || work.caption.length < 60)).length,
  0,
);
assert.equal(
  homePath.flatMap((entry) =>
    entry.featuredWorks.filter(
      (work) =>
        work.wideThumbnail &&
        !existsSync(join(process.cwd(), "public", work.wideThumbnail.replace(/^\//, ""))),
    ),
  ).length,
  0,
);

const distantFables = getCurationPathForExhibition("distant-fables");
assert.equal(distantFables?.exhibition.slug, "distant-fables");
assert.equal(distantFables?.nextExhibition.slug, "blue-rooms");
assert.ok(distantFables?.featuredWorks.every((work) => work.exhibition === "distant-fables"));

const missing = getCurationPathForExhibition("missing");
assert.equal(missing, undefined);
assert.equal(getCurationPathForExhibition("porcelain-silence"), undefined);
assert.equal(getCurationPathForExhibition("holding-room"), undefined);

const firstRouteWork = getCurationRouteForArtwork("winter-blue-window-room");
assert.equal(firstRouteWork?.routeIndex, 0);
assert.equal(firstRouteWork?.activeWorkIndex, 0);
assert.equal(firstRouteWork?.entry.exhibition.slug, "blue-rooms");
assert.equal(firstRouteWork?.previousWork.slug, "quiet-letter-by-the-window");
assert.equal(firstRouteWork?.nextWork.slug, "morning-reading-room-0");

const nonRouteWork = getCurationRouteForArtwork("glasshouse-morning-dew");
assert.equal(nonRouteWork?.routeIndex, 2);
assert.equal(nonRouteWork?.activeWorkIndex, undefined);
assert.equal(nonRouteWork?.entry.exhibition.slug, "glasshouse-dreams");

const missingRouteWork = getCurationRouteForArtwork("missing-work");
assert.equal(missingRouteWork, undefined);
