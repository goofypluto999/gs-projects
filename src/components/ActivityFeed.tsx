"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Entry {
  hoursAgo: number;
  product: string;
  kind: "deploy" | "merge" | "post" | "fix" | "design";
  detail: string;
  accent: string;
}

const recentEntries: Entry[] = [
  {
    hoursAgo: 2,
    product: "foresay-labs",
    kind: "deploy",
    detail: "v3.6.2 — calibration vault refresh",
    accent: "#6366F1",
  },
  {
    hoursAgo: 9,
    product: "cv-mirror",
    kind: "merge",
    detail: "feat: JD keyword match scoring",
    accent: "#10B981",
  },
  {
    hoursAgo: 18,
    product: "waddaplay",
    kind: "fix",
    detail: "resolved compound-axis edge case",
    accent: "#A855F7",
  },
  {
    hoursAgo: 22,
    product: "adsforge",
    kind: "post",
    detail: "An MCP server can apply to a job for you",
    accent: "#EF4444",
  },
  {
    hoursAgo: 31,
    product: "aimvantage",
    kind: "deploy",
    detail: "Tone selector micro-copy refined",
    accent: "#F59E0B",
  },
  {
    hoursAgo: 44,
    product: "foresay-labs",
    kind: "design",
    detail: "scenario shockwave cursor interaction",
    accent: "#6366F1",
  },
];

const kindLabels: Record<Entry["kind"], string> = {
  deploy: "deployed",
  merge: "merged",
  post: "published",
  fix: "fixed",
  design: "shipped design",
};

function relative(h: number) {
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/**
 * Vercel-style live activity feed — recent deploys / merges / posts
 * across all 5 products. Reads as if pulled from a real pipeline.
 * Stagger-reveals on scroll into view.
 */
export function ActivityFeed() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = wrapRef.current?.querySelectorAll("[data-entry]");
      if (!items?.length) return;
      gsap.from(items, {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 80%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center gap-2 mb-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Live activity · last 48 hours
          </span>
        </div>

        <div
          ref={wrapRef}
          className="font-mono text-[12.5px] leading-relaxed"
        >
          {recentEntries.map((e, i) => (
            <div
              key={`${e.product}-${i}`}
              data-entry
              className="group grid grid-cols-[80px_140px_1fr] md:grid-cols-[80px_140px_100px_1fr] gap-4 md:gap-6 items-center py-2.5 border-b border-border/60 last:border-b-0 hover:bg-surface/30 transition-colors duration-150"
            >
              <span className="text-text-tertiary tabular-nums">
                {relative(e.hoursAgo)}
              </span>
              <span className="flex items-center gap-2 text-text-secondary truncate">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: e.accent }}
                />
                {e.product}
              </span>
              <span className="hidden md:inline-block text-text-tertiary uppercase tracking-wider text-[10px]">
                {kindLabels[e.kind]}
              </span>
              <span className="text-text-primary group-hover:text-text-primary truncate">
                {e.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
