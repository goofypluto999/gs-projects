"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import { animateLetterReveal, animateFadeUp } from "@/lib/animations";
import { GridPattern } from "./GridPattern";
import { ScrollIndicator } from "./ScrollIndicator";
import { TextRotate } from "./TextRotate";

const rotatingWords = [
  "scenario intelligence",
  "job preparation",
  "event coordination",
  "strategic decisions",
];

export function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      if (nameRef.current) animateLetterReveal(nameRef.current);
    }, 200);

    const t2 = setTimeout(() => {
      if (subtitleRef.current) animateFadeUp(subtitleRef.current);
    }, 900);

    const t3 = setTimeout(() => {
      if (rotateRef.current) animateFadeUp(rotateRef.current);
      if (lineRef.current) {
        lineRef.current.style.opacity = "1";
        anime({
          targets: lineRef.current,
          width: [0, 64],
          easing: "easeOutExpo",
          duration: 800,
        });
      }
    }, 1200);

    const t4 = setTimeout(() => {
      if (statsRef.current) animateFadeUp(statsRef.current);
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <section className="relative flex flex-col justify-center min-h-[90vh] px-6 pt-14 overflow-hidden">
      <GridPattern className="opacity-60" />

      {/* Ambient glow behind name */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "35%",
          left: "10%",
          width: "500px",
          height: "300px",
          background:
            "radial-gradient(ellipse at center, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }}
      />

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

        {/* Rotating category */}
        <div ref={rotateRef} className="mt-3 opacity-0">
          <span className="font-body text-[clamp(0.85rem,1.5vw,1rem)] text-text-tertiary">
            Currently focused on{" "}
          </span>
          <TextRotate
            words={rotatingWords}
            interval={3000}
            className="font-body text-[clamp(0.85rem,1.5vw,1rem)] text-accent"
          />
        </div>

        <div
          ref={lineRef}
          className="mt-8 h-px bg-accent/40 opacity-0"
          style={{ width: 0 }}
        />

        {/* Stats line */}
        <div
          ref={statsRef}
          className="mt-6 flex items-center gap-8 opacity-0"
        >
          <div>
            <span className="font-heading text-xl font-700 text-text-primary">
              3
            </span>
            <span className="ml-1.5 text-xs text-text-tertiary">
              live products
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <span className="font-heading text-xl font-700 text-text-primary">
              2025
            </span>
            <span className="ml-1.5 text-xs text-text-tertiary">
              to present
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <span className="font-heading text-xl font-700 text-text-primary">
              Full-stack
            </span>
            <span className="ml-1.5 text-xs text-text-tertiary">
              AI + Web
            </span>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
