import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { shapeVerse } from '../src/ui/screens/GuideVerse';
import { GODEEPER } from '../src/copy';

// The Lord's Prayer's In the Bible verses, shaped from the app's own Bible files (3316, 3317).
const ch = (t: string, b: string) => JSON.parse(readFileSync(new URL(`../public/content/bible/${t}/${b}.json`, import.meta.url), 'utf8')).ch as string[][];
const text = (t: 'web' | 'kjv', b: string, c: number, v1: number, v2: number) => ch(t, b)[c - 1].slice(v1 - 1, v2).join(' ').replace(/\[|\]/g, '');

describe('Go Deeper: In the Bible verses', () => {
  const parts = GODEEPER.parts;
  it('part 2 starts at "Our Father" in both Bibles (3316)', () => {
    for (const t of ['web', 'kjv'] as const) {
      const out = shapeVerse(text(t, 'MAT', 6, 9, 10), parts[1].verse, t);
      expect(out.startsWith('Our Father')).toBe(true);
      expect(out).not.toMatch(/Pray like this|After this manner/);
      expect(out.endsWith('heaven.')).toBe(true);
    }
  });
  it('every King James cut that would end on a colon or semicolon ends with "…" (3317)', () => {
    const p3 = shapeVerse(text('kjv', 'MAT', 6, 11, 13), parts[2].verse, 'kjv');
    expect(p3.endsWith('deliver us from evil…')).toBe(true);
    const p4 = shapeVerse(text('kjv', '1CH', 29, 11, 11), parts[3].verse, 'kjv');
    expect(p4.endsWith('is thine…')).toBe(true);
    for (const p of parts) { const o = shapeVerse(text('kjv', p.verse.ref.b, p.verse.ref.c, p.verse.ref.v ?? 1, p.verse.ref.v2 ?? p.verse.ref.v ?? 1), p.verse, 'kjv'); if (p.verse.upTo || p.verse.upToKjv) expect(o).not.toMatch(/[:;]$/); }
  });
  it('the World English Bible cuts are unchanged', () => {
    expect(shapeVerse(text('web', 'MAT', 6, 11, 13), parts[2].verse, 'web').endsWith('deliver us from the evil one.')).toBe(true);
    expect(shapeVerse(text('web', '1CH', 29, 11, 11), parts[3].verse, 'web').endsWith('is yours.')).toBe(true);
  });
});

// 3324: Go Deeper part 2's King James anchor shows Matthew 6:9–10, like the World English Bible's; the evening Prayer step keeps its own (975).
describe('Go Deeper: part 2 anchors (3324)', () => {
  it('the King James line starts at "Hallowed be thy name." and matches the KJV text', async () => {
    const { PRAYER } = await import('../src/copy');
    const p = GODEEPER.parts[1] as typeof GODEEPER.parts[1] & { anchorKjv?: string };
    expect(p.anchorKjv).toBe('“Hallowed be thy name. Thy kingdom come. Thy will be done in earth, as it is in heaven.”');
    const v = text('kjv', 'MAT', 6, 9, 10).replace(/^.*?(Hallowed)/, '$1').replace(/^Hallowed be thy name\.\s*/, '');
    expect(v).toBe('Thy kingdom come. Thy will be done in earth, as it is in heaven.');
    expect(PRAYER.anchorText.kjv[1]).toBe('“Thy kingdom come. Thy will be done in earth, as it is in heaven.”');
  });
});

describe('Go Deeper: the check-in entry words (3325–3330)', () => {
  it('each check-in has a line, a when, an In the Bible line and one or two verses', () => {
    for (const ci of ['burnt', 'grain', 'peace', 'sin', 'trespass'] as const) {
      const e = GODEEPER.entry[ci];
      expect(e.line.length).toBeGreaterThan(20); expect(e.when).toBeTruthy(); expect(e.bible).toMatch(/^In Israel/);
      expect(e.verses.length).toBeGreaterThanOrEqual(1); expect(e.verses.length).toBeLessThanOrEqual(2);
      expect(`${e.line} ${e.bible} ${e.when} ${e.note ?? ''}`).not.toMatch(/;/); // no semicolons in app copy
    }
    expect(GODEEPER.entry.peace.note).toMatch(/safe/);
  });
});
