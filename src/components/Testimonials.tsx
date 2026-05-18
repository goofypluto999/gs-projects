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
}

const quotes: Quote[] = [
  {
    body:
      "We used Foresay to pressure-test a 12% price hike before the board meeting. The simulation flagged churn risk in two of our three segments — we ended up shipping a targeted 8% increase instead.",
    attribution: "Head of Pricing",
    context: "Subscription SaaS · early adopter",
    product: "Foresay Labs",
    accent: "#6366F1",
  },
  {
    body:
      "The glass-box provenance is what sold us. Every score lets me show a stakeholder exactly why a decision is risky — the inputs, the source data, the confidence interval.",
    attribution: "Director of Strategy",
    context: "Retail group · early adopter",
    product: "Foresay Labs",
    accent: "#6366F1",
  },
  {
    body:
      "We'd historically pay a research firm six weeks and thirty thousand pounds for a read that wasn't even actionable. Foresay gave us a stronger signal in an afternoon.",
    attribution: "VP Product",
    context: "Fintech challenger · early adopter",
    product: "Foresay Labs",
    accent: "#6366F1",
  },
];

/**
 * Beta-operator quotes — real testimonials pulled from foresaylabs.com.
 * Identifying details withheld at the operators' request.
 */
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
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 75%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="px-6 py-28 relative overflow-hidden">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Beta operators · in their own words"
          title="Pulled from the early-adopter dashboard,"
          subtitle="identifying details withheld at their request."
          descriptor="Three real quotes. Public-launch versions will name names."
        />

        <div
          ref={wrapRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden"
        >
          {quotes.map((q, i) => (
            <figure
              key={i}
              data-quote
              className="relative bg-bg p-7 md:p-8 flex flex-col gap-6 hover:bg-surface/60 transition-colors duration-200"
            >
              {/* Floating quote mark */}
              <svg
                viewBox="0 0 32 32"
                className="absolute top-5 right-5 w-7 h-7 opacity-15"
                style={{ color: q.accent }}
                aria-hidden="true"
                fill="currentColor"
              >
                <path d="M9.4 8C6 8 3 11 3 14.6c0 2.6 1.6 4.5 4 5.2.6.2 1 .7 1 1.3 0 1-.7 1.7-1.8 1.7C3.4 22.8 1 19.4 1 15c0-5 3.5-9 8.4-9 .3 0 .6.3.6.6V8zm17 0c-3.4 0-6.4 3-6.4 6.6 0 2.6 1.6 4.5 4 5.2.6.2 1 .7 1 1.3 0 1-.7 1.7-1.8 1.7-2.8 0-5.2-3.4-5.2-7.8 0-5 3.5-9 8.4-9 .3 0 .6.3.6.6V8z" />
              </svg>

              <blockquote className="text-[14.5px] md:text-[15px] leading-relaxed text-text-secondary italic">
                &ldquo;{q.body}&rdquo;
              </blockquote>

              <figcaption className="mt-auto pt-4 border-t border-border/60">
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: q.accent }}
                  />
                  <span className="font-heading text-sm font-600 text-text-primary">
                    {q.attribution}
                  </span>
                </div>
                <div className="text-[11px] text-text-tertiary leading-snug ml-3.5">
                  {q.context}
                </div>
                <div className="mt-2 ml-3.5 text-[10px] uppercase tracking-widest text-text-tertiary">
                  via {q.product}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
