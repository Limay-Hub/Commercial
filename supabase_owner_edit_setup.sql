-- Limay Nexus — Owner Self-Edit + Gallery Management
-- Run this once in the Supabase SQL editor, after supabase_stores_setup.sql
-- and supabase_admin_setup.sql.
--
-- Lets whoever submitted a store (identified by their local, client-
-- generated share_key — same identity used for chat) edit their own
-- listing and manage its gallery, without needing the admin password.
-- Gallery management is shared with admin: both admin_upsert_store's
-- owner (via password) and the listing's owner (via share_key) can add
-- or remove gallery photos through the same two RPCs.

-- ---------------------------------------------------------------------
-- Owner self-edit
-- ---------------------------------------------------------------------
create or replace function owner_update_store(
  p_share_key uuid,
  p_store_id uuid,
  p_name text,
  p_description text,
  p_status text,
  p_status_label text,
  p_image_url text,
  p_address text,
  p_fulfillment_methods text[],
  p_facebook text,
  p_instagram text,
  p_email text,
  p_contact_number text,
  p_lat numeric,
  p_lng numeric
) returns void
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from stores where id = p_store_id and submitter_share_key = p_share_key) then
    raise exception 'Not authorized to edit this listing';
  end if;

  update stores set
    name = p_name,
    description = p_description,
    status = p_status,
    status_label = p_status_label,
    image_url = p_image_url,
    address = p_address,
    fulfillment_methods = p_fulfillment_methods,
    facebook = p_facebook,
    instagram = p_instagram,
    email = p_email,
    contact_number = p_contact_number,
    lat = p_lat,
    lng = p_lng
  where id = p_store_id;
end;
$$;

grant execute on function owner_update_store(uuid, uuid, text, text, text, text, text, text, text[], text, text, text, text, numeric, numeric) to anon;

-- ---------------------------------------------------------------------
-- Gallery management — admin (p_password) OR the store's owner
-- (p_share_key matching stores.submitter_share_key) may call these.
-- ---------------------------------------------------------------------
create or replace function add_gallery_image(p_password text, p_share_key uuid, p_store_id uuid, p_image_url text, p_label text) returns uuid
language plpgsql
security definer
as $$
declare
  v_authorized boolean;
  v_id uuid;
  v_next_sort integer;
begin
  v_authorized := (p_password is not null and verify_admin_login(p_password))
    or (p_share_key is not null and exists (select 1 from stores where id = p_store_id and submitter_share_key = p_share_key));
  if not v_authorized then
    raise exception 'Not authorized';
  end if;

  select coalesce(max(sort_order), 0) + 1 into v_next_sort from store_gallery where store_id = p_store_id;

  insert into store_gallery (store_id, image_url, label, sort_order)
  values (p_store_id, p_image_url, coalesce(nullif(p_label, ''), 'Other'), v_next_sort)
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function add_gallery_image(text, uuid, uuid, text, text) to anon;

create or replace function delete_gallery_image(p_password text, p_share_key uuid, p_image_id uuid) returns void
language plpgsql
security definer
as $$
declare
  v_authorized boolean;
  v_store_id uuid;
begin
  select store_id into v_store_id from store_gallery where id = p_image_id;
  if v_store_id is null then
    return;
  end if;

  v_authorized := (p_password is not null and verify_admin_login(p_password))
    or (p_share_key is not null and exists (select 1 from stores where id = v_store_id and submitter_share_key = p_share_key));
  if not v_authorized then
    raise exception 'Not authorized';
  end if;

  delete from store_gallery where id = p_image_id;
end;
$$;

grant execute on function delete_gallery_image(text, uuid, uuid) to anon;
