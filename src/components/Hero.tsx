"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import { animateLetterReveal, animateFadeUp } from "@/lib/animations";
import { GridPattern } from "./GridPattern";
import { ScrollIndicator } from "./ScrollIndicator";

export function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (nameRef.current) {
        animateLetterReveal(nameRef.current);
      }
    }, 200);

    const timeout2 = setTimeout(() => {
      if (subtitleRef.current) {
        animateFadeUp(subtitleRef.current);
      }
      if (lineRef.current) {
        lineRef.current.style.opacity = "1";
        anime({
          targets: lineRef.current,
          width: [0, 64],
          easing: "easeOutExpo",
          duration: 800,
        });
      }
    }, 900);

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, []);

  return (
    <section className="relative flex flex-col justify-center min-h-[90vh] px-6 pt-14 overflow-hidden">
      <GridPattern className="opacity-60" />
      <div className="relative mx-auto max-w-[1200px] w-full">
        <h1
          ref={nameRef}
          className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-800 leading-[1.05] tracking-tight text-text-primary opacity-0"
        >
          Giovanni Sizino
        </h1>
        <p
          ref={subtitleRef}
          className="mt-5 font-body text-[clamp(1rem,2vw,1.25rem)] text-text-secondary leading-relaxed max-w-[540px] opacity-0"
        >
          Building digital products that solve real problems.
        </p>
        <div
          ref={lineRef}
          className="mt-10 h-px bg-accent/40 opacity-0"
          style={{ width: 0 }}
        />
      </div>
      <ScrollIndicator />
    </section>
  );
}
