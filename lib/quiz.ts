import { QuizQuestion } from './types';

export const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'When you feel lost, you tend to…',
    options: [
      { text: 'Seek out books, teachers, or wisdom', archetypes: ['sage', 'mystic'] },
      { text: 'Start moving — go somewhere new', archetypes: ['explorer', 'hero'] },
      { text: 'Create something to make sense of it', archetypes: ['creator', 'rebel'] },
      { text: 'Reach out to someone you love', archetypes: ['caregiver', 'lover'] },
    ],
  },
  {
    id: 2,
    question: "You're most drawn to stories about…",
    options: [
      { text: 'Seekers of hidden truth and knowledge', archetypes: ['sage', 'mystic'] },
      { text: 'Rebels who challenge everything', archetypes: ['rebel', 'hero'] },
      { text: 'Artists and builders who shape worlds', archetypes: ['creator', 'explorer'] },
      { text: 'Deep, transformative connections', archetypes: ['lover', 'caregiver'] },
    ],
  },
  {
    id: 3,
    question: 'What frustrates you most?',
    options: [
      { text: 'Ignorance and shallow thinking', archetypes: ['sage', 'creator'] },
      { text: 'Feeling trapped or controlled', archetypes: ['explorer', 'rebel'] },
      { text: 'Mediocrity and lack of ambition', archetypes: ['hero', 'creator'] },
      { text: 'Coldness and disconnection', archetypes: ['caregiver', 'lover'] },
    ],
  },
  {
    id: 4,
    question: 'Your deepest fear is…',
    options: [
      { text: 'Never finding the truth', archetypes: ['sage', 'mystic'] },
      { text: "Living someone else's life", archetypes: ['explorer', 'rebel'] },
      { text: 'Leaving nothing behind', archetypes: ['creator', 'hero'] },
      { text: 'Ending up alone', archetypes: ['lover', 'caregiver'] },
    ],
  },
  {
    id: 5,
    question: 'When you see injustice, you…',
    options: [
      { text: 'Try to understand its root causes', archetypes: ['sage', 'mystic'] },
      { text: 'Speak out and take direct action', archetypes: ['rebel', 'hero'] },
      { text: 'Channel it into creative work', archetypes: ['creator', 'rebel'] },
      { text: 'Support and protect those affected', archetypes: ['caregiver', 'lover'] },
    ],
  },
  {
    id: 6,
    question: 'You find beauty in…',
    options: [
      { text: 'The precision of ideas and systems', archetypes: ['sage', 'creator'] },
      { text: 'Wild, untamed nature and open space', archetypes: ['explorer', 'mystic'] },
      { text: 'Things made with intention and craft', archetypes: ['creator', 'hero'] },
      { text: 'Human vulnerability and connection', archetypes: ['lover', 'caregiver'] },
    ],
  },
  {
    id: 7,
    question: 'At your core, you believe…',
    options: [
      { text: 'Understanding is the highest form of freedom', archetypes: ['sage', 'mystic'] },
      { text: 'You only live once — live fully', archetypes: ['explorer', 'lover'] },
      { text: 'You are what you make', archetypes: ['creator', 'hero'] },
      { text: 'We are responsible for each other', archetypes: ['caregiver', 'rebel'] },
    ],
  },
];

export function calculateArchetype(answers: string[][]): string {
  const scores: Record<string, number> = {};
  for (const archetypes of answers) {
    for (const a of archetypes) {
      scores[a] = (scores[a] || 0) + 1;
    }
  }
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'sage';
}
