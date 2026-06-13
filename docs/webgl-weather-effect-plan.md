# 🌧️ Misty Atelier - 高级动态天气系统实施计划书
*(WebGL 雨滴折射与起雾特效)*

## 1. 核心目标与愿景
在 `Misty Atelier` （一个展示插画的静态艺术站点）中，引入 **WebGL Shader** 来实现行业顶级的“玻璃雨滴折射”与“雾气”特效。
当用户进入带有 `rain` 或 `mist` 等标签的画作或画展时，屏幕前端将叠加一层看不见的虚拟“玻璃”。水滴会在玻璃上滑落，并且**实时扭曲、折射背后的画作与网页元素**，同时伴随边缘柔和的雾化效果，营造出极致的“窗外视界”沉浸感。

---

## 2. 技术栈选择
*   **底层渲染引擎**：`three.js` (Web 3D 标准库)
*   **React 桥接层**：`@react-three/fiber` (将 Three.js 组件化，完美契合 Next.js)
*   **辅助工具**：`@react-three/drei` (提供现成的着色器材质、全屏覆盖等实用工具)
*   **核心核心算法**：GLSL Fragment Shader (编写自定义着色器代码)

---

## 3. 实施步骤规划

### 第一阶段：基础设施与环境搭建 (Infrastructure)
1. **安装依赖**：
   在项目中安装所需依赖 `npm install three @types/three @react-three/fiber @react-three/drei`。
2. **全局天气控制器 (Weather Provider)**：
   结合目前 Next.js App Router 的结构，在 `src/app/layout.tsx` 中引入一个全局控制组件，或者在需要的页面（如 `src/app/works/[slug]/page.tsx` 和首页）顶部绝对绝对定位一个 `canvas` 容器。由于需要折射背景，我们可能需要捕捉当前页面的截图或者直接把画作本身丢进 WebGL 渲染作为底图。
   *由于普通 HTML 无法被 WebGL 直接折射，我们的策略是将**当前展示的插画（Artwork.src）**作为纹理传入 Shader，在 Canvas 内进行带雨滴特效的复刻渲染，覆盖在原图上方。*

### 第二阶段：Shader 着色器编写 (Core Shader)
这一步是该特效的灵魂。需要新建一个 `RainyGlassShader.ts`。
1. **UV 坐标与噪点 (Noise & UVs)**：
   使用经典的 Simplex Noise 算法在屏幕空间生成随机分布的水滴基础形态。
2. **水滴运动学 (Drop Kinematics)**：
   利用传入的 `u_time`（时间变量），让某些特定大小的水滴在重力作用下向下形变滑落，并留下细微的水痕（Trail）。
3. **折射算法 (Refraction)**：
   提取水滴的法线纹理（Normal Map），在读取画作原图（Base Texture）时，对 UV 坐标进行偏移偏移（distortion），从而实现“画作在水滴中倒影/扭曲”的光学错觉。
4. **雾化融合 (Mist/Blur)**：
   在水滴之外的区域，通过多重重采样降低画作清晰度并叠加一层冷色调透明蒙版（如项目的 `--color-mist` 或 `--color-rain`），再现起雾的玻璃。

### 第三阶段：React 组件化 `<WeatherOverlay />`
1. 封装一个独立的组件，包含 `Canvas`。
2. 暴露 `intensity` (雨量大小)、`mist` (雾气浓度)、`bgTexture` (画作纹理路径) 等 props。
3. 加入平滑的入场/退场动画。天气切换时，利用 `framer-motion` 将 WebGL Canvas 淡入淡出。

### 第四阶段：数据抓取与智能触发 (Data Binding)
1. 修改 `src/data/artworks.ts` 和相关逻辑。
2. 在渲染前判断：
   - 含有 `rain` 标签的画作 -> 触发 `<WeatherOverlay type="rain" />`。
   - 属于 `rain-archive` 展览 -> 触发大面积连绵细雨。
   - 含有 `mist` 标签 -> 触发雾气占据主导着色器。

### 第五阶段：性能优化与优雅降级 (Optimization)
为了确保浏览器的绝对流畅：
1. **DPR 限制**：将 `@react-three/fiber` 的分辨率比严格限制在 `dpr={[1, 1.5]}` 以内，防止 Retina 高分屏因像素过多导致卡顿。
2. **按需渲染 (Render on Demand)**：确保 Shader 仅在屏幕视口内或相关元素上激活。不在“雨天”主题时，彻底销毁 `WebGLRenderer` 和内存上下文。
3. **性能降级**：监听系统的 `prefers-reduced-motion` 或检测到设备帧率过低时，自动关闭 WebGL，回退到普通无特效的状态展示插画。

---

## 4. 预期交付成果
* 用户点开《Balcony After Rain》等画作时，不仅有淡入动画。
* 画作上方自动覆盖一层乱真的淋雨玻璃，雨滴顺着插画滑落，光影产生物理法则下的折射。
* 滚动或者切换非雨天画作时，特效自然溶解。
* 网站正式突破单纯的“展示”，演变为立体的“环境交互存档”。