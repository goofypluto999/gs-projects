"use client";

import { useMousePosition } from "@/hooks/useMousePosition";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  className = "",
  onClick,
}: SpotlightCardProps) {
  const { ref, position, handleMouseMove, handleMouseLeave } =
    useMousePosition();

  const spotlightActive = position.x !== 0 || position.y !== 0;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden border border-border rounded-lg bg-surface transition-colors duration-200 hover:border-border-hover cursor-pointer ${className}`}
      style={
        spotlightActive
          ? {
              background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(37,99,235,0.06), transparent 60%), var(--color-surface)`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
