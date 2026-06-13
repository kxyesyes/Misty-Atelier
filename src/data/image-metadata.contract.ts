import assert from "node:assert/strict";
import { artworks } from "./artworks";
import { artworkImageMetadata } from "./imageMetadata.generated";

const categories = new Set(["portraitTall", "portrait", "square", "landscape", "wide"]);

for (const artwork of artworks) {
  assert.ok(artwork.width > 0, `${artwork.slug} should expose source width`);
  assert.ok(artwork.height > 0, `${artwork.slug} should expose source height`);
  assert.ok(artwork.aspectRatio > 0, `${artwork.slug} should expose aspect ratio`);
  assert.ok(categories.has(artwork.formatCategory), `${artwork.slug} should have a valid format category`);
  assert.equal(artworkImageMetadata[artwork.slug]?.width, artwork.width);
  assert.equal(artworkImageMetadata[artwork.slug]?.height, artwork.height);
}

assert.equal(artworks.length, Object.keys(artworkImageMetadata).length);
