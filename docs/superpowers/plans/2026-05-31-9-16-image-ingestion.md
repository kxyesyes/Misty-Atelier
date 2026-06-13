# 9:16 Image Ingestion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import every available 9:16 artwork candidate into Misty Atelier while ignoring 1:1 avatar images and 16:9 landscape images for this phase.

**Architecture:** Keep the curated V1 data intact and add a generated import layer for bulk 9:16 assets. Source images remain outside the app in `E:\美图`; generated JPGs go into `public/images/artworks/full` and `public/images/artworks/thumbs`; generated records are combined with curated records by `src/data/artworks.ts`.

**Tech Stack:** Next.js 14, TypeScript, Python 3.11, Pillow, existing CSV candidate scan, Playwright, current `npm run validate` pipeline.

---

## Current Findings

- Existing app has 54 curated artworks in `public/images/artworks/full`.
- `docs/2026-05-29-misty-atelier-candidate-scan.csv` contains 623 scanned candidates.
- Treat 9:16 as ratio `0.55 <= width / height <= 0.575`.
- The scan currently contains 432 matching 9:16 candidates.
- 23 of those already exist in the app by slug.
- The first import target is therefore 409 new 9:16 images.
- Breakdown of the 409 new 9:16 images:
  - Blue Rooms: 32
  - Rain Archive: 46
  - Glasshouse Dreams: 16
  - Seasonal Stations: 13
  - Atelier Hours: 67
  - Distant Fables: 52
  - Future: Porcelain Silence: 102
  - Needs Review: 81

## Product Decision

This phase imports all 9:16 images, but only the existing curated V1 works remain featured on the homepage and route page.

Imported 9:16 works are visible through archive and exhibition pages. They are not automatically added to:

- homepage hero
- homepage selected works
- route featured works
- recipe notes
- wide outpainting queue

`Future: Porcelain Silence` becomes a new non-featured exhibition named `Porcelain Silence`.

`Needs Review` becomes a non-featured holding exhibition named `Holding Room`. This keeps all 9:16 images accessible without pretending the uncertain ones are already curated.

## Files To Create Or Modify

- Create `scripts/scan_9_16_candidates.py`
  - Reads `docs/2026-05-29-misty-atelier-candidate-scan.csv`.
  - Selects candidates with ratio between `0.55` and `0.575`.
  - Excludes candidates whose slug already exists in `public/images/artworks/full`.
  - Resolves source files under `E:\美图`.
  - Writes `docs/9-16-import-manifest.csv`.

- Create `scripts/import_9_16_assets.py`
  - Reads `docs/9-16-import-manifest.csv`.
  - Copies source images into `public/images/artworks/full`.
  - Converts PNG/WebP/JPEG into JPG.
  - Generates thumbnails into `public/images/artworks/thumbs`.
  - Skips existing output files by default.

- Create `scripts/generate_imported_artworks.py`
  - Reads `docs/9-16-import-manifest.csv`.
  - Generates `src/data/importedArtworks.generated.ts`.
  - Gives every imported record complete `ArtworkRecord` fields.

- Create `src/data/importedArtworks.generated.ts`
  - Generated list of bulk imported records.
  - Contains no hand-written curated route content.

- Modify `src/data/artworks.ts`
  - Export `ArtworkRecord` so generated records can share the type.
  - Rename current `records` to `curatedRecords`.
  - Import `importedArtworkRecords`.
  - Export `artworks` from `[...curatedRecords, ...importedArtworkRecords].map(withImagePaths)`.
  - Keep `featuredSlugs`, `wideArtworkSlugs`, and curated captions unchanged.

- Modify `src/data/exhibitions.ts`
  - Add `porcelain-silence`.
  - Add `holding-room`.
  - Mark both as `featured: false`.
  - Give both `featuredWorkSlugs: []` so they do not enter the route system.

- Modify `src/lib/curation-path.ts`
  - Make `getCurationPathForExhibition` return `undefined` when `featuredWorkSlugs.length === 0`.
  - This prevents non-featured bulk exhibitions from creating empty route cards.

- Modify `src/lib/curation-path.contract.ts`
  - Assert `getHomeCurationPath().length === 6`.
  - Assert `getCurationPathForExhibition("holding-room") === undefined`.
  - Assert `getCurationPathForExhibition("porcelain-silence") === undefined`.

- Modify `src/lib/archive-query.contract.ts`
  - Replace fixed total expectations with data-derived checks where possible.
  - Add a check that 9:16 imported works appear in archive results after generation.

- Modify `src/data/exhibition-contract.test.ts`
  - Allow non-featured exhibitions to have no route `featuredWorkSlugs`.
  - Keep keyword, curator note, and summary requirements.

- Modify `playwright/misty-atelier.spec.ts`
  - Update archive total from 54 to the generated artwork count.
  - Add a test for `/exhibitions/porcelain-silence`.
  - Add a test for `/exhibitions/holding-room`.

- Modify `package.json`
  - Add `images:scan9x16`.
  - Add `images:import9x16`.
  - Add `images:generate-imported-data`.
  - Add `images:refresh` to run import, generated data, and metadata generation.

## Task 1: Generate A 9:16 Import Manifest

**Files:**
- Create: `scripts/scan_9_16_candidates.py`
- Create output: `docs/9-16-import-manifest.csv`

- [ ] **Step 1: Create the scanner script**

```python
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANDIDATES = ROOT / "docs" / "2026-05-29-misty-atelier-candidate-scan.csv"
OUTPUT = ROOT / "docs" / "9-16-import-manifest.csv"
SOURCE_ROOT = Path("E:/美图")
FULL_DIR = ROOT / "public" / "images" / "artworks" / "full"
MIN_RATIO = 0.55
MAX_RATIO = 0.575

EXHIBITION_MAP = {
    "Blue Rooms / 蓝调房间": "blue-rooms",
    "Rain Archive / 雨的档案": "rain-archive",
    "Glasshouse Dreams / 玻璃温室梦": "glasshouse-dreams",
    "Seasonal Stations / 季节候车室": "seasonal-stations",
    "Atelier Hours / 画室时刻": "atelier-hours",
    "Distant Fables / 远方寓言": "distant-fables",
    "Future: Porcelain Silence / 瓷白静物": "porcelain-silence",
    "Needs Review / 待人工判断": "holding-room",
}


def find_source_file(file_name: str) -> Path | None:
    direct = SOURCE_ROOT / file_name
    if direct.exists():
        return direct
    matches = list(SOURCE_ROOT.rglob(file_name))
    return matches[0] if matches else None


def main() -> None:
    existing_slugs = {path.stem for path in FULL_DIR.glob("*.jpg")}
    rows: list[dict[str, str]] = []

    with CANDIDATES.open("r", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            ratio = float(row["ratio"])
            slug = row["id"]
            if ratio < MIN_RATIO or ratio > MAX_RATIO:
                continue
            if slug in existing_slugs:
                continue
            exhibition = EXHIBITION_MAP[row["suggestedExhibition"]]
            source = find_source_file(row["file"])
            if source is None:
                raise FileNotFoundError(f"Cannot resolve source image for {slug}: {row['file']}")
            rows.append(
                {
                    "slug": slug,
                    "sourcePath": str(source),
                    "titleZh": row["title"],
                    "exhibition": exhibition,
                    "width": row["width"],
                    "height": row["height"],
                    "ratio": row["ratio"],
                    "priorityScore": row["priorityScore"],
                    "suggestedExhibition": row["suggestedExhibition"],
                    "inferredTags": row["inferredTags"],
                }
            )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} 9:16 import rows to {OUTPUT}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run the scanner**

Run:

```powershell
python scripts/scan_9_16_candidates.py
```

Expected:

```txt
Wrote 409 9:16 import rows to E:\Misty-Atelier\docs\9-16-import-manifest.csv
```

- [ ] **Step 3: Inspect the manifest**

Run:

```powershell
Import-Csv docs/9-16-import-manifest.csv | Group-Object exhibition | Select-Object Name,Count
```

Expected:

```txt
blue-rooms           32
rain-archive         46
glasshouse-dreams    16
seasonal-stations    13
atelier-hours        67
distant-fables       52
porcelain-silence   102
holding-room         81
```

## Task 2: Import 9:16 Assets Safely

**Files:**
- Create: `scripts/import_9_16_assets.py`
- Output: `public/images/artworks/full/*.jpg`
- Output: `public/images/artworks/thumbs/*.jpg`

- [ ] **Step 1: Create the importer script**

```python
from __future__ import annotations

import csv
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "docs" / "9-16-import-manifest.csv"
FULL_DIR = ROOT / "public" / "images" / "artworks" / "full"
THUMB_DIR = ROOT / "public" / "images" / "artworks" / "thumbs"


def save_jpg(source: Path, full_dest: Path, thumb_dest: Path) -> None:
    with Image.open(source) as image:
        image = image.convert("RGB")
        if not full_dest.exists():
            image.save(full_dest, "JPEG", quality=90, optimize=True)
        thumb = image.copy()
        thumb.thumbnail((1200, 1200), Image.LANCZOS)
        if not thumb_dest.exists():
            thumb.save(thumb_dest, "JPEG", quality=88, optimize=True)


def main() -> None:
    FULL_DIR.mkdir(parents=True, exist_ok=True)
    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    imported = 0
    skipped = 0

    with MANIFEST.open("r", encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            slug = row["slug"]
            source = Path(row["sourcePath"])
            full_dest = FULL_DIR / f"{slug}.jpg"
            thumb_dest = THUMB_DIR / f"{slug}.jpg"
            if full_dest.exists() and thumb_dest.exists():
                skipped += 1
                continue
            save_jpg(source, full_dest, thumb_dest)
            imported += 1

    print(f"Imported {imported} image pairs; skipped {skipped} existing pairs")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run importer**

Run:

```powershell
python scripts/import_9_16_assets.py
```

Expected:

```txt
Imported 409 image pairs; skipped 0 existing pairs
```

- [ ] **Step 3: Verify output count**

Run:

```powershell
(Get-ChildItem public/images/artworks/full -File | Measure-Object).Count
(Get-ChildItem public/images/artworks/thumbs -File | Measure-Object).Count
```

Expected after import:

```txt
463
463
```

## Task 3: Generate Imported Artwork Data

**Files:**
- Create: `scripts/generate_imported_artworks.py`
- Create: `src/data/importedArtworks.generated.ts`
- Modify: `src/data/artworks.ts`

- [ ] **Step 1: Create generated data script**

The script must generate English titles from slugs and preserve Chinese titles from the manifest.

```python
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "docs" / "9-16-import-manifest.csv"
OUTPUT = ROOT / "src" / "data" / "importedArtworks.generated.ts"


def title_from_slug(slug: str) -> str:
    small_words = {"a", "an", "and", "at", "by", "for", "in", "of", "on", "the", "to", "with"}
    words = slug.replace("-", " ").split()
    titled = []
    for index, word in enumerate(words):
        titled.append(word.capitalize() if index == 0 or word not in small_words else word)
    return " ".join(titled)


def split_tags(raw: str) -> list[str]:
    return [tag.strip() for tag in raw.split(";") if tag.strip()]


def js_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    rows: list[dict[str, str]] = []
    with MANIFEST.open("r", encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))

    lines = [
        'import type { ArtworkRecord } from "./artworks";',
        "",
        "export const importedArtworkRecords: ArtworkRecord[] = [",
    ]

    for row in rows:
        tags = split_tags(row["inferredTags"])
        tag_values = tags or ["illustration"]
        tag_literal = ", ".join(f'"{js_string(tag)}"' for tag in tag_values)
        lines.extend(
            [
                "  {",
                f'    slug: "{js_string(row["slug"])}",',
                f'    titleEn: "{js_string(title_from_slug(row["slug"]))}",',
                f'    titleZh: "{js_string(row["titleZh"])}",',
                f'    exhibition: "{js_string(row["exhibition"])}",',
                f'    description: "A 9:16 archive addition selected for its vertical composition and quiet visual atmosphere.",',
                f"    tags: [{tag_literal}],",
                f"    colorTags: [{tag_literal}],",
                '    moodTags: ["quiet", "atmospheric"],',
                f"    sceneTags: [{tag_literal}],",
                "    featured: false,",
                "  },",
            ]
        )

    lines.extend(["];", ""])
    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Generated {len(rows)} imported artwork records at {OUTPUT}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run generator**

Run:

```powershell
python scripts/generate_imported_artworks.py
```

Expected:

```txt
Generated 409 imported artwork records at E:\Misty-Atelier\src\data\importedArtworks.generated.ts
```

- [ ] **Step 3: Modify `src/data/artworks.ts`**

Change the local record type export:

```ts
export type ArtworkRecord = Omit<
  Artwork,
  "src" | "thumbnail" | "wideSrc" | "wideThumbnail" | "width" | "height" | "aspectRatio" | "formatCategory" | "orientation"
>;
```

Import the generated records:

```ts
import { importedArtworkRecords } from "./importedArtworks.generated";
```

Rename:

```ts
const records: ArtworkRecord[] = [
```

to:

```ts
const curatedRecords: ArtworkRecord[] = [
```

Replace the final export with:

```ts
export const artworks: Artwork[] = [...curatedRecords, ...importedArtworkRecords].map(withImagePaths);
```

## Task 4: Add Non-Featured Exhibitions

**Files:**
- Modify: `src/data/exhibitions.ts`
- Modify: `src/lib/curation-path.ts`
- Modify: `src/lib/curation-path.contract.ts`

- [ ] **Step 1: Add `porcelain-silence` to exhibitions**

Add this exhibition object after `distant-fables`:

```ts
{
  slug: "porcelain-silence",
  titleEn: "Porcelain Silence",
  titleZh: "瓷白静物",
  works: [],
  summary: "Pale porcelain, quiet surfaces, and still compositions held outside the main route.",
  coverArtworkSlug: "porcelain-silence-cover",
  palette: {
    background: "#f4f0eb",
    foreground: "#303034",
    accent: "#b9a98f",
  },
  keywords: ["porcelain", "stillness", "pale objects"],
  curatorNote:
    "Porcelain Silence is a holding exhibition for pale 9:16 works whose quiet object language expands the archive without changing the six-route structure.",
  featuredWorkSlugs: [],
  pathLabel: "Rest in porcelain silence",
  pathDescription:
    "A side room for pale objects, porcelain surfaces, and still compositions that should be curated more carefully after the main vertical import.",
  sortOrder: 6,
  featured: false,
}
```

Before applying, replace `coverArtworkSlug` with the first imported `porcelain-silence` slug from `docs/9-16-import-manifest.csv`.

- [ ] **Step 2: Add `holding-room` to exhibitions**

Add this exhibition object after `porcelain-silence`:

```ts
{
  slug: "holding-room",
  titleEn: "Holding Room",
  titleZh: "待整理房间",
  works: [],
  summary: "A temporary room for 9:16 imports that need a second curation pass.",
  coverArtworkSlug: "holding-room-cover",
  palette: {
    background: "#f1eee8",
    foreground: "#30343a",
    accent: "#9aa5a8",
  },
  keywords: ["review", "vertical studies", "archive holding"],
  curatorNote:
    "Holding Room keeps uncertain vertical works visible and searchable while protecting the main exhibitions from premature categorization.",
  featuredWorkSlugs: [],
  pathLabel: "Hold for review",
  pathDescription:
    "A temporary side room for vertical works that belong in the archive but still need a more precise exhibition assignment.",
  sortOrder: 7,
  featured: false,
}
```

Before applying, replace `coverArtworkSlug` with the first imported `holding-room` slug from `docs/9-16-import-manifest.csv`.

- [ ] **Step 3: Guard route generation**

In `src/lib/curation-path.ts`, update `getCurationPathForExhibition`:

```ts
export function getCurationPathForExhibition(slug: string): CurationPathEntry | undefined {
  const exhibition = getExhibitionBySlug(slug);
  const nextExhibition = getNextExhibition(slug);

  if (!exhibition || !nextExhibition || exhibition.featuredWorkSlugs.length === 0) return undefined;

  return {
    exhibition,
    featuredWorks: getArtworksBySlugs(exhibition.featuredWorkSlugs) as Artwork[],
    nextExhibition,
  };
}
```

- [ ] **Step 4: Update curation contract**

Add:

```ts
assert.equal(getHomeCurationPath().length, 6);
assert.equal(getCurationPathForExhibition("porcelain-silence"), undefined);
assert.equal(getCurationPathForExhibition("holding-room"), undefined);
```

Run:

```powershell
npx tsx src/lib/curation-path.contract.ts
```

Expected:

```txt
no output and exit code 0
```

## Task 5: Refresh Image Metadata

**Files:**
- Modify generated: `src/data/imageMetadata.generated.ts`

- [ ] **Step 1: Run metadata generation**

Run:

```powershell
python scripts/generate_image_metadata.py
```

Expected:

```txt
Generated metadata for 463 artworks at E:\Misty-Atelier\src\data\imageMetadata.generated.ts
```

- [ ] **Step 2: Verify imported 9:16 format categories**

Run:

```powershell
node -e "const fs=require('fs'); const text=fs.readFileSync('src/data/imageMetadata.generated.ts','utf8'); console.log((text.match(/portraitTall/g)||[]).length)"
```

Expected:

```txt
at least 432
```

## Task 6: Update Test Expectations

**Files:**
- Modify: `src/lib/archive-query.contract.ts`
- Modify: `src/data/exhibition-contract.test.ts`
- Modify: `playwright/misty-atelier.spec.ts`

- [ ] **Step 1: Use data-derived archive counts**

In Playwright, replace fixed artwork count checks with a count derived from page links after load only where the exact number is not the behavior under test.

For the archive total after this import, use:

```ts
await expect(page.locator('a[href^="/works/"]')).toHaveCount(463);
```

- [ ] **Step 2: Add new exhibition route checks**

Add:

```ts
test("bulk vertical exhibitions render", async ({ page }) => {
  await page.goto("/exhibitions/porcelain-silence");
  await expect(page.getByRole("heading", { name: "Porcelain Silence" })).toBeVisible();
  await expect(page.locator('a[href^="/works/"]')).not.toHaveCount(0);

  await page.goto("/exhibitions/holding-room");
  await expect(page.getByRole("heading", { name: "Holding Room" })).toBeVisible();
  await expect(page.locator('a[href^="/works/"]')).not.toHaveCount(0);
});
```

- [ ] **Step 3: Run contract tests**

Run:

```powershell
npm run test:contracts
```

Expected:

```txt
all contract scripts exit 0
```

## Task 7: Package Scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add scripts**

Add:

```json
"images:scan9x16": "python scripts/scan_9_16_candidates.py",
"images:import9x16": "python scripts/import_9_16_assets.py",
"images:generate-imported-data": "python scripts/generate_imported_artworks.py",
"images:refresh": "npm run images:scan9x16 && npm run images:import9x16 && npm run images:generate-imported-data && npm run images:scan"
```

- [ ] **Step 2: Run the full image refresh**

Run:

```powershell
npm run images:refresh
```

Expected:

```txt
Wrote 409 9:16 import rows...
Imported 409 image pairs...
Generated 409 imported artwork records...
Generated metadata for 463 artworks...
```

## Task 8: Full Validation And Visual QA

**Files:**
- No new files.
- Generated screenshot output under `test-results`.

- [ ] **Step 1: Run validation**

Run:

```powershell
npm run validate
```

Expected:

```txt
No ESLint warnings or errors
Compiled successfully
Generating static pages...
```

The static route count should increase because there will be 409 more work pages plus two exhibition pages.

- [ ] **Step 2: Run Playwright**

Run:

```powershell
npm run test
```

Expected:

```txt
all tests pass
```

- [ ] **Step 3: Manually inspect pages**

Start:

```powershell
npm run dev -- -p 3001
```

Open:

```txt
http://localhost:3001/archive
http://localhost:3001/exhibitions/porcelain-silence
http://localhost:3001/exhibitions/holding-room
```

Check:

- Archive loads without sluggish initial render.
- Exhibition pages do not distort 9:16 images.
- Homepage still feels curated and does not show all bulk imports.
- Route page still shows six routes only.
- Work pages for imported items show full image, tags, exhibition link, previous/next, and related works.

## Rollback Plan

If the import is visually or technically too heavy:

1. Remove `src/data/importedArtworks.generated.ts`.
2. Revert `src/data/artworks.ts` to export only curated records.
3. Keep copied assets on disk until a final decision is made.
4. Re-run `python scripts/generate_image_metadata.py`.
5. Run `npm run validate`.

This rollback removes imported pages from the app without deleting source images or generated JPGs.

## Success Criteria

- 409 new 9:16 images are imported.
- Total full artwork JPG count becomes 463.
- Total thumbnail JPG count becomes 463.
- 1:1 and 16:9 candidates are not imported in this phase.
- Existing six-route curation remains unchanged.
- `Porcelain Silence` and `Holding Room` are visible but not featured.
- `npm run validate` passes.
- `npm run test` passes.
