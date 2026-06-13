-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. site_config
create table if not exists public.site_config (
  id int primary key,
  hero_tagline text,
  hero_about text,
  join_lab_url text,
  community_description text,
  community_url text,
  discord_url text,
  whatsapp_url text,
  form_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  stage int not null check (stage between 1 and 5),
  tags text[] default '{}',
  github_url text,
  explore_url text,
  order_index int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. research_papers
create table if not exists public.research_papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  stage int not null check (stage between 1 and 5),
  venue text,
  year int,
  explore_url text,
  order_index int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. team_members
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('member', 'placeholder')),
  name text,
  role_label text,
  username text,
  bio text,
  avatar_url text,
  avatar_initials text,
  linkedin_url text,
  instagram_url text,
  github_url text,
  placeholder_text text,
  order_index int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. stage_colors
create table if not exists public.stage_colors (
  stage int primary key check (stage between 1 and 5),
  color text not null,
  label text not null
);

-- Enable RLS
alter table public.site_config enable row level security;
alter table public.projects enable row level security;
alter table public.research_papers enable row level security;
alter table public.team_members enable row level security;
alter table public.stage_colors enable row level security;

-- Public read access policies
create policy "Allow public read access on site_config" on public.site_config for select using (true);
create policy "Allow public read access on projects" on public.projects for select using (true);
create policy "Allow public read access on research_papers" on public.research_papers for select using (true);
create policy "Allow public read access on team_members" on public.team_members for select using (true);
create policy "Allow public read access on stage_colors" on public.stage_colors for select using (true);

-- (Write access is strictly enforced by API routes using the service role key, which bypasses RLS)

-- Default Seed Data
insert into public.stage_colors (stage, color, label) values
  (1, '#6B7280', 'Ideation'),
  (2, '#3B82F6', 'Prototyping'),
  (3, '#e8a045', 'Building'),
  (4, '#A855F7', 'Testing'),
  (5, '#22C55E', 'Deployed')
on conflict (stage) do update set color = excluded.color, label = excluded.label;

insert into public.site_config (id, hero_tagline, hero_about, join_lab_url, community_description, community_url) values
  (1, 'Building at the edge of AI, systems, and real-world problems.', 'We are an independent research lab focusing on building protocols, infrastructure, and AI tools for the future of the web.', 'https://shivoham-lab.github.io/join', 'Join our discord community to get updates, discuss research, and collaborate with us.', 'https://discord.gg/placeholder')
on conflict (id) do nothing;

insert into public.projects (title, description, stage, tags, github_url, order_index) values
  ('Protocol-C', 'Cloudflare Workers-based privacy/consent layer at CDN edge', 3, array['Cloudflare', 'Privacy', 'Infrastructure'], null, 1),
  ('Memex', 'MCP-based persistent memory server for AI assistants', 3, array['MCP', 'AI', 'Memory'], 'https://github.com/Shouraya-07/Memex', 2),
  ('Jugni', 'Self-hosted community music streaming app', 2, array['Music', 'Self-hosted', 'React'], null, 3);

insert into public.team_members (type, name, role_label, username, bio, avatar_initials, github_url, order_index) values
  ('member', 'Shouraya Sharma', 'FOUNDER & BUILDER', 'Shivoham_07', 'Also known as Shivoham. CS undergrad at MIT Bengaluru and the person driving product, research, and engineering at the lab.', 'SS', 'https://github.com/Shouraya-07', 1);
