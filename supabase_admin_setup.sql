-- Limay Hub — Admin Panel
-- Run this once in the Supabase SQL editor, after supabase_stores_setup.sql
-- and supabase_public_chat_setup.sql.
--
-- Same trust model as Winfinity's admin system: the password is hardcoded
-- here (never shipped in app.js/config.js) and re-verified INSIDE every
-- admin RPC's function body, not just at login. Change the password below
-- before deploying if you want a different one than what's in this file.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Login check
-- ---------------------------------------------------------------------
create or replace function verify_admin_login(p_password text) returns boolean
language sql
security definer
as $$
  select p_password = 'il0v3limayhub';
$$;

grant execute on function verify_admin_login(text) to anon;

-- ---------------------------------------------------------------------
-- Store Manager
-- ---------------------------------------------------------------------
create or replace function admin_upsert_store(
  p_password text,
  p_id uuid,
  p_slug text,
  p_category_id text,
  p_name text,
  p_cuisine text,
  p_rating numeric,
  p_description text,
  p_status text,
  p_status_label text,
  p_image_url text,
  p_address text,
  p_fulfillment_methods text[],
  p_sort_order integer
) returns uuid
language plpgsql
security definer
as $$
declare
  v_id uuid;
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;

  if p_id is null then
    insert into stores (slug, category_id, name, cuisine, rating, description, status, status_label, image_url, address, fulfillment_methods, sort_order)
    values (p_slug, p_category_id, p_name, p_cuisine, p_rating, p_description, p_status, p_status_label, p_image_url, p_address, p_fulfillment_methods, p_sort_order)
    returning id into v_id;
  else
    update stores set
      slug = p_slug,
      category_id = p_category_id,
      name = p_name,
      cuisine = p_cuisine,
      rating = p_rating,
      description = p_description,
      status = p_status,
      status_label = p_status_label,
      image_url = p_image_url,
      address = p_address,
      fulfillment_methods = p_fulfillment_methods,
      sort_order = p_sort_order
    where id = p_id
    returning id into v_id;
  end if;

  return v_id;
end;
$$;

grant execute on function admin_upsert_store(text, uuid, text, text, text, text, numeric, text, text, text, text, text, text[], integer) to anon;

create or replace function admin_delete_store(p_password text, p_id uuid) returns void
language plpgsql
security definer
as $$
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;
  delete from stores where id = p_id;
end;
$$;

grant execute on function admin_delete_store(text, uuid) to anon;

-- Replaces the full services list for a store in one call — simplest way
-- to sync an editable repeatable list from the client without diffing.
create or replace function admin_set_store_services(p_password text, p_store_id uuid, p_services jsonb) returns void
language plpgsql
security definer
as $$
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;

  delete from store_services where store_id = p_store_id;

  insert into store_services (store_id, name, description, price_label, sort_order)
  select p_store_id, item->>'name', coalesce(item->>'description', ''), coalesce(item->>'price_label', ''), (item->>'sort_order')::int
  from jsonb_array_elements(p_services) as item;
end;
$$;

grant execute on function admin_set_store_services(text, uuid, jsonb) to anon;

-- ---------------------------------------------------------------------
-- Featured Gems Manager (the Home tab "Discover Local Gems" banner)
-- ---------------------------------------------------------------------
create or replace function admin_set_featured_gem(p_password text, p_title text, p_subtitle text, p_image_url text) returns void
language plpgsql
security definer
as $$
declare
  v_id uuid;
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;

  select id into v_id from featured_gems where active = true order by sort_order limit 1;

  if v_id is null then
    insert into featured_gems (title, subtitle, image_url, active, sort_order)
    values (p_title, p_subtitle, p_image_url, true, 1);
  else
    update featured_gems set title = p_title, subtitle = p_subtitle, image_url = p_image_url where id = v_id;
  end if;
end;
$$;

grant execute on function admin_set_featured_gem(text, text, text, text) to anon;

-- ---------------------------------------------------------------------
-- Promo Cards Manager (Public tab: Clean-up Drive / Photo Contest cards)
-- ---------------------------------------------------------------------
create table if not exists community_promo_cards (
  card_id text primary key,          -- e.g. 'cleanup-drive', 'photo-contest'
  title text not null,
  subtitle text not null default '',
  button_label text not null default '',
  variant text not null default 'dark' check (variant in ('dark', 'light')),
  sort_order integer not null default 0
);

alter table community_promo_cards enable row level security;

create policy "promo cards are publicly readable"
  on community_promo_cards for select
  to anon, authenticated
  using (true);

insert into community_promo_cards (card_id, title, subtitle, button_label, variant, sort_order) values
  ('cleanup-drive', 'Clean-up Drive', 'Saturday, 8:00 AM', 'Join Task', 'dark', 1),
  ('photo-contest', 'Photo Contest', 'Share your Limay views', 'Upload', 'light', 2)
on conflict (card_id) do nothing;

create or replace function admin_set_promo_card(p_password text, p_card_id text, p_title text, p_subtitle text, p_button_label text) returns void
language plpgsql
security definer
as $$
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;

  update community_promo_cards
  set title = p_title, subtitle = p_subtitle, button_label = p_button_label
  where card_id = p_card_id;
end;
$$;

grant execute on function admin_set_promo_card(text, text, text, text, text) to anon;

-- ---------------------------------------------------------------------
-- Chat Moderation
-- ---------------------------------------------------------------------
create or replace function admin_delete_chat_message(p_password text, p_message_id uuid) returns void
language plpgsql
security definer
as $$
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;
  delete from chat_messages where id = p_message_id;
end;
$$;

grant execute on function admin_delete_chat_message(text, uuid) to anon;

-- ---------------------------------------------------------------------
-- Public Announcement (admin-postable, shown as a marquee strip below
-- the header on every tab except Menu)
-- ---------------------------------------------------------------------
create table if not exists community_announcements (
  id integer primary key default 1,
  message text not null default '',
  updated_at timestamptz not null default now(),
  constraint community_announcements_singleton check (id = 1)
);

alter table community_announcements enable row level security;

create policy "announcement is publicly readable"
  on community_announcements for select
  to anon, authenticated
  using (true);

insert into community_announcements (id, message) values (1, '')
on conflict (id) do nothing;

create or replace function admin_set_announcement(p_password text, p_message text) returns void
language plpgsql
security definer
as $$
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;
  update community_announcements set message = p_message, updated_at = now() where id = 1;
end;
$$;

grant execute on function admin_set_announcement(text, text) to anon;

-- ---------------------------------------------------------------------
-- Establishment Submissions review (Add Establishment form results)
-- Run after supabase_submissions_setup.sql. store_submissions has no
-- public select policy by design, so admin reads/writes go through these
-- security-definer RPCs instead, same trust model as the rest of this file.
-- ---------------------------------------------------------------------
create or replace function admin_list_submissions(p_password text) returns setof store_submissions
language plpgsql
security definer
as $$
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;
  return query select * from store_submissions order by created_at desc;
end;
$$;

grant execute on function admin_list_submissions(text) to anon;

-- Signature grew a p_category_id param since first written — drop the old
-- 14-arg version first so `create or replace` doesn't just add a second
-- overload alongside it.
drop function if exists admin_update_submission(text, uuid, text, text, text, text, text, text, text, text[], text, text, numeric, numeric);

create or replace function admin_update_submission(
  p_password text,
  p_id uuid,
  p_business_name text,
  p_category_id text,
  p_address text,
  p_landmark text,
  p_contact_number text,
  p_email text,
  p_facebook text,
  p_instagram text,
  p_services text[],
  p_logo_url text,
  p_photo_url text,
  p_lat numeric,
  p_lng numeric
) returns void
language plpgsql
security definer
as $$
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;

  update store_submissions set
    business_name = p_business_name,
    category_id = p_category_id,
    address = p_address,
    landmark = p_landmark,
    contact_number = p_contact_number,
    email = p_email,
    facebook = p_facebook,
    instagram = p_instagram,
    services = p_services,
    logo_url = nullif(p_logo_url, ''),
    photo_url = p_photo_url,
    lat = p_lat,
    lng = p_lng
  where id = p_id;
end;
$$;

grant execute on function admin_update_submission(text, uuid, text, text, text, text, text, text, text, text, text[], text, text, numeric, numeric) to anon;

create or replace function admin_delete_submission(p_password text, p_id uuid) returns void
language plpgsql
security definer
as $$
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;
  delete from store_submissions where id = p_id;
end;
$$;

grant execute on function admin_delete_submission(text, uuid) to anon;

-- Approves a submission: publishes it into `stores` (auto-slug from the
-- business name + the submission id for guaranteed uniqueness), notifies
-- the submitter's device via submission_notifications if they had one
-- (client-generated share_key, same as chat identity), then removes the
-- submission from the review queue.
create or replace function admin_approve_submission(p_password text, p_id uuid) returns uuid
language plpgsql
security definer
as $$
declare
  v_sub store_submissions%rowtype;
  v_slug text;
  v_store_id uuid;
begin
  if not verify_admin_login(p_password) then
    raise exception 'Not authorized';
  end if;

  select * into v_sub from store_submissions where id = p_id;
  if not found then
    raise exception 'Submission not found';
  end if;

  v_slug := trim(both '-' from lower(regexp_replace(trim(v_sub.business_name), '[^a-zA-Z0-9]+', '-', 'g')))
    || '-' || substr(v_sub.id::text, 1, 8);

  insert into stores (
    slug, category_id, name, cuisine, rating, description, status, status_label,
    image_url, address, fulfillment_methods, facebook, instagram, email, contact_number,
    lat, lng, submitter_share_key, sort_order
  ) values (
    v_slug, v_sub.category_id, v_sub.business_name, '', 0, '', 'open', 'Open Now',
    coalesce(nullif(v_sub.photo_url, ''), nullif(v_sub.logo_url, '')),
    v_sub.address || case when coalesce(v_sub.landmark, '') <> '' then ' (near ' || v_sub.landmark || ')' else '' end,
    coalesce(v_sub.services, '{}'), v_sub.facebook, v_sub.instagram, v_sub.email, v_sub.contact_number,
    v_sub.lat, v_sub.lng, v_sub.submitter_share_key, 999
  )
  returning id into v_store_id;

  if v_sub.logo_url is not null and v_sub.logo_url <> '' and v_sub.photo_url is not null and v_sub.photo_url <> '' then
    insert into store_gallery (store_id, image_url, label, sort_order)
    values (v_store_id, v_sub.logo_url, 'Other', 1);
  end if;

  if v_sub.submitter_share_key is not null then
    insert into submission_notifications (share_key, business_name)
    values (v_sub.submitter_share_key, v_sub.business_name);
  end if;

  delete from store_submissions where id = p_id;

  return v_store_id;
end;
$$;

grant execute on function admin_approve_submission(text, uuid) to anon;
