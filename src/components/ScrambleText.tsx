"use client";

import { useEffect, useRef, useState } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Trigger reveal once when this element scrolls into view */
  scrollTriggered?: boolean;
  duration?: number;
}

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________";

/**
 * Matrix-style scramble reveal — each character cycles through random
 * glyphs before settling on the target. Used for big-impact reveals on
 * key copy. Triggers once when in view.
 */
export function ScrambleText({
  text,
  className = "",
  scrollTriggered = true,
  duration = 900,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(text);
  const triggered = useRef(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayed(text);
      return;
    }

    function scramble() {
      if (triggered.current) return;
      triggered.current = true;
      const start = performance.now();
      const targetLength = text.length;

      function frame(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // How many characters have "locked in"
        const lockedCount = Math.floor(progress * targetLength);

        let out = "";
        for (let i = 0; i < targetLength; i++) {
          if (i < lockedCount) {
            out += text[i];
          } else if (text[i] === " " || text[i] === "\n") {
            out += text[i];
          } else {
            out +=
              SCRAMBLE_CHARS[
                Math.floor(Math.random() * SCRAMBLE_CHARS.length)
              ];
          }
        }
        setDisplayed(out);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          setDisplayed(text);
        }
      }
      requestAnimationFrame(frame);
    }

    if (!scrollTriggered) {
      scramble();
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scramble();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, duration, scrollTriggered]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {displayed}
    </span>
  );
}
