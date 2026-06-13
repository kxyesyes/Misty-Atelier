import assert from "node:assert/strict";
import { exhibitions } from "./exhibitions";

for (const exhibition of exhibitions) {
  assert.ok(exhibition.keywords.length >= 3, `${exhibition.slug} should expose at least three archive keywords`);
  assert.ok(exhibition.curatorNote.length >= 80, `${exhibition.slug} should include a meaningful curator note`);
  assert.ok(exhibition.pathDescription.length >= 70, `${exhibition.slug} should explain its curation path`);
}
