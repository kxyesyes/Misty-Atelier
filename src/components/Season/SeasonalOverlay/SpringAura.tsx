"use client";

import React from "react";
import { motion } from "framer-motion";

export function SpringAura() {
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
        zIndex: 15, // Below the aux weather but above background
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="spring-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="80" />
          </filter>
        </defs>
        <g filter="url(#spring-blur)" opacity="0.4">
          <circle cx="10%" cy="10%" r="25%" fill="#e0f2f1" />
          <circle cx="90%" cy="80%" r="30%" fill="#fce4ec" />
          <circle cx="80%" cy="10%" r="20%" fill="#e8f5e9" />
          <circle cx="20%" cy="90%" r="25%" fill="#f3e5f5" />
        </g>
      </svg>
    </motion.div>
  );
}
