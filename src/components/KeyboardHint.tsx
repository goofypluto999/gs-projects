"use client";

import { useEffect, useState } from "react";

/**
 * Subtle keyboard shortcut hint — appears bottom-left after a short delay.
 * Cycles two hints (Esc dismiss, scroll-to-top). Auto-hides at 12s,
 * dismissible by Esc.
 */
export function KeyboardHint() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const t1 = setTimeout(() => setVisible(true), 2500);
    const t2 = setTimeout(() => setVisible(false), 14_000);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setVisible(false);
        setDismissed(true);
      }
      // T = go to top, B = bottom
      if ((e.key === "t" || e.key === "T") && !e.metaKey && !e.ctrlKey) {
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        )
          return;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if ((e.key === "b" || e.key === "B") && !e.metaKey && !e.ctrlKey) {
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        )
          return;
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
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
      className={`keyboard-hint fixed bottom-6 left-6 z-30 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface/80 backdrop-blur-md text-text-tertiary text-[11px] transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg border border-border text-text-secondary">
        T
      </kbd>
      <span className="tracking-wide">top</span>
      <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg border border-border text-text-secondary">
        B
      </kbd>
      <span className="tracking-wide">bottom</span>
      <span className="text-text-tertiary/60">·</span>
      <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg border border-border text-text-secondary">
        Esc
      </kbd>
      <span className="tracking-wide">dismiss</span>
    </div>
  );
}
