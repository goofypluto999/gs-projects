"use client";

import { useEffect, useRef, useState } from "react";
import { AppleIntelligenceBorder } from "./AppleIntelligenceBorder";
import { FlowField } from "./FlowField";

/**
 * Preloader v3 — consistent with the hero, immersive, less polarising.
 *
 * Background: same FlowField the hero uses, at reduced density so it
 * reads as "the hero already breathing through". This means the
 * transition to the live page is almost invisible — same canvas, same
 * field, just statements that fade and a corner accent that softens.
 *
 * Corner Apple Intelligence accent (top-right): rotating conic glow
 * confined to a 280x280 square in the corner — Siri-summon style, NOT
 * a full-viewport rim that fights the rest of the design.
 *
 * Centre stage: three statements + closing tag. Each beat has a
 * background slow-orbiting line glyph that adds real motion art —
 * not just text fading, an actual orbit drawing around the line.
 */

interface Beat {
  text: string;
  size?: "lg" | "xl";
}

const beats: Beat[] = [
  { text: "Welcome." },
  { text: "Five live products." },
  { text: "One operator.", size: "xl" },
];

const BEAT_DURATION = 750;
const FADE_DURATION = 700;

export function Preloader() {
  const [phase, setPhase] = useState<"loading" | "fading" | "done">("loading");
  const [beatIdx, setBeatIdx] = useState(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    document.body.style.overflow = "hidden";
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Brief settle, then first beat
    timers.push(setTimeout(() => setBeatIdx(0), 250));
    for (let i = 1; i < beats.length; i++) {
      timers.push(setTimeout(() => setBeatIdx(i), 250 + i * BEAT_DURATION));
    }

    // Begin fade out after last beat holds
    timers.push(
      setTimeout(
        () => {
          setPhase("fading");
          setTimeout(() => {
            setPhase("done");
            document.body.style.overflow = "";
          }, FADE_DURATION);
        },
        250 + beats.length * BEAT_DURATION + 300
      )
    );

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-bg pointer-events-auto overflow-hidden"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        transition:
          phase === "fading"
            ? `opacity ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
            : undefined,
      }}
      aria-hidden="true"
    >
      {/* Same FlowField as the hero — visual continuity */}
      <FlowField density={0.00010} repelRadius={120} />

      {/* Subtle radial vignette so type pops */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(10,10,11,0.55) 90%)",
        }}
      />

      {/* TOP-RIGHT corner Apple Intelligence accent — confined glow,
          NOT a full-viewport rim. Siri-summon scale. */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-40px",
          right: "-40px",
          width: "320px",
          height: "320px",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <AppleIntelligenceBorder
          thickness={3}
          intensity="xl"
          speed={4}
          radius={999}
        />
      </div>

      {/* BOTTOM-LEFT smaller mirrored accent — sets the diagonal */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-30px",
          left: "-30px",
          width: "220px",
          height: "220px",
          borderRadius: "999px",
          overflow: "hidden",
          opacity: 0.6,
        }}
      >
        <AppleIntelligenceBorder
          thickness={2}
          intensity="lg"
          speed={5.5}
          radius={999}
        />
      </div>

      {/* Top-left tag */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center gap-2.5 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-text-secondary">
          Studio · 2026
        </span>
      </div>

      {/* Bottom-right status */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10 z-10">
        <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-text-tertiary">
          <span className="text-accent">›</span> rendering
        </span>
      </div>

      {/* Center stage — statements + orbiting line glyph */}
      <div className="absolute inset-0 flex items-center justify-center px-8 z-10">
        {/* Decorative orbiting ring behind text — pure SVG */}
        <svg
          className="absolute pointer-events-none"
          viewBox="0 0 600 600"
          width="min(80vw, 600px)"
          height="min(80vw, 600px)"
          style={{ opacity: 0.18 }}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="orbit-fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAFAFA" stopOpacity="0" />
              <stop offset="60%" stopColor="#FAFAFA" stopOpacity="0" />
              <stop offset="85%" stopColor="#FAFAFA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FAFAFA" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g style={{ transformOrigin: "center", animation: "preloader-spin 18s linear infinite" }}>
            <circle cx="300" cy="300" r="260" fill="none" stroke="url(#orbit-fade)" strokeWidth="1.2" strokeDasharray="2 6" />
          </g>
          <g style={{ transformOrigin: "center", animation: "preloader-spin-r 26s linear infinite" }}>
            <circle cx="300" cy="300" r="200" fill="none" stroke="rgba(37,99,235,0.35)" strokeWidth="0.8" strokeDasharray="1 5" />
          </g>
          <g style={{ transformOrigin: "center", animation: "preloader-spin 36s linear infinite" }}>
            <ellipse cx="300" cy="300" rx="260" ry="120" fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="0.6" />
          </g>
        </svg>

        {beats.map((b, i) => {
          const isActive = beatIdx === i;
          const isPast = beatIdx > i;
          let opacity = 0;
          let translateY = 28;
          let blur = 14;
          if (isActive) {
            opacity = 1;
            translateY = 0;
            blur = 0;
          } else if (isPast) {
            opacity = 0;
            translateY = -28;
            blur = 14;
          }

          return (
            <h2
              key={i}
              className="absolute font-heading text-center leading-[0.92] tracking-tight text-text-primary"
              style={{
                fontSize: b.size === "xl" ? "clamp(3rem, 9vw, 8rem)" : "clamp(2.5rem, 7vw, 6.5rem)",
                fontWeight: 600,
                opacity,
                transform: `translateY(${translateY}px)`,
                filter: `blur(${blur}px)`,
                transition:
                  "opacity 380ms ease, transform 500ms cubic-bezier(0.16, 1, 0.3, 1), filter 380ms ease",
              }}
            >
              {b.text}
            </h2>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes preloader-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes preloader-spin-r {
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}
