"use client";

import Image from "next/image";
import { TeamMember } from "@/lib/types";
import { TeamSocialIcon } from "./ui/TeamSocialIcon";

export function TeamCard({ member, index = 0 }: { member: TeamMember; index?: number }) {
  return (
    <article className="team-record">
      <div className="team-record-photo">
        {member.avatar_url ? (
          <Image
            src={member.avatar_url}
            alt={member.name || ""}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 240px"
            className="object-cover grayscale transition-all duration-500 hover:grayscale-0"
          />
        ) : (
          <span className="grid h-full place-items-center font-syne text-5xl text-accent">
            {member.avatar_initials || "?"}
          </span>
        )}
      </div>

      <div className="team-record-content">
        <div>
          {member.role_label && (
            <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-accent-soft">
              {member.role_label}
            </span>
          )}
          <h3 className="mt-3 font-syne text-4xl font-semibold leading-none tracking-[-0.04em]">
            {member.name}
          </h3>
          {member.username && (
            <span className="mt-3 block font-jetbrains text-[11px] text-text-muted">@{member.username}</span>
          )}
        </div>

        <p className="mt-7 max-w-2xl font-dm text-base leading-8 text-text-muted">{member.bio}</p>

        {member.name === "Shouraya Sharma" && (
          <blockquote className="mt-7 border-l-2 border-accent/60 pl-5 font-dm text-base italic leading-8 text-text-primary/75">
            “I got tired of waiting to graduate or learn everything on earth to do real work. So I stopped waiting.”
          </blockquote>
        )}

        <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
          {member.linkedin_url && <TeamSocialIcon type="linkedin" url={member.linkedin_url} member={member} />}
          {member.instagram_url && <TeamSocialIcon type="instagram" url={member.instagram_url} member={member} />}
          {member.github_url && <TeamSocialIcon type="github" url={member.github_url} member={member} />}
        </div>
      </div>
    </article>
  );
}
