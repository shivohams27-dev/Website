"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResearchPaper, StageColor, Member } from "@/lib/types";
import { ResearchCard } from "./ResearchCard";
import { PlusCard } from "./PlusCard";
import { ExpandedCard } from "./ExpandedCard";

export function Research({ papers, stageColors, exploreUrl }: { papers: ResearchPaper[]; stageColors: StageColor[]; exploreUrl: string }) {
  const [expanded, setExpanded] = useState<ResearchPaper | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/members").then(r => r.json()).then(setMembers).catch(() => {});
  }, []);

  return (
    <section id="research" className="border-t border-blue-300/10 bg-[#080a0e]">
      <div className="section-shell">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <div className="section-kicker">03 / Research</div>
          <div className="grid gap-8 lg:grid-cols-[1fr_30rem] lg:items-end">
            <h2 className="section-heading">Research and notes.</h2>
            <p className="font-dm text-base leading-8 text-text-muted lg:pb-2">
              Research records include ongoing investigations, technical notes, and completed publications. Status indicators show whether a subject is still being explored, actively tested, or ready for public reading.
            </p>
          </div>

          <div className="mt-14 space-y-4">
            {papers.map((paper, index) => (
              <motion.div key={paper.id} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.65, delay: Math.min(index * 0.08, 0.3) }}>
                <ResearchCard paper={paper} stageColors={stageColors} onExpand={setExpanded} />
              </motion.div>
            ))}
            <PlusCard label="Collaborate on research" url={exploreUrl} />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <ExpandedCard
            type="research"
            item={expanded}
            stageColors={stageColors}
            members={members}
            onClose={() => setExpanded(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
