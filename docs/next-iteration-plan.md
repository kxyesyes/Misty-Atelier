# Misty Atelier 下一阶段改造计划

日期：2026-05-29
状态：计划书，不开始代码实现

## 1. 当前项目状态

项目已经从空文件夹推进成一个可运行的 Next.js 原型。

当前已有：

- Next.js + TypeScript + Tailwind 项目结构
- Home 页面
- Exhibition Detail 页面
- Work Detail 页面
- 6 个展区数据
- 54 张作品数据
- 54 张 full 图片和 54 张 thumb 图片
- 5 条 Recipe Notes
- 基础 FadeIn 动效组件

当前构建状态：

- `npm run build` 已通过
- 生成 65 个静态页面

这说明项目基础是健康的。下一步不应该急着扩功能，而应该把它从“可运行原型”升级成“符合 Misty Atelier 气质的第一版作品集”。

## 2. 下一阶段目标

下一阶段目标：

> 把当前普通图片索引原型，改造成一个有策展感、视觉统一、数据可扩展的 Misty Atelier V1。

重点不是增加更多页面，而是提升三件事：

1. 首页要像线上美术馆入口。
2. 数据要支撑策展叙事。
3. 视觉系统要脱离默认脚手架气质。

## 3. 改造优先级

### Priority 1: 重做首页

当前首页是简单的展区网格，还没有体现“中密度策展墙”。

目标首页结构：

1. 顶部导航：Misty Atelier、Exhibitions、Recipe Notes、Contact
2. 首屏品牌区：项目名、策展短句、3 张代表图
3. 当前展区：6 个主展区卡片
4. 精选作品横向或错落展示
5. Studio Note：一句简短创作陈述
6. Footer：轻量联系入口

首页应该表达：

- 这是一个视觉美术馆，不是普通图库。
- 作品是主角。
- 分类是策展，不是文件夹。

### Priority 2: 建立视觉系统

当前全局样式仍接近 create-next-app 默认状态。

需要新增或调整：

- 纸感浅色背景
- `ink / paper / mist / cream / amber / rain` 色彩变量
- 克制的标题、正文、标签层级
- 6-8px 卡片圆角
- 更像画册的间距系统
- 移除默认黑白系统主题带来的割裂感

视觉原则：

- 不使用强烈渐变作为主视觉。
- 不做 SaaS 风格圆角卡片堆叠。
- 色彩来自作品，而不是模板色板。
- 留白要服务图片呼吸感。

### Priority 3: 升级数据模型

当前 `artworks.ts` 和 `exhibitions.ts` 足够跑页面，但还不够支撑策展。

建议给 Exhibition 增加：

- `summary`
- `coverArtworkSlug`
- `palette`
- `sortOrder`
- `featured`

建议给 Artwork 增加：

- `description`
- `tags`
- `colorTags`
- `moodTags`
- `sceneTags`
- `featured`
- `recipeNotesId`

这样页面可以从“图片列表”升级成“策展页面”。

### Priority 4: 改造展区页

当前展区页能展示作品，但缺少展区气质。

目标结构：

1. Back link
2. 展区 Hero：英文名、中文名、策展短句、封面图
3. 展区氛围信息：颜色、关键词、场景
4. 作品网格
5. 下一展区入口

展区页要像一个小型专题展，而不是普通分类页。

### Priority 5: 改造作品详情页

当前作品页图片展示已经成立，但信息偏少。

目标结构：

1. 大图沉浸展示
2. 中英双标题
3. 所属展区
4. 作品描述
5. 标签
6. Recipe Notes 折叠模块
7. 相关作品

作品详情页要保持克制，不要变成教程页。

### Priority 6: 修正基础项目文档和 metadata

当前还有 create-next-app 默认痕迹。

需要修改：

- `layout.tsx` metadata
- `README.md`
- `docs/project-plan.md` 中的下一步说明

metadata 建议：

- Title: `Misty Atelier`
- Description: `A quiet index of illustrated rooms, weather, and seasonal light.`

## 4. 建议执行顺序

### Step 1: 文档和数据准备

- 确认 54 张作品暂时全部进入 V1
- 给 6 个展区补 `summary` 和 `palette`
- 给 54 张作品补基础描述和标签
- 确认 5 个 Recipe Notes 的展示内容

### Step 2: 视觉系统改造

- 修改全局 CSS
- 建立色彩变量
- 建立基础排版和间距
- 确认桌面和移动端视觉密度

### Step 3: 首页重做

- 重写 Home 页面结构
- 使用 3 张首屏代表图
- 展示 6 个展区卡片
- 增加 Studio Note 和 Footer
- 保留中等动效

### Step 4: 展区页改造

- 增加展区 Hero
- 使用展区封面图
- 增加策展短句
- 优化作品网格

### Step 5: 作品页改造

- 增加作品描述和标签
- 优化 Recipe Notes
- 增加相关作品
- 检查大图展示效果

### Step 6: 质量检查

- 运行 `npm run build`
- 检查首页
- 检查 6 个展区页
- 抽查 10 个作品详情页
- 检查移动端文字是否溢出
- 检查图片加载是否稳定

## 5. 不建议现在做的事

下一阶段暂不建议做：

- CMS 后台
- 全量 Archive 筛选页
- 收藏/点赞功能
- 下载壁纸功能
- 大型 shader 背景
- 复杂 GSAP 长页面叙事
- 商业服务页

这些都可以后续加，但现在会分散第一版的重点。

## 6. 成功标准

下一阶段完成后，项目应该达到：

- 首页第一眼像一个有气质的线上美术馆。
- 6 个展区有清楚的策展差异。
- 中文和英文标题都自然出现。
- 作品详情页能让图片充分展示。
- Recipe Notes 有方法论价值，但不抢作品主体。
- 整站不再像 create-next-app 脚手架。
- 构建通过，移动端可读。

## 7. 推荐下一步

推荐下一步先做：

> 数据模型升级 + 视觉系统改造 + 首页重做。

这是最小但最关键的一组改动。完成后，Misty Atelier 的气质会立起来，后面的展区页和作品页改造也会有明确的视觉依据。

