from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
FULL_DIR = ROOT / "public" / "images" / "artworks" / "full"
OUTPUT = ROOT / "src" / "data" / "imageMetadata.generated.ts"


def get_category(width: int, height: int) -> str:
    ratio = width / height
    if ratio < 0.68:
        return "portraitTall"
    if ratio < 0.9:
        return "portrait"
    if ratio <= 1.1:
        return "square"
    if ratio <= 1.6:
        return "landscape"
    return "wide"


def main() -> None:
    records = {}

    for path in sorted(FULL_DIR.glob("*.jpg")):
        with Image.open(path) as image:
            width, height = image.size
        records[path.stem] = {
            "width": width,
            "height": height,
            "aspectRatio": round(width / height, 4),
            "formatCategory": get_category(width, height),
        }

    body = json.dumps(records, indent=2, ensure_ascii=False)
    OUTPUT.write_text(
        "\n".join(
            [
                "export type ArtworkFormatCategory = \"portraitTall\" | \"portrait\" | \"square\" | \"landscape\" | \"wide\";",
                "",
                "export type ArtworkImageMetadata = {",
                "  width: number;",
                "  height: number;",
                "  aspectRatio: number;",
                "  formatCategory: ArtworkFormatCategory;",
                "};",
                "",
                f"export const artworkImageMetadata: Record<string, ArtworkImageMetadata> = {body};",
                "",
            ]
        ),
        encoding="utf-8",
    )
    print(f"Generated metadata for {len(records)} artworks at {OUTPUT}")


if __name__ == "__main__":
    main()
