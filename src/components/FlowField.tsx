"use client";

import { useEffect, useRef } from "react";

/**
 * Custom canvas flow field — particles drift along a procedurally
 * generated vector field (3-octave pseudo-noise), accumulating glow.
 * The cursor creates a repulsion well: particles bend around it.
 *
 * Hand-rolled. No Three.js, no shader library, no template. The
 * field maths is a deterministic combination of sin/cos at multiple
 * frequencies, fed time + position. The visual signature looks like
 * smoke / ink in water — but generated mathematically, not faked
 * with a video.
 *
 * Particles tinted on a gradient from accent-blue → purple → emerald
 * based on their position in the field, so the colour reads as
 * "the work itself flowing" rather than decoration.
 */

interface FlowFieldProps {
  className?: string;
  density?: number;
  /** Repulsion radius around the cursor in px */
  repelRadius?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
}

// Simple deterministic 2D noise — sum of sines at decreasing weights.
// Not Perlin but visually similar at field scale.
function noise2(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.0035 + t * 0.0004) * 0.5 +
    Math.sin(y * 0.0042 - t * 0.0003) * 0.5 +
    Math.sin((x + y) * 0.0018 + t * 0.0006) * 0.25 +
    Math.cos(x * 0.0017 - y * 0.0023 + t * 0.0002) * 0.25
  );
}

export function FlowField({
  className = "",
  density = 0.00025,
  repelRadius = 160,
}: FlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let timeAcc = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(120, Math.floor(width * height * density));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          life: Math.random() * 200,
          hue: Math.random() * 100,
          size: 0.7 + Math.random() * 1.3,
        });
      }
    }

    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    }
    function onLeave() {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    function frame() {
      if (!ctx) return;
      timeAcc += 1;

      // Slow trail-fade instead of full clear — gives the smoke trail
      ctx.fillStyle = "rgba(10, 10, 11, 0.10)";
      ctx.fillRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseOn = mouseRef.current.active;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Sample noise at particle position → angle
        const n = noise2(p.x, p.y, timeAcc);
        const angle = n * Math.PI * 2;
        const speed = 0.35 + Math.abs(n) * 0.55;
        let fx = Math.cos(angle) * speed;
        let fy = Math.sin(angle) * speed;

        // Mouse repulsion
        if (mouseOn) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelRadius && dist > 0) {
            const force = (1 - dist / repelRadius) * 4;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        }

        p.vx = p.vx * 0.86 + fx * 0.14;
        p.vy = p.vy * 0.86 + fy * 0.14;
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        // Wrap edges + respawn occasionally
        if (
          p.x < -10 ||
          p.x > width + 10 ||
          p.y < -10 ||
          p.y > height + 10 ||
          p.life > 400
        ) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.vx = 0;
          p.vy = 0;
          p.life = 0;
          p.hue = Math.random() * 100;
        }

        // Tint by position + hue: blue → purple → emerald
        const t = (p.x / width + p.hue / 100) % 1;
        let r, g, b;
        if (t < 0.5) {
          const k = t * 2;
          r = Math.round(37 + (168 - 37) * k);
          g = Math.round(99 + (85 - 99) * k);
          b = Math.round(235 + (247 - 235) * k);
        } else {
          const k = (t - 0.5) * 2;
          r = Math.round(168 + (16 - 168) * k);
          g = Math.round(85 + (185 - 85) * k);
          b = Math.round(247 + (129 - 247) * k);
        }

        const speedMag = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const alpha = Math.min(0.65, 0.18 + speedMag * 0.18);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
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
  }, [density, repelRadius]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
