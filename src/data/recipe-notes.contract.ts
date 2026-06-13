import assert from "node:assert/strict";
import { recipeNotes } from "./recipeNotes";

for (const note of recipeNotes) {
  assert.ok(note.palette.length >= 2, `${note.slug} should include palette notes`);
  assert.ok(note.composition.length >= 2, `${note.slug} should include composition notes`);
  assert.ok(note.atmosphere.length >= 2, `${note.slug} should include atmosphere notes`);
  assert.ok(note.direction.length >= 40, `${note.slug} should include a useful creative direction`);
}
