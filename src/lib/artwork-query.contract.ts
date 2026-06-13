import assert from "node:assert/strict";
import { getAdjacentArtworks } from "./artwork-query";

const winter = getAdjacentArtworks("winter-blue-window-room");
assert.equal(winter.previous?.slug, "quiet-letter-by-the-window");
assert.equal(winter.next?.slug, "morning-reading-room-0");

const lastBlueRoom = getAdjacentArtworks("quiet-letter-by-the-window");
assert.equal(lastBlueRoom.previous?.slug, "lazy-bedroom-under-night-lights");
assert.equal(lastBlueRoom.next?.slug, "winter-blue-window-room");

const missing = getAdjacentArtworks("does-not-exist");
assert.equal(missing.previous, undefined);
assert.equal(missing.next, undefined);
