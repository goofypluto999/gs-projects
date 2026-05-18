"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animated wireframe sphere with orbital rings — sits in the negative space
 * of the hero. Subtly rotates, reacts to scroll. Pure SVG, no WebGL, scales
 * crisp at any size. Linear/Vercel/Shader.se territory.
 */
export function OrbitSphere({ className = "" }: { className?: string }) {
  const wrapRef = useRef<SVGSVGElement>(null);
  const sphereRef = useRef<SVGGElement>(null);
  const ring1Ref = useRef<SVGEllipseElement>(null);
  const ring2Ref = useRef<SVGEllipseElement>(null);
  const ring3Ref = useRef<SVGEllipseElement>(null);
  const dot1Ref = useRef<SVGCircleElement>(null);
  const dot2Ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to(sphereRef.current, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
      gsap.to(ring1Ref.current, {
        rotation: -360,
        duration: 22,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
      gsap.to(ring2Ref.current, {
        rotation: 360,
        duration: 32,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
      gsap.to(ring3Ref.current, {
        rotation: -360,
        duration: 48,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      // Orbital dot follows ring 1
      gsap.to(dot1Ref.current, {
        motionPath: undefined,
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: "none",
        transformOrigin: "100px 100px",
      });
      gsap.to(dot2Ref.current, {
        rotation: -360,
        duration: 18,
        repeat: -1,
        ease: "none",
        transformOrigin: "100px 100px",
      });

      // Scroll parallax — drift slowly + fade as user scrolls past hero
      gsap.to(wrapRef.current, {
        y: 220,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={wrapRef}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="orbit-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#2563EB" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="orbit-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FAFAFA" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FAFAFA" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Soft glow */}
      <circle cx="100" cy="100" r="95" fill="url(#orbit-glow)" />

      {/* Wireframe sphere — longitude lines */}
      <g ref={sphereRef}>
        <ellipse cx="100" cy="100" rx="60" ry="60" stroke="url(#orbit-line)" strokeWidth="0.6" />
        <ellipse cx="100" cy="100" rx="44" ry="60" stroke="url(#orbit-line)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="24" ry="60" stroke="url(#orbit-line)" strokeWidth="0.4" />
        <ellipse cx="100" cy="100" rx="60" ry="44" stroke="url(#orbit-line)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="60" ry="24" stroke="url(#orbit-line)" strokeWidth="0.4" />
      </g>

      {/* Orbital rings */}
      <g ref={ring1Ref}>
        <ellipse cx="100" cy="100" rx="78" ry="30" stroke="#2563EB" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="2 3" />
      </g>
      <g ref={ring2Ref}>
        <ellipse cx="100" cy="100" rx="90" ry="42" stroke="#FAFAFA" strokeOpacity="0.12" strokeWidth="0.6" />
      </g>
      <g ref={ring3Ref}>
        <ellipse cx="100" cy="100" rx="95" ry="22" stroke="#A855F7" strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="1 4" />
      </g>

      {/* Orbital dots */}
      <g ref={dot1Ref}>
        <circle cx="178" cy="100" r="2.2" fill="#2563EB" />
      </g>
      <g ref={dot2Ref}>
        <circle cx="190" cy="100" r="1.6" fill="#A855F7" />
      </g>

      {/* Centre mark */}
      <circle cx="100" cy="100" r="3" fill="#FAFAFA" fillOpacity="0.8" />
      <circle cx="100" cy="100" r="6" stroke="#FAFAFA" strokeOpacity="0.25" strokeWidth="0.5" />
    </svg>
  );
}
