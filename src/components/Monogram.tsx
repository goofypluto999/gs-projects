"use client";

/**
 * Custom geometric monogram for Giovanni Sizino — a stylized "GS" mark
 * formed by two stacked square strokes. Subtle accent dot in the
 * top-right corner. Inline SVG so it scales crisp.
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
      fill="none"
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
        rx="8"
        fill="var(--color-accent)"
      />

      {/* G — three-quarter open square */}
      <path
        d="M11 12 L11 22 L19 22 L19 18 L15 18"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />

      {/* S — diagonal slash */}
      <path
        d="M22 15 L29 15 L22 22 L29 22 L29 28 L22 28"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
        opacity="0.85"
      />

      {/* Accent dot top-right */}
      <circle cx="32" cy="8" r="1.5" fill="white" opacity="0.9" />
    </svg>
  );
}
