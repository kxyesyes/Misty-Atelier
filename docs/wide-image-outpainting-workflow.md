# Wide image outpainting workflow

Misty Atelier keeps the original portrait artwork intact and uses separate wide derivatives for horizontal slots such as Curation Path.

## Asset contract

- Original full image: `public/images/artworks/full/<slug>.jpg`
- Original thumbnail: `public/images/artworks/thumbs/<slug>.jpg`
- Wide derivative: `public/images/artworks/wide/<slug>.jpg`
- Wide thumbnail: `public/images/artworks/wide-thumbs/<slug>.jpg`

The React UI should only treat an image as a real horizontal composition when `wideThumbnail` is present in the artwork data. Otherwise it falls back to the original image without destructive cropping.

## Prepare inputs

Run:

```bash
npm run prepare:wide
```

This creates:

- preview wide images in `public/images/artworks/wide`
- preview wide thumbnails in `public/images/artworks/wide-thumbs`
- outpainting canvases in `tmp/wide-outpainting-inputs/images`
- outpainting masks in `tmp/wide-outpainting-inputs/masks`
- a processing manifest in `tmp/wide-outpainting-inputs/manifest.json`

The preview images are only bridge assets. Replace them with AI outpainted results when final curation images are ready.

## Recommended GitHub tools

- IOPaint: `https://github.com/Sanster/IOPaint`
  - Best fit for this project because it is open-source, self-hostable, and supports outpainting workflows.
- AUTOMATIC1111 Stable Diffusion WebUI: `https://github.com/AUTOMATIC1111/stable-diffusion-webui`
  - Good for manual outpainting and one-off visual polishing.
- stablediffusion-infinity: `https://github.com/lkwq007/stablediffusion-infinity`
  - Useful for canvas-style exploration, but less predictable for repeatable batch output.

## Replacement step

After outpainting, export each final 4:3 result with the original slug:

```text
public/images/artworks/wide/<slug>.jpg
public/images/artworks/wide-thumbs/<slug>.jpg
```

The site will pick it up automatically for horizontal curation slots.

## Local IOPaint command

The `misty-atelier` conda environment has IOPaint installed. On this machine, run:

```powershell
& 'C:\Users\xkx52\.conda\envs\misty-atelier\Scripts\iopaint.exe' run `
  --model lama `
  --device cpu `
  --image tmp\wide-outpainting-inputs\images `
  --mask tmp\wide-outpainting-inputs\masks `
  --output tmp\iopaint-lama-wide
```

LaMa is useful for fast local extension on CPU. For more semantic extensions, use IOPaint with PowerPaint/PowerPaint V2 and replace the same `wide` files.
