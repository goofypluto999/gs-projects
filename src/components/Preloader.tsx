"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cinematic preloader. Three beats in ~1.6s:
 *   1. Massive 00→99 counter ticks up (tabular-nums) on left
 *   2. A status-line scrambles through micro-statements right side
 *   3. At 100, the counter shatters into particles + the panel
 *      slide-clips upward, revealing the page underneath
 *
 * On-brand: same colour system as the rest of the site, mono-feel
 * status copy ("compiling.work", "warming.field"), accent dot.
 *
 * No external dependencies, pure canvas + DOM. Respects
 * prefers-reduced-motion (renders + dismisses instantly).
 */

const LOADING_PHRASES = [
  "studio.boot",
  "fetching.work",
  "warming.field",
  "calibrating.signal",
  "rendering.brand",
  "ready",
];

const PROGRESS_DURATION = 1400; // counter run
const HOLD_AT_100 = 280;
const SHATTER_DURATION = 700;
const LIFT_DURATION = 700;

interface ShatterParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export function Preloader() {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<
    "counting" | "shatter" | "lifting" | "done"
  >("counting");
  const [phrase, setPhrase] = useState(LOADING_PHRASES[0]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced-motion: skip the whole sequence
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    document.body.style.overflow = "hidden";

    // PHASE 1 — counter ticks up
    let startCount = performance.now();
    let phraseIdx = 0;
    setPhrase(LOADING_PHRASES[0]);

    const phraseTimer = setInterval(() => {
      phraseIdx = Math.min(phraseIdx + 1, LOADING_PHRASES.length - 1);
      setPhrase(LOADING_PHRASES[phraseIdx]);
    }, PROGRESS_DURATION / LOADING_PHRASES.length);

    function tickCount(now: number) {
      const elapsed = now - startCount;
      const progress = Math.min(elapsed / PROGRESS_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * 100));
      if (progress < 1) {
        requestAnimationFrame(tickCount);
      } else {
        clearInterval(phraseTimer);
        setPhrase("ready");
        setCount(100);
        setTimeout(triggerShatter, HOLD_AT_100);
      }
    }
    requestAnimationFrame(tickCount);

    function triggerShatter() {
      setPhase("shatter");
      shatterCounter();
    }

    function shatterCounter() {
      // Capture the "100" rendered DOM bounds → sample its pixels → spawn
      // particles at every lit pixel. Particles fly outward with random
      // velocity, fading over SHATTER_DURATION.
      const counterEl = counterRef.current;
      const canvas = canvasRef.current;
      if (!counterEl || !canvas) {
        startLift();
        return;
      }

      const rect = counterEl.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        startLift();
        return;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Render "100" into an offscreen canvas at the exact size
      const off = document.createElement("canvas");
      off.width = Math.ceil(rect.width);
      off.height = Math.ceil(rect.height);
      const oc = off.getContext("2d");
      if (!oc) {
        startLift();
        return;
      }

      const style = window.getComputedStyle(counterEl);
      oc.fillStyle = style.color;
      oc.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      oc.textBaseline = "top";
      oc.fillText("100", 0, 0);

      const pixels = oc.getImageData(0, 0, off.width, off.height).data;
      const particles: ShatterParticle[] = [];
      const step = 3;
      for (let py = 0; py < off.height; py += step) {
        for (let px = 0; px < off.width; px += step) {
          const idx = (py * off.width + px) * 4;
          const alpha = pixels[idx + 3];
          if (alpha > 130) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4.5;
            particles.push({
              x: rect.left + px,
              y: rect.top + py,
              vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.2,
              vy: Math.sin(angle) * speed - 1.5,
              size: 1.6 + Math.random() * 1.0,
              color: "#FAFAFA",
              alpha: 1,
            });
          }
        }
      }

      // Hide the original counter so it doesn't double up
      counterEl.style.visibility = "hidden";

      const start = performance.now();
      function animate(now: number) {
        const elapsed = now - start;
        const t = Math.min(elapsed / SHATTER_DURATION, 1);
        ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18; // gravity pull
          p.vx *= 0.985;
          p.alpha = 1 - t;

          if (!ctx) continue;
          ctx.fillStyle = `rgba(250, 250, 250, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - t * 0.4), 0, Math.PI * 2);
          ctx.fill();

          // Subtle accent halo on a fraction of particles
          if (p.size > 2.1) {
            ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 1.8 * (1 - t * 0.3), 0, Math.PI * 2);
            ctx.fill();
          }
        }
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          startLift();
        }
      }
      requestAnimationFrame(animate);
    }

    function startLift() {
      setPhase("lifting");
      // CSS transition handles the slide-clip in the wrapper element
      setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = "";
      }, LIFT_DURATION);
    }

    return () => {
      clearInterval(phraseTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[100] bg-bg pointer-events-auto overflow-hidden"
      style={{
        transform: phase === "lifting" ? "translateY(-100%)" : "translateY(0)",
        transition:
          phase === "lifting"
            ? `transform ${LIFT_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)`
            : undefined,
        clipPath: phase === "lifting" ? "inset(0 0 0 0)" : undefined,
      }}
      aria-hidden="true"
    >
      {/* Field grid background */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, rgba(37,99,235,0.18) 0%, transparent 55%), radial-gradient(circle at 75% 75%, rgba(168,85,247,0.14) 0%, transparent 55%)",
        }}
      />

      {/* Top-left brand mark */}
      <div className="absolute top-6 left-6 flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-text-secondary">
          STUDIO · SIZINO ENNES
        </span>
      </div>

      {/* Top-right scrambling phrase */}
      <div className="absolute top-6 right-6 font-mono text-[11px] tracking-[0.2em] text-text-tertiary">
        <span className="text-accent">›</span> {phrase}
      </div>

      {/* MASSIVE counter, bottom-left */}
      <div className="absolute left-6 md:left-12 bottom-12 flex items-end gap-3">
        <span
          ref={counterRef}
          className="font-heading font-800 tabular-nums text-text-primary leading-[0.85] tracking-[-0.05em]"
          style={{ fontSize: "clamp(7rem, 22vw, 22rem)" }}
        >
          {String(count).padStart(3, "0")}
        </span>
      </div>

      {/* Centre-right small label */}
      <div className="absolute right-6 md:right-12 bottom-16">
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary mb-2">
            building hero
          </div>
          <div className="font-mono text-[11px] tracking-[0.18em] text-text-secondary">
            v1 ·{" "}
            <span className="text-accent">{Math.floor(count)}</span>
            <span className="text-text-tertiary">/100</span>
          </div>
        </div>
      </div>

      {/* Bottom thin progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border">
        <div
          className="h-full bg-accent origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            transition: "transform 80ms linear",
          }}
        />
      </div>

      {/* Shatter canvas (only painted during shatter phase) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
