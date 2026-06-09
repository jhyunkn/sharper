'use client';

import { useEffect, useRef, useState } from 'react';

const TRIGGER_DISTANCE = 88;
const MAX_PULL_DISTANCE = 150;
const REFRESH_HOLD_MS = 5000;

export default function PullToRefresh() {
  const startY = useRef<number | null>(null);
  const scrollRoot = useRef<HTMLElement | null>(null);
  const pulling = useRef(false);
  const reloadTimer = useRef<number | null>(null);
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
  const overlayOpacity = refreshing ? 1 : Math.min(0.96, progress * 1.08);
  const scale = refreshing ? 1 : 0.94 + progress * 0.06;

  return (
    <div
      aria-hidden={!visible}
      className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-200"
      style={{ opacity: visible ? overlayOpacity : 0 }}
    >
      <style>{`
        @keyframes oracle-grain {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          60% { transform: translate(-0.5%, -0.5%); }
          80% { transform: translate(0.5%, 1%); }
          100% { transform: translate(0, 0); }
        }
        @keyframes oracle-breath {
          0%, 100% { transform: scale(0.92); opacity: 0.32; }
          44%, 62% { transform: scale(1.04); opacity: 0.9; }
        }
        @keyframes oracle-turn {
          0% { transform: rotate(0deg) scale(0.95); opacity: 0.12; }
          42% { transform: rotate(84deg) scale(1.18); opacity: 0.62; }
          68% { transform: rotate(120deg) scale(0.92); opacity: 0.42; }
          100% { transform: rotate(180deg) scale(0.95); opacity: 0.12; }
        }
        @keyframes oracle-focus {
          0%, 100% { filter: blur(5px); transform: scale(0.65); opacity: 0.2; }
          48%, 66% { filter: blur(0); transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% -8%, rgba(216,191,120,0.09), transparent 34%), radial-gradient(circle at 88% 12%, rgba(244,237,224,0.045), transparent 28%), radial-gradient(circle at 15% 100%, rgba(181,154,91,0.07), transparent 38%), #080705',
        }}
      />
      <div
        className="absolute inset-[-20%] mix-blend-screen opacity-[0.11]"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at 23% 31%, rgba(255,255,255,0.045) 0 1px, transparent 1px 5px)',
          animation: 'oracle-grain 8s steps(8) infinite',
        }}
      />

      <main
        className="relative flex min-h-full w-full items-center justify-center overflow-hidden border border-[#d8bf78]/[0.18] bg-[#0e0b09]/75"
        style={{
          transform: `scale(${scale}) translateY(${refreshing ? 0 : Math.max(-18, -22 + progress * 22)}px)`,
          backgroundImage: 'linear-gradient(145deg, rgba(244,237,224,0.045), transparent 43%)',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(181,154,91,0.10),transparent_42%),linear-gradient(180deg,transparent,rgba(0,0,0,0.14))]" />

        <div className="relative z-10 px-6 py-10 text-center">
          <div className="relative mx-auto grid h-[230px] w-[230px] place-items-center rounded-full sm:h-[270px] sm:w-[270px]">
            <div className="absolute inset-0 rounded-full border border-[#d8bf78]/[0.14]" style={{ animation: 'oracle-breath 5.6s ease-in-out infinite' }}>
              <div className="absolute inset-5 rounded-full border border-[#d8bf78]/[0.08]" />
            </div>
            {[0, 30, 60, 90].map((rotation, index) => (
              <div
                key={rotation}
                className="absolute h-[92px] w-[92px] rounded-full border border-[#d8bf78]/[0.16]"
                style={{
                  clipPath: 'polygon(50% 0%,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0% 50%,38% 38%)',
                  animation: `oracle-turn 5.6s cubic-bezier(0.19, 1, 0.22, 1) infinite`,
                  animationDelay: `${index * 0.08}s`,
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            ))}
            <div
              className="relative z-10 h-[54px] w-[54px] rounded-full border border-[#d8bf78]/40 bg-[radial-gradient(circle,rgba(216,191,120,0.22),transparent_66%)]"
              style={{ animation: 'oracle-focus 5.6s cubic-bezier(0.19, 1, 0.22, 1) infinite' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
