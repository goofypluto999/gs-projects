"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "./SectionHeader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  n: string;
  title: string;
  body: string;
  weeks: string;
}

const steps: Step[] = [
  {
    n: "I",
    title: "Frame the problem",
    body:
      "Hour-long call. One specific outcome, one specific person, one quantifiable win.",
    weeks: "Week 0",
  },
  {
    n: "II",
    title: "Prove the core",
    body:
      "Smallest possible working build. The one feature that decides whether the rest gets built.",
    weeks: "Weeks 1–2",
  },
  {
    n: "III",
    title: "Ship in public",
    body:
      "Live URL, real users, real billing. Iterate against signal, not opinion.",
    weeks: "Weeks 3–6",
  },
  {
    n: "IV",
    title: "Hand off or hold",
    body:
      "Documented, owned, transferable. Or kept on retainer with an SLA. Your call.",
    weeks: "Week 7+",
  },
];

export function Process() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = wrapRef.current?.querySelectorAll("[data-step]");
      if (!items?.length) return;

      // Each step animates from 0 to 1 as it enters viewport
      items.forEach((item) => {
        const numEl = item.querySelector("[data-step-num]");
        const lineEl = item.querySelector("[data-step-line]");
        const contentEl = item.querySelectorAll("[data-step-content]");

        gsap.from(numEl, {
          opacity: 0,
          y: 14,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
          },
        });

        gsap.from(lineEl, {
          scaleX: 0,
          duration: 0.7,
          ease: "expo.out",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
          },
        });

        gsap.from(contentEl, {
          opacity: 0,
          y: 18,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.15,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" className="px-6 py-28 scroll-mt-16">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="The process"
          title="Four weeks to a working build,"
          subtitle="seven to a shipped one."
          descriptor="No discovery decks, no retainer-fishing. The first call decides if it's worth doing — then we build."
        />

        <div ref={wrapRef} className="mt-8">
          {steps.map((step, i) => (
            <div
              key={step.n}
              data-step
              className="grid grid-cols-[60px_1fr] md:grid-cols-[100px_1fr_2fr_120px] gap-6 md:gap-10 items-baseline py-8 border-b border-border"
            >
              <span
                data-step-num
                className="font-heading text-3xl md:text-4xl font-300 text-text-tertiary tabular-nums tracking-wide"
              >
                {step.n}
              </span>

              <h3
                data-step-content
                className="font-heading text-xl md:text-2xl font-700 text-text-primary col-start-2 md:col-start-auto"
              >
                {step.title}
              </h3>

              <p
                data-step-content
                className="text-[14px] md:text-[15px] text-text-secondary leading-relaxed col-span-2 md:col-span-1 md:col-start-3"
              >
                {step.body}
              </p>

              <span
                data-step-content
                className="text-xs uppercase tracking-[0.25em] text-text-tertiary col-span-2 md:col-span-1 md:col-start-4 md:justify-self-end"
              >
                {step.weeks}
              </span>

              {/* Animated line under each row */}
              <span
                data-step-line
                className="hidden md:block absolute h-px bg-accent/30 w-full"
                style={{ display: "none" }}
                aria-hidden="true"
              />
              {/* number-of-this-step marker dot */}
              <span
                className="hidden md:block w-1.5 h-1.5 rounded-full mt-3"
                style={{
                  backgroundColor: i === 0 ? "var(--color-accent)" : "var(--color-border)",
                  display: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
