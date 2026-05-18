"use client";

import { useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { BorderBeam } from "./BorderBeam";
import { PreviewImage } from "./PreviewImage";
import { Halftone } from "./Halftone";
import { MagneticWrap } from "./MagneticWrap";
import { WindowChrome } from "./WindowChrome";
import type { Project } from "@/data/projects";

interface FeaturedProjectProps {
  project: Project;
  onSelect: (project: Project) => void;
}

/**
 * Hero-sized featured project card — flagship treatment for the lead product.
 * Subtle 3D tilt on cursor, larger preview, expanded copy block.
 */
export function FeaturedProject({ project, onSelect }: FeaturedProjectProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    function onMove(e: MouseEvent) {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateY = x * 4;
      const rotateX = -y * 3;
      card.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function onLeave() {
      if (!card) return;
      card.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg)";
    }

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(project)}
      className="relative group cursor-pointer rounded-xl overflow-hidden border border-border bg-surface transition-transform duration-300 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <BorderBeam duration={5} size={120} color={`${project.accent}88`} />
      <Halftone dotColor={project.accent} density={0.4} className="opacity-50" />

      <div className="grid md:grid-cols-[1.1fr_1fr]">
        {/* Preview pane */}
        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-bg border-b md:border-b-0 md:border-r border-border">
          <WindowChrome
            url={project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          />
          <div className="absolute inset-0 pt-7">
          <PreviewImage
            src={project.previewImage}
            alt={`${project.name} preview`}
            accent={project.accent}
            eager
            fallback={
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                style={{
                  background: `radial-gradient(ellipse at 50% 40%, ${project.accent}18 0%, transparent 65%)`,
                }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${project.accent}22` }}
                >
                  <span
                    className="font-heading text-3xl font-800"
                    style={{ color: project.accent }}
                  >
                    {project.name.charAt(0)}
                  </span>
                </div>
                <span className="font-heading text-base font-500 text-text-tertiary/50">
                  {project.name}
                </span>
              </div>
            }
          />

          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-4 left-4 z-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md text-[10.5px] uppercase tracking-widest font-600"
              style={{
                backgroundColor: `${project.accent}25`,
                color: project.accent,
                border: `1px solid ${project.accent}40`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: project.accent }} />
              Featured
            </div>
          </div>
        </div>

        {/* Content pane */}
        <div className="p-8 md:p-10 flex flex-col justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-[10px] uppercase tracking-[0.25em] font-600"
                style={{ color: project.accent }}
              >
                {project.year} · {project.status}
              </span>
            </div>
            <h3 className="font-heading text-3xl md:text-4xl font-700 text-text-primary leading-tight tracking-tight">
              {project.name}
            </h3>
            <p className="mt-3 text-base md:text-lg text-text-secondary leading-relaxed">
              {project.tagline}
            </p>
            <p className="mt-5 text-[14px] text-text-secondary/85 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-text-tertiary border border-border px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <MagneticWrap strength={0.18}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-body rounded-md transition-colors duration-150 cursor-pointer"
                  style={{
                    backgroundColor: project.accent,
                    color: "white",
                  }}
                >
                  Open live
                  <ArrowUpRight size={14} />
                </a>
              </MagneticWrap>
              <MagneticWrap strength={0.18}>
                <button
                  onClick={() => onSelect(project)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-body text-text-primary border border-border hover:border-border-hover rounded-md transition-colors duration-150 cursor-pointer"
                >
                  Full case
                </button>
              </MagneticWrap>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
