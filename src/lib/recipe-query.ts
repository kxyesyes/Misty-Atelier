import { recipeNotes } from "@/data/recipeNotes";

export function getAllRecipeNotes() {
  return recipeNotes;
}

export function getRecipeNoteByArtworkSlug(slug: string) {
  return recipeNotes.find((note) => note.slug === slug);
}
