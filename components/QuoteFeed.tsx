'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  motion, AnimatePresence, useSpring, useMotionValue,
  useMotionTemplate, useTransform, animate, MotionValue,
} from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { getProfile, saveQuote, unsaveQuote, isQuoteSaved, markViewed } from '@/lib/storage';
import { fetchCards, bumpCardQuality } from '@/lib/cards';
import { getArchetype } from '@/lib/archetypes';
import { Quote } from '@/lib/types';
import BottomNav from './BottomNav';

// ─── Constants ───────────────────────────────────────────────────────────────

const SPRING_NAV  = { type: 'spring' as const, stiffness: 140, damping: 22, mass: 1.3 };
const SPRING_BACK = { type: 'spring' as const, stiffness: 200, damping: 28, mass: 0.9 };
const SNAP_DIST   = 0.28;  // fraction of vh to trigger snap
const SNAP_VEL    = 420;   // px/s to trigger snap
const LOG_K       = 220;   // logarithmic resistance factor

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

// ─── Utilities ───────────────────────────────────────────────────────────────

/** Logarithmic resistance — pulling feels heavier the further you drag */
function logResist(x: number, k = LOG_K): number {
  return Math.sign(x) * k * Math.log1p(Math.abs(x) / k);
}

/** Web Haptics — fire-and-forget, no-op on unsupported devices */
function haptic(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

/** Inline SVG fractal noise for grain overlay */
const GRAIN_URI = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='220' height='220' filter='url(%23n)' opacity='0.45'/></svg>")`;

// ─── Atmosphere Layer ─────────────────────────────────────────────────────────
// Grain texture + gyroscope/pointer-driven light source

function AtmosphereLayer({
  lightX,
  lightY,
}: {
  lightX: MotionValue<number>;
  lightY: MotionValue<number>;
}) {
  const gradX = useTransform(lightX, v => `${v}%`);
  const gradY = useTransform(lightY, v => `${v}%`);
  const bg = useMotionTemplate`radial-gradient(ellipse 85% 65% at ${gradX} ${gradY}, rgba(255,255,255,0.016) 0%, transparent 68%)`;

  return (
    <>
      {/* Travelling light source */}
      <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background: bg }} />
      {/* Static film grain */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: GRAIN_URI,
          backgroundRepeat: 'repeat',
          backgroundSize: '220px 220px',
          opacity: 0.032,
          mixBlendMode: 'overlay',
        }}
      />
    </>
  );
}

// ─── Save Button ─────────────────────────────────────────────────────────────

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
          <motion.div key="saved" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 20 }}>
            <BookmarkCheck size={22} style={{ color }} />
          </motion.div>
        ) : (
          <motion.div key="unsaved" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Bookmark size={22} className="text-[#333]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Quote Card ───────────────────────────────────────────────────────────────

function QuoteCard({
  quote,
  isActive,
  archetypeColor,
  onToggleSave,
  contextOpen,
  onContextChange,
  lightX,
  lightY,
}: {
  quote: Quote;
  isActive: boolean;
  archetypeColor: string;
  onToggleSave: (id: string) => void;
  contextOpen: boolean;
  onContextChange: (open: boolean) => void;
  lightX: MotionValue<number>;
  lightY: MotionValue<number>;
}) {
  const [saved, setSaved] = useState(false);
  const color = DOMAIN_COLOR[quote.category] ?? archetypeColor;
  const hasContext = !!(quote.historicalContext || quote.meaning || quote.whyItMatters);

  useEffect(() => { setSaved(isQuoteSaved(quote.id)); }, [quote.id]);
  useEffect(() => { if (!isActive) onContextChange(false); }, [isActive]); // eslint-disable-line

  const handleToggle = () => {
    setSaved(s => !s);
    onToggleSave(quote.id);
  };

  // Atmosphere: ambient glow tracks the light source
  const glowX = useTransform(lightX, v => `${v}%`);
  const glowY = useTransform(lightY, v => `${v + 15}%`);
  const glowBg = useMotionTemplate`radial-gradient(ellipse 110% 80% at ${glowX} ${glowY}, ${color}12 0%, transparent 72%)`;

  const item = (delay: number) => ({
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1, y: 0,
      transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  });

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Atmospheric ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: glowBg, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* ── QUOTE VIEW ── */}
      <AnimatePresence>
        {!contextOpen && (
          <motion.div
            key="quote-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -14, transition: { duration: 0.22 } }}
            className="absolute inset-0 flex flex-col justify-center px-8"
            onClick={() => hasContext && onContextChange(true)}
          >
            <div className="w-full max-w-sm mx-auto space-y-7">
              <AnimatePresence>
                {isActive && (
                  <>
                    <motion.p key="domain" variants={item(0)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.15 } }} className="text-[10px] tracking-[0.4em] uppercase" style={{ color: color + '99' }}>
                      {DOMAIN_LABEL[quote.category] ?? quote.category}
                    </motion.p>

                    <motion.blockquote key="quote" variants={item(0.07)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.15 } }} className="font-serif text-[1.65rem] leading-[1.42] text-[#f5f0e8]">
                      &ldquo;{quote.text}&rdquo;
                    </motion.blockquote>

                    <motion.div key="author" variants={item(0.17)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.15 } }} className="flex items-center gap-3">
                      <div className="h-px w-5 shrink-0" style={{ background: color + '55' }} />
                      <div>
                        <p className="text-sm text-[#aaa]">{quote.author}</p>
                        <p className="text-[11px] text-[#444] mt-0.5">{quote.authorTitle}</p>
                      </div>
                    </motion.div>

                    {quote.themes.length > 0 && (
                      <motion.div key="themes" variants={item(0.26)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.15 } }} className="flex flex-wrap gap-1.5">
                        {quote.themes.slice(0, 3).map(t => (
                          <span key={t} className="text-[9px] tracking-widest uppercase border px-2.5 py-1" style={{ borderColor: color + '22', color: color + '55' }}>
                            {t}
                          </span>
                        ))}
                      </motion.div>
                    )}

                    {/* Breathing depth indicator */}
                    {hasContext && (
                      <motion.div key="depth-dots" variants={item(0.34)} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex items-center gap-[5px]">
                        {[0, 0.4, 0.8].map((delay, i) => (
                          <motion.span key={i} className="block w-[3px] h-[3px] rounded-full" style={{ background: color }} animate={{ opacity: [0.15, 0.5, 0.15] }} transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }} />
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
            key="context-layer"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 overflow-y-auto"
            style={{ scrollbarWidth: 'none', overscrollBehavior: 'contain' } as React.CSSProperties}
          >
            <div className="px-8 pt-14 pb-32">
              <button onClick={() => onContextChange(false)} className="flex items-center gap-2 mb-10 text-[9px] tracking-[0.32em] uppercase" style={{ color: color + '50' }}>
                <span>←</span>
                <span>{DOMAIN_LABEL[quote.category] ?? quote.category}</span>
              </button>

              <p className="font-serif text-[1.25rem] leading-[1.55] mb-5" style={{ color: '#242424' }}>
                &ldquo;{quote.text}&rdquo;
              </p>
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
  const router = useRouter();
  const [cards, setCards]               = useState<Quote[]>([]);
  const [activeIndex, setActiveIndex]   = useState(0);
  const [archetypeColor, setArchetypeColor] = useState('#c9a96e');
  const [loading, setLoading]           = useState(true);
  const [contextOpen, setContextOpen]   = useState(false);

  // Spring-less motion value: we drive it manually with animate() so we
  // get direct drag response AND physics-based snap settlement.
  const deckY = useMotionValue(0);

  // Atmosphere motion values — driven by gyro on mobile, pointer on desktop
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(42);

  // Keep a ref so gesture callbacks always see current index without stale closure
  const activeRef = useRef(0);
  useEffect(() => { activeRef.current = activeIndex; }, [activeIndex]);

  // Gyroscope + pointer for atmospheric lighting
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma != null) lightX.set(50 + (e.gamma / 45) * 22);
      if (e.beta  != null) lightY.set(42 + ((e.beta - 20) / 45) * 18);
    };
    const handlePointer = (e: PointerEvent) => {
      lightX.set((e.clientX / window.innerWidth)  * 100);
      lightY.set((e.clientY / window.innerHeight) * 100);
    };
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
    window.addEventListener('pointermove', handlePointer, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation as EventListener);
      window.removeEventListener('pointermove', handlePointer);
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

  // Mark viewed when index changes
  useEffect(() => {
    const card = cards[activeIndex];
    if (card) markViewed(card.id);
  }, [activeIndex, cards]);

  // ── Gesture ──────────────────────────────────────────────────────────────
  // useDrag gives us multi-frame velocity averaging and tap filtering.

  const thresholdFired = useRef(false);

  const bind = useDrag(
    ({ movement: [, my], velocity: [, vy], direction: [, dy], last, tap, cancel }) => {
      if (contextOpen) { cancel?.(); return; }

      const vh     = window.innerHeight;
      const idx    = activeRef.current;
      const atTop  = idx === 0;
      const atEnd  = idx === cards.length - 1;

      if (!last) {
        // ── During drag ───────────────────────────────────────────────────
        // Hard-block at the boundaries; elsewhere apply log resistance.
        const blocked = (my > 0 && atTop) || (my < 0 && atEnd);
        const delta   = blocked ? logResist(my, 80) : logResist(my);
        deckY.set(-idx * vh + delta);

        // Single haptic pulse when crossing snap threshold
        if (!thresholdFired.current && Math.abs(my) > vh * SNAP_DIST) {
          haptic(12);
          thresholdFired.current = true;
        }
      } else {
        // ── On release ────────────────────────────────────────────────────
        thresholdFired.current = false;
        if (tap) return; // pure tap — let onClick fire on the card

        const velPx   = vy * 1000;  // @use-gesture reports velocity in px/ms
        const snaps   = Math.abs(my) > vh * SNAP_DIST || Math.abs(velPx) > SNAP_VEL;
        const goNext  = snaps && dy < 0 && !atEnd;
        const goPrev  = snaps && dy > 0 && !atTop;

        if (goNext) {
          const ni = idx + 1;
          setActiveIndex(ni);
          haptic([5, 28, 5]);
          animate(deckY, -ni * vh, SPRING_NAV);
        } else if (goPrev) {
          const ni = idx - 1;
          setActiveIndex(ni);
          haptic([5, 28, 5]);
          animate(deckY, -ni * vh, SPRING_NAV);
        } else {
          animate(deckY, -idx * vh, SPRING_BACK);
        }
      }
    },
    {
      axis: 'y',
      filterTaps: true,
      // preventScrollAxis must NOT match the drag axis — setting both to 'y'
      // causes use-gesture to deactivate the gesture entirely on touch devices.
      // touchAction:'none' on the container handles scroll prevention instead.
    }
  );

  const handleToggleSave = useCallback((id: string) => {
    if (isQuoteSaved(id)) unsaveQuote(id);
    else { saveQuote(id); bumpCardQuality(id); }
  }, []);

  const progress = cards.length > 1 ? activeIndex / (cards.length - 1) : 0;

  // Only render a window of cards around active index (performance)
  const W_START = Math.max(0, activeIndex - 2);
  const W_END   = Math.min(cards.length - 1, activeIndex + 2);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#080808]">
        <motion.p animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="text-[10px] tracking-[0.35em] text-[#2a2a2a] uppercase">
          Loading
        </motion.p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#080808]">
      <AtmosphereLayer lightX={lightX} lightY={lightY} />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-px bg-[#0f0f0f]">
        <motion.div
          className="h-full origin-left"
          style={{ background: archetypeColor }}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-10 pb-3 pointer-events-none">
        <p className="text-[10px] tracking-[0.35em] text-[#1e1e1e] uppercase">sharper</p>
        <p className="text-[10px] text-[#1e1e1e]">{activeIndex + 1} / {cards.length}</p>
      </div>

      {/* Gesture + card deck */}
      <div
        {...bind()}
        className="absolute inset-0 overflow-hidden"
        style={{ touchAction: contextOpen ? 'pan-y' : 'none' }}
      >
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{ y: deckY }}
        >
          {cards.slice(W_START, W_END + 1).map((card, localI) => {
            const gi = W_START + localI;
            return (
              <div
                key={card.id}
                className="absolute inset-x-0"
                style={{ top: `calc(${gi} * 100dvh)`, height: '100dvh' }}
              >
                <QuoteCard
                  quote={card}
                  isActive={gi === activeIndex}
                  archetypeColor={archetypeColor}
                  contextOpen={contextOpen && gi === activeIndex}
                  onContextChange={setContextOpen}
                  onToggleSave={handleToggleSave}
                  lightX={lightX}
                  lightY={lightY}
                />
              </div>
            );
          })}

          {/* End of deck */}
          {activeIndex === cards.length - 1 && (
            <div
              className="absolute inset-x-0 flex flex-col items-center justify-center gap-5 text-center"
              style={{ top: `calc(${cards.length} * 100svh)`, height: '100svh' }}
            >
              <motion.p animate={{ opacity: [0.08, 0.22, 0.08] }} transition={{ duration: 4, repeat: Infinity }} className="text-4xl" style={{ color: archetypeColor }}>✦</motion.p>
              <p className="font-serif text-lg text-[#333] italic">You have read everything.</p>
              <p className="text-[10px] text-[#222] tracking-widest uppercase">Pull down to revisit</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Scroll hint on first card */}
      {activeIndex === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 3.5, delay: 1.5, times: [0, 0.2, 0.7, 1] }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30"
        >
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="w-px h-5 bg-gradient-to-b from-transparent via-[#333] to-transparent mx-auto" />
          </motion.div>
          <p className="text-[9px] tracking-[0.3em] text-[#2a2a2a] uppercase">drag</p>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
