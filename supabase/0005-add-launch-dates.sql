alter table public.projects
  add column if not exists launch_date date;

alter table public.research_papers
  add column if not exists launch_date date;
