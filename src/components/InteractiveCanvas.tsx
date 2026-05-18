"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive particle network in canvas — mouse pulls particles toward
 * itself, particles draw faint connecting lines when close. The kind of
 * effect Three.js / WebGL hero pages use, done in pure 2D canvas for
 * zero-dependency 60fps motion.
 *
 * Live, alive, responsive to cursor. Not decorative — it visibly reacts.
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface InteractiveCanvasProps {
  className?: string;
  density?: number;
  color?: string;
  lineColor?: string;
}

export function InteractiveCanvas({
  className = "",
  density = 0.00012,
  color = "rgba(37, 99, 235, 0.55)",
  lineColor = "rgba(99, 102, 241, ",
}: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

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

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rebuild particles to match new size
      const count = Math.max(40, Math.floor(width * height * density));
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.4 + 0.6,
        });
      }
      particlesRef.current = arr;
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

    const maxLinkDist = 130;
    const mouseRadius = 180;

    function step() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const parts = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];

        // Mouse magnetism
        if (mouseRef.current.active) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * 0.4;
            p.vx += (dx / dist) * force * 0.05;
            p.vy += (dy / dist) * force * 0.05;
          }
        }

        // Velocity decay
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connecting lines (only check forward to avoid O(n^2) doubling)
        for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j];
          const ddx = q.x - p.x;
          const ddy = q.y - p.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < maxLinkDist * maxLinkDist) {
            const a = (1 - Math.sqrt(d2) / maxLinkDist) * 0.18;
            ctx.strokeStyle = `${lineColor}${a})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density, color, lineColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
