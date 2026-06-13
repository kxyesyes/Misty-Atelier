import assert from "node:assert/strict";
import {
  getArtworkHorizontalPreviewSource,
  getArtworkFrameClass,
  getArtworkGridSpanClass,
  getArtworkHorizontalPreviewFrameClass,
  getArtworkHorizontalPreviewImageClass,
  getArtworkImageFitClass,
  shouldUseArtworkHorizontalPreviewBackdrop,
} from "./image-layout";
import { getArtworkBySlug } from "./artwork-query";

const tallPortrait = getArtworkBySlug("winter-blue-window-room");
const landscapeWork = getArtworkBySlug("paper-wing-guardian-in-clocktower");

assert.equal(tallPortrait ? getArtworkFrameClass(tallPortrait) : undefined, "aspect-[9/16]");
assert.equal(getArtworkFrameClass({ orientation: "portrait", aspectRatio: 0.8 }), "aspect-[4/5]");
assert.equal(landscapeWork ? getArtworkFrameClass(landscapeWork) : undefined, "aspect-[3/2]");
assert.equal(getArtworkFrameClass({ orientation: "square", aspectRatio: 1 }), "aspect-square");

assert.equal(getArtworkImageFitClass("portrait", "card"), "object-cover");
assert.equal(getArtworkImageFitClass("landscape", "detail"), "object-contain");

assert.equal(getArtworkHorizontalPreviewFrameClass("portrait"), "aspect-[4/3]");
assert.equal(getArtworkHorizontalPreviewFrameClass("landscape"), "aspect-[4/3]");
assert.equal(getArtworkHorizontalPreviewImageClass("portrait"), "object-contain p-2");
assert.equal(getArtworkHorizontalPreviewImageClass("landscape"), "object-cover");
assert.equal(getArtworkHorizontalPreviewImageClass("portrait", true), "object-cover");
assert.equal(shouldUseArtworkHorizontalPreviewBackdrop("portrait"), true);
assert.equal(shouldUseArtworkHorizontalPreviewBackdrop("landscape"), false);
assert.equal(shouldUseArtworkHorizontalPreviewBackdrop("portrait", true), false);

const widePreviewWork = getArtworkBySlug("winter-blue-window-room");
assert.ok(widePreviewWork?.wideThumbnail);
assert.equal(
  widePreviewWork ? getArtworkHorizontalPreviewSource(widePreviewWork) : undefined,
  "/images/artworks/wide-thumbs/winter-blue-window-room.jpg",
);

assert.equal(getArtworkGridSpanClass("portrait", "archive"), "");
assert.equal(getArtworkGridSpanClass("landscape", "exhibition"), "md:col-span-2 md:px-10");
assert.equal(getArtworkGridSpanClass("landscape", "archive"), "xl:col-span-2");
