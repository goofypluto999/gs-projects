"use client";

import { useEffect, useState, useRef } from "react";
import anime from "animejs";

interface TextRotateProps {
  words: string[];
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

  return (
    <span
      ref={containerRef}
      className={`inline-block ${className}`}
    >
      {words[index]}
    </span>
  );
}
