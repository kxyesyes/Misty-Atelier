from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CANDIDATES = ROOT / "docs" / "2026-05-29-misty-atelier-candidate-scan.csv"
OUTPUT = ROOT / "docs" / "9-16-import-manifest.csv"
SOURCE_ROOT = Path("E:/美图")
FULL_DIR = ROOT / "public" / "images" / "artworks" / "full"
RENAME_LOGS = [
    ROOT / "docs" / "unnamed-image-rename-log.csv",
    ROOT / "docs" / "doodle-emotion-rename-log.csv",
    ROOT / "docs" / "doodle-root-rename-log.csv",
]
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


def build_source_index() -> dict[str, Path]:
    index: dict[str, Path] = {}
    for path in SOURCE_ROOT.rglob("*"):
        if path.is_file() and path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}:
            index.setdefault(path.name, path)
            try:
                relative_key = path.relative_to(SOURCE_ROOT).as_posix()
                index.setdefault(relative_key, path)
            except ValueError:
                pass
    return index


def build_rename_index() -> dict[str, Path]:
    index: dict[str, Path] = {}
    for log_path in RENAME_LOGS:
        if not log_path.exists():
            continue
        with log_path.open("r", encoding="utf-8-sig", newline="") as handle:
            for row in csv.DictReader(handle):
                old_path = Path(row["OldPath"])
                new_path = Path(row["NewPath"])
                if not new_path.exists():
                    continue
                index.setdefault(old_path.name, new_path)
                try:
                    old_relative = old_path.relative_to(SOURCE_ROOT).as_posix()
                    index.setdefault(old_relative, new_path)
                except ValueError:
                    pass
    return index


def make_unique_slug(slug: str, used_slugs: set[str]) -> str:
    if slug not in used_slugs:
        used_slugs.add(slug)
        return slug

    index = 2
    while f"{slug}-{index}" in used_slugs:
        index += 1
    unique_slug = f"{slug}-{index}"
    used_slugs.add(unique_slug)
    return unique_slug


def resolve_source(file_name: str, source_index: dict[str, Path], rename_index: dict[str, Path]) -> Path | None:
    normalized = file_name.replace("\\", "/")
    direct = SOURCE_ROOT / file_name
    if direct.exists():
        return direct
    return (
        source_index.get(normalized)
        or source_index.get(Path(file_name).name)
        or rename_index.get(normalized)
        or rename_index.get(Path(file_name).name)
    )


def load_existing_manifest() -> dict[str, str]:
    if not OUTPUT.exists():
        return {}

    manifest: dict[str, str] = {}
    with OUTPUT.open("r", encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            key = f"{row.get('originalSlug', row['slug'])}|{row['sourcePath']}"
            manifest[key] = row["slug"]
    return manifest


def main() -> None:
    existing_slugs = {path.stem for path in FULL_DIR.glob("*.jpg")}
    existing_manifest = load_existing_manifest()
    used_slugs = set(existing_slugs)
    source_index = build_source_index()
    rename_index = build_rename_index()
    rows: list[dict[str, str]] = []

    with CANDIDATES.open("r", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            ratio = float(row["ratio"])
            original_slug = row["id"]
            if ratio < MIN_RATIO or ratio > MAX_RATIO:
                continue
            exhibition = EXHIBITION_MAP[row["suggestedExhibition"]]
            source = resolve_source(row["file"], source_index, rename_index)
            if source is None:
                raise FileNotFoundError(f"Cannot resolve source image for {original_slug}: {row['file']}")

            manifest_key = f"{original_slug}|{source}"
            slug = existing_manifest.get(manifest_key)
            if slug is None:
                if original_slug in existing_slugs:
                    continue
                slug = make_unique_slug(original_slug, used_slugs)
            else:
                used_slugs.add(slug)

            rows.append(
                {
                    "slug": slug,
                    "originalSlug": original_slug,
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

    if not rows:
        raise RuntimeError("No new 9:16 candidates found.")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} 9:16 import rows to {OUTPUT}")


if __name__ == "__main__":
    main()
