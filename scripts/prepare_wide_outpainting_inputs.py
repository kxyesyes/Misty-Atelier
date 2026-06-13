from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
FULL_DIR = ROOT / "public" / "images" / "artworks" / "full"
WIDE_DIR = ROOT / "public" / "images" / "artworks" / "wide"
WIDE_THUMB_DIR = ROOT / "public" / "images" / "artworks" / "wide-thumbs"
OUTPAINT_DIR = ROOT / "tmp" / "wide-outpainting-inputs"

TARGET_RATIO = 4 / 3
MAX_WIDE_HEIGHT = 1800
THUMB_WIDTH = 1200

WIDE_SLUGS = [
    "winter-blue-window-room",
    "morning-reading-room-0",
    "quiet-letter-by-the-window",
    "balcony-after-rain",
    "rainy-headphones-desk",
    "clear-girl-by-raindrop-window",
    "blue-white-glasshouse-dream",
    "moss-deer-at-glasshouse-end",
    "winter-greenhouse-bench",
    "minimal-snow-station",
    "beginning-of-spring",
    "clear-sea-breeze-white-lighthouse",
    "blue-white-atelier-girl",
    "afternoon-atelier-tidying",
    "girl-with-luminous-paper-crane",
    "amber-of-time",
]


def cover_resize(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    source_w, source_h = image.size
    scale = max(target_w / source_w, target_h / source_h)
    resized = image.resize((round(source_w * scale), round(source_h * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def make_soft_wide_preview(source: Image.Image) -> tuple[Image.Image, tuple[int, int, int, int]]:
    source = source.convert("RGB")
    scale = min(1, MAX_WIDE_HEIGHT / source.height)
    foreground = source.resize(
        (round(source.width * scale), round(source.height * scale)),
        Image.Resampling.LANCZOS,
    )
    target_h = foreground.height
    target_w = round(target_h * TARGET_RATIO)

    background = cover_resize(foreground, (target_w, target_h))
    background = background.filter(ImageFilter.GaussianBlur(radius=max(18, target_w // 42)))
    background = ImageEnhance.Color(background).enhance(0.62)
    background = ImageEnhance.Brightness(background).enhance(1.08)
    background = ImageEnhance.Contrast(background).enhance(0.86)

    x = (target_w - foreground.width) // 2
    y = (target_h - foreground.height) // 2
    background.paste(foreground, (x, y))
    return background, (x, y, x + foreground.width, y + foreground.height)


def make_outpainting_canvas(source: Image.Image, target_size: tuple[int, int]) -> tuple[Image.Image, tuple[int, int, int, int]]:
    source = source.convert("RGB")
    target_w, target_h = target_size
    scale = min(target_w / source.width, target_h / source.height)
    foreground = source.resize(
        (round(source.width * scale), round(source.height * scale)),
        Image.Resampling.LANCZOS,
    )
    x = (target_w - foreground.width) // 2
    y = (target_h - foreground.height) // 2
    canvas = Image.new("RGB", target_size, (242, 239, 233))
    canvas.paste(foreground, (x, y))
    return canvas, (x, y, x + foreground.width, y + foreground.height)


def make_mask(size: tuple[int, int], keep_box: tuple[int, int, int, int]) -> Image.Image:
    mask = Image.new("L", size, 255)
    keep = Image.new("L", (keep_box[2] - keep_box[0], keep_box[3] - keep_box[1]), 0)
    mask.paste(keep, keep_box[:2])
    return mask


def save_thumb(image: Image.Image, path: Path) -> None:
    thumb = image.copy()
    thumb.thumbnail((THUMB_WIDTH, round(THUMB_WIDTH / TARGET_RATIO)), Image.Resampling.LANCZOS)
    thumb.save(path, "JPEG", quality=88, optimize=True)


def main() -> None:
    WIDE_DIR.mkdir(parents=True, exist_ok=True)
    WIDE_THUMB_DIR.mkdir(parents=True, exist_ok=True)
    (OUTPAINT_DIR / "images").mkdir(parents=True, exist_ok=True)
    (OUTPAINT_DIR / "masks").mkdir(parents=True, exist_ok=True)

    manifest = []

    for slug in WIDE_SLUGS:
        source_path = FULL_DIR / f"{slug}.jpg"
        if not source_path.exists():
            raise FileNotFoundError(f"Missing source image: {source_path}")

        with Image.open(source_path) as source:
            wide, keep_box = make_soft_wide_preview(source)
            wide_path = WIDE_DIR / f"{slug}.jpg"
            wide_thumb_path = WIDE_THUMB_DIR / f"{slug}.jpg"
            if not wide_path.exists():
                wide.save(wide_path, "JPEG", quality=92, optimize=True)
            if not wide_thumb_path.exists():
                save_thumb(wide, wide_thumb_path)

            outpaint_canvas, outpaint_keep_box = make_outpainting_canvas(source, wide.size)
            outpaint_mask = make_mask(wide.size, outpaint_keep_box)
            outpaint_canvas.save(OUTPAINT_DIR / "images" / f"{slug}.png")
            outpaint_mask.save(OUTPAINT_DIR / "masks" / f"{slug}.png")

            manifest.append(
                {
                    "slug": slug,
                    "source": str(source_path.relative_to(ROOT)),
                    "widePreview": str(wide_path.relative_to(ROOT)),
                    "wideThumbnail": str(wide_thumb_path.relative_to(ROOT)),
                    "outpaintingImage": str((OUTPAINT_DIR / "images" / f"{slug}.png").relative_to(ROOT)),
                    "outpaintingMask": str((OUTPAINT_DIR / "masks" / f"{slug}.png").relative_to(ROOT)),
                    "targetRatio": "4:3",
                    "keepBox": keep_box,
                    "promptHint": "extend the quiet illustrated room scene horizontally; preserve soft light, watercolor anime illustration style, calm atelier mood",
                }
            )

    (OUTPAINT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Prepared {len(manifest)} wide previews and outpainting masks in {OUTPAINT_DIR}")


if __name__ == "__main__":
    main()
