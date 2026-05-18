"use client";

import { useState } from "react";
import { projects, type Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetail } from "./ProjectDetail";
import { FeaturedProject } from "./FeaturedProject";
import { SectionReveal } from "./SectionReveal";
import { SectionHeader } from "./SectionHeader";

export function ProjectGrid() {
  const [selected, setSelected] = useState<Project | null>(null);

  // First project is featured (Foresay Labs — the flagship)
  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-[1280px]">
        {/* On desktop (lg+) the HorizontalShowcase above already covers the
            cinematic intro. This section becomes a compact "all work" catalog.
            On mobile, this is the primary work showcase — Featured + 4 cards. */}

        {/* Mobile/tablet header */}
        <div className="lg:hidden">
          <SectionHeader
            eyebrow="The Work"
            title="Five live products,"
            subtitle="each one built to ship."
            descriptor="Tap any card for the full case study — problem, solution, live site."
          />
        </div>

        {/* Desktop header — more compact since Cinema already introduced the work */}
        <div className="hidden lg:block">
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
        </div>

        {/* Mobile: Featured + 4 grid */}
        <div className="lg:hidden">
          <SectionReveal>
            <div className="mb-8">
              <FeaturedProject project={featured} onSelect={setSelected} />
            </div>
          </SectionReveal>
          <SectionReveal stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {rest.map((project, i) => (
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

        {/* Desktop: compact 5-card row, all equal */}
        <div className="hidden lg:block">
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
      </div>

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
