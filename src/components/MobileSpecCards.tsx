"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { ProjectDetail } from "./ProjectDetail";

/**
 * Mobile-only spec-card carousel — touch-swipeable version of the desktop
 * DragStack. Same editorial treatment (no screenshots, huge accent
 * number, project wordmark, 3 supporting stats) but laid out as a
 * horizontal scroll-snap track instead of a stack.
 *
 * Existed because the desktop DragStack was 100% gated behind lg+. Mobile
 * visitors couldn't see the per-product *data* view of the work — just
 * screenshots in MobileCarousel + a case-study list. This brings the
 * third project showcase to mobile so the page no longer feels stripped
 * back from desktop.
 *
 * Tapping anywhere on the card opens the full case-study modal via
 * ProjectDetail. Tapping the "Open live" pill bubbles up and opens the
 * actual product in a new tab.
 */
export function MobileSpecCards() {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    function onScroll() {
      if (!rail) return;
      const cardWidth = rail.clientWidth * 0.86;
      const center = rail.scrollLeft + rail.clientWidth / 2;
      const idx = Math.min(
        projects.length - 1,
        Math.max(0, Math.round((center - rail.clientWidth / 2) / cardWidth))
      );
      setActive(idx);
    }
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToIndex(i: number) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelectorAll<HTMLElement>("[data-spec-card]")[i];
    if (card) {
      rail.scrollTo({
        left: card.offsetLeft - rail.clientWidth * 0.07,
        behavior: "smooth",
      });
    }
  }

  return (
    <>
      <section className="lg:hidden py-14 overflow-hidden">
        <div className="px-6 mb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                Specs · Swipe the data
              </span>
            </div>
            <span className="text-[10px] text-text-tertiary tabular-nums">
              <span className="text-text-primary font-heading text-base font-700">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="opacity-50 mx-1">/</span>
              <span>{String(projects.length).padStart(2, "0")}</span>
            </span>
          </div>

          <h2
            className="mt-3 font-heading font-700 text-text-primary leading-[1.05] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 8vw, 2.75rem)" }}
          >
            Same five products,
            <br />
            <span className="text-text-secondary italic font-300">
              seen as data not screens.
            </span>
          </h2>
        </div>

        {/* Snap rail */}
        <div
          ref={railRef}
          className="mobile-snap-rail flex gap-4 px-6 pb-2 overflow-x-auto overscroll-x-contain"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {projects.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.id}
                data-spec-card
                onClick={() => setSelected(p)}
                aria-label={`${p.name} — open case study`}
                className="group shrink-0 w-[86%] rounded-xl overflow-hidden border text-left relative transition-all duration-500 ease-out"
                style={{
                  scrollSnapAlign: "center",
                  background: `
                    radial-gradient(ellipse at 90% 0%, ${p.accent}28 0%, transparent 55%),
                    radial-gradient(ellipse at 0% 100%, ${p.accent}14 0%, transparent 60%),
                    linear-gradient(135deg, #141415 0%, #0E0E10 100%)
                  `,
                  borderColor: isActive ? `${p.accent}55` : "var(--color-border)",
                  boxShadow: isActive
                    ? `0 24px 48px -18px ${p.accent}55, 0 0 0 1px ${p.accent}22`
                    : "0 4px 12px -6px rgba(0,0,0,0.3)",
                  transform: isActive ? "scale(1)" : "scale(0.95)",
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {/* Hairline accent at the very top */}
                <span
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${p.accent}88, transparent)`,
                  }}
                  aria-hidden="true"
                />

                <div className="relative p-6 pb-5 flex flex-col min-h-[420px]">
                  {/* Eyebrow strip */}
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: p.accent }}
                      />
                      <span className="text-[9px] uppercase tracking-[0.3em] text-text-tertiary tabular-nums">
                        GS · 00{i + 1} · {p.status}
                      </span>
                    </div>
                  </div>

                  {/* Wordmark */}
                  <h3
                    className="font-heading text-[32px] font-800 leading-[0.95] tracking-[-0.025em] text-text-primary"
                    style={{ textShadow: `0 0 16px ${p.accent}33` }}
                  >
                    {p.name}
                    <span className="ml-0.5" style={{ color: p.accent }}>
                      .
                    </span>
                  </h3>

                  <p className="mt-2 text-text-secondary text-[13px] leading-snug">
                    {p.tagline}
                  </p>

                  {/* Big metric */}
                  <div className="mt-auto mb-5 flex items-baseline gap-3">
                    <span
                      className="font-heading text-[68px] font-800 leading-none tabular-nums tracking-[-0.04em]"
                      style={{ color: p.accent }}
                    >
                      {p.metric.value}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary max-w-[100px] leading-snug">
                      {p.metric.label}
                    </span>
                  </div>

                  {/* Supporting stats row — 3 cols at full mobile width */}
                  <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
                    {p.detailStats.map((stat, si) => (
                      <div
                        key={stat.label}
                        className={si === 0 ? "" : "border-l border-border pl-3"}
                      >
                        <span className="block text-[8.5px] uppercase tracking-[0.25em] text-text-tertiary leading-tight">
                          {stat.label}
                        </span>
                        <span className="block mt-1 text-[11px] text-text-primary font-500 leading-snug">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="mt-5 flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-500 uppercase tracking-[0.2em]"
                      style={{ color: p.accent }}
                    >
                      Tap to read
                      <ArrowUpRight size={11} />
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary ml-auto">
                      Swipe →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dot pagination */}
        <div className="px-6 mt-3 flex items-center justify-center gap-0.5">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${p.name}`}
              aria-current={i === active ? "true" : undefined}
              className="inline-flex items-center justify-center min-w-11 min-h-11 px-1 group cursor-pointer"
            >
              <span
                className="block h-[3px] rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 26 : 8,
                  backgroundColor: i === active ? p.accent : "var(--color-border)",
                }}
              />
            </button>
          ))}
        </div>
      </section>

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
