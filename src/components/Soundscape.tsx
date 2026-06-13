"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp, Music, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const TRACKS = [
  { id: "rain" as const, name: "Rain on Window", zhName: "窗外微雨" },
  { id: "vinyl" as const, name: "Vinyl Reverie", zhName: "阁楼留声机" },
  { id: "attic" as const, name: "Atelier Solitude", zhName: "画室晨曦" },
];

type TrackId = "rain" | "vinyl" | "attic";

/**
 * Build a loopable noise buffer synthesized locally via Web Audio API.
 * No external URLs, no CORS, zero network dependency.
 */
function buildNoiseBuffer(ctx: AudioContext, type: TrackId): AudioBuffer {
  const duration = 30; // 30-second seamlessly loopable buffer
  const len = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);

    if (type === "rain") {
      // Brown noise — warm, continuous rain texture
      let lastOut = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        d[i] = lastOut * 3.5;
      }
    } else if (type === "vinyl") {
      // White noise base + sparse random pops for vinyl crackle
      for (let i = 0; i < len; i++) {
        const base = (Math.random() * 2 - 1) * 0.035;
        const pop = Math.random() < 0.0003 ? (Math.random() * 2 - 1) * 0.6 : 0;
        d[i] = base + pop;
      }
    } else {
      // Pink noise (Voss-McCartney algorithm) — soft, airy atelier hum
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856;
        b4 = 0.55000 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.0168980;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    }
  }
  return buf;
}

export function Soundscape() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackId>("rain");
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const quietSurface = pathname.startsWith("/works/") || pathname === "/archive";
  const showSettingsToggle = !quietSurface || isPlaying || isOpen;

  const ctxRef = useRef<AudioContext | null>(null);
  const gainNodesRef = useRef<Partial<Record<TrackId, GainNode>>>({});

  /**
   * Lazily initialize AudioContext and start all three source nodes.
   * All tracks run continuously at gain=0; only the active track is faded in.
   * Must be called from a user gesture (click) to comply with browser autoplay policies.
   */
  const initAudio = useCallback(() => {
    if (ctxRef.current) return;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    TRACKS.forEach(({ id }) => {
      const buf = buildNoiseBuffer(ctx, id);

      // Per-track filter shaping
      const filter = ctx.createBiquadFilter();
      if (id === "rain") {
        filter.type = "bandpass";
        filter.frequency.value = 1000;
        filter.Q.value = 0.5;
      } else if (id === "vinyl") {
        filter.type = "lowpass";
        filter.frequency.value = 3500;
      } else {
        filter.type = "lowpass";
        filter.frequency.value = 900;
      }

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0; // silent until user triggers play

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      src.start(0);

      gainNodesRef.current[id] = gainNode;
    });
  }, []);

  // Restore user preferences from localStorage on mount
  useEffect(() => {
    const storedTrack = localStorage.getItem("soundscape_track") as TrackId | null;
    const storedVolume = localStorage.getItem("soundscape_volume");
    const storedMuted = localStorage.getItem("soundscape_muted");

    if (storedTrack && TRACKS.some((t) => t.id === storedTrack)) {
      setCurrentTrack(storedTrack);
    }
    if (storedVolume) setVolume(parseFloat(storedVolume));
    if (storedMuted) setIsMuted(storedMuted === "true");

    return () => {
      ctxRef.current?.close();
    };
  }, []);

  /** Schedule a smooth gain ramp via AudioContext timing (no setInterval needed). */
  const fadeTo = useCallback(
    (trackId: TrackId, target: number, durationSec = 0.8) => {
      const ctx = ctxRef.current;
      const gainNode = gainNodesRef.current[trackId];
      if (!ctx || !gainNode) return;
      const now = ctx.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(target, now + durationSec);
    },
    []
  );

  const togglePlay = useCallback(() => {
    initAudio();

    // Resume context if suspended (e.g. tab was hidden)
    if (ctxRef.current?.state === "suspended") {
      ctxRef.current.resume();
    }

    if (isPlaying) {
      fadeTo(currentTrack, 0, 0.5);
      setTimeout(() => setIsPlaying(false), 500);
    } else {
      fadeTo(currentTrack, isMuted ? 0 : volume, 0.8);
      setIsPlaying(true);
    }
  }, [currentTrack, fadeTo, initAudio, isMuted, isPlaying, volume]);

  const switchTrack = useCallback(
    (trackId: TrackId) => {
      if (trackId === currentTrack) return;
      localStorage.setItem("soundscape_track", trackId);

      if (isPlaying) {
        fadeTo(currentTrack, 0, 0.4);
        setTimeout(() => fadeTo(trackId, isMuted ? 0 : volume, 0.6), 400);
      }

      setCurrentTrack(trackId);
    },
    [currentTrack, fadeTo, isMuted, isPlaying, volume]
  );

  const handleVolumeChange = useCallback(
    (newVol: number) => {
      setVolume(newVol);
      localStorage.setItem("soundscape_volume", newVol.toString());

      if (isPlaying && !isMuted) {
        const ctx = ctxRef.current;
        const gainNode = gainNodesRef.current[currentTrack];
        if (ctx && gainNode) {
          gainNode.gain.cancelScheduledValues(ctx.currentTime);
          gainNode.gain.setValueAtTime(newVol, ctx.currentTime);
        }
      }
    },
    [currentTrack, isMuted, isPlaying]
  );

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem("soundscape_muted", next.toString());
    if (isPlaying) {
      fadeTo(currentTrack, next ? 0 : volume, 0.4);
    }
  }, [currentTrack, fadeTo, isMuted, isPlaying, volume]);

  // Framer Motion variants for equalizer bars
  const barVariants = {
    animate: (i: number) => ({
      scaleY: [0.3, 1, 0.3],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse" as const,
        delay: i * 0.15,
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <div
      className={`fixed z-50 font-sans transition-opacity ${
        quietSurface
          ? "bottom-4 right-4 opacity-55 hover:opacity-100 focus-within:opacity-100"
          : "bottom-6 right-6"
      }`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 25 }
            }
            className="ink-panel mb-3 w-64 p-4"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-ink/5 pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rain">
                Atelier Ambient
              </span>
              <button
                onClick={toggleMute}
                className="text-rain transition-colors hover:text-ink"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Track list */}
            <div className="my-3 grid gap-1.5">
              {TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => switchTrack(track.id)}
                  className={`flex min-h-10 items-center justify-between border px-2.5 py-2 text-xs transition-all ${
                    currentTrack === track.id
                      ? "border-cinnabar bg-cinnabar/10 text-ink font-semibold"
                      : "border-transparent text-rain hover:border-cinnabar hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  <span>{track.name}</span>
                  <span className="font-normal text-[10px] opacity-60">
                    {track.zhName}
                  </span>
                </button>
              ))}
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-3 border-t border-ink/5 pt-2">
              <span className="text-[10px] uppercase tracking-[0.1em] text-rain">
                Vol
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none bg-mist accent-cinnabar [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-cinnabar"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating control buttons */}
      <div className="flex gap-2">
        <button
          onClick={togglePlay}
          className={`flex h-11 w-11 items-center justify-center border border-ink/10 transition-all duration-300 hover:scale-105 active:scale-95 ${
            isPlaying
              ? "bg-ink text-paper"
              : "bg-paper text-ink hover:border-cinnabar"
          }`}
          aria-label={isPlaying ? "Pause ambient sound" : "Play ambient sound"}
        >
          {isPlaying ? (
            <div className="flex h-3 items-end gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={barVariants}
                  animate={shouldReduceMotion ? undefined : "animate"}
                  className="h-full w-0.5 origin-bottom bg-paper"
                />
              ))}
            </div>
          ) : (
            <Music className="h-4 w-4" />
          )}
        </button>

        {showSettingsToggle && (
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center border border-ink/10 bg-paper/90 text-rain transition-all duration-300 hover:border-cinnabar hover:text-ink active:scale-95"
            aria-label="Toggle ambient settings panel"
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
