"use client";

/**
 * Aceternity-inspired border beam effect.
 * A small light that traces the border of a container on hover.
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
        className="absolute"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animation: `border-beam ${duration}s linear infinite`,
          top: "-40px",
          left: "-40px",
        }}
      />
      <style jsx>{`
        @keyframes border-beam {
          0% {
            top: -${size / 2}px;
            left: -${size / 2}px;
          }
          25% {
            top: -${size / 2}px;
            left: calc(100% - ${size / 2}px);
          }
          50% {
            top: calc(100% - ${size / 2}px);
            left: calc(100% - ${size / 2}px);
          }
          75% {
            top: calc(100% - ${size / 2}px);
            left: -${size / 2}px;
          }
          100% {
            top: -${size / 2}px;
            left: -${size / 2}px;
          }
        }
      `}</style>
    </div>
  );
}
