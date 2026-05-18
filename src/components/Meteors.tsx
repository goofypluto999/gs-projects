"use client";

import { useEffect, useState } from "react";

interface MeteorsProps {
  /** Number of meteor lines */
  number?: number;
  className?: string;
}

interface MeteorStyle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

/**
 * Magic UI-inspired diagonal meteor streaks across a section.
 * Pure CSS animations, no JS frame loop. Respects reduced motion via CSS.
 */
export function Meteors({ number = 20, className = "" }: MeteorsProps) {
  const [meteors, setMeteors] = useState<MeteorStyle[]>([]);

  useEffect(() => {
    const arr: MeteorStyle[] = Array.from({ length: number }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 80 - 20}%`,
      animationDelay: `${Math.random() * 4}s`,
      animationDuration: `${4 + Math.random() * 6}s`,
    }));
    setMeteors(arr);
  }, [number]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {meteors.map((style, i) => (
        <span
          key={i}
          className="meteor absolute rounded-[9999px] bg-text-secondary/40 shadow-[0_0_0_1px_#ffffff10]"
          style={style}
        />
      ))}
      <style jsx>{`
        .meteor {
          width: 1px;
          height: 1px;
          animation-name: meteor;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        .meteor::before {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 1px;
          background: linear-gradient(90deg, var(--color-text-secondary), transparent);
          opacity: 0.5;
        }
        @keyframes meteor {
          0% {
            transform: rotate(215deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(215deg) translateX(-500px);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .meteor {
            animation: none !important;
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
