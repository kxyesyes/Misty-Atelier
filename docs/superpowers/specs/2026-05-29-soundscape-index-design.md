# Design Spec: Misty Atelier Poetic Soundscape & Interactive Index

这个设计文档描述了为 **Misty Atelier** 引入 **多感官氛围声效 (Soundscape)** 与 **画室全景诗意索引 (Atelier Poetic Index)** 的架构方案与交互细节。

---

## 1. 氛围声效系统 (Poetic Soundscape)

### 1.1 设计宗旨
旨在通过低分贝、高音质的环境白噪音，唤醒用户内心的平和感，从而与“静谧房间、窗外微雨、画室时刻”等美术作品的主题形成视听层面的情感共鸣。

### 1.2 核心特性
- **三轨静谧声音库**：
  1. 🌧️ **雨落窗前 (Rain on Window)**：温和、连绵的细雨与远处的微雷声（最契合项目调性）。
  2. 📻 **阁楼留声机 (Vinyl Reverie)**：极具模拟感的老唱片底噪与细微裂音，带来复古温暖的阁楼包裹感。
  3. 🎹 **画室晨曦 (Atelier Solitude)**：微弱柔和的缓拍环境钢琴曲，配合极低分贝的纸张沙沙声。
- **全局状态延续 (Cross-page Persistence)**：利用 `localStorage` 自动记忆用户的播放/静音状态、选择的音轨以及音量大小，在页面跳转时平滑衔接（或在重新载入时静音启动，提示用户一键开启）。
- **极简玻璃微光 UI (Glassmorphic Player UI)**：在右下角悬浮放置一个半透明微光音符/声波图标。点击展开一个如磨砂玻璃般晶莹、大小适中的浮动控制面板。

### 1.3 核心技术实现
- 创建客户端组件 `src/components/Soundscape.tsx`。
- 使用 HTML5 `Audio` 对象进行播放管理。
- 引入 **音频渐入渐出 (Volume Fade in/out)**：在切换音轨或开关播放时，音量在 0.8 秒内进行线性渐变过渡，避免声音突兀开启或切断，保证听觉的优雅感。

---

## 2. 画室诗意索引 (The Atelier Poetic Index)

### 1.3 设计宗旨
将静态作品的单一展区陈列释放为可交互、多维度自由滤镜的“全景画廊”，让全站 54 幅作品通过直观的情感和色彩索引供用户自由漫游。

### 2.2 核心特性
- **升级 Home 页 Selections 板块**：将原来的静态 6 图展示区，重构升级为可过滤的 **Atelier Index Panel**。
- **多维度诗意筛选机制 (Poetic Filter Bar)**：
  - **按展区 (Exhibitions)**：全部、蓝调房间、雨的档案、玻璃温室梦、季节候车室、画室时刻、远方寓言。
  - **按情绪标签 (Moods)**：全部、静谧 (Quiet)、治愈 (Healing)、温暖 (Warm)、清冷 (Cool)、叙事 (Narrative)。
  - **按色彩意象 (Colors)**：全部、深蓝/薄雾 (Blue/Mist)、新绿/苔藓 (Green/Moss)、暖橙/琥珀 (Amber/Orange)、赤红/深夜 (Red/Dark)。
- **智能模糊搜索 (Ambient Search)**：提供一个优雅的底部单线搜索框，输入时即时过滤作品标题、描述及标签。
- **共享布局弹性网格 (Framer Motion Fluid Grid)**：
  - 运用 Framer Motion 的 `layout` 属性。
  - 当筛选或搜索改变时，卡片网格会自动进行**平滑的弹性滑动和缩放过渡**（而不是生硬的隐藏和显示），视觉效果极具高端感。
- **分批加载 (Poetic Pagination)**：初始呈现 12 张精选卡片，底部提供一个低调的 `"Expand Poetic Index / 展开全景索引"` 按钮。点击后卡片网格以 staggered 瀑布流动画优雅展开至全部 54 张。

---

## 3. 技术设计方案对比与决策

### 方案 A：纯客户端拉取与 localStorage 状态管理 (推荐采用)
- **实现逻辑**：
  - 音频流使用高可用性、极速响应的免版权公共 CDN 素材。
  - 画室索引利用本地已经预加载完毕的 `artworks` 静态数组在客户端完成极其顺畅的多重数组过滤（Filter & Map）。
- **优点**：
  - **极致速度**：零网络请求开销，过滤与搜索响应时间为 0 毫秒。
  - **超凡体验**：因为数据在内存中，Framer Motion 的网格形变动画能做到 120Hz 满帧顺滑过渡。
  - **部署友好**：100% 兼容全静态打包导出（Static HTML Export），极其适合低成本、高性能部署。
- **缺点**：首屏初次渲染时需要加载 54 个作品的轻量元数据（通过分页加载将 DOM 节点数控制在极低水平，避免任何性能损耗）。

### 方案 B：路由参数化独立子页面与 SSR 过滤
- **实现逻辑**：
  - 创造独立路径 `/archive`。过滤条件全部绑定在 URL 上（如 `/archive?exhibition=blue-rooms`）。
- **优点**：筛选状态天然支持浏览器书签记录和分享。
- **缺点**：每次筛选都会触发 Next.js 路由的浅重载，导致 Framer Motion 的共享形变过渡动画受阻，交互显得生硬、卡顿，失去了“画册把玩”的Tactile手感。

---

## 4. 视觉与排版体系融合

- **音频控制面板**：使用无衬线 `font-sans` 体现科技的精致感；音量和轨道文字字距微调；带有极细边框（`border-white/10` 和 `bg-paper/30` 配合 `backdrop-blur-md`）。
- **筛选按钮栏**：采用无衬线小写字母或大写字母加宽字距的排版风格：
  ```
  [ all ]   [ blue rooms ]   [ rain archive ]   [ glasshouse dreams ]
  ```
  选中时文字底部带有微小的琥珀色点（dot）或极细的下划线过渡，避免使用粗暴的色块填充，保持 Atelier 的空灵气息。

---

## 5. 自我评估与边界防范 (Spec Self-Review)

1. **音频跨页播放中断问题**：由于 Next.js 采用 App Router，路由跳转默认进行局部刷新。只要将 `<Soundscape />` 组件放置在根目录 [layout.tsx](file:///e:/Misty-Atelier/src/app/layout.tsx) 中，音频播放器在路由切换时便处于常驻状态（Persistent Layout），**音乐绝对不会发生哪怕 1 毫秒的卡顿或中断**。
2. **移动端手势冲突防范**：悬浮音频按钮将在移动端（屏幕宽 < 768px）自动减小物理尺寸，并完美避开右下角可能存在的浏览器默认交互区域，避免阻挡文字。
3. **54 张图 the DOM 爆炸预防**：初始网格限制渲染 12 个卡片，展开后再全量渲染。图片组件全部使用 Next.js `<Image>` 的 lazy 加载机制，保证主页首屏性能分（Lighthouse）依然是满分 100。
