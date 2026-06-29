create table if not exists public.login_attempts (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  failed_at timestamp with time zone default timezone('utc'::text, now()),
  blocked_until timestamp with time zone
);

create index idx_login_attempts_ip on public.login_attempts(ip_address);
create index idx_login_attempts_failed_at on public.login_attempts(failed_at);

alter table public.login_attempts enable row level security;

create policy "Service role only on login_attempts" on public.login_attempts
  for all using (true) with check (true);
