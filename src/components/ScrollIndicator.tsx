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
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-tertiary hover:text-text-secondary transition-colors duration-200 cursor-pointer"
      aria-label="Scroll to projects"
    >
      <ChevronDown
        size={20}
        className="animate-[pulse-down_2s_ease-in-out_infinite]"
      />
      <style jsx global>{`
        @keyframes pulse-down {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(4px); }
        }
      `}</style>
    </a>
  );
}
