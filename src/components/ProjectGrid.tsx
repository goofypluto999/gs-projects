"use client";

import { useState } from "react";
import { projects, type Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetail } from "./ProjectDetail";
import { FeaturedProject } from "./FeaturedProject";
import { SectionReveal } from "./SectionReveal";

export function ProjectGrid() {
  const [selected, setSelected] = useState<Project | null>(null);

  // First project is featured (Foresay Labs — the flagship)
  const [featured, ...rest] = projects;

  return (
    <>
      {/* Desktop-only full catalogue. On mobile the MobileCarousel above
          (lg:hidden) already covers all 5 projects swipeably — no need to
          stack the same content vertically too. Saves ~3 screenfuls of
          mobile scroll. */}
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

      {/* Mobile: a single Featured flagship card under the carousel —
          gives the visitor one tap-target to deep-dive Foresay specifically
          without re-listing the whole catalogue. */}
      <section id="projects" className="lg:hidden px-6 py-16 scroll-mt-16">
        <div className="mx-auto max-w-[1280px]">
          <SectionReveal>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                Tap to deep dive
              </span>
            </div>
            <h2 className="font-heading text-2xl font-700 text-text-primary mb-6 leading-snug">
              Open the flagship case →
            </h2>
            <FeaturedProject project={featured} onSelect={setSelected} />
          </SectionReveal>
        </div>

        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      </section>
    </>
  );
}
