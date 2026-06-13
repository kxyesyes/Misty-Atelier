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
const tailwind = read("tailwind.config.ts");

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
  globals,
  /--color-cinnabar:\s*#b45a3c/,
  "ink redesign should define a cinnabar accent token"
);
assert.match(
  globals,
  /--color-paper:\s*#f7f1e6/,
  "ink redesign should define a rice-paper background token"
);
assert.match(
  globals,
  /--color-ink:\s*#1f2528/,
  "ink redesign should define a dense ink foreground token"
);
assert.match(
  globals,
  /\.ink-paper-fibers/,
  "ink redesign should expose a reusable rice-paper fiber texture"
);
assert.match(
  globals,
  /\.ink-divider/,
  "ink redesign should expose a brush-like divider utility"
);
assert.match(
  globals,
  /\.seal-mark/,
  "ink redesign should expose a cinnabar seal utility"
);
assert.match(
  tailwind,
  /cinnabar:\s*"var\(--color-cinnabar\)"/,
  "Tailwind should expose the cinnabar color token"
);
assert.match(
  tailwind,
  /Noto Serif SC|Songti SC/,
  "Tailwind serif stack should prefer Chinese serif faces"
);
assert.match(
  home,
  /Immersive Theatre|immersive-theatre/,
  "homepage should move from card listing toward an immersive theatre section"
);
assert.match(
  home,
  /烟雨阁/,
  "homepage should surface the ink-wash Chinese gallery name"
);
assert.match(
  archive,
  /masonry|columns-\[/,
  "archive explorer should use an asymmetrical masonry flow"
);
assert.match(
  archive,
  /ink-panel|ink-divider/,
  "archive controls should use ink-style surfaces and dividers"
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
