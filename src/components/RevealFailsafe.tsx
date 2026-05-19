"use client";

import { useEffect } from "react";

/**
 * RevealFailsafe — last-resort safety net for GSAP-from scroll reveals.
 *
 * Several components on this page use `gsap.from({opacity: 0, y: ...})`
 * with ScrollTrigger to fade content in as it scrolls into view. If GSAP
 * fails to load (ad-blocker, slow CDN, JS error), or if ScrollTrigger's
 * positions are stale (viewport resize race), elements stay stuck at
 * opacity:0 forever and the user sees blank space.
 *
 * Five seconds after mount, this scans the DOM for any element with an
 * inline opacity:0 plus a translateY transform — the unmistakable GSAP
 * "from" signature — and forces it visible with a soft fade. Real
 * GSAP-driven reveals normally complete well within 5s of being scrolled
 * into view, so honest reveals are never overridden.
 */
export function RevealFailsafe() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Reduced motion already gets all elements visible from the
      // per-component handling. Skip the failsafe.
      return;
    }

    const REVEAL_AFTER_MS = 5000;
    let cancelled = false;

    const timer = setTimeout(() => {
      if (cancelled) return;
      const stuck: HTMLElement[] = [];
      document.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
        const inline = el.getAttribute("style") || "";
        // Match GSAP's exact inline signature: opacity:0 + translate3d/translate transform
        if (
          /opacity:\s*0\b/.test(inline) &&
          /transform:\s*translate/i.test(inline)
        ) {
          stuck.push(el);
        }
      });

      if (stuck.length === 0) return;

      stuck.forEach((el) => {
        el.style.transition =
          "opacity 600ms ease, transform 600ms cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.opacity = "1";
        // Reset translateY/translateX to 0 while preserving rotate/scale
        el.style.transform = el.style.transform.replace(
          /translate(3d|X|Y)?\([^)]*\)/gi,
          "translate(0px, 0px)"
        );
      });

      if (process.env.NODE_ENV !== "production") {
        console.info(
          `[RevealFailsafe] Force-revealed ${stuck.length} stuck element(s).`
        );
      }
    }, REVEAL_AFTER_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return null;
}
