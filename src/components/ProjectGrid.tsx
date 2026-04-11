"use client";

import { useState } from "react";
import { projects, type Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetail } from "./ProjectDetail";
import { SectionReveal } from "./SectionReveal";

export function ProjectGrid() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-[1200px]">
        <SectionReveal>
          <h2 className="font-heading text-2xl font-700 text-text-primary mb-2">
            Projects
          </h2>
          <p className="text-sm text-text-secondary mb-12 max-w-[480px]">
            Live products and tools — each one built to solve a specific
            problem. Click any card to see the full story.
          </p>
        </SectionReveal>

        <SectionReveal stagger>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} data-reveal-item>
                <ProjectCard project={project} onSelect={setSelected} />
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>

      <ProjectDetail
        project={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
