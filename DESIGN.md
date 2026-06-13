# Design

## Overview

Misty Atelier uses an editorial art-book interface: serif-led typography, pale paper surfaces, restrained borders, and image-first composition. The visual system should feel quiet and tactile while maintaining enough contrast for long browsing sessions.

## Color

- Ink: `#24313a`, primary text and solid buttons.
- Paper: `#f7f4ee`, global background.
- Cream: `#fffaf3`, warmer surface accent.
- Mist: `#dbe7ec`, cool image and border support.
- Rain: `#7f929c`, secondary text and navigation.
- Amber: `#d8b486`, warm accent for hover states and section emphasis.

Use soft surfaces sparingly. Body copy should usually sit on ink or `ink/70`, not pale gray, to avoid low-contrast washout.

## Typography

- Display and body text use a classic serif stack: `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`.
- Navigation, labels, badges, and small metadata use the sans stack from Tailwind `font-sans`.
- Headings should balance line breaks and avoid oversized extremes on mobile.
- Uppercase tracking is allowed for short navigational labels, but should not appear as a reflex above every block.

## Layout

- Page gutters use `--space-page-x: clamp(20px, 4vw, 64px)`.
- Section rhythm uses `--space-section-y: clamp(56px, 9vw, 128px)`.
- Cards use `--radius-card: 6px`.
- Homepage should act as a curated entrance, while `/route` holds the complete guided path.
- Bulk imported images should stay in archive and exhibition pages, not the homepage selection system.

## Components

- `ArtworkCard` presents artwork in archive, exhibition, featured, and related contexts.
- `ExhibitionCard` serves as the compact entry into curated exhibitions.
- `CurationTrail` displays a full route segment with three representative works.
- `CurationRouteCard` compresses secondary route segments on the homepage.
- `CurationPlacementPanel` reconnects work pages to the route context.
- `ArchiveExplorer` handles full collection browsing and filtering.

## Motion

Use restrained fades and small scale changes. Motion must not hide content permanently in headless or reduced-motion contexts. Hover effects should help orientation, not decorate every element.

## Responsive Behavior

Desktop can use asymmetry and multi-column editorial layouts. Mobile should prioritize readable single-column flow, visible image proportions, and controls that do not overlap images or intercept clicks.
