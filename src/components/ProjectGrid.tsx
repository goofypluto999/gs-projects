"use client";

import { useState } from "react";
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

      {/* Mobile case-study modal — anchored here for the desktop section
          but kept in the tree so MobileCarousel-spawned modals (if we
          add them later) can share the same instance. The MobileSpecCards
          component now owns its own modal trigger so we don't need a
          dedicated mobile section. */}
    </>
  );
}
