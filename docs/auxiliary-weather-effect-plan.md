# ❄️ 🌤️ Misty Atelier - 天气系统辅助计划书 (雪/星光/晴空)
*(Canvas 2D 与 CSS 高性能特效方案)*

## 1. 核心目标与愿景
作为对 `WebGL` 高端雨滴特效的互补，我们需要为【下雪/星光】与【晴天/白云】这类天气环境设计一套轻量、优雅且资源消耗极低的动态展示方案。
由于这四种特效不强求与背后的画作产生复杂的光学像素交互（折射/扭曲），而是追求**氛围的包裹感**（如下雪的空间纵深、白云缓慢飘过的惬意），所以采用 `Canvas 2D` 粒子系统与纯 `CSS/SVG` 组合是“完美、真实且克制”的最佳实践架构。

---

## 2. 技术栈选择
*   **【下雪 ❄️ / 星光 ✨】**：使用 HTML5 `Canvas API`（2D 渲染上下文）与 `requestAnimationFrame()` 驱动自定义粒子系统。
*   **【晴天 🌤️ / 白云 ☁️】**：使用原生 `SVG` 和纯 `CSS @keyframes`，结合我们原有的在 React 中控制的 `framer-motion` 淡入动画。

---

## 3. 实施步骤规划

### A 项：【下雪 ❄️ / 星光 ✨】—— 空间级 Canvas 2D 系统 (Snow & Starscape)
这两类特效的共同点是：需要在全屏范围内生成大量细小元素，且包含缓慢运动及闪烁逻辑。采用 Canvas 粒子体系即可。

#### 第一步：建立粒子基座 `CanvasParticleSystem`
1. 封装一个全局透明组件 `<ParticleOverlay />`。将其 `z-index` 设置为遮罩在背景和主内容之间（或内容之上但 `pointer-events: none` 防止阻挡点击）。
2. 初始化 2D Context，并自动监听屏幕 `resize` 事件并重新设置 Canvas 画布尺寸。

#### 第二步：粒子行为定义
1. **下雪算法 (Snowfall Analytics)**：
   - 生成 200 - 300 个白色粒子实体。
   - **参数属性**：`x`, `y` (位置)，`radius` (大小 0.5px - 3px，用来营造远近景深)，`speedY` (下坠速度)，`sway` (正弦波左右摇摆)。
   - **运动逻辑**：向着垂直负向匀速下降，叠加基于 Math.sin() 的 X 轴风向位移飘曳。超出底边时在顶边重新生成。
2. **星光/微尘算法 (Starlight/Dust)**：
   - 粒子数量相对稀疏（50 - 100个）。
   - **参数属性**：除位置与大小外，增加 `alpha` (透明度)、`pulseSpeed` (亮度脉冲速度)。
   - **运动逻辑**：几乎不产生坐标位移（或仅仅向上缓慢漂浮模拟灰尘），使用基于 `Math.sin(time)` 的公式控制透明度，制造柔和闪烁。可以使用淡淡的 `--color-amber` 色调用作主色彩。

---

### B 项：【晴天 🌤️ / 白云 ☁️】—— 纯 CSS 与 SVG 层系 (Clear Sky & Clouds)
因为云朵通常巨大、边缘模糊而且飘动极慢，用 Canvas 画消耗渲染不划算，利用 CSS 硬件加速最合适。

#### 第一步：云朵 SVG 与 CSS 组件 `<CloudOverlay />`
1. 引入 2 ~ 3 种不同形状但边缘极致虚化的半透明白云 SVG 资源。
2. 使用绝对定位将其放在页面顶部靠上的位置，同样设置 `pointer-events: none`。

#### 第二步：动态推移
1. 编写一段从 `transform: translateX(-100%)` 至 `transform: translateX(100vw)` 的持续 `120s` 至 `240s`（非常慢）的 `@keyframes` 动画。
2. 配置多层级的云层（利用不同透明度、大小及动画时间差），带来“近处云走得快，远处云走得慢”的视觉差。

#### 第三步：光影润色（God Rays / 丁达尔效应）
晴天不仅有云，重点是“光”。
1. 使用纯 CSS 线性渐变（Linear Gradient）建立几缕斜向的光柱 div。
2. 从右上向左下铺设，设置为极致柔软的 `--color-cream`，并使用 `mix-blend-mode: overlay` 或 `soft-light` 让它们极其微妙地掠过页面。当背景色是浅色或页面发生平移时，光束的质感将带来很强的高级沉浸感。

---

## 4. 智能感知分配系统
将这些辅助特效系统无缝整合进你的 Next.js 应用：

在诸如 `works/[slug]/page.tsx` 或统一控制的 `WeatherProvider` 中：
```tsx
const weather = extractWeatherFromTags(work);

return (
  <>
    {weather === "snow" && <SnowCanvasParticles />}
    {weather === "night" && <StarlightCanvasParticles />}
    {weather === "clear" && <GodRaysAndCloudsCSS />}
    {weather === "rain" && <WebGLRainGlass />} {/* 此为我们的顶点灯塔项目 */}
    
    <main>...</main>
  </>
)
```

## 5. 性能守则
所有的这些普通级天气依然恪守**最高的交互守则**：
1. **零交互屏蔽**：CSS 必须设置 `pointer-events-none` 防止点击被劫持。
2. **硬件加速**：CSS 云与光的运动仅用 `transform` 和 `opacity` 进行 `@keyframes` 动画（引发 GPU 渲染加速）。
3. **离开即销毁**：离开这幅画/页面时，触发组件的 `useEffect` 清理阶段，立即停下 `requestAnimationFrame` 以释放性能。