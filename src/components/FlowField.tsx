"use client";

import { useEffect, useRef } from "react";

/**
 * Stabilised flow field — ink-in-water style. Lower-frequency noise,
 * capped velocity, tighter colour palette (accent blue → soft white).
 * Stronger frame clear (no residue buildup), bounded particle lifespan.
 *
 * Hand-rolled: no Three.js, no shader library. The field maths is a
 * 2-octave pseudo-noise (sin/cos sum) fed time + position.
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
  maxLife: number;
  hue: number;
  size: number;
}

// Calmer 2-octave noise — predictable, no chaos.
function noise2(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.0028 + t * 0.00035) * 0.6 +
    Math.cos(y * 0.0032 - t * 0.00028 + x * 0.0009) * 0.4
  );
}

export function FlowField({
  className = "",
  density = 0.00014,
  repelRadius = 150,
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
    let lastFrame = performance.now();

    const MAX_SPEED = 2.6;

    function spawnParticle(p: Particle, w: number, h: number) {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.vx = 0;
      p.vy = 0;
      p.life = 0;
      p.maxLife = 180 + Math.random() * 140;
      p.hue = Math.random();
      p.size = 0.7 + Math.random() * 0.9;
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        260,
        Math.max(120, Math.floor(width * height * density))
      );
      particles = [];
      for (let i = 0; i < count; i++) {
        const p: Particle = {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          life: 0,
          maxLife: 0,
          hue: 0,
          size: 0,
        };
        spawnParticle(p, width, height);
        // Stagger lives so they don't all respawn together
        p.life = Math.random() * p.maxLife;
        particles.push(p);
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

    function frame(now: number) {
      if (!ctx) return;
      const dt = Math.min(2, (now - lastFrame) / 16.67); // normalised to 60fps
      lastFrame = now;
      timeAcc += dt;

      // Stronger trail-fade so we don't accumulate residue
      ctx.fillStyle = "rgba(10, 10, 11, 0.16)";
      ctx.fillRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseOn = mouseRef.current.active;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Field steer
        const n = noise2(p.x, p.y, timeAcc);
        const angle = n * Math.PI * 2;
        const speed = 0.45 + Math.abs(n) * 0.35;
        let fx = Math.cos(angle) * speed;
        let fy = Math.sin(angle) * speed;

        // Mouse repulsion (clamped)
        if (mouseOn) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelRadius && dist > 0) {
            const force = (1 - dist / repelRadius) * 2.4;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        }

        // Apply with damping
        p.vx = p.vx * 0.9 + fx * 0.1;
        p.vy = p.vy * 0.9 + fy * 0.1;

        // Hard velocity cap — prevents runaway clusters
        const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (sp > MAX_SPEED) {
          p.vx = (p.vx / sp) * MAX_SPEED;
          p.vy = (p.vy / sp) * MAX_SPEED;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life += dt;

        // Respawn when off-screen OR past lifespan
        if (
          p.x < -20 ||
          p.x > width + 20 ||
          p.y < -20 ||
          p.y > height + 20 ||
          p.life > p.maxLife
        ) {
          spawnParticle(p, width, height);
          continue;
        }

        // Tight palette: accent blue → soft purple → near-white highlight.
        // hue 0..1 maps to a 2-stop gradient, so no rainbow chaos.
        let r, g, b;
        const h = p.hue;
        if (h < 0.6) {
          // blue → purple
          const k = h / 0.6;
          r = Math.round(37 + (130 - 37) * k);
          g = Math.round(99 + (90 - 99) * k);
          b = Math.round(235 + (240 - 235) * k);
        } else {
          // purple → off-white highlight
          const k = (h - 0.6) / 0.4;
          r = Math.round(130 + (220 - 130) * k);
          g = Math.round(90 + (220 - 90) * k);
          b = Math.round(240 + (235 - 240) * k);
        }

        // Lifespan-based alpha: fade in 0→0.3, hold, fade out at end
        const lifeFrac = p.life / p.maxLife;
        let alpha;
        if (lifeFrac < 0.15) alpha = lifeFrac / 0.15;
        else if (lifeFrac > 0.85) alpha = (1 - lifeFrac) / 0.15;
        else alpha = 1;
        alpha *= 0.55;

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
