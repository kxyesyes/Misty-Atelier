# Misty Atelier Existing Project Optimization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the current working Next.js prototype into a polished Misty Atelier V1 portfolio without expanding scope beyond the confirmed first version.

**Architecture:** Keep the current Next.js App Router structure, but add a small query layer, richer typed data, and a stronger visual system. The first optimization pass should improve project identity, data quality, homepage structure, and page polish while preserving the existing 54 artwork assets.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, local static image assets.

---

## 1. Current Baseline

The project already has:

- A working Next.js app in `E:\Misty-Atelier`.
- 54 full-size artwork images and 54 thumbnails under `public/images/artworks`.
- Static pages for Home, Exhibition Detail, and Work Detail.
- Basic data files:
  - `src/data/artworks.ts`
  - `src/data/exhibitions.ts`
  - `src/data/recipeNotes.ts`
- A basic `FadeIn` motion component.
- A passing production build.

The current project is healthy, but still feels like a prototype:

- `layout.tsx` still uses create-next-app metadata.
- `README.md` is still the default Next.js README.
- Pages query data directly with `find` and `filter`.
- Exhibition and artwork data are too thin for a curated portfolio.
- Home is a simple exhibition grid, not the planned curated index.
- Global styles are still close to the default scaffold.

## 2. Optimization Strategy

Do not add large new features yet.

Optimize in this order:

1. Project identity
2. Query layer
3. Data model
4. Visual system
5. Home page
6. Exhibition page
7. Work detail page
8. Quality checks

This order keeps risk low. It improves the foundation before visual redesign, and it avoids scattering data logic across pages.

---

## 3. File Structure Changes

### New Files

- `src/lib/artwork-query.ts`
  - Responsible for artwork lookup, featured artwork, related artwork, and artwork filtering.

- `src/lib/exhibition-query.ts`
  - Responsible for exhibition lookup, featured exhibitions, next exhibition, and exhibition artwork lookup.

- `src/lib/recipe-query.ts`
  - Responsible for finding Recipe Notes by artwork slug.

- `src/lib/site.ts`
  - Central place for site name, description, navigation, and contact display values.

### Modified Files

- `src/app/layout.tsx`
  - Replace create-next-app metadata with Misty Atelier metadata.

- `README.md`
  - Replace default Next.js README with project-specific documentation.

- `src/data/exhibitions.ts`
  - Add richer exhibition fields.

- `src/data/artworks.ts`
  - Add richer artwork fields.

- `src/data/recipeNotes.ts`
  - Keep current notes, but connect through `recipeNotesId` or artwork slug consistently.

- `src/app/page.tsx`
  - Replace simple grid with curated index homepage.

- `src/app/exhibitions/[slug]/page.tsx`
  - Use query layer and richer exhibition data.

- `src/app/works/[slug]/page.tsx`
  - Use query layer, add description/tags/related works.

- `src/app/globals.css`
  - Add Misty Atelier visual tokens and base styling.

---

## 4. Implementation Tasks

### Task 1: Project Identity Cleanup

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `README.md`
- Create: `src/lib/site.ts`

- [ ] **Step 1: Create site constants**

Create `src/lib/site.ts`:

```ts
export const site = {
  name: "Misty Atelier",
  title: "Misty Atelier",
  description: "A quiet index of illustrated rooms, weather, and seasonal light.",
  url: "https://misty-atelier.local",
  navigation: [
    { label: "Exhibitions", href: "/" },
    { label: "Recipe Notes", href: "/#recipe-notes" },
    { label: "Contact", href: "/#contact" },
  ],
};
```

- [ ] **Step 2: Update metadata**

Modify `src/app/layout.tsx` metadata:

```ts
export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};
```

Also import:

```ts
import { site } from "@/lib/site";
```

- [ ] **Step 3: Set document language**

Use:

```tsx
<html lang="zh-CN">
```

- [ ] **Step 4: Replace README**

Rewrite `README.md` with:

```md
# Misty Atelier

Misty Atelier is a curated visual portfolio built with Next.js, TypeScript, Tailwind CSS, and local static artwork data.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Project Focus

- Curated visual portfolio
- Six exhibition sections
- 54 selected artworks
- Lightweight Recipe Notes
- Static data first, no CMS in V1
```

- [ ] **Step 5: Verify**

Run:

```bash
npm run build
```

Expected: build passes.

---

### Task 2: Add Query Layer

**Files:**

- Create: `src/lib/artwork-query.ts`
- Create: `src/lib/exhibition-query.ts`
- Create: `src/lib/recipe-query.ts`
- Modify: `src/app/exhibitions/[slug]/page.tsx`
- Modify: `src/app/works/[slug]/page.tsx`

- [ ] **Step 1: Create artwork query helpers**

Create `src/lib/artwork-query.ts`:

```ts
import { artworks } from "@/data/artworks";

export function getAllArtworks() {
  return artworks;
}

export function getArtworkBySlug(slug: string) {
  return artworks.find((artwork) => artwork.slug === slug);
}

export function getArtworksByExhibition(exhibitionSlug: string) {
  return artworks.filter((artwork) => artwork.exhibition === exhibitionSlug);
}

export function getFeaturedArtworks(limit = 6) {
  return artworks.filter((artwork) => artwork.featured).slice(0, limit);
}

export function getRelatedArtworks(slug: string, limit = 4) {
  const current = getArtworkBySlug(slug);
  if (!current) return [];

  return artworks
    .filter((artwork) => artwork.slug !== slug && artwork.exhibition === current.exhibition)
    .slice(0, limit);
}
```

- [ ] **Step 2: Create exhibition query helpers**

Create `src/lib/exhibition-query.ts`:

```ts
import { exhibitions } from "@/data/exhibitions";
import { getArtworksByExhibition } from "@/lib/artwork-query";

export function getAllExhibitions() {
  return [...exhibitions].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedExhibitions() {
  return getAllExhibitions().filter((exhibition) => exhibition.featured);
}

export function getExhibitionBySlug(slug: string) {
  return exhibitions.find((exhibition) => exhibition.slug === slug);
}

export function getExhibitionArtworks(slug: string) {
  return getArtworksByExhibition(slug);
}

export function getNextExhibition(slug: string) {
  const ordered = getAllExhibitions();
  const index = ordered.findIndex((exhibition) => exhibition.slug === slug);
  if (index === -1) return undefined;
  return ordered[(index + 1) % ordered.length];
}
```

- [ ] **Step 3: Create recipe query helper**

Create `src/lib/recipe-query.ts`:

```ts
import { recipeNotes } from "@/data/recipeNotes";

export function getRecipeNoteByArtworkSlug(slug: string) {
  return recipeNotes.find((note) => note.slug === slug);
}
```

- [ ] **Step 4: Refactor pages to use helpers**

Replace direct `find` and `filter` calls in route pages with query helpers.

- [ ] **Step 5: Verify**

Run:

```bash
npm run build
```

Expected: build passes, routes remain unchanged.

---

### Task 3: Enrich Data Models

**Files:**

- Modify: `src/data/exhibitions.ts`
- Modify: `src/data/artworks.ts`
- Modify: `src/data/recipeNotes.ts`

- [ ] **Step 1: Extend Exhibition type**

Update `Exhibition`:

```ts
export type Exhibition = {
  slug: string;
  titleEn: string;
  titleZh: string;
  summary: string;
  coverArtworkSlug: string;
  palette: {
    background: string;
    foreground: string;
    accent: string;
  };
  featured: boolean;
  sortOrder: number;
  works: string[];
};
```

- [ ] **Step 2: Add exhibition summaries**

Use these initial summaries:

```ts
{
  slug: "blue-rooms",
  summary: "Quiet interiors shaped by windows, books, pale rooms, and blue-toned light.",
  coverArtworkSlug: "winter-blue-window-room",
  palette: { background: "#eef4f6", foreground: "#24313a", accent: "#7f929c" },
  featured: true,
  sortOrder: 1,
}
```

Repeat with matching values for all six exhibitions:

- `rain-archive`: rain, balcony, mist, soft weather
- `glasshouse-dreams`: glass, flowers, pale greens, indoor nature
- `seasonal-stations`: snow, spring terms, stations, seasonal travel
- `atelier-hours`: studio, drawing, art supplies, creative rooms
- `distant-fables`: symbolic fantasy, distant places, quiet myths

- [ ] **Step 3: Extend Artwork type**

Update `Artwork`:

```ts
export type Artwork = {
  slug: string;
  titleEn: string;
  titleZh: string;
  exhibition: string;
  src: string;
  thumbnail: string;
  description: string;
  tags: string[];
  featured: boolean;
  recipeNotesId?: string;
};
```

- [ ] **Step 4: Add minimal artwork metadata**

For each artwork:

- `description`: one concise sentence.
- `tags`: 3-5 tags.
- `featured`: true for homepage-worthy works.
- `recipeNotesId`: only for the 5 selected Recipe Notes.

Initial featured works:

```ts
[
  "winter-blue-window-room",
  "balcony-after-rain",
  "blue-white-glasshouse-dream",
  "minimal-snow-station",
  "blue-white-atelier-girl",
  "tide-postman-and-cloud-whale"
]
```

- [ ] **Step 5: Verify**

Run:

```bash
npm run build
```

Expected: TypeScript errors reveal any missing fields; fix them until build passes.

---

### Task 4: Visual System Pass

**Files:**

- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Add CSS tokens**

Add to `globals.css`:

```css
:root {
  --color-ink: #24313a;
  --color-paper: #f7f4ee;
  --color-cream: #fffaf3;
  --color-mist: #dbe7ec;
  --color-rain: #7f929c;
  --color-amber: #d8b486;
  --radius-card: 6px;
  --space-page-x: clamp(20px, 4vw, 64px);
  --space-section-y: clamp(56px, 9vw, 128px);
}
```

- [ ] **Step 2: Replace default body styling**

Use:

```css
body {
  color: var(--color-ink);
  background:
    radial-gradient(circle at 12% 8%, rgba(219, 231, 236, 0.7), transparent 28rem),
    linear-gradient(180deg, #f7f4ee 0%, #fffaf3 100%);
  font-family: Arial, Helvetica, sans-serif;
}
```

- [ ] **Step 3: Remove default dark-mode inversion**

Remove the current `prefers-color-scheme: dark` block unless a real dark visual system is designed.

- [ ] **Step 4: Verify**

Run:

```bash
npm run build
```

Expected: build passes.

---

### Task 5: Rebuild Home As Curated Index

**Files:**

- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace simple header**

Home should start with:

- Navigation
- Brand name
- Curatorial line
- Three representative images

Use:

```tsx
const heroWorks = [
  "winter-blue-window-room",
  "balcony-after-rain",
  "blue-white-glasshouse-dream",
];
```

- [ ] **Step 2: Render featured exhibitions**

Use `getFeaturedExhibitions()` and each exhibition's `coverArtworkSlug`.

- [ ] **Step 3: Add Studio Note**

Add:

```tsx
<section id="recipe-notes">
  <p>
    Misty Atelier collects quiet rooms, illustrated weather, and seasonal light
    into a small visual archive. Selected works include Recipe Notes that reveal
    palette, composition, and prompt strategy.
  </p>
</section>
```

- [ ] **Step 4: Add Contact footer**

Add:

```tsx
<footer id="contact">
  <p>Open for selected visual collaborations.</p>
</footer>
```

- [ ] **Step 5: Verify**

Run:

```bash
npm run build
```

Expected: build passes, `/` prerenders.

---

### Task 6: Improve Exhibition Detail Pages

**Files:**

- Modify: `src/app/exhibitions/[slug]/page.tsx`

- [ ] **Step 1: Use query layer**

Use:

```ts
const ex = getExhibitionBySlug(params.slug);
const exWorks = getExhibitionArtworks(params.slug);
const nextExhibition = getNextExhibition(params.slug);
```

- [ ] **Step 2: Add exhibition summary**

Render:

```tsx
<p>{ex.summary}</p>
```

- [ ] **Step 3: Use thumbnails in grid**

Use `work.thumbnail` for list/grid pages.

- [ ] **Step 4: Add next exhibition link**

Add a bottom link to `nextExhibition`.

- [ ] **Step 5: Verify**

Run:

```bash
npm run build
```

Expected: six exhibition pages build successfully.

---

### Task 7: Improve Work Detail Pages

**Files:**

- Modify: `src/app/works/[slug]/page.tsx`

- [ ] **Step 1: Use query layer**

Use:

```ts
const work = getArtworkBySlug(params.slug);
const note = getRecipeNoteByArtworkSlug(params.slug);
const relatedWorks = getRelatedArtworks(params.slug);
```

- [ ] **Step 2: Render description and tags**

Render:

```tsx
<p>{work.description}</p>
<ul>
  {work.tags.map((tag) => (
    <li key={tag}>{tag}</li>
  ))}
</ul>
```

- [ ] **Step 3: Improve Recipe Notes display**

Use a visually secondary panel labeled `Recipe Notes`.

- [ ] **Step 4: Add related works**

Render four related works from the same exhibition.

- [ ] **Step 5: Verify**

Run:

```bash
npm run build
```

Expected: all 54 work pages build successfully.

---

## 5. Final Quality Gate

After all tasks:

- [ ] Run `npm run build`.
- [ ] Open `/`.
- [ ] Open all six exhibition pages.
- [ ] Spot-check ten work pages.
- [ ] Check mobile width around 390px.
- [ ] Check desktop width around 1440px.
- [ ] Confirm the homepage no longer looks like a basic grid.
- [ ] Confirm images remain the visual focus.
- [ ] Confirm text does not overlap or overflow.

## 6. What To Avoid In This Iteration

Do not add these yet:

- Full Archive page
- CMS
- Search/filter system
- Like/favorite system
- Download system
- Heavy shader background
- Complex GSAP scroll story
- Commercial service page

This iteration should make the existing V1 feel curated, stable, and visually intentional.
