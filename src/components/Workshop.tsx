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
  Researching: "text-text-tertiary border-border",
  Designing: "text-amber-400/90 border-amber-400/30",
  Building: "text-accent border-accent/40",
  "Internal beta": "text-emerald-400 border-emerald-400/40",
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
    <section className="px-6 py-28">
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
                <div className="grid md:grid-cols-[80px_1.2fr_2fr_140px_120px] gap-4 md:gap-8 items-center py-6 px-2">
                  <span className="font-heading text-xs text-text-tertiary tabular-nums tracking-wider">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: p.accent }}
                    />
                    <h3 className="font-heading text-base md:text-lg font-600 text-text-primary">
                      {p.name}
                    </h3>
                  </div>

                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    {p.one_liner}
                  </p>

                  <span
                    className={`justify-self-start text-[10px] uppercase tracking-[0.2em] border px-2.5 py-1 rounded ${statusStyles[p.status]}`}
                  >
                    {p.status}
                  </span>

                  <span className="text-xs text-text-tertiary tabular-nums md:justify-self-end">
                    {p.eta}
                  </span>
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
