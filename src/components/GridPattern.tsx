"use client";

/**
 * Subtle dot grid background pattern.
 * Adds texture without being decorative — functional depth cue.
 */
export function GridPattern({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}
