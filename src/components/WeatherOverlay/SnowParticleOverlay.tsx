"use client";

import { useEffect, useRef } from "react";
import { getWeatherMotionPreset } from "@/lib/weather-motion";
import { getParticleWeatherBudget } from "@/lib/weather-performance";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  swayAmp: number;
  swayFreq: number;
  swayOffset: number;
  alpha: number;
  spin: number;
}

function makeFlake(w: number, h: number, fromTop = false): Snowflake {
  const radius = 1.2 + Math.random() * 3.4;
  const depth = radius / 4.6;

  return {
    x: Math.random() * w,
    y: fromTop ? Math.random() * -h : Math.random() * h,
    radius,
    speedY: 0.42 + depth * 1.1,
    swayAmp: 8 + Math.random() * 16,
    swayFreq: 0.003 + Math.random() * 0.004,
    swayOffset: Math.random() * Math.PI * 2,
    alpha: 0.52 + depth * 0.42,
    spin: Math.random() * Math.PI,
  };
}

function drawFlake(
  ctx: CanvasRenderingContext2D,
  flake: Snowflake,
  tick: number,
  motionScale: number,
  spinScale: number
) {
  const arm = flake.radius * 2.5 * motionScale;

  ctx.save();
  ctx.translate(flake.x, flake.y);
  ctx.rotate(flake.spin + tick * 0.006 * spinScale);
  ctx.lineCap = "round";

  ctx.strokeStyle = `rgba(64,82,96,${(flake.alpha * 0.34).toFixed(2)})`;
  ctx.lineWidth = Math.max(1, flake.radius * 0.42);
  for (let i = 0; i < 3; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(-arm, 0);
    ctx.lineTo(arm, 0);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(255,255,255,${Math.min(1, flake.alpha * 1.18).toFixed(2)})`;
  ctx.lineWidth = Math.max(0.8, flake.radius * 0.28);
  for (let i = 0; i < 3; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(-arm * 0.82, 0);
    ctx.lineTo(arm * 0.82, 0);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(0, 0, Math.max(1.2, flake.radius * 0.45), 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${Math.min(1, flake.alpha * 1.25).toFixed(2)})`;
  ctx.fill();
  ctx.restore();
}

export function SnowParticleOverlay({ intensity = 1 }: { intensity?: number }) {
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

    const motion = getWeatherMotionPreset("snow");
    let budget = getParticleWeatherBudget("snow", intensity, w);
    let lastFrame = 0;
    let flakes = Array.from({ length: budget.count }, () => makeFlake(w, h));

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      budget = getParticleWeatherBudget("snow", intensity, w);
      flakes = Array.from({ length: budget.count }, () => makeFlake(w, h));
    };
    window.addEventListener("resize", onResize);

    let tickCount = 0;
    const tick = (now: number) => {
      if (now - lastFrame < budget.frameIntervalMs) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastFrame = now;

      ctx.clearRect(0, 0, w, h);
      tickCount += 1;

      for (const flake of flakes) {
        flake.y += flake.speedY * motion.speed;
        flake.x +=
          Math.sin(tickCount * flake.swayFreq + flake.swayOffset) *
          flake.swayAmp *
          0.035 *
          motion.sway;

        if (flake.y > h + 8) {
          Object.assign(flake, makeFlake(w, h, true));
        }

        drawFlake(ctx, flake, tickCount, motion.scale, motion.spin);
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
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}
