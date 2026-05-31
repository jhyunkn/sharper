'use client';

/**
 * useFocusCarousel
 *
 * Drives a CSS scroll-snap carousel with live optical focus:
 * - Center card: 100% scale, 100% opacity, 0 blur — perfectly sharp
 * - Peripheral cards: scale/opacity/blur interpolated from scroll offset
 *
 * All visual transforms are applied directly to the DOM during scroll,
 * bypassing React rendering entirely — consistent 60fps.
 *
 * Reusable: axis:'x' for horizontal carousels, axis:'y' for vertical lists.
 */

import { useRef, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FocusCarouselOptions {
  count: number;
  axis?: 'x' | 'y';

  // Optical states
  activeScale?: number;       // default 1.0
  inactiveScale?: number;     // default 0.9
  inactiveOpacity?: number;   // default 0.3
  maxBlur?: number;           // default 2.5px — kept small for perf

  // Haptic detent fired the moment a card settles into center
  snapHaptic?: number | number[];

  // Called when the snapped index changes (after settle, not during scroll)
  onSnap?: (index: number) => void;
}

export interface FocusCarouselReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  setItemRef: (i: number) => (el: HTMLDivElement | null) => void;
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
  getActiveIndex: () => number;
}

// ─── Haptic helper ────────────────────────────────────────────────────────────

function haptic(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFocusCarousel({
  count,
  axis = 'x',
  activeScale   = 1,
  inactiveScale = 0.9,
  inactiveOpacity = 0.3,
  maxBlur       = 2.5,
  snapHaptic    = 12,
  onSnap,
}: FocusCarouselOptions): FocusCarouselReturn {
  const containerRef   = useRef<HTMLDivElement | null>(null);
  const itemRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const lastSnapped    = useRef(-1);
  const onSnapRef      = useRef(onSnap);
  onSnapRef.current    = onSnap;

  // ── Item ref setter ────────────────────────────────────────────────────────
  const setItemRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => { itemRefs.current[i] = el; },
    []
  );

  // ── Core scroll logic ──────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isX = axis === 'x';

    // Applied directly to each item's style — zero React overhead
    const applyTransforms = () => {
      const viewportSize = isX ? container.clientWidth  : container.clientHeight;
      const scrollPos    = isX ? container.scrollLeft   : container.scrollTop;
      const viewCenter   = scrollPos + viewportSize / 2;

      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;

        const elOffset = isX ? el.offsetLeft : el.offsetTop;
        const elSize   = isX ? el.offsetWidth : el.offsetHeight;
        const elCenter = elOffset + elSize / 2;

        // 0 = this card is centred, 1 = one full card-width away
        const dist = Math.min(1, Math.abs(viewCenter - elCenter) / elSize);

        const scale   = activeScale   + (inactiveScale   - activeScale)   * dist;
        const opacity = 1             + (inactiveOpacity - 1)             * dist;
        const blur    = maxBlur * dist;

        el.style.transform = `scale(${scale.toFixed(4)})`;
        el.style.opacity   = opacity.toFixed(4);
        // Only apply filter when meaningful — avoids compositing cost on center card
        el.style.filter    = blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : 'none';
      }
    };

    // Detect which card is snapped and fire haptic
    const detectSnap = () => {
      const viewportSize = isX ? container.clientWidth  : container.clientHeight;
      const scrollPos    = isX ? container.scrollLeft   : container.scrollTop;
      const viewCenter   = scrollPos + viewportSize / 2;

      let closestIdx  = 0;
      let closestDist = Infinity;

      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const elOffset = isX ? el.offsetLeft : el.offsetTop;
        const elSize   = isX ? el.offsetWidth : el.offsetHeight;
        const elCenter = elOffset + elSize / 2;
        const d = Math.abs(viewCenter - elCenter);
        if (d < closestDist) { closestDist = d; closestIdx = i; }
      }

      if (closestIdx !== lastSnapped.current) {
        lastSnapped.current = closestIdx;
        haptic(snapHaptic);
        onSnapRef.current?.(closestIdx);
      }
    };

    // Scroll-end detection: prefer native scrollend, fall back to 80ms timeout
    let endTimer: ReturnType<typeof setTimeout>;
    const handleScrollEnd = () => {
      clearTimeout(endTimer);
      endTimer = setTimeout(detectSnap, 80);
    };

    container.addEventListener('scroll', applyTransforms, { passive: true });

    if ('onscrollend' in window) {
      container.addEventListener('scrollend', detectSnap, { passive: true });
    } else {
      container.addEventListener('scroll', handleScrollEnd, { passive: true });
    }

    // Set initial state immediately
    applyTransforms();
    detectSnap();

    return () => {
      clearTimeout(endTimer);
      container.removeEventListener('scroll', applyTransforms);
      container.removeEventListener('scrollend', detectSnap);
      container.removeEventListener('scroll', handleScrollEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, axis, activeScale, inactiveScale, inactiveOpacity, maxBlur, snapHaptic]);

  // ── Programmatic navigation ────────────────────────────────────────────────
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const container = containerRef.current;
      const el = itemRefs.current[index];
      if (!container || !el) return;

      const isX = axis === 'x';
      if (isX) {
        const target = el.offsetLeft - (container.clientWidth  - el.offsetWidth)  / 2;
        container.scrollTo({ left: target, behavior });
      } else {
        const target = el.offsetTop  - (container.clientHeight - el.offsetHeight) / 2;
        container.scrollTo({ top: target, behavior });
      }
    },
    [axis]
  );

  const getActiveIndex = useCallback(() => lastSnapped.current, []);

  return { containerRef, setItemRef, scrollToIndex, getActiveIndex };
}
