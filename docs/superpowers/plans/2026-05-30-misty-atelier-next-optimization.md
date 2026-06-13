# Misty Atelier Next Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Misty Atelier from a polished image archive into a more professional online exhibition with intelligent image layout, guided curation paths, deeper Recipe Notes, and launch-ready quality checks.

**Architecture:** Keep the current Next.js App Router, static data, query-layer, and Tailwind visual system. Add small typed presentation/query helpers rather than embedding layout decisions inside pages, then connect those helpers to Home, Archive, Exhibition, and Work pages. Build each behavior behind contract tests first, then verify with TypeScript, lint, production build, and Playwright visual checks.

**Tech Stack:** Next.js 14, TypeScript, React 18, Tailwind CSS, Framer Motion, Playwright, tsx contract tests, local static image assets.

---

## 1. Current Project Context

The project already has:

- `src/app/page.tsx`: curated home page with exhibitions, selections, Recipe Notes, Studio Pass Lanyard, and footer.
- `src/app/archive/page.tsx`: filterable archive page.
- `src/app/exhibitions/[slug]/page.tsx`: exhibition detail pages with keywords and curator notes.
- `src/app/works/[slug]/page.tsx`: artwork detail pages with metadata, related works, and adjacent navigation.
- `src/components/Lanyard/*`: React Bits Lanyard adapted for Next.js and lazy loading.
- `src/components/Soundscape.tsx`: low-interference ambient control.
- `src/data/artworks.ts`: typed artwork data with orientation, descriptions, tags, and Recipe Note links.
- `src/data/exhibitions.ts`: typed exhibition data with palette, keywords, and curator notes.
- `src/data/recipeNotes.ts`: current lightweight Recipe Notes.
- `src/lib/archive-query.ts`, `src/lib/artwork-query.ts`, `src/lib/exhibition-query.ts`: query helpers.
- Contract tests:
  - `src/lib/archive-query.contract.ts`
  - `src/lib/artwork-query.contract.ts`
  - `src/data/exhibition-contract.test.ts`

The next optimization should not add CMS, accounts, likes, downloads, or complex shader storytelling. The goal is to make the current V1 feel intentional, navigable, and ready for public sharing.

---

## 2. File Structure Changes

### New Files

- `src/lib/image-layout.ts`
  - Converts artwork orientation and usage context into stable layout classes and image fitting choices.
- `src/lib/image-layout.contract.ts`
  - Contract tests for image layout behavior.
- `src/lib/curation-path.ts`
  - Defines guided exhibition/work path helpers.
- `src/lib/curation-path.contract.ts`
  - Contract tests for guided path behavior.
- `src/components/CurationTrail.tsx`
  - Reusable guided path component for home/exhibition/work surfaces.
- `src/components/RecipeNotePanel.tsx`
  - Structured Recipe Note renderer.
- `src/data/recipe-notes.contract.ts`
  - Contract test for richer Recipe Note data.
- `src/lib/validation-report.ts`
  - Static project validation helpers.
- `src/lib/validation-report.contract.ts`
  - Contract tests for validation helpers.
- `playwright/misty-atelier.spec.ts`
  - Browser checks for home, archive, exhibition, work, and Lanyard lazy loading.

### Modified Files

- `package.json`
  - Add `validate` script.
- `src/data/artworks.ts`
  - Add curation fields where needed.
- `src/data/exhibitions.ts`
  - Add `featuredWorkSlugs` and `pathLabel`.
- `src/data/recipeNotes.ts`
  - Expand Recipe Notes from simple content to structured creative method notes.
- `src/components/ArtworkCard.tsx`
  - Consume `image-layout.ts` helpers.
- `src/components/ArtworkInfoPanel.tsx`
  - Use `RecipeNotePanel`.
- `src/app/page.tsx`
  - Add guided curation path module.
- `src/app/archive/page.tsx` and `src/components/ArchiveExplorer.tsx`
  - Use intelligent image layout for mixed orientation results.
- `src/app/exhibitions/[slug]/page.tsx`
  - Highlight featured works and guided next path.
- `src/app/works/[slug]/page.tsx`
  - Add fullscreen-ready image affordance and richer Recipe Note presentation.
- `src/app/globals.css`
  - Add small utilities for scrollable facet groups and fullscreen image surfaces if needed.

---

## 3. Implementation Tasks

### Task 1: Intelligent Image Layout Foundation

**Files:**

- Create: `src/lib/image-layout.ts`
- Create: `src/lib/image-layout.contract.ts`
- Modify: `package.json`
- Modify later consumers in Tasks 2-4.

- [ ] **Step 1: Write the failing layout contract test**

Create `src/lib/image-layout.contract.ts`:

```ts
import assert from "node:assert/strict";
import {
  getArtworkFrameClass,
  getArtworkGridSpanClass,
  getArtworkImageFitClass,
} from "./image-layout";

assert.equal(getArtworkFrameClass("portrait"), "aspect-[4/5]");
assert.equal(getArtworkFrameClass("landscape"), "aspect-[3/2]");
assert.equal(getArtworkFrameClass("square"), "aspect-square");

assert.equal(getArtworkImageFitClass("portrait", "card"), "object-cover");
assert.equal(getArtworkImageFitClass("landscape", "detail"), "object-contain");

assert.equal(getArtworkGridSpanClass("portrait", "archive"), "");
assert.equal(getArtworkGridSpanClass("landscape", "exhibition"), "md:col-span-2 md:px-10");
assert.equal(getArtworkGridSpanClass("landscape", "archive"), "xl:col-span-2");
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
npx tsx src/lib/image-layout.contract.ts
```

Expected: FAIL because `src/lib/image-layout.ts` does not exist.

- [ ] **Step 3: Implement layout helper**

Create `src/lib/image-layout.ts`:

```ts
import type { Artwork } from "@/data/artworks";

export type ArtworkSurface = "card" | "detail";
export type ArtworkGridContext = "archive" | "exhibition" | "related";

export function getArtworkFrameClass(orientation: Artwork["orientation"]) {
  const classes: Record<Artwork["orientation"], string> = {
    portrait: "aspect-[4/5]",
    landscape: "aspect-[3/2]",
    square: "aspect-square",
  };

  return classes[orientation];
}

export function getArtworkImageFitClass(
  orientation: Artwork["orientation"],
  surface: ArtworkSurface,
) {
  if (surface === "detail") return "object-contain";
  return orientation === "landscape" ? "object-cover" : "object-cover";
}

export function getArtworkGridSpanClass(
  orientation: Artwork["orientation"],
  context: ArtworkGridContext,
) {
  if (orientation !== "landscape") return "";
  if (context === "exhibition") return "md:col-span-2 md:px-10";
  if (context === "archive") return "xl:col-span-2";
  return "";
}
```

- [ ] **Step 4: Run the contract test and verify it passes**

Run:

```bash
npx tsx src/lib/image-layout.contract.ts
```

Expected: PASS.

- [ ] **Step 5: Add it to `test:contracts`**

Modify `package.json`:

```json
"test:contracts": "tsx src/lib/archive-query.contract.ts && tsx src/lib/artwork-query.contract.ts && tsx src/data/exhibition-contract.test.ts && tsx src/lib/image-layout.contract.ts"
```

- [ ] **Step 6: Run all contract tests**

Run:

```bash
npm run test:contracts
```

Expected: PASS.

---

### Task 2: Apply Intelligent Image Layout To Cards, Archive, Exhibition, and Work Detail

**Files:**

- Modify: `src/components/ArtworkCard.tsx`
- Modify: `src/components/ArchiveExplorer.tsx`
- Modify: `src/app/exhibitions/[slug]/page.tsx`
- Modify: `src/app/works/[slug]/page.tsx`

- [ ] **Step 1: Update `ArtworkCard` to use layout helpers**

Replace the local `frameByOrientation` and `imageFitByOrientation` maps in `src/components/ArtworkCard.tsx` with:

```ts
import {
  getArtworkFrameClass,
  getArtworkImageFitClass,
} from "@/lib/image-layout";
```

Use:

```tsx
const frameClass = getArtworkFrameClass(artwork.orientation);
const imageFitClass = getArtworkImageFitClass(artwork.orientation, "card");
```

Then update the frame and image class names:

```tsx
className={`relative mb-4 overflow-hidden rounded-card bg-mist/55 shadow-sm transition duration-700 group-hover:-translate-y-1 group-hover:shadow-md ${frameClass}`}
```

```tsx
className={`${imageFitClass} transition duration-700 group-hover:scale-[1.03]`}
```

- [ ] **Step 2: Update Archive result grid to let landscape works breathe**

In `src/components/ArchiveExplorer.tsx`, import:

```ts
import { getArtworkGridSpanClass } from "@/lib/image-layout";
```

Wrap each card with:

```tsx
<div className={getArtworkGridSpanClass(artwork.orientation, "archive")}>
  <ArtworkCard key={artwork.slug} artwork={artwork} variant="grid" />
</div>
```

Keep the `key` on the wrapper:

```tsx
<div key={artwork.slug} className={getArtworkGridSpanClass(artwork.orientation, "archive")}>
  <ArtworkCard artwork={artwork} variant="grid" />
</div>
```

- [ ] **Step 3: Update Exhibition grid to use the same helper**

In `src/app/exhibitions/[slug]/page.tsx`, import:

```ts
import { getArtworkGridSpanClass } from "@/lib/image-layout";
```

Replace the current landscape class expression with:

```tsx
className={getArtworkGridSpanClass(work.orientation, "exhibition")}
```

- [ ] **Step 4: Update Work detail image fitting**

In `src/app/works/[slug]/page.tsx`, import:

```ts
import { getArtworkImageFitClass } from "@/lib/image-layout";
```

Change the main image class to:

```tsx
className={`h-auto max-h-[86vh] w-full rounded-card ${getArtworkImageFitClass(work.orientation, "detail")}`}
```

- [ ] **Step 5: Verify**

Run:

```bash
npm run test:contracts
npx tsc --noEmit --pretty false
npm run lint
npm run build
```

Expected: all commands pass.

---

### Task 3: Guided Curation Path Data and Helpers

**Files:**

- Modify: `src/data/exhibitions.ts`
- Create: `src/lib/curation-path.ts`
- Create: `src/lib/curation-path.contract.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing curation path contract**

Create `src/lib/curation-path.contract.ts`:

```ts
import assert from "node:assert/strict";
import { getCurationPathForExhibition, getHomeCurationPath } from "./curation-path";

const homePath = getHomeCurationPath();
assert.equal(homePath.length, 6);
assert.equal(homePath[0].exhibition.slug, "blue-rooms");
assert.equal(homePath[0].featuredWorks.length, 3);

const distantFables = getCurationPathForExhibition("distant-fables");
assert.equal(distantFables?.exhibition.slug, "distant-fables");
assert.equal(distantFables?.nextExhibition.slug, "blue-rooms");
assert.ok(distantFables?.featuredWorks.every((work) => work.exhibition === "distant-fables"));

const missing = getCurationPathForExhibition("missing");
assert.equal(missing, undefined);
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
npx tsx src/lib/curation-path.contract.ts
```

Expected: FAIL because `curation-path.ts` does not exist and exhibitions do not yet expose `featuredWorkSlugs`.

- [ ] **Step 3: Add fields to `Exhibition` type**

In `src/data/exhibitions.ts`, extend `Exhibition`:

```ts
featuredWorkSlugs: string[];
pathLabel: string;
```

- [ ] **Step 4: Add featured work slugs to each exhibition**

Add these values to the matching exhibition objects:

```ts
featuredWorkSlugs: [
  "winter-blue-window-room",
  "morning-reading-room-0",
  "quiet-letter-by-the-window",
],
pathLabel: "Begin in the blue rooms",
```

```ts
featuredWorkSlugs: [
  "balcony-after-rain",
  "rainy-headphones-desk",
  "clear-girl-by-raindrop-window",
],
pathLabel: "Follow the rain archive",
```

```ts
featuredWorkSlugs: [
  "blue-white-glasshouse-dream",
  "moss-deer-at-glasshouse-end",
  "winter-greenhouse-bench",
],
pathLabel: "Enter the glasshouse",
```

```ts
featuredWorkSlugs: [
  "minimal-snow-station",
  "beginning-of-spring",
  "clear-sea-breeze-white-lighthouse",
],
pathLabel: "Travel by season",
```

```ts
featuredWorkSlugs: [
  "blue-white-atelier-girl",
  "afternoon-atelier-tidying",
  "girl-with-luminous-paper-crane",
],
pathLabel: "Return to the studio",
```

```ts
featuredWorkSlugs: [
  "midnight-library-spellbook",
  "paper-wing-guardian-in-clocktower",
  "lantern-fox-station-at-snowfield",
],
pathLabel: "Leave by fable",
```

- [ ] **Step 5: Implement curation path helpers**

Create `src/lib/curation-path.ts`:

```ts
import type { Artwork } from "@/data/artworks";
import type { Exhibition } from "@/data/exhibitions";
import { getArtworksBySlugs } from "@/lib/artwork-query";
import { getAllExhibitions, getExhibitionBySlug, getNextExhibition } from "@/lib/exhibition-query";

export type CurationPathEntry = {
  exhibition: Exhibition;
  featuredWorks: Artwork[];
  nextExhibition: Exhibition;
};

export function getCurationPathForExhibition(slug: string): CurationPathEntry | undefined {
  const exhibition = getExhibitionBySlug(slug);
  const nextExhibition = getNextExhibition(slug);

  if (!exhibition || !nextExhibition) return undefined;

  return {
    exhibition,
    featuredWorks: getArtworksBySlugs(exhibition.featuredWorkSlugs) as Artwork[],
    nextExhibition,
  };
}

export function getHomeCurationPath() {
  return getAllExhibitions()
    .map((exhibition) => getCurationPathForExhibition(exhibition.slug))
    .filter((entry): entry is CurationPathEntry => Boolean(entry));
}
```

- [ ] **Step 6: Run contract test and verify it passes**

Run:

```bash
npx tsx src/lib/curation-path.contract.ts
```

Expected: PASS.

- [ ] **Step 7: Add curation test to `test:contracts`**

Append:

```bash
&& tsx src/lib/curation-path.contract.ts
```

to the `test:contracts` script in `package.json`.

- [ ] **Step 8: Verify all contracts**

Run:

```bash
npm run test:contracts
```

Expected: PASS.

---

### Task 4: Render Guided Curation Trail

**Files:**

- Create: `src/components/CurationTrail.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/exhibitions/[slug]/page.tsx`
- Modify: `src/app/works/[slug]/page.tsx`

- [ ] **Step 1: Create reusable curation trail component**

Create `src/components/CurationTrail.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import type { CurationPathEntry } from "@/lib/curation-path";

export function CurationTrail({
  entry,
  compact = false,
}: {
  entry: CurationPathEntry;
  compact?: boolean;
}) {
  return (
    <section className="border-y border-ink/10 py-8">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 font-sans text-xs uppercase tracking-[0.25em] text-rain">
            Curation Path
          </p>
          <h2 className={compact ? "text-2xl leading-tight" : "text-3xl leading-tight"}>
            {entry.exhibition.pathLabel}
          </h2>
        </div>
        <Link
          href={`/exhibitions/${entry.nextExhibition.slug}`}
          className="font-sans text-xs uppercase tracking-[0.18em] text-rain transition-colors hover:text-amber"
        >
          Next: {entry.nextExhibition.titleEn}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {entry.featuredWorks.map((work) => (
          <Link key={work.slug} href={`/works/${work.slug}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mist/40">
              <Image
                src={work.thumbnail}
                alt={work.titleEn}
                fill
                sizes="(min-width: 1024px) 22vw, 90vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <p className="mt-3 text-lg leading-tight text-ink transition-colors group-hover:text-amber">
              {work.titleEn}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add curation path to home**

In `src/app/page.tsx`, import:

```ts
import { CurationTrail } from "@/components/CurationTrail";
import { getHomeCurationPath } from "@/lib/curation-path";
```

Inside `Home`, add:

```ts
const curationPath = getHomeCurationPath();
```

Render after the exhibitions section:

```tsx
<section className="page-x section-y mx-auto max-w-7xl">
  <FadeIn delay={0.1} className="mb-12 max-w-2xl">
    <p className="mb-3 text-xs uppercase tracking-[0.25em] text-rain">Suggested Route</p>
    <h2 className="text-3xl leading-tight sm:text-4xl">A guided route through the weather archive.</h2>
  </FadeIn>
  <div className="grid gap-10">
    {curationPath.slice(0, 2).map((entry) => (
      <CurationTrail key={entry.exhibition.slug} entry={entry} compact />
    ))}
  </div>
</section>
```

- [ ] **Step 3: Add curation path to exhibition detail**

In `src/app/exhibitions/[slug]/page.tsx`, import:

```ts
import { CurationTrail } from "@/components/CurationTrail";
import { getCurationPathForExhibition } from "@/lib/curation-path";
```

Inside `ExhibitionPage`, add:

```ts
const curationEntry = getCurationPathForExhibition(params.slug);
```

Render before the next exhibition link:

```tsx
{curationEntry && (
  <FadeIn delay={0.2} className="mx-auto mt-24 max-w-5xl">
    <CurationTrail entry={curationEntry} />
  </FadeIn>
)}
```

- [ ] **Step 4: Add subtle path return to work page**

In `src/app/works/[slug]/page.tsx`, import:

```ts
import { getCurationPathForExhibition } from "@/lib/curation-path";
```

Inside `WorkPage`, add:

```ts
const curationEntry = getCurationPathForExhibition(work.exhibition);
```

Render a small link near adjacent navigation:

```tsx
{curationEntry && (
  <Link
    href={`/exhibitions/${curationEntry.nextExhibition.slug}`}
    className="font-sans text-xs uppercase tracking-[0.2em] text-rain transition-colors hover:text-amber"
  >
    Continue path: {curationEntry.nextExhibition.titleEn}
  </Link>
)}
```

- [ ] **Step 5: Verify**

Run:

```bash
npm run test:contracts
npx tsc --noEmit --pretty false
npm run lint
npm run build
```

Expected: all commands pass.

---

### Task 5: Structured Recipe Notes

**Files:**

- Modify: `src/data/recipeNotes.ts`
- Create: `src/data/recipe-notes.contract.ts`
- Create: `src/components/RecipeNotePanel.tsx`
- Modify: `src/components/ArtworkInfoPanel.tsx`
- Modify: `package.json`

- [ ] **Step 1: Write failing Recipe Notes contract**

Create `src/data/recipe-notes.contract.ts`:

```ts
import assert from "node:assert/strict";
import { recipeNotes } from "./recipeNotes";

for (const note of recipeNotes) {
  assert.ok(note.palette.length >= 2, `${note.slug} should include palette notes`);
  assert.ok(note.composition.length >= 2, `${note.slug} should include composition notes`);
  assert.ok(note.atmosphere.length >= 2, `${note.slug} should include atmosphere notes`);
  assert.ok(note.direction.length >= 40, `${note.slug} should include a useful creative direction`);
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
npx tsx src/data/recipe-notes.contract.ts
```

Expected: FAIL because current notes only have `slug`, `title`, and `content`.

- [ ] **Step 3: Expand RecipeNote type**

In `src/data/recipeNotes.ts`, change `RecipeNote` to:

```ts
export type RecipeNote = {
  slug: string;
  title: string;
  content: string;
  palette: string[];
  composition: string[];
  atmosphere: string[];
  direction: string;
};
```

- [ ] **Step 4: Add structured fields to each existing note**

For each note, keep `slug`, `title`, `content`, then add values like:

```ts
palette: ["blue-white contrast", "paper cream", "muted rain grey"],
composition: ["figure held slightly off-center", "large quiet negative space"],
atmosphere: ["studio stillness", "soft daylight", "handled paper"],
direction:
  "Keep the image quiet and tactile: emphasize paper texture, restrained blue-white values, and a studio arrangement that feels observed rather than staged.",
```

Use specific values per note:

- `blue-white-atelier-girl`: studio, paper, blue-white, calm posture.
- `rainy-headphones-desk`: rain sound, desk objects, indoor listening.
- `moss-deer-at-glasshouse-end`: botanical green, folklore gesture, glass reflections.
- `tide-postman-and-cloud-whale`: impossible scale, ordinary errand, pale sea air.
- `quiet-letter-by-the-window`: window narrative, letter, empty space, unread words.

- [ ] **Step 5: Create Recipe Note panel**

Create `src/components/RecipeNotePanel.tsx`:

```tsx
import type { RecipeNote } from "@/data/recipeNotes";

const groups = [
  ["Palette", "palette"],
  ["Composition", "composition"],
  ["Atmosphere", "atmosphere"],
] as const;

export function RecipeNotePanel({ note }: { note: RecipeNote }) {
  return (
    <section className="rounded-card border border-amber/35 bg-paper/70 p-5">
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-rain">
        Recipe Note
      </p>
      <h2 className="text-lg text-ink">{note.title}</h2>
      <p className="mt-3 text-sm leading-7 text-ink/70">{note.content}</p>
      <div className="mt-5 grid gap-4">
        {groups.map(([label, key]) => (
          <div key={key}>
            <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.2em] text-rain">
              {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {note[key].map((item) => (
                <span
                  key={item}
                  className="rounded-sm border border-mist bg-cream/70 px-2 py-1 font-sans text-xs text-rain"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 border-l border-amber/70 pl-4 text-sm leading-7 text-ink/70">
        {note.direction}
      </p>
    </section>
  );
}
```

- [ ] **Step 6: Use RecipeNotePanel in artwork info**

In `src/components/ArtworkInfoPanel.tsx`, import:

```ts
import { RecipeNotePanel } from "@/components/RecipeNotePanel";
```

Replace the existing `recipeNote` section with:

```tsx
{recipeNote && (
  <section className="mt-10">
    <RecipeNotePanel note={recipeNote} />
  </section>
)}
```

- [ ] **Step 7: Add Recipe Note contract to script**

Append:

```bash
&& tsx src/data/recipe-notes.contract.ts
```

to `test:contracts`.

- [ ] **Step 8: Verify**

Run:

```bash
npm run test:contracts
npx tsc --noEmit --pretty false
npm run lint
npm run build
```

Expected: all commands pass.

---

### Task 6: Launch Quality Validation Layer

**Files:**

- Create: `src/lib/validation-report.ts`
- Create: `src/lib/validation-report.contract.ts`
- Modify: `package.json`
- Create: `playwright/misty-atelier.spec.ts`

- [ ] **Step 1: Write failing validation contract**

Create `src/lib/validation-report.contract.ts`:

```ts
import assert from "node:assert/strict";
import { getValidationReport } from "./validation-report";

const report = getValidationReport();

assert.equal(report.missingFullImages.length, 0);
assert.equal(report.missingThumbnails.length, 0);
assert.equal(report.brokenExhibitionWorkLinks.length, 0);
assert.equal(report.brokenRecipeNoteLinks.length, 0);
assert.equal(report.duplicateArtworkSlugs.length, 0);
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
npx tsx src/lib/validation-report.contract.ts
```

Expected: FAIL because `validation-report.ts` does not exist.

- [ ] **Step 3: Implement validation report**

Create `src/lib/validation-report.ts`:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { artworks } from "@/data/artworks";
import { exhibitions } from "@/data/exhibitions";
import { recipeNotes } from "@/data/recipeNotes";

function findDuplicates(values: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }

  return Array.from(duplicates);
}

function publicPathExists(publicPath: string) {
  return existsSync(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

export function getValidationReport() {
  const artworkSlugs = new Set(artworks.map((artwork) => artwork.slug));
  const recipeSlugs = new Set(recipeNotes.map((note) => note.slug));

  return {
    missingFullImages: artworks
      .filter((artwork) => !publicPathExists(artwork.src))
      .map((artwork) => artwork.slug),
    missingThumbnails: artworks
      .filter((artwork) => !publicPathExists(artwork.thumbnail))
      .map((artwork) => artwork.slug),
    brokenExhibitionWorkLinks: exhibitions.flatMap((exhibition) =>
      exhibition.works
        .filter((slug) => !artworkSlugs.has(slug))
        .map((slug) => `${exhibition.slug}:${slug}`),
    ),
    brokenRecipeNoteLinks: artworks
      .filter((artwork) => artwork.recipeNotesId && !recipeSlugs.has(artwork.recipeNotesId))
      .map((artwork) => artwork.slug),
    duplicateArtworkSlugs: findDuplicates(artworks.map((artwork) => artwork.slug)),
  };
}
```

- [ ] **Step 4: Add validation contract to scripts**

Append:

```bash
&& tsx src/lib/validation-report.contract.ts
```

to `test:contracts`.

- [ ] **Step 5: Add `validate` script**

In `package.json`, add:

```json
"validate": "npm run test:contracts && npx tsc --noEmit --pretty false && npm run lint && npm run build"
```

- [ ] **Step 6: Create Playwright smoke test**

Create `playwright/misty-atelier.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("archive filters landscape works", async ({ page }) => {
  await page.goto("/archive");
  await expect(page.getByRole("heading", { name: "Weather-indexed works." })).toBeVisible();
  await expect(page.locator('a[href^="/works/"]')).toHaveCount(54);
  await page.getByRole("button", { name: "landscape" }).click();
  await expect(page.locator('a[href^="/works/"]')).toHaveCount(3);
});

test("work pages expose adjacent navigation", async ({ page }) => {
  await page.goto("/works/winter-blue-window-room");
  await expect(page.getByText("Previous Work")).toBeVisible();
  await expect(page.getByText("Next Work")).toBeVisible();
});

test("exhibition pages expose curator notes", async ({ page }) => {
  await page.goto("/exhibitions/distant-fables");
  await expect(page.getByText("Curator Note")).toBeVisible();
  await expect(page.getByText("quiet myths")).toBeVisible();
});
```

- [ ] **Step 7: Add Playwright config if missing**

If `playwright.config.ts` does not exist, create:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  webServer: {
    command: "npm run dev -- -p 3001",
    url: "http://localhost:3001",
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:3001",
    viewport: { width: 1440, height: 1000 },
  },
});
```

- [ ] **Step 8: Verify full validation**

Run:

```bash
npm run validate
npm run test
```

Expected: validation passes and Playwright tests pass.

---

## 4. Final Quality Gate

After all tasks are complete, run:

```bash
npm run validate
npm run test
```

Then manually spot-check:

- `/`
  - Home still opens with a strong first impression.
  - Suggested Route does not overcrowd the page.
  - Lanyard still lazy-loads and remains complete.
- `/archive`
  - `landscape` filter shows three horizontal works without losing the result grid.
  - Search for `clocktower` returns Paper Wing Guardian In Clocktower.
  - Long mood/color/scene facet groups stay scrollable and do not push results offscreen.
- `/exhibitions/distant-fables`
  - Curator Note is visible.
  - Featured path feels like a guided route, not a duplicate grid.
  - Landscape works span wider than portrait works.
- `/works/winter-blue-window-room`
  - Previous and Next links appear.
  - Recipe Note panel renders structured method content when available.
  - Main image stays fully visible.
- Mobile width around `390px`
  - No overlapping text.
  - Archive controls remain readable.
  - Adjacent work links stack cleanly.

---

## 5. What To Avoid

Do not add these in this optimization pass:

- CMS or database.
- User accounts.
- Like/favorite system.
- Download or wallpaper feature.
- More 3D components.
- Large shader backgrounds.
- Commercial service pages.
- Full internationalization framework.

These are later-stage features. This plan focuses on visual professionalism, guided browsing, content depth, and launch confidence.

---

## 6. Recommended Execution Order

1. Task 1 and Task 2 first, because image layout directly fixes the recurring horizontal/vertical image issue.
2. Task 3 and Task 4 second, because guided curation gives the site a stronger browsing path.
3. Task 5 third, because Recipe Notes become more valuable once the visual route is clear.
4. Task 6 last, because validation should lock down the final behavior after the feature shape stabilizes.

Each task should end with a small commit if the worktree policy allows commits. If the worktree contains unrelated user changes, stage only files changed by that task.
