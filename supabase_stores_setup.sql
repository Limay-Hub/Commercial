-- Limay Hub — store directory schema
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- No real auth model (matches Winfinity's approach): this is public read-only
-- directory content. Anonymous clients can SELECT; writes are admin-only via
-- the Dashboard/service_role key, not exposed to the app.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
create table if not exists categories (
  id text primary key,               -- e.g. 'restaurants'
  name text not null,                -- e.g. 'Restaurants'
  icon text not null,                -- key into the app's ICONS map
  store_count integer not null default 0,  -- manually maintained for now
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

create policy "categories are publicly readable"
  on categories for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- stores
-- ---------------------------------------------------------------------
create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,         -- e.g. 'hearth-pizzeria', used as the app-facing id
  category_id text references categories(id) on delete set null,
  name text not null,
  cuisine text,                      -- e.g. 'Italian' (used for the cuisine filter chips)
  rating numeric(2,1) not null default 0,
  description text not null default '',
  status text not null default 'closed' check (status in ('open', 'closing', 'closed')),
  status_label text not null default 'Closed',   -- e.g. 'Open Now' / 'Closing Soon' / 'Opens 8:00 AM'
  image_url text,
  address text,
  lat numeric,
  lng numeric,
  fulfillment_methods text[] not null default '{}',  -- e.g. {'Store Pickup','Curbside','Local Delivery'}
  facebook text,
  instagram text,
  tiktok text,
  email text,
  contact_number text,
  submitter_share_key uuid,          -- set when this store came from an approved Add Establishment
                                      -- submission; lets that submitter edit their own listing later
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table stores enable row level security;

create policy "stores are publicly readable"
  on stores for select
  to anon, authenticated
  using (true);

create index if not exists stores_category_id_idx on stores (category_id);

-- ---------------------------------------------------------------------
-- store_gallery ("Gallery" section on the detail page — Menu, Interior,
-- Storefront, or Other, uploaded by admin or by the store's owner)
-- ---------------------------------------------------------------------
create table if not exists store_gallery (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  image_url text not null,           -- base64 data URL (upload/camera) or a plain image URL
  label text not null default 'Other',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table store_gallery enable row level security;

create policy "store gallery is publicly readable"
  on store_gallery for select
  to anon, authenticated
  using (true);

create index if not exists store_gallery_store_id_idx on store_gallery (store_id);
grant select on table store_gallery to anon, authenticated;

-- ---------------------------------------------------------------------
-- store_services (the "Services & Pricing" list on the detail page)
-- ---------------------------------------------------------------------
create table if not exists store_services (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  name text not null,
  description text not null default '',
  price_label text not null default '',   -- e.g. '$12.00' or 'FREE'
  sort_order integer not null default 0
);

alter table store_services enable row level security;

create policy "store services are publicly readable"
  on store_services for select
  to anon, authenticated
  using (true);

create index if not exists store_services_store_id_idx on store_services (store_id);

-- ---------------------------------------------------------------------
-- featured_gems ("Discover Local Gems" banner on Home)
-- ---------------------------------------------------------------------
create table if not exists featured_gems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  image_url text,
  badge_label text not null default 'Popular Choice',
  store_id uuid references stores(id) on delete set null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table featured_gems enable row level security;

create policy "featured gems are publicly readable"
  on featured_gems for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- Seed data (matches the current in-app fallback data, so switching to
-- Supabase doesn't change what users see)
-- ---------------------------------------------------------------------
insert into categories (id, name, icon, store_count, sort_order) values
  ('carenderia', 'Carenderia', 'utensils', 24, 1),
  ('food-stalls', 'Food Stalls', 'bowl', 18, 2),
  ('hardware', 'Hardware', 'wrench', 12, 3),
  ('restaurants', 'Restaurants', 'fork', 31, 4),
  ('grocery', 'Grocery', 'cart', 42, 5),
  ('services', 'Services', 'gear', 56, 6)
on conflict (id) do nothing;

with new_store as (
  insert into stores (slug, category_id, name, cuisine, rating, description, status, status_label, image_url, address, fulfillment_methods, sort_order)
  values ('hearth-pizzeria', 'restaurants', 'The Hearth Pizzeria', 'Italian', 4.8,
    'Authentic wood-fired sourdough pizzas using locally-sourced ingredients and a 48-hour fermentation process.',
    'open', 'Open Now', 'https://picsum.photos/seed/hearth-pizzeria/400/400',
    '45 Market Row, Poblacion District', array['Store Pickup','Local Delivery'], 1)
  on conflict (slug) do nothing
  returning id
)
insert into store_services (store_id, name, description, price_label, sort_order)
select id, s.name, s.description, s.price, s.sort_order
from new_store, (values
  ('Classic Margherita', '12" wood-fired, San Marzano tomato', '$14.00', 1),
  ('Truffle Mushroom', '12" wood-fired, wild mushroom blend', '$18.00', 2),
  ('Dine-in Reservation', 'Table for up to 6 guests', 'FREE', 3)
) as s(name, description, price, sort_order);

with new_store as (
  insert into stores (slug, category_id, name, cuisine, rating, description, status, status_label, image_url, address, fulfillment_methods, sort_order)
  values ('midori-sushi', 'restaurants', 'Midori Sushi Bar', 'Japanese', 4.9,
    'Premium grade sushi and traditional Japanese fare prepared fresh daily by our resident itamae.',
    'open', 'Open Now', 'https://picsum.photos/seed/midori-sushi/400/400',
    '12 Sakura Lane, Riverside District', array['Store Pickup','Curbside','Local Delivery'], 2)
  on conflict (slug) do nothing
  returning id
)
insert into store_services (store_id, name, description, price_label, sort_order)
select id, s.name, s.description, s.price, s.sort_order
from new_store, (values
  ('Chef''s Omakase', '10-course tasting menu', '$65.00', 1),
  ('Salmon Nigiri Set', '8 pcs, wasabi & pickled ginger', '$16.00', 2),
  ('Sake Pairing', 'Add a 4-glass tasting flight', '$22.00', 3)
) as s(name, description, price, sort_order);

with new_store as (
  insert into stores (slug, category_id, name, cuisine, rating, description, status, status_label, image_url, address, fulfillment_methods, sort_order)
  values ('burger-lab', 'restaurants', 'The Burger Lab', 'American', 4.5,
    'Science-meets-flavor with our experimental gourmet patties and house-fermented condiments.',
    'closing', 'Closing Soon', 'https://picsum.photos/seed/burger-lab/400/400',
    '8 Hop & Grain Alley, Old Town District', array['Store Pickup','Local Delivery'], 3)
  on conflict (slug) do nothing
  returning id
)
insert into store_services (store_id, name, description, price_label, sort_order)
select id, s.name, s.description, s.price, s.sort_order
from new_store, (values
  ('The Umami Bomb', 'Double patty, miso-caramel glaze', '$12.50', 1),
  ('Smoked Cheddar Melt', 'Single patty, applewood cheddar', '$10.00', 2),
  ('Loaded Lab Fries', 'Cheese sauce, bacon crumble', '$7.50', 3)
) as s(name, description, price, sort_order);

with new_store as (
  insert into stores (slug, category_id, name, cuisine, rating, description, status, status_label, image_url, address, fulfillment_methods, sort_order)
  values ('flora-fern', 'restaurants', 'Flora & Fern Cafe', 'Cafe', 4.7,
    'A botanical sanctuary offering plant-based treats, specialty coffee, and a curated houseplant boutique.',
    'closed', 'Opens 8:00 AM', 'https://picsum.photos/seed/flora-fern/400/400',
    '124 Garden Street, Old Town District', array['Store Pickup','Curbside','Local Delivery'], 4)
  on conflict (slug) do nothing
  returning id
)
insert into store_services (store_id, name, description, price_label, sort_order)
select id, s.name, s.description, s.price, s.sort_order
from new_store, (values
  ('Potting Service (Small)', 'Includes soil and drainage', '$12.00', 1),
  ('Plant Consultation', '30-min in-store session', '$25.00', 2),
  ('Home Delivery', 'Within 5 miles radius', '$8.00', 3),
  ('Gift Wrapping', 'Eco-friendly materials', 'FREE', 4)
) as s(name, description, price, sort_order);

insert into featured_gems (title, subtitle, image_url, badge_label, sort_order)
values ('Night Market Central', 'Best for local street food cravings', 'https://picsum.photos/seed/night-market-central/600/500', 'Popular Choice', 1)
on conflict do nothing;
