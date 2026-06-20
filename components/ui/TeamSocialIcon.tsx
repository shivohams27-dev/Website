import { TeamMember } from "@/lib/types";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "../Icons";

export type SocialType = "instagram" | "linkedin" | "github";

const socialDetails = {
  instagram: { label: "Instagram", Icon: InstagramIcon },
  linkedin: { label: "LinkedIn", Icon: LinkedinIcon },
  github: { label: "GitHub", Icon: GithubIcon },
};

export function TeamSocialIcon({
  type,
  url,
  member,
}: {
  type: SocialType;
  url: string;
  member: TeamMember;
}) {
  const { label, Icon } = socialDetails[type];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${member.name || "Team member"} on ${label}`}
      className="group/social inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2 font-dm text-sm text-text-muted transition-all hover:border-accent/40 hover:bg-accent/[0.06] hover:text-white"
    >
      <Icon className="h-4 w-4 text-accent-soft" />
      <span>{label}</span>
    </a>
  );
}
