import os
import json
import re

data_dir = r"E:\Misty-Atelier\src\data"

# Read exhibitions.ts
ex_path = os.path.join(data_dir, "exhibitions.ts")
with open(ex_path, "r", encoding="utf-8") as f:
    ex_content = f.read()

# Extract json part
ex_json_match = re.search(r'export const exhibitions: Exhibition\[\] = (\[.*\]);', ex_content, re.DOTALL)
if ex_json_match:
    exhibitions = json.loads(ex_json_match.group(1))
    
    for i, ex in enumerate(exhibitions):
        ex["summary"] = f"A curated space dedicated to {ex.get('titleEn', '').lower()}."
        if ex["works"]:
            ex["coverArtworkSlug"] = ex["works"][0]
        else:
            ex["coverArtworkSlug"] = ""
        ex["palette"] = ["#E5E5E5", "#1A1A1A", "#F3F0E8"]
        ex["sortOrder"] = i
        ex["featured"] = True if i < 3 else False

    new_ex_ts = """export type Exhibition = {
  slug: string;
  titleEn: string;
  titleZh: string;
  works: string[];
  summary: string;
  coverArtworkSlug: string;
  palette: string[];
  sortOrder: number;
  featured: boolean;
};

export const exhibitions: Exhibition[] = """ + json.dumps(exhibitions, ensure_ascii=False, indent=2) + ";\n"
    with open(ex_path, "w", encoding="utf-8") as f:
        f.write(new_ex_ts)

# Read artworks.ts
art_path = os.path.join(data_dir, "artworks.ts")
with open(art_path, "r", encoding="utf-8") as f:
    art_content = f.read()

art_json_match = re.search(r'export const artworks: Artwork\[\] = (\[.*\]);', art_content, re.DOTALL)
if art_json_match:
    artworks = json.loads(art_json_match.group(1))
    
    for i, art in enumerate(artworks):
        art["description"] = "A moment captured in time, reflecting quiet narratives."
        art["tags"] = ["illustration", "digital", "vibe"]
        art["colorTags"] = ["blue", "white"] if "blue" in art.get("titleEn", "").lower() else ["warm", "soft"]
        art["moodTags"] = ["quiet", "peaceful"]
        art["sceneTags"] = ["indoor"] if "room" in art.get("titleEn", "").lower() else ["outdoor"]
        art["featured"] = True if i % 10 == 0 else False
        art["recipeNotesId"] = art["slug"] if art["slug"] in ["blue-white-atelier-girl", "rainy-headphones-desk", "moss-deer-at-glasshouse-end", "tide-postman-and-cloud-whale", "quiet-letter-by-the-window"] else None

    new_art_ts = """export type Artwork = {
  slug: string;
  titleEn: string;
  titleZh: string;
  exhibition: string;
  src: string;
  thumbnail: string;
  description: string;
  tags: string[];
  colorTags: string[];
  moodTags: string[];
  sceneTags: string[];
  featured: boolean;
  recipeNotesId: string | null;
};

export const artworks: Artwork[] = """ + json.dumps(artworks, ensure_ascii=False, indent=2) + ";\n"
    with open(art_path, "w", encoding="utf-8") as f:
        f.write(new_art_ts)

print("Data models upgraded.")
