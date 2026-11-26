import type { CivilDate } from './dates';

// ---------- Bundled content (not hers; comes back with any install) ----------
export interface Ref { b: string; c: number; v?: number; c2?: number; v2?: number }
export interface CalendarDay {
  psalm: Ref[]; proverb: Ref[]; reading: Ref[]; song: boolean;
  study: { article: true } | { count: number; from: [string, number] | null; to: [string, number] | null; short: number };
  nations: string[]; meditation: string;
  /** The week's verse (frame-lock-2 §6): every day carries one; a week is a six-day block plus the single day after it. */
  weekVerse?: Ref;
  /** One of the 53 Name and Attribute nights (data/names.json, locked Nov 13, 2026; by date, 753). */
  night?: Night;
  /** The ordinary Meditate nights: the week's run, one passage for six nights (data/meditate.json). `title` is the words after "This week: ". */
  run?: MeditateRun;
}
export interface Night {
  kind: 'name' | 'attribute'; word: string; plain?: string; meaning: string; verse: Ref; backup?: Ref;
  /** Only the 11 Names whose Bible prints LORD: the line that says why (King James readings). */
  bibleNote?: { kjv?: string };
  /** The Name in Hebrew letters (Alpha and Omega in Greek); checked against the Westminster Leningrad Codex. */
  mark?: string; authorRef?: string;
}
export interface MeditateRun { run: number; from: string; kind: 'jesus' | 'author' | 'misc' | 'works'; title: string; verse: Ref; backup?: Ref }
export interface Calendars {
  contentVersion: string;
  editions: { web: string; kjv: string };
  /** Psalm 119's 22 parts: the Hebrew letter and the verse each starts at (frame-lock-5-names-2 §E). */
  letters: Array<{ part: number; glyph: string; v: number }>;
  days: Record<string, CalendarDay>; // "MM-DD" (1361)
}
export interface BookInfo { id: string; name: string; one: string; chapters: number }
export interface Nation { id: string; name: string; author: string; iso: string | null; num: string | null; latlng: [number, number] | null }
/** What the nation page and the Kingdom rows know about a nation. Every field is optional: a missing fact is left out (TKC-016, TKC-041 E). `at` is the spot's place on the placeholder globe (TKC-042). */
export interface NationFacts { region?: string; capital?: string; population?: number; language?: string; at?: { x: number; y: number } }
export interface MeditationKey { attributes: Record<string, string>; names: Record<string, string>; works: Record<string, string> }
/** One read sheet (TKC-004 `read`, three titled sections; frame-lock-4a §4, 4b §4, 4c §4): what it is, three ways to live it, one verse stored per Bible (the quoted words only, "…" where a cut leaves the sentence open). */
export interface SheetItem { a: string; b: string[]; ref: Ref; web: string; kjv: string }
export interface SheetSet { sections: [string, string]; items: Array<SheetItem & { word: string }> }
export interface Sheets { version: number; checkin: Record<CheckIn, SheetSet>; lists: Array<SheetItem & { name: string; sections: [string, string] }> }
/** The three books (C1). Study notes and commentary load one Bible book at a time (data/content.ts); the Classic loads with the calendars. */
export type Inline = string | ['i', string];
export type NoteBlock = ['p', Inline[]] | ['ul' | 'ol', NoteBlock[][]];
/** One study note: the verses it covers ([first, last] or [first, last, last chapter]; verse 0 is a psalm's title) and its blocks. */
export interface StudyNote { v: number[]; b: NoteBlock[] }
/** One Dig Deeper section: the verses it covers and its text. */
export interface DigSection { v: [number, number]; t: string }
/** The Classic's shelf, one reading a night (Books 2): each reading names its book and writer. A paragraph is a plain string, or inline pieces when the writer's italics are kept; a new line inside one is a line of verse. */
/** A book's About sheet (frame-lock-12 §2): per book, never a fixed line, because the shelf rotates. */
export interface BookAbout { title: string; sections: Array<{ head: string; body: string }>; links: Array<{ label: string; href: string }> }
export interface Classic { about?: Record<string, BookAbout>; readings: Array<{ title: string; writer: string; part: string; paras: Array<string | Inline[] | { h: string }> }> }   // { h } is a head inside a talk (3224)
/** The 25 Study Notes article nights (Books 2, 3203–3206), by MM-DD: one dictionary article each. A block is a note block, or ['h', text] for a head. */
export type ArticleBlock = NoteBlock | ['h', string];
export interface Articles { source: string; version: string; nights: Record<string, { id: string; title: string; blocks: ArticleBlock[] }> }
/** The year of hymns (Build 7g; claude/content/hymns-year.md): `days` maps MM-DD, Feb 29 included, to a hymn's number written as text; `refrain` is [] when a hymn has none; `year` is a number, short text ("c. 820") or null. */
export interface Hymn { n: number | string; title: string; firstLine: string; writer: string; year: number | string | null; stanzas: string[][]; refrain: string[]; recorded: string | null }
export interface Hymns { source: string; hymns: Hymn[]; days: Record<string, string> }
/** One LibriVox track (data/hymn-audio.json, 3-5p): the file under /audio, who sings it as the LibriVox page names them, and its length in seconds. `more`: another singer the page does not name; `group`: the page names only "LibriVox Volunteers". */
export interface HymnTrack { file: string; readers: string[]; more?: boolean; group?: boolean; seconds: number; bytes: number }
export interface HymnAudio { source: string; tracks: Record<string, HymnTrack> }
export interface Content { cal: Calendars; classic: Classic; articles: Articles; books: BookInfo[]; nations: Record<string, Nation>; facts: Record<string, NationFacts>; factsSource: string; medkey: MeditationKey; sheets: Sheets; hymns: Hymns; hymnStories: Record<string, string>; hymnAudio: HymnAudio }

// ---------- Her data: nine stores, written on every tap (1362) ----------
export type StepId =
  | 'am.sing' | 'am.ask' | 'am.psalm' | 'am.proverb' | 'am.reading' | 'am.respond' | 'am.memorize'
  | 'pm.turn' | 'pm.classic' | 'pm.notes' | 'pm.dig' | 'pm.prayer' | 'pm.checkin' | 'pm.meditate';
export type Walk = 'morning' | 'evening';
export type Ask = 'provide' | 'forgive' | 'protect';
export type CheckIn = 'burnt' | 'grain' | 'peace' | 'sin' | 'trespass';

export interface Person { id: string; list: number; name: string; request: string; added: CivilDate; removed?: boolean }
export interface PrayerMark { id: string; personId: string; date: CivilDate; asks: Ask[] }
export interface Answered { personId: string; on: CivilDate; answer: string; list: number; name: string; request: string; removed?: boolean }
/** A step done or skipped; also sub-marks ("pm.checkin.sin", "pm.prayer.part", "am.proverb.extra", "day.cleared"). */
export interface DayMark { key: string; date: CivilDate; step: string; state: 'done' | 'skipped' | 'set'; value?: string | number; at: number }
export interface Sources { bible: 'web' | 'kjv'; readings: 'app' | 'own'; hymnal: 'app' | 'own' | 'recorded'; verse: 'app' | 'own'; meditate: 'app' | 'own'; classic: 'app' | 'own'; studyNotes: 'app' | 'own'; digDeeper: 'app' | 'own' }
export interface WeekPick { weekStart: CivilDate; kind: 'meditate' | 'memorize'; ref: string }
export interface BookPlace { book: string; place: string }
export interface Settings { eveningStart: string; tracking: boolean; appearance: 'phone' | 'light' | 'dark'; textSize: 'phone' | 'regular' | 'large' | 'larger' | 'largest'; backupReminder: 'week' | 'month' | 'off' | null }
export interface Reminders {
  firstDay: CivilDate | null; firstRunDone: boolean; startHereClosed: boolean; homeCardClosed: boolean;
  /** Start Here (TKC-059 H): the page she left on (1 to 5; ✕ keeps her place) and whether she finished it (the Guide then shows the done row). Optional so older backups still restore. */
  startHerePage?: number; startHereDone?: boolean;
  lessonsRead: string[]; sortByList: Record<number, string>; lastBackup: CivilDate | null; /** 583: 'saved' once the share sheet confirms; 'made' when the file was only handed to the browser's download */ lastBackupKind?: 'saved' | 'made'; backupCardHiddenUntil: CivilDate | null;
  prayerIntroHidden: boolean; prayerKeySeen: boolean; firstAddNoteShown: boolean; notThisMonth: string | null;
  /** The ideas list on each Check-In (1697): open the first time she reaches it (nothing stored), then the way she left it. */
  ideasOpen?: Partial<Record<CheckIn, boolean>>;
  /** The Lists tab she used last: 0 Praying For, 1 Answered (opens there next time). */
  listsTab?: 0 | 1;
  /** Progress (3-5t, 1165): what she saw on the page last time (the current streak, the plant's stage, the four counts), so the page moves only for what was gained since. Optional so older backups still restore. */
  progressSeen?: { current: number; stage: number; tiles: number[]; /** 3-5u: the streak's first day and the day she looked, so a join can be told from one more day */ start?: CivilDate; on?: CivilDate };
}

export interface HerData {
  people: Person[]; prayerMarks: PrayerMark[]; answered: Answered[]; dayMarks: DayMark[];
  sources: Sources; weekPicks: WeekPick[]; bookPlaces: BookPlace[]; settings: Settings; reminders: Reminders;
}

export const MORNING: StepId[] = ['am.sing', 'am.ask', 'am.psalm', 'am.proverb', 'am.reading', 'am.respond', 'am.memorize'];
export const EVENING: StepId[] = ['pm.turn', 'pm.classic', 'pm.notes', 'pm.dig', 'pm.prayer', 'pm.checkin', 'pm.meditate'];
export const STEP_NAMES: Record<StepId, string> = {
  'am.sing': 'Sing', 'am.ask': 'Ask to Hear', 'am.psalm': 'Psalm', 'am.proverb': 'Proverb', 'am.reading': 'Bible Reading',
  'am.respond': 'Respond', 'am.memorize': 'Memorize', 'pm.turn': 'Turn to God', 'pm.classic': 'Classic', 'pm.notes': 'Study Notes',
  'pm.dig': 'Dig Deeper', 'pm.prayer': 'Prayer', 'pm.checkin': 'Check-In', 'pm.meditate': 'Meditate',
};
/** Persons lists by weekday, Sunday to Saturday (R1–R8 in the rename list). */
export const LISTS = [
  { name: 'Faith Family', night: 'Sundays', line: 'The people you grow with' },
  { name: 'Family & Friends', night: 'Mondays', line: 'The people closest to you' },
  { name: 'Neighbors', night: 'Tuesdays', line: 'The people around you, from next door to the checkout line' },
  { name: 'Leaders', night: 'Wednesdays', line: 'People with a say over your life' },
  { name: 'The Hurting', night: 'Thursdays', line: 'People who are grieving, sick, forgotten, or alone' },
  { name: 'Difficult People', night: 'Fridays', line: 'People it’s hard to love right now' },
  { name: 'Your Requests', night: 'Saturdays', line: 'What you’re asking God for yourself' },
];
/** Check-ins by the area of life they look at (R25–R29), rarest first (108). */
export const CHECKIN_ORDER: CheckIn[] = ['trespass', 'sin', 'peace', 'grain', 'burnt'];
export const CHECKIN_NAMES: Record<CheckIn, string> = { burnt: 'All of Me', grain: 'Giving', peace: 'Relationships', sin: 'Character', trespass: 'Fairness' };

export const emptyHerData = (): HerData => ({
  people: [], prayerMarks: [], answered: [], dayMarks: [],
  sources: { bible: 'web', readings: 'app', hymnal: 'app', verse: 'app', meditate: 'app', classic: 'app', studyNotes: 'app', digDeeper: 'app' },
  weekPicks: [], bookPlaces: [],
  settings: { eveningStart: '18:00', tracking: true, appearance: 'phone', textSize: 'phone', backupReminder: null },
  reminders: { firstDay: null, firstRunDone: false, startHereClosed: false, homeCardClosed: false, lessonsRead: [], sortByList: {},
    lastBackup: null, backupCardHiddenUntil: null, prayerIntroHidden: false, prayerKeySeen: false, firstAddNoteShown: false, notThisMonth: null },
});
