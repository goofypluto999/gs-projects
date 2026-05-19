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
    </div>
  );
}
