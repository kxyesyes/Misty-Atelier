import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const overlayDir = join(
  process.cwd(),
  "src",
  "components",
  "Season",
  "SeasonalOverlay"
);

const dispatcher = readFileSync(
  join(overlayDir, "SeasonalDispatcher.tsx"),
  "utf8"
);
const autumnOverlayPath = join(overlayDir, "AutumnLeavesOverlay.tsx");
const autumnStylesPath = join(overlayDir, "AutumnLeavesOverlay.module.css");

assert.ok(
  existsSync(autumnOverlayPath),
  "autumn should have a dedicated seasonal leaves overlay component"
);
assert.ok(
  existsSync(autumnStylesPath),
  "autumn leaves overlay should keep animation styles in a module"
);
assert.match(
  dispatcher,
  /import\s+\{\s*AutumnLeavesOverlay\s*\}/,
  "dispatcher should import the autumn leaves overlay"
);
assert.match(
  dispatcher,
  /season === "autumn" && <AutumnLeavesOverlay key="autumn" \/>/,
  "dispatcher should render leaves only during autumn"
);

const styles = readFileSync(autumnStylesPath, "utf8");
assert.match(
  styles,
  /prefers-reduced-motion:\s*reduce/,
  "autumn leaves animation should respect reduced motion"
);
assert.match(
  styles,
  /pointer-events:\s*none/,
  "autumn leaves overlay must not intercept page interactions"
);

