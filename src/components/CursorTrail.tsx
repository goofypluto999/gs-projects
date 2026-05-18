"use client";

import { useEffect, useRef } from "react";

/**
 * Mix-blend-difference cursor with delayed trailing ring + magnetic scale
 * on [data-cursor="link"] elements. Hides native cursor on desktop only,
 * touch / coarse pointer untouched.
 *
 * This is the cursor that says "this site is built by someone who knows
 * what they're doing." Stripe, Vercel, Linear all use a version of this.
 */
export function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("custom-cursor-active");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let scale = 1;
    let targetScale = 1;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    }

    function onOver(e: Event) {
      const target = e.target as HTMLElement;
      const link = target.closest(
        "a, button, [data-cursor='link'], [role='button']"
      );
      if (link) {
        targetScale = 2.4;
      } else {
        targetScale = 1;
      }
    }

    function tick() {
      // Trail interpolation (15% per frame = smooth ~10-frame lag)
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      scale += (targetScale - scale) * 0.18;
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${scale})`;
      }
      requestAnimationFrame(tick);
    }
    const handle = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      cancelAnimationFrame(handle);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      {/* Outer ring — slow follow */}
      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 w-9 h-9 rounded-full border border-white/60 pointer-events-none z-[200] mix-blend-difference"
        style={{
          transform: "translate(-100px, -100px)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />
      {/* Inner dot — instant */}
      <div
        ref={dotRef}
        className="cursor-dot fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[200] mix-blend-difference"
        style={{
          transform: "translate(-100px, -100px)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />

      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          html.custom-cursor-active,
          html.custom-cursor-active a,
          html.custom-cursor-active button,
          html.custom-cursor-active [role="button"] {
            cursor: none !important;
          }
        }
        @media (hover: none) or (pointer: coarse) {
          .cursor-ring,
          .cursor-dot {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
