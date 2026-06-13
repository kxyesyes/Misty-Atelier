import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

const layout = read("src/app/layout.tsx");
const home = read("src/app/page.tsx");
const archive = read("src/components/ArchiveExplorer.tsx");
const artworkCard = read("src/components/ArtworkCard.tsx");
const workPage = read("src/app/works/[slug]/page.tsx");
const globals = read("src/app/globals.css");

assert.doesNotMatch(
  layout,
  /SmoothScroll|CustomCursor/,
  "layout should use native browser scrolling and the system cursor"
);
assert.doesNotMatch(
  globals,
  /custom-cursor|has-custom-cursor|cursor:\s*none/,
  "global CSS should not hide the system cursor"
);
assert.match(
  globals,
  /\.museum-glass/,
  "global CSS should expose a reusable optical glass surface"
);
assert.match(
  globals,
  /\.parallax-art/,
  "global CSS should expose a parallax artwork helper"
);
assert.match(
  home,
  /Immersive Theatre|immersive-theatre/,
  "homepage should move from card listing toward an immersive theatre section"
);
assert.match(
  archive,
  /masonry|columns-\[/,
  "archive explorer should use an asymmetrical masonry flow"
);
assert.doesNotMatch(
  artworkCard,
  /rounded-card|shadow-md|shadow-sm|ring-1/,
  "ArtworkCard should no longer feel like a boxed card"
);
assert.match(
  workPage,
  /lg:sticky/,
  "artwork detail should use sticky artwork reading layout"
);
assert.doesNotMatch(
  workPage,
  /bg-cream\/45|ring-1|shadow-sm/,
  "artwork detail hero should remove heavy boxed frame styling"
);

console.log("ui-redesign contract passed");
