# Full Images on List Pages - Design Spec

Date: 2026-05-29
Project: Misty Atelier

## Summary
Switch the homepage and exhibition list cards to render full-resolution artwork images to eliminate blur caused by upscaling thumbnails. Remove thumbnail generation and storage entirely to match the requirement of not keeping thumbnail files.

## Goals
- Improve perceived sharpness on homepage and exhibition list pages.
- Use full-resolution images for list cards without altering layout or typography.
- Remove thumbnail artifacts and code paths that produce or reference them.

## Non-Goals
- No new visual redesign of layout or typography.
- No new image formats or CDN integration.
- No changes to work detail pages beyond what is required for consistency.

## Approach (Recommended)
1. Data model: remove the `thumbnail` field from the artwork dataset.
2. Asset pipeline: stop generating thumbnail files in the asset preparation script.
3. UI updates:
   - Homepage cards read from `work.src` (full image path).
   - Exhibition list cards read from `work.src`.
4. Assets: delete the `public/images/artworks/thumbs` directory.

## Affected Files
- `scripts/prepare_assets.py`
- `src/data/artworks.ts`
- `src/app/page.tsx`
- `src/app/exhibitions/[slug]/page.tsx`
- `public/images/artworks/thumbs` (remove directory)

## Performance Considerations
- List pages will request larger images. Next.js `next/image` will still generate optimized formats at suitable sizes, but first-load bandwidth may increase.
- If bandwidth becomes an issue later, reintroduce smaller list-specific assets or introduce a dedicated image pipeline.

## Risks
- Potentially higher data transfer for list pages on slower networks.
- If any code still references `thumbnail`, builds will fail; remove or update all references.

## Validation
- Run `npm run build` to ensure static generation completes.
- Visually verify image clarity on homepage and exhibition list pages.
- Confirm `public/images/artworks/thumbs` no longer exists after regeneration.

## Rollback
- Re-enable thumbnail generation in the script, reintroduce `thumbnail` in artwork data, and swap list cards back to thumbnails.
