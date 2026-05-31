import { UserProfile } from './types';

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

export function saveQuote(quoteId: string): void {
  const profile = getProfile();
  if (!profile) return;
  if (!profile.savedQuoteIds.includes(quoteId)) {
    profile.savedQuoteIds = [quoteId, ...profile.savedQuoteIds];
    saveProfile(profile);
  }
}

export function unsaveQuote(quoteId: string): void {
  const profile = getProfile();
  if (!profile) return;
  profile.savedQuoteIds = profile.savedQuoteIds.filter((id) => id !== quoteId);
  saveProfile(profile);
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
