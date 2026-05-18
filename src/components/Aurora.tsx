"use client";

/**
 * Slow-drifting soft colour blobs — aurora-style ambient background.
 * Pure CSS keyframes, no JS frame loop, no GPU shaders required.
 * Premium-feeling alternative to particle/meteor effects.
 */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />

      <style jsx>{`
        .aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          mix-blend-mode: screen;
        }
        .aurora-1 {
          width: 520px;
          height: 520px;
          top: -10%;
          left: -8%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.6) 0%, transparent 60%);
          animation: drift1 18s ease-in-out infinite alternate;
        }
        .aurora-2 {
          width: 600px;
          height: 600px;
          top: 30%;
          right: -12%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, transparent 60%);
          animation: drift2 22s ease-in-out infinite alternate;
        }
        .aurora-3 {
          width: 440px;
          height: 440px;
          bottom: -10%;
          left: 35%;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, transparent 60%);
          animation: drift3 26s ease-in-out infinite alternate;
        }
        @keyframes drift1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(120px, 60px) scale(1.12); }
        }
        @keyframes drift2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-90px, 80px) scale(0.92); }
        }
        @keyframes drift3 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, -70px) scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob { animation: none; }
        }
      `}</style>
    </div>
  );
}
