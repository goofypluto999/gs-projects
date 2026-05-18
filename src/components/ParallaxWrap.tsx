"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxWrapProps {
  children: ReactNode;
  /** Vertical drift in px as the section passes the viewport */
  drift?: number;
  className?: string;
}

/**
 * Scroll-driven parallax wrapper. As the section scrolls past, content
 * drifts upward by `drift` px relative to its natural position.
 * Scrubs to Lenis-driven ScrollTrigger.
 */
export function ParallaxWrap({
  children,
  drift = 60,
  className = "",
}: ParallaxWrapProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: drift },
        {
          y: -drift,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [drift]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
