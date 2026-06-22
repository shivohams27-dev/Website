"use client";

import { motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./Icons";
import { StageBadge } from "./StageBadge";
import { ContributionGraph } from "./ContributionGraph";
import { Project, ResearchPaper, StageColor, Member } from "@/lib/types";

type ExpandedCardProps =
  | { type: "project"; item: Project; stageColors: StageColor[]; members: Member[]; onClose: () => void }
  | { type: "research"; item: ResearchPaper; stageColors: StageColor[]; members: Member[]; onClose: () => void };

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

export function ExpandedCard(props: ExpandedCardProps) {
  const { type, item, stageColors, members, onClose } = props;

  const contributorIds = item.contributor_ids || [];
  const contributors = members.filter(m => contributorIds.includes(m.id));

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </motion.div>

      <motion.div
        className="fixed z-50 overflow-hidden rounded-3xl border border-white/10 bg-[#090c11] shadow-[0_0_80px_rgba(77,163,255,0.08)]"
        style={{
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          width: "min(90vw, 64rem)",
          maxHeight: "85vh",
        }}
        initial={{ opacity: 0, scale: 0.92, y: "-45%" }}
        animate={{ opacity: 1, scale: 1, y: "-50%" }}
        exit={{ opacity: 0, scale: 0.95, y: "-45%" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      >
        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: "85vh" }}>
          <div className="p-8 md:p-12">
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <StageBadge stage={item.stage} stageColors={stageColors} />
                <span className="font-jetbrains text-[10px] uppercase tracking-[0.14em] text-text-muted">
                  {type === "project" ? "Software project" : "Research paper"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-muted transition-colors hover:border-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {type === "research" && (
              <div className="mt-4 flex items-center gap-2 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-text-muted">
                {[(item as ResearchPaper).venue, (item as ResearchPaper).year].filter(Boolean).join(" · ") || "Independent research note"}
              </div>
            )}

            <h2 className="mt-6 max-w-4xl font-syne text-4xl font-semibold leading-tight tracking-[-0.035em] text-text-primary md:text-5xl">
              {item.title}
            </h2>

            <p className="mt-6 max-w-4xl font-dm text-lg leading-9 text-text-muted">
              {item.description}
            </p>

            {type === "project" && (item as Project).tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {(item as Project).tags.map((tag) => (
                  <span key={tag} className="rounded-md border border-white/10 bg-white/[0.025] px-3 py-2 font-jetbrains text-[10px] uppercase tracking-[0.12em] text-text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {type === "project" && (item as Project).github_url && (
                <a
                  href={(item as Project).github_url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="record-link"
                >
                  <GithubIcon className="h-4 w-4" />
                  Source code
                </a>
              )}
              {item.stage === 5 && item.explore_url && (
                <a
                  href={item.explore_url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="record-link record-link-primary"
                >
                  {type === "project" ? "View project" : "Read publication"}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>

            <ContributionGraph contributors={contributors} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 bg-white/[0.015] px-8 py-5 md:px-12">
            <div className="flex items-center gap-4">
              {item.launch_date && (
                <div className="text-right">
                  <span className="block font-jetbrains text-[10px] uppercase tracking-[0.12em] text-text-muted">
                    {type === "project" ? "Launch date" : "Publication date"}
                  </span>
                  <strong className="block font-dm text-sm font-medium text-accent-soft">
                    {formatDate(item.launch_date)}
                  </strong>
                </div>
              )}
              {type === "research" && (
                <span className="font-dm text-sm text-text-muted">
                  {(item as ResearchPaper).stage === 5
                    ? "Published and available to read."
                    : "Work in progress; publication details will be added when available."}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
