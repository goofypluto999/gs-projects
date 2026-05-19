"use client";

import { useState } from "react";
import NextImage from "next/image";

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
 * Skeleton + next/image with crossfade.
 * - next/image gives us automatic srcset, AVIF/WebP negotiation, and
 *   proper lazy-loading priorities. ~70% smaller on mobile than the
 *   1200x750 JPG sources we ship.
 * - The shimmer skeleton plays only while the image is loading.
 * - The fallback (project initial in accent colour) sits underneath
 *   so there's never a blank flash.
 */
export function PreviewImage({
  src,
  alt,
  fallback,
  accent,
  className = "",
  eager = false,
}: PreviewImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Static fallback always visible underneath */}
      <div className="absolute inset-0">{fallback}</div>

      {/* Shimmer skeleton overlay while loading */}
      {!loaded && !errored && (
        <div
          className="absolute inset-0 pointer-events-none preview-shimmer"
          style={{
            background: `linear-gradient(110deg, transparent 30%, ${accent}10 50%, transparent 70%)`,
            backgroundSize: "200% 100%",
          }}
          aria-hidden="true"
        />
      )}

      {!errored && (
        <NextImage
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          quality={82}
          priority={eager}
          loading={eager ? "eager" : "lazy"}
          className={`ken-burns object-cover object-top transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
