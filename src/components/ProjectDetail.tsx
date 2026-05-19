"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

function StaticPreview({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4"
        style={{
          background: `radial-gradient(ellipse at center, ${project.accent}14 0%, transparent 65%)`,
        }}
      >
        <div
          className="w-20 h-20 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${project.accent}22` }}
        >
          <span
            className="font-heading text-3xl font-800"
            style={{ color: project.accent }}
          >
            {project.name.charAt(0)}
          </span>
        </div>
        <span className="font-heading text-lg font-500 text-text-secondary">
          {project.name}
        </span>
      </div>

      {!imgError && (
        <img
          src={project.previewImage}
          alt={`${project.name} preview`}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="eager"
          onError={() => setImgError(true)}
        />
      )}

      {/* Subtle gradient frame */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface/30 via-transparent to-transparent pointer-events-none" />

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-5 right-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-body rounded-md transition-transform duration-200 cursor-pointer backdrop-blur-md hover:scale-[1.02]"
        style={{
          backgroundColor: project.accent,
          color: "white",
        }}
      >
        Open live site
        <ArrowUpRight size={14} />
      </a>
    </div>
  );
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  useEffect(() => {
    if (!project) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
            className="fixed inset-x-4 top-[4vh] bottom-[4vh] z-50 mx-auto max-w-[1080px] overflow-y-auto rounded-xl border border-border bg-surface shadow-[0_25px_80px_-20px_rgba(0,0,0,0.6)]"
          >
            {/* Top accent bar */}
            <div
              className="h-1 w-full"
              style={{
                background: `linear-gradient(90deg, ${project.accent}, ${project.accent}40 60%, transparent)`,
              }}
            />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 inline-flex items-center justify-center min-w-11 min-h-11 text-text-secondary hover:text-text-primary active:text-text-primary transition-colors duration-150 cursor-pointer z-10 rounded-md bg-bg/85 backdrop-blur-sm border border-border"
              aria-label="Close project detail"
            >
              <X size={18} />
            </button>

            {/* Preview area */}
            <div className="relative w-full aspect-[16/9] overflow-hidden border-b border-border bg-bg">
              <StaticPreview project={project} />
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="flex items-start justify-between gap-6 mb-10 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: project.accent }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                      {project.year} · {project.status}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl font-800 text-text-primary leading-[1.02] tracking-tight">
                    {project.name}
                  </h2>
                  <p className="mt-3 text-text-secondary text-base md:text-lg leading-relaxed max-w-[640px]">
                    {project.tagline}
                  </p>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-body rounded-md transition-colors duration-150 cursor-pointer"
                  style={{
                    backgroundColor: project.accent,
                    color: "white",
                  }}
                >
                  Open live
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Problem / What it does — side by side */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-[15px] leading-relaxed mb-10">
                <div className="pl-6 border-l border-border">
                  <h3 className="font-heading text-[10px] font-700 text-text-tertiary mb-3 uppercase tracking-[0.3em]">
                    The problem
                  </h3>
                  <p className="text-text-secondary">{project.problem}</p>
                </div>
                <div className="pl-6 border-l" style={{ borderColor: `${project.accent}40` }}>
                  <h3 className="font-heading text-[10px] font-700 mb-3 uppercase tracking-[0.3em]" style={{ color: project.accent }}>
                    What it does
                  </h3>
                  <p className="text-text-secondary">{project.description}</p>
                </div>
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-border">
                <span className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary mr-3">
                  Built with
                </span>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-text-secondary border border-border bg-bg/40 px-2.5 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
