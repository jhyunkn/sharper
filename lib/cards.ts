/**
 * Fetches specimen cards from Supabase, personalized by archetype and viewed history.
 * Falls back to local static quotes if Supabase is not configured.
 */

import { getSupabase } from './supabase';
import { Quote } from './types';
import { quotes as localQuotes, getOrderedQuotes as localOrder } from './quotes';

export interface SpecimenCard {
  id: string;
  text: string;
  author: string;
  author_title: string;
  domain: string;
  sub_domain?: string;
  themes: string[];
  archetype_affinity: string[];
  quality_score: number;
  historical_context?: string;
  meaning?: string;
  why_it_matters?: string;
}

function toQuote(card: SpecimenCard): Quote {
  return {
    id: card.id,
    text: card.text,
    author: card.author,
    authorTitle: card.author_title,
    category: (card.domain as Quote['category']) || 'philosophy',
    themes: card.themes || [],
    archetypeAffinity: card.archetype_affinity || [],
    historicalContext: card.historical_context,
    meaning: card.meaning,
    whyItMatters: card.why_it_matters,
  };
}

export async function fetchCards(
  archetypeId: string,
  viewedIds: string[],
  limit = 60
): Promise<Quote[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return localOrder(archetypeId, viewedIds);
  }

  try {
    const SELECT = 'id, text, author, author_title, domain, sub_domain, themes, archetype_affinity, quality_score, historical_context, meaning, why_it_matters';

    // 1. Fetch affinity-matched unseen cards first (active only)
    const { data: affinityCards } = await supabase
      .from('specimen_cards')
      .select(SELECT)
      .eq('is_active', true)
      .contains('archetype_affinity', [archetypeId])
      .not('id', 'in', `(${viewedIds.length ? viewedIds.slice(-200).join(',') : 'null'})`)
      .order('quality_score', { ascending: false })
      .limit(Math.floor(limit * 0.6));

    // 2. Fill remaining slots with other active cards
    const affinityIds = (affinityCards ?? []).map((c: SpecimenCard) => c.id);
    const excludeIds = [...viewedIds.slice(-200), ...affinityIds];

    const { data: restCards } = await supabase
      .from('specimen_cards')
      .select(SELECT)
      .eq('is_active', true)
      .not('id', 'in', `(${excludeIds.length ? excludeIds.join(',') : 'null'})`)
      .order('quality_score', { ascending: false })
      .limit(Math.floor(limit * 0.4));

    const all = [...(affinityCards ?? []), ...(restCards ?? [])];

    if (all.length === 0) {
      return localOrder(archetypeId, viewedIds);
    }

    return shuffle(all).map(toQuote);
  } catch {
    return localOrder(archetypeId, viewedIds);
  }
}

export async function bumpCardQuality(cardId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.rpc('bump_quality', { card_id: cardId });
  } catch {
    // silently fail — quality bumping is non-critical
  }
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
