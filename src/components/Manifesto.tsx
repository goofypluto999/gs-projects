"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Beat {
  kicker: string;
  /** Each line is a separate translated word for animation */
  lines: string[];
  /** Optional small descriptor */
  caption?: string;
  accent?: string;
}

const beats: Beat[] = [
  {
    kicker: "I.",
    lines: ["Five live", "products."],
    caption: "All in production. All paying customers. All built by one person.",
    accent: "#2563EB",
  },
  {
    kicker: "II.",
    lines: ["Zero", "templates."],
    caption: "Every screen, every flow, every line of copy — written from scratch.",
    accent: "#A855F7",
  },
  {
    kicker: "III.",
    lines: ["Two open-", "source tools."],
    caption: "CV Mirror + the AimVantage ATS scanner. MIT licence. Run them locally.",
    accent: "#10B981",
  },
  {
    kicker: "IV.",
    lines: ["Three years.", "One operator."],
    caption: "No team. No co-founder. No outside capital. Built end-to-end.",
    accent: "#F59E0B",
  },
];

/**
 * Pinned scrollytelling sequence — the section sticks for ~4 viewport-heights
 * of scroll, and the four manifesto beats fade in / out as user scrubs.
 * Each beat occupies the full viewport with massive editorial typography.
 *
 * This is the show-stopper moment. Desktop only — mobile gets a static
 * compact version below.
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const beatEls = track.querySelectorAll("[data-beat]");
      // Set all beats invisible except the first
      beatEls.forEach((el, i) => {
        gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 60 });
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * beats.length}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Map progress 0..1 to beat index 0..N-1
          const exact = self.progress * beats.length;
          const idx = Math.min(beats.length - 1, Math.floor(exact));

          beatEls.forEach((el, i) => {
            // Fade in for [i, i+1), fade out as we leave
            const local = exact - i;
            let opacity = 0;
            let y = 60;
            if (local < 0) {
              opacity = 0;
              y = 60;
            } else if (local < 0.15) {
              opacity = local / 0.15;
              y = 60 * (1 - local / 0.15);
            } else if (local < 0.85) {
              opacity = 1;
              y = 0;
            } else if (local < 1) {
              opacity = 1 - (local - 0.85) / 0.15;
              y = -60 * ((local - 0.85) / 0.15);
            }
            gsap.set(el, { opacity, y });
          });

          if (progressRef.current) {
            gsap.set(progressRef.current, { scaleX: self.progress });
          }
          if (counterRef.current) {
            counterRef.current.textContent = String(idx + 1).padStart(2, "0");
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hidden lg:block relative h-screen overflow-hidden bg-bg"
    >
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border z-20">
        <div
          ref={progressRef}
          className="h-full bg-accent origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 px-10 py-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-text-tertiary">
            Manifesto · scroll to read
          </span>
        </div>
        <div className="flex items-baseline gap-2 text-[11px] text-text-tertiary tabular-nums">
          <span
            ref={counterRef}
            className="font-heading text-2xl font-700 text-text-primary"
          >
            01
          </span>
          <span className="opacity-50">/</span>
          <span>{String(beats.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Pinned beat stack */}
      <div
        ref={trackRef}
        className="relative h-full flex items-center justify-center px-10"
      >
        {beats.map((b, i) => (
          <div
            key={i}
            data-beat
            className="absolute inset-0 flex flex-col items-start justify-center px-[10vw] will-change-transform"
          >
            <div className="flex items-baseline gap-6 mb-8">
              <span
                className="font-heading text-2xl font-300 italic"
                style={{ color: b.accent }}
              >
                {b.kicker}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                Beat {String(i + 1).padStart(2, "0")} / {String(beats.length).padStart(2, "0")}
              </span>
            </div>

            <h2
              className="font-heading font-800 leading-[0.92] tracking-[-0.04em] text-text-primary"
              style={{ fontSize: "clamp(4rem, 13vw, 13rem)" }}
            >
              {b.lines.map((line, li) => (
                <span
                  key={li}
                  className="block"
                  style={{ color: li === b.lines.length - 1 ? b.accent : undefined }}
                >
                  {line}
                </span>
              ))}
            </h2>

            {b.caption && (
              <p className="mt-10 max-w-[640px] text-lg text-text-secondary leading-relaxed">
                {b.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary/70">
          ↓ Keep scrolling
        </span>
      </div>
    </section>
  );
}

/**
 * Mobile variant — stacks all 4 beats vertically with smaller type and
 * scroll-reveal fade-in. No pinning (would feel broken on touch).
 */
export function ManifestoMobile() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const items = wrapRef.current?.querySelectorAll<HTMLElement>("[data-mbeat]");
    if (!items?.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reduced motion → no reveal animation, just show everything immediately
    if (reduce) {
      items.forEach((item) => item.classList.add("mbeat-revealed"));
      return;
    }

    // Pure IntersectionObserver reveal — adds .mbeat-revealed class when
    // a beat enters view. CSS handles the fade-in. Switched off GSAP
    // because gsap.fromTo with ScrollTrigger was setting opacity:0 inline
    // and never firing the trigger fast enough on mobile, leaving beats
    // permanently invisible.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("mbeat-revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={wrapRef} className="lg:hidden px-6 py-20 bg-bg">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
          Manifesto
        </span>
      </div>

      <div className="space-y-14">
        {beats.map((b, i) => (
          <div key={i} data-mbeat>
            <div className="flex items-baseline gap-4 mb-4">
              <span
                className="font-heading text-lg font-300 italic"
                style={{ color: b.accent }}
              >
                {b.kicker}
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-text-tertiary">
                Beat {String(i + 1).padStart(2, "0")} / {String(beats.length).padStart(2, "0")}
              </span>
            </div>

            <h2
              className="font-heading font-800 leading-[0.95] tracking-[-0.03em] text-text-primary"
              style={{ fontSize: "clamp(2.25rem, 11vw, 4rem)" }}
            >
              {b.lines.map((line, li) => (
                <span
                  key={li}
                  className="block"
                  style={{ color: li === b.lines.length - 1 ? b.accent : undefined }}
                >
                  {line}
                </span>
              ))}
            </h2>

            {b.caption && (
              <p className="mt-5 text-[14px] text-text-secondary leading-relaxed">
                {b.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
