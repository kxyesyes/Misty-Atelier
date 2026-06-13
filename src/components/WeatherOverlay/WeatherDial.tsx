"use client";

import { CloudFog, CloudRain, Snowflake, Sparkles, Sun } from "lucide-react";
import { getWeatherProfile, type WeatherKind } from "@/lib/weather-engine";
import { useWeather } from "./WeatherContext";

const OPTIONS: Array<{
  type: WeatherKind;
  label: string;
  icon: typeof CloudRain;
}> = [
  { type: "rain", label: "Rain", icon: CloudRain },
  { type: "snow", label: "Snow", icon: Snowflake },
  { type: "mist", label: "Mist", icon: CloudFog },
  { type: "starlight", label: "Starlight", icon: Sparkles },
  { type: "clear", label: "Clear", icon: Sun },
];

export function WeatherDial() {
  const { type, setWeather } = useWeather();

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 rounded-full border border-ink/10 bg-paper/75 p-1.5 shadow-sm backdrop-blur-md sm:right-6">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = type === option.type;

        return (
          <button
            key={option.type}
            type="button"
            title={option.label}
            aria-label={`Preview ${option.label}`}
            aria-pressed={active}
            onClick={() => setWeather(getWeatherProfile(option.type))}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              active
                ? "bg-ink text-paper"
                : "text-rain hover:bg-mist/60 hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
