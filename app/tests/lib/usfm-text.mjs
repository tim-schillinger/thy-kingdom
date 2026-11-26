// An independent reader of eBible's USFM for the tests that check what a screen shows against eBible's own file (rule P54, 1277; 1e).
// It is written apart from tools/usfm.py on purpose: the app's JSON and this reader must not share a bug.
// Returns Map("PSA 23:1" -> the verse's own words). A psalm's title (\d) and any heading are not part of a verse.
// usfmRed(zip) -> Map("MAT 5:3" -> the words inside \wj … \wj* (Jesus' words), the spans joined by one space): the same reading, kept apart from tools/usfm.py (Build 6, 1802).
import { execFileSync } from 'node:child_process';

function rawVerses(zipPath) {
  const out = new Map();
  const names = execFileSync('unzip', ['-Z1', zipPath]).toString().split('\n').filter((n) => n.endsWith('.usfm'));
  for (const n of names) {
    const txt = execFileSync('unzip', ['-p', zipPath, n], { maxBuffer: 1 << 27 }).toString('utf8');
    let id = '', c = 0, key = '';
    for (const line of txt.split('\n')) {
      if (line.startsWith('\\id ')) { id = line.slice(4, 7); continue; }
      let m;
      if ((m = line.match(/^\\c (\d+)/))) { c = +m[1]; key = ''; continue; }
      if ((m = line.match(/^\\v (\d+)(?:-\d+)? ?(.*)$/))) { key = `${id} ${c || 1}:${m[1]}`; out.set(key, m[2]); continue; }
      if (!key || /^\\(d|s\d?|ms\d?|r|cl|mr|sp|h|toc\d|mt\d?|ide)\b/.test(line)) { if (/^\\(d|s\d?|ms\d?)\b/.test(line)) key = ''; continue; }
      out.set(key, out.get(key) + ' ' + line);
    }
  }
  return out;
}
const tidy = (v) => v
    .replace(/\\\+?(f|x)\s.*?\\\+?\1\*/g, '')        // notes
    .replace(/\|[^\\]*/g, '')                         // attributes
    .replace(/\\\+?add\s+(.*?)\\\+?add\*/g, '[$1]')   // the KJV's added words, in brackets
    .replace(/\\\+?[a-z]+\d*\*/g, '')                 // closing markers
    .replace(/\\\+?[a-z]+\d*(\s|$)/g, '')             // opening markers, with their space (a tag can split a word)
    .replace(/\s+/g, ' ').trim();
export function usfmVerses(zipPath) {
  const out = rawVerses(zipPath);
  for (const [k, v] of out) out.set(k, tidy(v));
  return out;
}
export function usfmRed(zipPath) {
  const out = new Map();
  for (const [k, raw] of rawVerses(zipPath)) {
    // \wj and \wj* become two private marks first (tidy would drop them); a note between two spans leaves them touching, and then they join with no space.
    const t = tidy(raw.replace(/\\\+?(f|x)\s.*?\\\+?\1\*/g, '').replace(/\\wj\*/g, '\u0001').replace(/\\wj\s/g, '\u0002'));
    let text = '', end = -1;
    for (const m of t.matchAll(/\u0002([^\u0001]*)\u0001/g)) {
      const span = m[1].trim(); if (!span) continue;
      text += (end >= 0 && t.slice(end, m.index).length ? ' ' : '') + span; end = m.index + m[0].length;
    }
    if (text) out.set(k, text);
  }
  return out;
}
