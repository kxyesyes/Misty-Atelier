"use client";

import { useEffect, useRef } from "react";
import {
  createRainField,
  resetRainDrop,
  resetRainMistBand,
  type RainDrop,
  type RainMistBand,
  type RainVisualLayer,
} from "@/lib/atmospheric-particles";
import { getWeatherMotionPreset } from "@/lib/weather-motion";
import { getParticleWeatherBudget } from "@/lib/weather-performance";
import type { WeatherType } from "./WeatherContext";

const LAYERS: RainVisualLayer[] = ["back", "middle", "front"];

function drawAtmosphere(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  opacity: number,
  type: Extract<WeatherType, "mist" | "rain" | "rain-heavy">
) {
  const pulse = 1 + Math.sin(time * 0.62) * 0.08;
  const veil = ctx.createLinearGradient(0, 0, 0, height);
  const damp = type === "rain-heavy" ? 1.28 : type === "mist" ? 0.42 : 0.86;
  veil.addColorStop(0, "rgba(120,143,154,0)");
  veil.addColorStop(0.62, `rgba(105, 127, 138, ${(0.014 * opacity * pulse * damp).toFixed(3)})`);
  veil.addColorStop(1, `rgba(70, 91, 104, ${(0.026 * opacity * damp).toFixed(3)})`);
  ctx.fillStyle = veil;
  ctx.fillRect(0, height * 0.18, width, height * 0.82);
}

function drawMistBand(
  ctx: CanvasRenderingContext2D,
  band: RainMistBand,
  time: number,
  opacity: number,
  type: Extract<WeatherType, "mist" | "rain" | "rain-heavy">
) {
  const y = band.y + Math.sin(time * 0.2 + band.phase) * 24;
  const alpha = band.alpha * opacity * (type === "mist" ? 1.45 : 0.74);
  const grad = ctx.createLinearGradient(
    band.x - band.width,
    y,
    band.x + band.width,
    y
  );
  grad.addColorStop(0, `rgba(101, 123, 134, ${alpha.toFixed(3)})`);
  grad.addColorStop(0.46, `rgba(151, 168, 176, ${(alpha * 0.48).toFixed(3)})`);
  grad.addColorStop(1, "rgba(151,168,176,0)");

  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(band.x - band.width, y - band.height * 0.5, band.width * 2, band.height);
  ctx.restore();
}

function drawRainDrop(
  ctx: CanvasRenderingContext2D,
  drop: RainDrop,
  wind: number,
  opacity: number,
  scale: number
) {
  const endX = drop.x + (drop.slant + wind * 0.018) * drop.length;
  const endY = drop.y + drop.length * scale;
  const alpha = Math.min(0.68, drop.alpha * opacity);
  const stroke = ctx.createLinearGradient(drop.x, drop.y, endX, endY);
  stroke.addColorStop(0, `rgba(235, 245, 248, ${(alpha * 0.04).toFixed(3)})`);
  stroke.addColorStop(0.28, `rgba(154, 176, 186, ${(alpha * 0.75).toFixed(3)})`);
  stroke.addColorStop(1, `rgba(69, 90, 102, ${alpha.toFixed(3)})`);

  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(0.36, drop.width * scale);
  ctx.beginPath();
  ctx.moveTo(drop.x, drop.y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
}

function drawSplash(
  ctx: CanvasRenderingContext2D,
  drop: RainDrop,
  width: number,
  height: number,
  time: number
) {
  if (drop.splashChance <= 0 || drop.y < height * 0.74) return;
  const pulse = Math.sin(time * 8.5 + drop.phase);
  if (pulse < 1 - drop.splashChance * 12) return;

  const y = Math.min(height - 12, drop.y + drop.length * 0.9);
  const x = Math.min(width + 20, Math.max(-20, drop.x + drop.slant * drop.length));
  const alpha = Math.min(0.18, drop.alpha * 0.34 * pulse);

  ctx.save();
  ctx.strokeStyle = `rgba(106, 128, 138, ${alpha.toFixed(3)})`;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.ellipse(x, y, 4 + drop.depth * 5, 1.2 + drop.depth, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function RainParticleOverlay({
  intensity = 1,
  type = "rain",
}: {
  intensity?: number;
  type?: Extract<WeatherType, "mist" | "rain" | "rain-heavy">;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let budget = getParticleWeatherBudget(type, intensity, width);
    let motion = getWeatherMotionPreset(type);
    let field = createRainField({ width, height, type, intensity });
    let lastFrame = 0;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onResize = () => {
      resizeCanvas();
      budget = getParticleWeatherBudget(type, intensity, width);
      motion = getWeatherMotionPreset(type);
      field = createRainField({ width, height, type, intensity });
    };

    resizeCanvas();
    window.addEventListener("resize", onResize);

    const tick = (now: number) => {
      if (now - lastFrame < budget.frameIntervalMs) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = lastFrame ? Math.min(2.2, (now - lastFrame) / budget.frameIntervalMs) : 1;
      lastFrame = now;
      const time = now * 0.001;
      const wind =
        -1.35 +
        Math.sin(time * 0.23) * motion.windVariance +
        Math.sin(time * 0.071) * motion.windVariance * 0.55;

      ctx.clearRect(0, 0, width, height);
      drawAtmosphere(ctx, width, height, time, motion.opacity, type);

      for (const band of field.mistBands) {
        band.x += band.speed * motion.drift * delta;
        if (band.x > width + band.width * 0.58) {
          resetRainMistBand(band, width, height);
        }
        drawMistBand(ctx, band, time, motion.opacity, type);
      }

      if (type !== "mist") {
        for (const layer of LAYERS) {
          for (const drop of field.drops) {
            if (drop.layer !== layer) continue;

            const gust = wind + Math.sin(time * 1.7 + drop.phase) * 0.18;
            drop.x += gust * drop.depth * motion.drift * delta;
            drop.y += drop.speed * motion.speed * delta;

            if (
              drop.y > height + drop.length ||
              drop.x < -180 ||
              drop.x > width + 180
            ) {
              resetRainDrop(drop, width, height, type, intensity);
            }

            drawRainDrop(ctx, drop, gust, motion.opacity, motion.scale);
            if (layer === "front") {
              drawSplash(ctx, drop, width, height, time);
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [intensity, type]);

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
