"use client";

import { motion } from "framer-motion";
import { Project, StageColor } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { PlusCard } from "./PlusCard";

export function Projects({ projects, stageColors, exploreUrl }: { projects: Project[], stageColors: StageColor[], exploreUrl: string }) {
  return (
    <section id="projects" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-jetbrains text-text-muted text-sm tracking-widest uppercase mb-4 block">
          02 / Projects
        </span>
        <h2 className="font-syne text-4xl md:text-5xl text-text-primary mb-12">Building the future.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProjectCard project={project} stageColors={stageColors} />
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: projects.length * 0.1 }}
          >
            <PlusCard label="See all projects" url={exploreUrl} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
