import type { Artwork } from "@/data/artworks";

export type ArtworkSurface = "card" | "detail";
export type ArtworkGridContext = "archive" | "exhibition" | "related";

export function getArtworkFrameClass(artwork: Pick<Artwork, "orientation" | "aspectRatio">) {
  if (artwork.orientation === "landscape") return "aspect-[3/2]";
  if (artwork.orientation === "square") return "aspect-square";
  if (artwork.aspectRatio < 0.6) return "aspect-[9/16]";
  if (artwork.aspectRatio < 0.72) return "aspect-[2/3]";

  return "aspect-[4/5]";
}

export function getArtworkImageFitClass(
  orientation: Artwork["orientation"],
  surface: ArtworkSurface,
) {
  if (surface === "detail") return "object-contain";
  return orientation === "landscape" ? "object-cover" : "object-cover";
}

export function getArtworkHorizontalPreviewFrameClass(
  orientation: Artwork["orientation"],
) {
  void orientation;
  return "aspect-[4/3]";
}

export function getArtworkHorizontalPreviewImageClass(
  orientation: Artwork["orientation"],
  hasWideArtwork = false,
) {
  if (hasWideArtwork) return "object-cover";
  return orientation === "landscape" ? "object-cover" : "object-contain p-2";
}

export function shouldUseArtworkHorizontalPreviewBackdrop(
  orientation: Artwork["orientation"],
  hasWideArtwork = false,
) {
  if (hasWideArtwork) return false;
  return orientation !== "landscape";
}

export function getArtworkHorizontalPreviewSource(artwork: Artwork) {
  return artwork.wideThumbnail ?? artwork.thumbnail;
}

export function getArtworkGridSpanClass(
  orientation: Artwork["orientation"],
  context: ArtworkGridContext,
) {
  if (orientation !== "landscape") return "";
  if (context === "exhibition") return "md:col-span-2 md:px-10";
  if (context === "archive") return "xl:col-span-2";
  return "";
}
