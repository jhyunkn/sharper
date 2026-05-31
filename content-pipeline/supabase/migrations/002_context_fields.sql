-- Context enrichment fields for specimen_cards
-- historical_context: paragraph about the author's life and era
-- meaning: what this specific quote/statement actually means
-- why_it_matters: why it is relevant today
-- context_loaded: tracks which cards have been enriched

alter table specimen_cards
  add column if not exists historical_context text,
  add column if not exists meaning           text,
  add column if not exists why_it_matters    text,
  add column if not exists context_loaded    boolean not null default false;

-- Copyright fields (added via audit script — formalize here for completeness)
alter table specimen_cards
  add column if not exists copyright_risk text,       -- safe | low | medium | high
  add column if not exists is_active      boolean not null default true;

create index if not exists idx_cards_active on specimen_cards(is_active);
create index if not exists idx_cards_context on specimen_cards(context_loaded);
