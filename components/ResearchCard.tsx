"use client";

import { motion } from "framer-motion";
import { FileText, ChevronRight } from "lucide-react";
import { ResearchPaper, StageColor } from "@/lib/types";
import { StageBadge } from "./StageBadge";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

export function ResearchCard({
  paper,
  stageColors,
  onExpand,
}: {
  paper: ResearchPaper;
  stageColors: StageColor[];
  onExpand: (paper: ResearchPaper) => void;
}) {
  const publication = [paper.venue, paper.year].filter(Boolean).join(" · ");

  return (
    <motion.article
      className="research-record group"
      style={{ cursor: "pointer" }}
      onClick={() => onExpand(paper)}
      whileHover={{ y: -3, borderColor: "rgba(77, 163, 255, 0.4)" }}
      transition={{ duration: 0.25 }}
    >
      <div className="research-record-body">
        <StageBadge stage={paper.stage} stageColors={stageColors} />
        <div className="flex items-center gap-2 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-text-muted">
          <FileText className="h-4 w-4 text-accent-soft" />
          {publication || "Independent research note"}
        </div>
        <h3 className="mt-5 max-w-3xl font-syne text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">
          {paper.title}
        </h3>
        <p className="mt-5 max-w-4xl font-dm text-base leading-8 text-text-muted">
          {paper.description}
        </p>
      </div>

      <div className="research-record-footer">
        <div className="flex items-center gap-4">
          <span className="font-dm text-sm text-text-muted">
            {paper.stage === 5 ? "Published and available to read." : "Work in progress; publication details will be added when available."}
          </span>
          {paper.launch_date && (
            <div className="text-right">
              <span className="block font-jetbrains text-[10px] uppercase tracking-[0.12em] text-text-muted">Publication date</span>
              <strong className="block font-dm text-sm font-medium text-accent-soft">{formatDate(paper.launch_date)}</strong>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand(paper);
            }}
            className="group/btn inline-flex items-center gap-1.5 font-dm text-sm font-medium text-accent transition-colors hover:text-accent-soft"
          >
            Know more
            <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
