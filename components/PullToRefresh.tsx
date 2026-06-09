'use client';

import { useEffect, useRef, useState } from 'react';

const TRIGGER_DISTANCE = 88;
const MAX_PULL_DISTANCE = 150;
const REFRESH_HOLD_MS = 3000;

export default function PullToRefresh() {
  const startY = useRef<number | null>(null);
  const scrollRoot = useRef<HTMLElement | null>(null);
  const pulling = useRef(false);
  const reloadTimer = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getElement = (target: EventTarget | null) => target instanceof Element ? target : null;
    const isBlocked = (target: EventTarget | null) => !!getElement(target)?.closest('[data-no-pull-refresh]');
    const getRoot = (target: EventTarget | null) => {
      const element = getElement(target);
      if (!element) return null;
      const root = element.closest('[data-scroll-root]');
      return root instanceof HTMLElement ? root : null;
    };
    const atTop = () => {
      const root = scrollRoot.current;
      if (root) return root.scrollTop <= 0;
      return window.scrollY <= 0 && document.documentElement.scrollTop <= 0;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (refreshing || isBlocked(event.target)) return;
      scrollRoot.current = getRoot(event.target);
      if (!atTop()) return;
      startY.current = event.touches[0]?.clientY ?? null;
      pulling.current = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (refreshing || isBlocked(event.target) || startY.current === null || !atTop()) return;
      const currentY = event.touches[0]?.clientY ?? startY.current;
      const delta = currentY - startY.current;
      if (delta <= 0) return;
      pulling.current = true;
      event.preventDefault();
      setPullDistance(Math.min(MAX_PULL_DISTANCE, Math.round(delta * 0.62)));
    };

    const reset = () => {
      pulling.current = false;
      startY.current = null;
      scrollRoot.current = null;
    };

    const onTouchEnd = () => {
      if (!pulling.current) {
        reset();
        return;
      }
      if (pullDistance >= TRIGGER_DISTANCE) {
        setRefreshing(true);
        setPullDistance(MAX_PULL_DISTANCE);
        reloadTimer.current = window.setTimeout(() => window.location.reload(), REFRESH_HOLD_MS);
      } else {
        setPullDistance(0);
      }
      reset();
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      if (reloadTimer.current) window.clearTimeout(reloadTimer.current);
    };
  }, [pullDistance, refreshing]);

  const visible = pullDistance > 0 || refreshing;
  const progress = Math.min(1, pullDistance / TRIGGER_DISTANCE);

  return (
    <div
      aria-hidden={!visible}
      className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-200"
      style={{ opacity: visible ? (refreshing ? 0.92 : Math.min(0.82, progress)) : 0 }}
    >
      <div className="absolute inset-0 bg-[#080705]/92" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-8%,rgba(216,191,120,0.09),transparent_34%),radial-gradient(circle_at_15%_100%,rgba(181,154,91,0.07),transparent_38%)]" />
      <div
        className="relative grid h-[135px] w-[135px] place-items-center rounded-full"
        style={{ transform: `scale(${refreshing ? 1 : 0.9 + progress * 0.1})` }}
      >
        <div className="absolute inset-0 animate-pulse rounded-full border border-[#d8bf78]/15" />
        <div className="absolute inset-4 rounded-full border border-[#d8bf78]/10" />
        {[0, 30, 60, 90].map((rotation) => (
          <div
            key={rotation}
            className="absolute h-[46px] w-[46px] animate-spin rounded-full border border-[#d8bf78]/20"
            style={{
              animationDuration: '3.6s',
              transform: `rotate(${rotation}deg)`,
              clipPath: 'polygon(50% 0%,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0% 50%,38% 38%)',
            }}
          />
        ))}
        <div className="relative z-10 h-[27px] w-[27px] animate-pulse rounded-full border border-[#d8bf78]/40 bg-[radial-gradient(circle,rgba(216,191,120,0.22),transparent_66%)]" />
      </div>
    </div>
  );
}
