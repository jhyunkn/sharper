'use client';

/**
 * QuoteFeed — the Discover view.
 *
 * Visual philosophy: the active card IS the thing being made sharper.
 * Everything peripheral recedes — literally blurred, dimmed, scaled back —
 * the way a lens renders depth of field.
 *
 * The surface is a dark room. Text rests on it like type on a proof sheet.
 * Nothing floats; everything has weight and position.
 */

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
import SubconsciousField from './SubconsciousField';

// ─── Design tokens ────────────────────────────────────────────────────────────

const DOMAIN_COLOR: Record<string, string> = {
  philosophy: '#7B9BCC', psychology: '#7BAA8C', literature: '#CC8B8B',
  poetry:     '#A87BAA', science:    '#7BAACC', art:        '#C9A96E',
  architecture:'#8B8BAA',music:      '#CC6B6B', business:   '#8BAA7B',
  spirituality:'#B87BAA',film:       '#7BAACC', sport:      '#CCA06B',
  activism:   '#CC6B8B', technology: '#7BCCAA', humor:      '#CCCC6B',
};

const DOMAIN_LABEL: Record<string, string> = {
  philosophy: 'Philosophy', psychology: 'Psychology', literature: 'Literature',
  poetry: 'Poetry', science: 'Science', art: 'Art', architecture: 'Architecture',
  music: 'Music', business: 'Business', spirituality: 'Spirituality',
  film: 'Film', sport: 'Sport', activism: 'Activism', technology: 'Technology',
  humor: 'Humor & Wit',
};

// ─── Texture data URIs ────────────────────────────────────────────────────────
// Two grain registers: fine (always on) + coarse friction (velocity-driven).
// Both use stitchTiles so they tile seamlessly on translateX.

const GRAIN_FINE = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.42'/></svg>")`;
const GRAIN_FRICTION = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.48' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='280' height='280' filter='url(%23f)' opacity='0.58'/></svg>")`;

/**
 * SpatialBackground
 *
 * Three-layer reactive environment driven by the card scroll container.
 *
 * Layer 1 — Parallax shell (translateX at 12% card speed):
 *   Contains the atmospheric radial gradient and the fine grain.
 *   Uses card-local progress (scrollLeft % cardWidth) so the parallax
 *   resets at each snap rather than accumulating across 60 cards.
 *
 * Layer 2 — Fine grain (inside parallax shell):
 *   Always present at 3% opacity, gives the surface material weight.
 *
 * Layer 3 — Friction grain (fixed, not parallaxed):
 *   Opacity driven by rolling-average scroll velocity.
 *   Represents the "screen surface" friction between viewer and cards.
 *   Instantly snaps to 0 on scrollend (transition:none + rAF restore).
 *
 * All animation is direct DOM mutation — zero React re-renders.
 * Only `background` on the gradient div is Framer Motion (reactive to gyro).
 */
function SpatialBackground({
  containerRef, lx, ly,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  lx: MotionValue<number>;
  ly: MotionValue<number>;
}) {
  const parallaxShellRef = useRef<HTMLDivElement>(null);
  const frictionRef      = useRef<HTMLDivElement>(null);

  // Gyro/pointer-driven atmospheric gradient (Framer Motion reactive chain)
  const gx  = useTransform(lx, v => `${v}%`);
  const gy  = useTransform(ly, v => `${v}%`);
  const atm = useMotionTemplate`radial-gradient(ellipse 90% 72% at ${gx} ${gy}, rgba(255,255,255,0.014) 0%, transparent 66%)`;

  useEffect(() => {
    const container = containerRef.current;
    const shell     = parallaxShellRef.current;
    const frict     = frictionRef.current;
    if (!container || !shell || !frict) return;

    let lastSL   = container.scrollLeft;
    let lastT    = performance.now();
    const velBuf: number[] = [];
    let endTimer: ReturnType<typeof setTimeout>;

    // Start with transition so the very first scroll feels eased
    frict.style.transition = 'opacity 0.14s ease';
    frict.style.opacity    = '0';

    const onScroll = () => {
      const now = performance.now();
      const dt  = now - lastT;
      const dx  = Math.abs(container.scrollLeft - lastSL);

      // ── Velocity (5-sample rolling average, ignore large gaps) ──────────
      if (dt > 0 && dt < 120) {
        velBuf.push(dx / dt);           // px / ms
        if (velBuf.length > 5) velBuf.shift();
      }
      const avgVel = velBuf.length
        ? velBuf.reduce((a, b) => a + b) / velBuf.length
        : 0;

      // ── Friction grain swell ─────────────────────────────────────────────
      // Map 0 → ~3 px/ms to 0 → 0.11 opacity
      frict.style.opacity = Math.min(0.11, avgVel * 0.05).toFixed(4);

      // ── Parallax: card-local progress, resets to 0 at every snap ────────
      // Using scrollLeft % cardWidth means the effect never drifts infinitely.
      const cw = container.clientWidth || 1;
      const progress = (container.scrollLeft % cw) / cw;   // 0 → 1 within card
      shell.style.transform = `translateX(${(-progress * cw * 0.12).toFixed(2)}px)`;

      lastSL = container.scrollLeft;
      lastT  = now;

      // Debounced settle for browsers without scrollend
      clearTimeout(endTimer);
      endTimer = setTimeout(onSettle, 80);
    };

    const onSettle = () => {
      velBuf.length = 0;
      // Instant recession — per spec: "must instantly recede"
      frict.style.transition = 'none';
      frict.style.opacity    = '0';
      // Restore easing for the next drag
      requestAnimationFrame(() => { frict.style.transition = 'opacity 0.14s ease'; });
      // Shell returns to translateX(0) naturally as the snap animation
      // completes (scrollLeft → n*cw, so progress → 0 automatically).
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    if ('onscrollend' in window) {
      container.addEventListener('scrollend', onSettle, { passive: true });
    }

    return () => {
      clearTimeout(endTimer);
      container.removeEventListener('scroll', onScroll);
      container.removeEventListener('scrollend', onSettle);
    };
  }, [containerRef]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>

      {/* ── Parallax shell: moves at 12% card speed ── */}
      <div ref={parallaxShellRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
        {/* Atmospheric light — gyro/pointer driven */}
        <motion.div className="absolute inset-0" style={{ background: atm }} />
        {/* Fine grain — always on, surface material */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: GRAIN_FINE,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.030,
          mixBlendMode: 'overlay',
        }} />
      </div>

      {/* ── Friction grain: fixed, velocity-driven ── */}
      <div ref={frictionRef} style={{
        position: 'absolute', inset: 0,
        backgroundImage: GRAIN_FRICTION,
        backgroundRepeat: 'repeat',
        backgroundSize: '280px 280px',
        opacity: 0,
        mixBlendMode: 'screen',
        willChange: 'opacity',
      }} />

    </div>
  );
}

// ─── Haptic util ──────────────────────────────────────────────────────────────

function vibe(p: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(p);
}

// ─── Save button ──────────────────────────────────────────────────────────────

function SaveButton({ saved, onToggle, color }: { saved: boolean; onToggle: () => void; color: string }) {
  const s = useSpring(1, { stiffness: 500, damping: 15 });
  const go = () => { s.set(0.55); setTimeout(() => s.set(1.2), 80); setTimeout(() => s.set(1), 220); vibe([8, 0, 4]); onToggle(); };
  return (
    <motion.button onClick={go} style={{ scale: s }} className="w-11 h-11 flex items-center justify-center" aria-label={saved ? 'Unsave' : 'Save'}>
      <AnimatePresence mode="wait">
        {saved
          ? <motion.div key="y" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 20 }}><BookmarkCheck size={20} style={{ color }} /></motion.div>
          : <motion.div key="n" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}><Bookmark size={20} className="text-[#2e2e2e]" /></motion.div>
        }
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Quote sizing — shorter text gets bigger type ─────────────────────────────

function quoteSize(text: string): string {
  const n = text.length;
  if (n < 70)  return 'text-[2.45rem] leading-[1.3]';
  if (n < 130) return 'text-[2.1rem]  leading-[1.36]';
  if (n < 200) return 'text-[1.8rem]  leading-[1.42]';
  return            'text-[1.55rem]  leading-[1.5]';
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function QuoteCard({
  quote, isActive, archetypeColor, onToggleSave,
  contextOpen, onContextChange, lx, ly,
}: {
  quote: Quote; isActive: boolean; archetypeColor: string;
  onToggleSave: (id: string) => void;
  contextOpen: boolean; onContextChange: (open: boolean) => void;
  lx: MotionValue<number>; ly: MotionValue<number>;
}) {
  const [saved, setSaved] = useState(false);
  const color      = DOMAIN_COLOR[quote.category] ?? archetypeColor;
  const hasContext = !!(quote.historicalContext || quote.meaning || quote.whyItMatters);

  useEffect(() => { setSaved(isQuoteSaved(quote.id)); }, [quote.id]);
  useEffect(() => { if (!isActive) onContextChange(false); }, [isActive]); // eslint-disable-line

  const handleToggle = () => { setSaved(s => !s); onToggleSave(quote.id); };

  // Per-card domain glow: color accent that reacts to the light source
  const gx   = useTransform(lx, v => `${v}%`);
  const gy   = useTransform(ly, v => `${v + 18}%`);
  const glow = useMotionTemplate`radial-gradient(ellipse 120% 90% at ${gx} ${gy}, ${color}16 0%, transparent 68%)`;

  return (
    // Glass: semi-transparent surface so the subconscious field bleeds through
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: 'rgba(8, 5, 5, 0.70)',
        backdropFilter: 'blur(28px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.1)',
        willChange: 'transform, opacity, filter',
      }}
    >

      {/* Domain-colored vertical spine */}
      <div className="absolute left-0 inset-y-0 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${color}50 30%, ${color}50 70%, transparent)` }} />

      {/* Domain color glow — active card only */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glow, opacity: isActive ? 1 : 0 }} transition={{ duration: 0.7 }} />

      {/* ── QUOTE FACE ── */}
      <AnimatePresence>
        {!contextOpen && (
          <motion.div
            key="face"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            className="absolute inset-0 flex flex-col px-9"
            style={{ paddingTop: '30dvh', paddingBottom: '80px' }}
            onClick={() => hasContext && onContextChange(true)}
          >
            {/* Domain — small, positioned like a runninghead */}
            <p
              className="text-[9px] tracking-[0.45em] uppercase mb-9"
              style={{ color: color + '80' }}
            >
              {DOMAIN_LABEL[quote.category] ?? quote.category}
            </p>

            {/* Quote — the focal point. Size scales to content length. */}
            <blockquote
              className={`font-serif text-[#ede8df] ${quoteSize(quote.text)}`}
            >
              {quote.text}
            </blockquote>

            {/* Attribution */}
            <div className="flex items-start gap-3 mt-7">
              <div className="w-[3px] shrink-0 mt-1" style={{ height: '28px', background: `linear-gradient(to bottom, ${color}60, transparent)` }} />
              <div>
                <p className="text-[13px] tracking-wide text-[#888]">{quote.author}</p>
                <p className="text-[10px] text-[#333] mt-[3px]">{quote.authorTitle}</p>
              </div>
            </div>

            {/* Themes — barely visible, like footnotes */}
            {quote.themes.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6">
                {quote.themes.slice(0, 3).map(t => (
                  <span key={t} className="text-[8px] tracking-[0.35em] uppercase" style={{ color: color + '38' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Context indicator — three breathing dots */}
            {hasContext && (
              <div className="flex items-center gap-[5px] mt-5">
                {[0, 0.45, 0.9].map((d, i) => (
                  <motion.span
                    key={i}
                    className="block w-[3px] h-[3px] rounded-full"
                    style={{ background: color }}
                    animate={{ opacity: [0.12, 0.45, 0.12] }}
                    transition={{ duration: 2.6, repeat: Infinity, delay: d, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTEXT FACE ── */}
      <AnimatePresence>
        {contextOpen && (
          <motion.div
            key="ctx"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: 24, transition: { duration: 0.18 } }}
            className="absolute inset-0 overflow-y-auto bg-[#050505]"
            style={{ scrollbarWidth: 'none', overscrollBehavior: 'contain' } as React.CSSProperties}
          >
            <div className="px-9 pt-14 pb-28">

              {/* Breadcrumb back */}
              <button
                onClick={() => onContextChange(false)}
                className="flex items-center gap-2 mb-10 text-[9px] tracking-[0.35em] uppercase"
                style={{ color: color + '55' }}
              >
                <span>←</span>
                <span>{DOMAIN_LABEL[quote.category] ?? quote.category}</span>
              </button>

              {/* Echo of quote — very dim, sets context */}
              <p className="font-serif text-[1.2rem] leading-[1.5] mb-4" style={{ color: '#1e1e1e' }}>
                {quote.text}
              </p>
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px w-4 shrink-0" style={{ background: color + '22' }} />
                <p className="text-[10px]" style={{ color: '#222' }}>{quote.author}</p>
              </div>

              {/* Content sections */}
              <div className="space-y-10">
                {quote.historicalContext && (
                  <section className="space-y-3">
                    <p className="text-[9px] tracking-[0.42em] uppercase" style={{ color: color + '70' }}>Context</p>
                    <p className="text-[0.82rem] leading-[1.9] text-[#555]">{quote.historicalContext}</p>
                  </section>
                )}
                {quote.meaning && (
                  <section className="space-y-3">
                    <p className="text-[9px] tracking-[0.42em] uppercase" style={{ color: color + '70' }}>Meaning</p>
                    <p className="text-[0.82rem] leading-[1.9] text-[#555]">{quote.meaning}</p>
                  </section>
                )}
                {quote.whyItMatters && (
                  <section className="space-y-3">
                    <p className="text-[9px] tracking-[0.42em] uppercase" style={{ color: color + '70' }}>Why it matters</p>
                    <p className="text-[0.82rem] leading-[1.9] text-[#555]">{quote.whyItMatters}</p>
                  </section>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save — hidden while reading context */}
      <motion.div
        className="absolute bottom-24 right-4 z-20"
        animate={{ opacity: isActive && !contextOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: contextOpen ? 'none' : 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <SaveButton saved={saved} onToggle={handleToggle} color={color} />
      </motion.div>
    </div>
  );
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

export default function QuoteFeed() {
  const router = useRouter();
  const [cards, setCards]                   = useState<Quote[]>([]);
  const [activeIndex, setActiveIndex]       = useState(0);
  const [archetypeColor, setArchetypeColor] = useState('#c9a96e');
  const [loading, setLoading]               = useState(true);
  const [contextOpen, setContextOpen]       = useState(false);

  const lx = useMotionValue(50);
  const ly = useMotionValue(42);

  // ── useFocusCarousel ──────────────────────────────────────────────────────
  const { containerRef, setItemRef } = useFocusCarousel({
    count:           cards.length,
    axis:            'x',
    activeScale:     1,
    inactiveScale:   0.86,
    inactiveOpacity: 0.18,
    maxBlur:         7,
    snapHaptic:      [8, 20, 12],
    onSnap: (i) => {
      setActiveIndex(i);
      const c = cards[i]; if (c) markViewed(c.id);
    },
  });

  // Lock horizontal scroll while context is open
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.overflowX = contextOpen ? 'hidden' : 'scroll';
  }, [contextOpen, containerRef]);

  // Atmospheric lighting: gyro on mobile, pointer on desktop
  useEffect(() => {
    const onGyro = (e: DeviceOrientationEvent) => {
      if (e.gamma != null) lx.set(50 + (e.gamma / 45) * 24);
      if (e.beta  != null) ly.set(42 + ((e.beta - 20) / 45) * 20);
    };
    const onPtr = (e: PointerEvent) => {
      lx.set((e.clientX / window.innerWidth)  * 100);
      ly.set((e.clientY / window.innerHeight) * 100);
    };
    if ('DeviceOrientationEvent' in window)
      window.addEventListener('deviceorientation', onGyro as EventListener, { passive: true });
    window.addEventListener('pointermove', onPtr, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', onGyro as EventListener);
      window.removeEventListener('pointermove', onPtr);
    };
  }, [lx, ly]);

  // Load cards
  useEffect(() => {
    const profile = getProfile();
    if (!profile) { router.replace('/'); return; }
    const archetype = getArchetype(profile.archetypeId);
    if (archetype) setArchetypeColor(archetype.color);
    fetchCards(profile.archetypeId, profile.viewedQuoteIds).then(c => {
      setCards(c); setLoading(false);
    });
  }, [router]);

  const handleToggleSave = useCallback((id: string) => {
    if (isQuoteSaved(id)) unsaveQuote(id);
    else { saveQuote(id); bumpCardQuality(id); }
  }, []);

  const progress = cards.length > 1 ? activeIndex / (cards.length - 1) : 0;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#050505]">
        <motion.p animate={{ opacity: [0.15, 0.5, 0.15] }} transition={{ duration: 2.2, repeat: Infinity }}
          className="text-[9px] tracking-[0.4em] text-[#1e1e1e] uppercase">Loading</motion.p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#050505]">
      {/* Layer order (back to front):
          1. #050505 base
          2. SubconsciousField  — blurry text from nearby cards (z:1)
          3. SpatialBackground  — grain + atmospheric gradient (z:2)
          4. Carousel           — glass cards (z:3+)
      */}
      <SubconsciousField cards={cards} activeIndex={activeIndex} />
      <SpatialBackground containerRef={containerRef} lx={lx} ly={ly} />

      {/* Progress filament — almost invisible, just a trace */}
      <div className="fixed top-0 left-0 right-0 z-50 h-px" style={{ background: '#0d0d0d' }}>
        <motion.div className="h-full origin-left" style={{ background: archetypeColor + '60' }}
          animate={{ scaleX: progress }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-7 pt-11 pb-3 pointer-events-none">
        <p className="text-[9px] tracking-[0.45em] text-[#181818] uppercase">sharper</p>
        <p className="text-[9px] text-[#181818] tabular-nums">{String(activeIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</p>
      </div>

      {/*
       * Carousel container.
       *
       * Cards are full-height (100dvh) so the peek from adjacent cards is
       * purely a left/right sliver — the depth effect is entirely optical
       * (scale + opacity + blur), not structural.
       *
       * padding-inline: 20px  → 20px of adjacent card visible on each side
       * gap: 10px              → separation between cards
       * scroll-padding-inline  → aligns snap port with visual padding
       */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex"
        style={{
          overflowX: 'scroll',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingInline: '20px',
          gap: '10px',
          scrollPaddingInline: '20px',
          alignItems: 'stretch',
        } as React.CSSProperties}
      >
        {cards.map((card, i) => (
          <div
            key={card.id}
            ref={setItemRef(i)}
            style={{
              width: 'calc(100dvw - 40px)',
              height: '100dvh',
              flexShrink: 0,
              scrollSnapAlign: 'center',
              scrollSnapStop: 'always',
              overflow: 'hidden',
              willChange: 'transform, opacity, filter',
              // No CSS transition here — hook manages transitions directly
            }}
          >
            <QuoteCard
              quote={card}
              isActive={i === activeIndex}
              archetypeColor={archetypeColor}
              contextOpen={contextOpen && i === activeIndex}
              onContextChange={setContextOpen}
              onToggleSave={handleToggleSave}
              lx={lx} ly={ly}
            />
          </div>
        ))}

        {/* End card */}
        <div style={{
          width: 'calc(100dvw - 40px)', height: '100dvh', flexShrink: 0,
          scrollSnapAlign: 'center', scrollSnapStop: 'always',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px',
        }}>
          <motion.p animate={{ opacity: [0.05, 0.18, 0.05] }} transition={{ duration: 5, repeat: Infinity }}
            className="font-serif text-5xl" style={{ color: archetypeColor }}>✦</motion.p>
          <p className="font-serif text-base text-[#222] italic">You have read everything.</p>
          <p className="text-[9px] text-[#181818] tracking-[0.35em] uppercase">Swipe back to revisit</p>
        </div>
      </div>

      {/* First-card swipe cue */}
      {activeIndex === 0 && !contextOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: 4, delay: 2, times: [0, 0.15, 0.75, 1] }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30"
        >
          <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="h-px w-7 bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />
          </motion.div>
          <p className="text-[8px] tracking-[0.4em] text-[#1e1e1e] uppercase">swipe</p>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
