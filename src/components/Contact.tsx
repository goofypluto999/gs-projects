"use client";

import { ArrowUpRight } from "lucide-react";
import { SectionReveal } from "./SectionReveal";
import { Aurora } from "./Aurora";
import { Socials } from "./Socials";
import { MagneticWrap } from "./MagneticWrap";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative px-6 py-32 scroll-mt-16 overflow-hidden"
    >
      <Aurora className="opacity-50" />

      <div className="relative mx-auto max-w-[1280px]">
        <SectionReveal>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-text-tertiary">
              Open inbox
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

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticWrap strength={0.2}>
              <a
                href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
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
            Typically reply within 24 hours · UK + Brazil time zones
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
