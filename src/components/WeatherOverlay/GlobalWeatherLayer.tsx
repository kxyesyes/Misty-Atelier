"use client";

import { AuxWeatherOverlay } from "./AuxWeatherOverlay";
import { WeatherOverlay } from "./WeatherOverlay";

export function GlobalWeatherLayer() {
  return (
    <>
      <WeatherOverlay />
      <AuxWeatherOverlay />
    </>
  );
}
