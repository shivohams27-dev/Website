"use client";

import { ArrowUpRight, FileText } from "lucide-react";
import { ResearchPaper, StageColor } from "@/lib/types";
import { StageBadge } from "./StageBadge";

const formatDate = (date: string | null) =>
  date
    ? new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))
    : "Date not set";

export function ResearchCard({ paper, stageColors }: { paper: ResearchPaper; stageColors: StageColor[] }) {
  const publication = [paper.venue, paper.year].filter(Boolean).join(" · ");

  return (
    <article className="research-record group">
      <div className="research-record-heading">
        <div className="research-record-date">
          <span>Publication date</span>
          <strong>{formatDate(paper.launch_date)}</strong>
        </div>
        <StageBadge stage={paper.stage} stageColors={stageColors} />
      </div>

      <div className="research-record-body">
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
        <span className="font-dm text-sm text-text-muted">
          {paper.stage === 5 ? "Published and available to read." : "Work in progress; publication details will be added when available."}
        </span>
        {paper.stage === 5 && paper.explore_url && (
          <a href={paper.explore_url} target="_blank" rel="noopener noreferrer" className="record-link record-link-primary">
            Read publication
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
