"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "./SectionHeader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Quote {
  body: string;
  attribution: string;
  context: string;
  product: string;
  accent: string;
  size: "large" | "small";
}

const quotes: Quote[] = [
  {
    body:
      "Walked through the simulation engine on a discovery call and I was sold on the premise within ten minutes. The way it lets a non-technical exec actually interrogate the model is what's missing from every research tool I've been pitched.",
    attribution: "Head of Strategy",
    context: "Mid-market SaaS · discovery call",
    product: "Foresay Labs",
    accent: "#6366F1",
    size: "large",
  },
  {
    body:
      "Glass-box provenance is the bit I keep coming back to. Most platforms hide the model — this is the first one I could see myself defending to a board.",
    attribution: "Director",
    context: "Retail group · active evaluation",
    product: "Foresay Labs",
    accent: "#6366F1",
    size: "small",
  },
  {
    body:
      "Speed hooked me. Most things I get demoed take a month to set up before there's anything to look at. Here I had a working scenario inside the call.",
    attribution: "VP Product",
    context: "Fintech challenger · introductory call",
    product: "Foresay Labs",
    accent: "#6366F1",
    size: "small",
  },
];

const large = quotes.find((q) => q.size === "large")!;
const small = quotes.filter((q) => q.size === "small");

function MarkSvg({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className="w-9 h-9"
      style={{ color }}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M9.4 8C6 8 3 11 3 14.6c0 2.6 1.6 4.5 4 5.2.6.2 1 .7 1 1.3 0 1-.7 1.7-1.8 1.7C3.4 22.8 1 19.4 1 15c0-5 3.5-9 8.4-9 .3 0 .6.3.6.6V8zm17 0c-3.4 0-6.4 3-6.4 6.6 0 2.6 1.6 4.5 4 5.2.6.2 1 .7 1 1.3 0 1-.7 1.7-1.8 1.7-2.8 0-5.2-3.4-5.2-7.8 0-5 3.5-9 8.4-9 .3 0 .6.3.6.6V8z" />
    </svg>
  );
}

export function Testimonials() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = wrapRef.current?.querySelectorAll("[data-quote]");
      if (!cards?.length) return;
      gsap.from(cards, {
        opacity: 0,
        y: 36,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 75%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="px-6 py-16 md:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Pre-launch · interest signals"
          title="From discovery calls and demo sessions,"
          subtitle="paraphrased, names withheld until public launch."
          descriptor="Inbound interest, not closed sales. The product is in active evaluation with the people quoted here."
        />

        <div
          ref={wrapRef}
          className="grid lg:grid-cols-[1.4fr_1fr] gap-5 lg:gap-6 mt-4"
        >
          {/* Large featured quote */}
          <figure
            data-quote
            className="relative rounded-xl border border-border bg-bg/40 p-8 md:p-12 lg:p-14 flex flex-col gap-8 hover:bg-surface/60 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <MarkSvg color={large.accent} />
              <span
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{ color: large.accent }}
              >
                Discovery call · {large.product}
              </span>
            </div>

            <blockquote className="font-heading text-2xl md:text-3xl lg:text-4xl font-500 leading-[1.25] tracking-tight text-text-primary">
              &ldquo;{large.body}&rdquo;
            </blockquote>

            <figcaption className="mt-auto pt-6 border-t border-border/80 flex items-baseline gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: large.accent }}
              />
              <div>
                <div className="font-heading text-base font-700 text-text-primary">
                  {large.attribution}
                </div>
                <div className="text-[12px] text-text-tertiary mt-0.5">
                  {large.context}
                </div>
              </div>
            </figcaption>
          </figure>

          {/* Two stacked smaller quotes */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {small.map((q, i) => (
              <figure
                key={i}
                data-quote
                className="relative rounded-xl border border-border bg-bg/40 p-6 md:p-8 flex flex-col gap-5 hover:bg-surface/60 transition-colors duration-200 flex-1"
              >
                <MarkSvg color={q.accent} />

                <blockquote className="text-[14.5px] leading-relaxed text-text-secondary">
                  &ldquo;{q.body}&rdquo;
                </blockquote>

                <figcaption className="mt-auto pt-4 border-t border-border/70 flex items-baseline gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: q.accent }}
                  />
                  <div>
                    <div className="font-heading text-[13px] font-600 text-text-primary">
                      {q.attribution}
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">
                      {q.context} · via {q.product}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
