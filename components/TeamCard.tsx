"use client";

import { motion } from "framer-motion";
import { TeamMember } from "@/lib/types";
import { TeamSocialIcon } from "./ui/TeamSocialIcon";

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
        
        <div className="flex items-center gap-5 pt-4">
          {member.linkedin_url && (
            <TeamSocialIcon type="linkedin" url={member.linkedin_url} member={member} />
          )}
          {member.instagram_url && (
            <TeamSocialIcon type="instagram" url={member.instagram_url} member={member} />
          )}
          {member.github_url && (
            <TeamSocialIcon type="github" url={member.github_url} member={member} />
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
        
        {member.name === 'Shouraya Sharma' && (
          <div className="mt-auto pt-6">
            <p className="font-dm text-text-primary/70 italic border-l-2 border-accent/40 pl-4 text-sm leading-relaxed">
              "I got tired of waiting to graduate or learn everything on earth to do real work. So I stopped waiting"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
