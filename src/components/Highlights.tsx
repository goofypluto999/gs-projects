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

// These intentionally do NOT repeat the product-feature numbers shown in
// the DragStack spec cards (500K agents, 228K games, etc.). Highlights
// is about the *discipline behind the work* — solo build, no funding,
// regression rigour, open-source intent — not another lap around the
// same product facts.
const highlights: Highlight[] = [
  {
    number: "5 / 5",
    label: "products live in production",
    description:
      "Not 4 of 5. Not 3 with two in beta. All five are paying-customer-grade and shipping.",
    product: "Shipped",
    accent: "#2563EB",
  },
  {
    number: "0",
    label: "outside capital raised",
    description:
      "No VC, no angels, no advisors with cheques. Every line of code, every domain bill — self-funded.",
    product: "Independent",
    accent: "#10B981",
  },
  {
    number: "3 yrs",
    label: "solo build span",
    description:
      "First commit to fifth-product launch. No team, no co-founder, no contractor hand-offs.",
    product: "One operator",
    accent: "#F97316",
  },
  {
    number: "100%",
    label: "regression test pass rate",
    description:
      "Foresay's 504-case cross-seed vault. Pass at MAE 0.000 before any merge to main.",
    product: "Quality gate",
    accent: "#6366F1",
  },
  {
    number: "2",
    label: "open-source releases",
    description:
      "CV Mirror + the AimVantage ATS scanner. MIT licensed, fully client-side, no telemetry.",
    product: "Open source",
    accent: "#10B981",
  },
  {
    number: "yesterday",
    label: "last production deploy",
    description:
      "Continuous shipping. Nothing on this site is older than this week — every product gets a touch every sprint.",
    product: "Always shipping",
    accent: "#A855F7",
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
          eyebrow="The discipline"
          title="What's true about the work,"
          subtitle="not what the products do."
          descriptor="Five live products, no team, no outside capital, three years. Numbers that are hard to fake."
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
