import { createClient } from '@supabase/supabase-js';
import { SpecimenCard } from './types';
import { log } from './utils';

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  return createClient(url, key);
}

export async function publishCards(cards: SpecimenCard[]): Promise<{ inserted: number; skipped: number }> {
  const supabase = getClient();
  let inserted = 0;
  let skipped = 0;

  // Upsert in batches of 100 (Supabase limit)
  const BATCH = 100;
  for (let i = 0; i < cards.length; i += BATCH) {
    const batch = cards.slice(i, i + BATCH);

    const { data, error } = await supabase
      .from('specimen_cards')
      .upsert(batch, { onConflict: 'id', ignoreDuplicates: true })
      .select('id');

    if (error) {
      log(`Publish error (batch ${i / BATCH + 1}):`, error.message);
    } else {
      inserted += data?.length ?? 0;
      skipped += batch.length - (data?.length ?? 0);
    }
  }

  return { inserted, skipped };
}

export async function getExistingAuthorIds(): Promise<Set<string>> {
  const supabase = getClient();
  const { data } = await supabase
    .from('specimen_cards')
    .select('author')
    .order('author');

  const names = new Set((data ?? []).map((r: { author: string }) => r.author));
  return names;
}

export async function getCardCount(): Promise<number> {
  const supabase = getClient();
  const { count } = await supabase
    .from('specimen_cards')
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}
