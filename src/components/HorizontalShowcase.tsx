"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Horizontal-scroll cinema showcase — pins the section while vertical scroll
 * is translated into horizontal motion across all 5 product screenshots.
 * Classic Awwwards moment, the kind that wins SOTD. Uses ScrollTrigger
 * pinning + Lenis-driven scrub (no native smooth conflict).
 */
export function HorizontalShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalScrollWidth = track.scrollWidth - window.innerWidth;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${totalScrollWidth + 200}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const x = -totalScrollWidth * self.progress;
          gsap.set(track, { x });
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleX: self.progress });
          }
          if (numberRef.current) {
            const idx = Math.min(
              projects.length,
              Math.max(1, Math.ceil(self.progress * projects.length))
            );
            numberRef.current.textContent = String(idx).padStart(2, "0");
          }
        },
      });

      return () => trigger.kill();
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hidden lg:block relative h-screen overflow-hidden bg-bg"
    >
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-text-tertiary">
            Cinema mode · scroll to advance
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-text-tertiary tabular-nums">
          <span ref={numberRef} className="font-heading text-text-primary text-2xl font-700">
            01
          </span>
          <span className="opacity-50">/</span>
          <span>{String(projects.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border z-20">
        <div
          ref={progressBarRef}
          className="h-full bg-accent origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="h-full flex items-center gap-10 px-[10vw] will-change-transform"
        style={{ width: "max-content" }}
      >
        {projects.map((p, i) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative shrink-0 w-[80vw] max-w-[1100px] h-[70vh] rounded-xl overflow-hidden border border-border bg-surface cursor-pointer"
          >
            {/* HD screenshot */}
            <img
              src={p.previewImage}
              alt={`${p.name} preview`}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              loading={i < 2 ? "eager" : "lazy"}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/20 to-transparent pointer-events-none" />

            {/* Project number */}
            <div className="absolute top-6 left-6 z-10">
              <span className="font-heading text-7xl font-800 tracking-tighter leading-none text-white/15">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Featured ribbon for first card */}
            {i === 0 && (
              <div className="absolute top-6 right-6 z-10">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md text-[10.5px] uppercase tracking-widest font-600"
                  style={{
                    backgroundColor: `${p.accent}30`,
                    color: "white",
                    border: `1px solid ${p.accent}60`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: p.accent }}
                  />
                  Featured flagship
                </div>
              </div>
            )}

            {/* Bottom copy */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-10">
              <div className="flex items-end justify-between gap-6">
                <div className="max-w-[640px]">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: p.accent }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                      {p.year} · {p.status}
                    </span>
                  </div>
                  <h3 className="font-heading text-3xl md:text-5xl font-800 leading-[1.05] tracking-tight text-text-primary">
                    {p.name}
                  </h3>
                  <p className="mt-3 text-base text-text-secondary leading-relaxed">
                    {p.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-[10.5px] text-text-secondary border border-border bg-bg/40 backdrop-blur-sm px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <span
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-body rounded-md backdrop-blur-md"
                  style={{
                    backgroundColor: p.accent,
                    color: "white",
                  }}
                >
                  Open live
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          </a>
        ))}

        {/* Final outro slide */}
        <div className="shrink-0 w-[60vw] max-w-[800px] flex flex-col items-center justify-center px-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-text-tertiary mb-6">
            That&apos;s the lineup
          </span>
          <h3 className="font-heading text-4xl md:text-6xl font-800 leading-[0.95] tracking-tighter text-text-primary text-center">
            Five live products.
            <br />
            <span className="text-text-secondary italic font-300">
              One person.
            </span>
          </h3>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors duration-150 cursor-pointer"
          >
            Talk to me about a build
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
