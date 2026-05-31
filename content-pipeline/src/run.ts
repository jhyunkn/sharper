/**
 * Content generation pipeline entry point.
 *
 * Usage:
 *   npm run generate              -- generate all authors not yet in DB
 *   npm run generate -- --domain philosophy   -- specific domain only
 *   npm run generate -- --author rumi         -- specific author id only
 *   npm run generate -- --dry-run             -- generate but don't publish
 *   npm run generate -- --limit 10            -- process max N authors
 */

import 'dotenv/config';
import { AUTHORS } from './authors';
import { generateBatch } from './generate';
import { publishCards, getExistingAuthorIds, getCardCount } from './publish';
import { log } from './utils';
import { SpecimenCard } from './types';

async function main() {
  const args = process.argv.slice(2);
  const domainFilter = args.includes('--domain') ? args[args.indexOf('--domain') + 1] : null;
  const authorFilter = args.includes('--author') ? args[args.indexOf('--author') + 1] : null;
  const dryRun = args.includes('--dry-run');
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : Infinity;

  log('=== Imprint Content Pipeline ===');
  log(`Dry run: ${dryRun}`);

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing ANTHROPIC_API_KEY');
  }

  // Filter authors
  let targets = AUTHORS.filter((a) => {
    if (domainFilter && a.domain !== domainFilter) return false;
    if (authorFilter && a.id !== authorFilter) return false;
    return true;
  });

  // Skip authors already fully generated (unless --author flag)
  if (!authorFilter && !dryRun) {
    const existing = await getExistingAuthorIds();
    const before = targets.length;
    targets = targets.filter((a) => !existing.has(a.name));
    log(`Skipping ${before - targets.length} already-generated authors`);
  }

  if (targets.length === 0) {
    log('Nothing to generate. Use --author <id> to regenerate a specific author.');
    return;
  }

  targets = targets.slice(0, limit);
  log(`Generating cards for ${targets.length} authors...`);

  const beforeCount = dryRun ? 0 : await getCardCount();
  const allCards: SpecimenCard[] = [];

  const results = await generateBatch(targets, (done, total, authorId) => {
    const result = results.find((r) => r.authorId === authorId);
    const count = result?.cards.length ?? 0;
    log(`[${done}/${total}] ${authorId}: ${count} cards${result?.error ? ` ERROR: ${result.error}` : ''}`);
  });

  for (const result of results) {
    if (result.cards.length > 0) {
      allCards.push(...result.cards);
    }
  }

  log(`Generated ${allCards.length} cards total`);

  if (dryRun) {
    log('DRY RUN — sample output:');
    console.log(JSON.stringify(allCards.slice(0, 2), null, 2));
    return;
  }

  log('Publishing to Supabase...');
  const { inserted, skipped } = await publishCards(allCards);
  const afterCount = await getCardCount();

  log(`Published: ${inserted} new, ${skipped} skipped (duplicates)`);
  log(`Total cards in DB: ${beforeCount} → ${afterCount}`);
  log('Done.');
}

main().catch((err) => {
  console.error('Pipeline error:', err);
  process.exit(1);
});
