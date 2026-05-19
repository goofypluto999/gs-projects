"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "./SectionHeader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Highlight {
  number: string;
  label: string;
  description: string;
  product: string;
  accent: string;
}

const highlights: Highlight[] = [
  {
    number: "500K",
    label: "AI-calibrated agents",
    description: "Per Foresay simulation. Real census demographics.",
    product: "Foresay Labs",
    accent: "#6366F1",
  },
  {
    number: "228K+",
    label: "games indexed",
    description: "Wadda Play's full corpus, AI-scored against any brief.",
    product: "Wadda Play",
    accent: "#A855F7",
  },
  {
    number: "90s",
    label: "to a full job-prep pack",
    description: "AimVantage. CV fit, cover letter, mock interview, intel.",
    product: "AimVantage",
    accent: "#F59E0B",
  },
  {
    number: "5",
    label: "ATS parsers simulated",
    description: "CV Mirror. Workday · Greenhouse · Lever · Taleo · iCIMS.",
    product: "CV Mirror",
    accent: "#10B981",
  },
  {
    number: "2/day",
    label: "agent dispatches",
    description: "AdsForge. Working MCP servers, prompts, real cost numbers.",
    product: "AdsForge",
    accent: "#EF4444",
  },
  {
    number: "504",
    label: "cross-seed test cases",
    description:
      "Foresay's regression vault. 100% pass rate at MAE 0.000.",
    product: "Foresay Labs",
    accent: "#6366F1",
  },
];

export function Highlights() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = wrapRef.current?.querySelectorAll("[data-highlight]");
      if (!cards?.length) return;

      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 75%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Highlights"
          title="The numbers behind the work,"
          subtitle="pulled from each live database."
          descriptor="Not marketing claims — these are what the products actually do."
        />

        <div
          ref={wrapRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border border-border"
        >
          {highlights.map((h) => (
            <div
              key={`${h.product}-${h.number}`}
              data-highlight
              className="group relative bg-bg p-6 md:p-7 flex flex-col gap-3 hover:bg-surface transition-colors duration-200"
            >
              {/* Accent tab */}
              <div
                className="absolute top-0 left-0 w-8 h-px"
                style={{ backgroundColor: h.accent }}
              />

              <div className="flex items-baseline gap-3">
                <span
                  className="font-heading text-4xl md:text-5xl font-800 leading-none tracking-tight text-text-primary tabular-nums"
                >
                  {h.number}
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                  {h.label}
                </span>
              </div>

              <p className="text-[13px] text-text-secondary leading-relaxed">
                {h.description}
              </p>

              <div className="mt-auto pt-3 flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: h.accent }}
                />
                <span className="text-[11px] uppercase tracking-widest text-text-tertiary group-hover:text-text-secondary transition-colors duration-200">
                  {h.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
