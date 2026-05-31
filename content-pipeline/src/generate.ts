import Anthropic from '@anthropic-ai/sdk';
import { AuthorSeed } from './authors';
import { GenerationResult, SpecimenCard } from './types';
import { createId } from './utils';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ARCHETYPES = ['sage', 'explorer', 'creator', 'caregiver', 'rebel', 'lover', 'hero', 'mystic'];

const SYSTEM_PROMPT = `You are a curator of human wisdom. Your task is to generate specimen cards — concise, profound quotes or statements from notable thinkers, artists, scientists, leaders, and creators across all of human history.

Each specimen card must:
- Contain an AUTHENTIC quote or close paraphrase from the person (never invent quotes)
- Be concise: 1-4 sentences maximum
- Be genuinely insightful and thought-provoking
- Have clear thematic relevance
- Be appropriate for a learning/reflection app

For archetype affinity, classify which of these 8 Jungian archetypes the quote resonates with most:
sage (seeks truth/wisdom), explorer (seeks freedom/discovery), creator (seeks to make/imagine), caregiver (seeks to help/nurture), rebel (seeks to disrupt/challenge), lover (seeks beauty/connection), hero (seeks mastery/courage), mystic (seeks transcendence/depth)

Always return valid JSON only.`;

export async function generateCardsForAuthor(
  author: AuthorSeed,
  count = 8
): Promise<GenerationResult> {
  const prompt = `Generate exactly ${count} specimen cards for ${author.name} (${author.title}, ${author.era} era${author.nationality ? `, ${author.nationality}` : ''}).

Return a JSON object with this exact shape:
{
  "cards": [
    {
      "text": "the exact quote or close paraphrase",
      "source": "book/work/speech title if known, otherwise omit",
      "themes": ["theme1", "theme2", "theme3"],
      "archetypeAffinity": ["archetype1", "archetype2"],
      "languageOrigin": "original language if non-English, otherwise omit"
    }
  ]
}

Rules:
- Only include quotes you are confident are real or closely paraphrased
- themes: 2-4 lowercase single-word or hyphenated-phrase tags (e.g. "resilience", "self-knowledge", "time")
- archetypeAffinity: 1-3 values from [${ARCHETYPES.join(', ')}]
- Do not include the author name in the text field
- Return ONLY the JSON, no other text`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = JSON.parse(raw.trim());

    const cards: SpecimenCard[] = parsed.cards.map(
      (c: {
        text: string;
        source?: string;
        themes: string[];
        archetypeAffinity: string[];
        languageOrigin?: string;
      }) => ({
        id: createId(author.id, c.text),
        text: c.text,
        author: author.name,
        author_title: author.title,
        domain: author.domain,
        sub_domain: author.subDomain,
        era: author.era,
        source: c.source,
        themes: c.themes || [],
        archetype_affinity: (c.archetypeAffinity || author.archetypes).filter((a: string) =>
          ARCHETYPES.includes(a)
        ),
        language_origin: c.languageOrigin,
        quality_score: 0,
      })
    );

    return { authorId: author.id, cards };
  } catch (err) {
    return {
      authorId: author.id,
      cards: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function generateBatch(
  authors: AuthorSeed[],
  onProgress?: (done: number, total: number, authorId: string) => void
): Promise<GenerationResult[]> {
  const results: GenerationResult[] = [];

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    const result = await generateCardsForAuthor(author);
    results.push(result);
    onProgress?.(i + 1, authors.length, author.id);

    // Respect rate limits — Haiku is fast, small pause between calls
    await new Promise((r) => setTimeout(r, 300));
  }

  return results;
}
