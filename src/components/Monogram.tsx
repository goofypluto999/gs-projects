"use client";

/**
 * Brand monogram for Giovanni Sizino. Clean typographic 'GS' set in
 * Archivo 800 — uppercase, tight tracking — on an accent-blue rounded
 * square. Reads as 'GS', not as a stroke abstraction.
 *
 * The previous geometric-strokes version read as foreign script; this
 * version uses real letterforms in the same heading font the rest of
 * the site uses, so the mark is consistent with the wordmark below it.
 */
interface MonogramProps {
  className?: string;
  size?: number;
}

export function Monogram({ className = "", size = 28 }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Rounded square background */}
      <rect
        x="0"
        y="0"
        width="40"
        height="40"
        rx="9"
        fill="var(--color-accent)"
      />

      {/* GS in heading font — actual readable letterforms.
          x/y/font-size tuned so the letters sit balanced inside the square. */}
      <text
        x="50%"
        y="56%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontFamily="Archivo, system-ui, sans-serif"
        fontWeight="800"
        fontSize="20"
        letterSpacing="-0.6"
      >
        GS
      </text>
    </svg>
  );
}
