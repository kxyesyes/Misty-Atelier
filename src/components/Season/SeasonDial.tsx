"use client";

import React from "react";
import { useSeason, Season } from "./SeasonContext";
import { Play, Pause } from "lucide-react";

const SEASONS: { id: Season; label: string; color: string }[] = [
  { id: "spring", label: "春", color: "#81c784" },
  { id: "summer", label: "夏", color: "#ffd54f" },
  { id: "autumn", label: "秋", color: "#ffb74d" },
  { id: "winter", label: "冬", color: "#90caf9" },
];

export function SeasonDial() {
  const { season, setSeason, isAutoCycling, setIsAutoCycling, cycleProgress } = useSeason();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-4 rounded-full bg-background/80 p-2 shadow-sm backdrop-blur ring-1 ring-ink/10 transition-colors hover:ring-ink/20">
      <button
        onClick={() => setIsAutoCycling(!isAutoCycling)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-mist/50 text-ink transition-colors hover:bg-mist"
        title={isAutoCycling ? "Pause season cycle" : "Resume season cycle"}
      >
        {isAutoCycling ? <Pause size={14} /> : <Play size={14} />}
      </button>

      <div className="flex gap-2 pr-2">
        {SEASONS.map((s) => {
          const isActive = season === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                setSeason(s.id);
                setIsAutoCycling(false); // Pause on manual interaction
              }}
              className="relative flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors"
              style={{
                color: isActive ? s.color : "var(--color-rain)",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {s.label}
              {isActive && isAutoCycling && (
                <svg
                  className="absolute inset-0 h-full w-full -rotate-90"
                  viewBox="0 0 32 32"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="15"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="1.5"
                    strokeDasharray="94"
                    strokeDashoffset={94 - 94 * cycleProgress}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
