import type { Artwork } from "@/data/artworks";
import type { Exhibition } from "@/data/exhibitions";
import { getArtworkBySlug, getArtworksBySlugs } from "@/lib/artwork-query";
import { getAllExhibitions, getExhibitionBySlug } from "@/lib/exhibition-query";

export type CurationPathEntry = {
  exhibition: Exhibition;
  featuredWorks: Artwork[];
  nextExhibition: Exhibition;
};

export type CurationRoutePlacement = {
  entry: CurationPathEntry;
  routeIndex: number;
  activeWorkIndex?: number;
  previousWork: Artwork;
  nextWork: Artwork;
};

function getNextFeaturedExhibition(slug: string) {
  const ordered = getAllExhibitions().filter((exhibition) => exhibition.featured);
  const index = ordered.findIndex((exhibition) => exhibition.slug === slug);
  if (index === -1) return undefined;
  return ordered[(index + 1) % ordered.length];
}

export function getCurationPathForExhibition(slug: string): CurationPathEntry | undefined {
  const exhibition = getExhibitionBySlug(slug);
  const nextExhibition = getNextFeaturedExhibition(slug);

  if (!exhibition || !nextExhibition || exhibition.featuredWorkSlugs.length === 0) return undefined;

  return {
    exhibition,
    featuredWorks: getArtworksBySlugs(exhibition.featuredWorkSlugs) as Artwork[],
    nextExhibition,
  };
}

export function getHomeCurationPath() {
  return getAllExhibitions()
    .map((exhibition) => getCurationPathForExhibition(exhibition.slug))
    .filter((entry): entry is CurationPathEntry => Boolean(entry));
}

export function getCurationRouteForArtwork(slug: string): CurationRoutePlacement | undefined {
  const artwork = getArtworkBySlug(slug);
  if (!artwork) return undefined;

  const entries = getHomeCurationPath();
  const routeIndex = entries.findIndex((entry) => entry.exhibition.slug === artwork.exhibition);
  if (routeIndex === -1) return undefined;

  const entry = entries[routeIndex];
  const activeWorkIndex = entry.featuredWorks.findIndex((work) => work.slug === artwork.slug);
  const anchorIndex = activeWorkIndex === -1 ? 0 : activeWorkIndex;

  return {
    entry,
    routeIndex,
    activeWorkIndex: activeWorkIndex === -1 ? undefined : activeWorkIndex,
    previousWork: entry.featuredWorks[(anchorIndex - 1 + entry.featuredWorks.length) % entry.featuredWorks.length],
    nextWork: entry.featuredWorks[(anchorIndex + 1) % entry.featuredWorks.length],
  };
}
