export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  description: string;
  symbol: string;
  color: string;
  thinkers: string[];
  traits: string[];
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  authorTitle: string;
  category: 'philosophy' | 'psychology' | 'art' | 'architecture' | 'literature';
  themes: string[];
  archetypeAffinity: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  text: string;
  archetypes: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  archetypeId: string;
  savedQuoteIds: string[];
  viewedQuoteIds: string[];
  createdAt: number;
}

export interface UserInsight {
  signal: string;
  mindset: string;
  dos: string[];
  donts: string[];
  generatedAt: string;
}
