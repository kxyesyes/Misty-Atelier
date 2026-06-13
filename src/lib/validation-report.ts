import { existsSync } from "node:fs";
import { join } from "node:path";
import { artworks } from "@/data/artworks";
import { exhibitions } from "@/data/exhibitions";
import { recipeNotes } from "@/data/recipeNotes";

function findDuplicates(values: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }

  return Array.from(duplicates);
}

function publicPathExists(publicPath: string) {
  return existsSync(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

export function getValidationReport() {
  const artworkSlugs = new Set(artworks.map((artwork) => artwork.slug));
  const recipeSlugs = new Set(recipeNotes.map((note) => note.slug));

  return {
    missingFullImages: artworks
      .filter((artwork) => !publicPathExists(artwork.src))
      .map((artwork) => artwork.slug),
    missingThumbnails: artworks
      .filter((artwork) => !publicPathExists(artwork.thumbnail))
      .map((artwork) => artwork.slug),
    brokenExhibitionWorkLinks: exhibitions.flatMap((exhibition) =>
      exhibition.works
        .filter((slug) => !artworkSlugs.has(slug))
        .map((slug) => `${exhibition.slug}:${slug}`),
    ),
    brokenRecipeNoteLinks: artworks
      .filter((artwork) => artwork.recipeNotesId && !recipeSlugs.has(artwork.recipeNotesId))
      .map((artwork) => artwork.slug),
    duplicateArtworkSlugs: findDuplicates(artworks.map((artwork) => artwork.slug)),
  };
}
