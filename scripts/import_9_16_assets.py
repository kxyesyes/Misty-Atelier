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
