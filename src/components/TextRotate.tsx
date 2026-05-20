"use client";

import { useEffect, useState, useRef } from "react";
import anime from "animejs";

/** A rotating word — string for legacy use, or { text, color } for
 *  per-item accent colours so the rotating phrase tints to match the
 *  product it represents on each beat. */
type RotateWord = string | { text: string; color: string };

interface TextRotateProps {
  words: RotateWord[];
  interval?: number;
  className?: string;
}

export function TextRotate({
  words,
  interval = 3000,
  className = "",
}: TextRotateProps) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!containerRef.current || !mounted.current) return;

      anime({
        targets: containerRef.current,
        opacity: [1, 0],
        translateY: [0, -8],
        easing: "easeInCubic",
        duration: 250,
        complete: () => {
          if (!mounted.current) return;
          setIndex((prev) => (prev + 1) % words.length);

          if (containerRef.current) {
            anime({
              targets: containerRef.current,
              opacity: [0, 1],
              translateY: [8, 0],
              easing: "easeOutCubic",
              duration: 300,
            });
          }
        },
      });
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  const current = words[index];
  const text = typeof current === "string" ? current : current.text;
  const color = typeof current === "string" ? undefined : current.color;

  return (
    <span
      ref={containerRef}
      className={`inline-block ${className}`}
      style={color ? { color } : undefined}
    >
      {text}
    </span>
  );
}
