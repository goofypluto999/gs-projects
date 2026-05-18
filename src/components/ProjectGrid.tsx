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
        <SectionHeader
          eyebrow="The Work"
          title="Five live products,"
          subtitle="each one built to ship."
          descriptor="Click any card for the full case study — problem, solution, and the live site."
        />

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
