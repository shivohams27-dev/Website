"use client";

import { motion } from "framer-motion";
import { ResearchPaper, StageColor } from "@/lib/types";
import { ResearchCard } from "./ResearchCard";
import { PlusCard } from "./PlusCard";

export function Research({ papers, stageColors, exploreUrl }: { papers: ResearchPaper[], stageColors: StageColor[], exploreUrl: string }) {
  return (
    <section id="research" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-jetbrains text-text-muted text-sm tracking-widest uppercase mb-4 block">
          03 / Research
        </span>
        <h2 className="font-syne text-4xl md:text-5xl text-text-primary mb-12">Pushing the boundaries.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper, i) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ResearchCard paper={paper} stageColors={stageColors} />
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: papers.length * 0.1 }}
          >
            <PlusCard label="Add Publication" url={exploreUrl} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
