export interface SiteConfig {
  id: number;
  hero_tagline: string;
  hero_about: string;
  join_lab_url: string;
  community_description: string;
  community_url: string;
  discord_url?: string;
  whatsapp_url?: string;
  form_url?: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  stage: number;
  tags: string[];
  github_url: string | null;
  explore_url: string | null;
  order_index: number;
  created_at: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  description: string;
  stage: number;
  venue: string | null;
  year: number | null;
  explore_url: string | null;
  order_index: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  type: 'member' | 'placeholder';
  name: string | null;
  role_label: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  avatar_initials: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  github_url: string | null;
  placeholder_text: string | null;
  order_index: number;
  created_at: string;
}

export interface StageColor {
  stage: number;
  color: string;
  label: string;
}
