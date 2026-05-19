"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetail } from "./ProjectDetail";
import { SectionReveal } from "./SectionReveal";

export function ProjectGrid() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      {/* Desktop-only full catalogue. */}
      <section
        id="projects"
        className="hidden lg:block px-6 py-24 scroll-mt-16"
      >
        <div className="mx-auto max-w-[1280px]">
          <SectionReveal>
            <div className="flex items-end justify-between gap-6 mb-10 border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                  Full catalogue
                </span>
                <span className="text-text-tertiary">·</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                  Click any to open the case
                </span>
              </div>
              <a
                href="#contact"
                className="text-[12px] text-accent hover:text-accent-hover transition-colors duration-150"
              >
                Talk to me →
              </a>
            </div>
          </SectionReveal>

          <SectionReveal stagger>
            <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {projects.map((project, i) => (
                <div key={project.id} data-reveal-item>
                  <ProjectCard
                    project={project}
                    onSelect={setSelected}
                    index={i}
                  />
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>

        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      </section>

      {/* Mobile: case-study list — gives mobile visitors access to ALL 5
          case-study modals, not just the flagship. Visually distinct from
          the MobileCarousel above (rows of typography, no screenshots) so
          the projects don't read as the same content twice. */}
      <section id="projects" className="lg:hidden px-6 py-14 scroll-mt-16">
        <div className="mx-auto max-w-[1280px]">
          <SectionReveal>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                Read the cases
              </span>
            </div>
            <h2 className="font-heading text-2xl font-700 text-text-primary mb-6 leading-snug tracking-tight">
              The story behind each build.
            </h2>

            <ul className="border-y border-border">
              {projects.map((p, i) => (
                <li
                  key={p.id}
                  className="border-b border-border last:border-b-0"
                >
                  <button
                    onClick={() => setSelected(p)}
                    aria-label={`Open ${p.name} case study`}
                    className="group flex w-full items-center gap-4 py-4 text-left active:bg-surface/50 transition-colors duration-150 cursor-pointer min-h-[68px]"
                  >
                    <span className="font-heading text-xs text-text-tertiary tabular-nums tracking-wider w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: p.accent }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block font-heading text-[17px] font-700 text-text-primary leading-tight tracking-tight">
                        {p.name}
                      </span>
                      <span className="block mt-1 text-[12.5px] text-text-secondary leading-snug line-clamp-1">
                        {p.tagline}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-text-tertiary group-active:text-text-primary shrink-0"
                      strokeWidth={1.5}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[11px] text-text-tertiary leading-relaxed">
              Each opens the full case — problem, build, what it does today.
            </p>
          </SectionReveal>
        </div>

        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      </section>
    </>
  );
}
