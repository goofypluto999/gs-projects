"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Sticky mobile contact button — bottom-right floating pill that surfaces
 * once the visitor has scrolled past the hero, and quietly steps aside
 * when the contact section itself comes into view. Compresses the user
 * journey from "scroll through 12 sections to find an email" to "one tap
 * from anywhere on the page".
 *
 * Mobile-only by class gate (lg:hidden). On touch devices the bottom
 * safe-area inset is respected so the pill clears the iPhone home
 * indicator. Hidden under prefers-reduced-motion is not required — the
 * pill itself doesn't animate decoratively, just fades in.
 */
export function StickyContactCTA() {
  const [visible, setVisible] = useState(false);
  const [nearContact, setNearContact] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function onScroll() {
      const past = window.scrollY > 600;
      setVisible(past);

      // Hide when contact section is within ~1.2x viewport heights
      const contact = document.getElementById("contact");
      if (contact) {
        const rect = contact.getBoundingClientRect();
        setNearContact(rect.top < window.innerHeight * 1.2);
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shouldShow = visible && !nearContact;

  return (
    <a
      href="#contact"
      aria-label="Jump to contact section"
      aria-hidden={!shouldShow}
      tabIndex={shouldShow ? 0 : -1}
      className="lg:hidden fixed z-40 inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-full bg-accent text-white text-[12.5px] font-600 tracking-tight shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] hover:bg-accent-hover active:scale-[0.97] transition-all duration-300 cursor-pointer backdrop-blur-md"
      style={{
        right: "calc(env(safe-area-inset-right, 0px) + 1rem)",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
        opacity: shouldShow ? 1 : 0,
        transform: shouldShow ? "translateY(0)" : "translateY(20px)",
        pointerEvents: shouldShow ? "auto" : "none",
      }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-60 animate-ping" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
      </span>
      Talk
      <ArrowUpRight size={13} strokeWidth={2.25} />
    </a>
  );
}
