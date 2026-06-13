import { artworks } from "@/data/artworks";
import { exhibitions } from "@/data/exhibitions";

export function getAllArtworks() {
  return artworks;
}

export function getArtworkBySlug(slug: string) {
  return artworks.find((artwork) => artwork.slug === slug);
}

export function getArtworksBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getArtworkBySlug(slug))
    .filter((artwork): artwork is NonNullable<typeof artwork> => Boolean(artwork));
}

export function getArtworksByExhibition(exhibitionSlug: string) {
  return artworks.filter((artwork) => artwork.exhibition === exhibitionSlug);
}

export function getFeaturedArtworks(limit = 6) {
  return artworks.filter((artwork) => artwork.featured).slice(0, limit);
}

export function getRelatedArtworks(slug: string, limit = 4) {
  const current = getArtworkBySlug(slug);
  if (!current) return [];

  return artworks
    .filter((artwork) => artwork.slug !== slug && artwork.exhibition === current.exhibition)
    .slice(0, limit);
}

export function getAdjacentArtworks(slug: string) {
  const current = getArtworkBySlug(slug);
  if (!current) {
    return { previous: undefined, next: undefined };
  }

  const exhibition = exhibitions.find((entry) => entry.slug === current.exhibition);
  const curatedSequence = exhibition?.works.includes(slug) ? getArtworksBySlugs(exhibition.works) : [];
  const exhibitionWorks = curatedSequence.length > 1 ? curatedSequence : getArtworksByExhibition(current.exhibition);
  const index = exhibitionWorks.findIndex((artwork) => artwork.slug === slug);
  if (index === -1 || exhibitionWorks.length < 2) {
    return { previous: undefined, next: undefined };
  }

  return {
    previous: exhibitionWorks[(index - 1 + exhibitionWorks.length) % exhibitionWorks.length],
    next: exhibitionWorks[(index + 1) % exhibitionWorks.length],
  };
}
