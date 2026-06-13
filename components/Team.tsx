"use client";

import { motion } from "framer-motion";
import { TeamMember } from "@/lib/types";
import { TeamCard } from "./TeamCard";
import { PlaceholderCard } from "./PlaceholderCard";

export function Team({ members }: { members: TeamMember[] }) {
  return (
    <section id="team" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-jetbrains text-text-muted text-sm tracking-widest uppercase mb-4 block">
          04 / Team
        </span>
        <h2 className="font-syne text-4xl md:text-5xl text-text-primary mb-12">The minds behind the lab.</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {member.type === 'member' ? (
                <TeamCard member={member} />
              ) : (
                <PlaceholderCard text={member.placeholder_text || 'Revealing Soon'} />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
