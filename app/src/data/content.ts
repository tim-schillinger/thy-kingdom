// Bundled content, loaded from the app's own files (cached by the service worker at install; 1360).
import type { Content, Nation, StudyNote, DigSection } from '../engine/types';

let content: Content | null = null;
const base = import.meta.env.BASE_URL;
/** `fresh` asks the browser to check with the server before using a saved copy. The calendars sit at a fixed address, so a browser that saved
 *  an older Alpha's calendar kept serving it, and the week's verse (added later) was missing on the Creator's phone (A23). */
const get = (p: string, fresh = false) => fetch(`${base}content/${p}`, fresh ? { cache: 'no-cache' } : undefined).then((r) => { if (!r.ok) throw new Error(p); return r.json(); });
/** Throw away the browser's saved copy of the small content files, then reload the app (the Try Again for content that is missing). */
const RESUME = 'tkc.resume';
/** The step she was on, kept for the one reload Try Again makes so she comes back to it, not to Today (1669). Read once at start, then gone. */
export function takeResume<T>(): T | null { try { const v = sessionStorage.getItem(RESUME); sessionStorage.removeItem(RESUME); return v ? JSON.parse(v) : null; } catch { return null; } }
export async function refreshContent(resume?: unknown) {
  try { if (resume) sessionStorage.setItem(RESUME, JSON.stringify(resume)); } catch { /* storage may be off: she lands on Today */ }
  await Promise.all(['calendars.json', 'books.json', 'nations.json', 'meditation-key.json', 'nation-facts.json', 'sheets.json', 'classic.json', 'articles.json', 'hymns.json', 'hymn-stories.json', 'hymn-audio.json'].map((f) => fetch(`${base}content/${f}`, { cache: 'reload' }).catch(() => undefined)));
  location.reload();
}

export async function loadContent(): Promise<Content> {
  if (content) return content;
  const [cal, books, nations, medkey, facts, sheets, classic, articles, hymns, stories, hymnAudio] = await Promise.all([get('calendars.json', true), get('books.json', true), get('nations.json', true), get('meditation-key.json', true), get('nation-facts.json', true), get('sheets.json', true), get('classic.json', true), get('articles.json', true), get('hymns.json', true), get('hymn-stories.json', true), get('hymn-audio.json', true)]);
  content = { cal, classic, articles, books: books.order, nations: Object.fromEntries(nations.list.map((n: Nation) => [n.id, n])), facts: facts.list, factsSource: facts.sourceLine, medkey, sheets, hymns, hymnStories: stories.stories, hymnAudio };
  return content;
}
export const getContent = () => content!;

const books = new Map<string, Promise<string[][]>>();
const booksNow = new Map<string, string[][]>();
/** Jesus' words (`r`) and psalm titles (`t`) of a loaded book, kept beside its verses so `loadBook` still answers with chapters of verse strings. */
export type RedParts = Array<[string] | [string, 1]>;
export interface BookExtras { r?: Record<string, Record<string, RedParts>>; t?: Record<string, string>; /** Psalm 119's letters: chapter → verse → the heading as this Bible prints it */ h?: Record<string, Record<string, string>> }
const extrasNow = new Map<string, BookExtras>();
export const peekExtras = (trans: 'web' | 'kjv', book: string): BookExtras | null => extrasNow.get(`${trans}/${book}`) ?? null;
/** A book already loaded, or null: lets a page that was prefetched show its text on the first frame (motion-lock §5.1). */
export const peekBook = (trans: 'web' | 'kjv', book: string): string[][] | null => booksNow.get(`${trans}/${book}`) ?? null;
/** Load books ahead of the page that needs them. Never throws: a failed prefetch is retried by the page itself. */
export const prefetchBooks = (trans: 'web' | 'kjv', ids: Iterable<string>) => { for (const b of new Set(ids)) loadBook(trans, b).catch(() => { books.delete(`${trans}/${b}`); }); };
/** The King James file marks paragraphs with "¶" at a verse's start; it shows nowhere (3007). Marks only, never a word. */
export const noParagraphMarks = (v: string) => v.replace(/¶\s*/g, '');
/** One book of one Bible: chapters of verses. */
export function loadBook(trans: 'web' | 'kjv', book: string): Promise<string[][]> {
  const k = `${trans}/${book}`;
  if (!books.has(k)) books.set(k, get(`bible/${k}.json`).then((j) => { const ch = trans === 'kjv' ? j.ch.map((c: string[]) => c.map(noParagraphMarks)) : j.ch; extrasNow.set(k, { r: j.r, t: j.t, h: j.h }); booksNow.set(k, ch); return ch; }, (e) => { books.delete(k); throw e; }));
  return books.get(k)!;
}

/** Study Notes and Dig Deeper, one Bible book at a time: chapter number → the notes or sections for it (C1). */
type Study = { notes: Record<string, StudyNote[]>; dig: Record<string, DigSection[]> };
const study = new Map<string, Promise<Study[keyof Study]>>();
const studyNow = new Map<string, Study[keyof Study]>();
export const peekStudy = <K extends keyof Study>(kind: K, book: string): Study[K] | null => (studyNow.get(`${kind}/${book}`) as Study[K] | undefined) ?? null;
/** A book with no file has no notes at all (Exodus 36 is the one chapter the notes skip; a missing chapter reads as missing). */
export function loadStudy<K extends keyof Study>(kind: K, book: string): Promise<Study[K]> {
  const k = `${kind}/${book}`;
  if (!study.has(k)) study.set(k, get(`${k}.json`).then((j) => { studyNow.set(k, j.ch); return j.ch; }, (e) => { study.delete(k); throw e; }));
  return study.get(k)! as Promise<Study[K]>;
}
