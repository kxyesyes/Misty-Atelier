import assert from "node:assert/strict";
import { getValidationReport } from "./validation-report";

const report = getValidationReport();

assert.equal(report.missingFullImages.length, 0);
assert.equal(report.missingThumbnails.length, 0);
assert.equal(report.brokenExhibitionWorkLinks.length, 0);
assert.equal(report.brokenRecipeNoteLinks.length, 0);
assert.equal(report.duplicateArtworkSlugs.length, 0);
