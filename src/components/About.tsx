"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionReveal } from "./SectionReveal";
import { SectionHeader } from "./SectionHeader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const principles = [
  {
    n: "01",
    label: "Ship",
    body:
      "Working software, in production, with real users. Not pitch decks, not prototypes, not screenshots of a Figma file.",
  },
  {
    n: "02",
    label: "Specific",
    body:
      "Every product solves one concrete problem for a defined person. Generalist tools die; specialist tools ship.",
  },
  {
    n: "03",
    label: "End-to-end",
    body:
      "Idea, copy, design, frontend, backend, infra, billing, deploy. I own the whole stack — no hand-offs, no excuses.",
  },
  {
    n: "04",
    label: "Honest",
    body:
      "Beta is labelled beta. Free is actually free. Numbers in the marketing are numbers from the database.",
  },
];

const locations = [
  { city: "London", tz: "GMT", flag: "🇬🇧" },
  { city: "São Paulo", tz: "BRT", flag: "🇧🇷" },
];

export function About() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = wrapRef.current?.querySelectorAll("[data-principle]");
    if (!items?.length) return;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 75%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="px-6 py-32 scroll-mt-16 relative">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="About"
          title="I make tools people actually use,"
          subtitle="not products that look good in a deck."
        />

        <SectionReveal>
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start">
            {/* Bio text */}
            <div className="grid md:grid-cols-2 gap-10">
              <p className="text-[15px] leading-relaxed text-text-secondary">
                I&apos;m Giovanni — based between the UK and Brazil. I build
                digital products end-to-end: idea, design, code, infra,
                billing, deploy. Every project on this page is live, paid for
                out of pocket, and used by someone other than me.
              </p>
              <p className="text-[15px] leading-relaxed text-text-secondary">
                My work sits where product thinking meets engineering. Tight
                interfaces, fast performance, architecture that holds up as
                it scales. I care about the details that make software feel
                considered — which is why most of what I ship looks expensive
                and isn&apos;t.
              </p>
            </div>

            {/* Side card with location + meta */}
            <div className="border border-border rounded-lg bg-surface/30 p-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary mb-5">
                Operating from
              </div>
              <ul className="space-y-4">
                {locations.map((loc) => (
                  <li
                    key={loc.city}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{loc.flag}</span>
                      <span className="font-heading text-base font-600 text-text-primary">
                        {loc.city}
                      </span>
                    </div>
                    <span className="text-[11px] text-text-tertiary tabular-nums tracking-wider">
                      {loc.tz}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t border-border">
                <div className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary mb-2">
                  Mode
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span className="text-sm text-text-secondary">
                    Open for new engagements
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>

        <div
          ref={wrapRef}
          className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border"
        >
          {principles.map((p) => (
            <div
              key={p.n}
              data-principle
              className="p-6 md:p-7 bg-bg flex flex-col gap-3 hover:bg-surface transition-colors duration-200"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-xs text-text-tertiary tabular-nums">
                  {p.n}
                </span>
                <span className="font-heading text-base md:text-lg font-700 text-text-primary tracking-tight">
                  {p.label}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed text-text-secondary">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
