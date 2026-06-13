"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  createAutumnLeaves,
  resetAutumnLeaf,
  type AutumnLeaf,
  type AutumnLeafSprite,
} from "@/lib/atmospheric-particles";
import styles from "./AutumnLeavesOverlay.module.css";

const leafPathCache = new Map<
  string,
  { shape: Path2D; vein: Path2D }
>();

function getLeafPaths(sprite: AutumnLeafSprite) {
  const cached = leafPathCache.get(sprite.id);
  if (cached) return cached;

  const paths = {
    shape: new Path2D(sprite.path),
    vein: new Path2D(sprite.vein),
  };
  leafPathCache.set(sprite.id, paths);
  return paths;
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  leaf: AutumnLeaf,
  time: number,
  reducedMotion: boolean
) {
  const wobble = reducedMotion
    ? 0
    : Math.sin(time * 1.4 + leaf.phase) * 0.18 +
      Math.sin(time * 0.38 + leaf.phase * 0.7) * 0.08;
  const flutterScale = reducedMotion
    ? 1
    : 0.72 + Math.abs(Math.sin(time * 1.1 + leaf.phase)) * 0.32;
  const sprite = leaf.sprite;
  const { shape, vein } = getLeafPaths(sprite);

  ctx.save();
  ctx.translate(leaf.x, leaf.y);
  ctx.rotate(leaf.rotation + wobble);
  ctx.scale((leaf.size / 100) * flutterScale, leaf.size / 100);
  ctx.globalAlpha = leaf.alpha;

  const fill = ctx.createLinearGradient(-42, -48, 38, 50);
  fill.addColorStop(0, sprite.palette[1]);
  fill.addColorStop(0.48, sprite.palette[0]);
  fill.addColorStop(1, sprite.palette[2]);

  ctx.fillStyle = fill;
  ctx.fill(shape);
  ctx.strokeStyle = "rgba(77, 50, 34, 0.2)";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.stroke(vein);
  ctx.restore();
}

function AutumnLeavesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let leaves = createAutumnLeaves({
      width,
      height,
      count: width < 768 ? 10 : 18,
    });
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
      leaves = createAutumnLeaves({
        width,
        height,
        count: width < 768 ? 10 : 18,
      });
    };

    resizeCanvas();
    window.addEventListener("resize", onResize);

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const leaf of leaves.slice(0, Math.min(14, leaves.length))) {
        drawLeaf(ctx, leaf, 0, true);
      }
    };

    if (reducedMotion) {
      drawStatic();
      return () => window.removeEventListener("resize", onResize);
    }

    const tick = (now: number) => {
      if (now - lastFrame < 66) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const delta = lastFrame ? Math.min(2, (now - lastFrame) / 66) : 1;
      lastFrame = now;
      const time = now * 0.001;
      const wind =
        Math.sin(time * 0.19) * 0.34 + Math.sin(time * 0.047) * 0.72;

      ctx.clearRect(0, 0, width, height);

      leaves.forEach((leaf, index) => {
        const pause =
          0.62 +
          Math.abs(Math.sin(time * leaf.flutterPause + leaf.phase)) * 0.38;
        leaf.y += leaf.fallSpeed * pause * delta;
        leaf.x +=
          (wind + leaf.windOffset) * leaf.depth * delta +
          Math.sin(time * leaf.driftSpeed + leaf.phase) *
            0.24 *
            leaf.depth *
            delta;
        leaf.rotation += leaf.rotationSpeed * pause * delta;

        const drift =
          Math.sin(time * leaf.driftSpeed + leaf.phase) * leaf.driftAmplitude;
        const renderX = leaf.x + drift;
        const originalX = leaf.x;
        leaf.x = renderX;
        drawLeaf(ctx, leaf, time, false);
        leaf.x = originalX;

        if (leaf.y > height + 90 || renderX < -160 || renderX > width + 180) {
          resetAutumnLeaf(leaf, width, height, index);
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

export function AutumnLeavesOverlay() {
  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.8, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <AutumnLeavesCanvas />
    </motion.div>
  );
}
