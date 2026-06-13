"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ResearchPaper, StageColor } from "@/lib/types";
import { StageBadge } from "./StageBadge";

export function ResearchCard({ paper, stageColors }: { paper: ResearchPaper, stageColors: StageColor[] }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:border-accent hover:shadow-[0_0_0_1px_rgba(232,160,69,1)] flex flex-col h-full"
    >
      <h3 className="font-syne text-xl text-text-primary mb-2">{paper.title}</h3>
      <p className="font-dm text-text-muted mb-4 flex-grow line-clamp-4">{paper.description}</p>
      
      {(paper.venue || paper.year) && (
        <div className="font-jetbrains text-xs text-text-muted mb-6 bg-[#222] w-fit px-2 py-1 rounded">
          {paper.venue} {paper.year && `(${paper.year})`}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <StageBadge stage={paper.stage} stageColors={stageColors} />
        </div>
        {paper.stage === 5 && paper.explore_url && (
          <a 
            href={paper.explore_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-jetbrains text-accent hover:text-white transition-colors"
          >
            Read Paper <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
