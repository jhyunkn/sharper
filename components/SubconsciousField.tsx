'use client';

/**
 * SubconsciousField
 *
 * The Z-axis repository of the mind. Renders 5 text fragments from cards
 * adjacent to the active one at three depth layers. Each layer has increasing
 * blur, decreasing opacity, and decreasing font size — simulating genuine
 * depth of field rather than a flat blur.
 *
 * When the active card changes, fragments fade out and in slowly (1.6s ease).
 * This makes the subconscious feel like it is breathing and rearranging
 * itself as the user explores, not snapping or flickering.
 *
 * Reusable: pass any card array + active index.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { Quote } from '@/lib/types';

// ─── Spatial layout ───────────────────────────────────────────────────────────
// Five fixed positions creating a balanced, asymmetric composition.
// Off-center placement avoids competing with the active card's typography.

const SLOTS = [
  { id: 'nw', x: 11, y: 16 },   // near layer — upper-left
  { id: 'se', x: 72, y: 76 },   // near layer — lower-right
  { id: 'ne', x: 78, y: 14 },   // mid layer  — upper-right
  { id: 'sw', x: 12, y: 80 },   // mid layer  — lower-left
  { id: 'cx', x: 46, y: 43 },   // deep layer — center
] as const;

// Which offset (relative to active index) maps to each slot
const OFFSETS = [1, -1, 2, -2, 3] as const;

// ─── Depth tiers ──────────────────────────────────────────────────────────────
// depth 0 = near, depth 1 = mid, depth 2 = deep background
const DEPTH_TIERS = [
  { blur: 9,  opacity: 0.062, size: '1.9rem',  maxWidth: '52vw', depth: 0 },
  { blur: 9,  opacity: 0.062, size: '1.9rem',  maxWidth: '52vw', depth: 0 },
  { blur: 15, opacity: 0.036, size: '1.35rem', maxWidth: '44vw', depth: 1 },
  { blur: 15, opacity: 0.036, size: '1.35rem', maxWidth: '44vw', depth: 1 },
  { blur: 22, opacity: 0.018, size: '0.9rem',  maxWidth: '36vw', depth: 2 },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubconsciousField({
  cards,
  activeIndex,
}: {
  cards: Quote[];
  activeIndex: number;
}) {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden
    >
      <AnimatePresence>
        {SLOTS.map((slot, i) => {
          const idx = activeIndex + OFFSETS[i];
          if (idx < 0 || idx >= cards.length) return null;

          const card = cards[idx];
          const tier = DEPTH_TIERS[i];

          // Truncate text to a short fragment — we want a taste, not the full quote
          const text = card.text.length > 48
            ? card.text.slice(0, 44) + '…'
            : card.text;

          return (
            <motion.p
              // Key by card ID: React unmounts old fragment and mounts new one,
              // AnimatePresence handles the fade cross-over
              key={card.id + slot.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: tier.opacity }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="absolute font-serif select-none"
              style={{
                left: `${slot.x}%`,
                top:  `${slot.y}%`,
                transform: 'translate(-50%, -50%)',
                filter: `blur(${tier.blur}px)`,
                fontSize: tier.size,
                maxWidth: tier.maxWidth,
                color: '#ffffff',
                lineHeight: 1.25,
                textAlign: 'center',
                willChange: 'opacity',
              }}
            >
              {text}
            </motion.p>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
