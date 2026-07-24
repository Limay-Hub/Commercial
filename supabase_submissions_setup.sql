-- Limay Nexus — Establishment Submissions
-- Run this once in the Supabase SQL editor, after supabase_stores_setup.sql.
--
-- Public "Add Establishment" form: any visitor can submit a business for
-- listing. Unlike the read-only directory tables, anon can INSERT here but
-- NOT select — submitters can't browse each other's entries, and only the
-- project owner (via the Dashboard / service_role key, which bypasses RLS)
-- can review submissions and manually add them to `stores`.
--
-- Photos are stored as base64 data URLs in text columns (same pattern the
-- app already uses for the registration selfie) rather than Supabase
-- Storage, to avoid setting up a storage bucket for this first pass.

create extension if not exists pgcrypto;

create table if not exists store_submissions (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  address text not null,
  landmark text,
  contact_number text not null,
  email text,
  facebook text,
  instagram text,
  services text[] not null default '{}',   -- e.g. {'Delivery','Pick up','Dine in','On-site Services','Home Services'}
  logo_url text,                           -- optional, either a base64 data URL (file upload) or a plain image URL
  photo_url text not null,                 -- storefront/building/signage photo, base64 data URL or plain image URL
  created_at timestamptz not null default now()
);

alter table store_submissions enable row level security;

create policy "anyone can submit an establishment"
  on store_submissions for insert
  to anon, authenticated
  with check (true);

-- Intentionally no select policy — submissions are private until reviewed.
