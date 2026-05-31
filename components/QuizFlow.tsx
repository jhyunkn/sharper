'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { questions, calculateArchetype } from '@/lib/quiz';

export default function QuizFlow() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [direction, setDirection] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);

  const question = questions[current];
  const progress = current / questions.length;

  const handleSelect = (archetypes: string[], idx: number) => {
    setSelected(idx);
    const newAnswers = [...answers, archetypes];

    setTimeout(() => {
      setSelected(null);
      if (current === questions.length - 1) {
        const archetypeId = calculateArchetype(newAnswers);
        sessionStorage.setItem('quiz_archetype', archetypeId);
        router.push('/reveal');
      } else {
        setDirection(1);
        setAnswers(newAnswers);
        setCurrent((c) => c + 1);
      }
    }, 280);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10">
      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between mb-12">
        <p className="text-[10px] tracking-[0.3em] text-[#333] uppercase">imprint</p>
        <p className="text-[10px] text-[#333]">
          {current + 1} <span className="text-[#222]">/</span> {questions.length}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm h-px bg-[#1a1a1a] mb-12 relative overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-[#c9a96e]"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-sm">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-8"
          >
            <h2 className="font-serif text-2xl text-[#f5f0e8] leading-snug">
              {question.question}
            </h2>

            <div className="space-y-2.5">
              {question.options.map((option, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(option.archetypes, i)}
                  animate={
                    selected === i
                      ? { borderColor: '#c9a96e', color: '#f5f0e8', backgroundColor: '#c9a96e10' }
                      : {}
                  }
                  className="w-full text-left px-5 py-4 border border-[#1e1e1e] text-[#666] text-sm leading-relaxed hover:border-[#333] hover:text-[#aaa] transition-all duration-150 cursor-pointer"
                >
                  {option.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer dots */}
      <div className="flex gap-1.5 mt-10">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < current
                ? 'w-4 h-0.5 bg-[#c9a96e]'
                : i === current
                  ? 'w-2 h-0.5 bg-[#c9a96e]/50'
                  : 'w-1 h-0.5 bg-[#222]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
