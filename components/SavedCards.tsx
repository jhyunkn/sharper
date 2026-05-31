'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookmarkX } from 'lucide-react';
import { getProfile, unsaveQuote } from '@/lib/storage';
import { getArchetype } from '@/lib/archetypes';
import { getSupabase } from '@/lib/supabase';
import { quotes as localQuotes } from '@/lib/quotes';
import { Quote } from '@/lib/types';
import BottomNav from './BottomNav';

const DOMAIN_LABEL: Record<string, string> = {
  philosophy: 'Philosophy',
  psychology: 'Psychology',
  art: 'Art',
  architecture: 'Architecture',
  literature: 'Literature',
  poetry: 'Poetry',
  science: 'Science',
  music: 'Music',
  business: 'Business',
  spirituality: 'Spirituality',
  film: 'Film',
  sport: 'Sport',
  activism: 'Activism',
  technology: 'Technology',
  humor: 'Humor & Wit',
};

async function loadSavedCards(ids: string[]): Promise<Quote[]> {
  if (ids.length === 0) return [];

  const supabase = getSupabase();

  if (supabase) {
    const { data } = await supabase
      .from('specimen_cards')
      .select('id, text, author, author_title, domain, themes, archetype_affinity')
      .in('id', ids);

    if (data && data.length > 0) {
      const map = new Map(data.map((c: { id: string; text: string; author: string; author_title: string; domain: string; themes: string[]; archetype_affinity: string[] }) => [c.id, c]));
      return ids
        .map((id) => {
          const c = map.get(id);
          if (!c) return null;
          return {
            id: c.id,
            text: c.text,
            author: c.author,
            authorTitle: c.author_title,
            category: c.domain as Quote['category'],
            themes: c.themes || [],
            archetypeAffinity: c.archetype_affinity || [],
          } as Quote;
        })
        .filter(Boolean) as Quote[];
    }
  }

  // Fallback: local static quotes
  return ids
    .map((id) => localQuotes.find((q) => q.id === id))
    .filter(Boolean) as Quote[];
}

export default function SavedCards() {
  const router = useRouter();
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [archetypeColor, setArchetypeColor] = useState('#c9a96e');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = getProfile();
    if (!profile) { router.replace('/'); return; }
    const archetype = getArchetype(profile.archetypeId);
    if (archetype) setArchetypeColor(archetype.color);

    loadSavedCards(profile.savedQuoteIds).then((cards) => {
      setSavedQuotes(cards);
      setLoading(false);
    });
  }, [router]);

  const handleUnsave = (id: string) => {
    unsaveQuote(id);
    setSavedQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-6 pt-14 pb-8">
        <p className="text-[10px] tracking-[0.35em] text-[#333] uppercase mb-2">sharper</p>
        <h1 className="font-serif text-2xl text-[#f5f0e8]">Saved</h1>
        {savedQuotes.length > 0 && (
          <p className="text-xs text-[#444] mt-1">
            {savedQuotes.length} thought{savedQuotes.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center pt-16">
          <p className="text-xs text-[#333]">Loading…</p>
        </div>
      ) : savedQuotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 pt-16 text-center gap-4">
          <p className="text-4xl opacity-20">☽</p>
          <p className="text-sm text-[#333] leading-relaxed">
            Nothing saved yet.
            <br />
            Bookmark thoughts that move you.
          </p>
        </div>
      ) : (
        <div className="px-6 space-y-3">
          {savedQuotes.map((quote, i) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="border border-[#1a1a1a] p-5 space-y-3 group relative"
            >
              <p
                className="text-[9px] tracking-[0.3em] uppercase"
                style={{ color: archetypeColor + '80' }}
              >
                {DOMAIN_LABEL[quote.category] ?? quote.category}
              </p>
              <blockquote className="font-serif text-base leading-relaxed text-[#d0cbc2]">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-[#888]">{quote.author}</p>
                  <p className="text-[10px] text-[#333]">{quote.authorTitle}</p>
                </div>
                <button
                  onClick={() => handleUnsave(quote.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-[#333] hover:text-[#888]"
                  aria-label="Remove"
                >
                  <BookmarkX size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
