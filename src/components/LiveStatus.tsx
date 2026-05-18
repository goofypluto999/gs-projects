"use client";

/**
 * Tiny pill in the top of the hero — visible signal that all 5 products
 * are currently live. Premium signal of substance over claim.
 */
export function LiveStatus() {
  return (
    <a
      href="#projects"
      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/40 backdrop-blur-sm hover:border-border-hover transition-colors duration-200 cursor-pointer"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
      </span>
      <span className="text-[11px] uppercase tracking-[0.2em] text-text-secondary group-hover:text-text-primary transition-colors duration-200">
        All 5 sites · live now
      </span>
    </a>
  );
}
