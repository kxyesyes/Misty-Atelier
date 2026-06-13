import type { Artwork } from "@/data/artworks";
import { getArtworkTagGroups } from "@/lib/artwork-presentation";

const sampleArtwork = {
  slug: "sample",
  titleEn: "Sample",
  titleZh: "样例",
  exhibition: "sample-exhibition",
  src: "/sample-full.jpg",
  thumbnail: "/sample-thumb.jpg",
  width: 900,
  height: 1600,
  aspectRatio: 0.5625,
  formatCategory: "portraitTall",
  orientation: "portrait",
  description: "Sample artwork.",
  tags: ["illustration"],
  colorTags: ["blue"],
  moodTags: ["quiet"],
  sceneTags: ["room"],
  featured: false,
} satisfies Artwork;

const groups = getArtworkTagGroups(sampleArtwork);

groups satisfies Array<{
  label: "Mood" | "Color" | "Scene" | "Notes";
  values: string[];
}>;

export {};
