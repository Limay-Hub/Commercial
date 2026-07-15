-- Limay Hub — Community Chat (Public + Group Chats + DMs)
-- Run this once in the Supabase SQL editor, after supabase_stores_setup.sql
-- and INSTEAD OF the old supabase_public_chat_setup.sql (superseded by this
-- file — chat_messages here replaces public_chat_messages, with a nullable
-- room_id: null = the single global Public room).
--
-- Same trust model as the rest of this app / as Winfinity's chat: no real
-- auth, identity is a client-generated share_key. Enable Realtime for
-- chat_messages afterward: Database -> Replication -> supabase_realtime.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- chat_identities — resolves a Digital ID to a share_key so invites and
-- DMs can be started by typing someone's Digital ID. Upserted client-side
-- (own row only, by convention) every time the chat loads or the nickname
-- changes.
-- ---------------------------------------------------------------------
create table if not exists chat_identities (
  share_key uuid primary key,
  digital_id text unique not null,
  code_name text not null default 'Citizen',
  updated_at timestamptz not null default now()
);

alter table chat_identities enable row level security;

create policy "chat identities are publicly readable"
  on chat_identities for select
  to anon, authenticated
  using (true);

create policy "anyone can upsert a chat identity"
  on chat_identities for insert
  to anon, authenticated
  with check (true);

create policy "anyone can update a chat identity"
  on chat_identities for update
  to anon, authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- chat_rooms / chat_room_members — Group Chats and DMs. The Public room
-- has no row here at all; it's just room_id = null on chat_messages.
-- ---------------------------------------------------------------------
create table if not exists chat_rooms (
  id uuid primary key default gen_random_uuid(),
  name text,
  is_dm boolean not null default false,
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table chat_rooms enable row level security;

create policy "chat rooms are publicly readable"
  on chat_rooms for select
  to anon, authenticated
  using (true);

create table if not exists chat_room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references chat_rooms(id) on delete cascade,
  share_key uuid not null,
  digital_id text,
  code_name text,
  status text not null default 'invited' check (status in ('invited', 'joined')),
  is_creator boolean not null default false,
  joined_at timestamptz,
  unique (room_id, share_key)
);

alter table chat_room_members enable row level security;

create policy "chat room members are publicly readable"
  on chat_room_members for select
  to anon, authenticated
  using (true);

create index if not exists chat_room_members_share_key_idx on chat_room_members (share_key);
create index if not exists chat_room_members_room_id_idx on chat_room_members (room_id);

-- Auto-delete a room once it has no joined members left (e.g. everyone
-- left, or a lone invitee declined) — cascades to members/messages.
create or replace function cleanup_empty_chat_room() returns trigger
language plpgsql
security definer
as $$
declare
  v_room_id uuid;
  v_joined_count integer;
begin
  v_room_id := coalesce(old.room_id, new.room_id);
  select count(*) into v_joined_count from chat_room_members where room_id = v_room_id and status = 'joined';
  if v_joined_count = 0 then
    delete from chat_rooms where id = v_room_id;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_cleanup_empty_chat_room on chat_room_members;
create trigger trg_cleanup_empty_chat_room
  after update or delete on chat_room_members
  for each row execute function cleanup_empty_chat_room();

-- ---------------------------------------------------------------------
-- chat_messages — Public (room_id null) + Group + DM messages, all in one
-- table (same pattern Winfinity uses).
-- ---------------------------------------------------------------------
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references chat_rooms(id) on delete cascade,
  sender_share_key uuid not null,
  sender_name text not null default 'Citizen',
  body text,
  image_url text,
  created_at timestamptz not null default now(),
  constraint chat_messages_has_content check (body is not null or image_url is not null)
);

alter table chat_messages enable row level security;

create policy "chat messages are publicly readable"
  on chat_messages for select
  to anon, authenticated
  using (true);

create policy "anyone can post a chat message"
  on chat_messages for insert
  to anon, authenticated
  with check (true);

create index if not exists chat_messages_room_id_idx on chat_messages (room_id);
create index if not exists chat_messages_created_at_idx on chat_messages (created_at);

-- ---------------------------------------------------------------------
-- RPCs — group/DM room creation, invites, accept/decline, leave. Each
-- re-checks membership/authorization server-side rather than trusting the
-- client's own view of its rooms.
-- ---------------------------------------------------------------------
create or replace function create_group_room(
  p_creator_share_key uuid,
  p_creator_digital_id text,
  p_creator_code_name text,
  p_room_name text,
  p_invite_digital_ids text[]
) returns uuid
language plpgsql
security definer
as $$
declare
  v_room_id uuid;
  v_invitee record;
begin
  insert into chat_rooms (name, is_dm, created_by) values (p_room_name, false, p_creator_share_key)
  returning id into v_room_id;

  insert into chat_room_members (room_id, share_key, digital_id, code_name, status, is_creator, joined_at)
  values (v_room_id, p_creator_share_key, p_creator_digital_id, p_creator_code_name, 'joined', true, now());

  for v_invitee in
    select share_key, digital_id, code_name from chat_identities where digital_id = any(p_invite_digital_ids)
  loop
    insert into chat_room_members (room_id, share_key, digital_id, code_name, status)
    values (v_room_id, v_invitee.share_key, v_invitee.digital_id, v_invitee.code_name, 'invited')
    on conflict (room_id, share_key) do nothing;
  end loop;

  return v_room_id;
end;
$$;

grant execute on function create_group_room(uuid, text, text, text, text[]) to anon;

create or replace function invite_to_group_room(
  p_room_id uuid,
  p_inviter_share_key uuid,
  p_invitee_digital_id text
) returns void
language plpgsql
security definer
as $$
declare
  v_invitee record;
begin
  if not exists (select 1 from chat_room_members where room_id = p_room_id and share_key = p_inviter_share_key and status = 'joined') then
    raise exception 'Not a member of this room';
  end if;

  select share_key, digital_id, code_name into v_invitee from chat_identities where digital_id = p_invitee_digital_id;
  if v_invitee is null then
    raise exception 'No user found with that Digital ID';
  end if;

  insert into chat_room_members (room_id, share_key, digital_id, code_name, status)
  values (p_room_id, v_invitee.share_key, v_invitee.digital_id, v_invitee.code_name, 'invited')
  on conflict (room_id, share_key) do nothing;
end;
$$;

grant execute on function invite_to_group_room(uuid, uuid, text) to anon;

create or replace function accept_group_invite(p_room_id uuid, p_share_key uuid) returns void
language plpgsql
security definer
as $$
begin
  update chat_room_members set status = 'joined', joined_at = now()
  where room_id = p_room_id and share_key = p_share_key and status = 'invited';
end;
$$;

grant execute on function accept_group_invite(uuid, uuid) to anon;

create or replace function decline_group_invite(p_room_id uuid, p_share_key uuid) returns void
language plpgsql
security definer
as $$
begin
  delete from chat_room_members where room_id = p_room_id and share_key = p_share_key and status = 'invited';
end;
$$;

grant execute on function decline_group_invite(uuid, uuid) to anon;

create or replace function leave_chat_room(p_room_id uuid, p_share_key uuid) returns void
language plpgsql
security definer
as $$
begin
  delete from chat_room_members where room_id = p_room_id and share_key = p_share_key;
end;
$$;

grant execute on function leave_chat_room(uuid, uuid) to anon;

-- Finds an existing DM room between two users, or creates one (both sides
-- joined immediately — no invite/accept step for DMs).
create or replace function create_dm_room(
  p_a_share_key uuid,
  p_a_digital_id text,
  p_a_code_name text,
  p_b_digital_id text
) returns uuid
language plpgsql
security definer
as $$
declare
  v_b record;
  v_room_id uuid;
begin
  select share_key, digital_id, code_name into v_b from chat_identities where digital_id = p_b_digital_id;
  if v_b is null then
    raise exception 'No user found with that Digital ID';
  end if;
  if v_b.share_key = p_a_share_key then
    raise exception 'Cannot start a DM with yourself';
  end if;

  select r.id into v_room_id
  from chat_rooms r
  where r.is_dm = true
    and exists (select 1 from chat_room_members m where m.room_id = r.id and m.share_key = p_a_share_key)
    and exists (select 1 from chat_room_members m where m.room_id = r.id and m.share_key = v_b.share_key)
  limit 1;

  if v_room_id is not null then
    return v_room_id;
  end if;

  insert into chat_rooms (name, is_dm, created_by) values (null, true, p_a_share_key)
  returning id into v_room_id;

  insert into chat_room_members (room_id, share_key, digital_id, code_name, status, joined_at) values
    (v_room_id, p_a_share_key, p_a_digital_id, p_a_code_name, 'joined', now()),
    (v_room_id, v_b.share_key, v_b.digital_id, v_b.code_name, 'joined', now());

  return v_room_id;
end;
$$;

grant execute on function create_dm_room(uuid, text, text, text) to anon;

-- ---------------------------------------------------------------------
-- Storage bucket for chat image attachments (unchanged from the old
-- supabase_public_chat_setup.sql this file supersedes)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict (id) do nothing;

drop policy if exists "chat images are publicly readable" on storage.objects;
create policy "chat images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'chat-images');

drop policy if exists "anyone can upload a chat image" on storage.objects;
create policy "anyone can upload a chat image"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'chat-images');
