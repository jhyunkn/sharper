import { UserProfile } from './types';
import { getSupabase } from './supabase';

const KEY = 'imprint_profile';

export function getProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(KEY, JSON.stringify(profile));
}

// Sync profile to Supabase — fire-and-forget, non-blocking
export function syncProfile(profile: UserProfile): void {
  const supabase = getSupabase();
  if (!supabase) return;
  supabase.from('user_profiles').upsert({
    id: profile.id,
    display_name: profile.name,
    archetype: profile.archetypeId,
    onboarding_completed: true,
    saved_card_ids: profile.savedQuoteIds,
    viewed_card_ids: profile.viewedQuoteIds,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' }).then(() => {});
}

export function saveQuote(quoteId: string): void {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.savedQuoteIds.includes(quoteId)) {
    profile.savedQuoteIds = [quoteId, ...profile.savedQuoteIds];
    saveProfile(profile);
    syncProfile(profile);
  }
}

export function unsaveQuote(quoteId: string): void {
  const profile = getProfile();
  if (!profile) return;
  profile.savedQuoteIds = profile.savedQuoteIds.filter((id) => id !== quoteId);
  saveProfile(profile);
  syncProfile(profile);
}

export function isQuoteSaved(quoteId: string): boolean {
  return getProfile()?.savedQuoteIds.includes(quoteId) ?? false;
}

export function markViewed(quoteId: string): void {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.viewedQuoteIds.includes(quoteId)) {
    profile.viewedQuoteIds = [...profile.viewedQuoteIds, quoteId];
    saveProfile(profile);
  }
}

export function clearProfile(): void {
  localStorage.removeItem(KEY);
}
