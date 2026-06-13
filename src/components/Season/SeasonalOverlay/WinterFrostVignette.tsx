"use client";

import React from "react";
import { motion } from "framer-motion";

export function WinterFrostVignette() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 5, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 15,
        boxShadow: "inset 0 0 150px rgba(230, 240, 255, 0.4), inset 0 0 50px rgba(200, 220, 240, 0.6)",
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.15 }}>
        <defs>
          <radialGradient id="frost" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="#ffffff" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#frost)" />
      </svg>
    </motion.div>
  );
}
