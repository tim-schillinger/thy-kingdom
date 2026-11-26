#!/usr/bin/env node
// 3-5p: the hymn recordings (frame-lock-9 §1). Usage (repo root): node tools/build-hymn-audio.mjs <folder holding the two LibriVox zips> [--write-manifest]
//   Unpacks the 29 tracks the year uses (the 28 marked in data/hymns.json plus Vol. 1 track 20, the Doxology) from the two LibriVox zips into app/public/audio/<vol>-<track>.mp3,
//   unchanged (64 kbps MP3, public domain; no re-encode, so nothing is lost twice). app/public/audio is not in git or the zip (it is about 45 MB): run this after a restore when a build serves or publishes the audio.
//   --write-manifest: also rewrites data/hymn-audio.json (file, readers, length, bytes) from the files. The readers are typed below from the two LibriVox book pages (librivox.app/book/7781 and /8033, read Nov 22, 2026).
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2]; const write = process.argv.includes('--write-manifest');
if (!src) { console.error('usage: node tools/build-hymn-audio.mjs <folder with armynavyhymnal1_1307_librivox.zip and armynavyhymnal2_1405_librivox.zip> [--write-manifest]'); process.exit(2); }
/** Readers as the LibriVox pages name them. `more`: another singer the page does not name; `group`: "LibriVox Volunteers" only. Vol. 1 track 1 and 19 follow the series summary (two singers). */
const READERS = {
  '1-01': { readers: ['Kimberly Krause', 'TriciaG'] }, '1-02': { readers: ['Carol Box'] }, '1-03': { readers: ['Kevin W. Davidson'] }, '1-05': { readers: ['MaryAnn'] }, '1-06': { readers: ['Eden Rea-Hedrick'] },
  '1-07': { readers: ['Eden Rea-Hedrick'] }, '1-08': { readers: ['TriciaG'] }, '1-09': { readers: ['Kevin W. Davidson'] }, '1-10': { readers: ['Maria Kasper'] }, '1-11': { readers: ['MaryAnn'] },
  '1-13': { readers: ['Kevin W. Davidson'] }, '1-14': { readers: ['Maria Kasper'] }, '1-15': { readers: ['Gina Marie'] }, '1-19': { readers: ['Kimberly Krause'], more: true }, '1-20': { readers: ['TriciaG'] },
  '2-04': { readers: ['Phil Schempf'] }, '2-05': { readers: ['Kevin W. Davidson'] }, '2-06': { readers: ['Maria Kasper'] }, '2-07': { readers: ['Alex Clarke'] }, '2-08': { readers: ['Anna Roberts'] },
  '2-09': { readers: ['Anna Roberts'] }, '2-11': { readers: ['Sarah Noll'] }, '2-13': { readers: ['TriciaG'] }, '2-14': { readers: [], group: true }, '2-16': { readers: ['Liberty Stump'] },
  '2-17': { readers: ["Glenn O'Brien"] }, '2-18': { readers: ['TriciaG'] }, '2-19': { readers: ['Maria Kasper'] }, '2-20': { readers: ['Alex Clarke'] },
};
const ZIPS = { 1: 'armynavyhymnal1_1307_librivox.zip', 2: 'armynavyhymnal2_1405_librivox.zip' };
const OUT = join(ROOT, 'app', 'public', 'audio'); mkdirSync(OUT, { recursive: true });
const manifest = {};
for (const key of Object.keys(READERS)) {
  const [vol, tr] = key.split('-'); const zip = join(src, ZIPS[vol]);
  if (!existsSync(zip)) { console.error('missing ' + zip); process.exit(1); }
  const member = `armyandnavyhymnal${vol}_${tr}_various_64kb.mp3`;
  const bytes = execFileSync('unzip', ['-p', zip, member], { maxBuffer: 1 << 26 });
  const file = `${key}.mp3`; writeFileSync(join(OUT, file), bytes);
  let seconds = null;
  try { seconds = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', join(OUT, file)], { encoding: 'utf8' }).trim()); } catch { /* ffprobe is only needed for --write-manifest */ }
  manifest[key] = { file, ...READERS[key], seconds: seconds == null ? null : Math.round(seconds * 10) / 10, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex').slice(0, 16) };
}
if (write) {
  const out = { source: 'LibriVox, Selections from The Army and Navy Hymnal, Vol. 1 (book 7781) and Vol. 2 (book 8033), public domain in the USA; 64 kbps MP3, used unchanged. Readers from the two LibriVox pages, Nov 22, 2026.', tracks: manifest };
  writeFileSync(join(ROOT, 'data', 'hymn-audio.json'), JSON.stringify(out, null, 1) + '\n'); console.log('wrote data/hymn-audio.json');
}
const total = Object.values(manifest).reduce((n, m) => n + m.bytes, 0);
console.log(`${Object.keys(manifest).length} tracks, ${total} bytes in app/public/audio`);
