"use client";

import { motion } from "framer-motion";
import { TeamMember } from "@/lib/types";
import { TeamCard } from "./TeamCard";
import { PlaceholderCard } from "./PlaceholderCard";

export function Team({ members }: { members: TeamMember[] }) {
  return (
    <section id="team" className="border-t border-white/10">
      <div className="section-shell">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}>
          <div className="section-kicker">04 / Team</div>
          <div className="grid gap-8 lg:grid-cols-[1fr_30rem] lg:items-end">
            <h2 className="section-heading">Meet the team.</h2>
            <p className="font-dm text-base leading-8 text-text-muted lg:pb-2">
              This directory identifies the people responsible for research, product decisions, engineering, and day-to-day operations at Shivoham Lab. Profile links are kept visible and accessible without hover-only interactions.
            </p>
          </div>

          <div className="mt-14 space-y-5">
            {members.map((member, index) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.65, delay: Math.min(index * 0.1, 0.3) }}>
                {member.type === "member" ? <TeamCard member={member} index={index} /> : <PlaceholderCard text={member.placeholder_text || "Revealing soon"} />}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
