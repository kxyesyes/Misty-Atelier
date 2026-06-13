"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RainParticleOverlay } from "./RainParticleOverlay";
import { useWeather } from "./WeatherContext";

const RAIN_TYPES = ["rain", "rain-heavy", "mist"] as const;

export function WeatherOverlay() {
  const { active, type, intensity } = useWeather();
  const showRainLayer =
    active && RAIN_TYPES.includes(type as (typeof RAIN_TYPES)[number]);

  if (!showRainLayer) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`lightweight-${type}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <RainParticleOverlay
          intensity={intensity}
          type={type as Extract<typeof type, "mist" | "rain" | "rain-heavy">}
        />
      </motion.div>
    </AnimatePresence>
  );
}
