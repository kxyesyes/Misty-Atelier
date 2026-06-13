import type { Artwork } from "@/data/artworks";

export type ArtworkTagGroup = {
  label: "Mood" | "Color" | "Scene" | "Notes";
  values: string[];
};

export function getArtworkTagGroups(artwork: Artwork): ArtworkTagGroup[] {
  const groups: ArtworkTagGroup[] = [
    { label: "Mood", values: artwork.moodTags },
    { label: "Color", values: artwork.colorTags },
    { label: "Scene", values: artwork.sceneTags },
    { label: "Notes", values: artwork.tags },
  ];

  return groups.filter((group) => group.values.length > 0);
}
