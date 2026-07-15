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

grant execute on function admin_set_featured_gem(text, text, text) to anon;

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

grant execute on function admin_set_promo_card(text, text, text, text) to anon;

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
  delete from public_chat_messages where id = p_message_id;
end;
$$;

grant execute on function admin_delete_chat_message(text, uuid) to anon;
