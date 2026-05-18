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
    <section id="projects" className="px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-[1280px]">
        <SectionReveal>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-text-tertiary">
              The Work
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <h2 className="font-heading text-3xl md:text-5xl font-700 text-text-primary leading-[1.05] tracking-tight">
              Five live products,
              <br />
              <span className="text-text-secondary">each one built to ship.</span>
            </h2>
            <p className="text-sm text-text-secondary max-w-[340px] leading-relaxed">
              Click any card for the full case study — problem, solution, and the live site.
            </p>
          </div>
        </SectionReveal>

        {/* Featured flagship */}
        <SectionReveal>
          <div className="mb-8">
            <FeaturedProject project={featured} onSelect={setSelected} />
          </div>
        </SectionReveal>

        {/* Rest of the grid */}
        <SectionReveal stagger>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
            {rest.map((project, i) => (
              <div key={project.id} data-reveal-item>
                <ProjectCard project={project} onSelect={setSelected} index={i} />
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
