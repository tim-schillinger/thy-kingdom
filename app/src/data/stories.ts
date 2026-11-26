// Test builds only (VITE_TEST_CONTROLS): set the clock and jump to a story's start (build-skeleton §4).
// Never visible to a user: there is no button; tests call window.__tkc.
import { setNow } from './clock';
import { replaceHer, init } from './store';
import { emptyHerData, MORNING, EVENING, type HerData, type Person } from '../engine/types';
import { addDays, type CivilDate } from '../engine/dates';

const walked = (h: HerData, from: CivilDate, to: CivilDate) => {
  for (let d = from; d <= to; d = addDays(d, 1))
    for (const s of [...MORNING, ...EVENING]) h.dayMarks.push({ key: `${d}|${s}`, date: d, step: s, state: 'done', at: 0 });
};
const person = (id: string, list: number, name: string, request: string, added: CivilDate): Person => ({ id, list, name, request, added });

export const STORIES = {
  /** Ray's first day: Wed, Oct 14, 6:25 am, a fresh install. */
  ray: { at: new Date(2026, 9, 14, 6, 25), data: null as HerData | null },
  /** Dale back after a week: Mon, Oct 26, 7:10 am; last walked Sun, Oct 18. */
  dale: { at: new Date(2026, 9, 26, 7, 10), data: (() => {
    const h = emptyHerData();
    Object.assign(h.reminders, { firstDay: '2026-09-27', firstRunDone: true, startHereClosed: true, lastBackup: '2026-10-18' });
    walked(h, '2026-09-27', '2026-10-18');
    h.people.push(person('d1', 1, 'Karen', 'Her new job', '2026-09-27'), person('d2', 2, 'Tom', '', '2026-09-28'));
    return h;
  })() },
  /** Joan's Dec 31: Thu, 9:05 pm, her morning done and people on her lists. */
  joan: { at: new Date(2026, 11, 31, 21, 5), data: (() => {
    const h = emptyHerData();
    Object.assign(h.reminders, { firstDay: '2026-11-27', firstRunDone: true, startHereClosed: true, prayerIntroHidden: true, prayerKeySeen: true, lastBackup: '2026-12-20' });
    h.settings.eveningStart = '18:00';
    walked(h, '2026-11-27', '2026-12-30');
    for (const s of MORNING) h.dayMarks.push({ key: `2026-12-31|${s}`, date: '2026-12-31', step: s, state: 'done', at: 0 });
    h.people.push(
      person('j1', 4, 'Margaret', 'Healing after her surgery', '2026-11-27'), person('j2', 4, 'The Alvarez family', 'Comfort after their loss', '2026-11-29'),
      person('j3', 4, 'Pastor Dan', 'Strength in a hard season', '2026-12-02'), person('j4', 0, 'Our small group', 'To grow in love', '2026-11-27'),
      person('j5', 3, 'Our mayor', 'Wisdom', '2026-11-28'), person('j6', 6, 'Patience with my grandson', '', '2026-12-05'),
    );
    return h;
  })() },
};

export async function playStory(name: keyof typeof STORIES) {
  const s = STORIES[name];
  setNow(s.at);
  await replaceHer(s.data ? structuredClone(s.data) : null);
  await init();
}

// Fixtures (Sprint 1b): Today exactly as each approved phone shows it, for screen parity (build-standards §5.6).
// Each names the approved picture it reproduces. Test builds only, like the stories.
const fx = (at: Date, build: (h: HerData) => void) => ({ at, data: (() => { const h = emptyHerData(); h.reminders.firstRunDone = true; build(h); return h; })() });
const doneDay = (h: HerData, d: CivilDate, steps: readonly string[]) => { for (const s of steps) h.dayMarks.push({ key: `${d}|${s}`, date: d, step: s as never, state: 'done', at: 0 }); };
/** People on a list, added Oct 5 and prayed for on earlier nights in the order given, so tonight's rotation comes out in that order (oldest prayer first). */
const queue = (h: HerData, list: number, rows: Array<[string, string]>) => rows.forEach(([name, request], k) => {
  const id = `n${list}-${k}`; h.people.push(person(id, list, name, request, '2026-10-05'));
  const d = `2026-10-${String(6 + k).padStart(2, '0')}`; h.prayerMarks.push({ id: `${d}|${id}`, personId: id, date: d, asks: ['provide'] });
});
export const FIXTURES = {
  /** The Lists tab (5b Lists build): Wed Oct 21, people on most lists, a Saturday request, and answered prayers from this year and last. */
  'lists-oct21': fx(new Date(2026, 9, 21, 9, 0), (h) => {
    Object.assign(h.reminders, { firstDay: '2026-09-01', startHereClosed: true, prayerKeySeen: true, prayerIntroHidden: true });
    const mk = (id: string, list: number, name: string, request: string, added: string, marks: Array<[string, Array<'provide' | 'forgive' | 'protect'>]> = []) => { h.people.push(person(id, list, name, request, added)); marks.forEach(([d, asks]) => h.prayerMarks.push({ id: `${d}|${id}`, personId: id, date: d, asks })); };
    mk('l0a', 0, 'Rosa', 'Her new job at the school', '2026-09-02'); mk('l0b', 0, 'Pastor Dan', 'Strength for the winter', '2026-09-09');
    mk('l1a', 1, 'Mom', 'Her health', '2026-09-03'); mk('l1b', 1, 'Jake', 'A good college choice', '2026-09-03'); mk('l1c', 1, 'Aunt Pat', '', '2026-09-10');
    mk('l2a', 2, 'Linda', 'Her knee surgery', '2026-09-08', [['2026-09-15', ['provide']], ['2026-09-22', ['provide', 'protect']], ['2026-09-29', ['provide']]]);
    mk('l3a', 3, 'Pastor James', 'Wisdom for our church', '2026-09-05', [['2026-09-16', ['provide', 'protect']], ['2026-09-23', ['provide']]]); mk('l3b', 3, 'Mayor Lee', 'Wisdom for our city', '2026-09-12'); mk('l3c', 3, 'Mrs. Ortiz', 'A good school year', '2026-09-20');
    mk('l4a', 4, 'Tom', '', '2026-09-18');
    mk('l6a', 6, 'To trust You with the move', '', '2026-09-30'); mk('l6b', 6, 'Patience with my kids', '', '2026-10-02');
    const ans = (id: string, on: string, answer: string, list: number, name: string, request: string, added: string) => { h.people.push(person(id, list, name, request, added)); h.answered.push({ personId: id, on, answer, list, name, request }); };
    ans('a1', '2026-10-14', 'The surgery went well, and she is walking again.', 2, 'Marta', 'Her hip surgery', '2026-09-01');
    ans('a2', '2026-10-09', '', 4, 'Ben', 'A safe trip home', '2026-09-20');
    ans('a3', '2026-09-28', 'A steady job, starting in October.', 6, 'A steady job', '', '2026-09-02');
    ans('a4', '2025-12-20', 'They found a house near the school.', 1, 'Marcus', 'A place to live', '2025-11-02');
    h.prayerMarks.push({ id: '2026-09-10|a1', personId: 'a1', date: '2026-09-10', asks: ['provide'] }, { id: '2026-09-17|a1', personId: 'a1', date: '2026-09-17', asks: ['provide', 'protect'] });
  }),
  /** Guide Studio's Today, "New card · first open" (Component Review guide7; Flow Board R1·03): Ray, Tue Oct 13, 7:05 am. */
  'first-open': fx(new Date(2026, 9, 13, 7, 5), (h) => { h.reminders.firstDay = '2026-10-13'; }),
  /** The Component Review's Morning steps sample day: Ray, Wed Oct 14, 6:30 am, nothing done yet (the first day). */
  'morning-oct14': fx(new Date(2026, 9, 14, 6, 30), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); }),
  /** Between walks (no approved whole phone; checked by rule): Ray, Wed Oct 14, 6:48 am, his morning done. */
  /** Frame Studio 3 only: Oct 14, 3:10 pm, Morning done, Evening started early (2 of 7). */
  /** T25 (3-6j): the Classic keeps her own place. One Classic evening done (Oct 13, reading 18, the last of Lawrence), so her next reading is the first of Drummond on any date. */
  'studio-early-evening-drummond': fx(new Date(2026, 9, 14, 15, 10), (h) => { h.reminders.firstDay = '2026-10-14'; h.reminders.startHereClosed = true; h.dayMarks.push({ key: '2026-10-13|pm.classic', date: '2026-10-13', step: 'pm.classic', state: 'done', at: 1, value: 18 }); }),
  'studio-early-evening': fx(new Date(2026, 9, 14, 15, 10), (h) => { h.reminders.firstDay = '2026-10-14'; h.reminders.startHereClosed = true; doneDay(h, '2026-10-14', [...MORNING, ...EVENING.slice(0, 2)]); }),
  'between-walks': fx(new Date(2026, 9, 14, 6, 48), (h) => { h.reminders.firstDay = '2026-10-14'; h.reminders.startHereClosed = true; doneDay(h, '2026-10-14', MORNING); }),
  /** The Component Review's Evening steps sample day: Ray, Wed Oct 14, 9:05 pm, his morning done (Classic, Study Notes and Dig Deeper phones, 920, 1009). */
  'evening-oct14': fx(new Date(2026, 9, 14, 21, 5), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); doneDay(h, '2026-10-14', MORNING); }),
  /** Evening steps 7 (Meditate) as the Review draws it: Ray, Wed Oct 14, 9:45 pm, the morning and evening steps 1 to 6 done, so the last step reads "Complete Evening Walk" (parity, Sprint 3.1b chat 9). */
  'evening-oct12-past': fx(new Date(2026, 9, 14, 21, 38), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-01', startHereClosed: true }); doneDay(h, '2026-10-12', [...MORNING, ...EVENING.slice(0, 5)]); }),   // a past day with steps 1 to 5 done, for the Check-In past-day parity pair (Sprint 3.1b chat 11)
  'evening-oct14-last': fx(new Date(2026, 9, 14, 21, 45), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); doneDay(h, '2026-10-14', [...MORNING, ...EVENING.slice(0, 6)]); }),
  /** Prayer as the Review draws it (J-intro, J-p1, J-p4, J-p5): Ray, Wed Oct 14, 9:28 pm, the morning and evening steps 1 to 4 done (Sprint 3.1b chat 13). */
  'evening-oct14-prayer': fx(new Date(2026, 9, 14, 21, 28), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); doneDay(h, '2026-10-14', [...MORNING, ...EVENING.slice(0, 4)]); }),
  /** Prayer's Kingdom part and the nation page as the Review draws them (J-p2, J-nation, J-k320): Ray, Tue Oct 13 (the night of Botswana, Brazil and Brunei), 9:30 pm, the morning and evening steps 1 to 4 done (Sprint 3.1b chat 13, slice 2). */
  'evening-oct13-prayer': fx(new Date(2026, 9, 13, 21, 30), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-13', startHereClosed: true }); doneDay(h, '2026-10-13', [...MORNING, ...EVENING.slice(0, 4)]); }),
  /** Prayer's People part as the Review draws it (J-p3, J-p3d, J-p3s2): Ray, Tue Oct 13, 9:33 pm, steps 1 to 4 done, five Neighbors in the Review's order (the earlier prayers set the rotation), Marcus's Provide chosen (Sprint 3.1b chat 15, slice 3). */
  'evening-oct13-people': fx(new Date(2026, 9, 13, 21, 33), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-05', startHereClosed: true, prayerKeySeen: true, prayerIntroHidden: true }); doneDay(h, '2026-10-13', [...MORNING, ...EVENING.slice(0, 4)]); queue(h, 2, [['Marcus', 'His new job'], ['Dave and Kim', 'Their new baby'], ['Linda', 'Her knee surgery'], ['Tom', ''], ['Priya', 'Moving in March']]); h.prayerMarks.push({ id: '2026-10-13|n2-0', personId: 'n2-0', date: '2026-10-13', asks: ['provide'] }); }),
  /** Saturday's Requests (J-sat): Sat Oct 17, 9:33 pm. */
  'evening-oct17-requests': fx(new Date(2026, 9, 17, 21, 33), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-05', startHereClosed: true, prayerKeySeen: true, prayerIntroHidden: true }); doneDay(h, '2026-10-17', [...MORNING, ...EVENING.slice(0, 4)]); queue(h, 6, [['A new job by spring', ''], ['Patience with my mom', ''], ['Sleep through the night', '']]); }),
  /** Friday's Difficult People (J-fri): Fri Oct 16, 9:33 pm, Gary alone. */
  'evening-oct16-difficult': fx(new Date(2026, 9, 16, 21, 33), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-05', startHereClosed: true, prayerKeySeen: true, prayerIntroHidden: true }); doneDay(h, '2026-10-16', [...MORNING, ...EVENING.slice(0, 4)]); queue(h, 5, [['Gary', 'Our fight at work']]); }),
  /** The Leaders night (p3menu, p3add, p3dark): Wed Oct 14, 9:34 pm, four Leaders. */
  'evening-oct14-leaders': fx(new Date(2026, 9, 14, 21, 34), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-05', startHereClosed: true, prayerKeySeen: true, prayerIntroHidden: true }); doneDay(h, '2026-10-14', [...MORNING, ...EVENING.slice(0, 4)]); queue(h, 3, [['Pastor James', 'Wisdom for our church'], ['Dana', 'A heavy month at work'], ['Mayor Lee', 'Wisdom for our city'], ['Mrs. Ortiz', 'A good school year']]); }),
  /** The Component Review's p3dark (lsph): Wed Oct 14, 10:10 pm, the same four Leaders and Coach Reyes added tonight, dark. */
  'evening-oct14-leaders5': fx(new Date(2026, 9, 14, 22, 10), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-05', startHereClosed: true, prayerKeySeen: true, prayerIntroHidden: true }); doneDay(h, '2026-10-14', [...MORNING, ...EVENING.slice(0, 4)]); queue(h, 3, [['Pastor James', 'Wisdom for our church'], ['Dana', 'A heavy month at work'], ['Mayor Lee', 'Wisdom for our city'], ['Mrs. Ortiz', 'A good school year']]); h.people.push(person('n3-added', 3, 'Coach Reyes', 'Wisdom with his team', '2026-10-14')); }),
  /** Joan, Thu Dec 31, 9:50 pm, her morning and evening steps 1 to 6 done (the name-night Meditate phone, erE6). */
  'evening-dec31-last': { at: new Date(2026, 11, 31, 21, 50), data: (() => { const h = structuredClone(STORIES.joan.data); doneDay(h, '2026-12-31', EVENING.slice(0, 6)); return h; })() },
  /** Evening Walk Complete as the Review draws it (esph h1 to h4): Joan, Tue Oct 13, 9:04 pm, the Evening steps 1 to 6 done and the Morning Walk still open (Sprint 3.1b chat 16). */
  'ewc-oct13': fx(new Date(2026, 9, 13, 21, 4), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-05', startHereClosed: true }); doneDay(h, '2026-10-13', EVENING.slice(0, 6)); }),
  /** Evening Walk Complete on a past day (esph h9): Mon Oct 12 finished in catch-up on Tue Oct 13, 9:31 pm, the Morning Walk of Oct 12 still open. */
  'ewc-oct12-past': fx(new Date(2026, 9, 13, 21, 31), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-05', startHereClosed: true }); doneDay(h, '2026-10-13', MORNING); doneDay(h, '2026-10-12', EVENING.slice(0, 6)); }),
  /** Day Complete (wdph s3, s4): a 12-day streak (Oct 1 to 12) and today, Tue Oct 13, 9:52 pm, the morning and Evening steps 1 to 6 done, so finishing Meditate makes 13 (Sprint 3.1b chat 16). */
  'day-oct13': fx(new Date(2026, 9, 13, 21, 52), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-01', startHereClosed: true }); walked(h, '2026-10-01', '2026-10-12'); doneDay(h, '2026-10-13', [...MORNING, ...EVENING.slice(0, 6)]); }),
  /** The same night with tracking off (wdph s4, dark 10:04 pm). */
  'day-oct13-off': fx(new Date(2026, 9, 13, 22, 4), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-01', startHereClosed: true }); h.settings.tracking = false; walked(h, '2026-10-01', '2026-10-12'); doneDay(h, '2026-10-13', [...MORNING, ...EVENING.slice(0, 6)]); }),
  /** Still Open as the Review draws it (esph h5, h8): Ray, Wed Oct 14, 6:48 am, his first day, Sing and Ask to Hear still open, steps 3 to 7 done (Sprint 3.1b chat 17). */
  'still-oct14': fx(new Date(2026, 9, 14, 6, 48), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); doneDay(h, '2026-10-14', MORNING.slice(2)); }),
  /** Still Open, one left (esph h6): Sing is done too, Ask to Hear is the last step open. */
  'still-oct14-one': fx(new Date(2026, 9, 14, 6, 48), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); doneDay(h, '2026-10-14', [MORNING[0], ...MORNING.slice(2)]); }),
  /** Still Open with a skipped step (esph h7, dark): Bible Reading skipped, Psalm, Proverb, Respond and Memorize done, Sing and Ask to Hear open. */
  'still-oct14-skip': fx(new Date(2026, 9, 14, 6, 48), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); doneDay(h, '2026-10-14', MORNING.slice(2).filter((x) => x !== 'am.reading')); h.dayMarks.push({ key: '2026-10-14|am.reading', date: '2026-10-14', step: 'am.reading' as never, state: 'skipped', at: 0 }); }),
  /** Settings Studio's Today (Component Review settings7, light 390 100%): Sat Oct 24, 9:45 pm, the morning done, a backup due. */
  'evening': fx(new Date(2026, 9, 24, 21, 45), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-24', startHereClosed: true, lastBackup: '2026-10-12' });
    h.people.push(person('e1', 1, 'Karen', '', '2026-10-24')); doneDay(h, '2026-10-24', MORNING); }),
  /** Frame lock 8 (Build 7v): Oct 14, 9:05 pm, the morning and Classic done, so Turn to God's main button must name the next step still open (Study Notes), not Classic. */
  'evening-oct14-classic-done': fx(new Date(2026, 9, 14, 21, 5), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); doneDay(h, '2026-10-14', [...MORNING, 'pm.classic']); }),
  /** Frame lock 8: Nov 12, 9 pm, a six-question Name night (Hates Evil), the morning and the steps before Meditate done but Turn to God, the Check-In and Meditate open (three open). */
  'evening-nov12-three-open': fx(new Date(2026, 10, 12, 21, 0), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); doneDay(h, '2026-11-12', [...MORNING, 'pm.classic', 'pm.notes', 'pm.dig', 'pm.prayer']); }),
  /** Frame lock 8: the same night with only the Check-In open (one step left). */
  'evening-nov12-one-open': fx(new Date(2026, 10, 12, 21, 0), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); doneDay(h, '2026-11-12', [...MORNING, 'pm.turn', 'pm.classic', 'pm.notes', 'pm.dig', 'pm.prayer', 'pm.meditate']); }),
  /** Today Finished Studio (F18), Ray: Wed Oct 14, 9:41 pm, both walks done, his first day. */
  'finished-ray': fx(new Date(2026, 9, 14, 21, 41), (h) => { Object.assign(h.reminders, { firstDay: '2026-10-14', startHereClosed: true }); doneDay(h, '2026-10-14', [...MORNING, ...EVENING]); }),
  /** Today Finished Studio (F18), Joan: Thu Dec 31, 9:53 pm, both walks done, 34-day streak, a backup due. */
  'finished-joan': { at: new Date(2026, 11, 31, 21, 53), data: (() => { const h = structuredClone(STORIES.joan.data); doneDay(h, '2026-12-31', EVENING); return h; })() },
};
export async function playFixture(name: keyof typeof FIXTURES) {
  const s = FIXTURES[name]; setNow(s.at); await replaceHer(structuredClone(s.data)); await init();
}
