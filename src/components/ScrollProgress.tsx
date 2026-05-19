"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar at the top of the viewport — tracks scroll position.
 * Used by Vercel, Linear, GitHub. Subtle accent line that fills as you scroll.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const ratio = max > 0 ? h.scrollTop / max : 0;
      setProgress(Math.min(Math.max(ratio, 0), 1));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left"
        style={{
          // Multi-accent gradient across the 5 product colours. As the
          // user scrolls the bar fills left-to-right, fading from
          // Foresay indigo through the AdsForge red — the same palette
          // the marquee, spec cards, and per-card accents use.
          background:
            "linear-gradient(90deg, #6366F1 0%, #2563EB 22%, #A855F7 44%, #F59E0B 66%, #10B981 84%, #EF4444 100%)",
          transform: `scaleX(${progress})`,
          transition: "transform 60ms linear",
          boxShadow: "0 0 6px rgba(37, 99, 235, 0.35)",
        }}
      />
    </div>
  );
}
