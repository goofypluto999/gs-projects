"use client";

import { SectionReveal } from "./SectionReveal";

interface UpcomingItem {
  name: string;
  one_liner: string;
  status: "Researching" | "Designing" | "Building" | "Internal beta";
  eta: string;
}

const upcoming: UpcomingItem[] = [
  {
    name: "Foresay Pro",
    one_liner:
      "Enterprise-tier Foresay with on-prem deployment, custom verticals, and API-first access.",
    status: "Building",
    eta: "Q3 2026",
  },
  {
    name: "AimVantage CLI",
    one_liner:
      "Same prep pack, run from the terminal. CV linter and cover letter writer for power users.",
    status: "Designing",
    eta: "Q3 2026",
  },
  {
    name: "Wadda Play API",
    one_liner:
      "Open the 228K-game corpus as a public ranking API. Game devs build with it.",
    status: "Researching",
    eta: "Q4 2026",
  },
];

const statusStyles: Record<UpcomingItem["status"], string> = {
  Researching: "text-text-tertiary border-border",
  Designing: "text-amber-400/90 border-amber-400/30",
  Building: "text-accent border-accent/40",
  "Internal beta": "text-emerald-400 border-emerald-400/40",
};

/**
 * Subtle "what's next" teaser — signals momentum to prospects.
 * Sits between Projects and About. Not flashy, just informative.
 */
export function Workshop() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-[1280px]">
        <SectionReveal>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-text-tertiary">
              In the workshop
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <h2 className="font-heading text-3xl md:text-5xl font-700 text-text-primary leading-[1.05] tracking-tight">
              What&apos;s next on the bench,
              <br />
              <span className="text-text-secondary">honestly labelled.</span>
            </h2>
            <p className="text-sm text-text-secondary max-w-[320px] leading-relaxed">
              Real status, not vapor. If it says &quot;Researching&quot;, there
              is no code yet.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal>
          <ul className="divide-y divide-border border-y border-border">
            {upcoming.map((p, i) => (
              <li
                key={p.name}
                className="group grid md:grid-cols-[80px_1.4fr_2fr_140px_100px] gap-4 md:gap-8 items-center py-5 hover:bg-surface/40 transition-colors duration-200 px-2"
              >
                <span className="font-heading text-xs text-text-tertiary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-base md:text-lg font-600 text-text-primary">
                  {p.name}
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {p.one_liner}
                </p>
                <span
                  className={`justify-self-start text-[10.5px] uppercase tracking-widest border px-2.5 py-1 rounded ${statusStyles[p.status]}`}
                >
                  {p.status}
                </span>
                <span className="text-xs text-text-tertiary tabular-nums justify-self-end">
                  {p.eta}
                </span>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
}
