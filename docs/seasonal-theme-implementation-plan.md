# 🌸🌻🍂❄️ Misty Atelier - 四季主题美学（感知设计）自动循环计划

本计划旨在将《Misty Atelier》的“四季更迭”理念转化为具体的代码实现。由于网站设定为了一个“自动循环的虚拟时间生态”，我们将利用定时器与平滑的 CSS 缓动过渡，让用户在浏览画廊时，不知不觉中经历从春的温润到冬的清冷。

---

## 第一阶段：自动流转底层架构 (Auto-Cycling Architecture)
目标：搭建一个平滑循环的、像生命体一样的状态机。

1. **核心控制器 `<SeasonProvider>`**
   - 创建 React Context `SeasonContext`。
   - 内部维护一个按顺序排列的数组 `["spring", "summer", "autumn", "winter"]`。
   - 使用 `useEffect` 设置一个 `setInterval` (例如每隔 3 分钟，或为了展示效果设为每隔 30 秒)，自动将状态推向下一个季节。
   - 自动在应用的 `<body>` 标签注入当前状态，如 `<body data-season="autumn">`。

2. **史诗级的长渐变 CSS (Epic Crossfade)**
   - 这是“循环切换”高级与否则的分水岭。我们绝不能让颜色“啪”地一下闪切。
   - 在 `globals.css` 中为 `:root` 和 `body` 加上巨长的过渡时间：`transition: background-color 5s ease-in-out, color 3s ease;`。
   - 所有 `--bg-color`, `--text-color`, `--accent-color`, `--grain-opacity` 将在这个缓慢的时间跨度里像流水一样溶解并重组。

---

## 第二阶段：四季独占特效池 (The Seasonal Overlays)
虽然背景色在缓慢切换，天空、光线、排版间距等特效也会根据循环到的季节自动叠加或销毁。

### 🌸 春 (Spring) - “微光与呼吸”
- 当切到 `spring`，通过 Framer Motion 将 `duration` 全局拉长。
- 触发 `<SpringAura />`：边缘淡青色与粉白色极度模糊的 SVG 渐变层顺着 5 秒的全局过渡缓慢浮现。

### 🌻 夏 (Summer) - “浮尘斜阳 (Dust & Sunrays)”
- 当循环到 `summer`，屏幕背景变刺眼，文字变极深的墨色。
- 触发 `<SummerSunRays />` 和 `<DustCanvas />` 组件淡入。一条带漂浮细尘的光晕带接管屏幕的视觉重心。

### 🍂 秋 (Autumn) - “纸张肌理强化 (Amber Grain)”
- 循环到 `autumn`，背景切换掉冷白与明黄，进入浑厚的琥珀色与牛皮纸色调。
- 秋天不增加外在挂件特效，而是加重底层的噪点透明度 (`--grain-opacity: 0.15`)。
- 当处于秋季时，全局的 Hover 特效被替换为独特的“瞬间泛黄褪色再变鲜艳”的神奇过渡机制。

### ❄️ 冬 (Winter) - “边界霜冷 (Frost Vignette)”
- 循环到最后 `winter`，所有暖色被剥离殆尽，只剩极其克制的灰、冷白和深灰。
- `<WinterFrostVignette />`：沿屏幕四周渗出一种向内部延伸的冰霜遮盖（Inset Shadow 叠加）。排布间距随之变大，仿佛画作自身在寒冷中收缩。

---

## 第三阶段：组件平滑销毁与生成 (Smooth Mount / Unmount)
目标：解决 React 组件在卸载时带来的闪烁问题。

- **AnimatePresence 托底**：春夏秋冬专属的雨点/浮尘/光晕组件，在 `<SeasonProvider>` 中使用 `<AnimatePresence mode="crossfade">` 包裹。
- 当定时器将 `summer` 改成 `autumn` 时，夏天的光尘不会直接消失，而是经过 `opacity 1 -> 0` 的 3 秒渐进淡出，与此同时秋天的纸质感和色温正在从底向上泛起。两者的交融将是一副绝美的视觉奇观。

---

## 第四阶段：可选的干预机制 (Manual Overrides)
虽然这是一个自动循环系统，但我们得保留防线策略：
1. **画展强制锁定**（可选）：比如用户专门点进了属于 `winter` 的特展，定时器暂停，强行渲染冬天；离开画展后，时间流又重新接管运转。
2. **“时光拨盘 (Time Dial)” 控制**：在网站底角放置一个迷你、精致的“四季罗盘”。它的指针会随着自动循环缓慢旋转；但在此同时，用户也可以亲自用鼠标拨动指针，强制且优雅地把网站色彩和气氛拨回他们偏爱的那个季节。