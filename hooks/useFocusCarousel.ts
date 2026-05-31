'use client';

/**
 * useFocusCarousel
 *
 * CSS scroll-snap carrier + live optical focus.
 *
 * Cards are observed via a scroll event listener. Transforms (scale,
 * opacity, filter:blur) are written directly to each card's style during
 * scroll — zero React re-renders, 60fps on low-end hardware.
 *
 * On snap settle:
 *   1. Transitions are re-enabled (they are suppressed during live scroll
 *      to prevent CSS easing from fighting live DOM updates)
 *   2. The active card is nudged to its exact focused state with a short
 *      ease — the "glass plate locking in" moment
 *   3. navigator.vibrate fires the haptic detent
 *
 * axis:'x' → horizontal carousel
 * axis:'y' → vertical list (Saved view, etc.)
 */

import { useRef, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FocusCarouselOptions {
  count: number;
  axis?: 'x' | 'y';
  activeScale?:       number;  // default 1.0
  inactiveScale?:     number;  // default 0.86
  inactiveOpacity?:   number;  // default 0.18
  maxBlur?:           number;  // default 7  (px)
  snapHaptic?:        number | number[];
  onSnap?:            (index: number) => void;
}

export interface FocusCarouselReturn {
  containerRef:   React.RefObject<HTMLDivElement | null>;
  setItemRef:     (i: number) => (el: HTMLDivElement | null) => void;
  scrollToIndex:  (index: number, behavior?: ScrollBehavior) => void;
  getActiveIndex: () => number;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

// The "epiphany" settle: scale and opacity ease naturally, but filter clears
// in 60ms — almost instant. This mimics the cognitive "click" of an idea
// snapping into focus, which is faster than any physical motion.
const SETTLE_TRANSITION =
  'transform 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.28s ease, filter 0.06s ease-out';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFocusCarousel({
  count,
  axis            = 'x',
  activeScale     = 1,
  inactiveScale   = 0.86,
  inactiveOpacity = 0.18,
  maxBlur         = 7,
  snapHaptic      = 15,  // single crisp pulse — the "click" of a thought into focus
  onSnap,
}: FocusCarouselOptions): FocusCarouselReturn {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const lastSnapped  = useRef(-1);
  const onSnapRef    = useRef(onSnap);
  onSnapRef.current  = onSnap;

  const setItemRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => { itemRefs.current[i] = el; },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const isX = axis === 'x';

    // ── Live scroll: write transforms directly, no transition ────────────────
    const applyTransforms = () => {
      const vpSize    = isX ? container.clientWidth  : container.clientHeight;
      const scrollPos = isX ? container.scrollLeft   : container.scrollTop;
      const vpCenter  = scrollPos + vpSize / 2;

      for (const el of itemRefs.current) {
        if (!el) continue;
        const elOffset = isX ? el.offsetLeft : el.offsetTop;
        const elSize   = isX ? el.offsetWidth : el.offsetHeight;
        const elCenter = elOffset + elSize / 2;

        // dist: 0 = perfectly centred, 1 = one full card away
        const dist    = Math.min(1, Math.abs(vpCenter - elCenter) / elSize);
        const scale   = activeScale   + (inactiveScale   - activeScale)   * dist;
        const opacity = 1             + (inactiveOpacity - 1)             * dist;
        const blur    = maxBlur * dist;

        // Suppress CSS transition during live scroll — prevents easing lag
        el.style.transition = 'none';
        el.style.transform  = `scale(${scale.toFixed(4)})`;
        el.style.opacity    = opacity.toFixed(4);
        el.style.filter     = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : 'none';
      }
    };

    // ── Snap settle: re-enable transition, lock active to perfect focus ───────
    const detectSnap = () => {
      const vpSize    = isX ? container.clientWidth  : container.clientHeight;
      const scrollPos = isX ? container.scrollLeft   : container.scrollTop;
      const vpCenter  = scrollPos + vpSize / 2;

      let closestIdx  = 0;
      let closestDist = Infinity;

      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const elOffset = isX ? el.offsetLeft : el.offsetTop;
        const elSize   = isX ? el.offsetWidth : el.offsetHeight;
        const d = Math.abs(vpCenter - (elOffset + elSize / 2));
        if (d < closestDist) { closestDist = d; closestIdx = i; }
      }

      // Re-enable transitions for the settle animation
      for (const el of itemRefs.current) {
        if (el) el.style.transition = SETTLE_TRANSITION;
      }

      // Settle active card to exact 100% focus
      const activeEl = itemRefs.current[closestIdx];
      if (activeEl) {
        activeEl.style.transform = 'scale(1)';
        activeEl.style.opacity   = '1';
        activeEl.style.filter    = 'none';
      }

      if (closestIdx !== lastSnapped.current) {
        lastSnapped.current = closestIdx;
        vibrate(snapHaptic);
        onSnapRef.current?.(closestIdx);
      }
    };

    // scrollend is exact; fallback to 80ms debounce for older browsers
    let endTimer: ReturnType<typeof setTimeout>;
    const debouncedSnap = () => { clearTimeout(endTimer); endTimer = setTimeout(detectSnap, 80); };

    container.addEventListener('scroll', applyTransforms, { passive: true });
    if ('onscrollend' in window) {
      container.addEventListener('scrollend', detectSnap, { passive: true });
    } else {
      container.addEventListener('scroll', debouncedSnap, { passive: true });
    }

    applyTransforms();
    detectSnap();

    return () => {
      clearTimeout(endTimer);
      container.removeEventListener('scroll', applyTransforms);
      container.removeEventListener('scrollend', detectSnap);
      container.removeEventListener('scroll', debouncedSnap);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, axis, activeScale, inactiveScale, inactiveOpacity, maxBlur, snapHaptic]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const container = containerRef.current;
      const el = itemRefs.current[index];
      if (!container || !el) return;
      if (axis === 'x') {
        container.scrollTo({ left: el.offsetLeft - (container.clientWidth  - el.offsetWidth)  / 2, behavior });
      } else {
        container.scrollTo({ top:  el.offsetTop  - (container.clientHeight - el.offsetHeight) / 2, behavior });
      }
    },
    [axis]
  );

  const getActiveIndex = useCallback(() => lastSnapped.current, []);

  return { containerRef, setItemRef, scrollToIndex, getActiveIndex };
}
