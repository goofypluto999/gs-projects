"use client";

interface TechRow {
  category: string;
  items: string[];
}

const rows: TechRow[] = [
  {
    category: "Web",
    items: ["Next.js", "TypeScript", "React", "Tailwind", "shadcn/ui"],
  },
  {
    category: "Motion",
    items: ["GSAP", "anime.js", "Framer Motion", "Lenis"],
  },
  {
    category: "AI",
    items: ["Anthropic", "OpenAI", "MCP", "Claude Code"],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "Supabase", "Neon", "LightRAG"],
  },
  {
    category: "Infra",
    items: ["Vercel", "Railway", "Hetzner", "Stripe", "Cloudflare"],
  },
];

/**
 * Tech stack marquee — paused on hover. Categorised dotted strip.
 * Premium "what I work with" signal without screaming it.
 */
export function TechMarquee() {
  // Flatten with category separators for the marquee
  const flat = rows.flatMap((row) => [
    { kind: "category" as const, text: row.category },
    ...row.items.map((item) => ({ kind: "item" as const, text: item })),
  ]);

  return (
    <section className="relative py-8 border-y border-border overflow-hidden bg-bg/40">
      <div className="absolute inset-y-0 left-0 w-40 z-10 bg-gradient-to-r from-bg via-bg to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 z-10 bg-gradient-to-l from-bg via-bg to-transparent pointer-events-none" />

      <div className="relative flex group">
        <ul className="flex marquee-track items-center gap-6 pr-6 shrink-0">
          {flat.map((entry, i) => (
            <li
              key={`a-${i}`}
              className={`flex items-center gap-6 whitespace-nowrap ${
                entry.kind === "category"
                  ? "text-text-tertiary text-[10.5px] uppercase tracking-[0.3em]"
                  : "text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-default font-heading text-base md:text-lg font-500 tracking-tight"
              }`}
            >
              <span>{entry.text}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
            </li>
          ))}
        </ul>
        <ul
          aria-hidden="true"
          className="flex marquee-track items-center gap-6 pr-6 shrink-0"
        >
          {flat.map((entry, i) => (
            <li
              key={`b-${i}`}
              className={`flex items-center gap-6 whitespace-nowrap ${
                entry.kind === "category"
                  ? "text-text-tertiary text-[10.5px] uppercase tracking-[0.3em]"
                  : "text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-default font-heading text-base md:text-lg font-500 tracking-tight"
              }`}
            >
              <span>{entry.text}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
}
