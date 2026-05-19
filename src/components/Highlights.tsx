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
              className="group relative p-6 md:p-7 flex flex-col gap-3 transition-colors duration-200 min-h-[200px] md:min-h-0"
              style={{
                // Editorial gradient backdrop per highlight — same pattern
                // used in MobileSpecCards + DragStack so the section reads
                // as part of the same visual family, not generic tiles.
                background: `
                  radial-gradient(ellipse at 85% 0%, ${h.accent}1F 0%, transparent 55%),
                  radial-gradient(ellipse at 0% 100%, ${h.accent}10 0%, transparent 60%),
                  var(--color-bg)
                `,
              }}
            >
              {/* Accent stripe — extends on hover */}
              <div
                className="absolute top-0 left-0 h-px transition-all duration-300 group-hover:w-20"
                style={{
                  width: "32px",
                  backgroundColor: h.accent,
                  boxShadow: `0 0 14px ${h.accent}55`,
                }}
                aria-hidden="true"
              />

              <div className="flex items-baseline gap-3">
                <span
                  className="font-heading font-800 leading-none tracking-[-0.03em] tabular-nums"
                  style={{
                    fontSize: "clamp(2.75rem, 13vw, 4rem)",
                    color: h.accent,
                    textShadow: `0 0 24px ${h.accent}33`,
                  }}
                >
                  {h.number}
                </span>
                <span className="text-[10.5px] uppercase tracking-[0.22em] text-text-tertiary max-w-[120px] leading-snug">
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
                <span className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
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
