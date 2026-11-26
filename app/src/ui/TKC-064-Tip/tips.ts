// TKC-064 Tip: when it shows and when it ends (frame-lock-11 §1, §2; 3409 y = B).
// One device flag ends every tip for good (she tapped the book, or closed a tip with its ✕, anywhere). A step's own tip also ends for good once she has finished that step on any day.
// Any other way of leaving only hides it until the next visit, so nothing else is kept. The flag sits beside her data, never in it (like the first-open flag in motion.ts), so a backup does not carry it.
import { useEffect, useReducer } from 'preact/hooks';
import { storageName } from '../../data/channel';
import { useHer } from '../../data/store';

const KEY = storageName('tkc.tips');
const read = () => { try { return localStorage.getItem(KEY) === 'done'; } catch { return false; } };
let ended = read();
const subs = new Set<() => void>();
/** Every tip is over for good. Called when she taps the book on any step, or closes any tip with its ✕. */
export function endTips() { if (ended) return; ended = true; try { localStorage.setItem(KEY, 'done'); } catch { /* the flag is a convenience; without it the tip may show once more */ } subs.forEach((f) => f()); }
/** Start over (erase all my data, and the test harness's fixtures): the first-time tips come back. */
export function resetTips() { ended = false; try { localStorage.removeItem(KEY); } catch { /* ignore */ } subs.forEach((f) => f()); }
/** The test harness photographs still pages, so tips are off there unless a walk turns them on: `__tkc.tips = 'on'` (as motion is). */
const tipsOff = () => { const t = (window as unknown as { __tkc?: { tips?: string } }).__tkc; return !!t && t.tips !== 'on'; };

/** Whether a step's tip should show now, and what she does with it. `book` says the step has a book button; `ahead` is a day that hasn't come (those pages are look only, so no tip). */
export function useStepTip(step: string, book: boolean, ahead = false) {
  const [, tick] = useReducer((x: number) => x + 1, 0);
  useEffect(() => { subs.add(tick as () => void); return () => { subs.delete(tick as () => void); }; }, []);
  const her = useHer();
  const finished = her.dayMarks.some((m) => m.step === step && m.state === 'done');
  return { open: book && !ahead && !ended && !finished && !tipsOff(), onClose: endTips, onBook: endTips };
}
