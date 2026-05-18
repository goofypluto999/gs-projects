"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GridPattern } from "./GridPattern";
import { ScrollIndicator } from "./ScrollIndicator";
import { TextRotate } from "./TextRotate";
import { Meteors } from "./Meteors";
import { Aurora } from "./Aurora";
import { AnimatedCounter } from "./AnimatedCounter";

const rotatingWords = [
  "scenario intelligence",
  "ATS-grade CV tooling",
  "agent journalism",
  "game discovery",
  "career preparation",
];

/**
 * Split a heading into per-word + per-char spans for staggered reveal.
 * GSAP-friendly markup with no external SplitText plugin dependency.
 */
function splitHeading(el: HTMLElement) {
  const text = el.textContent || "";
  el.textContent = "";
  const words = text.split(" ");
  const charSpans: HTMLSpanElement[] = [];

  words.forEach((word, i) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "inline-block overflow-hidden align-baseline";

    const inner = document.createElement("span");
    inner.className = "inline-block";
    inner.style.transform = "translateY(115%)";
    inner.textContent = word;

    wordSpan.appendChild(inner);
    el.appendChild(wordSpan);
    charSpans.push(inner);

    if (i < words.length - 1) {
      const space = document.createElement("span");
      space.innerHTML = "&nbsp;";
      space.className = "inline-block";
      el.appendChild(space);
    }
  });

  return charSpans;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const name = nameRef.current;
    if (!name) return;
    const lines = splitHeading(name);

    if (reduce) {
      lines.forEach((l) => (l.style.transform = "translateY(0)"));
      [eyebrowRef, subtitleRef, rotateRef, statsRef].forEach((r) => {
        if (r.current) r.current.style.opacity = "1";
      });
      if (lineRef.current) {
        lineRef.current.style.opacity = "1";
        lineRef.current.style.width = "64px";
      }
      return;
    }

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(eyebrowRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    });

    tl.to(
      lines,
      {
        y: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.07,
      },
      "-=0.3"
    );

    tl.to(
      subtitleRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.6"
    );

    tl.to(
      rotateRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4"
    );

    tl.to(
      lineRef.current,
      {
        opacity: 1,
        width: "64px",
        duration: 0.8,
        ease: "expo.out",
      },
      "-=0.4"
    );

    tl.to(
      statsRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.05,
      },
      "-=0.5"
    );

    // Glow drift on mouse move (subtle parallax)
    const onMove = (e: MouseEvent) => {
      if (!glowRef.current || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      gsap.to(glowRef.current, {
        background: `radial-gradient(600px circle at ${x}% ${y}%, rgba(37,99,235,0.10) 0%, rgba(99,102,241,0.04) 25%, transparent 60%)`,
        duration: 0.8,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center min-h-[92vh] px-6 pt-14 overflow-hidden"
    >
      <Aurora />
      <GridPattern className="opacity-40" />
      <Meteors number={10} />

      {/* Cursor-driven ambient glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at 30% 40%, rgba(37,99,235,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] w-full">
        {/* Eyebrow tag */}
        <div
          ref={eyebrowRef}
          className="flex items-center gap-2 mb-7 opacity-0"
          style={{ transform: "translateY(8px)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] tracking-[0.25em] uppercase text-text-tertiary">
            Building in public · UK / Brazil
          </span>
        </div>

        {/* Name with line reveal */}
        <h1
          ref={nameRef}
          className="font-heading text-[clamp(2.5rem,7vw,6rem)] font-800 leading-[0.95] tracking-tight text-text-primary"
        >
          Giovanni Sizino Ennes
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-6 font-body text-[clamp(1.05rem,1.6vw,1.3rem)] text-text-secondary leading-relaxed max-w-[620px] opacity-0"
          style={{ transform: "translateY(12px)" }}
        >
          I ship digital products that do one specific job well. Five live tools.
          Some open-source. All built end-to-end.
        </p>

        {/* Rotating focus area */}
        <div
          ref={rotateRef}
          className="mt-4 opacity-0"
          style={{ transform: "translateY(12px)" }}
        >
          <span className="font-body text-[clamp(0.85rem,1.3vw,1rem)] text-text-tertiary">
            Right now —{" "}
          </span>
          <TextRotate
            words={rotatingWords}
            interval={2800}
            className="font-body text-[clamp(0.85rem,1.3vw,1rem)] text-accent"
          />
        </div>

        {/* Accent line */}
        <div
          ref={lineRef}
          className="mt-10 h-px bg-accent/50 opacity-0"
          style={{ width: 0 }}
        />

        {/* Stats line */}
        <div
          ref={statsRef}
          className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 opacity-0"
          style={{ transform: "translateY(8px)" }}
        >
          <div>
            <AnimatedCounter
              target={5}
              className="font-heading text-2xl font-700 text-text-primary"
              format={(n) => String(n).padStart(2, "0")}
            />
            <span className="ml-2 text-xs text-text-tertiary">
              live products
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <AnimatedCounter
              target={228}
              className="font-heading text-2xl font-700 text-text-primary"
              suffix="K+"
            />
            <span className="ml-2 text-xs text-text-tertiary">
              records indexed
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <AnimatedCounter
              target={500}
              className="font-heading text-2xl font-700 text-text-primary"
              suffix="K"
            />
            <span className="ml-2 text-xs text-text-tertiary">
              agent simulations
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div>
            <span className="font-heading text-2xl font-700 text-text-primary">
              Free
            </span>
            <span className="ml-2 text-xs text-text-tertiary">
              tools shipped open-source
            </span>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
