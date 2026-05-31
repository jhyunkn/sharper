-- Specimen cards: the atomic unit of content
create table if not exists specimen_cards (
  id           text primary key,
  text         text not null,
  author       text not null,
  author_title text not null,
  domain       text not null,   -- philosophy | psychology | literature | poetry | science | art | architecture | music | business | spirituality | film | sport | activism | technology | humor | nature
  sub_domain   text,            -- e.g. stoicism, surrealism, quantum-physics
  era          text,            -- ancient | medieval | renaissance | enlightenment | modern | contemporary
  source       text,            -- book / speech / interview title
  themes       text[] not null default '{}',
  archetype_affinity text[] not null default '{}',  -- sage | explorer | creator | caregiver | rebel | lover | hero | mystic
  language_origin text,         -- if originally in another language
  quality_score int default 0,  -- 0-100, bumped by saves/interactions
  created_at   timestamptz default now()
);

-- Authors registry
create table if not exists authors (
  id           text primary key,
  name         text not null,
  title        text not null,
  domain       text not null,
  sub_domain   text,
  era          text,
  nationality  text,
  born         int,
  died         int,
  card_count   int default 0,
  created_at   timestamptz default now()
);

-- User profiles (migrated from localStorage, keyed by client-generated UUID)
create table if not exists user_profiles (
  id               text primary key,  -- UUID generated on device
  name             text not null,
  archetype_id     text not null,
  saved_card_ids   text[] default '{}',
  viewed_card_ids  text[] default '{}',
  domain_scores    jsonb default '{}', -- {domain: interaction_count}
  theme_scores     jsonb default '{}', -- {theme: interaction_count}
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Indexes for fast personalized queries
create index if not exists idx_cards_domain on specimen_cards(domain);
create index if not exists idx_cards_archetype on specimen_cards using gin(archetype_affinity);
create index if not exists idx_cards_themes on specimen_cards using gin(themes);
create index if not exists idx_cards_quality on specimen_cards(quality_score desc);

-- Row-level security: public read, no public write
alter table specimen_cards enable row level security;
alter table authors enable row level security;
alter table user_profiles enable row level security;

create policy "Public can read cards"   on specimen_cards   for select using (true);
create policy "Public can read authors" on authors          for select using (true);
create policy "Users manage own profile" on user_profiles
  for all using (true) with check (true);

-- Function to increment card quality on save
create or replace function bump_quality(card_id text, delta int default 1)
returns void language sql as $$
  update specimen_cards set quality_score = quality_score + delta where id = card_id;
$$;
