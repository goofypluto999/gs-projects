"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { WindowChrome } from "./WindowChrome";
import { PreviewImage } from "./PreviewImage";

/**
 * Mobile-only horizontal scroll-snap carousel of all 5 products.
 * Replaces the DragStack (desktop-only) for touch — swipeable cards,
 * native CSS scroll-snap, no JS scroll-jacking. Each card snaps to
 * centre, with a dot indicator at the bottom tracking position.
 *
 * Far more engaging than the vertical stack mobile would otherwise
 * see. Reads as a real touch interaction.
 */
export function MobileCarousel() {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    function onScroll() {
      if (!rail) return;
      const cardWidth = rail.clientWidth * 0.86; // matches min-w-[86%]
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
    const card = rail.querySelectorAll<HTMLElement>("[data-mc-card]")[i];
    if (card) {
      rail.scrollTo({ left: card.offsetLeft - rail.clientWidth * 0.07, behavior: "smooth" });
    }
  }

  return (
    <section className="lg:hidden py-12 overflow-hidden">
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
              Swipe the work
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
          <a
            key={p.id}
            data-mc-card
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-[86%] rounded-xl overflow-hidden border bg-surface relative transition-all duration-500 ease-out"
            style={{
              scrollSnapAlign: "center",
              borderColor: isActive ? `${p.accent}55` : "var(--color-border)",
              boxShadow: isActive
                ? `0 18px 40px -16px ${p.accent}55, 0 0 0 1px ${p.accent}22`
                : "0 4px 12px -6px rgba(0,0,0,0.3)",
              transform: isActive ? "scale(1)" : "scale(0.96)",
              opacity: isActive ? 1 : 0.72,
            }}
          >
            <div className="relative w-full aspect-[16/10] bg-bg">
              <WindowChrome
                url={p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              />
              <div className="absolute inset-0 pt-7">
                <PreviewImage
                  src={p.previewImage}
                  alt={`${p.name} preview`}
                  accent={p.accent}
                  fallback={
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: `radial-gradient(ellipse at center, ${p.accent}18 0%, transparent 70%)`,
                      }}
                    >
                      <span
                        className="font-heading text-2xl font-700"
                        style={{ color: p.accent }}
                      >
                        {p.name.charAt(0)}
                      </span>
                    </div>
                  }
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface/70 to-transparent pointer-events-none" />

              {i === 0 && (
                <div className="absolute top-9 left-3 z-10">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-md text-[9px] uppercase tracking-widest font-600"
                    style={{
                      backgroundColor: `${p.accent}30`,
                      color: "white",
                      border: `1px solid ${p.accent}60`,
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full animate-pulse"
                      style={{ backgroundColor: p.accent }}
                    />
                    Featured
                  </span>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: p.accent }}
                />
                <span className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                  {p.year} · {p.status}
                </span>
              </div>
              <h3 className="font-heading text-xl font-700 text-text-primary leading-[1.1]">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-text-secondary leading-snug">
                {p.tagline}
              </p>
              <span
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] cursor-pointer"
                style={{ color: p.accent }}
              >
                Open live
                <ArrowUpRight size={11} />
              </span>
            </div>
          </a>
          );
        })}
      </div>

      {/* Dot pagination — invisible 44x44 hit zone wraps the visible pill so
          tap targets meet Apple HIG without making the pills themselves huge. */}
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
  );
}
