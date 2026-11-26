// The hymn recordings (3-5p, frame-lock-9): the manifest, the mapping from a hymn to its track, the lines in "The Recording", the time format, the 71 days, and the curly quote marks in hymns.json.
// Data level: reads the files the app ships. The audio files themselves (app/public/audio, not in git) are checked when they are there.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { hymnFor, trackFor, fmtTime, isFirstSunday } from '../src/engine/hymns';
import { HYMN_AUDIO } from '../src/copy';
import { addDays } from '../src/engine/dates';
import type { Content } from '../src/engine/types';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const hymns = JSON.parse(read('../public/content/hymns.json')), audio = JSON.parse(read('../public/content/hymn-audio.json'));
const c = { hymns, hymnAudio: audio } as unknown as Content;
const tracks = audio.tracks as Record<string, { file: string; readers: string[]; more?: boolean; group?: boolean; seconds: number; bytes: number }>;
const day = (n: number) => addDays('2026-01-01' as any, n);

describe('the hymn recordings: the manifest', () => {
  it('29 tracks: the 28 marked hymns and the Doxology (Vol. 1, track 20), each file named for its volume and track', () => {
    expect(Object.keys(tracks)).toHaveLength(29);
    for (const [k, t] of Object.entries(tracks)) expect(t.file, k).toBe(`${k}.mp3`);
    expect(tracks['1-20'].readers).toEqual(['TriciaG']);
  });
  it('every track has a reader, or says the page names none; a length from 1:21 to 5:03; about 1 h 33 min in all', () => {
    let total = 0;
    for (const [k, t] of Object.entries(tracks)) { expect(t.readers.length > 0 || t.group === true, `${k} readers`).toBe(true); expect(t.seconds, k).toBeGreaterThanOrEqual(81); expect(t.seconds, k).toBeLessThan(304); total += t.seconds; }
    expect(Math.round(total / 60)).toBe(93);
  });
  it('the files are there and match when app/public/audio exists', () => {
    for (const t of Object.values(tracks)) { const f = new URL(`../public/audio/${t.file}`, import.meta.url); if (existsSync(f)) expect(statSync(f).size, t.file).toBe(t.bytes); }
  });
});

describe('the hymn recordings: a hymn finds its track', () => {
  it('each of the 28 marked hymns finds a track, and no other hymn does', () => {
    const marked = hymns.hymns.filter((h: any) => h.recorded);
    expect(marked).toHaveLength(28);
    for (const h of marked) expect(trackFor(c, h), `hymn ${h.n}`).not.toBeNull();
    for (const h of hymns.hymns.filter((x: any) => !x.recorded)) expect(trackFor(c, h), `hymn ${h.n}`).toBeNull();
    expect(trackFor(c, { n: 7, recorded: 'LibriVox Vol. 2, track 7' } as any)?.file).toBe('2-07.mp3');
  });
  it('the Doxology plays on a first Sunday (3374), and 71 days of the year have a player (frame-lock-9 §1)', () => {
    const dox = hymnFor(c, '2026-11-01' as any); expect(isFirstSunday('2026-11-01' as any)).toBe(true); expect(trackFor(c, dox)?.file).toBe('1-20.mp3');
    // The 366-day table gives 28 hymns 71 days (frame-lock-9 §1); a first Sunday puts the Doxology in a day's place, so 2026 has 70 days of the 28 and 12 of the Doxology
    const mark = new Set(hymns.hymns.filter((h: any) => h.recorded).map((h: any) => String(h.n)));
    expect(Object.values(hymns.days).filter((n) => mark.has(String(n)))).toHaveLength(71);
    let n = 0, twelve = 0; for (let i = 0; i < 365; i++) { const t = trackFor(c, hymnFor(c, day(i))); if (t) { if (t.file === '1-20.mp3') twelve++; else n++; } }
    expect(twelve).toBe(12); expect(n).toBe(70);
  });
});

describe('the hymn recordings: the words around them', () => {
  it('The Recording reads as approved (375 y): one, two, a group, one named and one not', () => {
    const tail = ' LibriVox volunteers record old books and songs and share them for free.';
    expect(HYMN_AUDIO.heading).toBe('The Recording');
    expect(HYMN_AUDIO.body({ readers: ['Alex Clarke'] })).toBe('Sung by Alex Clarke, a volunteer with LibriVox.' + tail);
    expect(HYMN_AUDIO.body({ readers: ['Kimberly Krause', 'TriciaG'] })).toBe('Sung by Kimberly Krause and TriciaG, volunteers with LibriVox.' + tail);
    expect(HYMN_AUDIO.body({ readers: [], group: true })).toBe('Sung by a group of volunteers with LibriVox.' + tail);
    expect(HYMN_AUDIO.body({ readers: ['Kimberly Krause'], more: true })).toBe('Sung by Kimberly Krause and another volunteer with LibriVox.' + tail);
  });
  it('the note under the player is the approved line (381 y)', () => { expect(HYMN_AUDIO.note).toBe('The recording can differ from the words here.'); });
  it('times read minutes and two digits of seconds, cut down not rounded', () => {
    expect(fmtTime(0)).toBe('0:00'); expect(fmtTime(71.9)).toBe('1:11'); expect(fmtTime(154.8)).toBe('2:34'); expect(fmtTime(303.5)).toBe('5:03'); expect(fmtTime(81.3)).toBe('1:21');
  });
});

describe('hymns.json: curly quote marks (3157, 3-5p)', () => {
  it('no straight quote mark is left in any hymn, and the elisions and closing marks are apostrophes', () => {
    const all = JSON.stringify(hymns.hymns);
    expect(all).not.toMatch(/'/); expect(all).not.toMatch(/\\"/);
    expect(all).toContain('thro’'); expect(all).toContain('’tis'); expect(all).toContain('o’er'); expect(all).toContain('“K”');
    expect((all.match(/‘/g) ?? []).length).toBeGreaterThan(30);
  });
  it('the source file matches the one the app ships', () => { expect(JSON.parse(read('../../data/hymns.json'))).toEqual(hymns); });
});
