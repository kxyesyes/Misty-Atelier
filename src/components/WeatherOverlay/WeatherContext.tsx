"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSeason } from "@/components/Season";
import {
  getNextWeatherDelayMs,
  getWeatherProfile,
  pickWeatherForSeason,
  type WeatherKind,
} from "@/lib/weather-engine";

export type WeatherType = WeatherKind | "none";

export interface WeatherState {
  type: WeatherType;
  intensity: number;
  mistLevel: number;
  active: boolean;
}

interface WeatherContextValue extends WeatherState {
  setWeather: (state: Partial<WeatherState>) => void;
  clearWeather: () => void;
}

const DEFAULT_STATE: WeatherState = {
  type: "clear",
  intensity: 0.48,
  mistLevel: 0,
  active: true,
};

const WeatherContext = createContext<WeatherContextValue>({
  ...DEFAULT_STATE,
  setWeather: () => {},
  clearWeather: () => {},
});

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const { season } = useSeason();
  const [state, setState] = useState<WeatherState>(DEFAULT_STATE);

  const setWeather = useCallback((patch: Partial<WeatherState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearWeather = useCallback(() => {
    setState({ type: "none", intensity: 0, mistLevel: 0, active: false });
  }, []);

  useEffect(() => {
    let timer: number | undefined;

    const rollWeather = () => {
      const nextType = pickWeatherForSeason(season);
      setState(getWeatherProfile(nextType));
      timer = window.setTimeout(rollWeather, getNextWeatherDelayMs());
    };

    rollWeather();

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [season]);

  useEffect(() => {
    document.body.setAttribute("data-weather", state.type);
  }, [state.type]);

  const value = useMemo<WeatherContextValue>(
    () => ({ ...state, setWeather, clearWeather }),
    [state, setWeather, clearWeather]
  );

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
