"use client";

import { useEffect, useRef } from "react";

const CHARS = "!<>-_\\/[]{}=+*^?#$@&%~░▒▓█";

interface ScrambleLettersProps {
  text: string;
  className?: string;
  /** Per-letter wrapper class — for italic/bold variants */
  letterClass?: string;
  /** Scramble color */
  scrambleColor?: string;
  /** Distance in px at which a letter starts scrambling */
  radius?: number;
}

/**
 * Per-letter hover scramble: each character independently scrambles
 * when the cursor enters its bounding box (with radius). Letters
 * resolve back to their target after the cursor leaves.
 *
 * Used for the Hero name and any major editorial typography moment.
 * Pure DOM, 60fps, no library.
 */
export function ScrambleLetters({
  text,
  className = "",
  letterClass = "",
  scrambleColor = "var(--color-accent)",
  radius = 60,
}: ScrambleLettersProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    const letters = Array.from(
      wrap.querySelectorAll<HTMLSpanElement>("[data-letter]")
    );
    const targets = letters.map((l) => l.getAttribute("data-target") || "");
    const states = letters.map(() => ({
      scrambling: false,
      lastChange: 0,
    }));

    let raf = 0;
    let mouseX = -1000;
    let mouseY = -1000;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    function tick(now: number) {
      for (let i = 0; i < letters.length; i++) {
        const l = letters[i];
        const target = targets[i];

        // Skip whitespace / punctuation that's already revealed
        if (target === " " || target === " " || target === ".") {
          raf = requestAnimationFrame(tick);
          continue;
        }

        const rect = l.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          states[i].scrambling = true;
          if (now - states[i].lastChange > 32) {
            const ch =
              CHARS[Math.floor(Math.random() * CHARS.length)];
            l.textContent = ch;
            l.style.color = scrambleColor;
            states[i].lastChange = now;
          }
        } else if (states[i].scrambling) {
          // Restore — small chance per frame, so it eases
          if (Math.random() > 0.4) {
            l.textContent = target;
            l.style.color = "";
            states[i].scrambling = false;
          } else if (now - states[i].lastChange > 60) {
            const ch =
              CHARS[Math.floor(Math.random() * CHARS.length)];
            l.textContent = ch;
            states[i].lastChange = now;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      letters.forEach((l, i) => {
        l.textContent = targets[i];
        l.style.color = "";
      });
    };
  }, [text, radius, scrambleColor]);

  return (
    <span ref={wrapRef} className={className}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          data-letter
          data-target={ch}
          className={`inline-block ${letterClass}`}
          style={{
            transition: "color 80ms linear",
            whiteSpace: ch === " " ? "pre" : undefined,
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
