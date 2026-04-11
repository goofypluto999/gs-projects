"use client";

import { useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { animateStaggerIn } from "@/lib/animations";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}

export function SectionReveal({
  children,
  className = "",
  stagger = false,
}: SectionRevealProps) {
  const { ref, isVisible } = useScrollReveal(0.08);
  const animated = useRef(false);

  useEffect(() => {
    if (!isVisible || animated.current) return;
    animated.current = true;

    const el = ref.current;
    if (!el) return;

    el.style.opacity = "1";
    el.style.transform = "translateY(0)";

    if (stagger) {
      const items = el.querySelectorAll("[data-reveal-item]");
      if (items.length > 0) {
        animateStaggerIn(Array.from(items) as HTMLElement[]);
      }
    }
  }, [isVisible, stagger, ref]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        ...(isVisible ? { opacity: 1, transform: "translateY(0)" } : {}),
      }}
    >
      {children}
    </div>
  );
}
