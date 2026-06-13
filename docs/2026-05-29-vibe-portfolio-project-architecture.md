# Misty Atelier 顶级项目架构设计

日期：2026-05-29
阶段：架构设计，不进入代码实现
关联文档：`docs/superpowers/specs/2026-05-29-vibe-portfolio-design.md`
确认项目名：`Misty Atelier`

## 1. 架构目标

这个项目要做成一个可长期扩展的视觉作品集，而不是一次性的图片展示页。

架构需要同时满足四件事：

1. 让图片作为绝对主角，页面结构服务策展。
2. 让展区、作品、创作拆解都可以通过数据扩展。
3. 让第一版足够轻，先完成 Home、Exhibition Detail、Work Detail 和轻量 Contact。
4. 让后续可以自然升级到完整 Archive、筛选系统、更多展区和商单展示。

一句话架构：

> 用静态数据驱动的 React 作品集架构，外层是策展页面，内核是 Artwork / Exhibition / Recipe Notes 三类内容模型。

## 2. 推荐技术栈

第一版推荐使用：

- `Next.js`：用于正式作品集、动态路由、图片优化、SEO 和后续部署。
- `TypeScript`：保证作品、展区、创作拆解的数据结构稳定。
- `Tailwind CSS`：快速搭建克制、统一、可迭代的视觉系统。
- `GSAP` 或 `Framer Motion`：用于少量高质量动效。
- `next/image`：处理图片加载、尺寸、懒加载和响应式图像。
- 静态数据文件：第一版不接数据库，降低复杂度。

为什么不建议第一版上数据库：

- 当前核心任务是作品策展和视觉表达，不是内容管理系统。
- 图片和 metadata 可以先用本地数据文件维护。
- 数据模型稳定后，再升级到 CMS 或数据库会更稳。

后续可升级方向：

- `Contentlayer` 或 `MDX`：用于写更长的创作笔记。
- `Sanity` / `Payload CMS`：用于可视化管理作品。
- `Supabase`：用于收藏、浏览统计或后台能力。

## 3. 顶级目录结构

推荐项目目录：

```txt
misty-atelier/
  app/
    layout.tsx
    page.tsx
    exhibitions/
      [slug]/
        page.tsx
    works/
      [slug]/
        page.tsx
    not-found.tsx

  src/
    data/
      artworks.ts
      exhibitions.ts
      recipe-notes.ts
      navigation.ts

    domain/
      artwork.ts
      exhibition.ts
      recipe-note.ts
      filters.ts

    lib/
      artwork-query.ts
      exhibition-query.ts
      image-paths.ts
      slug.ts
      seo.ts

    components/
      layout/
        SiteShell.tsx
        Header.tsx
        Footer.tsx
        MobileNav.tsx

      home/
        HomeHeroIndex.tsx
        FeaturedExhibitionGrid.tsx
        SelectedWorksRail.tsx
        StudioNote.tsx

      exhibitions/
        ExhibitionHero.tsx
        ExhibitionGrid.tsx
        ExhibitionCard.tsx
        ExhibitionIntro.tsx

      works/
        WorkViewer.tsx
        WorkMetaPanel.tsx
        RelatedWorks.tsx
        RecipeNotesPanel.tsx

      motion/
        Reveal.tsx
        ImageMaskReveal.tsx
        PageTransition.tsx
        AmbientShader.tsx

      ui/
        Button.tsx
        Tag.tsx
        LinkText.tsx
        SectionLabel.tsx

    styles/
      globals.css
      tokens.css

  public/
    images/
      artworks/
        full/
        thumbs/
      covers/
      og/

  scripts/
    prepare-images.ts
    generate-artwork-manifest.ts
    validate-content.ts

  docs/
    superpowers/
      specs/
      plans/
```

## 4. 模块边界

### `app/`

负责 Next.js 路由和页面入口。

它只做页面拼装，不直接写复杂业务逻辑。页面应该从 `src/lib` 查询数据，然后交给 `src/components` 渲染。

第一版路由：

- `/`：策展索引首页
- `/exhibitions/[slug]`：展区详情
- `/works/[slug]`：作品详情

后续路由：

- `/archive`：完整作品档案
- `/about`：完整工作室介绍
- `/contact`：更正式的合作页

### `src/data/`

负责静态内容数据。

第一版所有展区、作品和创作拆解都从这里读取。这样做的好处是：

- 内容可版本管理。
- 不需要后台就能上线。
- 后续迁移 CMS 时有清晰的数据来源。

### `src/domain/`

负责类型定义和领域规则。

这里定义什么是 Artwork、Exhibition、RecipeNote，以及标签、颜色、情绪、场景等枚举类型。

它不负责 React 渲染。

### `src/lib/`

负责查询、派生和校验数据。

例如：

- 根据展区 slug 找展区。
- 找某个展区下的所有作品。
- 找精选作品。
- 找相关作品。
- 生成页面 SEO metadata。

页面不应该自己手写过滤逻辑，避免后期越来越乱。

### `src/components/`

负责 UI 呈现。

组件按页面语义拆分，而不是按技术概念堆在一起：

- `home/`：只服务首页。
- `exhibitions/`：只服务展区页面。
- `works/`：只服务作品详情页。
- `motion/`：复用动效包装。
- `ui/`：小型基础 UI。

### `public/images/`

负责部署用图片资源。

不要直接把所有原图无筛选塞进网站。应该保留原图在项目素材区，然后生成网站用图片：

- `full/`：作品详情大图。
- `thumbs/`：网格和卡片缩略图。
- `covers/`：展区封面图。
- `og/`：社交分享图。

### `scripts/`

负责内容和图片的准备工作。

脚本不参与浏览器运行，只在开发时运行。

第一版建议有三个脚本：

- `prepare-images.ts`：把选定图片压缩、生成 WebP/AVIF 和缩略图。
- `generate-artwork-manifest.ts`：从图片和 metadata 生成作品清单。
- `validate-content.ts`：检查作品引用的图片、展区、Recipe Notes 是否存在。

## 5. 数据模型

### Artwork

作品是网站的最小内容单位。

建议类型：

```ts
export type Artwork = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  image: {
    full: string;
    thumb: string;
    width: number;
    height: number;
    alt: string;
  };
  primaryExhibitionId: string;
  exhibitionIds: string[];
  tags: string[];
  colorTags: string[];
  moodTags: string[];
  sceneTags: string[];
  description: string;
  featured: boolean;
  recipeNotesId?: string;
};
```

设计原则：

- `id` 用于内部引用。
- `slug` 用于 URL。
- `primaryExhibitionId` 决定作品主归属。
- `exhibitionIds` 允许一个作品出现在多个展区。
- `recipeNotesId` 只有代表作才有。

### Exhibition

展区是策展集合。

建议类型：

```ts
export type Exhibition = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  coverArtworkId: string;
  palette: {
    background: string;
    foreground: string;
    accent: string;
  };
  featured: boolean;
  sortOrder: number;
  tagRules: string[];
};
```

设计原则：

- 首页只展示 `featured: true` 的展区。
- 展区顺序由 `sortOrder` 控制。
- 后续新增展区只需要新增数据。

### RecipeNote

创作拆解只给少数代表作使用。

建议类型：

```ts
export type RecipeNote = {
  id: string;
  artworkId: string;
  mood: string;
  composition: string;
  palette: string;
  promptFragment: string;
  negativeNotes: string[];
  processComment: string;
};
```

设计原则：

- 不默认公开完整 prompt。
- 展示思路、构图、色彩和避坑。
- 作为作品详情的折叠模块出现。

## 6. 页面架构

### Home

目标：像进入一座线上美术馆。

页面结构：

1. Header：品牌名、Exhibitions、Recipe Notes、Contact。
2. Hero Index：品牌短句 + 代表图片拼贴。
3. Featured Exhibition Grid：6 个主展区入口。
4. Selected Works Rail：横向或错落的精选作品。
5. Studio Note：一句简短创作陈述。
6. Footer：轻量 Contact。

数据来源：

- `getFeaturedExhibitions()`
- `getFeaturedArtworks()`

### Exhibition Detail

目标：让每个展区像一个小型专题展。

页面结构：

1. Exhibition Hero：封面、标题、策展语。
2. Exhibition Intro：色彩、关键词、简短说明。
3. Artwork Grid：该展区作品。
4. Featured Work：展区代表作。
5. Next Exhibition：引导继续浏览。

数据来源：

- `getExhibitionBySlug(slug)`
- `getArtworksByExhibitionId(id)`
- `getNextExhibition(id)`

### Work Detail

目标：图片最大化，信息克制。

页面结构：

1. Work Viewer：大图展示。
2. Work Meta Panel：标题、展区、标签、描述。
3. Recipe Notes Panel：只在有 `recipeNotesId` 时显示。
4. Related Works：同展区或同标签作品。

数据来源：

- `getArtworkBySlug(slug)`
- `getRecipeNoteForArtwork(id)`
- `getRelatedArtworks(id)`

## 7. 视觉系统架构

视觉系统应放在 `src/styles/tokens.css` 和 Tailwind 配置中。

第一版建议定义这些设计 token：

```css
:root {
  --color-ink: #24313a;
  --color-paper: #f7f4ee;
  --color-mist: #dbe7ec;
  --color-cream: #fffaf3;
  --color-amber: #d8b486;
  --color-rain: #7f929c;

  --radius-card: 6px;
  --radius-soft: 8px;

  --space-page-x: clamp(20px, 4vw, 64px);
  --space-section-y: clamp(56px, 9vw, 128px);
}
```

设计规则：

- 卡片圆角控制在 6-8px，避免 SaaS 卡片味太重。
- 背景以纸感浅色为主，不使用强烈紫蓝渐变。
- 颜色来自作品，不用模板色板压过作品。
- 字体层级克制，标题可以有画册感，正文保持清晰。

## 8. 动效架构

动效应该集中在 `src/components/motion/`。

推荐动效组件：

- `Reveal`：通用进入动画。
- `ImageMaskReveal`：图片遮罩揭示。
- `PageTransition`：页面切换淡入淡出。
- `AmbientShader`：轻量 shader 氛围层。

动效原则：

- 所有动效都必须可关闭或可降级。
- 首屏图片不能因为动效迟迟不出现。
- 移动端减少复杂动效。
- Shader 只用于空气感，不作为主视觉。

## 9. 图片资源架构

原始图片和网站图片要分离。

推荐流程：

1. 从项目图片中挑选第一版作品。
2. 建立作品 metadata。
3. 生成网站用文件名。
4. 输出 `full`、`thumb`、`cover` 三类资源。
5. 在 `artworks.ts` 中引用生成后的路径。

命名建议：

```txt
blue-rooms-winter-window-room.full.webp
blue-rooms-winter-window-room.thumb.webp
rain-archive-balcony-cat.full.webp
rain-archive-balcony-cat.thumb.webp
```

图片策略：

- 原图不直接作为网页网格图使用。
- 缩略图控制体积，保证首页加载快。
- 作品详情再加载大图。
- 所有图片必须有 `width`、`height` 和 `alt`。

## 10. 查询与派生逻辑

查询函数统一放在 `src/lib/`。

建议函数：

```ts
getFeaturedExhibitions(): Exhibition[]
getAllExhibitions(): Exhibition[]
getExhibitionBySlug(slug: string): Exhibition
getFeaturedArtworks(): Artwork[]
getArtworkBySlug(slug: string): Artwork
getArtworksByExhibitionId(exhibitionId: string): Artwork[]
getRecipeNoteForArtwork(artworkId: string): RecipeNote | undefined
getRelatedArtworks(artworkId: string): Artwork[]
```

规则：

- 页面组件只调用查询函数。
- 查询函数负责排序、过滤和错误处理。
- 不在 JSX 中散落复杂 `filter` 和 `map` 条件。

## 11. 扩展路线

### 第一版

包括：

- Home
- Exhibition Detail
- Work Detail
- 6 个精选展区
- 30-50 张精选作品
- 3-5 个 Recipe Notes
- 轻量 Contact

### 第二版

增加：

- Archive 页面
- 按展区、情绪、颜色、空间筛选
- 更多作品
- 更完整 About 页面

### 第三版

增加：

- CMS 或 MDX 创作笔记
- 自定义域名
- Open Graph 分享图
- 商业合作案例页
- 多语言文案增强

## 12. 测试与质量门槛

第一版至少需要这些检查：

- 数据校验：每个 artwork 的图片路径存在。
- 数据校验：每个 `primaryExhibitionId` 指向真实展区。
- 数据校验：每个 `recipeNotesId` 指向真实创作拆解。
- 路由检查：首页、展区页、作品页都能打开。
- 响应式检查：桌面、平板、手机不出现文字重叠。
- 图片检查：首页不加载全部大图。
- 无障碍检查：图片有 alt，链接有可读文本。
- 动效检查：低性能设备和移动端不被 shader 或滚动动画拖慢。

## 13. 关键架构决策

### 决策 1：第一版使用静态数据

理由：内容规模可控，重点在视觉和策展，不需要后台。

### 决策 2：展区是数据，不是写死导航

理由：后续可以扩展赛博、瓷器、铅笔线稿、圆珠笔等新系列。

### 决策 3：Recipe Notes 是作品详情的增强模块

理由：保持作品集高级感，同时露出创作方法论。

### 决策 4：图片处理独立成脚本

理由：保护原图，控制网页性能，让首屏和网格加载更稳。

### 决策 5：动效集中封装

理由：避免每个组件各自动画，后续统一调节节奏和性能。

## 14. 实施前需要确认的输入

这些输入已经确认：

1. 项目名使用 `Misty Atelier`。
2. 第一版入选作品数量为 40-60 张。
3. 命名策略为前台中英双标题，URL 和图片文件名统一使用英文短名。
4. 文案语气为诗意 + 专业混合。
5. 首页视觉密度为中密度策展墙。
6. 动效等级为中等动效。
7. 图片处理标准为保守清晰，优先保证作品细节。
8. 第一版筛图流程为自动全量扫描后人工删减。
9. 技术栈默认优先使用 `Next.js`。

正式实现前仍需补充：

1. 联系方式内容，包括邮箱、微信或社媒链接。
2. 首批候选作品扫描表。
3. 人工确认后的 40-60 张入选作品清单。

## 15. 已确认的内容策略补充

### 首批作品数量

第一版展示 40-60 张作品。

这个数量可以让每个主展区拥有 6-10 张作品，既能形成策展厚度，又不会让首页和展区页变成无重点的图片堆叠。

### 首批筛选流程

采用“自动全量扫描，再人工删减”的流程。

自动扫描阶段生成候选作品表，记录：

- 原始文件名
- 图片尺寸
- 画幅比例
- 文件大小
- 主题关键词推断
- 建议展区
- 是否适合首页精选
- 是否适合 Recipe Notes

人工删减阶段从候选表中筛出 40-60 张第一版作品。

筛选优先级：

1. 图像质量高，细节稳定。
2. 与六个主展区气质匹配。
3. 色彩和情绪有辨识度。
4. 同质化作品只保留最强的一张或少数几张。
5. 首页封面图优先选择构图清晰、远看也有识别度的作品。

### 命名系统

前台显示中英双标题，代码、URL 和图片文件名使用英文短名。

示例：

```txt
前台标题：雨后阳台与白猫 / Balcony After Rain
URL：/works/balcony-after-rain
图片大图：rain-archive-balcony-after-rain.full.webp
图片缩略图：rain-archive-balcony-after-rain.thumb.webp
数据 ID：rain-archive-balcony-after-rain
```

命名规则：

- 中文标题保留作品气质。
- 英文标题用于国际化表达和 URL 语义。
- `slug` 使用小写英文和连字符。
- 图片文件名包含展区前缀，方便维护。
- 同一作品的 full、thumb、cover 版本共享同一个基础名。

### 文案语气

采用“诗意 + 专业混合”的文案系统。

分区规则：

- 首页：诗意、克制、像美术馆入口。
- 展区页：诗意策展语 + 清晰主题说明。
- 作品详情页：清楚说明图像主题、场景、色彩和情绪。
- Recipe Notes：专业说明构图、色彩、prompt 策略和避坑。
- Contact：克制商业，不使用强销售话术。

### 首页视觉密度

首页采用中密度策展墙。

结构：

- 首屏包含品牌区、策展短句和 3 张代表图。
- 首屏下方展示 6 个主展区卡片。
- 页面整体比大留白画册更有内容量，但比高密度作品墙更克制。

设计目标：

- 第一眼有作品冲击力。
- 仍保留高级感和呼吸感。
- 不让用户迷失在过多图片里。

### 动效等级

第一版采用中等动效。

允许：

- 滚动 reveal。
- 图片遮罩进入。
- 展区卡片轻微 hover。
- 轻视差。
- 页面淡入过渡。

限制：

- 不做大型滚动叙事。
- 不让 shader 常驻为主背景。
- 不做复杂鼠标跟随效果。
- 移动端自动减弱动效。

### 图片处理标准

第一版采用保守清晰策略。

规则：

- 原图完整保留。
- 网站使用单独导出的网页图。
- 首页和展区网格使用清晰缩略图，不进行过度压缩。
- 作品详情使用高质量大图。
- 优先使用高质量 WebP。
- 必要时保留 PNG 或 JPEG 备份。
- 性能主要通过懒加载、缩略图和按需加载控制，而不是牺牲画质。
