'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, ChevronDown } from 'lucide-react';
import { getProfile, saveQuote, unsaveQuote, isQuoteSaved, markViewed } from '@/lib/storage';
import { fetchCards, bumpCardQuality } from '@/lib/cards';
import { getArchetype } from '@/lib/archetypes';
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
  nature: 'Nature',
};

export default function QuoteFeed() {
  const router = useRouter();
  const [queue, setQueue] = useState<Quote[]>([]);
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState('');
  const [archetypeColor, setArchetypeColor] = useState('#c9a96e');

  useEffect(() => {
    const profile = getProfile();
    if (!profile) { router.replace('/'); return; }

    const archetype = getArchetype(profile.archetypeId);
    if (archetype) setArchetypeColor(archetype.color);
    setName(profile.name);

    fetchCards(profile.archetypeId, profile.viewedQuoteIds).then(setQueue);
  }, [router]);

  const current = queue[index];

  useEffect(() => {
    if (!current) return;
    setSaved(isQuoteSaved(current.id));
    markViewed(current.id);
  }, [current]);

  const goNext = useCallback(() => {
    if (index < queue.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    }
  }, [index, queue.length]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  }, [index]);

  const toggleSave = () => {
    if (!current) return;
    if (saved) {
      unsaveQuote(current.id);
      setSaved(false);
    } else {
      saveQuote(current.id);
      bumpCardQuality(current.id);
      setSaved(true);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#333] text-sm">Loading…</p>
      </div>
    );
  }

  const variants = {
    enter: (d: number) => ({ y: d > 0 ? 40 : -40, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d: number) => ({ y: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-10 pb-4 bg-gradient-to-b from-[#080808] to-transparent">
        <p className="text-[10px] tracking-[0.35em] text-[#333] uppercase">imprint</p>
        <p className="text-[10px] text-[#2a2a2a]">
          {index + 1} / {queue.length}
        </p>
      </div>

      {/* Main card */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-24 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full space-y-8"
          >
            {/* Category */}
            <p
              className="text-[10px] tracking-[0.35em] uppercase"
              style={{ color: archetypeColor + '99' }}
            >
              {DOMAIN_LABEL[current.category] ?? current.category}
            </p>

            {/* Quote */}
            <blockquote className="font-serif text-[1.45rem] leading-[1.6] text-[#f5f0e8]">
              &ldquo;{current.text}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="space-y-0.5">
              <p className="text-sm text-[#f5f0e8]/80 font-medium">{current.author}</p>
              <p className="text-xs text-[#444]">{current.authorTitle}</p>
            </div>

            {/* Themes */}
            <div className="flex flex-wrap gap-1.5">
              {current.themes.slice(0, 3).map((theme) => (
                <span
                  key={theme}
                  className="text-[9px] tracking-widest uppercase border border-[#1e1e1e] text-[#333] px-2.5 py-1"
                >
                  {theme}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="fixed bottom-20 left-0 right-0 flex items-center justify-between px-8 max-w-lg mx-auto">
        <button
          onClick={toggleSave}
          className="p-2 transition-colors duration-200"
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          {saved ? (
            <BookmarkCheck size={20} style={{ color: archetypeColor }} />
          ) : (
            <Bookmark size={20} className="text-[#333] hover:text-[#666]" />
          )}
        </button>

        <button
          onClick={goNext}
          disabled={index >= queue.length - 1}
          className="flex flex-col items-center gap-1 text-[#2a2a2a] disabled:opacity-20 hover:text-[#555] transition-colors duration-200"
        >
          <ChevronDown size={20} strokeWidth={1.5} />
          <span className="text-[9px] tracking-widest uppercase">Next</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
