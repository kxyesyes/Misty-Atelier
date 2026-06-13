"use client";

import { Pause, Play } from "lucide-react";
import { type Season, useSeason } from "./SeasonContext";

const SEASONS: { id: Season; label: string; color: string }[] = [
  { id: "spring", label: "春", color: "#6f806b" },
  { id: "summer", label: "夏", color: "#8a7a42" },
  { id: "autumn", label: "秋", color: "#9b6746" },
  { id: "winter", label: "冬", color: "#667176" },
];

export function SeasonDial() {
  const { season, setSeason, isAutoCycling, setIsAutoCycling, cycleProgress } = useSeason();

  return (
    <div className="ink-panel fixed bottom-6 left-6 z-50 flex items-center gap-3 p-2 transition-colors">
      <button
        onClick={() => setIsAutoCycling(!isAutoCycling)}
        className="flex h-8 w-8 items-center justify-center border border-ink/10 bg-mist/40 text-ink transition-colors hover:border-cinnabar hover:bg-mist"
        title={isAutoCycling ? "Pause season cycle" : "Resume season cycle"}
      >
        {isAutoCycling ? <Pause size={14} /> : <Play size={14} />}
      </button>

      <div className="flex gap-1 pr-1">
        {SEASONS.map((seasonOption) => {
          const isActive = season === seasonOption.id;
          return (
            <button
              key={seasonOption.id}
              onClick={() => {
                setSeason(seasonOption.id);
                setIsAutoCycling(false);
              }}
              className="relative flex h-8 w-8 items-center justify-center border border-transparent text-xs transition-colors hover:border-cinnabar"
              style={{
                color: isActive ? seasonOption.color : "var(--color-rain)",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {seasonOption.label}
              {isActive && isAutoCycling && (
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke={seasonOption.color}
                    strokeWidth="1.5"
                    strokeDasharray="88"
                    strokeDashoffset={88 - 88 * cycleProgress}
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
