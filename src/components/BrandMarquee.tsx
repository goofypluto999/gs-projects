"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Brand {
  name: string;
  /** Accent colour pulled from the project — keeps the marquee in lockstep
   *  with each product's identity instead of all-white. */
  accent: string;
}

const brands: Brand[] = [
  { name: "FORESAY LABS", accent: "#6366F1" },
  { name: "AIMVANTAGE", accent: "#F59E0B" },
  { name: "WADDA PLAY", accent: "#A855F7" },
  { name: "CV MIRROR", accent: "#10B981" },
  { name: "ADSFORGE", accent: "#EF4444" },
];

/**
 * Massive full-bleed brand-name marquee. Hollywood-credits style.
 * Auto-scrolls horizontally AND accelerates as the user scrolls vertically
 * past the section — scroll-velocity-aware motion. The kind of strip that
 * makes the page feel ALIVE, not list-like.
 */
export function BrandMarquee() {
  const innerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const inner = innerRef.current;
    const section = sectionRef.current;
    if (!inner || !section) return;

    let baseTween: gsap.core.Tween | null = null;
    let scrollDriven: gsap.core.Tween | null = null;
    let velocity = 0;

    const ctx = gsap.context(() => {
      // Base auto-scroll loop
      baseTween = gsap.to(inner, {
        x: "-50%",
        ease: "none",
        repeat: -1,
        duration: 30,
      });

      // Scroll-velocity boost — when user scrolls fast, marquee speeds up
      scrollDriven = gsap.to(baseTween, {
        timeScale: 1,
        ease: "none",
      });
      // unused but kept silent
      if (scrollDriven) scrollDriven.pause();

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          velocity = Math.abs(self.getVelocity());
          // Normalise velocity: max +3x base speed
          const boost = Math.min(velocity / 1500, 2.5);
          if (baseTween) baseTween.timeScale(1 + boost);
        },
      });
    });

    // Ease the timeScale back to 1 when scrolling stops
    let raf = 0;
    function decay() {
      if (baseTween) {
        const ts = baseTween.timeScale();
        if (ts > 1.01) {
          baseTween.timeScale(ts + (1 - ts) * 0.06);
        } else if (ts < 1) {
          baseTween.timeScale(1);
        }
      }
      raf = requestAnimationFrame(decay);
    }
    raf = requestAnimationFrame(decay);

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  // Duplicate the list 2x so the loop is seamless (-50% scroll)
  const looped = [...brands, ...brands];

  return (
    <section
      ref={sectionRef}
      className="relative py-10 md:py-14 border-y border-border overflow-hidden bg-bg/40"
    >
      <div className="absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-bg to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-bg to-transparent pointer-events-none" />

      <div className="overflow-hidden">
        <div
          ref={innerRef}
          className="flex items-center gap-12 md:gap-20 whitespace-nowrap will-change-transform"
        >
          {looped.map((b, i) => (
            <span
              key={i}
              className="font-heading font-800 leading-none tracking-tighter cursor-default transition-opacity duration-300 hover:opacity-90"
              style={{
                fontSize: "clamp(2rem, 9vw, 8rem)",
                color: b.accent,
                textShadow: `0 0 24px ${b.accent}40`,
              }}
            >
              {b.name}
              <span className="text-text-primary">.</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
