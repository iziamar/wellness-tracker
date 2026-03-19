-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)
-- Creates the table that stores each user's wellness state

create table if not exists public.wellness_state (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  state       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  unique (user_id)
);

-- Row-level security: users can only read/write their own row
alter table public.wellness_state enable row level security;

create policy "Users can read own state"
  on public.wellness_state for select
  using (auth.uid() = user_id);

create policy "Users can upsert own state"
  on public.wellness_state for insert
  with check (auth.uid() = user_id);

create policy "Users can update own state"
  on public.wellness_state for update
  using (auth.uid() = user_id);

-- Index for fast user lookups
create index if not exists wellness_state_user_idx on public.wellness_state(user_id);
