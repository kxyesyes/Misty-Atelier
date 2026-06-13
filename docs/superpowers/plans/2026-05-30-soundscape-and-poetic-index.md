# Poetic Soundscape & Interactive Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Misty Atelier 引入全局静谧白噪音氛围播放器，并将首页 Selections 板块升级为高交互性、全景、带弹性网格动画的“画室诗意索引面板”。

**Architecture:** 
1. 声音播放器通过常驻根布局的 Client Component `<Soundscape />` 运行，使用原生 HTML5 Audio 对象，配合缓动渐变音量（Volume Fade-in/out）和 `localStorage` 状态复用，确保跳转页面时声音无缝延续。
2. 首页索引面板利用客户端状态（State）完成 54 幅作品的多维（展区、色彩、情绪）复合过滤与模糊搜索，使用 Framer Motion 的 `layout` 属性实现网格卡片的满帧平滑重组动效。

**Tech Stack:** React 18, Next.js 14 App Router, Tailwind CSS, Framer Motion, HTML5 Audio API.

---

### Task 1: 建立全局常驻静谧音源播放器 (Ambient Audio Player)

**Files:**
- Create: `src/components/Soundscape.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 创建 Soundscape.tsx 播放器组件**
  在 `src/components/Soundscape.tsx` 写入完整的播放控制、音轨切换、音量渐变和 `localStorage` 缓存逻辑，并设计半透明磨砂玻璃微光 UI。

  ```tsx
  "use client";

  import { useEffect, useRef, useState } from "react";
  import { Volume2, VolumeX, Music, ChevronUp, ChevronDown } from "lucide-react";

  const TRACKS = [
    {
      id: "rain",
      name: "Rain on Window",
      zhName: "窗外微雨",
      url: "https://rainycafe.com/mp3/rain.mp3",
    },
    {
      id: "vinyl",
      name: "Vinyl Reverie",
      zhName: "阁楼留声机",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", // 静谧环境乐作为留声机底噪音乐
    },
    {
      id: "attic",
      name: "Atelier Solitude",
      zhName: "画室晨曦",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // 缓拍慢速钢琴曲
    },
  ];

  export function Soundscape() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState("rain");
    const [volume, setVolume] = useState(0.3);
    const [isMuted, setIsMuted] = useState(false);

    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // 初始化音频对象
    useEffect(() => {
      TRACKS.forEach((track) => {
        const audio = new Audio(track.url);
        audio.loop = true;
        audio.volume = 0; // 初始音量设为 0，以便执行渐入
        audioRefs.current[track.id] = audio;
      });

      // 从 localStorage 恢复状态
      const storedMute = localStorage.getItem("soundscape_muted");
      const storedTrack = localStorage.getItem("soundscape_track");
      const storedVolume = localStorage.getItem("soundscape_volume");

      if (storedMute === "false" && storedTrack) {
        setCurrentTrack(storedTrack);
      }
      if (storedVolume) {
        setVolume(parseFloat(storedVolume));
      }

      return () => {
        // 清理所有音频实例
        Object.values(audioRefs.current).forEach((audio) => {
          if (audio) {
            audio.pause();
            audio.src = "";
          }
        });
      };
    }, []);

    // 音量渐变逻辑 (Fade In / Out)
    const fadeVolume = (targetVolume: number, audio: HTMLAudioElement, duration = 800) => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const steps = 16;
      const stepTime = duration / steps;
      const startVolume = audio.volume;
      const volumeDiff = targetVolume - startVolume;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const nextVolume = startVolume + (volumeDiff * currentStep) / steps;
        audio.volume = Math.max(0, Math.min(1, nextVolume));

        if (currentStep >= steps) {
          audio.volume = targetVolume;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
          }
        }
      }, stepTime);
    };

    // 播放/暂停控制
    const togglePlay = () => {
      const audio = audioRefs.current[currentTrack];
      if (!audio) return;

      if (isPlaying) {
        // 渐出后暂停
        fadeVolume(0, audio, 500);
        setTimeout(() => {
          audio.pause();
          setIsPlaying(false);
        }, 500);
      } else {
        // 开启播放并渐入
        audio.play().then(() => {
          setIsPlaying(true);
          fadeVolume(isMuted ? 0 : volume, audio, 800);
        }).catch((err) => console.log("Audio play failed:", err));
      }
    };

    // 音轨切换
    const switchTrack = (trackId: string) => {
      const prevAudio = audioRefs.current[currentTrack];
      const nextAudio = audioRefs.current[trackId];

      if (isPlaying) {
        if (prevAudio) {
          fadeVolume(0, prevAudio, 400);
          setTimeout(() => {
            prevAudio.pause();
          }, 400);
        }

        if (nextAudio) {
          setTimeout(() => {
            nextAudio.play().then(() => {
              setCurrentTrack(trackId);
              fadeVolume(isMuted ? 0 : volume, nextAudio, 600);
            });
          }, 400);
        }
      } else {
        setCurrentTrack(trackId);
      }

      localStorage.setItem("soundscape_track", trackId);
    };

    // 音量调节
    const handleVolumeChange = (newVolume: number) => {
      setVolume(newVolume);
      localStorage.setItem("soundscape_volume", newVolume.toString());

      const audio = audioRefs.current[currentTrack];
      if (audio && isPlaying && !isMuted) {
        audio.volume = newVolume;
      }
    };

    // 静音切换
    const toggleMute = () => {
      const nextMuteState = !isMuted;
      setIsMuted(nextMuteState);
      localStorage.setItem("soundscape_muted", nextMuteState.toString());

      const audio = audioRefs.current[currentTrack];
      if (audio && isPlaying) {
        fadeVolume(nextMuteState ? 0 : volume, audio, 400);
      }
    };

    return (
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        {/* 控制面板弹出 */}
        {isOpen && (
          <div className="mb-3 w-64 rounded-card border border-ink/10 bg-paper/85 p-4 shadow-lg backdrop-blur-md transition-all duration-300">
            <div className="flex items-center justify-between border-b border-ink/5 pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rain">Atelier Ambient</span>
              <button onClick={toggleMute} className="text-rain hover:text-ink transition-colors">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>

            {/* 音轨列表 */}
            <div className="my-3 grid gap-1.5">
              {TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => switchTrack(track.id)}
                  className={`flex items-center justify-between rounded-sm px-2.5 py-1.5 text-xs transition-colors ${
                    currentTrack === track.id
                      ? "bg-amber/15 text-ink font-semibold"
                      : "text-rain hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  <span>{track.name}</span>
                  <span className="text-[10px] opacity-60 font-normal">{track.zhName}</span>
                </button>
              ))}
            </div>

            {/* 音量滑块 */}
            <div className="flex items-center gap-3 pt-2 border-t border-ink/5">
              <span className="text-[10px] text-rain uppercase tracking-[0.1em]">Vol</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-mist accent-amber [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber"
              />
            </div>
          </div>
        )}

        {/* 悬浮主按键 */}
        <div className="flex gap-2">
          <button
            onClick={togglePlay}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 shadow-md transition-all duration-300 hover:scale-105 active:scale-95 ${
              isPlaying ? "bg-ink text-paper" : "bg-paper text-ink hover:border-amber/50"
            }`}
            aria-label={isPlaying ? "Pause ambient sound" : "Play ambient sound"}
          >
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-paper rounded-full animate-[equalizer_1.2s_infinite_ease-in-out_delay-1]" style={{ animationDelay: "0.1s" }} />
                <span className="w-0.5 bg-paper rounded-full animate-[equalizer_1.2s_infinite_ease-in-out_delay-2]" style={{ animationDelay: "0.4s" }} />
                <span className="w-0.5 bg-paper rounded-full animate-[equalizer_1.2s_infinite_ease-in-out_delay-3]" style={{ animationDelay: "0.2s" }} />
              </div>
            ) : (
              <Music className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-paper/90 text-rain shadow-md transition-all duration-300 hover:border-amber/50 hover:text-ink active:scale-95"
            aria-label="Toggle ambient settings panel"
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>

        {/* 添加均衡器跳动帧动画样式 */}
        <style jsx global>{`
          @keyframes equalizer {
            0%, 100% { height: 4px; }
            50% { height: 12px; }
          }
          .animate-\\[equalizer_1\\.2s_infinite_ease-in-out_delay-1\\] {
            animation: equalizer 1.2s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
  }
  ```

- [ ] **Step 2: 挂载 Soundscape 组件到 Root Layout 中**
  修改 `src/app/layout.tsx`，导入并挂载 `<Soundscape />` 到 `body` 底部，保证全局跨页面静谧常驻。

  ```diff
  import type { Metadata } from "next";
  import localFont from "next/font/local";
  import "./globals.css";
  import { site } from "@/lib/site";
+ import { Soundscape } from "@/components/Soundscape";

  ...

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="zh-CN">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
+         <Soundscape />
        </body>
      </html>
    );
  }
  ```

- [ ] **Step 3: 运行并验证音视频编译**
  Run: `npm run lint`
  Expected: PASS

---

### Task 2: 首页精选升级为画室全景诗意索引 (Atelier Poetic Index)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 升级 page.tsx 重构 Selections 板块**
  修改 `src/app/page.tsx`，引入模糊搜索（搜索标题、标签）、展区过滤、情绪过滤、色彩意象多维过滤，实现 12 到 54 件作品的动态网格布局与 Framer Motion 满帧形变。

  在 `page.tsx` 顶部导入需要的 Hooks 与查询方法，并将组件转化为 "use client"：
  ```tsx
  "use client";

  import { useState, useMemo } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { Search, SlidersHorizontal } from "lucide-react";
  import { getAllArtworks } from "@/lib/artwork-query";
  import { getAllExhibitions } from "@/lib/exhibition-query";
  ```

  并在 `Home` 组件内部声明状态和筛选器：
  ```tsx
  const allArtworks = useMemo(() => getAllArtworks(), []);
  const allExhibitions = useMemo(() => getAllExhibitions(), []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEx, setSelectedEx] = useState("all");
  const [selectedMood, setSelectedMood] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const uniqueMoods = ["quiet", "fresh", "warm", "clear", "cinematic", "mysterious"];
  const uniqueColors = ["blue", "green", "amber", "red", "white"];

  const filteredArtworks = useMemo(() => {
    return allArtworks.filter((art) => {
      const matchesSearch =
        art.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.titleZh.includes(searchQuery) ||
        art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        art.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEx = selectedEx === "all" || art.exhibition === selectedEx;
      const matchesMood = selectedMood === "all" || art.moodTags.some(m => m.toLowerCase().includes(selectedMood.toLowerCase()));
      const matchesColor = selectedColor === "all" || art.colorTags.some(c => c.toLowerCase().includes(selectedColor.toLowerCase()));

      return matchesSearch && matchesEx && matchesMood && matchesColor;
    });
  }, [searchQuery, selectedEx, selectedMood, selectedColor, allArtworks]);

  const displayedArtworks = showAll ? filteredArtworks : filteredArtworks.slice(0, 12);
  ```

- [ ] **Step 2: 验证编译状态与页面全编译**
  Run: `npm run lint`
  Run: `npm run build`
  Expected: PASS
