"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Subtle dual-ring custom cursor (Linear/Vercel-inspired).
 * Small inner dot follows cursor 1:1, outer ring lags with elastic delay.
 * Outer ring scales up on hover over [data-cursor="link"] elements.
 * Only renders on devices with hover capability — never on touch.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0, ease: "none" });
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.45,
        ease: "power3.out",
      });
    }

    function onEnter(e: Event) {
      const target = e.target as HTMLElement;
      const type = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      if (type === "link") {
        gsap.to(ring, { scale: 2.2, opacity: 1, duration: 0.25 });
        gsap.to(dot, { scale: 0.3, opacity: 0.5, duration: 0.25 });
      }
    }

    function onLeave() {
      gsap.to(ring, { scale: 1, opacity: 0.7, duration: 0.25 });
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.25 });
    }

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // Hide native cursor
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="custom-cursor-ring fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-text-primary/30 pointer-events-none z-[200] mix-blend-difference"
        style={{ opacity: 0.7 }}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="custom-cursor-dot fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-text-primary pointer-events-none z-[200] mix-blend-difference"
        aria-hidden="true"
      />
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          html.custom-cursor-active,
          html.custom-cursor-active * {
            cursor: none !important;
          }
        }
        @media (hover: none) or (pointer: coarse) {
          .custom-cursor-ring,
          .custom-cursor-dot {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
