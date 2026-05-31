import { Archetype } from './types';

export const archetypes: Archetype[] = [
  {
    id: 'sage',
    name: 'The Sage',
    tagline: 'Truth is the highest virtue.',
    description:
      'You seek understanding above all. Where others see noise, you find signal. Your mind is your compass, and wisdom your north star.',
    symbol: '✦',
    color: '#7B9BCC',
    thinkers: ['Socrates', 'Simone Weil', 'Kant'],
    traits: ['Curious', 'Reflective', 'Principled', 'Patient'],
  },
  {
    id: 'explorer',
    name: 'The Explorer',
    tagline: 'The horizon is a beginning, not an end.',
    description:
      'Boundaries were made for others. You move through life as through unmapped territory — alert, alive, always becoming.',
    symbol: '◎',
    color: '#7BAA8C',
    thinkers: ['Thoreau', 'Rousseau', 'Bruce Chatwin'],
    traits: ['Independent', 'Restless', 'Perceptive', 'Brave'],
  },
  {
    id: 'creator',
    name: 'The Creator',
    tagline: 'Imagination made visible.',
    description:
      'You see the world not as it is, but as it could be. Every blank canvas, empty page, and silent room holds infinite potential.',
    symbol: '△',
    color: '#C9A96E',
    thinkers: ['Leonardo da Vinci', 'Wittgenstein', 'Picasso'],
    traits: ['Visionary', 'Obsessive', 'Original', 'Sensitive'],
  },
  {
    id: 'caregiver',
    name: 'The Caregiver',
    tagline: 'To give is to receive.',
    description:
      'You hold space for others like a steady flame in the dark. Your presence is a gift. Your attention, the rarest form of love.',
    symbol: '○',
    color: '#CC8B8B',
    thinkers: ['Simone Weil', 'Nel Noddings', 'Levinas'],
    traits: ['Empathic', 'Generous', 'Grounded', 'Loyal'],
  },
  {
    id: 'rebel',
    name: 'The Rebel',
    tagline: 'The only way out is through.',
    description:
      "You feel the absurdity of rules made by those who have never questioned them. Your disruption is not destruction — it is devotion.",
    symbol: '✗',
    color: '#CC6B6B',
    thinkers: ['Camus', 'Foucault', 'Simone de Beauvoir'],
    traits: ['Bold', 'Principled', 'Disruptive', 'Authentic'],
  },
  {
    id: 'lover',
    name: 'The Lover',
    tagline: 'Hell and heaven are both other people.',
    description:
      'You live in the full spectrum of feeling. Beauty moves you. Connection sustains you. You have never been afraid of depth.',
    symbol: '❧',
    color: '#A87BAA',
    thinkers: ['Plato', 'Roland Barthes', 'bell hooks'],
    traits: ['Passionate', 'Intuitive', 'Deep', 'Magnetic'],
  },
  {
    id: 'hero',
    name: 'The Hero',
    tagline: 'The obstacle is the way.',
    description:
      'You rise. Not because it is easy, but because rising is what you do. You have learned that character is forged, not found.',
    symbol: '↑',
    color: '#C9A96E',
    thinkers: ['Marcus Aurelius', 'Seneca', 'Epictetus'],
    traits: ['Resilient', 'Disciplined', 'Purposeful', 'Honest'],
  },
  {
    id: 'mystic',
    name: 'The Mystic',
    tagline: 'The map is not the territory.',
    description:
      'You sense what others miss — the numinous beneath the ordinary. You are drawn to thresholds, to in-between places, to the unspeakable.',
    symbol: '☽',
    color: '#8B7BAA',
    thinkers: ['Jung', 'Rumi', 'Simone Weil'],
    traits: ['Perceptive', 'Contemplative', 'Symbolic', 'Ethereal'],
  },
];

export const getArchetype = (id: string) => archetypes.find((a) => a.id === id);
