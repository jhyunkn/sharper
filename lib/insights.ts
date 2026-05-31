import { UserInsight } from './types';

interface InsightInput {
  archetype: string;
  topThemes: string[];
  topDomains: string[];
  topAuthors: string[];
  savedCount: number;
  name: string;
}

type InsightDef = { signal: string; mindset: string; dos: string[]; donts: string[] };

const matrix: Record<string, InsightDef> = {
  'sage:resilience': {
    signal: 'A mind testing its own foundations',
    mindset: 'Your saves tell a story of a mind stress-testing itself. You keep returning to thinkers who found clarity not by avoiding difficulty but by walking straight through it. The resilience thread in your archive is not accidental — something in your life is asking for that quality right now.',
    dos: ['Sit with one hard question today — write a single sentence answer', 'Reread something you saved weeks ago — you are different now', 'Speak one truth today that you have been softening'],
    donts: ["Don't consume more input — you have enough to work with", "Don't confuse knowing about an idea with having lived it", "Don't mistake silence for agreement"],
  },
  'sage:self-knowledge': {
    signal: 'Turning the lens inward',
    mindset: 'You have been drawn to philosophy and psychology — the disciplines that ask you to look at yourself honestly. The self-knowledge thread in your saves is what you are actively developing. The thinkers you follow share a particular ruthlessness about truth. That quality is contagious.',
    dos: ['Journal for 10 minutes without editing', 'Ask someone you trust for one piece of honest feedback', 'Notice the gap between what you say you value and what you actually do'],
    donts: ["Don't let introspection become avoidance of action", "Don't mistake analysis for change", "Don't be harder on yourself than your saved thinkers were on themselves"],
  },
  'sage:wisdom': {
    signal: 'The signal beneath the noise',
    mindset: 'Your archive moves slowly and deliberately. You are not chasing ideas — you are building something. The wisdom thread in your saves points to someone who reads to understand, not to impress. That is a rarer quality than it sounds.',
    dos: ['Read one thing slowly today — full attention, no skimming', 'Teach one idea from your archive to someone else', 'Sit with ambiguity for 20 minutes before resolving it'],
    donts: ["Don't confuse knowing with understanding", "Don't rush toward conclusions in conversations", "Don't mistake complexity for depth"],
  },
  'sage:truth': {
    signal: 'Precision in a world of noise',
    mindset: 'The truth thread running through your saves is not abstract philosophy — it is a lived commitment to saying what you actually mean. The thinkers in your archive all paid a price for that commitment. You are taking notes.',
    dos: ['Say the precise thing rather than the comfortable thing today', 'Find one belief you hold and interrogate it seriously', 'Notice where you perform certainty you do not feel'],
    donts: ["Don't weaponize truth — there is a difference between honest and harsh", "Don't let perfect clarity become an excuse for inaction", "Don't mistake skepticism for wisdom"],
  },
  'rebel:freedom': {
    signal: 'Pressure building toward release',
    mindset: 'Your saves are full of boundary-breakers — thinkers who refused the terms given to them. The freedom thread in your archive suggests something in your current situation feels constraining. That tension is not a problem. It is information about what you actually need.',
    dos: ['Identify one rule you follow out of habit rather than conviction', 'Do one thing today entirely on your own terms', 'Name the constraint clearly before deciding whether to push against it'],
    donts: ["Don't confuse disruption with direction — have a reason, not just a reaction", "Don't burn something down just because you can", "Don't mistake exhaustion for freedom"],
  },
  'rebel:authenticity': {
    signal: 'Refusing to be a copy',
    mindset: 'Voices that chose themselves over the comfort of fitting in keep appearing in your archive. Your themes point to someone in the middle of a real clarification — what do you actually believe versus what you inherited? That is not a comfortable question. It is the right one.',
    dos: ['Say no to one thing today that you would normally say yes to out of obligation', 'Write down three things you believe that most people around you do not', 'Act from one of them before the day ends'],
    donts: ["Don't perform rebellion — that is just another costume", "Don't mistake being different for being right", "Don't let contrarianism replace genuine thinking"],
  },
  'rebel:change': {
    signal: 'The existing order is not the only order',
    mindset: 'The change and disruption threads in your archive reflect a mind that sees the world as improvable — not just broken, but specifically fixable in ways others have not imagined yet. The thinkers you follow are architects of new possibilities, not just critics of old ones.',
    dos: ['Propose one concrete alternative to something that frustrates you', 'Find the person in your life most resistant to change and try to understand them', 'Build something instead of just critiquing today'],
    donts: ["Don't let righteous anger substitute for effective action", "Don't confuse novelty with improvement", "Don't underestimate the cost of what you want to change"],
  },
  'hero:resilience': {
    signal: 'Forging, not finding',
    mindset: 'Your archive has the shape of someone who believes character is made, not discovered. The thinkers you follow wrote from the middle of difficulty, not the other side of it. The resilience pattern in your saves is not nostalgia. It is preparation for something.',
    dos: ['Do the one hard thing you have been postponing', 'Find one place today where you can push 10% further', 'At the end of the day, ask: did I earn it?'],
    donts: ["Don't confuse busyness with progress", "Don't skip recovery — the Stoics rested too", "Don't let the pursuit of strength make you brittle"],
  },
  'hero:mastery': {
    signal: 'The long game is the only game',
    mindset: 'You keep saving thinkers obsessed with craft. The mastery thread in your archive is not ambition in the ordinary sense — it is devotion. You are someone who wants to be genuinely good at something, not just recognized for it. That distinction is everything.',
    dos: ['Practice something today without any audience', 'Measure your progress against your past self, not others', 'Identify what will matter in ten years and do that first'],
    donts: ["Don't let perfectionism stop the work from existing", "Don't optimize so much that you stop creating", "Don't mistake credentials for capability"],
  },
  'hero:courage': {
    signal: 'Courage is a daily practice',
    mindset: 'The courage thread in your saves is not about dramatic moments — it is about the small choices that compound. The thinkers in your archive all understood that bravery is mostly unglamorous. It is doing the right thing when no one is watching and there is no obvious reward.',
    dos: ['Do one thing today that makes you slightly uncomfortable', 'Speak up in a situation where you would normally stay quiet', 'Acknowledge a fear out loud — naming it reduces its power'],
    donts: ["Don't confuse recklessness with courage", "Don't let the fear of imperfection stop you from beginning", "Don't wait to feel ready — readiness is a myth"],
  },
  'explorer:freedom': {
    signal: 'The map is not the territory — go off it',
    mindset: 'Your archive moves across domains because your mind refuses to stay in one room. The thinkers you keep saving all left, in one way or another. That restlessness in you is not a flaw. It is a mode of knowing that most people never develop.',
    dos: ['Follow one idea today wherever it leads, without a destination', 'Talk to someone from a completely different world', 'Say yes to something you have no obvious reason to do'],
    donts: ["Don't mistake movement for meaning — sometimes stillness finds what motion misses", "Don't leave every time things get hard", "Don't confuse novelty with depth"],
  },
  'explorer:curiosity': {
    signal: 'Wide before deep today',
    mindset: 'You have been grazing across multiple domains — the pattern of a mind that collects signal before committing to meaning. The thinkers in your archive are all generalists at heart. Today belongs to that instinct. Follow the threads without forcing them to connect yet.',
    dos: ['Follow one rabbit hole completely — give it two uninterrupted hours', 'Connect two ideas from completely different fields in your saves', 'Ask a question out loud that you do not know the answer to'],
    donts: ["Don't force conclusions — the pattern will emerge", "Don't apologize for not specializing", "Don't let the breadth become avoidance of depth forever"],
  },
  'explorer:discovery': {
    signal: 'Something new is waiting to be found',
    mindset: 'The discovery thread in your archive is not intellectual tourism — it is a genuine appetite for how the world actually works. You save things that surprise you. That is a better filter than most people use. Keep trusting it.',
    dos: ['Read something outside every domain you know today', 'Ask a stupid question — the ones you are embarrassed to ask', 'Document what surprised you today, not what confirmed what you knew'],
    donts: ["Don't let expertise calcify into certainty", "Don't dismiss what you do not immediately understand", "Don't confuse familiarity with knowledge"],
  },
  'creator:creation': {
    signal: 'The idea wants to be made',
    mindset: 'Your archive is a sketchbook. The creators in your saves all believed the work was the point, not the recognition. The themes running through your saves are not observations — they are a brief for something you have not made yet. The materials are already in your hands.',
    dos: ['Make something today — even a rough, private version', 'Protect two uninterrupted hours of creative time', 'Share one thing you made with someone who will be honest'],
    donts: ["Don't wait for the right conditions — they never arrive", "Don't consume more until you make something with what you have", "Don't confuse planning with creating"],
  },
  'creator:imagination': {
    signal: 'The blueprint is already in your archive',
    mindset: 'You save differently than most people. You are not collecting wisdom to apply later — you are reverse-engineering how great things get made. The imagination thread in your saves is your medium. You already know what you want to build. The obstacle is beginning.',
    dos: ['Sketch the thing you keep postponing — even badly', 'Steal one technique from something you saved and apply it today', 'Name the project out loud, to yourself'],
    donts: ["Don't let admiration substitute for execution", "Don't wait to know enough — you never will", "Don't make your process more interesting than your output"],
  },
  'creator:beauty': {
    signal: 'Form is also content',
    mindset: 'The beauty thread in your archive is not aesthetic preference — it is a way of knowing. You understand that how something is made changes what it means. That sensitivity is a tool, not a luxury. The thinkers and artists you follow all knew this.',
    dos: ['Notice one beautiful thing today and describe it precisely', 'Let your taste guide one decision you would normally make analytically', 'Find the ugliest part of your current work and improve it'],
    donts: ["Don't apologize for caring about how things look and feel", "Don't let beauty become escapism", "Don't treat craft as secondary to concept"],
  },
  'lover:connection': {
    signal: 'Depth over surface today',
    mindset: 'Your archive returns again and again to voices that wrote about human experience as something worth taking seriously. The connection thread in your saves is a kind of emotional cartography — you are mapping what it means to be genuinely close to another person.',
    dos: ['Tell one person something true about how you feel about them', 'Listen today without preparing your response', 'Let something be beautiful without needing to explain it'],
    donts: ["Don't mistake intensity for intimacy", "Don't let the archive substitute for the relationship", "Don't perform feeling — just have it"],
  },
  'lover:love': {
    signal: 'Love is a practice, not a feeling',
    mindset: 'The love thread in your archive points to someone who has thought seriously about what it means to care for another person well. The thinkers you follow all understood that love is something you do, not something that happens to you. That is a harder and more beautiful thing.',
    dos: ['Do one concrete act of care for someone today', 'Tell someone what you love about them specifically', 'Show up to one relationship with full attention today'],
    donts: ["Don't let affection become a substitute for presence", "Don't confuse neediness with depth", "Don't take the people you love most for granted"],
  },
  'lover:beauty': {
    signal: 'Beauty is not decoration — it is information',
    mindset: 'The art and beauty threads in your archive are not aesthetic preference — they are a way of knowing. The thinkers and creators you follow all paid attention to what moves us and why. That attention is a capacity. You are building it deliberately.',
    dos: ['Find one beautiful thing today and stay with it longer than feels comfortable', 'Describe something you love to someone who has never seen it', 'Let your aesthetic sense guide one practical decision today'],
    donts: ["Don't apologize for caring about how things feel", "Don't let beauty become escapism", "Don't treat aesthetics as shallow — form shapes thought"],
  },
  'caregiver:connection': {
    signal: 'Your depth of care is a form of intelligence',
    mindset: 'Your archive leans toward thinkers who believed that how we treat each other is the central question. The connection thread in your saves is not sentiment — it is a theory of what actually matters. You have been quietly building a philosophy of care.',
    dos: ['Do one thing for someone today with no expectation of return', 'Check in with someone you have been meaning to reach', 'Let yourself receive care as easily as you give it'],
    donts: ["Don't exhaust yourself trying to hold everyone", "Don't confuse self-sacrifice with generosity — they are different", "Don't mistake activity for care"],
  },
  'caregiver:empathy': {
    signal: 'Feeling with, not just feeling for',
    mindset: 'The empathy thread in your saves points to someone developing real skill at understanding other people from the inside. That is not a soft skill — it is one of the most demanding forms of intelligence there is. The thinkers in your archive all knew this.',
    dos: ['Before responding to someone today, summarize what they said back to them', 'Ask one person what they are finding hard right now — then just listen', 'Notice when you are projecting your own feelings onto someone else'],
    donts: ["Don't lose yourself in others' experiences", "Don't confuse understanding someone with agreeing with them", "Don't let empathy become a performance"],
  },
  'mystic:depth': {
    signal: 'Something beneath the surface is asking for attention',
    mindset: 'Your archive moves through multiple domains but the real thread is underneath — depth, meaning, the themes that do not resolve. The thinkers you follow all sat with the unspeakable and found words for it anyway. You are doing the same thing.',
    dos: ['Spend twenty minutes in complete silence today — no input', 'Write about something you cannot fully explain', 'Follow the thing that makes no rational sense but feels necessary'],
    donts: ["Don't force meaning onto what wants to stay mysterious", "Don't let the inner life substitute for engagement with the outer world", "Don't mistake obscurity for depth"],
  },
  'mystic:meaning': {
    signal: 'The questions are the practice',
    mindset: 'You have been saving voices that refused easy answers. The meaning thread in your archive suggests you are in a genuine search, not a casual browse. Something real is being worked out in what you choose to keep. Trust that process — it is doing more work than you know.',
    dos: ['Sit with one unanswered question today without trying to resolve it', 'Find the question beneath the question you are currently asking', 'Trust what your saves are pointing toward — even if you cannot articulate it'],
    donts: ["Don't let the search become the destination", "Don't dismiss practical action while waiting for clarity", "Don't perform seeking — actually seek"],
  },
  'mystic:spirituality': {
    signal: 'The sacred is in the ordinary',
    mindset: 'The spirituality thread in your archive is not about belief systems — it is about the quality of attention you bring to being alive. The mystics and teachers in your saves all pointed to the same thing: the extraordinary is available in the most ordinary moments.',
    dos: ['Do one mundane thing today with complete attention', 'Find the sacred in something you usually rush past', 'Sit with gratitude for one specific thing — not in general, but precisely'],
    donts: ["Don't let spiritual ideas float above your actual life", "Don't use the transcendent to avoid the immediate", "Don't mistake ritual for practice"],
  },
};

function getBestMatch(archetype: string, themes: string[]): InsightDef {
  // Try archetype:theme combinations from most to least specific
  for (const theme of themes) {
    const key = `${archetype}:${theme}`;
    if (matrix[key]) return matrix[key];
  }

  // Archetype-only fallbacks
  const fallbacks: Record<string, InsightDef> = {
    sage: matrix['sage:self-knowledge'],
    rebel: matrix['rebel:authenticity'],
    hero: matrix['hero:resilience'],
    explorer: matrix['explorer:curiosity'],
    creator: matrix['creator:creation'],
    lover: matrix['lover:connection'],
    caregiver: matrix['caregiver:connection'],
    mystic: matrix['mystic:depth'],
    // handle legacy archetypes from old sharper
    stoic: matrix['hero:resilience'],
    philosopher: matrix['sage:self-knowledge'],
  };

  return fallbacks[archetype] || {
    signal: 'A mind in motion',
    mindset: 'Your archive reflects a pattern of serious engagement with ideas that matter. The thinkers you follow share a refusal to take the surface at face value. Trust that instinct.',
    dos: ['Read something slowly today — one page, fully present', 'Act on one idea from your saved archive', 'Have a real conversation about something that matters'],
    donts: ["Don't confuse consumption with growth", "Don't wait for the perfect moment", "Don't be a stranger to yourself"],
  };
}

export function generateInsightFromProfile(
  archetype: string,
  savedThemes: string[],
  savedDomains: string[],
  savedAuthors: string[],
  name: string
): UserInsight {
  const match = getBestMatch(archetype, savedThemes);

  // Personalise the mindset with real author names if available
  let mindset = match.mindset;
  if (savedAuthors.length >= 2) {
    mindset = mindset.replace(
      'The thinkers you follow',
      `${savedAuthors[0]} and ${savedAuthors[1]}`
    ).replace(
      'The thinkers in your archive',
      `${savedAuthors[0]} and ${savedAuthors[1]}`
    ).replace(
      'voices that',
      `${savedAuthors[0]}, whose work`
    );
  } else if (savedAuthors.length === 1) {
    mindset = mindset.replace('The thinkers you follow', savedAuthors[0]);
  }

  return {
    signal: match.signal,
    mindset,
    dos: match.dos,
    donts: match.donts,
    generatedAt: new Date().toISOString(),
  };
}
