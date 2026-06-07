'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Compass, Bookmark, User } from 'lucide-react';

const tabs = [
  { href: '/feed', Icon: Compass, label: 'Discover' },
  { href: '/saved', Icon: Bookmark, label: 'Saved' },
  { href: '/profile', Icon: User, label: 'Profile' },
];

export default function BottomNav({ docked = false }: { docked?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const positionClass = docked ? 'absolute' : 'fixed';

  return (
    <nav className={`${positionClass} bottom-0 left-0 right-0 z-50 flex justify-around items-center py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-[#080808]/90 backdrop-blur-sm border-t border-[#1e1e1e]`}>
      {tabs.map(({ href, Icon, label }) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={`flex flex-col items-center gap-1.5 transition-colors duration-200 ${
              active ? 'text-[#c9a96e]' : 'text-[#444]'
            }`}
          >
            <Icon size={18} strokeWidth={active ? 2 : 1.5} />
            <span className="text-[9px] tracking-[0.15em] uppercase">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
