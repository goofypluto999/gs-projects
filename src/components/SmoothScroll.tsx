"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Lenis smooth-scroll wrapper with proper GSAP ScrollTrigger integration.
 * - Disables native scroll-behavior smooth so it doesn't fight Lenis
 * - Drives ScrollTrigger.update() on Lenis tick so pin/scrub animations
 *   stay perfectly in sync
 * - Intercepts in-page anchor clicks (a[href^="#"]) and routes them
 *   through Lenis.scrollTo for a uniform smooth-jump
 * - Shorter duration (1.0s) than default for snappier feel without jerk
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Always turn off native CSS smooth scroll so it doesn't double up
    document.documentElement.style.scrollBehavior = "auto";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Native momentum scroll wins on touch devices — Lenis intercepting
    // touch events causes jank and inertia mismatch on iOS/Android.
    const isTouch =
      window.matchMedia("(hover: none) or (pointer: coarse)").matches;
    if (isTouch) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.4,
    });

    // Keep ScrollTrigger updated on every Lenis frame
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Intercept anchor clicks so they use Lenis scrollTo
    function onAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement | null)?.closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;
      if (href === "#") {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -64, duration: 1.2 });
      }
    }
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
