"use client";

/**
 * Dithered halftone gradient overlay — cult-ui hero-dithering inspired.
 * Pure CSS: radial-gradient stops + tiny dot pattern. Adds tactile,
 * print-like depth on hero/featured cards without WebGL.
 */
interface HalftoneProps {
  className?: string;
  /** 0–1 — how dense the dots are */
  density?: number;
  /** hex colour for the dots */
  dotColor?: string;
}

export function Halftone({
  className = "",
  density = 0.5,
  dotColor = "#FAFAFA",
}: HalftoneProps) {
  // Convert density into background-size — denser = smaller cells
  const cell = `${Math.max(3, 10 - density * 6)}px`;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `radial-gradient(${dotColor} 0.6px, transparent 0.7px)`,
        backgroundSize: `${cell} ${cell}`,
        maskImage:
          "radial-gradient(ellipse at center, black 0%, black 25%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 0%, black 25%, transparent 70%)",
        opacity: 0.18,
      }}
    />
  );
}
