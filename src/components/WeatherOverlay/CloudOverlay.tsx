"use client";

/**
 * CloudOverlay.tsx
 * Pure CSS / SVG clear-sky overlay.
 * Three cloud layers with parallax-speed stagger + god-ray light shafts.
 * Only transform + opacity are animated → full GPU acceleration.
 */

import React from "react";

// ─── Inline styles (keyframes injected once via a <style> tag) ──────────────

const CSS = `
@keyframes cloud-drift-slow   { from { transform: translateX(-18%) } to { transform: translateX(108vw) } }
@keyframes cloud-drift-mid    { from { transform: translateX(-22%) } to { transform: translateX(112vw) } }
@keyframes cloud-drift-fast   { from { transform: translateX(-26%) } to { transform: translateX(116vw) } }
@keyframes god-ray-pulse      { 0%,100% { opacity: 0 } 50% { opacity: 1 } }
`;

// ─── Cloud SVG shapes ────────────────────────────────────────────────────────

function CloudShape({ variant }: { variant: 1 | 2 | 3 }) {
  // Three distinct fluffy cloud silhouettes, all blurred via filter
  const shapes: Record<1 | 2 | 3, React.ReactNode> = {
    1: (
      <svg width="520" height="160" viewBox="0 0 520 160" fill="none"
           xmlns="http://www.w3.org/2000/svg" style={{ filter: "blur(18px)" }}>
        <ellipse cx="200" cy="110" rx="180" ry="65"  fill="white" fillOpacity="0.72" />
        <ellipse cx="320" cy="100" rx="140" ry="55"  fill="white" fillOpacity="0.68" />
        <ellipse cx="130" cy="100" rx="110" ry="45"  fill="white" fillOpacity="0.60" />
        <ellipse cx="400" cy="115" rx="110" ry="48"  fill="white" fillOpacity="0.62" />
        <ellipse cx="240" cy="80"  rx="110" ry="52"  fill="white" fillOpacity="0.78" />
      </svg>
    ),
    2: (
      <svg width="380" height="120" viewBox="0 0 380 120" fill="none"
           xmlns="http://www.w3.org/2000/svg" style={{ filter: "blur(14px)" }}>
        <ellipse cx="160" cy="80"  rx="140" ry="50"  fill="white" fillOpacity="0.65" />
        <ellipse cx="260" cy="75"  rx="110" ry="42"  fill="white" fillOpacity="0.60" />
        <ellipse cx="90"  cy="78"  rx="88"  ry="36"  fill="white" fillOpacity="0.55" />
        <ellipse cx="200" cy="60"  rx="95"  ry="42"  fill="white" fillOpacity="0.70" />
      </svg>
    ),
    3: (
      <svg width="620" height="180" viewBox="0 0 620 180" fill="none"
           xmlns="http://www.w3.org/2000/svg" style={{ filter: "blur(22px)" }}>
        <ellipse cx="260" cy="130" rx="220" ry="72"  fill="white" fillOpacity="0.55" />
        <ellipse cx="420" cy="118" rx="170" ry="62"  fill="white" fillOpacity="0.50" />
        <ellipse cx="140" cy="122" rx="130" ry="52"  fill="white" fillOpacity="0.48" />
        <ellipse cx="520" cy="136" rx="120" ry="50"  fill="white" fillOpacity="0.45" />
        <ellipse cx="310" cy="100" rx="160" ry="65"  fill="white" fillOpacity="0.58" />
      </svg>
    ),
  };
  return <>{shapes[variant]}</>;
}

// ─── God rays ────────────────────────────────────────────────────────────────

function GodRays() {
  const rays = [
    { left: "62%",  width: "140px", rotate: "32deg", delay: "0s",    duration: "8s"  },
    { left: "72%",  width: "80px",  rotate: "36deg", delay: "2.5s",  duration: "11s" },
    { left: "55%",  width: "60px",  rotate: "28deg", delay: "5s",    duration: "9s"  },
    { left: "80%",  width: "110px", rotate: "40deg", delay: "1.2s",  duration: "13s" },
  ];

  return (
    <>
      {rays.map((r, i) => (
        <div
          key={i}
          style={{
            position:        "fixed",
            top:             "-10vh",
            left:            r.left,
            width:           r.width,
            height:          "130vh",
            background:      "linear-gradient(180deg, rgba(255,250,243,0.18) 0%, rgba(255,250,243,0) 100%)",
            transform:       `rotate(${r.rotate})`,
            transformOrigin: "top center",
            mixBlendMode:    "soft-light",
            pointerEvents:   "none",
            animation:       `god-ray-pulse ${r.duration} ease-in-out ${r.delay} infinite`,
          }}
        />
      ))}
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function CloudOverlay() {
  const layers: Array<{
    variant:   1 | 2 | 3;
    top:       string;
    left:      string;
    scale:     number;
    opacity:   number;
    animation: string;
  }> = [
    // Far / large (slow, faint)
    {
      variant:   3,
      top:       "-2vh",
      left:      "-18%",
      scale:     1.1,
      opacity:   0.38,
      animation: "cloud-drift-slow 220s linear infinite",
    },
    // Mid layer
    {
      variant:   1,
      top:       "4vh",
      left:      "-22%",
      scale:     0.88,
      opacity:   0.55,
      animation: "cloud-drift-mid 160s linear 30s infinite",
    },
    // Near / small (faster, slightly more opaque)
    {
      variant:   2,
      top:       "2vh",
      left:      "-26%",
      scale:     0.68,
      opacity:   0.65,
      animation: "cloud-drift-fast 120s linear 80s infinite",
    },
  ];

  return (
    <>
      {/* Inject keyframes once */}
      <style>{CSS}</style>

      {/* Cloud layers */}
      {layers.map((l, i) => (
        <div
          key={i}
          style={{
            position:      "fixed",
            top:           l.top,
            left:          l.left,
            pointerEvents: "none",
            zIndex:        50,
            opacity:       l.opacity,
            transform:     `scale(${l.scale})`,
            transformOrigin: "top left",
            animation:     l.animation,
          }}
        >
          <CloudShape variant={l.variant} />
        </div>
      ))}

      {/* God rays */}
      <GodRays />
    </>
  );
}
