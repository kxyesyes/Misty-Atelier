"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWeather } from "./WeatherContext";
import { CloudOverlay } from "./CloudOverlay";
import { SnowParticleOverlay } from "./SnowParticleOverlay";
import { StarlightParticleOverlay } from "./StarlightParticleOverlay";

const FADE = { duration: 1.4, ease: "easeInOut" } as const;

export function AuxWeatherOverlay() {
  const { type, intensity, active } = useWeather();

  const showAux = active && ["snow", "starlight", "clear"].includes(type);

  return (
    <AnimatePresence>
      {showAux && (
        <motion.div
          key={type}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={FADE}
          style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}
        >
          {type === "snow" && <SnowParticleOverlay intensity={intensity} />}
          {type === "starlight" && <StarlightParticleOverlay intensity={intensity} />}
          {type === "clear" && <CloudOverlay />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
