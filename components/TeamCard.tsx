"use client";

import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./Icons";
import { TeamMember } from "@/lib/types";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#161616] border-l-[3px] border-l-accent border-y border-y-[#222] border-r border-r-[#222] rounded-xl p-6 flex flex-col sm:flex-row gap-6 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
    >
      {/* LEFT COLUMN (1/3 width on sm+) */}
      <div className="flex flex-col items-center sm:w-1/3 shrink-0">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-accent/20 flex items-center justify-center border-2 border-[#333] mb-4 shrink-0">
          {member.avatar_url ? (
            <img src={member.avatar_url} alt={member.name || ''} className="w-full h-full object-cover" />
          ) : (
            <span className="font-syne text-2xl text-accent font-bold">
              {member.avatar_initials || '?'}
            </span>
          )}
        </div>
        
        {member.username && (
          <span className="font-jetbrains text-sm text-text-muted mb-4">
            @{member.username}
          </span>
        )}
        
        <div className="flex items-center gap-5">
          {member.linkedin_url && (
            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-[#0077b5] transition-colors">
              <LinkedinIcon className="w-5 h-5" />
            </a>
          )}
          {member.instagram_url && (
            <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-[#E1306C] transition-colors">
              <InstagramIcon className="w-5 h-5" />
            </a>
          )}
          {member.github_url && (
            <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
              <GithubIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN (2/3 width on sm+) */}
      <div className="flex flex-col sm:w-2/3">
        {member.role_label && (
          <span className="font-jetbrains text-xs text-accent uppercase tracking-widest mb-2 block">
            {member.role_label}
          </span>
        )}
        <h3 className="font-syne text-2xl font-bold text-text-primary mb-4">
          {member.name}
        </h3>
        <p className="font-dm text-text-muted leading-relaxed text-sm">
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}
