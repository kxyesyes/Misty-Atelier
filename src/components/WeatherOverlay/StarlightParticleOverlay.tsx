"use client";

/**
 * StarlightParticleOverlay.tsx
 * Canvas 2D ambient starlight / luminous-dust particle system.
 * 50–100 near-stationary particles that pulse alpha via Math.sin().
 * Tinted with --color-amber for warm dreamy glow.
 */

import { useEffect, useRef } from "react";
import { getWeatherMotionPreset } from "@/lib/weather-motion";
import { getParticleWeatherBudget } from "@/lib/weather-performance";

interface StarDust {
  x:          number;
  y:          number;
  radius:     number;
  alpha:      number;         // base opacity
  pulseSpeed: number;         // sin frequency
  pulsePhase: number;         // sin phase offset
  driftX:     number;         // ultra-slow float
  driftY:     number;
}

function makeStar(w: number, h: number): StarDust {
  return {
    x:          Math.random() * w,
    y:          Math.random() * h,
    radius:     0.6 + Math.random() * 2.2,
    alpha:      0.25 + Math.random() * 0.45,
    pulseSpeed: 0.008 + Math.random() * 0.016,
    pulsePhase: Math.random() * Math.PI * 2,
    driftX:     (Math.random() - 0.5) * 0.06,
    driftY:     -0.04 - Math.random() * 0.06, // drift upward slowly
  };
}

// Amber palette from CSS vars: #d8b486 → rgb(216, 180, 134)
const AMBER_R = 216, AMBER_G = 180, AMBER_B = 134;

export function StarlightParticleOverlay({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width  = w;
    canvas.height = h;

    const motion = getWeatherMotionPreset("starlight");
    let budget = getParticleWeatherBudget("starlight", intensity, w);
    let lastFrame = 0;
    let count = budget.count;
    let stars: StarDust[] = Array.from({ length: count }, () => makeStar(w, h));

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width  = w;
      canvas.height = h;
      budget = getParticleWeatherBudget("starlight", intensity, w);
      count = budget.count;
      stars = Array.from({ length: count }, () => makeStar(w, h));
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    const tick = (now: number) => {
      if (now - lastFrame < budget.frameIntervalMs) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastFrame = now;

      ctx.clearRect(0, 0, w, h);
      t += 1;

      for (const s of stars) {
        // Slow drift
        s.x += s.driftX * motion.drift;
        s.y += s.driftY * motion.speed;

        // Recycle when out of view
        if (s.y < -4 || s.x < -4 || s.x > w + 4) {
          Object.assign(s, makeStar(w, h));
          s.y = h + 2; // enter from bottom if drifting upward
        }

        // Pulsing alpha
        const pulse = 0.5 + 0.5 * Math.sin(t * s.pulseSpeed * motion.twinkle + s.pulsePhase);
        const a = s.alpha * (0.48 + 0.52 * pulse) * motion.opacity;

        // Glow: larger translucent outer circle + crisp inner dot
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 3.5);
        grad.addColorStop(0, `rgba(${AMBER_R},${AMBER_G},${AMBER_B},${(a * 0.85).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${AMBER_R},${AMBER_G},${AMBER_B},0)`);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Hard core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,245,220,${(a * 0.9).toFixed(3)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        zIndex:        50,
      }}
    />
  );
}
