"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { useSeason } from "../SeasonContext";
import { AutumnLeavesOverlay } from "./AutumnLeavesOverlay";
import { SpringAura } from "./SpringAura";
import { SummerSunRays } from "./SummerSunRays";
import { WinterFrostVignette } from "./WinterFrostVignette";

export function SeasonalDispatcher() {
  const { season } = useSeason();

  return (
    <AnimatePresence>
      {season === "spring" && <SpringAura key="spring" />}
      {season === "summer" && <SummerSunRays key="summer" />}
      {season === "autumn" && <AutumnLeavesOverlay key="autumn" />}
      {season === "winter" && <WinterFrostVignette key="winter" />}
    </AnimatePresence>
  );
}
