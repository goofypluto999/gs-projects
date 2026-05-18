"use client";

import { useEffect, useRef, useState } from "react";
import { AppleIntelligenceBorder } from "./AppleIntelligenceBorder";

/**
 * Cinematic preloader — Apple Intelligence ambient border framing a
 * sequence of editorial statements that swap in/out.
 *
 * Beat 1 (0.0s): Black screen. AI rim ignites and rotates.
 * Beat 2 (0.4s): Statement #1 fades in — "Welcome."
 * Beat 3 (1.0s): Statement #2 — "Five live products."
 * Beat 4 (1.7s): Statement #3 — "One operator."
 * Beat 5 (2.4s): Wordmark resolves — "Sizino Ennes."
 * Beat 6 (3.0s): AI rim pulses bright, statement fades, lift.
 *
 * Total ~3.4s. Captivating, on-brand, ends with the studio name burned
 * into the visitor's eye. Respects reduced-motion (instant dismiss).
 */

interface Statement {
  text: string;
  italic?: boolean;
  accent?: string;
}

const beats: Statement[] = [
  { text: "Welcome." },
  { text: "Five live products." },
  { text: "One operator." },
  { text: "Sizino Ennes.", accent: "#2563EB" },
];

const BEAT_DURATION = 700; // ms per beat
const LIFT_DURATION = 750;

export function Preloader() {
  const [done, setDone] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [beatIdx, setBeatIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced-motion: skip entirely
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";

    // Beat scheduler
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Initial AI border ignition delay
    timers.push(setTimeout(() => setBeatIdx(0), 300));

    // Subsequent beats
    for (let i = 1; i < beats.length; i++) {
      timers.push(setTimeout(() => setBeatIdx(i), 300 + i * BEAT_DURATION));
    }

    // Trigger lift after last beat holds
    timers.push(
      setTimeout(
        () => {
          setLifting(true);
          setTimeout(() => {
            setDone(true);
            document.body.style.overflow = "";
          }, LIFT_DURATION);
        },
        300 + beats.length * BEAT_DURATION + 400
      )
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[100] bg-bg pointer-events-auto overflow-hidden"
      style={{
        transform: lifting ? "translateY(-100%)" : "translateY(0)",
        transition: lifting
          ? `transform ${LIFT_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)`
          : undefined,
      }}
      aria-hidden="true"
    >
      {/* Apple Intelligence rotating rim — the show stopper */}
      <AppleIntelligenceBorder
        thickness={2}
        intensity="xl"
        speed={3.5}
        radius={0}
      />

      {/* Subtle inner vignette so type pops above the rim glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,11,0.7) 95%)",
        }}
      />

      {/* Top-left tag */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center gap-2.5 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-text-secondary">
          Studio · Sizino Ennes
        </span>
      </div>

      {/* Bottom-right status */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-10 z-10">
        <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-text-tertiary">
          <span className="text-accent">›</span> initialising
        </span>
      </div>

      {/* Center stage — statements swap in/out */}
      <div className="absolute inset-0 flex items-center justify-center px-8 z-10">
        {beats.map((b, i) => {
          // Active when beatIdx === i. Hold the final beat slightly longer.
          const isActive = beatIdx === i;
          const isPast = beatIdx > i;
          let opacity = 0;
          let translateY = 24;
          let blur = 12;
          if (isActive) {
            opacity = 1;
            translateY = 0;
            blur = 0;
          } else if (isPast) {
            opacity = 0;
            translateY = -24;
            blur = 12;
          }

          return (
            <h2
              key={i}
              className="absolute font-heading text-center leading-[0.9] tracking-tight text-text-primary"
              style={{
                fontSize: "clamp(2.5rem, 7.5vw, 7rem)",
                fontWeight: i === beats.length - 1 ? 800 : 500,
                fontStyle: b.italic ? "italic" : "normal",
                opacity,
                transform: `translateY(${translateY}px)`,
                filter: `blur(${blur}px)`,
                transition:
                  "opacity 360ms ease, transform 460ms cubic-bezier(0.16, 1, 0.3, 1), filter 360ms ease",
              }}
            >
              {b.text}
              {b.accent && i === beats.length - 1 && (
                <span style={{ color: b.accent }}>.</span>
              )}
            </h2>
          );
        })}
      </div>
    </div>
  );
}
