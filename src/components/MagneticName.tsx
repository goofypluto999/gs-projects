"use client";

import { useEffect, useRef } from "react";

/**
 * The Hero name rendered as a canvas of particles arranged in the
 * shape of the letters. Cursor near a particle pushes it away; it
 * springs back over ~700ms. Mass interaction looks like ink scattering
 * around a finger and reforming into the wordmark.
 *
 * Pure 2D canvas, hand-rolled physics, no library. The letters are
 * sampled from an off-screen text raster — the canvas reads the text
 * pixels and turns each lit pixel into a particle with a "home" target.
 *
 * Desktop-only (lg+) — mobile uses the regular editorial wordmark.
 */

interface MagneticNameProps {
  /** Stack of lines to render */
  lines: {
    text: string;
    weight?: number;
    italic?: boolean;
    color?: string;
  }[];
  /** Container className */
  className?: string;
  /** Px to sample (grid step) — smaller = more particles, denser */
  samplingStep?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  size: number;
  color: string;
}

export function MagneticName({
  lines,
  className = "",
  samplingStep = 4,
}: MagneticNameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Static rendering fallback — paint the letters once
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintStatic(ctx, rect.width, rect.height);
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;

    function paintStatic(c: CanvasRenderingContext2D, w: number, h: number) {
      c.clearRect(0, 0, w, h);
      function fitLine(
        text: string,
        weight: number,
        italic: boolean,
        maxFont: number,
        maxWidth: number
      ): number {
        let size = maxFont;
        while (size > 24) {
          c.font = `${italic ? "italic" : "normal"} ${weight} ${size}px Archivo, system-ui, sans-serif`;
          const tw = c.measureText(text).width;
          if (tw <= maxWidth) return size;
          size -= 4;
        }
        return size;
      }

      const maxFontCap = Math.min(w / 5, 220);
      let y = 0;
      for (const line of lines) {
        const weight = line.weight ?? 800;
        const italic = !!line.italic;
        const size = fitLine(line.text, weight, italic, maxFontCap, w);
        const lineHeight = size * 0.95;
        c.fillStyle = line.color || "#FAFAFA";
        c.font = `${italic ? "italic" : "normal"} ${weight} ${size}px Archivo, system-ui, sans-serif`;
        y += size;
        c.fillText(line.text, 0, y);
        y += lineHeight - size;
      }
    }

    function build() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Render text onto an offscreen canvas at the displayed scale
      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const oc = off.getContext("2d");
      if (!oc) return;

      // Per-line autosize — measure each line at a large size and shrink
      // until it fits the canvas width. Bigger lines get more height.
      function fitLine(
        text: string,
        weight: number,
        italic: boolean,
        maxFont: number,
        maxWidth: number
      ): number {
        let size = maxFont;
        while (size > 24) {
          oc!.font = `${italic ? "italic" : "normal"} ${weight} ${size}px Archivo, system-ui, sans-serif`;
          const w = oc!.measureText(text).width;
          if (w <= maxWidth) return size;
          size -= 4;
        }
        return size;
      }

      const maxFontCap = Math.min(width / 5, 220);
      let yCursor = 0;
      const lineMeta: Array<{ y: number; h: number; color: string }> = [];
      const lineSizes: number[] = [];

      // First pass: figure out sizes
      for (const line of lines) {
        const weight = line.weight ?? 800;
        const italic = !!line.italic;
        const size = fitLine(line.text, weight, italic, maxFontCap, width);
        lineSizes.push(size);
      }

      // Second pass: render
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const size = lineSizes[i];
        const weight = line.weight ?? 800;
        const italic = !!line.italic;
        const lineHeight = size * 0.95;

        oc.fillStyle = line.color || "#FAFAFA";
        oc.font = `${italic ? "italic" : "normal"} ${weight} ${size}px Archivo, system-ui, sans-serif`;

        const startY = yCursor;
        yCursor += size; // baseline
        oc.fillText(line.text, 0, yCursor);
        lineMeta.push({
          y: startY,
          h: lineHeight,
          color: line.color || "#FAFAFA",
        });
        yCursor += lineHeight - size;
      }

      // Sample the offscreen canvas — every lit pixel above alpha
      // threshold becomes a particle with home = its raster position.
      const imageData = oc.getImageData(0, 0, width, height).data;
      const built: Particle[] = [];
      for (let py = 0; py < height; py += samplingStep) {
        for (let px = 0; px < width; px += samplingStep) {
          const idx = (py * width + px) * 4;
          const alpha = imageData[idx + 3];
          if (alpha > 128) {
            // Find which line this falls into to grab its colour
            let color = "#FAFAFA";
            for (const meta of lineMeta) {
              if (py >= meta.y && py < meta.y + meta.h) {
                color = meta.color;
                break;
              }
            }
            built.push({
              x: px + (Math.random() - 0.5) * 4,
              y: py + (Math.random() - 0.5) * 4,
              vx: 0,
              vy: 0,
              homeX: px,
              homeY: py,
              size: 1.4,
              color,
            });
          }
        }
      }
      particles = built;
    }

    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    }

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    // Rebuild after web fonts load so we measure Archivo not fallback
    if (document.fonts?.ready) {
      document.fonts.ready.then(build);
    }

    const REPEL_R = 90;

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Spring toward home
        const sx = (p.homeX - p.x) * 0.06;
        const sy = (p.homeY - p.y) * 0.06;

        // Mouse repulsion
        let rx = 0;
        let ry = 0;
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < REPEL_R * REPEL_R && dist2 > 0.1) {
          const dist = Math.sqrt(dist2);
          const force = (1 - dist / REPEL_R) * 6;
          rx = (dx / dist) * force;
          ry = (dy / dist) * force;
        }

        p.vx = (p.vx + sx + rx) * 0.78;
        p.vy = (p.vy + sy + ry) * 0.78;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 0.7, p.y - 0.7, p.size, p.size);
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
    // We intentionally only re-run on mount; lines changing is rare here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samplingStep]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      role="img"
      aria-label={lines.map((l) => l.text).join(" ")}
    />
  );
}
