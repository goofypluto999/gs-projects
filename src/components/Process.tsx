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
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Connector rail draws as the whole section scrolls past
      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: wrapRef.current,
              start: "top 75%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          }
        );
      }

      // Stagger reveal each step
      const items = wrapRef.current?.querySelectorAll("[data-step]");
      if (!items?.length) return;

      items.forEach((item) => {
        const numEl = item.querySelector("[data-step-num]");
        const markerEl = item.querySelector("[data-step-marker]");
        const contentEls = item.querySelectorAll("[data-step-content]");

        gsap.from(numEl, {
          opacity: 0,
          x: -16,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        });

        if (markerEl) {
          gsap.from(markerEl, {
            scale: 0,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            },
          });
        }

        gsap.from(contentEls, {
          opacity: 0,
          y: 18,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.15,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
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

        <div ref={wrapRef} className="mt-12 relative">
          {/* Vertical connector rail behind all steps */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-[39px] top-4 bottom-4 w-px overflow-hidden pointer-events-none"
          >
            <div className="absolute inset-0 bg-border" />
            <div
              ref={railRef}
              className="absolute inset-0 bg-gradient-to-b from-accent via-accent/60 to-transparent"
              style={{ transform: "scaleY(0)", transformOrigin: "top center" }}
            />
          </div>

          {steps.map((step) => (
            <div
              key={step.n}
              data-step
              className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr_2fr_120px] gap-6 md:gap-10 items-start py-10 border-b border-border/60 relative"
            >
              <div className="relative flex items-start gap-4">
                <span
                  data-step-num
                  className="font-heading text-3xl md:text-4xl font-300 text-text-tertiary tabular-nums tracking-wide leading-none"
                >
                  {step.n}
                </span>
                {/* Marker dot anchored on the rail */}
                <span
                  data-step-marker
                  className="hidden md:block absolute -right-3 top-3 w-3 h-3 rounded-full border-2 border-bg bg-accent"
                />
              </div>

              <h3
                data-step-content
                className="font-heading text-xl md:text-2xl font-700 text-text-primary col-start-2 md:col-start-auto leading-tight"
              >
                {step.title}
              </h3>

              <p
                data-step-content
                className="text-[14px] md:text-[15px] text-text-secondary leading-relaxed col-span-2 md:col-span-1 md:col-start-3 mt-0"
              >
                {step.body}
              </p>

              <span
                data-step-content
                className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary col-span-2 md:col-span-1 md:col-start-4 md:justify-self-end mt-1 md:mt-2"
              >
                {step.weeks}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
