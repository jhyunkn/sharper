/**
 * Copyright audit — classifies all specimen_cards by copyright risk.
 *
 * Risk levels:
 *   safe     — author died before 1928, work clearly public domain
 *   low      — author died 1928-1955, most works public domain
 *   medium   — author died 1956-2000, copyrighted but short quotes defensible
 *   high     — author died after 2000 or living, or song lyrics
 *
 * Cards marked 'high' are set is_active=false and removed from the feed.
 * Cards marked 'medium' are kept but flagged for human review.
 *
 * Usage:
 *   npx tsx copyright-audit.ts             -- audit + apply
 *   npx tsx copyright-audit.ts --report    -- report only, no DB changes
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// ─── AUTHOR REGISTRY ──────────────────────────────────────────────────────────
// death year: null = living, 0 = unknown/ancient (treat as safe)
// sourceType: 'book' | 'speech' | 'interview' | 'social' | 'ancient'
// 'speech' and 'interview' quotes are lower risk than published books

const AUTHOR_DATA: Record<string, { death: number | null; sourceType: string; notes?: string }> = {
  // ANCIENT / MEDIEVAL — safe
  'Socrates':                     { death: -399,  sourceType: 'ancient' },
  'Plato':                        { death: -348,  sourceType: 'ancient' },
  'Aristotle':                    { death: -322,  sourceType: 'ancient' },
  'Epictetus':                    { death: 135,   sourceType: 'ancient' },
  'Marcus Aurelius':              { death: 180,   sourceType: 'ancient' },
  'Seneca':                       { death: 65,    sourceType: 'ancient' },
  'Cicero':                       { death: -43,   sourceType: 'ancient' },
  'Lao Tzu':                      { death: -531,  sourceType: 'ancient' },
  'Confucius':                    { death: -479,  sourceType: 'ancient' },
  'Zhuangzi':                     { death: -286,  sourceType: 'ancient' },
  'Rumi':                         { death: 1273,  sourceType: 'ancient' },
  'Hafez':                        { death: 1390,  sourceType: 'ancient' },
  'Meister Eckhart':              { death: 1328,  sourceType: 'ancient' },

  // PRE-1928 — safe
  'Siddhartha Gautama (The Buddha)': { death: -483, sourceType: 'ancient' },
  'William Shakespeare':          { death: 1616,  sourceType: 'book' },
  'René Descartes':               { death: 1650,  sourceType: 'book' },
  'Blaise Pascal':                { death: 1662,  sourceType: 'book' },
  'Baruch Spinoza':               { death: 1677,  sourceType: 'book' },
  'John Locke':                   { death: 1704,  sourceType: 'book' },
  'Voltaire':                     { death: 1778,  sourceType: 'book' },
  'Jean-Jacques Rousseau':        { death: 1778,  sourceType: 'book' },
  'David Hume':                   { death: 1776,  sourceType: 'book' },
  'Immanuel Kant':                { death: 1804,  sourceType: 'book' },
  'Ludwig van Beethoven':         { death: 1827,  sourceType: 'speech' },
  'John Keats':                   { death: 1821,  sourceType: 'book' },
  'Arthur Schopenhauer':          { death: 1860,  sourceType: 'book' },
  'Søren Kierkegaard':            { death: 1855,  sourceType: 'book' },
  'John Stuart Mill':             { death: 1873,  sourceType: 'book' },
  'Leo Tolstoy':                  { death: 1910,  sourceType: 'book' },
  'Fyodor Dostoevsky':            { death: 1881,  sourceType: 'book' },
  'Mark Twain':                   { death: 1910,  sourceType: 'book' },
  'Oscar Wilde':                  { death: 1900,  sourceType: 'book' },
  'Friedrich Nietzsche':          { death: 1900,  sourceType: 'book' },
  'Anton Chekhov':                { death: 1904,  sourceType: 'book' },
  'Walt Whitman':                 { death: 1892,  sourceType: 'book' },
  'Vincent van Gogh':             { death: 1890,  sourceType: 'book' },
  'William James':                { death: 1910,  sourceType: 'book' },
  'Ada Lovelace':                 { death: 1852,  sourceType: 'book' },
  'Charles Darwin':               { death: 1882,  sourceType: 'book' },
  'Marcus Tullius Cicero':        { death: -43,   sourceType: 'ancient' },
  'Louisa May Alcott':            { death: 1888,  sourceType: 'book' },
  'Louisa May Alcott':            { death: 1888,  sourceType: 'book' },

  // 1928–1955 — low risk
  'Rainer Maria Rilke':           { death: 1926,  sourceType: 'book', notes: 'pre-1928, safe' },
  'Franz Kafka':                  { death: 1924,  sourceType: 'book', notes: 'pre-1928, safe' },
  'Virginia Woolf':               { death: 1941,  sourceType: 'book' },
  'Mahatma Gandhi':               { death: 1948,  sourceType: 'speech' },
  'Frida Kahlo':                  { death: 1954,  sourceType: 'book', notes: 'diary entries — low risk' },
  'Marie Curie':                  { death: 1934,  sourceType: 'speech' },
  'Nikola Tesla':                 { death: 1943,  sourceType: 'speech' },
  'Marcel Proust':                { death: 1922,  sourceType: 'book', notes: 'pre-1928, safe' },
  'James Joyce':                  { death: 1941,  sourceType: 'book' },
  'Sigmund Freud':                { death: 1939,  sourceType: 'book' },
  'Alfred Adler':                 { death: 1937,  sourceType: 'book' },
  'Frank Lloyd Wright':           { death: 1959,  sourceType: 'speech' },
  'Coco Chanel':                  { death: 1971,  sourceType: 'interview' },

  // 1956–2000 — medium risk (keep short quotes only, properly attributed)
  'Albert Camus':                 { death: 1960,  sourceType: 'book' },
  'Jorge Luis Borges':            { death: 1986,  sourceType: 'book' },
  'Vladimir Nabokov':             { death: 1977,  sourceType: 'book' },
  'Jean-Paul Sartre':             { death: 1980,  sourceType: 'book' },
  'Simone de Beauvoir':           { death: 1986,  sourceType: 'book' },
  'Martin Luther King Jr.':       { death: 1968,  sourceType: 'speech', notes: 'estate aggressively enforces — treat as high' },
  'James Baldwin':                { death: 1987,  sourceType: 'book' },
  'Martin Heidegger':             { death: 1976,  sourceType: 'book' },
  'Ludwig Wittgenstein':          { death: 1951,  sourceType: 'book' },
  'Simone Weil':                  { death: 1943,  sourceType: 'book' },
  'Carl Jung':                    { death: 1961,  sourceType: 'book' },
  'Viktor Frankl':                { death: 1997,  sourceType: 'book' },
  'Abraham Maslow':               { death: 1970,  sourceType: 'book' },
  'Erich Fromm':                  { death: 1980,  sourceType: 'book' },
  'Carl Rogers':                  { death: 1987,  sourceType: 'book' },
  'D.W. Winnicott':               { death: 1971,  sourceType: 'book' },
  'Miles Davis':                  { death: 1991,  sourceType: 'interview' },
  'Andy Warhol':                  { death: 1987,  sourceType: 'interview' },
  'John Lennon':                  { death: 1980,  sourceType: 'interview' },
  'Andrei Tarkovsky':             { death: 1986,  sourceType: 'book' },
  'Ingmar Bergman':               { death: 2007,  sourceType: 'interview' },
  'Akira Kurosawa':               { death: 1998,  sourceType: 'interview' },
  'Michel Foucault':              { death: 1984,  sourceType: 'book' },
  'Roland Barthes':               { death: 1980,  sourceType: 'book' },
  'Peter Drucker':                { death: 2005,  sourceType: 'book' },
  'Buckminster Fuller':           { death: 1983,  sourceType: 'speech' },
  'Marshall McLuhan':             { death: 1980,  sourceType: 'book' },
  'Alan Watts':                   { death: 1973,  sourceType: 'speech' },
  'E.E. Cummings':                { death: 1962,  sourceType: 'book' },
  'Sylvia Plath':                 { death: 1963,  sourceType: 'book' },
  'Langston Hughes':              { death: 1967,  sourceType: 'book' },
  'Pablo Neruda':                 { death: 1973,  sourceType: 'book' },
  'W.B. Yeats':                   { death: 1939,  sourceType: 'book' },
  'T.S. Eliot':                   { death: 1965,  sourceType: 'book' },
  'Grace Hopper':                 { death: 1992,  sourceType: 'speech' },
  'Agnes Martin':                 { death: 2004,  sourceType: 'interview' },
  'Sam Cooke':                    { death: 1964,  sourceType: 'book', notes: 'song lyrics — high risk regardless' },
  'Muhammad Ali':                 { death: 2016,  sourceType: 'interview' },
  'Mies van der Rohe':            { death: 1969,  sourceType: 'interview' },
  'Le Corbusier':                 { death: 1965,  sourceType: 'book' },
  'Louis Kahn':                   { death: 1974,  sourceType: 'speech' },
  'Charles Eames':                { death: 1978,  sourceType: 'speech' },
  'Massimo Vignelli':             { death: 2014,  sourceType: 'interview' },
  'Pablo Picasso':                { death: 1973,  sourceType: 'interview' },
  'Georgia O\'Keeffe':            { death: 1986,  sourceType: 'interview' },
  'Patti Smith':                  { death: null,  sourceType: 'interview' },
  'Thomas Merton':                { death: 1968,  sourceType: 'book' },
  'Ram Dass':                     { death: 2019,  sourceType: 'speech' },
  'Krishnamurti':                 { death: 1986,  sourceType: 'speech' },
  'Jiddu Krishnamurti':           { death: 1986,  sourceType: 'speech' },
  'Henri Bergson':                { death: 1941,  sourceType: 'book' },
  'Ursula K. Le Guin':            { death: 2018,  sourceType: 'book' },
  'Octavia Butler':               { death: 2006,  sourceType: 'book' },
  'Toni Morrison':                { death: 2019,  sourceType: 'book' },
  'Maya Angelou':                 { death: 2014,  sourceType: 'book' },
  'bell hooks':                   { death: 2021,  sourceType: 'book' },
  'James Baldwin':                { death: 1987,  sourceType: 'book' },

  // POST-2000 / LIVING — high risk (remove from feed)
  'Stephen Hawking':              { death: 2018,  sourceType: 'book' },
  'Carl Sagan':                   { death: 1996,  sourceType: 'book' },
  'Neil deGrasse Tyson':          { death: null,  sourceType: 'interview' },
  'Steve Jobs':                   { death: 2011,  sourceType: 'speech' },
  'Warren Buffett':               { death: null,  sourceType: 'interview' },
  'Oprah Winfrey':                { death: null,  sourceType: 'interview' },
  'Elon Musk':                    { death: null,  sourceType: 'social' },
  'Simon Sinek':                  { death: null,  sourceType: 'book' },
  'Brené Brown':                  { death: null,  sourceType: 'book' },
  'James Clear':                  { death: null,  sourceType: 'book' },
  'Naval Ravikant':               { death: null,  sourceType: 'social' },
  'Paul Graham':                  { death: null,  sourceType: 'social' },
  'Seth Godin':                   { death: null,  sourceType: 'book' },
  'Cal Newport':                  { death: null,  sourceType: 'book' },
  'Mark Manson':                  { death: null,  sourceType: 'book' },
  'Derek Sivers':                 { death: null,  sourceType: 'social' },
  'Austin Kleon':                 { death: null,  sourceType: 'book' },
  'Elizabeth Gilbert':            { death: null,  sourceType: 'book' },
  'Tim Ferriss':                  { death: null,  sourceType: 'book' },
  'Sheryl Sandberg':              { death: null,  sourceType: 'book' },
  'Indra Nooyi':                  { death: null,  sourceType: 'interview' },
  'Dalai Lama XIV':               { death: null,  sourceType: 'speech' },
  'Thich Nhat Hanh':              { death: 2022,  sourceType: 'book' },
  'Eckhart Tolle':                { death: null,  sourceType: 'book' },
  'Bob Dylan':                    { death: null,  sourceType: 'book', notes: 'lyrics especially risky' },
  'David Bowie':                  { death: 2016,  sourceType: 'interview' },
  'Prince':                       { death: 2016,  sourceType: 'interview' },
  'Nina Simone':                  { death: 2003,  sourceType: 'interview' },
  'John Coltrane':                { death: 1967,  sourceType: 'interview' },
  'Banksy':                       { death: null,  sourceType: 'book' },
  'Yayoi Kusama':                 { death: null,  sourceType: 'interview' },
  'Jean-Michel Basquiat':         { death: 1988,  sourceType: 'interview' },
  'Zaha Hadid':                   { death: 2016,  sourceType: 'interview' },
  'Tadao Ando':                   { death: null,  sourceType: 'interview' },
  'Renzo Piano':                  { death: null,  sourceType: 'interview' },
  'Peter Zumthor':                { death: null,  sourceType: 'interview' },
  'Kengo Kuma':                   { death: null,  sourceType: 'interview' },
  'Roger Federer':                { death: null,  sourceType: 'interview' },
  'Serena Williams':              { death: null,  sourceType: 'interview' },
  'Michael Jordan':               { death: null,  sourceType: 'interview' },
  'Kobe Bryant':                  { death: 2020,  sourceType: 'interview' },
  'Malala Yousafzai':             { death: null,  sourceType: 'speech' },
  'Greta Thunberg':               { death: null,  sourceType: 'speech' },
  'Angela Davis':                 { death: null,  sourceType: 'book' },
  'Nelson Mandela':               { death: 2013,  sourceType: 'speech' },
  'Martin Luther King Jr.':       { death: 1968,  sourceType: 'speech', notes: 'estate aggressively enforces' },
  'Agnes Varda':                  { death: 2019,  sourceType: 'interview' },
  'Wong Kar-wai':                 { death: null,  sourceType: 'interview' },
  'Stanley Kubrick':              { death: 1999,  sourceType: 'interview' },
  'William James':                { death: 1910,  sourceType: 'book' },
  'Daniel Kahneman':              { death: 2024,  sourceType: 'book' },
  'Jordan Peterson':              { death: null,  sourceType: 'book' },
  'Mihaly Csikszentmihalyi':      { death: 2021,  sourceType: 'book' },
  'Hans Christian Andersen':      { death: 1875,  sourceType: 'book' },
  'Ray Charles':                  { death: 2004,  sourceType: 'interview' },
  'Bono':                         { death: null,  sourceType: 'interview' },
  'Douglas Adams':                { death: 2001,  sourceType: 'book' },
  'Stephen King':                 { death: null,  sourceType: 'book' },
  'Tim Berners-Lee':              { death: null,  sourceType: 'speech' },
  'Stewart Brand':                { death: null,  sourceType: 'book' },
  'Mary Oliver':                  { death: 2019,  sourceType: 'book' },
  'George Carlin':                { death: 2008,  sourceType: 'speech' },
  'Joan Rivers':                  { death: 2014,  sourceType: 'speech' },
  'Patti Smith':                  { death: null,  sourceType: 'book' },
  'William James':                { death: 1910,  sourceType: 'book' },
};

function classifyRisk(author: string, sourceType: string, notes?: string): {
  risk: 'safe' | 'low' | 'medium' | 'high';
  deathYear: number | null;
  reason: string;
} {
  const data = AUTHOR_DATA[author];

  // Special cases
  if (notes?.includes('aggressively enforces')) {
    return { risk: 'high', deathYear: data?.death ?? null, reason: 'Estate aggressively enforces copyright' };
  }
  if (notes?.includes('song lyrics') || sourceType === 'lyrics') {
    return { risk: 'high', deathYear: data?.death ?? null, reason: 'Song lyrics — highest enforcement risk' };
  }

  if (!data) {
    return { risk: 'medium', deathYear: null, reason: 'Author not in registry — manual review needed' };
  }

  const { death } = data;

  // Ancient / pre-1928
  if (death !== null && death < 1928) {
    return { risk: 'safe', deathYear: death, reason: 'Works published before 1928 — public domain' };
  }

  // Died 1928–1955
  if (death !== null && death >= 1928 && death <= 1955) {
    return { risk: 'low', deathYear: death, reason: `Died ${death} — most works public domain, verify source` };
  }

  // Died 1956–2000
  if (death !== null && death >= 1956 && death <= 2000) {
    const sType = data.sourceType;
    // Interviews and speeches are lower risk than published books
    if (sType === 'interview' || sType === 'speech' || sType === 'social') {
      return { risk: 'medium', deathYear: death, reason: `Died ${death}, spoken word — lower risk than published work` };
    }
    return { risk: 'medium', deathYear: death, reason: `Died ${death} — copyrighted, short quote defensible under fair use` };
  }

  // Living or died after 2000
  if (death === null || death > 2000) {
    const sType = data.sourceType;
    if (sType === 'social' || sType === 'interview' || sType === 'speech') {
      return { risk: 'high', deathYear: death ?? null, reason: `${death === null ? 'Living' : `Died ${death}`} — public statements, still risky` };
    }
    return { risk: 'high', deathYear: death ?? null, reason: `${death === null ? 'Living' : `Died ${death}`} — fully copyrighted` };
  }

  return { risk: 'medium', deathYear: death, reason: 'Unclear — manual review needed' };
}

async function main() {
  const args = process.argv.slice(2);
  const reportOnly = args.includes('--report');

  console.log('=== Copyright Audit ===\n');

  const { data: cards, error } = await supabase
    .from('specimen_cards')
    .select('id, author, domain, text');

  if (error || !cards) { console.error('Failed to load cards:', error); return; }

  const results = {
    safe: 0, low: 0, medium: 0, high: 0,
  };

  const updates: Array<{ id: string; copyright_risk: string; author_death_year: number | null; is_active: boolean }> = [];
  const highRisk: Array<{ author: string; text: string; reason: string }> = [];
  const mediumRisk: Array<{ author: string; reason: string }> = [];

  for (const card of cards) {
    const data = AUTHOR_DATA[card.author];
    const { risk, deathYear, reason } = classifyRisk(card.author, data?.sourceType ?? 'unknown', data?.notes);

    results[risk]++;

    updates.push({
      id: card.id,
      copyright_risk: risk,
      author_death_year: deathYear,
      is_active: risk !== 'high',
    });

    if (risk === 'high') {
      highRisk.push({ author: card.author, text: card.text.slice(0, 60) + '...', reason });
    }
    if (risk === 'medium') {
      const existing = mediumRisk.find(m => m.author === card.author);
      if (!existing) mediumRisk.push({ author: card.author, reason });
    }
  }

  // Report
  console.log('Summary:');
  console.log(`  ✓ Safe     (public domain): ${results.safe}`);
  console.log(`  ↓ Low      (verify source): ${results.low}`);
  console.log(`  ⚠ Medium   (short quotes): ${results.medium}`);
  console.log(`  ✗ High     (remove):        ${results.high}`);
  console.log(`  Total: ${cards.length}\n`);

  if (highRisk.length > 0) {
    console.log('HIGH RISK — will be deactivated:');
    highRisk.forEach(h => {
      console.log(`  ✗ ${h.author}: "${h.text}"`);
      console.log(`    Reason: ${h.reason}`);
    });
    console.log('');
  }

  if (mediumRisk.length > 0) {
    console.log('MEDIUM RISK — kept, manual review recommended:');
    mediumRisk.forEach(m => console.log(`  ⚠ ${m.author}: ${m.reason}`));
    console.log('');
  }

  if (reportOnly) {
    console.log('Report only — no changes made. Run without --report to apply.');
    return;
  }

  // Apply updates one by one (update only — don't touch text/other fields)
  let deactivated = 0;
  for (const u of updates) {
    const { error: err } = await supabase
      .from('specimen_cards')
      .update({ copyright_risk: u.copyright_risk, author_death_year: u.author_death_year, is_active: u.is_active })
      .eq('id', u.id);
    if (err) console.error(`Update error for ${u.id}:`, err.message);
    if (!u.is_active) deactivated++;
  }

  console.log(`✓ All ${cards.length} cards classified.`);
  console.log(`✓ ${deactivated} high-risk cards deactivated (is_active=false).`);
  console.log(`✓ ${cards.length - deactivated} cards remain active.\n`);
  console.log('High-risk cards are hidden from the feed but not deleted.');
  console.log('To permanently remove them: DELETE FROM specimen_cards WHERE copyright_risk = \'high\'');
}

main().catch(console.error);
