-- 001_init_schema.sql
-- Run this first in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  school text,
  grade_levels text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_name text not null,
  teaching_objective text not null,
  grade_level text,
  duration_minutes int,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.figure_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  figure_name text not null,
  title text,
  created_at timestamptz not null default now()
);

create table if not exists public.figure_chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.figure_chats(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.timeline_layers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_year int not null,
  end_year int not null,
  layer_type text not null check (layer_type in ('boundary', 'route', 'marker')),
  geojson jsonb not null,
  source_note text,
  created_at timestamptz not null default now(),
  constraint timeline_layers_year_range check (start_year <= end_year)
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_year int not null,
  region text,
  description text,
  point jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_scripts_user_created_at
  on public.scripts(user_id, created_at desc);

create index if not exists idx_figure_chats_user_created_at
  on public.figure_chats(user_id, created_at desc);

create index if not exists idx_figure_chat_messages_chat_created_at
  on public.figure_chat_messages(chat_id, created_at asc);

create index if not exists idx_timeline_layers_years
  on public.timeline_layers(start_year, end_year);

create index if not exists idx_timeline_events_event_year
  on public.timeline_events(event_year);

-- Keep updated_at current for profile edits.
create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_current_timestamp_updated_at();
