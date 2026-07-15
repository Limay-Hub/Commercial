-- Limay Hub — Community Chat (single shared public room)
-- Run this once in the Supabase SQL editor, after supabase_stores_setup.sql.
-- No real auth (same trust model as the rest of this app / as Winfinity's
-- chat): sender identity is a client-generated share_key, safe to trust for
-- a low-stakes public town-square chat. Enable Realtime for this table
-- afterward: Database -> Replication -> supabase_realtime -> toggle
-- public_chat_messages on (needed for live message delivery).

create extension if not exists pgcrypto;

create table if not exists public_chat_messages (
  id uuid primary key default gen_random_uuid(),
  sender_share_key uuid not null,
  sender_name text not null default 'Citizen',
  body text,
  image_url text,
  created_at timestamptz not null default now(),
  constraint public_chat_messages_has_content check (body is not null or image_url is not null)
);

alter table public_chat_messages enable row level security;

create policy "public chat messages are publicly readable"
  on public_chat_messages for select
  to anon, authenticated
  using (true);

create policy "anyone can post a public chat message"
  on public_chat_messages for insert
  to anon, authenticated
  with check (true);

create index if not exists public_chat_messages_created_at_idx on public_chat_messages (created_at);

-- ---------------------------------------------------------------------
-- Storage bucket for chat image attachments
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict (id) do nothing;

create policy "chat images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'chat-images');

create policy "anyone can upload a chat image"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'chat-images');
