'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  motion, AnimatePresence, useSpring, useMotionValue,
  useMotionTemplate, useTransform, MotionValue,
} from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { getProfile, saveQuote, unsaveQuote, isQuoteSaved, markViewed } from '@/lib/storage';
import { fetchCards, bumpCardQuality } from '@/lib/cards';
import { getArchetype } from '@/lib/archetypes';
import { Quote } from '@/lib/types';
import BottomNav from './BottomNav';
import { useFocusCarousel } from '@/hooks/useFocusCarousel';

// ─── Domain mappings ─────────────────────────────────────────────────────────

const DOMAIN_COLOR: Record<string, string> = {
  philosophy: '#7B9BCC', psychology: '#7BAA8C', literature: '#CC8B8B',
  poetry: '#A87BAA', science: '#7BAACC', art: '#C9A96E',
  architecture: '#8B8BAA', music: '#CC6B6B', business: '#8BAA7B',
  spirituality: '#B87BAA', film: '#7BAACC', sport: '#CCA06B',
  activism: '#CC6B8B', technology: '#7BCCAA', humor: '#CCCC6B',
};

const DOMAIN_LABEL: Record<string, string> = {
  philosophy: 'Philosophy', psychology: 'Psychology', literature: 'Literature',
  poetry: 'Poetry', science: 'Science', art: 'Art', architecture: 'Architecture',
  music: 'Music', business: 'Business', spirituality: 'Spirituality',
  film: 'Film', sport: 'Sport', activism: 'Activism', technology: 'Technology',
  humor: 'Humor & Wit',
};

// ─── Grain + light atmosphere ─────────────────────────────────────────────────

const GRAIN_URI = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='220' height='220' filter='url(%23n)' opacity='0.45'/></svg>")`;

function AtmosphereLayer({ lightX, lightY }: { lightX: MotionValue<number>; lightY: MotionValue<number> }) {
  const gradX = useTransform(lightX, v => `${v}%`);
  const gradY = useTransform(lightY, v => `${v}%`);
  const bg = useMotionTemplate`radial-gradient(ellipse 85% 65% at ${gradX} ${gradY}, rgba(255,255,255,0.016) 0%, transparent 68%)`;
  return (
    <>
      <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background: bg }} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: GRAIN_URI, backgroundRepeat: 'repeat',
        backgroundSize: '220px 220px', opacity: 0.032, mixBlendMode: 'overlay',
      }} />
    </>
  );
}

// ─── Save button ──────────────────────────────────────────────────────────────

function haptic(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
}

function SaveButton({ saved, onToggle, color }: { saved: boolean; onToggle: () => void; color: string }) {
  const scale = useSpring(1, { stiffness: 500, damping: 15 });
  const handleClick = () => {
    scale.set(0.6);
    setTimeout(() => scale.set(1.2), 80);
    setTimeout(() => scale.set(1), 200);
    haptic([8, 0, 4]);
    onToggle();
  };
  return (
    <motion.button onClick={handleClick} style={{ scale }} className="w-12 h-12 flex items-center justify-center" aria-label={saved ? 'Unsave' : 'Save'}>
      <AnimatePresence mode="wait">
        {saved ? (
          <motion.div key="s" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 20 }}>
            <BookmarkCheck size={22} style={{ color }} />
          </motion.div>
        ) : (
          <motion.div key="u" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Bookmark size={22} className="text-[#333]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Quote Card ───────────────────────────────────────────────────────────────

function QuoteCard({
  quote, isActive, archetypeColor, onToggleSave,
  contextOpen, onContextChange, lightX, lightY,
}: {
  quote: Quote; isActive: boolean; archetypeColor: string;
  onToggleSave: (id: string) => void;
  contextOpen: boolean; onContextChange: (open: boolean) => void;
  lightX: MotionValue<number>; lightY: MotionValue<number>;
}) {
  const [saved, setSaved] = useState(false);
  const color = DOMAIN_COLOR[quote.category] ?? archetypeColor;
  const hasContext = !!(quote.historicalContext || quote.meaning || quote.whyItMatters);

  useEffect(() => { setSaved(isQuoteSaved(quote.id)); }, [quote.id]);
  useEffect(() => { if (!isActive) onContextChange(false); }, [isActive]); // eslint-disable-line

  const handleToggle = () => { setSaved(s => !s); onToggleSave(quote.id); };

  // Atmosphere: ambient glow tracks pointer/gyro
  const glowX  = useTransform(lightX, v => `${v}%`);
  const glowY  = useTransform(lightY, v => `${v + 15}%`);
  const glowBg = useMotionTemplate`radial-gradient(ellipse 110% 80% at ${glowX} ${glowY}, ${color}12 0%, transparent 72%)`;

  const item = (delay: number) => ({
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.42, delay, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  });

  return (
    // will-change declared here so GPU layer is allocated before any scroll
    <div className="relative w-full h-full overflow-hidden" style={{ willChange: 'transform, opacity, filter' }}>

      {/* Atmospheric glow */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glowBg, opacity: isActive ? 1 : 0 }} transition={{ duration: 0.6 }} />

      {/* ── QUOTE VIEW ── */}
      <AnimatePresence>
        {!contextOpen && (
          <motion.div
            key="q"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute inset-0 flex flex-col justify-center px-8"
            onClick={() => hasContext && onContextChange(true)}
          >
            <div className="w-full max-w-sm mx-auto space-y-7">
              <AnimatePresence>
                {isActive && (
                  <>
                    <motion.p key="d" variants={item(0)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      className="text-[10px] tracking-[0.4em] uppercase" style={{ color: color + '99' }}>
                      {DOMAIN_LABEL[quote.category] ?? quote.category}
                    </motion.p>

                    <motion.blockquote key="t" variants={item(0.05)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      className="font-serif text-[1.65rem] leading-[1.42] text-[#f5f0e8]">
                      &ldquo;{quote.text}&rdquo;
                    </motion.blockquote>

                    <motion.div key="a" variants={item(0.12)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex items-center gap-3">
                      <div className="h-px w-5 shrink-0" style={{ background: color + '55' }} />
                      <div>
                        <p className="text-sm text-[#aaa]">{quote.author}</p>
                        <p className="text-[11px] text-[#444] mt-0.5">{quote.authorTitle}</p>
                      </div>
                    </motion.div>

                    {quote.themes.length > 0 && (
                      <motion.div key="th" variants={item(0.18)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex flex-wrap gap-1.5">
                        {quote.themes.slice(0, 3).map(t => (
                          <span key={t} className="text-[9px] tracking-widest uppercase border px-2.5 py-1" style={{ borderColor: color + '22', color: color + '55' }}>{t}</span>
                        ))}
                      </motion.div>
                    )}

                    {hasContext && (
                      <motion.div key="dots" variants={item(0.23)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex items-center gap-[5px]">
                        {[0, 0.4, 0.8].map((delay, i) => (
                          <motion.span key={i} className="block w-[3px] h-[3px] rounded-full" style={{ background: color }}
                            animate={{ opacity: [0.15, 0.5, 0.15] }} transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }} />
                        ))}
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTEXT VIEW ── */}
      <AnimatePresence>
        {contextOpen && (
          <motion.div
            key="ctx"
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-[#080808] overflow-y-auto"
            style={{ scrollbarWidth: 'none', overscrollBehavior: 'contain' } as React.CSSProperties}
          >
            <div className="px-8 pt-14 pb-32">
              <button onClick={() => onContextChange(false)} className="flex items-center gap-2 mb-10 text-[9px] tracking-[0.32em] uppercase" style={{ color: color + '50' }}>
                <span>←</span><span>{DOMAIN_LABEL[quote.category] ?? quote.category}</span>
              </button>
              <p className="font-serif text-[1.25rem] leading-[1.55] mb-5" style={{ color: '#242424' }}>&ldquo;{quote.text}&rdquo;</p>
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px w-5 shrink-0" style={{ background: color + '20' }} />
                <p className="text-[11px]" style={{ color: '#282828' }}>{quote.author}</p>
              </div>
              <div className="space-y-10">
                {quote.historicalContext && (
                  <section className="space-y-3">
                    <p className="text-[10px] tracking-[0.42em] uppercase" style={{ color: color + '70' }}>Context</p>
                    <p className="text-sm leading-[1.9] text-[#5a5a5a]">{quote.historicalContext}</p>
                  </section>
                )}
                {quote.meaning && (
                  <section className="space-y-3">
                    <p className="text-[10px] tracking-[0.42em] uppercase" style={{ color: color + '70' }}>Meaning</p>
                    <p className="text-sm leading-[1.9] text-[#5a5a5a]">{quote.meaning}</p>
                  </section>
                )}
                {quote.whyItMatters && (
                  <section className="space-y-3">
                    <p className="text-[10px] tracking-[0.42em] uppercase" style={{ color: color + '70' }}>Why it matters</p>
                    <p className="text-sm leading-[1.9] text-[#5a5a5a]">{quote.whyItMatters}</p>
                  </section>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save button */}
      <motion.div
        className="absolute bottom-28 right-5 z-20"
        animate={{ opacity: isActive && !contextOpen ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ pointerEvents: contextOpen ? 'none' : 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <SaveButton saved={saved} onToggle={handleToggle} color={color} />
      </motion.div>
    </div>
  );
}

// ─── Main Feed ────────────────────────────────────────────────────────────────

export default function QuoteFeed() {
  const router                          = useRouter();
  const [cards, setCards]               = useState<Quote[]>([]);
  const [activeIndex, setActiveIndex]   = useState(0);
  const [archetypeColor, setArchetypeColor] = useState('#c9a96e');
  const [loading, setLoading]           = useState(true);
  const [contextOpen, setContextOpen]   = useState(false);

  const lightX = useMotionValue(50);
  const lightY = useMotionValue(42);

  // ── useFocusCarousel ────────────────────────────────────────────────────────
  const { containerRef, setItemRef, scrollToIndex } = useFocusCarousel({
    count: cards.length,
    axis: 'x',
    activeScale:     1,
    inactiveScale:   0.9,
    inactiveOpacity: 0.3,
    maxBlur:         2.5,
    snapHaptic:      12,
    onSnap: (i) => {
      setActiveIndex(i);
      const card = cards[i];
      if (card) markViewed(card.id);
    },
  });

  // Lock horizontal scroll while a context panel is open
  const prevContextRef = useRef(contextOpen);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || prevContextRef.current === contextOpen) return;
    prevContextRef.current = contextOpen;
    container.style.overflowX = contextOpen ? 'hidden' : 'scroll';
  }, [contextOpen, containerRef]);

  // Gyroscope + pointer tracking for atmospheric lighting
  useEffect(() => {
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma != null) lightX.set(50 + (e.gamma / 45) * 22);
      if (e.beta  != null) lightY.set(42 + ((e.beta - 20) / 45) * 18);
    };
    const onPointer = (e: PointerEvent) => {
      lightX.set((e.clientX / window.innerWidth)  * 100);
      lightY.set((e.clientY / window.innerHeight) * 100);
    };
    if ('DeviceOrientationEvent' in window)
      window.addEventListener('deviceorientation', onOrientation as EventListener, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', onOrientation as EventListener);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [lightX, lightY]);

  // Load cards
  useEffect(() => {
    const profile = getProfile();
    if (!profile) { router.replace('/'); return; }
    const archetype = getArchetype(profile.archetypeId);
    if (archetype) setArchetypeColor(archetype.color);
    fetchCards(profile.archetypeId, profile.viewedQuoteIds).then(c => {
      setCards(c);
      setLoading(false);
    });
  }, [router]);

  const handleToggleSave = useCallback((id: string) => {
    if (isQuoteSaved(id)) unsaveQuote(id);
    else { saveQuote(id); bumpCardQuality(id); }
  }, []);

  const progress = cards.length > 1 ? activeIndex / (cards.length - 1) : 0;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#080808]">
        <motion.p animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] tracking-[0.35em] text-[#2a2a2a] uppercase">Loading</motion.p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#080808]">
      <AtmosphereLayer lightX={lightX} lightY={lightY} />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-px bg-[#0f0f0f]">
        <motion.div className="h-full origin-left" style={{ background: archetypeColor }}
          animate={{ scaleX: progress }} transition={{ duration: 0.4, ease: 'easeOut' }} />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-10 pb-3 pointer-events-none">
        <p className="text-[10px] tracking-[0.35em] text-[#1e1e1e] uppercase">sharper</p>
        <p className="text-[10px] text-[#1e1e1e]">{activeIndex + 1} / {cards.length}</p>
      </div>

      {/*
        Carousel container
        — scroll-snap-type: x mandatory  → native browser snap, always centers
        — padding: 24px sides            → allows first/last card to be centered
        — each card: calc(100dvw - 48px) → 24px of adjacent card visible on each side
        — gap: 0 (spacing handled by card padding) for perfect snap math
      */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center"
        style={{
          overflowX: 'scroll',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingInline: '24px',
          gap: '12px',
          // Align snap port to account for side padding
          scrollPaddingInline: '24px',
        } as React.CSSProperties}
      >
        {cards.map((card, i) => (
          // Outer wrapper: snap target + receives direct DOM transforms from hook
          <div
            key={card.id}
            ref={setItemRef(i)}
            style={{
              width: 'calc(100dvw - 48px)',
              height: 'calc(100dvh - 48px)',
              flexShrink: 0,
              scrollSnapAlign: 'center',
              scrollSnapStop: 'always',
              borderRadius: '2px',
              overflow: 'hidden',
              // GPU layer pre-allocation
              willChange: 'transform, opacity, filter',
              // Smooth CSS transitions between snap-settle and non-scroll states
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, filter 0.35s ease',
            }}
          >
            <QuoteCard
              quote={card}
              isActive={i === activeIndex}
              archetypeColor={archetypeColor}
              contextOpen={contextOpen && i === activeIndex}
              onContextChange={setContextOpen}
              onToggleSave={handleToggleSave}
              lightX={lightX}
              lightY={lightY}
            />
          </div>
        ))}

        {/* End card */}
        <div
          style={{
            width: 'calc(100dvw - 48px)',
            height: 'calc(100dvh - 48px)',
            flexShrink: 0,
            scrollSnapAlign: 'center',
            scrollSnapStop: 'always',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <motion.p animate={{ opacity: [0.08, 0.22, 0.08] }} transition={{ duration: 4, repeat: Infinity }}
            className="text-4xl" style={{ color: archetypeColor }}>✦</motion.p>
          <p className="font-serif text-lg text-[#333] italic">You have read everything.</p>
          <p className="text-[10px] text-[#222] tracking-widest uppercase">Swipe back to revisit</p>
        </div>
      </div>

      {/* First-card swipe hint */}
      {activeIndex === 0 && !contextOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0.55, 0] }}
          transition={{ duration: 3.5, delay: 1.5, times: [0, 0.2, 0.7, 1] }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30"
        >
          <motion.div animate={{ x: [0, 7, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="h-px w-6 bg-gradient-to-r from-transparent via-[#333] to-transparent" />
          </motion.div>
          <p className="text-[9px] tracking-[0.3em] text-[#2a2a2a] uppercase">swipe</p>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
