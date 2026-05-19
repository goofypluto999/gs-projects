"use client";

import { useEffect, useRef, useState } from "react";

/**
 * STUDIO ECHO — a sonar/calibration-instrument preloader.
 *
 * Concept: the site is "calibrating" before it shows the work. A
 * central node emits concentric echo rings outward, each ring slightly
 * displaced by noise so it reads as a real acoustic pulse rather than
 * a perfect circle. Statements appear in cardinal positions as rings
 * pass through them. A radar grid sits underneath. Final shockwave
 * fills the viewport and ripple-dissolves to reveal the hero.
 *
 * Hand-rolled canvas 2D. No library, no template. The noise displacement
 * is computed per-frame so no two pageloads draw exactly the same rings.
 *
 * Sequence (~3.6s):
 *   0.0s — black, central node pulse, radar grid fades in
 *   0.4s — Ring 1 emits (accent blue)
 *   0.7s — Ring 2 emits (purple)
 *   1.0s — Ring 3 emits (emerald), nameplate types out
 *   1.4s — Statements pop in (TOP/BOTTOM/LEFT/RIGHT)
 *   2.2s — Sequence repeats with rapid rings
 *   3.0s — Final shockwave expands to fill
 *   3.4s — Ripple dissolve reveals page
 */

interface Statement {
  text: string;
  position: "top" | "bottom" | "left" | "right";
}

const statements: Statement[] = [
  { text: "STUDIO", position: "top" },
  { text: "EST. 2023", position: "bottom" },
  { text: "FIVE LIVE PRODUCTS", position: "left" },
  { text: "ONE OPERATOR", position: "right" },
];

interface Ring {
  radius: number;
  maxRadius: number;
  speed: number;
  color: string;
  alpha: number;
  born: number;
  // Noise seed per ring so each looks slightly different
  seed: number;
}

const SEQUENCE_DURATION = 3600;
const FADE_DURATION = 600;

export function Preloader() {
  const [done, setDone] = useState(false);
  const [fading, setFading] = useState(false);
  const [statementsVisible, setStatementsVisible] = useState(false);
  const [nameplate, setNameplate] = useState("");
  // Client-only random coords (avoid SSR hydration mismatch)
  const [randomCoords, setRandomCoords] = useState({ coord: "0000", phase: "00" });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringsRef = useRef<Ring[]>([]);
  const lastRingEmitRef = useRef(0);
  const shockwaveRef = useRef<{ radius: number; active: boolean }>({
    radius: 0,
    active: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    // Set random coords AFTER hydration so server/client match
    setRandomCoords({
      coord: Math.floor(Math.random() * 9999).toString().padStart(4, "0"),
      phase: Math.floor(Math.random() * 99).toString().padStart(2, "0"),
    });

    document.body.style.overflow = "hidden";

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

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
    }
    resize();
    window.addEventListener("resize", resize);

    const startTime = performance.now();
    const cx = () => width / 2;
    const cy = () => height / 2;

    const ringPalette = [
      "rgba(37, 99, 235, ",   // blue
      "rgba(168, 85, 247, ",  // purple
      "rgba(16, 185, 129, ",  // emerald
      "rgba(250, 250, 250, ", // white highlight
    ];

    function emitRing(palette: number, speed = 0.8, maxR?: number) {
      const r: Ring = {
        radius: 0,
        maxRadius: maxR ?? Math.max(width, height),
        speed,
        color: ringPalette[palette % ringPalette.length],
        alpha: 1,
        born: performance.now(),
        seed: Math.random() * 1000,
      };
      ringsRef.current.push(r);
    }

    // Schedule statements + nameplate
    const t1 = setTimeout(() => setStatementsVisible(true), 1100);
    const t2 = setTimeout(() => {
      const target = "STUDIO · GIOVANNI SIZINO · 2026";
      let i = 0;
      const typeId = setInterval(() => {
        setNameplate(target.slice(0, i + 1));
        i++;
        if (i >= target.length) clearInterval(typeId);
      }, 26);
    }, 700);

    // Schedule shockwave at end
    const t3 = setTimeout(() => {
      shockwaveRef.current.active = true;
    }, SEQUENCE_DURATION - 600);

    // Schedule dismiss
    const t4 = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setDone(true);
        document.body.style.overflow = "";
      }, FADE_DURATION);
    }, SEQUENCE_DURATION);

    let raf = 0;

    function drawGrid(elapsed: number) {
      const gridAlpha = Math.min(0.18, elapsed / 800 * 0.18);
      ctx!.strokeStyle = `rgba(250, 250, 250, ${gridAlpha * 0.3})`;
      ctx!.lineWidth = 0.5;
      const step = 60;
      for (let x = (cx() % step); x < width; x += step) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = (cy() % step); y < height; y += step) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }

      // Concentric reference circles
      ctx!.strokeStyle = `rgba(250, 250, 250, ${gridAlpha * 0.4})`;
      for (let r = 100; r < Math.max(width, height); r += 120) {
        ctx!.beginPath();
        ctx!.arc(cx(), cy(), r, 0, Math.PI * 2);
        ctx!.stroke();
      }

      // Crosshair
      ctx!.strokeStyle = `rgba(37, 99, 235, ${gridAlpha * 1.4})`;
      ctx!.lineWidth = 0.6;
      ctx!.beginPath();
      ctx!.moveTo(cx() - 20, cy());
      ctx!.lineTo(cx() + 20, cy());
      ctx!.moveTo(cx(), cy() - 20);
      ctx!.lineTo(cx(), cy() + 20);
      ctx!.stroke();
    }

    function drawCentralPulse(elapsed: number) {
      // Breathing dot at the centre — pulses 0..1 every 1200ms
      const pulse = (Math.sin(elapsed / 600) + 1) / 2;
      const rad = 4 + pulse * 3;

      // Outer glow
      const grad = ctx!.createRadialGradient(cx(), cy(), 0, cx(), cy(), 24);
      grad.addColorStop(0, "rgba(37, 99, 235, 0.6)");
      grad.addColorStop(1, "rgba(37, 99, 235, 0)");
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(cx(), cy(), 24, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = "#FAFAFA";
      ctx!.beginPath();
      ctx!.arc(cx(), cy(), rad, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawRing(r: Ring) {
      // Ring lifetime
      const age = (performance.now() - r.born) / 1000;
      r.radius = age * 220 * r.speed;
      r.alpha = Math.max(0, 1 - r.radius / r.maxRadius);

      if (r.radius < 1 || r.alpha < 0.01) return;

      // Wobbly ring — 80 sample points around the circle, each
      // displaced by deterministic noise based on angle + seed.
      ctx!.beginPath();
      const segments = 80;
      const wobble = 6;
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const n =
          Math.sin(a * 5 + r.seed) * 0.6 +
          Math.sin(a * 11 - r.seed * 0.7) * 0.3 +
          Math.cos(a * 17 + r.seed * 0.4) * 0.1;
        const rad = r.radius + n * wobble;
        const x = cx() + Math.cos(a) * rad;
        const y = cy() + Math.sin(a) * rad;
        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = `${r.color}${r.alpha * 0.85})`;
      ctx!.lineWidth = 1.4;
      ctx!.stroke();

      // Inner faint companion line (offset by 6px) for that "echo" feel
      ctx!.beginPath();
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const n =
          Math.sin(a * 5 + r.seed) * 0.6 +
          Math.sin(a * 11 - r.seed * 0.7) * 0.3;
        const rad = r.radius - 6 + n * wobble * 0.5;
        const x = cx() + Math.cos(a) * rad;
        const y = cy() + Math.sin(a) * rad;
        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = `${r.color}${r.alpha * 0.4})`;
      ctx!.lineWidth = 0.6;
      ctx!.stroke();
    }

    function drawShockwave(elapsed: number) {
      // Final fill — a HUGE distorted ring that consumes everything
      if (!shockwaveRef.current.active) return;
      const swElapsed = elapsed - (SEQUENCE_DURATION - 600);
      const t = Math.min(swElapsed / 600, 1);
      shockwaveRef.current.radius = t * Math.max(width, height) * 1.2;

      const grad = ctx!.createRadialGradient(
        cx(),
        cy(),
        Math.max(0, shockwaveRef.current.radius - 60),
        cx(),
        cy(),
        shockwaveRef.current.radius
      );
      grad.addColorStop(0, "rgba(250, 250, 250, 0)");
      grad.addColorStop(0.5, "rgba(37, 99, 235, 0.4)");
      grad.addColorStop(1, "rgba(250, 250, 250, 0)");

      ctx!.beginPath();
      const segments = 96;
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const n =
          Math.sin(a * 7 + elapsed / 400) * 0.5 +
          Math.cos(a * 13 - elapsed / 300) * 0.3;
        const rad = shockwaveRef.current.radius + n * 24;
        const x = cx() + Math.cos(a) * rad;
        const y = cy() + Math.sin(a) * rad;
        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = 24;
      ctx!.stroke();
    }

    function frame() {
      if (!ctx) return;
      const elapsed = performance.now() - startTime;

      // Trail-fade
      ctx.fillStyle = "rgba(10, 10, 11, 0.22)";
      ctx.fillRect(0, 0, width, height);

      drawGrid(elapsed);
      drawCentralPulse(elapsed);

      // Emit rings at variable cadence
      const emitInterval = elapsed > 1800 ? 220 : 360;
      if (performance.now() - lastRingEmitRef.current > emitInterval) {
        const palette = Math.floor(elapsed / 360) % 3;
        const speed = elapsed > 1800 ? 1.1 : 0.85;
        emitRing(palette, speed);
        lastRingEmitRef.current = performance.now();
      }

      // Update + draw rings
      ringsRef.current = ringsRef.current.filter((r) => r.alpha > 0.01);
      for (const r of ringsRef.current) {
        drawRing(r);
      }

      drawShockwave(elapsed);

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-bg pointer-events-auto overflow-hidden"
      style={{
        opacity: fading ? 0 : 1,
        transition: fading
          ? `opacity ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
          : undefined,
      }}
      aria-hidden="true"
    >
      {/* Echo canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Top tag */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center gap-2.5 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-text-secondary">
          calibrating field
        </span>
      </div>

      {/* Top-right status with scrolling values */}
      <div className="absolute top-6 right-6 md:top-8 md:right-10 z-10 text-right">
        <div className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-text-tertiary mb-1">
          <span className="text-accent">›</span> sequence 01
        </div>
        <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-text-tertiary tabular-nums">
          coord {randomCoords.coord} · phase {randomCoords.phase}
        </div>
      </div>

      {/* Cardinal statements appearing as rings pass */}
      {statements.map((s) => {
        const baseStyle: React.CSSProperties = {
          opacity: statementsVisible ? 1 : 0,
          transition:
            "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay:
            s.position === "top"
              ? "0ms"
              : s.position === "right"
                ? "150ms"
                : s.position === "bottom"
                  ? "300ms"
                  : "450ms",
        };

        let pos: React.CSSProperties = {};
        let translate = "";
        if (s.position === "top") {
          pos = { top: "18%", left: "50%" };
          translate = statementsVisible
            ? "translate(-50%, 0)"
            : "translate(-50%, -16px)";
        } else if (s.position === "bottom") {
          pos = { bottom: "22%", left: "50%" };
          translate = statementsVisible
            ? "translate(-50%, 0)"
            : "translate(-50%, 16px)";
        } else if (s.position === "left") {
          pos = { top: "50%", left: "9%" };
          translate = statementsVisible
            ? "translate(0, -50%)"
            : "translate(-16px, -50%)";
        } else {
          pos = { top: "50%", right: "9%" };
          translate = statementsVisible
            ? "translate(0, -50%)"
            : "translate(16px, -50%)";
        }

        return (
          <div
            key={s.position}
            className="absolute z-10 font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-text-secondary"
            style={{
              ...baseStyle,
              ...pos,
              transform: translate,
            }}
          >
            <span className="text-accent mr-2">›</span>
            {s.text}
          </div>
        );
      })}

      {/* Bottom-center nameplate that types out */}
      <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-10 text-center">
        <div className="font-mono text-[11px] md:text-[12px] tracking-[0.3em] uppercase text-text-primary tabular-nums">
          {nameplate}
          <span className="preloader-cursor inline-block w-[10px] ml-1 bg-accent" style={{ height: "1em", verticalAlign: "middle" }} />
        </div>
      </div>
    </div>
  );
}
