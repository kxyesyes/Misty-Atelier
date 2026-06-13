# Vibe Portfolio Website Design Plan

Date: 2026-05-29
Project working title: Misty Atelier

## 1. Project Positioning

This project is a visual portfolio website built from the existing image collection in the current project folder.

The site should feel like a fictional online museum with the polish of a visual studio. Its main purpose is to present the creator's aesthetic, image-making ability, and curatorial taste. The secondary purpose is to preserve a small amount of AI image-making methodology through selected creative notes.

Target balance:

- 80% personal visual art portfolio
- 20% creative archive / prompt methodology

The site should not feel like a generic gallery, wallpaper dump, or template showcase. Images are the main subject. Layout, motion, and shader effects are supporting language.

Core principle:

> The artworks are the subject. The template is grammar. Motion is breath.

## 2. Brand Direction

The brand direction should use a Chinese-English hybrid identity. It should feel poetic, quiet, and professional enough to support future commissions.

Working name options:

- Misty Atelier
- Daylight Archive
- Soft Frame Studio

The design plan will use `Misty Atelier` as a temporary project name. The final name can be decided later without changing the site architecture.

Brand mood:

- Quiet
- Curated
- Soft cinematic light
- Illustrated weather
- Rooms, seasons, windows, rain, snow, glasshouses, studios
- Professional, but not sales-heavy

Suggested English positioning line:

> A quiet index of illustrated rooms, weather, and seasonal light.

Suggested Chinese positioning line:

> 一座关于房间、天气与季节光线的线上图像馆。

## 3. Recommended Site Scope

The first version should use a focused multi-page structure:

- Home
- Exhibition Detail
- Work Detail
- Lightweight About / Contact sections

This is a middle path between a single-page prototype and a full archive system. It gives the project enough structure to feel like a real portfolio while avoiding the overhead of building every possible archive feature in the first version.

First version pages:

### Home / Curated Index

The home page is the main museum entrance. It should not start with a long biography. It should open with:

- Brand name
- Short curatorial sentence
- Selected artwork collage
- 4-6 featured exhibition entrances
- Small navigation links: Exhibitions, Recipe Notes, Contact

The home page should use a bento editorial grid, but with art direction closer to a gallery wall or visual book index than a SaaS dashboard.

### Exhibition Detail

Each exhibition page presents one curated group of works.

Content:

- Exhibition Chinese title
- Exhibition English title
- Short curatorial text
- Cover image
- Representative color or atmosphere
- Artwork grid
- Optional featured work block

The page should support future exhibitions without changing the page template.

### Work Detail

Each work detail page focuses on the image first.

Content:

- Large artwork display
- Chinese title
- English title
- Exhibition
- Tags
- Short description
- Color / mood / scene metadata
- Optional Recipe Notes for selected works only

Recipe Notes should be folded or visually secondary so the page remains a portfolio page, not a tutorial page.

### About / Studio

This can be a compact section or lightweight page in version one.

It should describe the visual practice in a calm, curatorial voice:

- Visual direction
- Image themes
- Creative process
- Selected collaboration openness

### Contact / Commission

The commercial entry should be lightweight.

Recommended copy:

> Open for selected visual collaborations.

Contact can include:

- Email field, to be filled when the creator provides the address
- WeChat field, to be filled when the creator provides the preferred handle or QR image
- Social link field, to be filled when the creator chooses the platform links

No heavy service sales page in version one.

## 4. Exhibition System

Exhibitions should be dynamic curated collections, not hard-coded permanent navigation categories.

The first version can feature six primary exhibitions on the home page. Later, new exhibitions can be added, hidden, reordered, or promoted without changing the page structure.

Initial exhibition set:

### Blue Rooms / 蓝调房间

For quiet interiors, windows, bedrooms, reading corners, cool sky, and blue-white studios.

Candidate works:

- 冬日窗边的蓝调房间
- 清晨窗边阅读房间0
- 清晨窗边阅读房间1
- 清冷天空感
- 蓝白画室少女

### Rain Archive / 雨的档案

For rainy rooms, wet balconies, tea gardens, headphones, mist, and soft weather.

Candidate works:

- 雨天耳机少女与小书桌
- 雨后阳台与白猫
- 雨后茶园·薄雾少女
- 雨水

### Glasshouse Dreams / 玻璃温室梦

For glasshouses, pale greens, flowers, morning dew, plants, and dreamlike indoor nature.

Candidate works:

- 玻璃温室·晨露花影
- 玻璃花房中的蓝白梦境
- 新绿温室·晨光少女
- 温室尽头的苔鹿

### Seasonal Stations / 季节候车室

For seasonal works, stations, snow, spring terms, winter light, and quiet travel moods.

Candidate works:

- 立春
- 谷雨
- 冬日等列车
- 极简白雪·车站候车
- 雪夜天台·白发少女

### Atelier Hours / 画室时刻

For studio, drawing, creative rooms, supplies, desks, blue-white art spaces.

Candidate works:

- 画室女
- 午后画室整理时刻
- 蓝白画室少女
- gpt-image-2 original pen drawing works

### Distant Fables / 远方寓言

For fantasy, mythic, symbolic, and distant narrative images.

Candidate works:

- 潮汐邮差与云海鲸
- 钟楼里的纸翼守鸟
- 雪原边的提灯狐站
- 沙漠星空·异域旅人
- 赤色神社 · 风铃与狐面少女0
- 赤色神社 · 风铃与狐面少女1

Future expandable exhibition examples:

- Neon Reverie / 霓虹梦游
- Cyber Rain / 赛博雨街
- Porcelain Silence / 瓷白静物
- Ceramic Bloom / 陶瓷花影
- Pencil Studies / 铅笔研究
- Ink Window / 圆珠笔窗景

## 5. Content Model

The site should be data-driven. Page templates should read artwork and exhibition metadata instead of hard-coding every image into components.

### Artwork

Each artwork should include:

- `id`
- `title`
- `titleEn`
- `image`
- `exhibitionIds`
- `primaryExhibitionId`
- `tags`
- `colorTags`
- `moodTags`
- `sceneTags`
- `description`
- `featured`
- `hasRecipeNotes`
- `recipeNotesId`

Suggested tag groups:

- Mood: quiet, lonely, warm, dreamlike, healing, cinematic
- Time: morning, dusk, night, winter, spring, rainy
- Scene: room, kitchen, atelier, greenhouse, station, shrine, lighthouse
- Color: mist-blue, cream-white, amber, soft-green, snow-white, muted-red
- Type: daily-life, fantasy, portrait, poster, wallpaper, study

### Exhibition

Each exhibition should include:

- `id`
- `title`
- `titleEn`
- `slug`
- `summary`
- `coverArtworkId`
- `featured`
- `sortOrder`
- `palette`
- `tagRules`

### Recipe Notes

Recipe Notes are only used for selected representative works.

Each note can include:

- Mood
- Composition
- Palette
- Prompt fragment
- Negative notes
- Process comment

The site should avoid exposing full prompts for every work in version one. This preserves portfolio quality while still showing the creator's process.

## 6. Visual Reference Strategy

The project should not start from a complete template. It should use a reference system:

### Structure Layer: Bento Editorial Grid

Use bento and editorial grid references for the home page and exhibition indexes.

The grid should feel like:

- Gallery wall
- Visual book index
- Curated archive

It should avoid:

- SaaS dashboard feeling
- Over-rounded cards
- Generic gradient cards
- Decorative icon clutter

### Motion Layer: Quiet GSAP

Use GSAP-style inspiration for restrained motion:

- Image reveal
- Soft mask transitions
- Scroll-triggered section entry
- Gentle parallax
- Page transition fade

Motion should make images feel unfolded or revealed. It should not become a technical demo.

### Component Layer: 21st.dev / React Bits

Use 21st.dev and React Bits as sources for small interface patterns only:

- Navigation
- Card hover
- Text reveal
- Scroll hint
- Filter controls

Use no more than two or three noticeable animated components in version one.

### Atmosphere Layer: Soft Shader Gradient

Shader gradients can be used as a subtle atmosphere layer:

- Loading screen
- Home brand area
- Exhibition hover background
- Detail page ambient background

They should not compete with the images. They should be soft, slow, pale, and optional.

## 7. Interaction Design

Recommended interactions:

- Hovering an exhibition card softly reveals the curatorial sentence.
- Clicking an exhibition opens the exhibition detail page.
- Artwork cards use restrained zoom or mask reveal.
- Work detail pages prioritize full image viewing.
- Recipe Notes open through a subtle expandable panel.
- Contact link appears in navigation and footer.

Avoid:

- Constant moving backgrounds
- Heavy cursor effects
- Sound by default
- Excessive 3D or WebGL interaction
- Dense text overlays on images
- Animation that delays image browsing

## 8. Technical Direction

Recommended stack for implementation:

- React
- Vite or Next.js
- Tailwind CSS
- Framer Motion or GSAP for motion
- Data files for exhibitions and artworks

If SEO and deployment polish matter, Next.js is preferable. If speed and simplicity matter for the first local version, Vite is enough.

The first version can use static data:

- `src/data/artworks.ts`
- `src/data/exhibitions.ts`
- `src/data/recipeNotes.ts`

Images can remain in a public assets folder with clean generated filenames.

The project should include an image preparation step:

- Preserve originals
- Generate web-friendly copies
- Use consistent filenames
- Prefer AVIF/WebP for deployment if practical
- Keep thumbnails separate from full-size images

## 9. Implementation Phases

### Phase 1: Content Audit And Metadata

- Select initial 30-50 works
- Rename or map image filenames to clean IDs
- Assign each work to one or more exhibitions
- Pick six exhibition covers
- Pick 3-5 works for Recipe Notes

### Phase 2: Static Portfolio Prototype

- Build Home
- Build Exhibition Detail
- Build Work Detail
- Add lightweight About / Contact
- Add initial responsive layout

### Phase 3: Motion And Polish

- Add image reveal
- Add exhibition hover states
- Add page transitions
- Add optional shader atmosphere
- Tune typography, spacing, and mobile layout

### Phase 4: Archive Expansion

- Add full Archive page when the initial Home / Exhibition / Work Detail structure is stable and the collection needs broader filtering
- Add filters by exhibition, mood, color, scene, season
- Add more exhibitions
- Improve metadata workflow

### Phase 5: Deployment

- Optimize image formats
- Add metadata / Open Graph previews
- Deploy to Vercel, Netlify, or static hosting
- Connect a custom domain when the public brand name is finalized

## 10. Success Criteria

The first version is successful if:

- The home page immediately feels like a curated visual museum, not a generic image grid.
- The images remain the main subject.
- The six initial exhibitions make the collection easier to understand.
- The site can accept new exhibitions and works through data updates.
- Recipe Notes add creative depth without turning the site into a tutorial.
- Contact / Commission is visible but quiet.
- The site feels polished on desktop and mobile.
