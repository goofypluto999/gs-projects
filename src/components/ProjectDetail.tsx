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

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-body rounded-md transition-colors duration-150 cursor-pointer backdrop-blur-sm"
        style={{
          backgroundColor: `${project.accent}`,
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-50 mx-auto max-w-[960px] overflow-y-auto rounded-xl border border-border bg-surface"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors duration-150 cursor-pointer z-10 rounded-md bg-bg/80 backdrop-blur-sm"
              aria-label="Close project detail"
            >
              <X size={18} />
            </button>

            {/* Preview area */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl border-b border-border bg-bg">
              <StaticPreview project={project} />
            </div>

            {/* Content */}
            <div className="p-8 md:p-10">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: project.accent }}
                    />
                    <span className="text-xs uppercase tracking-widest text-text-tertiary">
                      {project.year} · {project.status}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl font-700 text-text-primary leading-tight">
                    {project.name}
                  </h2>
                  <p className="mt-2 text-text-secondary text-base md:text-lg leading-relaxed">
                    {project.tagline}
                  </p>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-body border text-text-primary hover:bg-text-primary hover:text-bg rounded-md transition-colors duration-150 cursor-pointer"
                  style={{ borderColor: `${project.accent}50` }}
                >
                  Open live
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-[15px] leading-relaxed">
                <div>
                  <h3 className="font-heading text-xs font-600 text-text-tertiary mb-3 uppercase tracking-widest">
                    The problem
                  </h3>
                  <p className="text-text-secondary">{project.problem}</p>
                </div>
                <div>
                  <h3 className="font-heading text-xs font-600 text-text-tertiary mb-3 uppercase tracking-widest">
                    What it does
                  </h3>
                  <p className="text-text-secondary">{project.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-text-secondary border border-border px-3 py-1 rounded"
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
