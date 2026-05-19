"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { WindowChrome } from "./WindowChrome";

/**
 * Draggable 3D card stack — Tinder-style, but for digital products.
 * - 5 cards stacked in 3D depth using CSS perspective + translateZ
 * - Drag any card with cursor; release to either snap back or fly off
 * - Throwing past a velocity threshold reveals the next card
 * - The whole stack lives in a 16:10 window — feels like a real device
 *
 * Desktop-only addition between Highlights and Testimonials. Provides
 * a TACTILE interaction moment — the visitor physically touches the work.
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

  // Pointer handlers
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
        // Throw the top card off and rotate stack
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
    if (stack[0] !== id) return; // only top card is draggable
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
                Hold-and-throw · Drag any card
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-700 text-text-primary leading-[1.05] tracking-tight">
              Touch the work,
              <br />
              <span className="text-text-secondary italic font-300">throw it sideways.</span>
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
                className="absolute inset-0 will-change-transform rounded-xl overflow-hidden border border-border bg-surface"
                style={{
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
                      ? "0 30px 60px -20px rgba(0,0,0,0.5)"
                      : "0 10px 30px -10px rgba(0,0,0,0.4)",
                }}
              >
                <WindowChrome
                  url={p.url
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                />
                <div className="absolute inset-0 pt-7">
                  <NextImage
                    src={p.previewImage}
                    alt={`${p.name} preview`}
                    fill
                    sizes="(max-width: 1024px) 0vw, 720px"
                    quality={85}
                    draggable={false}
                    className="object-cover object-top pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent pointer-events-none" />

                  {/* Card content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: p.accent }}
                      />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                        {p.year} · {p.status}
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-2xl md:text-3xl font-700 text-text-primary leading-[1.05]">
                          {p.name}
                        </h3>
                        <p className="text-sm text-text-secondary mt-1 max-w-[360px]">
                          {p.tagline}
                        </p>
                      </div>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-body rounded-md backdrop-blur-md cursor-pointer"
                        style={{
                          backgroundColor: p.accent,
                          color: "white",
                        }}
                      >
                        Open
                        <ArrowUpRight size={12} />
                      </a>
                    </div>
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
