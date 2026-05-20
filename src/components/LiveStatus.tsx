"use client";

/**
 * Tiny pill in the top of the hero — visible signal that all 5 products
 * are currently live. Premium signal of substance over claim.
 */
export function LiveStatus() {
  return (
    <a
      href="#projects"
      className="group inline-flex items-center gap-2 min-h-11 px-3.5 py-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.04] backdrop-blur-sm hover:border-emerald-400/40 hover:bg-emerald-400/[0.06] transition-all duration-200 cursor-pointer"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span
          className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"
          style={{ boxShadow: "0 0 8px rgba(52, 211, 153, 0.7)" }}
        />
      </span>
      <span className="text-[11px] uppercase tracking-[0.2em] text-text-secondary group-hover:text-text-primary transition-colors duration-200">
        All 5 sites · live now
      </span>
    </a>
  );
}
