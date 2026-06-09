'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { getProfile, isQuoteSaved, markViewed, saveQuote, unsaveQuote } from '@/lib/storage';
import { bumpCardQuality, fetchCards } from '@/lib/cards';
import { getArchetype } from '@/lib/archetypes';
import { Quote } from '@/lib/types';
import { SCULPTURE_CARD_IMAGES } from '@/lib/sculptureAssets';
import BottomNav from './BottomNav';

const DOMAIN_COLOR: Record<string, string> = {
  philosophy: '#7B9BCC', psychology: '#7BAA8C', literature: '#CC8B8B', poetry: '#A87BAA',
  science: '#7BAACC', art: '#C9A96E', architecture: '#8B8BAA', music: '#CC6B6B', business: '#8BAA7B',
  spirituality: '#B87BAA', film: '#7BAACC', sport: '#CCA06B', activism: '#CC6B8B', technology: '#7BCCAA', humor: '#CCCC6B',
};

const DOMAIN_LABEL: Record<string, string> = {
  philosophy: 'Philosophy', psychology: 'Psychology', literature: 'Literature', poetry: 'Poetry',
  science: 'Science', art: 'Art', architecture: 'Architecture', music: 'Music', business: 'Business',
  spirituality: 'Spirituality', film: 'Film', sport: 'Sport', activism: 'Activism', technology: 'Technology', humor: 'Humor & Wit',
};

function quoteSize(text: string) {
  const n = text.length;
  if (n < 70) return 'text-[1.2rem] leading-[1.38]';
  if (n < 130) return 'text-[1.05rem] leading-[1.46]';
  if (n < 200) return 'text-[0.95rem] leading-[1.52]';
  return 'text-[0.86rem] leading-[1.58]';
}

function DomainPill({ category, color }: { category: string; color: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-[9px] tracking-[0.28em] uppercase" style={{ color, borderColor: `${color}66`, backgroundColor: `${color}12` }}>
      {DOMAIN_LABEL[category] ?? category}
    </span>
  );
}

function ThemePills({ themes, color }: { themes: string[]; color: string }) {
  if (!themes.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {themes.slice(0, 3).map((theme) => (
        <span key={theme} className="rounded-full border px-2.5 py-1 text-[8px] tracking-[0.24em] uppercase" style={{ color: '#ede8df', borderColor: `${color}33`, backgroundColor: `${color}0d` }}>
          {theme}
        </span>
      ))}
    </div>
  );
}

function QuoteMeta({ quote, color }: { quote: Quote; color: string }) {
  return (
    <div className="mt-6 space-y-3 border-t border-[#29261f]/70 pt-4 pr-12">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-7 w-px shrink-0" style={{ background: `linear-gradient(to bottom, ${color}80, transparent)` }} />
        <div className="min-w-0">
          <p className="text-[13px] tracking-wide text-[#b2a997]">{quote.author}</p>
          <p className="mt-1 max-w-[14rem] text-[10px] leading-snug text-[#746d60]">{quote.authorTitle}</p>
        </div>
      </div>
      <ThemePills themes={quote.themes || []} color={color} />
    </div>
  );
}

function SaveButton({ saved, onToggle, color }: { saved: boolean; onToggle: () => void; color: string }) {
  return (
    <button onClick={onToggle} className="flex h-11 w-11 items-center justify-center" aria-label={saved ? 'Unsave' : 'Save'}>
      {saved ? <BookmarkCheck size={20} style={{ color }} /> : <Bookmark size={20} className="text-[#746d60]" />}
    </button>
  );
}

function SculptureLayer({ visualIndex }: { visualIndex: number }) {
  const image = SCULPTURE_CARD_IMAGES[visualIndex % SCULPTURE_CARD_IMAGES.length];
  if (!image) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div aria-hidden="true" className="absolute -right-10 top-4 h-[70%] w-[96%] rounded-[44%] bg-cover bg-center opacity-70 mix-blend-luminosity contrast-125 brightness-110" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_92%_72%_at_76%_31%,transparent_0%,rgba(18,17,13,0.12)_42%,rgba(18,17,13,0.72)_76%)]" />
    </div>
  );
}

function QuoteCard({ quote, isActive, archetypeColor, onToggleSave, visualIndex }: { quote: Quote; isActive: boolean; archetypeColor: string; onToggleSave: (id: string) => void; visualIndex: number }) {
  const [saved, setSaved] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const color = DOMAIN_COLOR[quote.category] ?? archetypeColor;
  const hasContext = !!(quote.historicalContext || quote.meaning || quote.whyItMatters);

  useEffect(() => { setSaved(isQuoteSaved(quote.id)); }, [quote.id]);
  useEffect(() => { if (!isActive) setContextOpen(false); }, [isActive]);

  const handleToggleSave = () => {
    setSaved((current) => !current);
    onToggleSave(quote.id);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-[#29261f]" style={{ background: 'radial-gradient(ellipse 80% 60% at 80% 42%, rgba(201,169,110,0.08), transparent 58%), linear-gradient(180deg, rgba(26,24,19,0.92), rgba(18,17,13,0.96))', boxShadow: '0 24px 80px rgba(0,0,0,0.28)' }}>
      <SculptureLayer visualIndex={visualIndex} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(18,17,13,0.92)_0%,rgba(18,17,13,0.68)_46%,rgba(18,17,13,0.16)_100%)]" />

      <AnimatePresence mode="wait">
        {!contextOpen ? (
          <motion.div key="quote-face" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col px-8 pt-8 pb-8" onClick={() => hasContext && setContextOpen(true)}>
            <DomainPill category={quote.category} color={color} />
            <blockquote className={`mt-7 max-w-[15rem] font-serif text-[#ede8df] ${quoteSize(quote.text)}`}>{quote.text}</blockquote>
            <QuoteMeta quote={quote} color={color} />
            <div className="absolute bottom-8 right-4" onClick={(event) => event.stopPropagation()}>
              <SaveButton saved={saved} onToggle={handleToggleSave} color={color} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="detail-face" data-no-pull-refresh initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="absolute inset-0 z-20 overflow-y-auto bg-[#12110d]" style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' } as React.CSSProperties}>
            <div className="px-8 pt-12 pb-[calc(8rem+env(safe-area-inset-bottom))]">
              <button onClick={() => setContextOpen(false)} className="mb-10 flex items-center gap-2 text-[9px] tracking-[0.32em] uppercase" style={{ color: `${color}aa` }}>
                <span>←</span><span>{DOMAIN_LABEL[quote.category] ?? quote.category}</span>
              </button>
              <p className="font-serif text-[1.2rem] leading-[1.55] text-[#746d60]">{quote.text}</p>
              <p className="mt-4 text-[11px] tracking-wide text-[#746d60]">{quote.author}</p>
              <div className="mt-8"><ThemePills themes={quote.themes || []} color={color} /></div>
              <div className="mt-10 space-y-10">
                {quote.historicalContext && <section className="space-y-3"><DomainPill category="context" color={color} /><p className="text-sm leading-[1.9] text-[#b2a997]">{quote.historicalContext}</p></section>}
                {quote.meaning && <section className="space-y-3"><p className="text-[9px] tracking-[0.42em] uppercase" style={{ color: `${color}cc` }}>Meaning</p><p className="text-sm leading-[1.9] text-[#b2a997]">{quote.meaning}</p></section>}
                {quote.whyItMatters && <section className="space-y-3"><p className="text-[9px] tracking-[0.42em] uppercase" style={{ color: `${color}cc` }}>Why it matters</p><p className="text-sm leading-[1.9] text-[#b2a997]">{quote.whyItMatters}</p></section>}
              </div>
              <button onClick={() => setContextOpen(false)} className="mt-14 w-full rounded-full border border-[#29261f] bg-[#1a1813]/80 px-5 py-4 text-[10px] tracking-[0.32em] uppercase text-[#b2a997]">Close card</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QuoteFeed() {
  const router = useRouter();
  const [cards, setCards] = useState<Quote[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [archetypeColor, setArchetypeColor] = useState('#c9a96e');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = getProfile();
    if (!profile) { router.replace('/'); return; }
    const archetype = getArchetype(profile.archetypeId);
    if (archetype) setArchetypeColor(archetype.color);
    fetchCards(profile.archetypeId, profile.viewedQuoteIds).then((loaded) => { setCards(loaded); setLoading(false); });
  }, [router]);

  const handleToggleSave = useCallback((id: string) => {
    if (isQuoteSaved(id)) unsaveQuote(id);
    else { saveQuote(id); bumpCardQuality(id); }
  }, []);

  if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-[#12110d]"><motion.p animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.2, repeat: Infinity }} className="text-[9px] tracking-[0.4em] text-[#746d60] uppercase">Loading</motion.p></div>;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#12110d]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_80%_10%,rgba(201,169,110,0.08),transparent_62%)]" />
      <div className="relative z-10 px-6 pt-14"><p className="text-center font-serif text-2xl tracking-[0.3em] text-[#ede8df]">SHARPER</p></div>
      <div className="absolute inset-x-0 top-24 bottom-[calc(5rem+env(safe-area-inset-bottom))] flex snap-x snap-mandatory gap-3 overflow-x-auto px-5" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties} onScroll={(event) => { const el = event.currentTarget; const width = el.clientWidth || 1; setActiveIndex(Math.round(el.scrollLeft / width)); }}>
        {cards.map((card, index) => (
          <div key={card.id} className="h-full w-[calc(100dvw-40px)] shrink-0 snap-center" onTransitionEnd={() => markViewed(card.id)}>
            <QuoteCard quote={card} isActive={index === activeIndex} archetypeColor={archetypeColor} onToggleSave={handleToggleSave} visualIndex={index} />
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
