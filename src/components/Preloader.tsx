"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Preloader v4 — "The studio comes into focus."
 *
 * Beat 1 (0.0–0.8s): Particles flow inward from the entire viewport,
 *   converging toward the centre.
 * Beat 2 (0.8–2.2s): They lock into the shape of the word "Studio."
 *   and hold steady, faintly breathing.
 * Beat 3 (2.2–3.0s): They release outward, dispersing back into a
 *   free-flowing field — the SAME field the hero uses underneath.
 * Beat 4 (3.0–3.6s): The dark overlay fades; the hero's own FlowField
 *   is already running behind us, so the transition reads as the
 *   particles settling rather than a curtain lifting.
 *
 * MEANING: the studio assembles itself in front of you. Once assembled,
 * the maker of the studio (the hero's "Giovanni Sizino." MagneticName)
 * is revealed underneath.
 *
 * Hand-rolled canvas 2D. Single colour palette: white particles + a
 * single accent-blue period. No rainbow chaos. Continuity over spectacle.
 */

interface Particle {
  // Current position
  x: number;
  y: number;
  // Velocity
  vx: number;
  vy: number;
  // Target (when forming text)
  hx: number;
  hy: number;
  // Spawn position to return to when dispersing
  bx: number;
  by: number;
  // Per-particle visual
  alpha: number;
  size: number;
  // Drift offset for breathing during hold
  driftSeed: number;
}

type Phase = "converge" | "hold" | "disperse" | "fade" | "done";

// Phase timings
const T_CONVERGE = 800;
const T_HOLD = 1400;
const T_DISPERSE = 800;
const T_FADE = 600;
// Total: 3600ms

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("converge");
  const [overlayAlpha, setOverlayAlpha] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const phaseStartRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      setOverlayAlpha(0);
      return;
    }

    // Touch / mobile fast-path: skip the particle simulation entirely
    // (1500+ sampled pixels × physics is expensive on a phone GPU). Show
    // a quick text fade instead. Same brand beat, half the boot time.
    const isTouch = window.matchMedia("(hover: none) or (pointer: coarse)").matches;
    if (isTouch) {
      document.body.style.overflow = "hidden";
      const t1 = setTimeout(() => {
        document.body.style.overflow = "";
        setPhase("done");
        setOverlayAlpha(0);
      }, 1400);
      return () => {
        clearTimeout(t1);
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "hidden";

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let raf = 0;
    let currentPhase: Phase = "converge";
    let phaseStart = performance.now();
    let overlayCurrent = 1;

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function buildParticles() {
      // Render the target word into an offscreen canvas, sample its
      // pixels. Each lit pixel becomes a particle target.
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.floor(width));
      off.height = Math.max(1, Math.floor(height));
      const oc = off.getContext("2d");
      if (!oc) return;

      const word = "Studio.";
      // Auto-fit font size to the viewport width
      let fontSize = Math.min(width / 4.5, 260);
      oc.font = `800 ${fontSize}px Archivo, system-ui, sans-serif`;
      while (oc.measureText(word).width > width * 0.78 && fontSize > 40) {
        fontSize -= 4;
        oc.font = `800 ${fontSize}px Archivo, system-ui, sans-serif`;
      }
      const textWidth = oc.measureText(word).width;
      const drawX = (width - textWidth) / 2;
      const drawY = height / 2 + fontSize * 0.34;
      oc.fillStyle = "#FFFFFF";
      oc.fillText(word, drawX, drawY);

      // Sample pixels at a step
      const step = Math.max(4, Math.floor(fontSize / 40));
      const data = oc.getImageData(0, 0, off.width, off.height).data;
      const newParticles: Particle[] = [];

      for (let py = 0; py < off.height; py += step) {
        for (let px = 0; px < off.width; px += step) {
          const idx = (py * off.width + px) * 4;
          if (data[idx + 3] > 130) {
            // Random spawn position somewhere far from viewport centre
            const angle = Math.random() * Math.PI * 2;
            const radius =
              Math.max(width, height) * (0.7 + Math.random() * 0.5);
            const bx = width / 2 + Math.cos(angle) * radius;
            const by = height / 2 + Math.sin(angle) * radius;

            newParticles.push({
              x: bx,
              y: by,
              vx: 0,
              vy: 0,
              hx: px,
              hy: py,
              bx,
              by,
              alpha: 0.5 + Math.random() * 0.4,
              size: 1.1 + Math.random() * 0.6,
              driftSeed: Math.random() * 1000,
            });
          }
        }
      }
      particlesRef.current = newParticles;
    }

    resize();
    window.addEventListener("resize", resize);

    function setPhaseInternal(p: Phase) {
      currentPhase = p;
      phaseStart = performance.now();
      setPhase(p);
      phaseStartRef.current = phaseStart;
    }

    function frame() {
      if (!ctx) return;
      const now = performance.now();
      const elapsed = now - phaseStart;

      // Slower trail-fade for soft motion blur
      ctx.fillStyle = "rgba(10, 10, 11, 0.22)";
      ctx.fillRect(0, 0, width, height);

      const parts = particlesRef.current;

      if (currentPhase === "converge") {
        const t = Math.min(elapsed / T_CONVERGE, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        for (const p of parts) {
          // Lerp from base toward home target with easing
          p.x = p.bx + (p.hx - p.bx) * eased;
          p.y = p.by + (p.hy - p.by) * eased;
        }
        if (t >= 1) setPhaseInternal("hold");
      } else if (currentPhase === "hold") {
        // Particles gently breathe around their home position
        const breath = Math.sin(elapsed / 350) * 0.6;
        for (const p of parts) {
          p.x = p.hx + Math.sin(elapsed / 600 + p.driftSeed) * breath;
          p.y =
            p.hy + Math.cos(elapsed / 750 + p.driftSeed * 0.7) * breath;
        }
        if (elapsed > T_HOLD) setPhaseInternal("disperse");
      } else if (currentPhase === "disperse") {
        const t = Math.min(elapsed / T_DISPERSE, 1);
        const eased = t * t;
        for (const p of parts) {
          // Lerp outward — but to a NEW random outside-viewport target so
          // it feels like dispersion, not retract
          if (eased === 0) continue;
          const dirX = p.hx - width / 2;
          const dirY = p.hy - height / 2;
          const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
          const outX =
            width / 2 + (dirX / len) * Math.max(width, height) * 1.1;
          const outY =
            height / 2 + (dirY / len) * Math.max(width, height) * 1.1;
          p.x = p.hx + (outX - p.hx) * eased;
          p.y = p.hy + (outY - p.hy) * eased;
        }
        if (t >= 1) setPhaseInternal("fade");
      } else if (currentPhase === "fade") {
        const t = Math.min(elapsed / T_FADE, 1);
        overlayCurrent = 1 - t;
        setOverlayAlpha(overlayCurrent);
        if (t >= 1) {
          setPhaseInternal("done");
          document.body.style.overflow = "";
          return;
        }
      }

      // Compute period region — the rightmost band of particles is the trailing
      // dot. Use a generous threshold so the WHOLE period reads blue, not just
      // one stray particle.
      let maxHx = 0;
      let minHx = Infinity;
      for (const p of parts) {
        if (p.hx > maxHx) maxHx = p.hx;
        if (p.hx < minHx) minHx = p.hx;
      }
      const textWidth = maxHx - minHx;
      // Period in Archivo ~ 4–6% of the text width at this scale. Add buffer.
      const dotThreshold = maxHx - Math.max(40, textWidth * 0.055);

      // Draw particles — period is full accent blue, everything else white
      for (const p of parts) {
        let alpha = p.alpha;
        if (currentPhase === "disperse") {
          const t = elapsed / T_DISPERSE;
          alpha = p.alpha * (1 - t * 0.8);
        }
        if (alpha <= 0.02) continue;

        const isPeriod = p.hx > dotThreshold;
        ctx.fillStyle = isPeriod
          ? `rgba(37, 99, 235, ${alpha})`
          : `rgba(250, 250, 250, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-auto overflow-hidden"
      style={{
        backgroundColor: `rgba(10, 10, 11, ${overlayAlpha})`,
        opacity: overlayAlpha,
        transition: undefined,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Touch-device fallback: simple text fade, no canvas particles */}
      <div className="md:hidden absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="font-heading font-800 text-text-primary preloader-touch-fade"
          style={{ fontSize: "clamp(3.5rem, 22vw, 7rem)" }}
        >
          Studio<span className="text-accent">.</span>
        </span>
      </div>

      {/* Top-left tag — small, on-brand, no flashy gradient */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center gap-2.5 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-text-secondary">
          coming into focus
        </span>
      </div>

      {/* Bottom-left phase label */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10 z-10">
        <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-text-tertiary">
          <span className="text-accent">›</span>{" "}
          {phase === "converge"
            ? "assembling"
            : phase === "hold"
              ? "online"
              : phase === "disperse"
                ? "releasing"
                : "ready"}
        </span>
      </div>
    </div>
  );
}
