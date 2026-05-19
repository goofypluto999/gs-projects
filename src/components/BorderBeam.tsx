"use client";

/**
 * Aceternity-inspired border beam effect.
 * A small light that traces the border of a container on hover.
 *
 * Size, duration, and colour pass as CSS variables consumed by the
 * shared `.border-beam-dot` rule + `@keyframes border-beam` in
 * globals.css. Keeps styling out of every render's scope hash.
 */
export function BorderBeam({
  duration = 3,
  size = 80,
  color = "rgba(37,99,235,0.5)",
}: {
  duration?: number;
  size?: number;
  color?: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
      <div
        className="border-beam-dot"
        style={
          {
            "--bb-size": `${size}px`,
            "--bb-half": `${size / 2}px`,
            "--bb-duration": `${duration}s`,
            "--bb-color": color,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
