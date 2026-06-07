'use client';

import { useEffect, useRef, useState } from 'react';

const TRIGGER_DISTANCE = 88;
const MAX_PULL_DISTANCE = 132;

export default function PullToRefresh() {
  const startY = useRef<number | null>(null);
  const scrollRoot = useRef<HTMLElement | null>(null);
  const pulling = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getElement = (target: EventTarget | null) => {
      return target instanceof Element ? target : null;
    };

    const isBlocked = (target: EventTarget | null) => {
      return !!getElement(target)?.closest('[data-no-pull-refresh]');
    };

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
      setPullDistance(Math.min(MAX_PULL_DISTANCE, Math.round(delta * 0.58)));
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
        setPullDistance(TRIGGER_DISTANCE);
        window.location.reload();
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
    };
  }, [pullDistance, refreshing]);

  const visible = pullDistance > 0 || refreshing;
  const progress = Math.min(1, pullDistance / TRIGGER_DISTANCE);

  return (
    <div
      aria-hidden={!visible}
      className="pointer-events-none fixed left-0 right-0 top-0 z-[9999] flex justify-center transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a96e]/35 bg-[#080808]/82 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-transform duration-150"
        style={{ transform: `translateY(${Math.max(0, pullDistance - 48)}px)` }}
      >
        <div
          className="h-4 w-4 rounded-full border border-[#c9a96e]/30 border-t-[#c9a96e]"
          style={{
            transform: `rotate(${refreshing ? 360 : progress * 270}deg)`,
            transition: refreshing ? 'transform 0.55s linear' : 'transform 0.12s ease-out',
          }}
        />
      </div>
    </div>
  );
}
