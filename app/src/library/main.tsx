// The library page (build-standards §5.5): every component in every state, headed by its ID. Test builds only.
// The code twin of the Component Review. `window.__lib.solo()` renders one instance for the parity checker.
import { render } from 'preact';
import '@fontsource/eb-garamond/latin-500.css';
import '@fontsource/literata/latin-400.css';
import '@fontsource/literata/latin-400-italic.css';
import '@fontsource/literata/latin-600.css';
import '@fontsource/atkinson-hyperlegible-next/latin-400.css';
import '@fontsource/atkinson-hyperlegible-next/latin-500.css';
import '@fontsource/atkinson-hyperlegible-next/latin-600.css';
import '../ui/foundations.css';
import './library.css';
import type { FunctionComponent } from 'preact';
import { Button } from '../ui/TKC-006-Button/Button';
import * as ButtonStates from '../ui/TKC-006-Button/states';
import { TabBar } from '../ui/TKC-001-TabBar/TabBar'; import * as TabBarStates from '../ui/TKC-001-TabBar/states';
import { TopBar } from '../ui/TKC-002-TopBar/TopBar'; import * as TopBarStates from '../ui/TKC-002-TopBar/states';
import { ActionBar } from '../ui/TKC-003-ActionBar/ActionBar'; import * as ActionBarStates from '../ui/TKC-003-ActionBar/states';
import { WeekStrip } from '../ui/TKC-023-WeekStrip/WeekStrip'; import * as WeekStripStates from '../ui/TKC-023-WeekStrip/states';
import { HeroCard } from '../ui/TKC-024-HeroCard/HeroCard'; import * as HeroStates from '../ui/TKC-024-HeroCard/states';
import { WalkLine } from '../ui/TKC-025-WalkLine/WalkLine'; import * as WalkLineStates from '../ui/TKC-025-WalkLine/states';
import { Streak } from '../ui/TKC-026-Streak/Streak'; import * as StreakStates from '../ui/TKC-026-Streak/states';
import { ComingUp } from '../ui/TKC-027-ComingUp/ComingUp'; import * as ComingUpStates from '../ui/TKC-027-ComingUp/states';
import { VerseCard } from '../ui/TKC-033-VerseCard/VerseCard'; import * as VerseStates from '../ui/TKC-033-VerseCard/states';
import { StartHereCard } from '../ui/TKC-059-StartHereCard/StartHereCard'; import * as StartHereStates from '../ui/TKC-059-StartHereCard/states';
import { Tag } from '../ui/TKC-017-Tag/Tag'; import * as TagStates from '../ui/TKC-017-Tag/states';
import { Checkbox } from '../ui/TKC-010-Checkbox/Checkbox'; import * as CheckboxStates from '../ui/TKC-010-Checkbox/states';
import { TextLink } from '../ui/TKC-007-TextLink/TextLink'; import * as TextLinkStates from '../ui/TKC-007-TextLink/states';
import { Chip } from '../ui/TKC-008-Chip/Chip'; import * as ChipStates from '../ui/TKC-008-Chip/states';
import { ListRow } from '../ui/TKC-015-ListRow/ListRow'; import * as RowStates from '../ui/TKC-015-ListRow/states';
import { Toggle } from '../ui/TKC-009-Toggle/Toggle'; import * as ToggleStates from '../ui/TKC-009-Toggle/states';
import { InfoRow } from '../ui/TKC-016-InfoRow/InfoRow'; import * as InfoStates from '../ui/TKC-016-InfoRow/states';
import { Toast } from '../ui/TKC-018-Toast/Toast'; import * as ToastStates from '../ui/TKC-018-Toast/states';
import { EmptyState } from '../ui/TKC-019-EmptyState/EmptyState'; import * as EmptyStates from '../ui/TKC-019-EmptyState/states';
import { InlineNotice } from '../ui/TKC-020-InlineNotice/InlineNotice'; import * as NoticeStates from '../ui/TKC-020-InlineNotice/states';
import { Disclosure } from '../ui/TKC-014-Disclosure/Disclosure'; import * as DisclosureStates from '../ui/TKC-014-Disclosure/states';
import { ChoiceRow } from '../ui/TKC-012-ChoiceRow/ChoiceRow'; import * as ChoiceStates from '../ui/TKC-012-ChoiceRow/states';
import { TextField } from '../ui/TKC-011-TextField/TextField'; import * as FieldStates from '../ui/TKC-011-TextField/states';
import { Tabs } from '../ui/TKC-053-Tabs/Tabs'; import * as TabsStates from '../ui/TKC-053-Tabs/states';
import { SheetFromSpec } from '../ui/TKC-004-BottomSheet/Demo'; import * as SheetStates from '../ui/TKC-004-BottomSheet/states';
import { SourceLine } from '../ui/TKC-031-SourceLine/SourceLine'; import * as SrcStates from '../ui/TKC-031-SourceLine/states';
import { StepHeader } from '../ui/TKC-030-StepHeader/StepHeader'; import * as HdStates from '../ui/TKC-030-StepHeader/states';
import { AnchorLine } from '../ui/TKC-052-AnchorLine/AnchorLine'; import * as AncStates from '../ui/TKC-052-AnchorLine/states';
import { WinMark } from '../ui/TKC-022-WinMark/WinMark'; import * as WinStates from '../ui/TKC-022-WinMark/states';
import { StatusMark } from '../ui/TKC-021-StatusMark/StatusMark'; import * as MarkStates from '../ui/TKC-021-StatusMark/states';
import { StepListSheet } from '../ui/TKC-005-StepListSheet/StepListSheet'; import * as StepSheetStates from '../ui/TKC-005-StepListSheet/states';
import { Stepper } from '../ui/TKC-028-Stepper/Stepper'; import * as StepperStates from '../ui/TKC-028-Stepper/states';
import { ReadingBlock } from '../ui/TKC-032-ReadingBlock/ReadingBlock'; import * as RbStates from '../ui/TKC-032-ReadingBlock/states';
import { HymnBlock } from '../ui/TKC-034-HymnBlock/HymnBlock'; import * as HymnStates from '../ui/TKC-034-HymnBlock/states';
import { PrayerWords } from '../ui/TKC-035-PrayerWords/PrayerWords'; import * as PwStates from '../ui/TKC-035-PrayerWords/states';
import { SpokenPrompt } from '../ui/TKC-036-SpokenPrompt/SpokenPrompt'; import * as SpStates from '../ui/TKC-036-SpokenPrompt/states';
import { AskYourself } from '../ui/TKC-039-AskYourself/AskYourself'; import * as AskStates from '../ui/TKC-039-AskYourself/states';
import { JoinedCard } from '../ui/TKC-062-JoinedCard/JoinedCard'; import * as JoinedCardStates from '../ui/TKC-062-JoinedCard/states';
import { CheckInRow } from '../ui/TKC-046-CheckInRow/CheckInRow'; import * as CiStates from '../ui/TKC-046-CheckInRow/states';
import { AudioPlayer } from '../ui/TKC-051-AudioPlayer/AudioPlayer'; import * as ApStates from '../ui/TKC-051-AudioPlayer/states';
import { PrayerProgress } from '../ui/TKC-040-PrayerProgress/PrayerProgress'; import * as PpStates from '../ui/TKC-040-PrayerProgress/states';
import { NationRow } from '../ui/TKC-041-NationRow/NationRow'; import * as NrStates from '../ui/TKC-041-NationRow/states';
import { LocatorMap } from '../ui/TKC-042-LocatorMap/LocatorMap'; import * as LmStates from '../ui/TKC-042-LocatorMap/states';
import { PersonPrayerRow } from '../ui/TKC-043-PersonPrayerRow/PersonPrayerRow'; import * as PprStates from '../ui/TKC-043-PersonPrayerRow/states';
import { PrayerKey } from '../ui/TKC-044-PrayerKey/PrayerKey'; import * as PkStates from '../ui/TKC-044-PrayerKey/states';
import { MutedDoneList } from '../ui/TKC-045-MutedDoneList/MutedDoneList'; import * as MdlStates from '../ui/TKC-045-MutedDoneList/states';
import { ListPickerRow } from '../ui/TKC-047-ListPickerRow/ListPickerRow'; import * as LprStates from '../ui/TKC-047-ListPickerRow/states';
import { SortMenu } from '../ui/TKC-048-SortMenu/SortMenu'; import * as SmStates from '../ui/TKC-048-SortMenu/states';
import { AnswerCard } from '../ui/TKC-049-AnswerCard/AnswerCard'; import * as AcStates from '../ui/TKC-049-AnswerCard/states';
import { MetricTile } from '../ui/TKC-050-MetricTile/MetricTile'; import * as MtStates from '../ui/TKC-050-MetricTile/states';
import { GrowthPlant } from '../ui/TKC-055-GrowthPlant/GrowthPlant'; import * as GpStates from '../ui/TKC-055-GrowthPlant/states';
import { MilestonePath } from '../ui/TKC-056-MilestonePath/MilestonePath'; import * as MpStates from '../ui/TKC-056-MilestonePath/states';
import { OpenDayRow } from '../ui/TKC-057-OpenDayRow/OpenDayRow'; import * as OdStates from '../ui/TKC-057-OpenDayRow/states';
import { SelectBar } from '../ui/TKC-058-SelectBar/SelectBar'; import * as SbStates from '../ui/TKC-058-SelectBar/states';
import { MonthCalendar } from '../ui/TKC-054-MonthCalendar/MonthCalendar'; import * as McStates from '../ui/TKC-054-MonthCalendar/states';
import { Tip } from '../ui/TKC-064-Tip/Tip'; import * as TipStates from '../ui/TKC-064-Tip/states';
import { AreaCircle } from '../ui/TKC-060-AreaCircle/AreaCircle'; import * as AcirStates from '../ui/TKC-060-AreaCircle/states';
import { TodayView } from '../ui/patterns/Today';
import { TODAY } from './today-states';
import { STEPS2 } from './step-states-2';
import { STEPS3 } from './step-states-3';
import { STEPS4 } from './step-states-4';
import { ProverbsExtras } from '../ui/TKC-037-ProverbsExtras/ProverbsExtras'; import * as PeStates from '../ui/TKC-037-ProverbsExtras/states';
import { STEPS } from './step-states';
import { APP_SHOTS } from './app-shots';

type Entry = { mod: { ID: string; NAME: string; VERSION: string; STATES: Array<{ name: string; props: any }> }; C: FunctionComponent<any>; wash?: boolean };
const LIBRARY: Entry[] = [
  { mod: ButtonStates, C: Button }, { mod: TabBarStates, C: TabBar }, { mod: TopBarStates, C: TopBar, wash: true }, { mod: ActionBarStates, C: ActionBar, wash: true },
  { mod: WeekStripStates, C: WeekStrip }, { mod: HeroStates, C: HeroCard }, { mod: WalkLineStates, C: WalkLine }, { mod: StreakStates, C: Streak },
  { mod: ComingUpStates, C: ComingUp }, { mod: VerseStates, C: VerseCard }, { mod: StartHereStates, C: StartHereCard },
  { mod: TextLinkStates, C: TextLink }, { mod: ChipStates, C: Chip }, { mod: CheckboxStates, C: Checkbox }, { mod: TagStates, C: Tag },
  { mod: ToastStates, C: Toast }, { mod: InfoStates, C: InfoRow }, { mod: RowStates, C: ListRow }, { mod: ToggleStates, C: Toggle }, { mod: EmptyStates, C: EmptyState }, { mod: NoticeStates, C: InlineNotice }, { mod: DisclosureStates, C: Disclosure }, { mod: ChoiceStates, C: ChoiceRow }, { mod: FieldStates, C: TextField }, { mod: TabsStates, C: Tabs }, { mod: SheetStates, C: SheetFromSpec }, { mod: StepSheetStates, C: StepListSheet }, { mod: MarkStates, C: StatusMark }, { mod: WinStates, C: WinMark }, { mod: AncStates, C: AnchorLine }, { mod: HdStates, C: StepHeader }, { mod: SrcStates, C: SourceLine },
  { mod: StepperStates, C: Stepper }, { mod: RbStates, C: ReadingBlock }, { mod: HymnStates, C: HymnBlock }, { mod: PwStates, C: PrayerWords }, { mod: SpStates, C: SpokenPrompt }, { mod: AskStates, C: AskYourself }, { mod: JoinedCardStates, C: JoinedCard }, { mod: CiStates, C: CheckInRow }, { mod: ApStates, C: AudioPlayer },
 { mod: PpStates, C: PrayerProgress }, { mod: NrStates, C: NationRow }, { mod: LmStates, C: LocatorMap }, { mod: PprStates, C: PersonPrayerRow }, { mod: PkStates, C: PrayerKey }, { mod: MdlStates, C: MutedDoneList },
 { mod: LprStates, C: ListPickerRow }, { mod: SmStates, C: SortMenu }, { mod: AcStates, C: AnswerCard },
 { mod: MtStates, C: MetricTile }, { mod: GpStates, C: GrowthPlant }, { mod: MpStates, C: MilestonePath }, { mod: OdStates, C: OpenDayRow }, { mod: SbStates, C: SelectBar }, { mod: McStates, C: MonthCalendar }, { mod: AcirStates, C: AreaCircle }, { mod: TipStates, C: Tip }, { mod: PeStates, C: ProverbsExtras },
];
const BY_ID: Record<string, FunctionComponent<any>> = Object.fromEntries(LIBRARY.map((e) => [e.mod.ID, e.C]));
BY_ID.TODAY = TodayView;

function Column({ theme, scale }: { theme: 'light' | 'dark'; scale: number }) {
  return <div class="lib-col" data-theme={theme} data-text-large={scale >= 1.5 ? '' : undefined} data-text-xl={scale >= 2 ? '' : undefined} style={{ '--ts': scale }}>
    <p class="lib-colhead">{theme === 'light' ? 'Light' : 'Dark'} · {scale * 100}% text · 390 px</p>
    {LIBRARY.map(({ mod, C, wash }) => <section key={mod.ID} class="lib-comp"><h2 class="lib-cid">{mod.ID} {mod.NAME}</h2>{mod.STATES.map((s) => <div class="lib-cell" key={s.name}>
      <p class="lib-name">{s.name}</p><div class="lib-host" data-wash={wash ? 'dawn' : undefined}><C {...s.props} /></div></div>)}</section>)}
  </div>;
}

function Library() {
  return <main class="lib">
    <header class="lib-head"><h1>Thy Kingdom · Library</h1><p>{LIBRARY.map((e) => `${e.mod.ID} ${e.mod.NAME} ${e.mod.VERSION} (${e.mod.STATES.length})`).join(' · ')}</p></header>
    <section class="lib-today"><h2 class="lib-h2">Today, built from the library only</h2>
      <p class="lib-sub">Four states, plus the evening in dark. Each phone is 390 × 844 and scrolls inside.</p>
      <div class="lib-phones">{[...TODAY.map((t) => ({ ...t, theme: 'light' as const })), { ...TODAY[2], name: 'Evening leads · dark', theme: 'dark' as const }].map((t) =>
        <figure class="lib-phone-fig" key={t.name}><figcaption><b>{t.name}</b><span>{t.note}</span></figcaption>
          <div class="lib-phone" data-theme={t.theme}><TodayView {...t.props} /></div></figure>)}</div></section>
    <section class="lib-today"><h2 class="lib-h2">Morning steps 1 to 3 and the hymnal sheet, built from the library only</h2>
      <p class="lib-sub">The step screen’s frame, then Sing, Ask to Hear and Psalm. The last six have no approved phone, so your eye is the check.</p>
      <div class="lib-phones">{STEPS.map((t) => <figure class="lib-phone-fig" key={t.name}><figcaption><b>{t.name}</b><span>{t.note}</span></figcaption>
        <div class={t.sheet ? 'lib-phone lib-phone--sheet' : 'lib-phone'} data-theme={t.theme ?? 'light'}>{t.el()}</div></figure>)}</div></section>
    <section class="lib-today"><h2 class="lib-h2">Morning steps 4 to 7, the Change verse sheet and Walk Complete, built from the library only</h2>
      <p class="lib-sub">Proverb, Bible Reading, Respond, Memorize, then the morning’s end. None has an approved whole phone, so your eye is the check.</p>
      <div class="lib-phones">{STEPS2.map((t) => <figure class="lib-phone-fig" key={t.name}><figcaption><b>{t.name}</b><span>{t.note}</span></figcaption>
        <div class={t.sheet ? 'lib-phone lib-phone--sheet' : 'lib-phone'} data-theme={t.theme ?? 'light'}>{t.el()}</div></figure>)}</div></section>
    <section class="lib-today"><h2 class="lib-h2">Evening steps 1 to 4 and the Change sheet, built from the library only</h2>
      <p class="lib-sub">Turn to God, Classic, Study Notes, Dig Deeper. Classic, Study Notes and Dig Deeper have approved phones (Component Review, Evening rework). The rest have none, so your eye is the check.</p>
      <div class="lib-phones">{STEPS3.map((t) => <figure class="lib-phone-fig" key={t.name}><figcaption><b>{t.name}</b><span>{t.note}</span></figcaption>
        <div class={t.sheet ? 'lib-phone lib-phone--sheet' : 'lib-phone'} data-theme={t.theme ?? 'light'}>{t.el()}</div></figure>)}</div></section>
    <section class="lib-today"><h2 class="lib-h2">Evening steps 6 and 7: Check-In and Meditate, built from the library only</h2>
      <p class="lib-sub">Check-In (with More Tonight?) and Meditate have approved phones (Component Review, Evening rework). Scroll the long ones.</p>
      <div class="lib-phones">{STEPS4.map((t) => <figure class="lib-phone-fig" key={t.name}><figcaption><b>{t.name}</b><span>{t.note}</span></figcaption>
        <div class={t.sheet ? 'lib-phone lib-phone--sheet' : 'lib-phone'} data-theme={t.theme ?? 'light'}>{t.el()}</div></figure>)}</div></section>
    <section class="lib-today"><h2 class="lib-h2">Prayer, the People sheets and the end screens, photographed from the real app</h2>
      <p class="lib-sub">These screens read her saved data, so they are shown as photographs of the built app (test fixtures, 390 × 844 unless noted), not rebuilt here.</p>
      <div class="lib-phones">{APP_SHOTS.map((t) => <figure class="lib-phone-fig" key={t.file}><figcaption><b>{t.name}</b><span>{t.note}</span></figcaption>
        <img class="lib-shot" src={`./shots/${t.file}.jpg`} alt={t.name} loading="lazy" width={390} height={844} /></figure>)}</div></section>
    <h2 class="lib-h2">Every component, every state</h2>
    <p class="lib-sub">Light and dark, at 100% and 200% text. Each part is labeled with its registry id.</p>
    <div class="lib-cols">{(['light', 'dark'] as const).flatMap((t) => [1, 2].map((s) => <Column key={t + s} theme={t} scale={s} />))}</div>
  </main>;
}

type Solo = { tkc?: string; wash?: string; props: any; width: number; fit: boolean; theme: 'light' | 'dark'; scale: number; bg: string; frac?: { x: number; y: number }; sheetMax?: number };
(window as any).__lib = {
  solo({ tkc = 'TKC-006', wash, props, width, fit, theme, scale, bg, frac, sheetMax }: Solo) {
    const C = BY_ID[tkc];
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty('--ts', String(scale)); document.documentElement.toggleAttribute('data-text-large', scale >= 1.5); document.documentElement.toggleAttribute('data-text-xl', scale >= 2); document.documentElement.style.setProperty('--safe-bottom', '16px'); // the Review's home-bar stand-in
    document.body.style.background = bg;
    const el = document.getElementById('lib')!;
    render(null, el); // a fresh button each time: a reused one fades from its last state (150 ms transition)
    document.documentElement.classList.add('lib-solo');
    render(<div id="solo" style={{ boxSizing: 'content-box', width: `${width}px`, display: 'flex', flexDirection: 'column', alignItems: fit ? 'flex-start' : 'stretch', padding: '8px', background: bg, marginLeft: `${frac?.x ?? 0}px`, marginTop: `${frac?.y ?? 0}px`, ...(sheetMax ? { '--sheet-max': `${sheetMax}px` } : {}) } as any}><div data-wash={wash} style={{ display: 'contents' }}><C {...props} /></div></div>, el);
    return document.fonts.ready.then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(true))))); // a component that fits itself (TKC-003) settles in a frame
  },
};
if (!location.hash.includes('solo')) { document.documentElement.dataset.theme = 'light'; }
if (!location.hash.includes('solo')) render(<Library />, document.getElementById('lib')!);
document.documentElement.setAttribute('data-ready', '');
