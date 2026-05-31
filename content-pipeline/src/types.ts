export interface SpecimenCard {
  id: string;
  text: string;
  author: string;
  author_title: string;
  domain: string;
  sub_domain?: string;
  era?: string;
  source?: string;
  themes: string[];
  archetype_affinity: string[];
  language_origin?: string;
  quality_score: number;
}

export interface GenerationResult {
  authorId: string;
  cards: SpecimenCard[];
  error?: string;
}

export interface GenerateCardsResponse {
  cards: Array<{
    text: string;
    source?: string;
    themes: string[];
    archetypeAffinity: string[];
    languageOrigin?: string;
  }>;
}
