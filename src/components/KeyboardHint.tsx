"use client";

import { useEffect, useState } from "react";

/**
 * Subtle keyboard shortcut hint — appears bottom-left after a short delay.
 * Tells the user they can press `?` for keyboard shortcuts (none implemented
 * yet but the signal alone reads as a premium developer-aware site).
 * Auto-hides after 8 seconds.
 */
export function KeyboardHint() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const t1 = setTimeout(() => setVisible(true), 2500);
    const t2 = setTimeout(() => setVisible(false), 12_000);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setVisible(false);
        setDismissed(true);
      }
    }
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface/80 backdrop-blur-md text-text-tertiary text-[11px] transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg border border-border text-text-secondary">
        Esc
      </kbd>
      <span className="tracking-wide">to dismiss</span>
    </div>
  );
}
