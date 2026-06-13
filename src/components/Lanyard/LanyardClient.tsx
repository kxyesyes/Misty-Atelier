"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => <StudioPassFallback />,
});

export function LanyardClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const handleMotionChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", handleMotionChange);
    return () => media.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || shouldLoad) return undefined;

    const node = rootRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "420px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion, shouldLoad]);

  return (
    <div ref={rootRef}>
      {shouldLoad && !prefersReducedMotion ? (
        <Lanyard position={[0, 0, 22]} gravity={[0, -38, 0]} fov={22} transparent />
      ) : (
        <StudioPassFallback />
      )}
    </div>
  );
}

function StudioPassFallback() {
  return (
    <div className="flex h-[380px] w-full items-center justify-center bg-mist/10 sm:h-[460px]">
      <div className="relative h-72 w-48 border border-mist bg-paper shadow-sm">
        <div className="absolute -top-24 left-1/2 h-24 w-5 -translate-x-1/2 bg-ink" />
        <div className="absolute inset-4 border border-mist/80" />
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <p className="text-2xl leading-none text-ink">MISTY<br />ATELIER</p>
          <p className="mt-5 font-sans text-[10px] uppercase tracking-[0.22em] text-rain">Studio Pass</p>
          <p className="mt-8 text-sm leading-5 text-rain">Quiet Weather<br />Visual Archive</p>
          <p className="mt-8 text-4xl text-amber">06</p>
        </div>
      </div>
    </div>
  );
}
