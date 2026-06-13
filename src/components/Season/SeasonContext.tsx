"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Season = "spring" | "summer" | "autumn" | "winter";

interface SeasonContextValue {
  season: Season;
  setSeason: (season: Season) => void;
  isAutoCycling: boolean;
  setIsAutoCycling: (auto: boolean) => void;
  cycleProgress: number; // 0 to 1 progress to next season
}

const SEASON_ORDER: Season[] = ["spring", "summer", "autumn", "winter"];
const CYCLE_DURATION_MS = 60000; // 60 seconds per season for demo purposes

const SeasonContext = createContext<SeasonContextValue | undefined>(undefined);

export function SeasonProvider({ children }: { children: React.ReactNode }) {
  const [season, setSeasonState] = useState<Season>("spring");
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const [cycleProgress, setCycleProgress] = useState(0);

  const setSeason = useCallback((newSeason: Season) => {
    setSeasonState(newSeason);
    setCycleProgress(0); // Reset progress on manual change
    // Update body data attribute for CSS targeting
    if (typeof document !== "undefined") {
      document.body.setAttribute("data-season", newSeason);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.setAttribute("data-season", season);
    }
  }, [season]); // Sync body attribute whenever season changes

  useEffect(() => {
    if (!isAutoCycling) return;

    let startTime = Date.now();
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / CYCLE_DURATION_MS, 1);
      
      setCycleProgress(progress);

      if (elapsed >= CYCLE_DURATION_MS) {
        setSeasonState(prev => {
          const currentIndex = SEASON_ORDER.indexOf(prev);
          const nextIndex = (currentIndex + 1) % SEASON_ORDER.length;
          const nextSeason = SEASON_ORDER[nextIndex];
          if (typeof document !== "undefined") {
            document.body.setAttribute("data-season", nextSeason);
          }
          return nextSeason;
        });
        startTime = Date.now();
        setCycleProgress(0);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoCycling]);

  return (
    <SeasonContext.Provider value={{ season, setSeason, isAutoCycling, setIsAutoCycling, cycleProgress }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const context = useContext(SeasonContext);
  if (context === undefined) {
    throw new Error("useSeason must be used within a SeasonProvider");
  }
  return context;
}
