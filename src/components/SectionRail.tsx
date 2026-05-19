"use client";

import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
  /** Per-section accent — matches the editorial palette used in
   *  BrandMarquee + ProjectCard accents so the rail reads as the
   *  page's table-of-contents in the same colour story. */
  accent: string;
}

const sections: Section[] = [
  { id: "top", label: "Intro", accent: "#2563EB" },
  { id: "projects", label: "Work", accent: "#6366F1" },
  { id: "process", label: "Process", accent: "#F97316" },
  { id: "about", label: "Who", accent: "#10B981" },
  { id: "contact", label: "Talk", accent: "#EF4444" },
];

/**
 * Sticky right-rail nav — a column of tiny dots showing which section
 * you're currently in. Apple/Spotify chapter-mark vibe. Desktop only.
 */
export function SectionRail() {
  const [active, setActive] = useState("top");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);

      // Detect which section is currently in view
      let current = "top";
      for (const s of sections) {
        if (s.id === "top") continue;
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.4) {
            current = s.id;
          }
        }
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Section rail"
      className={`hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-4 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={s.id === "top" ? "#" : `#${s.id}`}
            aria-label={`Jump to ${s.label}`}
            className="group flex items-center gap-3 cursor-pointer"
          >
            <span
              className={`text-[10px] uppercase tracking-[0.25em] transition-all duration-300 ${
                isActive
                  ? "opacity-100 text-text-primary translate-x-0"
                  : "opacity-0 group-hover:opacity-80 text-text-tertiary translate-x-2 group-hover:translate-x-0"
              }`}
            >
              {s.label}
            </span>
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: isActive ? "24px" : "4px",
                height: "4px",
                backgroundColor: isActive ? s.accent : "rgba(113, 113, 122, 0.4)",
                boxShadow: isActive ? `0 0 8px ${s.accent}66` : "none",
              }}
            />
          </a>
        );
      })}
    </nav>
  );
}
