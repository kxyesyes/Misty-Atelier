# Asset Review

This file tracks the assets that define the public read of Misty Atelier. The goal is to keep the archive feeling curated rather than merely populated.

## Review Rules

- Home hero images must preserve the original artwork ratio and avoid accidental cropping.
- Curation Path images must use `wideThumbnail` when the source artwork is not natively landscape.
- Exhibition covers should stay close to each exhibition palette and avoid sudden contrast jumps.
- LaMa wide images are acceptable for V1, but visible wall texture artifacts should be flagged for PowerPaint or manual repaint.

## Curation Path Wide Assets

| Exhibition | Artwork | Status | Notes |
| --- | --- | --- | --- |
| Blue Rooms | winter-blue-window-room | ready | LaMa extension is usable; blue wall edges are acceptable for V1. |
| Blue Rooms | morning-reading-room-0 | ready | Warm side extension supports the room tone. |
| Blue Rooms | quiet-letter-by-the-window | ready | Good palette match; keep as a key warm-blue bridge. |
| Rain Archive | balcony-after-rain | ready | Cool extension keeps the rain mood intact. |
| Rain Archive | rainy-headphones-desk | ready | Darker edge extension works with the listening-room scene. |
| Rain Archive | clear-girl-by-raindrop-window | ready | Night edge extension is visually coherent. |
| Glasshouse Dreams | blue-white-glasshouse-dream | ready | Slight edge texture, acceptable until PowerPaint pass. |
| Glasshouse Dreams | moss-deer-at-glasshouse-end | ready | Smaller source, but wide derivative is present and acceptable for V1. |
| Glasshouse Dreams | winter-greenhouse-bench | ready | Pale extension supports the protected winter mood. |
| Seasonal Stations | minimal-snow-station | ready | Snow and wall extension are V1-ready. |
| Seasonal Stations | beginning-of-spring | ready | Blue-green extension reads naturally. |
| Seasonal Stations | clear-sea-breeze-white-lighthouse | ready | Bright coastal extension works for route preview. |
| Atelier Hours | blue-white-atelier-girl | ready | Very bright; review if the route row feels overexposed. |
| Atelier Hours | afternoon-atelier-tidying | ready | Strong studio continuity. |
| Atelier Hours | girl-with-luminous-paper-crane | ready | Dark blue extension is acceptable but a PowerPaint pass could add detail. |
| Distant Fables | amber-of-time | ready | Warm fable tone is consistent with the exhibition card. |
| Distant Fables | paper-wing-guardian-in-clocktower | native-landscape | Native landscape asset; no wide derivative required. |
| Distant Fables | lantern-fox-station-at-snowfield | native-landscape | Native landscape asset; no wide derivative required. |

## Next Asset Pass

The next quality pass should target `blue-white-glasshouse-dream`, `blue-white-atelier-girl`, and `girl-with-luminous-paper-crane` with a semantic outpainting model such as PowerPaint.
