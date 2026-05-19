"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionReveal } from "./SectionReveal";
import { SectionHeader } from "./SectionHeader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UpcomingItem {
  name: string;
  one_liner: string;
  status: "Researching" | "Designing" | "Building" | "Internal beta";
  eta: string;
  /** Progress 0-1 to indicate how close to ship */
  progress: number;
  /** Accent for the row */
  accent: string;
}

const upcoming: UpcomingItem[] = [
  {
    name: "Foresay Pro",
    one_liner:
      "Enterprise tier — on-prem deployment, custom verticals, API-first.",
    status: "Building",
    eta: "Q3 2026",
    progress: 0.62,
    accent: "#6366F1",
  },
  {
    name: "AimVantage CLI",
    one_liner:
      "Same prep pack, run from the terminal. CV linter + cover letter writer for power users.",
    status: "Designing",
    eta: "Q3 2026",
    progress: 0.34,
    accent: "#F59E0B",
  },
  {
    name: "Wadda Play API",
    one_liner:
      "Open the 228K-game corpus as a public ranking API for game devs.",
    status: "Researching",
    eta: "Q4 2026",
    progress: 0.12,
    accent: "#A855F7",
  },
];

const statusStyles: Record<UpcomingItem["status"], string> = {
  Researching: "text-text-tertiary border-border bg-text-tertiary/[0.04]",
  Designing: "text-amber-400/90 border-amber-400/35 bg-amber-400/[0.06]",
  Building: "text-accent border-accent/45 bg-accent/[0.06]",
  "Internal beta": "text-emerald-400 border-emerald-400/45 bg-emerald-400/[0.06]",
};

const statusDotStyles: Record<UpcomingItem["status"], string> = {
  Researching: "bg-text-tertiary",
  Designing: "bg-amber-400",
  Building: "bg-accent",
  "Internal beta": "bg-emerald-400",
};

/**
 * Workshop list — premium row layout, hover reveals progress bar +
 * accent. GSAP scrub-reveals each row as user scrolls past.
 */
export function Workshop() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = wrapRef.current?.querySelectorAll("[data-row]");
      if (!items?.length) return;

      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 75%",
        },
      });

      // Progress bars fill on scroll-in
      items.forEach((item) => {
        const bar = item.querySelector("[data-progress]");
        const targetWidth = parseFloat(item.getAttribute("data-progress-val") || "0");
        if (bar) {
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: `${targetWidth * 100}%`,
              duration: 1.4,
              ease: "expo.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
              },
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="px-6 py-16 md:py-28">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="In the workshop"
          title="What's next on the bench,"
          subtitle="honestly labelled."
          descriptor='Real status, not vapor. If it says "Researching", there is no code yet.'
        />

        <div ref={wrapRef} className="mt-4">
          <ul className="border-y border-border">
            {upcoming.map((p, i) => (
              <li
                key={p.name}
                data-row
                data-progress-val={p.progress}
                className="group relative border-b border-border last:border-b-0 hover:bg-surface/30 transition-colors duration-200 cursor-default"
              >
                {/* Mobile: stacked card. Desktop: 5-col grid. */}
                <div className="md:grid md:grid-cols-[80px_1.2fr_2fr_140px_120px] md:gap-8 md:items-center py-5 md:py-6 px-2">
                  {/* Mobile top row: number + name + ETA */}
                  <div className="flex md:contents items-center justify-between gap-4 mb-2 md:mb-0">
                    <div className="flex items-center gap-3 md:contents">
                      <span className="font-heading text-xs text-text-tertiary tabular-nums tracking-wider">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.accent }}
                        />
                        <h3 className="font-heading text-base md:text-lg font-600 text-text-primary">
                          {p.name}
                        </h3>
                      </div>
                    </div>
                    <span className="md:hidden text-[10px] uppercase tracking-[0.2em] text-text-tertiary tabular-nums">
                      {p.eta}
                    </span>
                  </div>

                  <p className="text-[13px] text-text-secondary leading-relaxed mb-3 md:mb-0">
                    {p.one_liner}
                  </p>

                  <div className="flex items-center justify-between gap-4 md:contents">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] border px-2.5 py-1 rounded ${statusStyles[p.status]} md:justify-self-start`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDotStyles[p.status]} ${p.status === "Building" ? "animate-pulse" : ""}`}
                        aria-hidden="true"
                      />
                      {p.status}
                    </span>
                    <span className="hidden md:inline text-xs text-text-tertiary tabular-nums md:justify-self-end">
                      {p.eta}
                    </span>
                  </div>
                </div>

                {/* Progress bar — bottom of the row */}
                <div className="absolute left-0 right-0 bottom-0 h-px bg-border/30 overflow-hidden">
                  <div
                    data-progress
                    className="h-full"
                    style={{
                      background: `linear-gradient(90deg, ${p.accent}, ${p.accent}40)`,
                      width: "0%",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <SectionReveal>
            <p className="mt-6 text-xs text-text-tertiary leading-relaxed">
              Want first access when any of these go live? Drop a note and I&apos;ll
              hold a beta seat.
            </p>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
