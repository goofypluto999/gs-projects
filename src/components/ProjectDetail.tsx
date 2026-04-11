"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

function BlockedPreview({ project }: { project: Project }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-4"
      style={{
        background: `radial-gradient(ellipse at center, ${project.accent}12 0%, transparent 60%)`,
      }}
    >
      <div
        className="w-16 h-16 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${project.accent}20` }}
      >
        <span
          className="font-heading text-2xl font-700"
          style={{ color: project.accent }}
        >
          {project.name.charAt(0)}
        </span>
      </div>
      <span className="font-heading text-lg font-500 text-text-secondary">
        {project.name}
      </span>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 text-sm font-body rounded-md transition-colors duration-150 cursor-pointer"
        style={{
          backgroundColor: `${project.accent}18`,
          color: project.accent,
          border: `1px solid ${project.accent}30`,
        }}
        onClick={(e) => e.stopPropagation()}
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-50 mx-auto max-w-[900px] overflow-y-auto rounded-lg border border-border bg-surface"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors duration-150 cursor-pointer z-10"
              aria-label="Close project detail"
            >
              <X size={18} />
            </button>

            {/* Preview area */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-lg border-b border-border bg-bg">
              {project.iframeBlocked ? (
                <BlockedPreview project={project} />
              ) : (
                <iframe
                  src={project.url}
                  title={`${project.name} preview`}
                  className="absolute inset-0 w-full h-[140%]"
                  sandbox={project.sandboxPolicy || "allow-scripts allow-same-origin"}
                />
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-heading text-2xl font-700 text-text-primary">
                    {project.name}
                  </h2>
                  <p className="mt-1 text-text-secondary text-base">
                    {project.tagline}
                  </p>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-body border border-accent text-accent hover:bg-accent hover:text-white rounded-md transition-colors duration-150 cursor-pointer"
                >
                  Open live
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="space-y-6 text-[15px] leading-relaxed">
                <div>
                  <h3 className="font-heading text-sm font-600 text-text-tertiary mb-2 uppercase tracking-wide">
                    The problem
                  </h3>
                  <p className="text-text-secondary">{project.problem}</p>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-600 text-text-tertiary mb-2 uppercase tracking-wide">
                    What it does
                  </h3>
                  <p className="text-text-secondary">{project.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-text-tertiary border border-border px-2.5 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-xs text-text-tertiary ml-auto">
                  {project.year}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
