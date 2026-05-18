"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Floating "back to top" pill — appears after 800px scroll, fades elegantly.
 * Bottom-right of viewport. Magnetic-style hover scale.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 800);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full border border-border bg-surface/80 backdrop-blur-md text-text-secondary hover:text-text-primary hover:border-border-hover hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <ArrowUp size={16} strokeWidth={1.5} />
    </button>
  );
}
