"use client";

import { SectionReveal } from "./SectionReveal";

interface SectionHeaderProps {
  /** Tiny uppercase pill label, e.g. "The Work" */
  eyebrow: string;
  /** Big display headline, first line accent */
  title: string;
  /** Second line in muted colour, optional */
  subtitle?: string;
  /** Right-aligned descriptor copy, optional */
  descriptor?: string;
  /** Dot colour for eyebrow indicator */
  dotColor?: string;
}

/**
 * Reusable rhythm-defining section header. Eyebrow pill + 2-line display
 * headline + optional right-aligned descriptor. Drives consistent visual
 * cadence across Projects / Workshop / About.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  descriptor,
  dotColor = "var(--color-accent)",
}: SectionHeaderProps) {
  return (
    <SectionReveal>
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
        <span className="text-[11px] uppercase tracking-[0.25em] text-text-tertiary">
          {eyebrow}
        </span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <h2 className="font-heading font-700 text-text-primary leading-[1.02] tracking-[-0.025em]" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}>
          {title}
          {subtitle && (
            <>
              <br />
              <span className="text-text-secondary">{subtitle}</span>
            </>
          )}
        </h2>
        {descriptor && (
          <p className="text-sm md:text-[15px] text-text-secondary max-w-[340px] leading-relaxed">
            {descriptor}
          </p>
        )}
      </div>
    </SectionReveal>
  );
}
