"use client";

import { useEffect, useState, useRef } from "react";

export function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";

    let current = 0;
    const target = 100;
    const duration = 1400;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(eased * target);
      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCount(100);
        setTimeout(() => {
          if (wrapperRef.current) {
            wrapperRef.current.style.transform = "translateY(-100%)";
            wrapperRef.current.style.transition =
              "transform 800ms cubic-bezier(0.76, 0, 0.24, 1)";
          }
          setTimeout(() => {
            setDone(true);
            document.body.style.overflow = "";
          }, 850);
        }, 250);
      }
    }
    requestAnimationFrame(tick);

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[100] flex items-end justify-end bg-bg pointer-events-auto"
      aria-hidden="true"
    >
      {/* Top-left brand mark */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="font-heading text-xs tracking-widest text-text-secondary uppercase">
          GS / Sizino Ennes
        </span>
      </div>

      {/* Center label */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="font-body text-[11px] tracking-[0.25em] uppercase text-text-tertiary">
          Loading the workshop
        </p>
      </div>

      {/* Bottom-right counter */}
      <div className="p-6 pb-8 pr-8 flex items-end gap-3">
        <span className="font-heading text-[clamp(4rem,12vw,10rem)] font-800 leading-[0.85] tabular-nums text-text-primary">
          {String(count).padStart(2, "0")}
        </span>
        <span className="font-heading text-2xl text-text-tertiary mb-3">/ 100</span>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border">
        <div
          className="h-full bg-accent"
          style={{
            width: `${count}%`,
            transition: "width 100ms linear",
          }}
        />
      </div>
    </div>
  );
}
