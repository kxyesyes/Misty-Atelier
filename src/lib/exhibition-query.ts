import { exhibitions } from "@/data/exhibitions";
import { getArtworkBySlug, getArtworksByExhibition } from "@/lib/artwork-query";

export function getAllExhibitions() {
  return [...exhibitions].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedExhibitions() {
  return getAllExhibitions().filter((exhibition) => exhibition.featured);
}

export function getExhibitionBySlug(slug: string) {
  return exhibitions.find((exhibition) => exhibition.slug === slug);
}

export function getExhibitionArtworks(slug: string) {
  return getArtworksByExhibition(slug);
}

export function getExhibitionCoverArtwork(slug: string) {
  const exhibition = getExhibitionBySlug(slug);
  if (!exhibition) return undefined;
  return getArtworkBySlug(exhibition.coverArtworkSlug);
}

export function getNextExhibition(slug: string) {
  const ordered = getAllExhibitions();
  const index = ordered.findIndex((exhibition) => exhibition.slug === slug);
  if (index === -1) return undefined;
  return ordered[(index + 1) % ordered.length];
}
