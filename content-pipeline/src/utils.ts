import { createHash } from 'crypto';

export function createId(authorId: string, text: string): string {
  const hash = createHash('sha1')
    .update(authorId + text.slice(0, 60))
    .digest('hex')
    .slice(0, 10);
  return `${authorId}-${hash}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function log(msg: string, ...args: unknown[]) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${msg}`, ...args);
}
