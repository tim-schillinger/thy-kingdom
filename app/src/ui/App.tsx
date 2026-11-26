import { resetTips } from './TKC-064-Tip/tips';
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { arrive, motionOff, place, play, px, captureBody, leaveCopy, outMs, fadeAway, arriveParts, type Captured } from './motion';
import { getContent, takeResume } from '../data/content';
import { useHer, today as todayFn, setReminders, setBible, setSettings, replaceHer, getHer } from '../data/store';
import { now } from '../data/clock';
import { planFor } from '../engine/plan';
import { comingUp } from '../engine/comingup';
import { markIndex, walkState, walkCounts, nextOpenStep, dayFinished } from '../engine/progress';
import { addDays, fmtClock, eveningLeads, startOfWeek, weekday, dom, weekdayLetter, month, type CivilDate, fmtMonthYear, fmtMonthDay } from '../engine/dates';
import { STEP_NAMES, type StepId, type Walk as W, type CheckIn } from '../engine/types';
import { WALK, SETTINGS as SET } from '../copy';
import { BottomSheet } from './TKC-004-BottomSheet/BottomSheet';
import { SheetHost } from './patterns/SheetHost';
import { Button } from './TKC-006-Button/Button';
import { Icon, Sheet, Toast } from './bits';
import { Today } from './screens/Today';
import { FirstRun } from './screens/FirstRun';
import { WalkScreen } from './Walk';
import { StillToDo } from './screens/StillToDo';
import { MorningStep, MORNING_STEPS } from './screens/MorningStep';
import { EveningStep, EVENING_BUILT } from './screens/EveningStep';
import { WalkComplete, DayComplete } from './screens/WalkComplete';
import { buildBackupHtml, backupFileName, readBackup, RESTORE_ERRORS } from '../data/backup';
import { Lists } from './screens/Lists';
import { Progress } from './screens/Progress';
import { OpenDays } from './screens/OpenDays';
import { GuideHome } from './screens/GuideHome';
import { StartHere } from './screens/StartHere';
import { GuideWalk, Lesson } from './screens/GuideLessons';
import { GoDeeperPrayer, GoDeeperEntry, GoDeeperAreas } from './screens/GoDeeper';
import { WholeYear } from './screens/WholeYear';
import { SettingsPrivacy } from './screens/SettingsPrivacy';
import { SettingsBooks } from './screens/SettingsBooks';
import { ListRow } from './TKC-015-ListRow/ListRow';
import { Toggle } from './TKC-009-Toggle/Toggle';
import { SettingsShell, SettingsTitle, SettingsPanel, SettingsHead, SettingsPrint, type Place } from './patterns/SettingsPage';
import { EveningSheet, AppearanceSheet, TextSizeSheet, ReminderSheet, AddHomeSheet, reminderNow } from './screens/SettingsSheets';
import { homeScreenOffered } from '../data/platform';
import { StartHereCard } from './TKC-059-StartHereCard/StartHereCard';

export type Route =
  | { s: 'firstrun' }
  | { s: 'today'; date?: CivilDate; from?: 'opendays' }
  | { s: 'step'; walk: W; date: CivilDate; step: StepId; from: 'today' | 'opendays' }
  | { s: 'still'; walk: W; date: CivilDate; from: 'today' | 'opendays' }
  | { s: 'walkdone'; walk: W; date: CivilDate; from: 'today' | 'opendays' }
  | { s: 'daydone'; date: CivilDate; from: 'today' | 'opendays' }
  | { s: 'progress' } | { s: 'opendays' } | { s: 'lists'; tab?: 0 | 1; list?: number; person?: string; record?: string } | { s: 'guide' }
  | { s: 'starthere'; page: number; from: 'guide' | 'today' } | { s: 'guidewalk'; walk: W } | { s: 'lesson'; step: StepId; back?: Route } | { s: 'year'; from?: 'starthere' | 'today' }
  | { s: 'godeeper'; what: 'prayer'; part: 1 | 2 | 3 | 4 | 5 } | { s: 'godeeper'; what: 'checkin'; ci: CheckIn; at: number | 'center' }
  | { s: 'settings' } | { s: 'sources' } | { s: 'privacy' };
export type Nav = (r: Route, o?: { keepScroll?: boolean }) => void;

let navRef: Nav = () => {};
export const navigate = (r: Route) => navRef(r);
/** The app-level toast: a message that must outlive the screen that raised it (357: "Backup restored." is raised on Settings, which closes as she goes to Today). */
let toastRef: (t: string) => void = () => {};

/** How deep a Guide page sits, for the sideways drill: the Guide's home, then a walk's list and Your Whole Year. */
const DEPTH: Record<string, number> = { guide: 0, guidewalk: 1, year: 1 };
const WALKISH = new Set(['step', 'still', 'walkdone', 'daydone', 'starthere', 'lesson', 'godeeper']);
/** The page swap (motion-lock-2 §2a: out before in, so two pages never read together). The old page is copied while it is still on screen, before anything scrolls, and is gone in `outMs`:
 *  going deeper in the Guide (home ↔ a walk's list, Your Whole Year), it leaves sideways and the new page's parts settle in from the other side, the tab bar still;
 *  into a walk or lesson, it fades and the new page fades in while its parts rise (M5, M12); leaving one, the copy drops and fades (M5); between tabs, a fade through (M6).
 *  Step to step and lesson to lesson are the body swap in motion.ts (M1, M17). */
function usePageMotion(s: Route['s']) {
  const prev = useRef(s), old = useRef<HTMLElement | null>(null), drill = useRef<Captured | null>(null);
  if (prev.current !== s && !motionOff()) {
    if (DEPTH[s] !== undefined && DEPTH[prev.current] !== undefined) drill.current = captureBody(document.getElementById('app')?.firstElementChild ?? null, 'main', '[data-tkc="TKC-001"]', true);
    old.current = (document.getElementById('app')?.firstElementChild as HTMLElement | null)?.cloneNode(true) as HTMLElement | null ?? null;
  }
  useLayoutEffect(() => {
    const from = prev.current; prev.current = s; const g = old.current; old.current = null;
    const d = drill.current; drill.current = null;
    if (from === s || motionOff()) return;
    const root = document.getElementById('app')?.firstElementChild as HTMLElement | null; if (!root) return;
    const fadeIn = () => play(root, [{ opacity: 0 }, { opacity: 1 }], { token: 'short', ease: 'gentle', delay: outMs(), fill: 'backwards' });
    if (d && DEPTH[s] !== DEPTH[from]) {   // deeper or back in the Guide: sideways, the tab bar still
      const dir = DEPTH[s] > DEPTH[from] ? 1 : -1, side = dir > 0 ? 'right' : 'left';
      leaveCopy(d, dir);
      const tb = root.querySelector('[data-tkc="TKC-002"]'), m = root.querySelector('main');
      if (tb) arrive(tb, { from: side, delay: outMs() });
      if (m) arriveParts([...m.children], side, outMs());
      return;
    }
    if (WALKISH.has(s)) { if (g) place(g, (c) => fadeAway(c), { fixed: true }); fadeIn(); const m = root.querySelector('main'); if (m) arriveParts([...m.children], 'page', outMs()); }
    else if (WALKISH.has(from) && g) { place(g, (c) => fadeAway(c, { drop: px('rise') }), { fixed: true }); fadeIn(); }
    else { if (g) place(g, (c) => fadeAway(c), { fixed: true }); fadeIn(); }
  }, [s]);
}

export function App() {
  const her = useHer();
  const [route, setRoute] = useState<Route>(() => her.reminders.firstRunDone ? (takeResume<Route>() ?? { s: 'today' }) : { s: 'firstrun' });   // after Try Again's reload she is back on her step (1669)
  // The page scrolls to the top after the old page has been copied (motion-lock-2: the page that leaves never jumps first), in the layout effect below.
  const toTop = useRef(false);
  const nav: Nav = (r, o) => { setRoute(r); if (!o?.keepScroll) toTop.current = true; };
  useLayoutEffect(() => { if (toTop.current) { toTop.current = false; window.scrollTo(0, 0); } });
  navRef = nav;
  const [appToast, setAppToast] = useState('');
  toastRef = setAppToast;
  useEffect(() => { if (!her.reminders.firstRunDone && route.s !== 'firstrun') setRoute({ s: 'firstrun' }); }, [her.reminders.firstRunDone]);
  useTheme(her.settings.appearance, her.settings.textSize);
  usePageMotion(route.s);
  return <>{screenFor(route, nav)}{appToast && <Toast text={appToast} onDone={() => setAppToast('')} />}</>;
}

function screenFor(route: Route, nav: Nav) {
  switch (route.s) {
    case 'firstrun': return <FirstRun nav={nav} />;
    case 'today': return <Today route={route} nav={nav} />;
    case 'step': return route.walk === 'morning' && MORNING_STEPS.includes(route.step) ? <MorningStep route={route} nav={nav} /> : route.walk === 'evening' && EVENING_BUILT.includes(route.step) ? <EveningStep route={route} nav={nav} /> : <WalkScreen route={route} nav={nav} />;
    case 'still': return <StillToDo route={route} nav={nav} />;
    case 'walkdone': return <WalkComplete route={route} nav={nav} />;
    case 'daydone': return <DayComplete route={route} nav={nav} />;
    case 'progress': return <Progress nav={nav} />;
    case 'opendays': return <OpenDays nav={nav} />;
    case 'lists': return <Lists route={route} nav={nav} />;
    case 'guide': return <GuideHome nav={nav} />;
    case 'starthere': return <StartHere route={route} nav={nav} />;
    case 'guidewalk': return <GuideWalk walk={route.walk} nav={nav} />;
    case 'lesson': return <Lesson step={route.step} back={route.back} nav={nav} />;
    case 'godeeper': return route.what === 'prayer' ? <GoDeeperPrayer key={route.part} part={route.part} nav={nav} /> : route.at === 0 ? <GoDeeperEntry ci={route.ci} nav={nav} /> : <GoDeeperAreas ci={route.ci} at={route.at} nav={nav} />;
    case 'year': return <WholeYear route={route} nav={nav} />;
    case 'settings': return <Settings nav={nav} />;
    case 'sources': return <SettingsBooks nav={nav} />;
    case 'privacy': return <SettingsPrivacy nav={nav} />;
  }
}

function useTheme(appearance: string, size: string) {
  useEffect(() => {
    const dark = appearance === 'dark' || (appearance === 'phone' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    const ts = { phone: 1, regular: 1, large: 1.25, larger: 1.5, largest: 2 }[size as 'phone'] ?? 1;   // the locked sizes (1241, 1256)
    document.documentElement.style.setProperty('--ts', String(ts));
    document.documentElement.toggleAttribute('data-text-large', ts >= 2); // large-text layouts (TKC-023 E, TKC-025 E): one switch, not a style query
  }, [appearance, size]);
}

function TabBar({ current, nav }: { current: 'today' | 'lists' | 'guide' | 'settings'; nav: Nav }) {
  const tabs = [['today', 'Today', 'House'], ['lists', 'Lists', 'Hands'], ['guide', 'Guide', 'Books'], ['settings', 'Settings', 'Gear']] as const;
  return <nav class="tabbar" aria-label="Tabs">{tabs.map(([k, label, icon]) => <button key={k} aria-current={current === k ? 'page' : undefined} onClick={() => nav({ s: k } as Route)}>
    <Icon n={(current === k ? `${icon}Fill` : icon) as any} />{label}</button>)}</nav>;
}

/** The backup reminder card (1292, 1297, 1298): only once she has something to lose and a backup is due. */
export function backupCardDue(her: ReturnType<typeof getHer>, t: CivilDate) {
  const s = her.settings.backupReminder ?? (matchMedia('(display-mode: standalone)').matches ? 'month' : 'week');
  if (s === 'off') return false;
  const walkedDays = new Set(her.dayMarks.filter((m) => m.state === 'done').map((m) => m.date)).size;
  if (!her.people.length && walkedDays < 7) return false;
  if (her.reminders.backupCardHiddenUntil && t < her.reminders.backupCardHiddenUntil) return false;
  const last = her.reminders.lastBackup;
  return !last || t >= addDays(last, s === 'month' ? 30 : 7);
}
export function PickADay({ date, first, onClose, onPick }: { date: CivilDate; first: CivilDate | null; onClose: () => void; onPick: (d: CivilDate) => void }) {
  const t = todayFn();
  const [mon, setMon] = useState(date.slice(0, 7) + '-01');
  const days = Array.from({ length: 42 }, (_, i) => addDays(addDays(mon, -weekday(mon)), i));
  const idx = markIndex(getHer().dayMarks);
  const min = first ? startOfWeek(first) : t, max = addDays(startOfWeek(t), 13);
  return <Sheet label="Pick a Day" onClose={onClose}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2 class="label">Pick a Day</h2><button class="icon-btn" aria-label="Close" onClick={onClose}><Icon n="X" /></button></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}><button class="icon-btn" aria-label="Previous month" onClick={() => setMon(addDays(mon, -1).slice(0, 7) + '-01')}><Icon n="CaretLeft" /></button>
      <span class="chapter-title" style={{ margin: '0px' }}>{fmtMonthYear(mon)}</span><button class="icon-btn" aria-label="Next month" onClick={() => setMon(addDays(mon, 32).slice(0, 7) + '-01')}><Icon n="CaretRight" /></button></div>
    <div class="weekstrip" style={{ margin: '8px 0 0' }}>{days.map((d) => { const out = d < min || d > max || month(d) !== month(mon); const f = dayFinished(idx, d);
      return <button key={d} disabled={out} style={{ opacity: out ? 0.45 : 1, minHeight: '52px' }} class={d === t ? 'ws-today' : ''} onClick={() => onPick(d)}><span class="ws-day" style={{ width: '32px', height: '32px', fontSize: '16px' }}>{dom(d)}</span><span class="ws-mark">{f ? <Icon n="Check" size={12} /> : ''}</span></button>; })}</div>
    <p class="caption muted" style={{ marginTop: '8px' }}>✓ Both walks · ◐ One walk</p>
  </Sheet>;
}

// ---------- Settings: the Your Data rows the backup check needs (1281); the rest of Settings at the screen pass ----------
/** 583 (A17): the app only says "saved" when the share sheet confirms. A download it can't confirm reads "made". */
export async function saveBackup(): Promise<false | 'saved' | 'made'> {
  const c = getContent(); const t = todayFn();
  const html = buildBackupHtml(getHer(), c, t);
  const file = new File([html], backupFileName(t), { type: 'text/html' });
  let kind: 'saved' | 'made' = 'saved';
  try {
    if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file] });
    else { kind = 'made'; const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
  } catch { return false; } // she closed the share sheet: nothing changes
  setReminders({ lastBackup: t, lastBackupKind: kind });
  return kind;
}

function RestoreLink({ label, cls, row, onError, after }: { label: string; cls?: string; /** Settings: a setting row with its icon (TKC-015) */ row?: boolean; onError: (s: string) => void; after: () => void }) {
  const [pending, setPending] = useState<{ data: any; savedAt: string } | null>(null);
  const pick = useRef<HTMLInputElement>(null);
  const input = <input ref={pick} type="file" accept=".html,text/html" hidden data-restore onChange={async (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
      const r = readBackup(await f.text());
      if (!r.ok) onError(RESTORE_ERRORS[r.error]); else setPending({ data: r.data, savedAt: r.savedAt });
    }} />;
  return <>
    {row ? <><ListRow kind="setting" name={label} icon="clockCcw" onClick={() => pick.current?.click()} />{input}</>
      : <label class={cls} style={{ display: 'flex' }}>{label}{input}</label>}
    {pending && <SheetHost onClose={() => setPending(null)}><BottomSheet kind="confirm" title={`Replace what’s on this phone with your backup from ${fmtMonthDay(pending.savedAt)}?`} line="Your lists, answered prayers, progress, and settings on this phone will be replaced." onClose={() => setPending(null)}>
      <Button label="Replace" kind="secondary" onClick={async () => { await replaceHer({ ...pending.data, reminders: { ...pending.data.reminders, firstRunDone: true } }); setPending(null); after(); }} />
      <Button label="Cancel" kind="quiet" onClick={() => setPending(null)} /></BottomSheet></SheetHost>}
  </>;
}

/** The test build's name, shown at the foot of Settings so a screenshot says which build it is (A23). Alpha only: retired before v1. */
const BUILD = 'Alpha 3-6m';
type SettingsOpen = null | 'evening' | 'appearance' | 'textSize' | 'reminder' | 'addhome';
function Settings({ nav }: { nav: Nav }) {
  const her = useHer();
  const [toast, setToast] = useState('');
  const [erase, setErase] = useState(false);
  const [open, setOpen] = useState<SettingsOpen>(null);
  const last = her.reminders.lastBackup;
  const go = (p: Place) => nav({ s: p.toLowerCase() } as Route);
  const H = SET.heads;
  const offerHome = homeScreenOffered();   // an iPhone in a Safari tab, not yet on the Home Screen (1260, 1264)
  return <SettingsShell view="home" onTab={go}>
    <SettingsTitle>{SET.title}</SettingsTitle>
    {offerHome && !her.reminders.homeCardClosed && <StartHereCard kind="home-screen" place="settings" onGo={() => setOpen('addhome')} onClose={() => setReminders({ homeCardClosed: true })} />}
    <SettingsPanel label="Bible and Books" icons><ListRow kind="setting" name="Bible and Books" icon="bookOpen" chevron onClick={() => nav({ s: 'sources' })} /></SettingsPanel>
    <SettingsHead>{H.walks}</SettingsHead>
    <SettingsPanel label={H.walks} icons><ListRow kind="setting" name={SET.evening.name} icon="moonStars" value={fmtClock(her.settings.eveningStart)} chevron hook="evening" onClick={() => setOpen('evening')} /></SettingsPanel>
    <SettingsPrint>{SET.evening.print}</SettingsPrint>
    <SettingsHead>{H.progress}</SettingsHead>
    <SettingsPanel label={H.progress} icons><Toggle name={SET.tracking.name} icon="plantReg" on={her.settings.tracking} onChange={(on) => { setSettings({ tracking: on }); if (!on) setToast('Progress hidden.'); }} /></SettingsPanel>
    <SettingsPrint>{her.settings.tracking ? SET.tracking.on : SET.tracking.off}</SettingsPrint>
    <SettingsHead>{H.display}</SettingsHead>
    <SettingsPanel label={H.display} icons>
      <ListRow kind="setting" name={SET.appearance.name} icon="sun" value={SET.appearance.values[her.settings.appearance]} chevron hook="appearance" onClick={() => setOpen('appearance')} />
      <ListRow kind="setting" name={SET.textSize.name} icon="textAa" value={SET.textSize.values[her.settings.textSize]} chevron hook="textSize" onClick={() => setOpen('textSize')} />
    </SettingsPanel>
    <SettingsHead>{H.data}</SettingsHead>
    <SettingsPanel label={H.data} icons>
      <ListRow kind="setting" name={SET.data.save} icon="downloadSimple" hook="save" sub={last ? `${her.reminders.lastBackupKind === 'made' ? 'Last made' : 'Last saved'} ${fmtMonthDay(last)}` : 'Not saved yet'}
        onClick={async () => { const r = await saveBackup(); if (r) setToast(r === 'saved' ? 'Backup saved.' : 'Backup file made. Look for it in your Downloads.'); }} />
      <RestoreLink row label={SET.data.restore} onError={setToast} after={() => { toastRef('Backup restored.'); nav({ s: 'today' }); }} />
    </SettingsPanel>
    <SettingsPrint>{SET.data.print}</SettingsPrint>
    <SettingsPanel label={SET.reminder.name} icons><ListRow kind="setting" name={SET.reminder.name} icon="bell" value={SET.reminder.values[reminderNow(her.settings)]} chevron hook="reminder" onClick={() => setOpen('reminder')} /></SettingsPanel>
    <SettingsPrint>{SET.reminder.print}</SettingsPrint>
    <SettingsPanel label={SET.privacy.name} icons>
      <ListRow kind="setting" name={SET.privacy.name} icon="shieldCheck" chevron hook="privacy" onClick={() => nav({ s: 'privacy' })} />
      <ListRow kind="setting" name={SET.data.erase} icon="trash" hook="erase" onClick={() => setErase(true)} />
    </SettingsPanel>
    {offerHome && <SettingsPanel label={SET.addHome.name} icons><ListRow kind="setting" name={SET.addHome.name} icon="deviceMobile" chevron hook="addhome" onClick={() => setOpen('addhome')} /></SettingsPanel>}
    <SettingsPrint build>{BUILD}</SettingsPrint>
    {open === 'evening' && <EveningSheet onClose={() => setOpen(null)} />}
    {open === 'appearance' && <AppearanceSheet onClose={() => setOpen(null)} />}
    {open === 'textSize' && <TextSizeSheet onClose={() => setOpen(null)} />}
    {open === 'reminder' && <ReminderSheet onClose={() => setOpen(null)} />}
    {open === 'addhome' && <AddHomeSheet hasLists={her.people.length > 0} onSave={async () => { const r = await saveBackup(); if (r) setToast(r === 'saved' ? 'Backup saved.' : 'Backup file made. Look for it in your Downloads.'); }} onClose={() => setOpen(null)} />}
    {erase && <SheetHost onClose={() => setErase(false)}><BottomSheet kind="confirm" title="Erase everything on this phone?" line="This removes your lists, answered prayers, progress, and settings. It can’t be undone." onClose={() => setErase(false)}>
      <Button label="Save a Backup First" kind="secondary" onClick={() => saveBackup()} />
      <Button label="Erase Everything" kind="secondary" onClick={async () => { await replaceHer(null); resetTips(); setErase(false); nav({ s: 'firstrun' }); }} />
      <Button label="Cancel" kind="quiet" onClick={() => setErase(false)} /></BottomSheet></SheetHost>}
    {toast && <Toast text={toast} onDone={() => setToast('')} />}
  </SettingsShell>;
}

