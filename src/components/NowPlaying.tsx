"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

interface NowItem {
  emoji?: string;
  label: string;
  product: string;
  accent: string;
}

const items: NowItem[] = [
  { label: "Polishing calibration vault", product: "Foresay Labs", accent: "#6366F1" },
  { label: "Building CLI tone selector", product: "AimVantage", accent: "#F59E0B" },
  { label: "Indexing 12K more games", product: "Wadda Play", accent: "#A855F7" },
  { label: "Writing today's MCP dispatch", product: "AdsForge", accent: "#EF4444" },
  { label: "Adding bias detector v2", product: "CV Mirror", accent: "#10B981" },
];

/**
 * Tiny status pill — shows what Giovanni is "currently shipping" with
 * the per-product accent. Cycles through items with crossfade.
 * Premium signal of an active operator.
 */
export function NowPlaying() {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (!ref.current) {
        setI((p) => (p + 1) % items.length);
        return;
      }
      gsap.to(ref.current, {
        opacity: 0,
        y: -6,
        duration: 0.25,
        ease: "power3.in",
        onComplete: () => {
          setI((p) => (p + 1) % items.length);
          if (ref.current) {
            gsap.fromTo(
              ref.current,
              { opacity: 0, y: 6 },
              { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }
            );
          }
        },
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const item = items[i];

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/40 backdrop-blur-sm text-[11px]">
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ backgroundColor: item.accent }}
          />
          <span
            className="relative inline-flex rounded-full h-1.5 w-1.5"
            style={{ backgroundColor: item.accent }}
          />
        </span>
        <span className="uppercase tracking-[0.18em] text-text-tertiary">Now</span>
      </span>
      <span ref={ref} className="inline-flex items-baseline gap-1.5 tabular-nums">
        <span className="text-text-secondary">{item.label}</span>
        <span className="text-text-tertiary">·</span>
        <span style={{ color: item.accent }} className="font-600">
          {item.product}
        </span>
      </span>
    </span>
  );
}
