"use client";

import { ExternalLink } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { BorderBeam } from "./BorderBeam";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

const statusStyles: Record<string, string> = {
  live: "text-emerald-400 border-emerald-400/30",
  beta: "text-amber-400 border-amber-400/30",
  development: "text-text-tertiary border-border",
};

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <SpotlightCard
      onClick={() => onSelect(project)}
      className="group flex flex-col"
    >
      <BorderBeam duration={4} size={60} color={`${project.accent}40`} />

      {/* Preview thumbnail */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-lg border-b border-border bg-bg">
        {/* Styled fallback — always visible behind iframe */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${project.accent}20` }}
          >
            <span
              className="font-heading text-lg font-700"
              style={{ color: project.accent }}
            >
              {project.name.charAt(0)}
            </span>
          </div>
          <span className="font-heading text-sm font-500 text-text-tertiary/60">
            {project.name}
          </span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full"
                style={{
                  width: `${20 + i * 12}px`,
                  backgroundColor: `${project.accent}${15 + i * 8}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Iframe — loads on top of fallback */}
        {project.previewUrl && (
          <iframe
            src={project.previewUrl}
            title={`${project.name} preview`}
            className="absolute inset-0 w-[200%] h-[280%] origin-top-left pointer-events-none"
            style={{ transform: "scale(0.5)" }}
            loading="lazy"
            sandbox={project.sandboxPolicy || "allow-scripts"}
            tabIndex={-1}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading text-lg font-600 text-text-primary">
            {project.name}
          </h3>
          <span
            className={`text-[11px] font-body border px-2 py-0.5 rounded ${statusStyles[project.status]}`}
          >
            {project.status}
          </span>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {project.tagline}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-text-tertiary border border-border px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:text-accent-hover transition-colors duration-150 cursor-pointer"
        >
          View live
          <ExternalLink size={13} />
        </a>
      </div>
    </SpotlightCard>
  );
}
