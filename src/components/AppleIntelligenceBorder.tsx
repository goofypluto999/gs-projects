"use client";

/**
 * Apple Intelligence-style animated gradient border.
 *
 * A rotating conic-gradient that lives on the rim of its container,
 * masked by a thin border-radius inset so only a glow runs around the
 * edge. Colours pulse through blue → purple → magenta → orange → blue,
 * matching the iOS 18 'Apple Intelligence' summon effect.
 *
 * Uses CSS @property for smooth --angle rotation (Houdini). Falls back
 * to a static gradient on browsers without @property support.
 *
 * Place as a child of a position:relative parent and let it fill the
 * parent via inset-0. Optional intensity (blur radius for the glow).
 */

interface AppleIntelligenceBorderProps {
  /** Border thickness in px */
  thickness?: number;
  /** Outer glow blur (sm/md/lg/xl) */
  intensity?: "sm" | "md" | "lg" | "xl";
  /** Rotation duration in seconds */
  speed?: number;
  /** Border radius of the rim — should match the container */
  radius?: number;
  className?: string;
}

const INTENSITY: Record<string, { blur: string; spread: string; opacity: number }> = {
  sm: { blur: "12px", spread: "4px", opacity: 0.7 },
  md: { blur: "20px", spread: "6px", opacity: 0.85 },
  lg: { blur: "36px", spread: "10px", opacity: 1 },
  xl: { blur: "60px", spread: "14px", opacity: 1 },
};

export function AppleIntelligenceBorder({
  thickness = 2,
  intensity = "lg",
  speed = 4,
  radius = 0,
  className = "",
}: AppleIntelligenceBorderProps) {
  const conf = INTENSITY[intensity];
  const vars = {
    "--ai-thickness": `${thickness}px`,
    "--ai-radius": `${radius}px`,
    "--ai-speed": `${speed}s`,
    "--ai-opacity": String(conf.opacity),
    "--ai-blur": conf.blur,
  } as React.CSSProperties;

  return (
    <>
      <div className={`ai-glow ${className}`} aria-hidden="true" style={vars} />
      <div className="ai-border" aria-hidden="true" style={vars} />
    </>
  );
}
