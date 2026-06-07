'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getProfile, clearProfile } from '@/lib/storage';
import { getArchetype } from '@/lib/archetypes';
import { getSupabase } from '@/lib/supabase';
import { quotes as localQuotes } from '@/lib/quotes';
import { generateInsightFromProfile } from '@/lib/insights';
import { UserProfile, UserInsight } from '@/lib/types';
import BottomNav from './BottomNav';

export default function ProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [insight, setInsight] = useState<UserInsight | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (!p) { router.replace('/'); return; }
    setProfile(p);

    if (p.savedQuoteIds.length === 0) return;

    // Try Supabase first for richer card metadata, fall back to local
    const supabase = getSupabase();
    const buildInsight = (cards: { domain: string; themes: string[]; author: string }[]) => {
      const saved = cards.filter(c => p.savedQuoteIds.includes((c as { id?: string }).id ?? ''));
      const allCards = saved.length > 0 ? saved : cards;

      const themeCounts: Record<string, number> = {};
      const domainCounts: Record<string, number> = {};
      const authorCounts: Record<string, number> = {};
      for (const c of allCards) {
        (c.themes || []).forEach((t: string) => { themeCounts[t] = (themeCounts[t] || 0) + 1; });
        domainCounts[c.domain] = (domainCounts[c.domain] || 0) + 1;
        authorCounts[c.author] = (authorCounts[c.author] || 0) + 1;
      }
      const topThemes = Object.entries(themeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
      const topDomains = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
      const topAuthors = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
      setInsight(generateInsightFromProfile(p.archetypeId, topThemes, topDomains, topAuthors, p.name));
    };

    if (supabase && p.savedQuoteIds.length > 0) {
      supabase
        .from('specimen_cards')
        .select('id, domain, themes, author')
        .in('id', p.savedQuoteIds)
        .then(({ data }) => {
          if (data && data.length > 0) buildInsight(data);
          else buildInsight(localQuotes.filter(q => p.savedQuoteIds.includes(q.id)).map(q => ({ id: q.id, domain: q.category, themes: q.themes, author: q.author })));
        });
    } else {
      buildInsight(localQuotes.filter(q => p.savedQuoteIds.includes(q.id)).map(q => ({ id: q.id, domain: q.category, themes: q.themes, author: q.author })));
    }
  }, [router]);

  if (!profile) return null;

  const archetype = getArchetype(profile.archetypeId);
  if (!archetype) return null;

  const savedCount = profile.savedQuoteIds.length;
  const viewedCount = profile.viewedQuoteIds.length;
  const stats = [
    { label: 'Read', value: viewedCount },
    { label: 'Saved', value: savedCount },
  ];
  const dotCount = 14;

  const categoryMap: Record<string, number> = {};
  for (const id of profile.viewedQuoteIds) {
    const q = localQuotes.find((q) => q.id === id);
    if (q) categoryMap[q.category] = (categoryMap[q.category] || 0) + 1;
  }
  const topCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const DOMAIN_LABEL: Record<string, string> = {
    philosophy: 'Philosophy', psychology: 'Psychology', art: 'Art',
    architecture: 'Architecture', literature: 'Literature', poetry: 'Poetry',
    science: 'Science', music: 'Music', business: 'Business',
    spirituality: 'Spirituality', film: 'Film', sport: 'Sport',
    activism: 'Activism', technology: 'Technology',
  };

  const handleReset = () => { clearProfile(); sessionStorage.clear(); router.replace('/'); };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#080808]">
      <main
        data-scroll-root="profile"
        className="absolute inset-x-0 top-0 bottom-[calc(4.9rem+env(safe-area-inset-bottom))] overflow-y-auto"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
          scrollbarWidth: 'none',
        } as React.CSSProperties}
      >
        <div className="px-6 pt-14 pb-8">
          <p className="text-[10px] tracking-[0.35em] text-[#333] uppercase mb-2">sharper</p>
          <h1 className="font-serif text-2xl text-[#f5f0e8]">{profile.name}</h1>
        </div>

        <div className="px-6 space-y-4 pb-8">

          {/* AI Insight */}
          {insight ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="border border-[#c9a96e]/30 p-6 space-y-5"
              style={{ background: 'linear-gradient(135deg, #0f0d08 0%, #080808 100%)' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] tracking-[0.35em] text-[#c9a96e]/60 uppercase mb-1">Today</p>
                  <p className="font-serif italic text-[#c9a96e] text-base leading-snug">{insight.signal}</p>
                </div>
                <p className="text-2xl opacity-20" style={{ color: archetype.color }}>{archetype.symbol}</p>
              </div>

              <p className="text-sm text-[#888] leading-relaxed">{insight.mindset}</p>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#1a1a1a]">
                <div className="space-y-2.5">
                  <p className="text-[9px] tracking-[0.3em] text-[#c9a96e]/50 uppercase">Do</p>
                  {insight.dos.map((d, i) => (
                    <p key={i} className="text-xs text-[#666] leading-relaxed flex gap-2">
                      <span className="text-[#c9a96e]/40 shrink-0 mt-0.5">+</span>
                      <span>{d}</span>
                    </p>
                  ))}
                </div>
                <div className="space-y-2.5">
                  <p className="text-[9px] tracking-[0.3em] text-[#555] uppercase">Don&apos;t</p>
                  {insight.donts.map((d, i) => (
                    <p key={i} className="text-xs text-[#444] leading-relaxed flex gap-2">
                      <span className="text-[#555] shrink-0 mt-0.5">−</span>
                      <span>{d}</span>
                    </p>
                  ))}
                </div>
              </div>

              {insight.generatedAt && (
                <p className="text-[9px] text-[#2a2a2a] tracking-wider">
                  {new Date(insight.generatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-[#1a1a1a] p-6 text-center space-y-3"
            >
              <p className="text-3xl opacity-10">{archetype.symbol}</p>
              <p className="text-xs text-[#333] leading-relaxed">
                Save a few cards and your personal reading will appear here.
              </p>
            </motion.div>
          )}

          {/* Archetype */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="border border-[#1a1a1a] p-6 space-y-4"
          >
            <div className="flex items-start gap-4">
              <p className="text-3xl mt-0.5" style={{ color: archetype.color }}>{archetype.symbol}</p>
              <div>
                <p className="text-[10px] tracking-[0.3em] text-[#444] uppercase mb-1">Your Archetype</p>
                <h2 className="font-serif text-xl text-[#f5f0e8]">{archetype.name}</h2>
                <p className="text-xs text-[#555] italic mt-0.5">{archetype.tagline}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {archetype.traits.map((trait) => (
                <span key={trait} className="text-[9px] tracking-widest uppercase border border-[#1e1e1e] text-[#444] px-2.5 py-1">{trait}</span>
              ))}
            </div>
            <p className="text-xs text-[#555] leading-relaxed">{archetype.description}</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="border border-[#151515] px-5 py-4 space-y-4"
          >
            {stats.map((stat) => {
              const activeDots = Math.min(dotCount, stat.value);
              return (
                <div key={stat.label} className="flex items-center gap-4">
                  <div className="w-14 shrink-0">
                    <p className="text-[9px] tracking-widest text-[#4a4a4a] uppercase">{stat.label}</p>
                  </div>
                  <div className="flex flex-1 items-center gap-1.5">
                    {Array.from({ length: dotCount }).map((_, i) => {
                      const active = i < activeDots;
                      return (
                        <span
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                            active
                              ? 'bg-[#c9a96e] shadow-[0_0_8px_rgba(201,169,110,0.35)]'
                              : 'bg-[#1a1a1a]'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="w-5 text-right font-serif text-sm text-[#777]">{stat.value}</p>
                </div>
              );
            })}
          </motion.div>

          {/* Reading profile */}
          {topCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="border border-[#1a1a1a] p-6 space-y-3"
            >
              <p className="text-[9px] tracking-widest text-[#333] uppercase">Reading profile</p>
              {topCategories.map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#111] relative overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-[#c9a96e33]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / viewedCount) * 100}%` }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                    />
                  </div>
                  <p className="text-[10px] text-[#555] w-24 text-right">{DOMAIN_LABEL[cat] ?? cat}</p>
                </div>
              ))}
            </motion.div>
          )}

          <div className="pt-2 pb-4 text-center">
            {!showReset ? (
              <button onClick={() => setShowReset(true)} className="text-[10px] text-[#222] tracking-widest uppercase hover:text-[#444] transition-colors">
                Reset profile
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#444]">This will erase everything. Continue?</p>
                <div className="flex gap-4 justify-center">
                  <button onClick={handleReset} className="text-[10px] text-[#cc6b6b] tracking-widest uppercase">Yes, reset</button>
                  <button onClick={() => setShowReset(false)} className="text-[10px] text-[#333] tracking-widest uppercase">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav docked />
    </div>
  );
}
