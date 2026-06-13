# Misty Atelier

Misty Atelier is a fictional visual archive for quiet interiors, soft weather,
seasonal stations, atelier studies, and distant fables.

The current V1 is a static Next.js portfolio built around curated exhibitions,
local artwork images, and small Recipe Notes. The goal is to feel closer to an
online art book than a generic image grid.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

The build prerenders the home page, six exhibition pages, and 54 artwork pages.

## V1 Scope

- Brand identity and metadata for Misty Atelier
- Six curated exhibition sections
- 54 local artwork records
- Featured artwork selections for the home page
- Five lightweight Recipe Notes
- Static data and images only, with no CMS in V1

## Data Structure

- `src/data/exhibitions.ts` stores exhibition order, summaries, cover artwork,
  and palette tokens.
- `src/data/artworks.ts` stores artwork metadata, image paths, descriptions,
  tags, featured state, and optional Recipe Note links.
- `src/data/recipeNotes.ts` stores short editorial notes attached to selected
  artwork slugs.
- `src/lib/*-query.ts` files provide the query layer used by pages.

## Image Structure

Artwork images are served from local public assets:

- Full images: `public/images/artworks/full`
- Thumbnails: `public/images/artworks/thumbs`
