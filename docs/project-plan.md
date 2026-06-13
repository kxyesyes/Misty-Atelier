# Misty Atelier Project Plan

Date: 2026-05-29
Project folder: `E:\Misty-Atelier`
Source image folder: `E:\美图`

## 1. Project Summary

Misty Atelier is a curated visual portfolio website built from the image collection in `E:\美图`.

The site should feel like a fictional online museum with the polish of a visual studio. It will present selected works through exhibition-style sections, while keeping a small amount of creative process material as optional Recipe Notes.

Positioning:

- 80% personal visual art portfolio
- 20% creative archive / prompt methodology

Core principle:

> The artworks are the subject. The template is grammar. Motion is breath.

## 2. Confirmed Direction

- Project name: `Misty Atelier`
- First version size: 40-60 selected works
- Current V1 draft selection: 54 works
- Home style: medium-density curated wall
- Copywriting tone: poetic + professional
- Motion level: medium motion
- Image strategy: conservative clarity, prioritizing visual detail
- Selection workflow: full scan first, then human curation

## 3. First Version Scope

The first version should include:

- Home / Curated Index
- Exhibition Detail pages
- Work Detail pages
- Lightweight About / Contact sections
- 6 featured exhibitions
- 3-5 Recipe Notes for representative works

The first version should not include:

- Full CMS
- User accounts
- Like/favorite system
- Heavy commercial service page
- Full wallpaper download system

## 4. Initial Exhibitions

1. Blue Rooms / 蓝调房间
2. Rain Archive / 雨的档案
3. Glasshouse Dreams / 玻璃温室梦
4. Seasonal Stations / 季节候车室
5. Atelier Hours / 画室时刻
6. Distant Fables / 远方寓言

Future exhibition ideas:

- Porcelain Silence / 瓷白静物
- Neon Reverie / 霓虹梦游
- Pencil Studies / 铅笔研究
- Wallpaper Lab / 壁纸实验室

## 5. Recommended Architecture

Recommended stack:

- Next.js
- TypeScript
- Tailwind CSS
- GSAP or Framer Motion
- Static data files for V1
- `next/image` for image handling

Recommended content models:

- `Artwork`
- `Exhibition`
- `RecipeNote`

Recommended pages:

- `/`
- `/exhibitions/[slug]`
- `/works/[slug]`

## 6. Planned Folder Structure

```txt
E:\Misty-Atelier\
  docs\
    project-plan.md
  app\
  src\
    data\
    domain\
    lib\
    components\
    styles\
  public\
    images\
      artworks\
        full\
        thumbs\
      covers\
      og\
  scripts\
```

The folders beyond `docs` can be created when implementation begins.

## 7. Existing Planning References

The original planning files are currently in `E:\美图\docs\superpowers\specs`:

- `2026-05-29-vibe-portfolio-design.md`
- `2026-05-29-vibe-portfolio-project-architecture.md`
- `2026-05-29-misty-atelier-candidate-scan.csv`
- `2026-05-29-misty-atelier-v1-selection.md`

These should be copied or migrated into this project folder before implementation starts.

## 8. Next Steps

1. Review the 54-work V1 selection draft.
2. Remove or replace works that do not fit the first version.
3. Lock the final selected works list.
4. Prepare web image assets from the selected works.
5. Scaffold the Next.js project.
6. Create typed data files for artworks, exhibitions, and Recipe Notes.
7. Build Home, Exhibition Detail, and Work Detail pages.
8. Add restrained motion and responsive polish.
9. Run visual QA on desktop and mobile.

