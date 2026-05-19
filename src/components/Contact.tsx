"use client";

import { ArrowUpRight } from "lucide-react";
import { SectionReveal } from "./SectionReveal";
import { Aurora } from "./Aurora";
import { Socials } from "./Socials";
import { MagneticWrap } from "./MagneticWrap";

const usefulNote = [
  "What you're building or where you're stuck",
  "Whether you have a timeline or budget shape",
  "One specific question I can answer in my reply",
];

export function Contact() {
  return (
    <section
      id="contact"
      className="relative px-6 py-20 md:py-32 scroll-mt-16 overflow-hidden"
    >
      <Aurora className="opacity-50" />

      <div className="relative mx-auto max-w-[1280px]">
        <SectionReveal>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-text-tertiary">
              Open inbox · 2 slots
            </span>
          </div>

          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-800 text-text-primary leading-[0.95] tracking-tight">
            Have a product
            <br />
            <span className="text-text-secondary">worth shipping?</span>
          </h2>

          <p className="mt-8 max-w-[560px] text-base md:text-lg text-text-secondary leading-relaxed">
            Strategic partnerships, white-label builds, or interest in
            acquiring one of the products outright. Short notes only — I read
            everything.
          </p>

          {/* What-to-send guide — removes the awkward "where do I start"
              friction prospects feel before their first cold email. */}
          <div className="mt-10 max-w-[560px] border-l border-border pl-5">
            <p className="text-[11px] uppercase tracking-[0.25em] text-text-tertiary mb-3">
              A useful note usually has
            </p>
            <ul className="space-y-2.5">
              {usefulNote.map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[14px] text-text-secondary leading-relaxed"
                >
                  <span
                    className="mt-2 w-1 h-1 rounded-full bg-accent shrink-0"
                    aria-hidden="true"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticWrap strength={0.2}>
              <a
                href="mailto:giovanni.sizino.ennes@hotmail.co.uk?subject=Talking%20about%20a%20build&body=Hi%20Giovanni%2C%0A%0AI%27m%20working%20on%20..."
                className="group inline-flex items-center gap-3 px-6 py-4 rounded-md bg-text-primary text-bg hover:bg-text-secondary transition-colors duration-200 cursor-pointer"
              >
                <span className="font-heading text-sm font-600">
                  giovanni.sizino.ennes@hotmail.co.uk
                </span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </MagneticWrap>
            <Socials />
          </div>

          <p className="mt-12 text-xs text-text-tertiary tracking-wider">
            Typically reply within 24 hours · UK time zone · No retainer pitch
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
