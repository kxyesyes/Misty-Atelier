import os
import re
import csv
import shutil
import json

md_path = r"E:\Misty-Atelier\docs\2026-05-29-misty-atelier-v1-selection.md"
src_img_dir = r"E:\美图"
dest_full_dir = r"E:\Misty-Atelier\public\images\artworks\full"
dest_thumb_dir = r"E:\Misty-Atelier\public\images\artworks\thumbs"
data_dir = r"E:\Misty-Atelier\src\data"

os.makedirs(dest_full_dir, exist_ok=True)
os.makedirs(dest_thumb_dir, exist_ok=True)
os.makedirs(data_dir, exist_ok=True)

with open(md_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

artworks = []
exhibitions = []
current_exhibition = None
exhibition_slug = None

for line in lines:
    line = line.strip()
    if line.startswith("### "):
        ex_name = line[4:].strip()
        # example: Blue Rooms / 蓝调房间
        parts = ex_name.split(" / ")
        title_en = parts[0].strip()
        title_zh = parts[1].strip() if len(parts) > 1 else ""
        exhibition_slug = title_en.lower().replace(" ", "-")
        current_exhibition = {
            "slug": exhibition_slug,
            "title_en": title_en,
            "title_zh": title_zh,
            "works": []
        }
        exhibitions.append(current_exhibition)
    elif line.startswith("|") and not line.startswith("| #") and not line.startswith("|---"):
        # Match table rows
        # Format: | 1 | 冬日窗边的蓝调房间 | Winter Blue Window Room | `冬日窗边的蓝调房间.png` | 首页主视觉、展区封面 |
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 5 and current_exhibition is not None:
             num = parts[1]
             if not num.isdigit():
                 continue
             title_zh = parts[2]
             title_en = parts[3]
             file_cell = parts[4]
             # extract from ` `
             m = re.search(r'`([^`]+)`', file_cell)
             if m:
                 file_path = m.group(1)
                 slug = title_en.lower().replace(" ", "-").replace("·", "").replace("'", "")
                 slug = re.sub(r'[^a-z0-9\-]', '', slug)
                 
                 # add to current ex
                 current_exhibition["works"].append(slug)
                 
                 artwork = {
                     "slug": slug,
                     "title_en": title_en,
                     "title_zh": title_zh,
                     "exhibition": exhibition_slug,
                     "original_file": file_path
                 }
                 artworks.append(artwork)
                 
print(f"Found {len(artworks)} artworks.")

exhibitions_ts = """export type Exhibition = {
  slug: string;
  titleEn: string;
  titleZh: string;
  works: string[];
};

export const exhibitions: Exhibition[] = """ + json.dumps([{"slug": e["slug"], "titleEn": e["title_en"], "titleZh": e["title_zh"], "works": e["works"]} for e in exhibitions], ensure_ascii=False, indent=2) + ";\n"

artworks_ts = """export type Artwork = {
  slug: string;
  titleEn: string;
  titleZh: string;
  exhibition: string;
  src: string;
  thumbnail: string;
};

export const artworks: Artwork[] = """ + json.dumps([{
  "slug": a["slug"],
  "titleEn": a["title_en"],
  "titleZh": a["title_zh"],
  "exhibition": a["exhibition"],
  "src": f"/images/artworks/full/{a['slug']}.jpg",
  "thumbnail": f"/images/artworks/thumbs/{a['slug']}.jpg"
} for a in artworks], ensure_ascii=False, indent=2) + ";\n"

with open(os.path.join(data_dir, "exhibitions.ts"), "w", encoding="utf-8") as f:
    f.write(exhibitions_ts)

with open(os.path.join(data_dir, "artworks.ts"), "w", encoding="utf-8") as f:
    f.write(artworks_ts)
    
print("Saved ts files.")

# Also generate a command to find all original files and copy them
# Because `original_file` might include folder names (e.g. `动漫幻想图\水晶花房·荧光蝶少女.png`)
# we just search by the base name recursively in E:\美图
    
def find_file(root_dir, target_name):
    # Some markdown paths might be exact relative paths, let's try direct first
    direct_path = os.path.join(root_dir, target_name)
    if os.path.exists(direct_path):
        return direct_path
        
    target_base = os.path.basename(target_name.replace('\\', '/'))
    for dirpath, dirnames, filenames in os.walk(root_dir):
        if target_base in filenames:
            return os.path.join(dirpath, target_base)
    return None

import subprocess
from PIL import Image

found_count = 0
for a in artworks:
    orig = find_file(src_img_dir, a["original_file"])
    if orig:
        found_count += 1
        full_dest = os.path.join(dest_full_dir, a['slug'] + '.jpg')
        thumb_dest = os.path.join(dest_thumb_dir, a['slug'] + '.jpg')
        
        # open, convert to RGB, resize for thumb
        try:
            with Image.open(orig) as img:
                img = img.convert("RGB")
                img.save(full_dest, "JPEG", quality=90)
                
                # thumb
                img.thumbnail((1200, 1200), Image.LANCZOS)
                img.save(thumb_dest, "JPEG", quality=88)
        except Exception as e:
            print(f"Error processing {orig}: {e}")
    else:
        print(f"File not found for {a['title_en']}: {a['original_file']}")

print(f"Copied and converted {found_count} images.")
