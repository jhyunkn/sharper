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
    <nav className={`${positionClass} bottom-0 left-0 right-0 z-50 flex justify-around items-center py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-[#12110d]/92 backdrop-blur-md border-t border-[#29261f] shadow-[0_-12px_36px_rgba(0,0,0,0.22)]`}>
      {tabs.map(({ href, Icon, label }) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={`flex flex-col items-center gap-1.5 transition-colors duration-200 ${
              active ? 'text-[#c9a96e]' : 'text-[#8f8676]'
            }`}
          >
            <Icon size={19} strokeWidth={active ? 2 : 1.7} />
            <span className="text-[9px] tracking-[0.15em] uppercase">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
