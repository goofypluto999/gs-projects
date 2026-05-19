"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleText } from "./ScrambleText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SectionDividerProps {
  /** Optional tiny label centred on the line */
  label?: string;
}

/**
 * Thin horizontal accent line that draws across the page as you scroll past it.
 * Optional centred label (e.g. "002 · projects"). GSAP scrollTrigger scrub.
 */
export function SectionDivider({ label }: SectionDividerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (lineRef.current) lineRef.current.style.transform = "scaleX(1)";
      if (labelRef.current) labelRef.current.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
      if (labelRef.current) gsap.set(labelRef.current, { opacity: 0 });

      gsap.to(lineRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 90%",
          end: "top 40%",
          scrub: 0.5,
        },
      });

      if (labelRef.current) {
        gsap.to(labelRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 70%",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative px-6 py-10 md:py-16">
      <div className="mx-auto max-w-[1280px] flex items-center gap-6">
        <div
          ref={lineRef}
          className="flex-1 h-px bg-border"
        />
        {label && (
          <span
            ref={labelRef}
            className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary whitespace-nowrap"
          >
            <ScrambleText text={label} duration={800} />
          </span>
        )}
        <div className="flex-1 h-px bg-border" style={{ transform: "scaleX(0)", transformOrigin: "right center" }} />
      </div>
    </div>
  );
}
