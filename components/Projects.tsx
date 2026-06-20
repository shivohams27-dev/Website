"use client";

import { motion } from "framer-motion";
import { Project, StageColor } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { PlusCard } from "./PlusCard";

export function Projects({ projects, stageColors, exploreUrl }: { projects: Project[]; stageColors: StageColor[]; exploreUrl: string }) {
  return (
    <section id="projects" className="border-t border-white/10">
      <div className="section-shell">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <div className="grid gap-8 lg:grid-cols-[1fr_30rem] lg:items-end">
            <div>
              <div className="section-kicker">02 / Projects</div>
              <h2 className="section-heading">Current work.</h2>
            </div>
            <p className="font-dm text-base leading-8 text-text-muted lg:pb-2">
              This section tracks the software systems currently being designed, tested, deployed, and maintained by Shivoham Lab. Each record includes its present development stage, technical focus, and available source or product links.
            </p>
          </div>

          <div className="mt-14 space-y-4">
            {projects.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.65, delay: Math.min(index * 0.08, 0.3) }}>
                <ProjectCard project={project} stageColors={stageColors} />
              </motion.div>
            ))}
            <PlusCard label="Propose a project" url={exploreUrl} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
