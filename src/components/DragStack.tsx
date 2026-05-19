"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";

/**
 * Draggable 3D spec-card stack — Tinder-style, but for digital products.
 * - 5 cards stacked in 3D depth using CSS perspective + translateZ
 * - Drag the top card; release past a threshold to send it to the back
 * - Each card is a TYPOGRAPHIC SPEC SHEET, not a screenshot, so this view
 *   is visually distinct from HorizontalShowcase (cinema screenshots) and
 *   ProjectGrid (thumbnail grid). Three takes on the same five products,
 *   not three identical screenshot reels.
 *
 * The redesign drops WindowChrome + previewImage in favour of:
 *   - editorial project wordmark
 *   - one standout metric (e.g. "500K agents simulated per run")
 *   - three supporting stats
 *   - tags + a dual-accent gradient background per product
 */

interface DragStackProps {
  className?: string;
}

const CARD_W = 720;
const CARD_H = 460;

export function DragStack({ className = "" }: DragStackProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [stack, setStack] = useState(() => projects.map((_, i) => i));
  const [drag, setDrag] = useState<{ id: number; x: number; y: number; rot: number } | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lastMoveRef = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function onMove(e: PointerEvent) {
      if (!drag || !startRef.current) return;
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      lastMoveRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      setDrag({
        id: drag.id,
        x: dx,
        y: dy,
        rot: dx * 0.06,
      });
    }

    function onUp() {
      if (!drag) return;
      const dist = Math.sqrt(drag.x * drag.x + drag.y * drag.y);
      const threshold = 180;

      if (dist > threshold) {
        setStack((prev) => {
          const next = [...prev];
          next.shift();
          next.push(drag.id);
          return next;
        });
      }
      setDrag(null);
      startRef.current = null;
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag]);

  function onPointerDown(e: React.PointerEvent, id: number) {
    if (stack[0] !== id) return;
    e.preventDefault();
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ id, x: 0, y: 0, rot: 0 });
  }

  function skipToNext() {
    setStack((prev) => {
      const next = [...prev];
      const head = next.shift();
      if (head !== undefined) next.push(head);
      return next;
    });
  }

  return (
    <section className={`hidden lg:flex flex-col items-center px-6 py-24 ${className}`}>
      <div className="mx-auto max-w-[1280px] w-full">
        {/* Header */}
        <div className="flex items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-text-tertiary">
                Spec stack · Drag any card to flip through
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-700 text-text-primary leading-[1.05] tracking-tight">
              Same five products,
              <br />
              <span className="text-text-secondary italic font-300">
                seen as data not screens.
              </span>
            </h2>
          </div>
          <button
            onClick={skipToNext}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-body border border-border hover:border-border-hover text-text-primary rounded-md transition-colors duration-150 cursor-pointer"
          >
            Skip to next
            <span>→</span>
          </button>
        </div>

        <div
          ref={wrapRef}
          className="relative mx-auto select-none"
          style={{
            width: CARD_W,
            height: CARD_H,
            perspective: 1600,
          }}
        >
          {stack.map((projectIdx, stackPos) => {
            const p = projects[projectIdx];
            const isTop = stackPos === 0;
            const isDragging = isTop && drag !== null;
            const z = -stackPos * 60;
            const yOff = stackPos * 22;
            const scale = 1 - stackPos * 0.04;
            const opacity = stackPos > 3 ? 0 : 1 - stackPos * 0.12;

            const tx = isDragging ? drag.x : 0;
            const ty = isDragging ? drag.y : 0;
            const rot = isDragging ? drag.rot : 0;

            return (
              <div
                key={projectIdx}
                onPointerDown={(e) => onPointerDown(e, projectIdx)}
                className="absolute inset-0 will-change-transform rounded-xl overflow-hidden border border-border"
                style={{
                  background: `
                    radial-gradient(ellipse at 90% 0%, ${p.accent}28 0%, transparent 55%),
                    radial-gradient(ellipse at 0% 100%, ${p.accent}14 0%, transparent 60%),
                    linear-gradient(135deg, #141415 0%, #0E0E10 100%)
                  `,
                  transform: `translateX(${tx}px) translateY(${ty + yOff}px) translateZ(${z}px) rotate(${rot}deg) scale(${scale})`,
                  transition: isDragging
                    ? "none"
                    : "transform 0.55s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease",
                  opacity,
                  zIndex: 10 - stackPos,
                  cursor: isTop ? (isDragging ? "grabbing" : "grab") : "default",
                  pointerEvents: stackPos > 2 ? "none" : "auto",
                  boxShadow:
                    stackPos === 0
                      ? "0 30px 60px -20px rgba(0,0,0,0.55)"
                      : "0 10px 30px -10px rgba(0,0,0,0.4)",
                }}
              >
                {/* Subtle hairline accent at the top */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${p.accent}80, transparent)`,
                  }}
                />

                {/* Top eyebrow strip */}
                <div className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: p.accent }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary tabular-nums">
                      GS · 00{projectIdx + 1} · {p.year} · {p.status}
                    </span>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </div>

                {/* Main editorial layout */}
                <div className="absolute inset-0 px-10 pt-16 pb-8 flex flex-col">
                  {/* Wordmark */}
                  <h3
                    className="font-heading text-[44px] md:text-[56px] font-800 leading-[0.95] tracking-[-0.025em] text-text-primary"
                    style={{
                      textShadow: `0 0 24px ${p.accent}33`,
                    }}
                  >
                    {p.name}
                    <span
                      className="ml-0.5"
                      style={{ color: p.accent }}
                    >
                      .
                    </span>
                  </h3>

                  <p className="mt-3 text-text-secondary text-[15px] max-w-[440px] leading-snug">
                    {p.tagline}
                  </p>

                  {/* Big metric */}
                  <div className="mt-auto mb-6 flex items-baseline gap-4">
                    <span
                      className="font-heading text-[88px] md:text-[112px] font-800 leading-none tabular-nums tracking-[-0.04em]"
                      style={{ color: p.accent }}
                    >
                      {p.metric.value}
                    </span>
                    <span className="text-[12px] uppercase tracking-[0.25em] text-text-tertiary max-w-[120px] leading-snug">
                      {p.metric.label}
                    </span>
                  </div>

                  {/* Supporting stats row */}
                  <div className="grid grid-cols-3 gap-4 border-t border-border pt-5">
                    {p.detailStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="border-l pl-3 first:border-l-0 first:pl-0"
                        style={{
                          borderLeftColor: "var(--color-border)",
                        }}
                      >
                        <span className="block text-[9.5px] uppercase tracking-[0.25em] text-text-tertiary leading-tight">
                          {stat.label}
                        </span>
                        <span className="block mt-1.5 text-[13px] text-text-primary font-500 leading-snug">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex items-center gap-3">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-body rounded-md backdrop-blur-md cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                      style={{
                        backgroundColor: p.accent,
                        color: "white",
                      }}
                    >
                      Open live
                      <ArrowUpRight size={14} />
                    </a>
                    <span className="text-[11px] uppercase tracking-[0.25em] text-text-tertiary">
                      Drag to flip · {stack.length - 1} more behind
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hint counter */}
        <div className="mt-8 flex items-center justify-center gap-1.5">
          {stack.map((idx, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === 0 ? 24 : 6,
                backgroundColor:
                  i === 0
                    ? projects[stack[0]].accent
                    : "var(--color-border)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
