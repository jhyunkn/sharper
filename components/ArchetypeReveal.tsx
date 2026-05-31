'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getArchetype } from '@/lib/archetypes';
import { saveProfile } from '@/lib/storage';
import StarField from './StarField';

export default function ArchetypeReveal() {
  const router = useRouter();
  const [archetypeId, setArchetypeId] = useState('');
  const [name, setName] = useState('');
  const [phase, setPhase] = useState<'name' | 'reveal'>('name');

  useEffect(() => {
    const id = sessionStorage.getItem('quiz_archetype') || 'sage';
    setArchetypeId(id);
  }, []);

  const archetype = getArchetype(archetypeId);

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !archetype) return;
    saveProfile({
      id: crypto.randomUUID(),
      name: name.trim(),
      archetypeId,
      savedQuoteIds: [],
      viewedQuoteIds: [],
      createdAt: Date.now(),
    });
    setPhase('reveal');
  };

  if (!archetype) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <StarField />

      <AnimatePresence mode="wait">
        {phase === 'name' ? (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-xs space-y-10 text-center"
          >
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.35em] text-[#444] uppercase">
                Your archetype is ready
              </p>
              <h2 className="font-serif text-3xl text-[#f5f0e8]">What shall we call you?</h2>
            </div>

            <form onSubmit={handleSubmitName} className="space-y-8">
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoFocus
                  maxLength={30}
                  className="w-full bg-transparent border-b border-[#222] text-[#f5f0e8] text-center text-xl py-3 outline-none placeholder-[#333] focus:border-[#c9a96e] transition-colors duration-300"
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-10 py-3.5 border border-[#c9a96e]/60 text-[#c9a96e] text-xs tracking-[0.25em] uppercase disabled:opacity-20 disabled:pointer-events-none hover:bg-[#c9a96e] hover:text-[#080808] transition-all duration-300"
              >
                Reveal
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-xs space-y-10 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div>
                <p className="text-[10px] tracking-[0.35em] text-[#444] uppercase mb-4">
                  {name}, you are
                </p>
                <p className="text-5xl mb-3" style={{ color: archetype.color }}>
                  {archetype.symbol}
                </p>
                <h1 className="font-serif text-4xl text-[#f5f0e8] mb-1">{archetype.name}</h1>
                <p className="text-sm text-[#666] italic">{archetype.tagline}</p>
              </div>

              <div className="w-8 h-px bg-[#222] mx-auto" />

              <p className="text-sm text-[#888] leading-relaxed">{archetype.description}</p>

              <div className="flex flex-wrap gap-2 justify-center">
                {archetype.traits.map((trait) => (
                  <span key={trait} className="text-[10px] border border-[#222] text-[#555] px-3 py-1 tracking-wider uppercase">
                    {trait}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <button
                onClick={() => router.push('/feed')}
                className="px-10 py-3.5 border border-[#c9a96e]/60 text-[#c9a96e] text-xs tracking-[0.25em] uppercase hover:bg-[#c9a96e] hover:text-[#080808] transition-all duration-300"
              >
                Enter
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
