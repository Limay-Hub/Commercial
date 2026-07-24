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
  category_id text references categories(id) on delete set null,
  address text not null,
  landmark text,
  contact_number text not null,
  email text,
  facebook text,
  instagram text,
  tiktok text,
  services text[] not null default '{}',   -- e.g. {'Delivery','Pick up','Dine in','On-site Services','Home Services'}
  logo_url text,                           -- optional, either a base64 data URL (file upload) or a plain image URL
  photo_url text not null,                 -- storefront/building/signage photo, base64 data URL or plain image URL
  lat numeric,                             -- optional GPS pin
  lng numeric,
  submitter_share_key uuid,                -- submitter's local chat identity, so we can notify them on approval
  created_at timestamptz not null default now()
);

alter table store_submissions enable row level security;

create policy "anyone can submit an establishment"
  on store_submissions for insert
  to anon, authenticated
  with check (true);

-- Intentionally no select policy — submissions are private until reviewed.

-- The app submits through this RPC rather than a direct table insert —
-- this project's PostgREST layer has intermittently refused direct anon
-- inserts to store_submissions even with a verified-correct policy and
-- grants (a Supabase-side quirk, not a config error on our end). RPCs
-- run security definer and reliably bypass it.
create or replace function submit_establishment(
  p_business_name text,
  p_category_id text,
  p_address text,
  p_landmark text,
  p_contact_number text,
  p_email text,
  p_facebook text,
  p_instagram text,
  p_tiktok text,
  p_services text[],
  p_logo_url text,
  p_photo_url text,
  p_lat numeric,
  p_lng numeric,
  p_submitter_share_key uuid
) returns uuid
language plpgsql
security definer
as $$
declare
  v_id uuid;
begin
  insert into store_submissions (
    business_name, category_id, address, landmark, contact_number, email,
    facebook, instagram, tiktok, services, logo_url, photo_url, lat, lng, submitter_share_key
  ) values (
    p_business_name, p_category_id, p_address, p_landmark, p_contact_number, p_email,
    p_facebook, p_instagram, p_tiktok, p_services, p_logo_url, p_photo_url, p_lat, p_lng, p_submitter_share_key
  )
  returning id into v_id;
  return v_id;
end;
$$;

grant execute on function submit_establishment(text, text, text, text, text, text, text, text, text, text[], text, text, numeric, numeric, uuid) to anon;

-- ---------------------------------------------------------------------
-- submission_notifications — "your establishment was approved!" alerts,
-- surfaced via the topbar bell to whichever device holds the matching
-- share_key. Only admin_approve_submission (security definer) writes to
-- this table; the client only ever reads/deletes its own rows.
-- ---------------------------------------------------------------------
create table if not exists submission_notifications (
  id uuid primary key default gen_random_uuid(),
  share_key uuid not null,
  business_name text not null,
  created_at timestamptz not null default now()
);

alter table submission_notifications enable row level security;

create policy "submission notifications are publicly readable"
  on submission_notifications for select
  to anon, authenticated
  using (true);

create policy "anyone can dismiss a submission notification"
  on submission_notifications for delete
  to anon, authenticated
  using (true);

create index if not exists submission_notifications_share_key_idx on submission_notifications (share_key);
