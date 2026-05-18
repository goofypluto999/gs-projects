"use client";

import { useEffect, useRef, useState } from "react";

interface PreviewImageProps {
  src: string;
  alt: string;
  /** Fallback to render if image fails */
  fallback: React.ReactNode;
  /** Skeleton shimmer overlay accent color */
  accent: string;
  className?: string;
  eager?: boolean;
}

/**
 * Skeleton + image with crossfade. Used for thum.io screenshots which
 * sometimes take 5-10s to fetch on first load. Premium-feeling load state
 * instead of a flash of blank.
 */
export function PreviewImage({
  src,
  alt,
  fallback,
  accent,
  className = "",
  eager = false,
}: PreviewImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalHeight !== 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Static fallback always visible underneath */}
      <div className="absolute inset-0">{fallback}</div>

      {/* Shimmer skeleton overlay while loading */}
      {!loaded && !errored && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 shimmer"
            style={{
              background: `linear-gradient(110deg, transparent 30%, ${accent}10 50%, transparent 70%)`,
              backgroundSize: "200% 100%",
            }}
          />
          <style jsx>{`
            .shimmer {
              animation: shimmer 1.6s infinite linear;
            }
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            @media (prefers-reduced-motion: reduce) {
              .shimmer { animation: none; }
            }
          `}</style>
        </div>
      )}

      {!errored && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          className={`ken-burns absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}

      {/* Slow Ken Burns zoom — adds subtle motion to static screenshots */}
      <style jsx>{`
        .ken-burns {
          animation: ken-burns 24s ease-in-out infinite alternate;
          transform-origin: center 30%;
        }
        @keyframes ken-burns {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ken-burns { animation: none; }
        }
      `}</style>
    </div>
  );
}
