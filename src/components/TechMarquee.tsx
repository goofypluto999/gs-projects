"use client";

const technologies = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind",
  "GSAP",
  "anime.js",
  "Framer Motion",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Supabase",
  "OpenAI",
  "Anthropic",
  "Vercel",
  "Railway",
  "Hetzner",
  "Stripe",
  "MCP",
  "shadcn/ui",
  "Lenis",
];

/**
 * Subtle horizontal marquee of tech stack — adds credibility without taking
 * up vertical real estate. Pauses on hover.
 */
export function TechMarquee() {
  return (
    <section className="relative py-10 border-y border-border overflow-hidden bg-bg/40">
      <div className="absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-bg to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-bg to-transparent pointer-events-none" />

      <div className="relative flex group">
        <ul className="flex animate-marquee gap-12 pr-12 shrink-0">
          {technologies.map((t) => (
            <li
              key={t}
              className="font-heading text-base md:text-lg font-500 text-text-tertiary/70 hover:text-text-primary transition-colors duration-200 cursor-default whitespace-nowrap tracking-tight"
            >
              {t}
            </li>
          ))}
        </ul>
        <ul
          aria-hidden="true"
          className="flex animate-marquee gap-12 pr-12 shrink-0"
        >
          {technologies.map((t) => (
            <li
              key={`dup-${t}`}
              className="font-heading text-base md:text-lg font-500 text-text-tertiary/70 hover:text-text-primary transition-colors duration-200 cursor-default whitespace-nowrap tracking-tight"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
