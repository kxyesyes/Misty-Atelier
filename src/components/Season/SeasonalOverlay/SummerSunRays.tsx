"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function DustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    interface Dust {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      pulseSpeed: number;
      pulseOffset: number;
    }

    const particles: Dust[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.5 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.2 + 0.1, // slightly drifting right
      vy: (Math.random() - 0.5) * 0.2 - 0.1, // slightly drifting up
      alpha: 0.1 + Math.random() * 0.4,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", onResize);

    let time = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      time++;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x > w + 10) p.x = -10;
        if (p.x < -10) p.x = w + 10;
        if (p.y > h + 10) p.y = -10;
        if (p.y < -10) p.y = h + 10;

        const currentAlpha = p.alpha * (0.5 + 0.5 * Math.sin(time * p.pulseSpeed + p.pulseOffset));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 180, ${currentAlpha.toFixed(2)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

export function SummerSunRays() {
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
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "20%",
          width: "120%",
          height: "120%",
          background: "linear-gradient(135deg, rgba(255, 250, 230, 0.4) 0%, rgba(255, 250, 230, 0) 50%)",
          transform: "rotate(-15deg)",
          transformOrigin: "top left",
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "40%",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(255, 240, 200, 0.25) 0%, rgba(255, 240, 200, 0) 60%)",
          transform: "rotate(-25deg)",
          transformOrigin: "top left",
          mixBlendMode: "overlay",
        }}
      />
      <DustCanvas />
    </motion.div>
  );
}
