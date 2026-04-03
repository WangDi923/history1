-- 002_rls_policies.sql
-- Run this after 001_init_schema.sql.

alter table public.profiles enable row level security;
alter table public.scripts enable row level security;
alter table public.figure_chats enable row level security;
alter table public.figure_chat_messages enable row level security;
alter table public.timeline_layers enable row level security;
alter table public.timeline_events enable row level security;

-- profiles: each user can view and edit only their profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- scripts: owner only.
drop policy if exists "scripts_owner_select" on public.scripts;
create policy "scripts_owner_select"
on public.scripts
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "scripts_owner_insert" on public.scripts;
create policy "scripts_owner_insert"
on public.scripts
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "scripts_owner_update" on public.scripts;
create policy "scripts_owner_update"
on public.scripts
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "scripts_owner_delete" on public.scripts;
create policy "scripts_owner_delete"
on public.scripts
for delete
to authenticated
using (user_id = auth.uid());

-- figure_chats: owner only.
drop policy if exists "figure_chats_owner_select" on public.figure_chats;
create policy "figure_chats_owner_select"
on public.figure_chats
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "figure_chats_owner_insert" on public.figure_chats;
create policy "figure_chats_owner_insert"
on public.figure_chats
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "figure_chats_owner_update" on public.figure_chats;
create policy "figure_chats_owner_update"
on public.figure_chats
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "figure_chats_owner_delete" on public.figure_chats;
create policy "figure_chats_owner_delete"
on public.figure_chats
for delete
to authenticated
using (user_id = auth.uid());

-- figure_chat_messages: user can access messages only from their own chat.
drop policy if exists "figure_chat_messages_owner_select" on public.figure_chat_messages;
create policy "figure_chat_messages_owner_select"
on public.figure_chat_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.figure_chats c
    where c.id = figure_chat_messages.chat_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "figure_chat_messages_owner_insert" on public.figure_chat_messages;
create policy "figure_chat_messages_owner_insert"
on public.figure_chat_messages
for insert
to authenticated
with check (
  exists (
    select 1
    from public.figure_chats c
    where c.id = figure_chat_messages.chat_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "figure_chat_messages_owner_delete" on public.figure_chat_messages;
create policy "figure_chat_messages_owner_delete"
on public.figure_chat_messages
for delete
to authenticated
using (
  exists (
    select 1
    from public.figure_chats c
    where c.id = figure_chat_messages.chat_id
      and c.user_id = auth.uid()
  )
);

-- timeline data: authenticated users can read; write operations reserved for service role.
drop policy if exists "timeline_layers_read_authenticated" on public.timeline_layers;
create policy "timeline_layers_read_authenticated"
on public.timeline_layers
for select
to authenticated
using (true);

drop policy if exists "timeline_events_read_authenticated" on public.timeline_events;
create policy "timeline_events_read_authenticated"
on public.timeline_events
for select
to authenticated
using (true);
