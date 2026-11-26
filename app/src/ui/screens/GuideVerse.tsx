// A verse in the Guide (Start Here's pages, a step's "In the Bible", Your Whole Year): the app's own Bible text in the Bible she chose, as a TKC-033 card with its reference and Bible.
// Layout and data only. A verse the app picks has any lone quote mark dropped by pickedText (589); a partial verse ends where `upTo` ends (Luke 1:38, 1946).
import { useHer } from '../../data/store';
import { getContent } from '../../data/content';
import { formatRef } from '../../engine/refs';
import { useVerses, pickedText } from '../bits';
import { bibleName } from './MorningStep';
import { VerseCard } from '../TKC-033-VerseCard/VerseCard';
import type { GuideVerse } from '../../copy';

/** Text up to and including `upTo` (and a closing quote mark that follows it, in the World English Bible). */
export function cutAfter(text: string, upTo: string): string {
  const at = text.indexOf(upTo); if (at < 0) return text;
  const end = at + upTo.length;
  return text.slice(0, /[”’"']/.test(text[end] ?? '') ? end + 1 : end);
}
/** Text from `from` on: the words before it (the Bible's own "Pray like this:") are left out (3316). */
export function cutFrom(text: string, from: string): string {
  const at = text.indexOf(from); return at < 0 ? text : text.slice(at);
}
/** A King James cut that ends on a colon or semicolon ends with "…" instead (3317), as All of Me's King James anchor does. */
export function softEnd(text: string): string { return text.replace(/[:;]$/, '…'); }
/** The verse as shown: cut at the start (`from`), then at the end (`upTo`), each in her Bible's own words. */
export function shapeVerse(whole: string, v: GuideVerse, trans: 'web' | 'kjv'): string {
  const kjv = trans === 'kjv', cut = kjv ? (v.upToKjv ?? v.upTo) : v.upTo, from = kjv ? (v.fromKjv ?? v.from) : v.from;
  let text = from ? cutFrom(whole, from) : whole;
  if (cut) { text = cutAfter(text, cut); if (kjv) text = softEnd(text); }
  return text;
}
export function Verse({ v }: { v: GuideVerse }) {
  const trans = useHer().sources.bible;
  const whole = pickedText(useVerses(v.ref, trans), trans);
  if (!whole) return null;
  return <VerseCard verse={shapeVerse(whole, v, trans)} reference={`${formatRef(getContent(), v.ref)} · ${bibleName(trans)}`} />;
}
