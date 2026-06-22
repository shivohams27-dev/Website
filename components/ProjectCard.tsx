"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Project, StageColor } from "@/lib/types";
import { StageBadge } from "./StageBadge";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

export function ProjectCard({
  project,
  stageColors,
  onExpand,
}: {
  project: Project;
  stageColors: StageColor[];
  onExpand: (project: Project) => void;
}) {
  return (
    <motion.article
      className="professional-record group"
      style={{ cursor: "pointer" }}
      onClick={() => onExpand(project)}
      whileHover={{ y: -3, borderColor: "rgba(77, 163, 255, 0.4)" }}
      transition={{ duration: 0.25 }}
    >
      <div className="professional-record-content">
        <div className="flex flex-wrap items-center gap-3">
          <StageBadge stage={project.stage} stageColors={stageColors} />
          <span className="font-jetbrains text-[10px] uppercase tracking-[0.14em] text-text-muted">
            Software project
          </span>
        </div>

        <h3 className="mt-5 font-syne text-3xl font-semibold leading-tight tracking-[-0.035em] text-text-primary md:text-4xl">
          {project.title}
        </h3>
        <p className="mt-5 max-w-3xl font-dm text-base leading-8 text-text-muted">
          {project.description}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-white/10 bg-white/[0.025] px-3 py-2 font-jetbrains text-[10px] uppercase tracking-[0.12em] text-text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="professional-record-actions">
        {project.launch_date && (
          <div className="text-right">
            <span className="block font-jetbrains text-[10px] uppercase tracking-[0.12em] text-text-muted">Launch date</span>
            <strong className="block font-dm text-sm font-medium text-accent-soft">{formatDate(project.launch_date)}</strong>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExpand(project);
          }}
          className="group/btn inline-flex items-center gap-1.5 font-dm text-sm font-medium text-accent transition-colors hover:text-accent-soft"
        >
          Know more
          <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </motion.article>
  );
}
