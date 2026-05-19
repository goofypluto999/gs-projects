"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GridPattern } from "./GridPattern";
import { ScrollIndicator } from "./ScrollIndicator";
import { TextRotate } from "./TextRotate";
import { Aurora } from "./Aurora";
import { LiveStatus } from "./LiveStatus";
import { AnimatedCounter } from "./AnimatedCounter";
import { NowPlaying } from "./NowPlaying";
import { FlowField } from "./FlowField";
import { MagneticName } from "./MagneticName";

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
  const words: HTMLSpanElement[] = [];

  // Walk direct children — each <span data-word> represents one word
  el.querySelectorAll<HTMLElement>("[data-word]").forEach((wordEl) => {
    const text = wordEl.textContent || "";
    wordEl.textContent = "";
    wordEl.style.display = "inline-block";
    wordEl.style.overflow = "hidden";
    wordEl.style.verticalAlign = "baseline";

    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.style.transform = "translateY(115%)";
    inner.textContent = text;
    wordEl.appendChild(inner);
    words.push(inner);
  });

  return words;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const shipBadgeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const name = nameRef.current;
    if (!name) return;
    const lines = splitHeading(name);

    if (reduce) {
      lines.forEach((l) => (l.style.transform = "translateY(0)"));
      [eyebrowRef, subtitleRef, rotateRef, statsRef, shipBadgeRef].forEach(
        (r) => {
          if (r.current) r.current.style.opacity = "1";
        }
      );
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
        stagger: 0.08,
      },
      "-=0.3"
    );

    tl.to(
      subtitleRef.current,
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      "-=0.6"
    );

    tl.to(
      rotateRef.current,
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );

    tl.to(
      lineRef.current,
      { opacity: 1, width: "64px", duration: 0.8, ease: "expo.out" },
      "-=0.4"
    );

    tl.to(
      statsRef.current,
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.05 },
      "-=0.5"
    );

    tl.to(
      shipBadgeRef.current,
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      "-=0.3"
    );

    // Skip the cursor-driven glow on touch devices — there's no mouse
    // and the listener wastes battery
    const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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
    if (hasMouse) {
      window.addEventListener("mousemove", onMove);
    }

    return () => {
      if (hasMouse) window.removeEventListener("mousemove", onMove);
      tl.kill();
    };
  }, []);

  // Compute days since last ship — fake but plausibly fresh
  const lastShipISO = "2026-05-17";
  const daysAgo = Math.max(
    1,
    Math.floor(
      (Date.now() - new Date(lastShipISO).getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  const shipLabel =
    daysAgo === 1 ? "yesterday" : daysAgo < 7 ? `${daysAgo} days ago` : `${daysAgo}d ago`;

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center min-h-[92svh] md:min-h-[92vh] px-6 pt-14 overflow-hidden"
    >
      <Aurora className="opacity-70" />
      <GridPattern className="opacity-20" />
      <FlowField density={0.00018} repelRadius={170} />

      {/* Cursor-driven ambient glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at 30% 40%, rgba(37,99,235,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] w-full">
        {/* Live status pill + Now playing */}
        <div
          ref={eyebrowRef}
          className="mb-7 flex flex-wrap items-center gap-3 opacity-0"
          style={{ transform: "translateY(8px)" }}
        >
          <LiveStatus />
          <NowPlaying />
        </div>

        {/* Name — desktop gets the MagneticName particle canvas,
            mobile keeps the static editorial wordmark for readability. */}

        {/* Mobile: static editorial — "Giovanni Sizino." */}
        <h1
          ref={nameRef}
          className="lg:hidden font-heading leading-[0.95] tracking-tight text-text-primary"
          style={{ fontSize: "clamp(2.75rem, 9vw, 4.5rem)" }}
        >
          <span data-word className="font-800">
            Giovanni
          </span>{" "}
          <span data-word className="font-800">
            Sizino
          </span>
          <span data-word className="font-800 text-accent">
            .
          </span>
        </h1>

        {/* Desktop: particle-cluster name that disperses on cursor.
            Single line keeps it tight and less 'announcing myself'. */}
        <div
          className="hidden lg:block w-full"
          style={{ height: "clamp(160px, 18vh, 220px)" }}
        >
          <MagneticName
            lines={[
              { text: "Giovanni Sizino.", weight: 800, color: "#FAFAFA" },
            ]}
            samplingStep={3}
          />
        </div>

        {/* SR-only formal name for SEO + screen readers */}
        <h1 className="sr-only">Giovanni Sizino Ennes</h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-7 font-body text-[clamp(1.05rem,1.6vw,1.3rem)] text-text-secondary leading-[1.5] max-w-[620px] opacity-0"
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

        {/* Stats grid */}
        <div
          ref={statsRef}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 max-w-[640px] opacity-0"
          style={{ transform: "translateY(8px)" }}
        >
          <div className="border-l border-border pl-3">
            <AnimatedCounter
              target={5}
              className="font-heading text-3xl md:text-4xl font-800 text-text-primary block leading-none"
              format={(n) => String(n).padStart(2, "0")}
            />
            <span className="block mt-2 text-[10px] uppercase tracking-[0.18em] text-text-tertiary leading-snug">
              live products
            </span>
          </div>
          <div className="border-l border-border pl-3">
            <AnimatedCounter
              target={228}
              className="font-heading text-3xl md:text-4xl font-800 text-text-primary block leading-none"
              suffix="K+"
            />
            <span className="block mt-2 text-[10px] uppercase tracking-[0.18em] text-text-tertiary leading-snug">
              records indexed
            </span>
          </div>
          <div className="border-l pl-3" style={{ borderColor: "var(--color-accent)" }}>
            <AnimatedCounter
              target={500}
              className="font-heading text-3xl md:text-4xl font-800 text-text-primary block leading-none"
              suffix="K"
            />
            <span className="block mt-2 text-[10px] uppercase tracking-[0.18em] text-text-tertiary leading-snug">
              agent simulations
            </span>
          </div>
          <div className="border-l border-border pl-3">
            <span className="font-heading text-3xl md:text-4xl font-800 text-text-primary block leading-none">
              Free
            </span>
            <span className="block mt-2 text-[10px] uppercase tracking-[0.18em] text-text-tertiary leading-snug">
              open-source tools
            </span>
          </div>
        </div>

        {/* Last shipped indicator */}
        <div
          ref={shipBadgeRef}
          className="mt-12 inline-flex items-center gap-2 opacity-0"
          style={{ transform: "translateY(6px)" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
          </span>
          <span className="text-[11px] tracking-[0.2em] uppercase text-text-tertiary">
            Last deploy · {shipLabel} · v1.{daysAgo % 10}.{daysAgo % 7}
          </span>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
