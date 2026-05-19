"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY < 100);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#projects"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center justify-center min-w-11 min-h-11 text-text-tertiary hover:text-text-secondary transition-colors duration-200 cursor-pointer"
      aria-label="Scroll to projects"
    >
      <ChevronDown
        size={20}
        className="scroll-indicator-arrow"
      />
    </a>
  );
}
