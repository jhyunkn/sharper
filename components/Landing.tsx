'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getProfile } from '@/lib/storage';
import StarField from './StarField';

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    if (getProfile()) router.replace('/feed');
  }, [router]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-8">
      <StarField />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-10 text-center max-w-xs"
      >
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.4em] text-[#444] uppercase">sharper</p>
          <div className="w-4 h-px bg-[#c9a96e] mx-auto mt-3" />
        </div>

        <div className="space-y-4">
          <h1 className="font-serif text-[2.2rem] leading-[1.2] text-[#f5f0e8]">
            Learn what matters.
            <br />
            <span className="italic text-[#888]">One thought at a time.</span>
          </h1>
          <p className="text-sm text-[#555] leading-relaxed">
            Philosophy. Psychology. Art. Architecture.
            <br />
            The wisdom that shaped the world, distilled for yours.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/quiz')}
          className="px-10 py-3.5 border border-[#c9a96e]/60 text-[#c9a96e] text-xs tracking-[0.25em] uppercase hover:bg-[#c9a96e] hover:text-[#080808] transition-all duration-300"
        >
          Begin
        </motion.button>

        <p className="text-[10px] text-[#333] tracking-wider">
          Discover your archetype
        </p>
      </motion.div>
    </div>
  );
}
