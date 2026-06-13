from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "docs" / "9-16-import-manifest.csv"
OUTPUT = ROOT / "src" / "data" / "importedArtworks.generated.ts"


def title_from_slug(slug: str) -> str:
    small_words = {"a", "an", "and", "at", "by", "for", "in", "of", "on", "the", "to", "with"}
    words = slug.replace("-", " ").split()
    titled: list[str] = []
    for index, word in enumerate(words):
        titled.append(word.capitalize() if index == 0 or word not in small_words else word)
    return " ".join(titled)


def split_tags(raw: str) -> list[str]:
    return [tag.strip() for tag in raw.split(";") if tag.strip()]


def js_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    with MANIFEST.open("r", encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))

    lines = [
        'import type { ArtworkRecord } from "./artworks";',
        "",
        "export const importedArtworkRecords: ArtworkRecord[] = [",
    ]

    for row in rows:
        tags = split_tags(row["inferredTags"]) or ["illustration"]
        tag_literal = ", ".join(f'"{js_string(tag)}"' for tag in tags)
        lines.extend(
            [
                "  {",
                f'    slug: "{js_string(row["slug"])}",',
                f'    titleEn: "{js_string(title_from_slug(row["slug"]))}",',
                f'    titleZh: "{js_string(row["titleZh"])}",',
                f'    exhibition: "{js_string(row["exhibition"])}",',
                '    description: "A 9:16 archive addition selected for its vertical composition and quiet visual atmosphere.",',
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
