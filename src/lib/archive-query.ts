import type { Artwork } from "@/data/artworks";

export type ArchiveFilters = {
  query?: string;
  exhibition?: string;
  mood?: string;
  color?: string;
  scene?: string;
  orientation?: Artwork["orientation"] | "all";
};

export type ArchiveFacets = {
  moods: string[];
  colors: string[];
  scenes: string[];
  orientations: Artwork["orientation"][];
};

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function hasFilterValue(values: string[], filter?: string) {
  return !filter || values.includes(filter);
}

function getSearchCorpus(artwork: Artwork) {
  return [
    artwork.slug,
    artwork.titleEn,
    artwork.titleZh,
    artwork.description,
    ...artwork.tags,
    ...artwork.colorTags,
    ...artwork.moodTags,
    ...artwork.sceneTags,
  ]
    .join(" ")
    .toLocaleLowerCase();
}

export function getArchiveFacets(source: Artwork[]): ArchiveFacets {
  return {
    moods: uniqueSorted(source.flatMap((artwork) => artwork.moodTags)),
    colors: uniqueSorted(source.flatMap((artwork) => artwork.colorTags)),
    scenes: uniqueSorted(source.flatMap((artwork) => artwork.sceneTags)),
    orientations: uniqueSorted(source.map((artwork) => artwork.orientation)) as Artwork["orientation"][],
  };
}

export function getArchiveResults(source: Artwork[], filters: ArchiveFilters) {
  const query = filters.query?.trim().toLocaleLowerCase();

  return source.filter((artwork) => {
    if (filters.exhibition && artwork.exhibition !== filters.exhibition) return false;
    if (filters.orientation && filters.orientation !== "all" && artwork.orientation !== filters.orientation) {
      return false;
    }
    if (!hasFilterValue(artwork.moodTags, filters.mood)) return false;
    if (!hasFilterValue(artwork.colorTags, filters.color)) return false;
    if (!hasFilterValue(artwork.sceneTags, filters.scene)) return false;
    if (query && !getSearchCorpus(artwork).includes(query)) return false;
    return true;
  });
}
