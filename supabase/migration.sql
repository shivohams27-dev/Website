-- Migration: Members table + contributor support
-- Run this against your Supabase database

-- 1. Create members table
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text not null,
  profile_pic text,
  role text not null default '',
  description text not null default '',
  linkedin_url text,
  github_url text,
  instagram_url text,
  custom_link_url text,
  order_index int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Add contributor_ids to projects (if not already present)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'projects' and column_name = 'contributor_ids'
  ) then
    alter table public.projects add column contributor_ids uuid[] default '{}';
  end if;
end $$;

-- 3. Add contributor_ids to research_papers (if not already present)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'research_papers' and column_name = 'contributor_ids'
  ) then
    alter table public.research_papers add column contributor_ids uuid[] default '{}';
  end if;
end $$;

-- 4. Enable RLS on members
alter table public.members enable row level security;

-- 5. Public read access for members
create policy "Allow public read access on members" on public.members for select using (true);
