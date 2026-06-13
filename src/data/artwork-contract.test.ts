import { artworks, type Artwork } from "./artworks";
import { exhibitions } from "./exhibitions";

type Assert<T extends true> = T;
type Orientation = Artwork["orientation"];

export type ArtworkHasOrientation = Assert<
  Orientation extends "portrait" | "landscape" | "square" ? true : false
>;

const artworkBySlug = new Map(artworks.map((artwork) => [artwork.slug, artwork]));

for (const artwork of artworks) {
  if (!["portrait", "landscape", "square"].includes(artwork.orientation)) {
    throw new Error(`${artwork.slug} has an invalid orientation`);
  }
}

for (const exhibition of exhibitions) {
  const coverArtwork = artworkBySlug.get(exhibition.coverArtworkSlug);

  if (!coverArtwork) {
    throw new Error(`${exhibition.slug} has a missing cover artwork`);
  }
}

export {};
