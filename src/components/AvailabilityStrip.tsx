"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  "Strategic builds",
  "Technical advisory",
  "Acquisition conversations",
  "White-label development",
];

/**
 * Premium availability strip — full-bleed dark bar between Workshop and About.
 * Animated number, three services, and an "Open for two slots" indicator.
 * The kind of bar Awwwards studios use to signal scarcity + quality.
 */
export function AvailabilityStrip() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = wrapRef.current?.querySelectorAll("[data-service]");
      if (items?.length) {
        gsap.from(items, {
          opacity: 0,
          y: 14,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 85%",
          },
        });
      }

      if (numberRef.current) {
        gsap.fromTo(
          numberRef.current,
          { textContent: 0 },
          {
            textContent: 2,
            duration: 1,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: wrapRef.current,
              start: "top 85%",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative px-6 py-14 border-y border-border bg-bg/40 overflow-hidden"
    >
      {/* subtle accent gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "linear-gradient(120deg, rgba(37,99,235,0.06) 0%, transparent 40%, rgba(168,85,247,0.05) 70%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-text-tertiary">
            Currently open for
          </span>
          <span className="flex items-center gap-2">
            <span
              ref={numberRef}
              className="font-heading text-3xl md:text-4xl font-800 text-text-primary tabular-nums"
            >
              2
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-text-secondary">
              new engagements
            </span>
          </span>
        </div>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-text-secondary">
          {services.map((s, i) => (
            <li key={s} className="flex items-center gap-3" data-service>
              {i > 0 && (
                <span className="hidden md:inline-block w-1 h-1 rounded-full bg-border" />
              )}
              <span className="font-body tracking-tight">{s}</span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="group inline-flex items-center gap-2 text-[12px] text-accent hover:text-accent-hover transition-colors duration-150 cursor-pointer whitespace-nowrap"
        >
          Make an inquiry
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
