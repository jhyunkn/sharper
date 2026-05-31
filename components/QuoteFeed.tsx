'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { getProfile, saveQuote, unsaveQuote, isQuoteSaved, markViewed } from '@/lib/storage';
import { fetchCards, bumpCardQuality } from '@/lib/cards';
import { getArchetype } from '@/lib/archetypes';
import { Quote } from '@/lib/types';
import BottomNav from './BottomNav';

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

const DOMAIN_LABEL: Record<string, string> = {
  philosophy: 'Philosophy', psychology: 'Psychology', literature: 'Literature',
  poetry: 'Poetry', science: 'Science', art: 'Art', architecture: 'Architecture',
  music: 'Music', business: 'Business', spirituality: 'Spirituality',
  film: 'Film', sport: 'Sport', activism: 'Activism', technology: 'Technology',
  humor: 'Humor & Wit',
};

function SaveButton({ saved, onToggle, color }: { saved: boolean; onToggle: () => void; color: string }) {
  const scale = useSpring(1, { stiffness: 500, damping: 15 });

  const handleClick = () => {
    scale.set(0.6);
    setTimeout(() => scale.set(1.2), 80);
    setTimeout(() => scale.set(1), 200);
    onToggle();
  };

  return (
    <motion.button
      onClick={handleClick}
      style={{ scale }}
      className="w-12 h-12 flex items-center justify-center"
      aria-label={saved ? 'Unsave' : 'Save'}
    >
      <AnimatePresence mode="wait">
        {saved ? (
          <motion.div
            key="saved"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 20 }}
          >
            <BookmarkCheck size={22} style={{ color }} />
          </motion.div>
        ) : (
          <motion.div
            key="unsaved"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Bookmark size={22} className="text-[#333]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function QuoteSlide({
  quote,
  index,
  isActive,
  archetypeColor,
  onToggleSave,
}: {
  quote: Quote;
  index: number;
  isActive: boolean;
  archetypeColor: string;
  onToggleSave: (id: string) => void;
}) {
  const [saved, setSaved] = useState(false);
  const color = DOMAIN_COLOR[quote.category] ?? archetypeColor;

  useEffect(() => {
    setSaved(isQuoteSaved(quote.id));
  }, [quote.id]);

  const handleToggle = () => {
    setSaved(s => !s);
    onToggleSave(quote.id);
  };

  const item = (delay: number) => ({
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  });

  return (
    <div
      data-index={index}
      className="relative flex flex-col items-start justify-center px-8"
      style={{ height: '100svh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `radial-gradient(ellipse 100% 70% at 50% 60%, ${color}0e 0%, transparent 70%)`,
        }}
      />

      {/* Card content */}
      <div className="relative z-10 w-full max-w-sm mx-auto space-y-7">

        <AnimatePresence>
          {isActive && (
            <>
              <motion.p
                key="domain"
                variants={item(0)}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="text-[10px] tracking-[0.4em] uppercase"
                style={{ color: color + '99' }}
              >
                {DOMAIN_LABEL[quote.category] ?? quote.category}
              </motion.p>

              <motion.blockquote
                key="quote"
                variants={item(0.07)}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="font-serif text-[1.65rem] leading-[1.42] text-[#f5f0e8]"
              >
                &ldquo;{quote.text}&rdquo;
              </motion.blockquote>

              <motion.div
                key="author"
                variants={item(0.17)}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="flex items-center gap-3"
              >
                <div className="h-px w-5 shrink-0" style={{ background: color + '55' }} />
                <div>
                  <p className="text-sm text-[#aaa]">{quote.author}</p>
                  <p className="text-[11px] text-[#444] mt-0.5">{quote.authorTitle}</p>
                </div>
              </motion.div>

              {quote.themes.length > 0 && (
                <motion.div
                  key="themes"
                  variants={item(0.26)}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="flex flex-wrap gap-1.5"
                >
                  {quote.themes.slice(0, 3).map(t => (
                    <span
                      key={t}
                      className="text-[9px] tracking-widest uppercase border px-2.5 py-1"
                      style={{ borderColor: color + '22', color: color + '55' }}
                    >
                      {t}
                    </span>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Save button */}
      <motion.div
        className="absolute bottom-28 right-5 z-20"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3, delay: isActive ? 0.3 : 0 }}
      >
        <SaveButton saved={saved} onToggle={handleToggle} color={color} />
      </motion.div>

      {/* Scroll hint — first card only, fades after 3s */}
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 3.5, delay: 1.5, times: [0, 0.2, 0.7, 1] }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-px h-5 bg-gradient-to-b from-transparent via-[#333] to-transparent mx-auto" />
          </motion.div>
          <p className="text-[9px] tracking-[0.3em] text-[#2a2a2a] uppercase">scroll</p>
        </motion.div>
      )}
    </div>
  );
}

export default function QuoteFeed() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [queue, setQueue] = useState<Quote[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [archetypeColor, setArchetypeColor] = useState('#c9a96e');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = getProfile();
    if (!profile) { router.replace('/'); return; }
    const archetype = getArchetype(profile.archetypeId);
    if (archetype) setArchetypeColor(archetype.color);
    fetchCards(profile.archetypeId, profile.viewedQuoteIds).then(cards => {
      setQueue(cards);
      setLoading(false);
    });
  }, [router]);

  // Track active card via IntersectionObserver
  useEffect(() => {
    if (!queue.length) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const idx = parseInt(entry.target.getAttribute('data-index') ?? '0', 10);
            setActiveIndex(idx);
          }
        }
      },
      { root: containerRef.current, threshold: 0.55 }
    );
    cardRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [queue]);

  // Mark viewed when active card changes
  useEffect(() => {
    const card = queue[activeIndex];
    if (card) markViewed(card.id);
  }, [activeIndex, queue]);

  const handleToggleSave = useCallback((id: string) => {
    if (isQuoteSaved(id)) unsaveQuote(id);
    else { saveQuote(id); bumpCardQuality(id); }
  }, []);

  const progress = queue.length > 1 ? activeIndex / (queue.length - 1) : 0;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#080808]">
        <motion.p
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] tracking-[0.35em] text-[#2a2a2a] uppercase"
        >
          Loading
        </motion.p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#080808]">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-10 pb-3 pointer-events-none">
        <p className="text-[10px] tracking-[0.35em] text-[#1e1e1e] uppercase">sharper</p>
        <p className="text-[10px] text-[#1e1e1e]">{activeIndex + 1} / {queue.length}</p>
      </div>

      {/* Progress line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-px bg-[#0f0f0f]">
        <motion.div
          className="h-full origin-left"
          style={{ background: archetypeColor }}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll"
        style={{
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          overscrollBehavior: 'contain',
        } as React.CSSProperties}
      >
        {queue.map((quote, i) => (
          <div
            key={quote.id}
            data-index={i}
            ref={el => { cardRefs.current[i] = el; }}
          >
            <QuoteSlide
              quote={quote}
              index={i}
              isActive={i === activeIndex}
              archetypeColor={archetypeColor}
              onToggleSave={handleToggleSave}
            />
          </div>
        ))}

        {/* End card */}
        <div
          className="flex flex-col items-center justify-center gap-5 text-center"
          style={{ height: '100svh', scrollSnapAlign: 'start' }}
        >
          <motion.p
            animate={{ opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-4xl"
            style={{ color: archetypeColor }}
          >
            ✦
          </motion.p>
          <p className="font-serif text-lg text-[#333] italic">You have read everything.</p>
          <p className="text-[10px] text-[#222] tracking-widest uppercase">Scroll up to revisit</p>
          <button
            onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-2 text-[10px] tracking-[0.2em] uppercase border border-[#1e1e1e] text-[#2a2a2a] px-5 py-2.5 hover:border-[#333] hover:text-[#555] transition-colors"
          >
            Back to top
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
