'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
      .select('id, text, author, author_title, domain, themes, archetype_affinity, historical_context, meaning, why_it_matters')
      .in('id', ids);

    if (data && data.length > 0) {
      const map = new Map(data.map((c: { id: string; text: string; author: string; author_title: string; domain: string; themes: string[]; archetype_affinity: string[]; historical_context?: string; meaning?: string; why_it_matters?: string }) => [c.id, c]));
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
            historicalContext: c.historical_context,
            meaning: c.meaning,
            whyItMatters: c.why_it_matters,
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

const DOMAIN_COLOR: Record<string, string> = {
  philosophy:   '#7B9BCC',
  psychology:   '#7BAA8C',
  literature:   '#CC8B8B',
  poetry:       '#A87BAA',
  science:      '#7BAACC',
  art:          '#C9A96E',
  architecture: '#8B8BAA',
  music:        '#CC6B6B',
  business:     '#8BAA7B',
  spirituality: '#B87BAA',
  film:         '#7BAACC',
  sport:        '#CCA06B',
  activism:     '#CC6B8B',
  technology:   '#7BCCAA',
  humor:        '#CCCC6B',
};

function ContextDrawer({
  quote,
  archetypeColor,
  onClose,
}: {
  quote: Quote;
  archetypeColor: string;
  onClose: () => void;
}) {
  const color = DOMAIN_COLOR[quote.category] ?? archetypeColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#080808] overflow-y-auto"
      style={{ scrollbarWidth: 'none' } as React.CSSProperties}
    >
      <div className="px-8 pt-14 pb-28">

        {/* Back crumb */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 mb-10 text-[9px] tracking-[0.32em] uppercase"
          style={{ color: color + '50' }}
        >
          <span>←</span>
          <span>{DOMAIN_LABEL[quote.category] ?? quote.category}</span>
        </button>

        {/* Echo — very dim */}
        <p
          className="font-serif text-[1.25rem] leading-[1.55] mb-5"
          style={{ color: '#242424' }}
        >
          &ldquo;{quote.text}&rdquo;
        </p>
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px w-5 shrink-0" style={{ background: color + '20' }} />
          <p className="text-[11px]" style={{ color: '#282828' }}>{quote.author}</p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {quote.historicalContext && (
            <section className="space-y-3">
              <p className="text-[10px] tracking-[0.42em] uppercase" style={{ color: color + '70' }}>
                Context
              </p>
              <p className="text-sm leading-[1.9] text-[#5a5a5a]">{quote.historicalContext}</p>
            </section>
          )}

          {quote.meaning && (
            <section className="space-y-3">
              <p className="text-[10px] tracking-[0.42em] uppercase" style={{ color: color + '70' }}>
                Meaning
              </p>
              <p className="text-sm leading-[1.9] text-[#5a5a5a]">{quote.meaning}</p>
            </section>
          )}

          {quote.whyItMatters && (
            <section className="space-y-3">
              <p className="text-[10px] tracking-[0.42em] uppercase" style={{ color: color + '70' }}>
                Why it matters
              </p>
              <p className="text-sm leading-[1.9] text-[#5a5a5a]">{quote.whyItMatters}</p>
            </section>
          )}
        </div>

      </div>
    </motion.div>
  );
}

export default function SavedCards() {
  const router = useRouter();
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [archetypeColor, setArchetypeColor] = useState('#c9a96e');
  const [loading, setLoading] = useState(true);
  const [expandedQuote, setExpandedQuote] = useState<Quote | null>(null);

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
    <div className="fixed inset-0 overflow-hidden bg-[#080808]">
      <main
        data-scroll-root="saved"
        className="absolute inset-x-0 top-0 bottom-[calc(4.9rem+env(safe-area-inset-bottom))] overflow-y-auto"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
          scrollbarWidth: 'none',
        } as React.CSSProperties}
      >
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
          <div className="px-6 space-y-3 pb-8">
            {savedQuotes.map((quote, i) => {
              const hasContext = !!(quote.historicalContext || quote.meaning || quote.whyItMatters);
              const color = DOMAIN_COLOR[quote.category] ?? archetypeColor;
              return (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="border border-[#1a1a1a] p-5 space-y-3 group relative"
                  onClick={() => hasContext && setExpandedQuote(quote)}
                  style={{ cursor: hasContext ? 'pointer' : 'default' }}
                >
                  <p
                    className="text-[9px] tracking-[0.3em] uppercase"
                    style={{ color: color + '80' }}
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
                    <div className="flex items-center gap-3">
                      {/* Breathing dots if context is available */}
                      {hasContext && (
                        <div className="flex items-center gap-[4px]">
                          {[0, 0.4, 0.8].map((delay, di) => (
                            <motion.span
                              key={di}
                              className="block w-[3px] h-[3px] rounded-full"
                              style={{ background: color }}
                              animate={{ opacity: [0.15, 0.45, 0.15] }}
                              transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }}
                            />
                          ))}
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUnsave(quote.id); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-[#333] hover:text-[#888]"
                        aria-label="Remove"
                      >
                        <BookmarkX size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav docked />

      <AnimatePresence>
        {expandedQuote && (
          <ContextDrawer
            quote={expandedQuote}
            archetypeColor={archetypeColor}
            onClose={() => setExpandedQuote(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
