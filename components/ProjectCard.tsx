"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GithubIcon } from "./Icons";
import { Project, StageColor } from "@/lib/types";
import { StageBadge } from "./StageBadge";

export function ProjectCard({ project, stageColors }: { project: Project, stageColors: StageColor[] }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card border border-border rounded-xl p-6 transition-all duration-300 hover:border-accent hover:shadow-[0_0_0_1px_rgba(232,160,69,1)] flex flex-col h-full"
    >
      <h3 className="font-syne text-xl text-text-primary mb-2">{project.title}</h3>
      <p className="font-dm text-text-muted mb-6 flex-grow">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag, i) => (
          <span key={i} className="font-jetbrains text-xs px-2 py-1 bg-[#222] text-accent rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <StageBadge stage={project.stage} stageColors={stageColors} />
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
              <GithubIcon className="w-5 h-5" />
            </a>
          )}
        </div>
        
        {project.stage === 5 && project.explore_url && (
          <a 
            href={project.explore_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-jetbrains text-accent hover:text-white transition-colors"
          >
            Explore <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
