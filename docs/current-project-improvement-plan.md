# Misty Atelier 现有项目下一步优化计划

日期：2026-05-29
适用范围：基于当前 `E:\Misty-Atelier` 已存在代码继续优化
目标版本：Misty Atelier V1

## 1. 当前判断

当前项目已经不是空项目，而是一个能成功构建的 Next.js 原型。

已具备：

- Next.js 14 + TypeScript + Tailwind CSS
- App Router 页面结构
- 首页 `/`
- 展区页 `/exhibitions/[slug]`
- 作品页 `/works/[slug]`
- 6 个展区
- 54 张作品数据
- 54 张 full 图片
- 54 张 thumb 图片
- 5 条 Recipe Notes
- 基础 FadeIn 动效
- `npm run build` 可通过

当前主要问题不是“缺功能”，而是：

1. 项目身份还像脚手架。
2. 首页不像策展入口。
3. 数据字段太薄，支撑不了高级作品集叙事。
4. 页面直接操作数据，后续维护会变乱。
5. 全局视觉系统还没有 Misty Atelier 的气质。
6. 展区页和作品页能用，但还不够像“线上美术馆”。

因此下一步优化应聚焦于：

> 把当前可运行原型，提升成有品牌气质、有策展结构、可继续扩展的 V1。

## 2. 优化原则

### 先改基础，不急着加功能

暂时不做 Archive、筛选、CMS、下载、收藏、复杂 shader。

第一轮优化只做能明显提升作品集质感的内容：

- 站点身份
- 数据结构
- 首页结构
- 视觉系统
- 展区和作品详情的基础叙事

### 作品优先，动效克制

图片是主角，动效只负责让作品进入得更有节奏。

允许：

- 淡入
- 轻微 hover
- 图片遮罩感
- 小幅视差

避免：

- 大型滚动叙事
- 长时间 loading 动画
- 强 shader 背景
- 鼠标跟随特效

### 数据先行

首页、展区页、作品页都应该由数据驱动。

页面不应该散落大量 `find`、`filter`、硬编码图片 slug。  
下一步要先补查询层，再重做页面。

## 3. 推荐优化顺序

推荐按以下顺序执行：

1. 项目身份清理
2. 查询层抽离
3. 数据模型升级
4. 视觉系统建立
5. 首页重做
6. 展区页优化
7. 作品页优化
8. 构建和视觉检查

这个顺序的原因：

- 先清理身份，项目不再像 create-next-app。
- 再抽查询层，避免后续页面越改越乱。
- 再升级数据，给页面提供策展内容。
- 然后改视觉和首页，收益最大。
- 最后再深化展区页和作品页。

## 4. 第一阶段：项目身份清理

### 目标

让项目从配置、README、metadata 层面都变成 Misty Atelier。

### 修改文件

- `src/app/layout.tsx`
- `README.md`
- 新建 `src/lib/site.ts`

### 具体改动

新建 `src/lib/site.ts`：

```ts
export const site = {
  name: "Misty Atelier",
  title: "Misty Atelier",
  description: "A quiet index of illustrated rooms, weather, and seasonal light.",
  navigation: [
    { label: "Exhibitions", href: "/" },
    { label: "Recipe Notes", href: "/#recipe-notes" },
    { label: "Contact", href: "/#contact" },
  ],
};
```

修改 `src/app/layout.tsx`：

- `title` 改为 `Misty Atelier`
- `description` 改为项目定位句
- `html lang` 改为 `zh-CN`
- 移除 `Create Next App` 的默认痕迹

重写 `README.md`：

- 项目介绍
- 开发命令
- 构建命令
- 当前 V1 范围
- 图片和数据结构说明

### 验收标准

- `npm run build` 通过
- 浏览器标题显示 Misty Atelier
- README 不再是 Next.js 默认模板

## 5. 第二阶段：抽离查询层

### 目标

把页面里的数据查找逻辑集中到 `src/lib`，降低后续维护成本。

### 新建文件

- `src/lib/artwork-query.ts`
- `src/lib/exhibition-query.ts`
- `src/lib/recipe-query.ts`

### 建议函数

`artwork-query.ts`：

```ts
getAllArtworks()
getArtworkBySlug(slug)
getArtworksByExhibition(exhibitionSlug)
getFeaturedArtworks(limit)
getRelatedArtworks(slug, limit)
```

`exhibition-query.ts`：

```ts
getAllExhibitions()
getFeaturedExhibitions()
getExhibitionBySlug(slug)
getExhibitionArtworks(slug)
getNextExhibition(slug)
```

`recipe-query.ts`：

```ts
getRecipeNoteByArtworkSlug(slug)
```

### 需要替换的页面逻辑

当前这些页面直接查数据：

- `src/app/exhibitions/[slug]/page.tsx`
- `src/app/works/[slug]/page.tsx`
- `src/app/page.tsx`

下一步应全部改为调用查询函数。

### 验收标准

- 页面不再直接写复杂 `find` / `filter`
- `npm run build` 通过
- 现有 65 个静态页面仍能生成

## 6. 第三阶段：升级数据模型

### 目标

让数据能支撑“策展作品集”，而不是只支撑“图片列表”。

### 展区数据升级

当前 Exhibition 建议增加：

```ts
summary: string;
coverArtworkSlug: string;
palette: {
  background: string;
  foreground: string;
  accent: string;
};
featured: boolean;
sortOrder: number;
```

每个展区需要补：

- 一句英文策展语
- 封面作品 slug
- 色彩 palette
- 展示排序

### 作品数据升级

当前 Artwork 建议增加：

```ts
description: string;
tags: string[];
featured: boolean;
recipeNotesId?: string;
```

每张作品先补最小可用内容：

- `description`：一句英文说明
- `tags`：3-5 个标签
- `featured`：是否可用于首页精选
- `recipeNotesId`：只有 5 张代表作需要

### 推荐 featured 作品

首页精选建议先使用：

- `winter-blue-window-room`
- `balcony-after-rain`
- `blue-white-glasshouse-dream`
- `minimal-snow-station`
- `blue-white-atelier-girl`
- `tide-postman-and-cloud-whale`

### 验收标准

- TypeScript 类型清晰
- 所有 54 张作品字段完整
- 6 个展区字段完整
- `npm run build` 通过

## 7. 第四阶段：建立视觉系统

### 目标

让项目摆脱默认脚手架视觉，形成 Misty Atelier 的基础气质。

### 修改文件

- `src/app/globals.css`
- `tailwind.config.ts`

### 建议视觉 token

```css
:root {
  --color-ink: #24313a;
  --color-paper: #f7f4ee;
  --color-cream: #fffaf3;
  --color-mist: #dbe7ec;
  --color-rain: #7f929c;
  --color-amber: #d8b486;
  --radius-card: 6px;
  --space-page-x: clamp(20px, 4vw, 64px);
  --space-section-y: clamp(56px, 9vw, 128px);
}
```

### 全局风格方向

- 背景：浅纸感
- 字色：深墨蓝灰
- 卡片：小圆角，避免 SaaS 感
- 间距：比普通作品列表更像画册
- 图片：保持清晰和主导地位

### 验收标准

- 首页背景不再是默认 neutral 白灰
- 页面整体有统一色彩系统
- 移动端文字不拥挤
- `npm run build` 通过

## 8. 第五阶段：首页重做

### 目标

把首页从普通展区网格改成“中密度策展墙”。

### 修改文件

- `src/app/page.tsx`

### 新首页结构

1. 顶部导航
2. Hero 品牌区
3. 三张代表图拼贴
4. 六个展区入口
5. 精选作品区域
6. Studio Note
7. Contact Footer

### 首页首屏代表图

建议使用：

- `winter-blue-window-room`
- `balcony-after-rain`
- `blue-white-glasshouse-dream`

### 首页文案

主文案：

```txt
A quiet index of illustrated rooms, weather, and seasonal light.
```

辅助文案：

```txt
Misty Atelier is a fictional visual archive for quiet interiors, soft weather, seasonal stations, and distant fables.
```

### 验收标准

- 第一眼能看出品牌气质
- 首页不再只是 6 个卡片
- 图片、文字、展区入口形成层次
- 移动端首屏不拥挤
- `npm run build` 通过

## 9. 第六阶段：展区页优化

### 目标

让展区页像专题展，而不是分类页。

### 修改文件

- `src/app/exhibitions/[slug]/page.tsx`

### 改造内容

- 加展区 Hero
- 显示展区 `summary`
- 使用 `coverArtworkSlug`
- 增加 palette 氛围
- 作品网格使用 thumb 图片
- 底部增加 next exhibition

### 验收标准

- 每个展区都有策展语
- 每个展区视觉上有区分
- 6 个展区页都能生成
- `npm run build` 通过

## 10. 第七阶段：作品页优化

### 目标

让作品详情页更像画册单页。

### 修改文件

- `src/app/works/[slug]/page.tsx`

### 改造内容

- 保留大图沉浸展示
- 增加作品 description
- 增加 tags
- Recipe Notes 变成更结构化的面板
- 增加 Related Works

### 验收标准

- 作品页信息不再单薄
- Recipe Notes 不抢图片主体
- 相关作品能继续引导浏览
- 54 个作品页都能生成
- `npm run build` 通过

## 11. 最终质量检查

执行完以上阶段后检查：

```bash
npm run build
```

然后人工检查：

- 首页 `/`
- 6 个展区页
- 至少 10 个作品详情页
- 390px 手机宽度
- 1440px 桌面宽度

重点看：

- 中文是否正常显示
- 图片是否清晰
- 文字是否溢出
- 页面是否还有脚手架感
- 首页是否有策展入口感
- 移动端是否顺手

## 12. 本轮不做的内容

本轮优化不做：

- Archive 全量页
- 搜索和筛选
- CMS
- 用户收藏
- 图片下载
- 多语言切换
- 大型 shader
- 重型 GSAP 长滚动叙事
- 商业服务页

这些都等 V1 气质稳定后再做。

## 13. 推荐执行切入点

建议第一批实际改动只做四件事：

1. `layout.tsx` metadata 和 `README.md`
2. 新增 `src/lib` 查询层
3. 升级 `exhibitions.ts` 数据
4. 升级首页结构

这四件事完成后，项目的方向会明显从“原型”转向“作品集产品”。后续再补作品描述、展区页、作品页，会更顺。

