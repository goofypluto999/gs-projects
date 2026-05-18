"use client";

import { ExternalLink, ArrowUpRight } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { BorderBeam } from "./BorderBeam";
import { PreviewImage } from "./PreviewImage";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  index?: number;
}

const statusStyles: Record<string, string> = {
  live: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  beta: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  development: "text-text-tertiary border-border",
};

function CardFallback({ project }: { project: Project }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3"
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${project.accent}12 0%, transparent 60%)`,
      }}
    >
      <div
        className="w-14 h-14 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${project.accent}18` }}
      >
        <span
          className="font-heading text-xl font-700"
          style={{ color: project.accent }}
        >
          {project.name.charAt(0)}
        </span>
      </div>
      <span className="font-heading text-sm font-500 text-text-tertiary/50">
        {project.name}
      </span>
    </div>
  );
}

export function ProjectCard({ project, onSelect, index = 0 }: ProjectCardProps) {
  return (
    <SpotlightCard
      onClick={() => onSelect(project)}
      className="group flex flex-col"
    >
      <BorderBeam duration={4 + index * 0.5} size={70} color={`${project.accent}55`} />

      {/* Preview thumbnail */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-lg border-b border-border bg-bg">
        <PreviewImage
          src={project.previewImage}
          alt={`${project.name} preview`}
          accent={project.accent}
          fallback={<CardFallback project={project} />}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: `${project.accent}90` }}
          >
            <ArrowUpRight size={14} className="text-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading text-lg font-600 text-text-primary">
            {project.name}
          </h3>
          <span
            className={`text-[10px] font-body border px-2 py-0.5 rounded uppercase tracking-wider ${statusStyles[project.status]}`}
          >
            {project.status}
          </span>
        </div>

        <p className="text-[13.5px] text-text-secondary leading-relaxed mb-4">
          {project.tagline}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10.5px] text-text-tertiary border border-border px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-[12.5px] text-accent hover:text-accent-hover transition-colors duration-150 cursor-pointer"
        >
          View live
          <ExternalLink size={12} />
        </a>
      </div>
    </SpotlightCard>
  );
}
