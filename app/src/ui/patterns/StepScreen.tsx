// Step screen (frame) (registry §2, locked 773, 824; frame 569–575): TopBar (the step's name, state and menu, the walk path, reading line once scrolled) · StepHeader (heading, why) · the book button in the TopBar (C1) · content · ActionBar.
// Layout only. The screen supplies the words, the marks and the actions. The part wrappers below hold the spacing the Morning steps
// phones draw between the library's parts (Review .hd-src, .ap, .pw, .hy-w); no component styles here.
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { motionOff, captureBody, arriveBody, type Captured } from '../motion';
import type { ComponentChildren } from 'preact';
import { TopBar, type TopBarProps } from '../TKC-002-TopBar/TopBar';
import { useStepTip } from '../TKC-064-Tip/tips';
import { TIP } from '../../copy';
import { StepHeader, type StepHeaderProps } from '../TKC-030-StepHeader/StepHeader';
import { ActionBar, type ActionBarProps } from '../TKC-003-ActionBar/ActionBar';
import './screen.css';
import './stepscreen.css';
import './prayerscreen.css';

export interface StepScreenViewProps {
  wash: 'dawn' | 'dusk';
  bar: Omit<TopBarProps, 'scrolled' | 'reading' | 'step' | 'state' | 'onUndo'>;
  header: StepHeaderProps;
  foot: ActionBarProps;
  step: string;
  /** A day that hasn't come: its pages are look only, so no first-time tip (frame-lock-11 §1). */
  ahead?: boolean;
  /** A TKC-062 step: the card carries the heading and the why line, so the header is not drawn here */
  card?: boolean;
  /** The content, in order, built from the part wrappers below. */
  children: ComponentChildren;
  /** A sheet or a notice that belongs to the screen. */
  overlay?: ComponentChildren;
}
export function StepScreenView(p: StepScreenViewProps) {
  const root = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [reading, setReading] = useState<number | undefined>(undefined);
  const [playerOut, setPlayerOut] = useState(false);   // 3-5p (frame-lock-9 2a): the hymn player has scrolled under the bar
  // TKC-064 (3-5z, frame-lock-11): the first-time tip by the book button. While the hymn's play button holds that slot there is no book, so no tip; it returns with the book.
  const tip = useStepTip(p.step, !!p.header.onInfo, p.ahead);
  const listening = !!p.bar.listen && playerOut;
  // M1 (Next and Back between steps): the body leaves the way she's going and the next arrives from the other side; the header and the foot stay still.
  // The old body is copied while it is still on screen (this render runs before the page changes), then the copy goes and the new one arrives.
  // Motion lock 2 §2a: out before in. The old body is copied before any scroll (this render runs before the page changes), clipped between the top bar and the action bar;
  // it leaves the way she is going in 100 ms, then the new body's parts settle in three beats. The bars stay still: the foot's words fade out, then in.
  const was = useRef({ step: p.step, cur: p.bar.current }), old = useRef<Captured | null>(null);
  if (was.current.step !== p.step && !motionOff() && !old.current) old.current = captureBody(root.current, '.tkc-step__main', '[data-tkc="TKC-003"]');
  useLayoutEffect(() => {
    const from = was.current; was.current = { step: p.step, cur: p.bar.current }; const o = old.current; old.current = null;
    if (from.step === p.step) return;
    const dir = (p.bar.current ?? 0) >= (from.cur ?? 0) ? 1 : -1;
    // The title that was fading in the top bar finishes at the step change, and the next step's verse never flashes there (F4).
    setScrolled(false);
    requestAnimationFrame(() => { const h = root.current?.querySelector<HTMLElement>('[data-tkc="TKC-002"]'); if (h) { getComputedStyle(h).opacity; h.getAnimations({ subtree: true }).forEach((a) => { if ((a as CSSTransition).transitionProperty) a.finish(); }); } });
    arriveBody(root.current, '.tkc-step__main', '[data-tkc="TKC-003"]', o, dir);
  }, [p.step]);
  useEffect(() => {
    const on = () => {
      const h = root.current?.querySelector('[data-part="heading"]')?.getBoundingClientRect();
      setScrolled(!!h && h.bottom < 88);
      const pl = root.current?.querySelector('[data-tkc="TKC-051"].tkc-ap')?.getBoundingClientRect();
      setPlayerOut(!!pl && pl.bottom < 88);
      const doc = document.documentElement, room = doc.scrollHeight - innerHeight;
      setReading(room > innerHeight * 0.5 ? Math.max(0, Math.min(100, (scrollY / room) * 100)) : undefined);
    };
    on(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); };
  }, [p.step]);
  return <div class="tkc-screen tkc-step" data-wash={p.wash} data-screen={`step:${p.step}`} ref={root}>
    <TopBar {...p.bar} listen={playerOut ? p.bar.listen : undefined} onAbout={p.header.onInfo ? () => { tip.onBook(); p.header.onInfo!(); } : undefined} tip={p.header.onInfo ? { open: tip.open && !listening, message: TIP.about, closeLabel: TIP.close, onClose: tip.onClose } : undefined} step={`${p.header.label}${p.header.slot ?? ''}`} state={p.header.state} onUndo={p.header.onUndo} scrolled={scrolled && was.current.step === p.step} reading={reading} />
    <main class="tkc-step__main">{!p.card && <StepHeader {...p.header} />}{p.children}</main>
    <ActionBar {...p.foot} />
    {p.overlay}
  </div>;
}

/** The "missing" use of TKC-019 under the SourceLine (575): space-6 above, margin-page at the sides, space-12 below. */
export const StepMeaning = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__meaning" data-part="meaning">{children}</div>;
export const StepMissing = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__missing" data-part="missing">{children}</div>;
/** The SourceLine's place: space-6 under the header, margin-page at the sides (Review .hd-src). */
export const StepSource = ({ children, after }: { children: ComponentChildren; after?: 'note' | 'anchor' }) => <div class="tkc-step__src" data-part="source" data-after={after}>{children}</div>;
/** Under the words: the SourceLine after a prayer verse (Review .pw-ref). */
export const StepSourceUnder = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__srcunder" data-part="source-under">{children}</div>;
/** The player under the SourceLine (Review .ap). */
export const StepPlayer = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__player" data-part="player">{children}</div>;
/** Words to pray (Review .pw). */
export const StepWords = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__words" data-part="words">{children}</div>;
/** The writer line under the hymn (Review .hy-w). */
/** The link under a hymn's credit (Build 7h, 118). */
export const StepAbout = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__about" data-part="about-hymn">{children}</div>;
export const StepWriter = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__writer" data-part="writer">{children}</div>;
/** TKC-038: the one line that says what to open. */
/** Check-In: the quote line sits space-4 under the header (Review erE4). */
export const StepAsk = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__ask" data-part="ask">{children}</div>;
/** A list of rows under the header (More Tonight?): space-6 under it, margin-page at the sides (Review .ev-cl). */
export const StepRows = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__rows" data-part="rows">{children}</div>;
export const StepOwn = ({ children }: { children: ComponentChildren }) => <p class="tkc-step__own" data-tkc="TKC-038" data-part="own">{children}</p>;

/** Respond: the prompt carries its own side margins (TKC-036 G); this only keeps the page's rhythm after the instruction line. */
export const StepPrompt = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__prompt" data-part="prompt">{children}</div>;
/** Respond (C3): today's readings under the card, in line with the card's own text. */
export const StepReadings = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__readings" data-part="readings">{children}</div>;
/** Memorize: the VerseCard under the header, space-4 down (Review .ms-vcw). */
export const StepVerse = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__verse" data-part="verse">{children}</div>;
/** Memorize: the tips row, space-4 under the card and space-12 below the last thing (TKC-014 G). */
export const StepTips = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__tips" data-part="tips">{children}</div>;
/** Proverb: the extras card or row, space-8 under the last line of the reading and space-12 below (TKC-037 G). */
export const StepExtras = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__extras" data-part="extras">{children}</div>;

/** Evening: TKC-052's line under the StepHeader, space-4 down (Review .er-note, .er-anc); the SourceLine follows (StepSource `after`). */
export const StepNote = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__note" data-part="note">{children}</div>;
/** Evening: the writer credit under the last reading (Review .ev-credit); TKC-032 `credit` carries the vertical space. */
export const StepCredit = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__credit" data-part="credit">{children}</div>;

/** Prayer (Review .pr-ib, .pr-isl, .pr-cbx, .pr-ptk, .pr-anc, .pr-end): the intro line, the five-part list, the checkbox, the progress cells, the anchor, the room at the foot. */
export const StepPrayerIntro = ({ children }: { children: ComponentChildren }) => <p class="tkc-step__pib" data-part="intro">{children}</p>;
export const StepPrayerList = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__pisl" data-part="parts">{children}</div>;
export const StepPrayerHide = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__pcbx" data-part="hide">{children}</div>;
export const StepPrayerProgress = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__pprog" data-part="prayer-progress">{children}</div>;
export const StepPrayerAnchor = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__panc" data-part="anchor">{children}</div>;
export const StepPrayerEnd = () => <div class="tkc-step__pend" data-part="end" />;

/** People (Review .pr-lh, .pr-verse, .pr-vref, .pr-ahead, .pr-bigbtn): the list head with its Add button, Friday's verse and its source, the read-ahead line, the empty list's button. Spacing only. */
/** The list head, one row (frame-lock-4b §1): "[List] ›" opens the list's sheet; the count sits at the right in ink-2. */
/** The list's name that opens its sheet; with people it carries the add on the same row (frame-lock-6 §5, 1764): no count, no hairline under it. */
export const StepPrayerListHead = ({ name, onOpen, add, bare }: { name: string; onOpen?: () => void; add?: ComponentChildren; /** an empty list: no hairline between the title and the line under it (Creator, Nov 11) */ bare?: boolean }) =>
  <div class="tkc-step__plh" data-part="list-head" data-add={add ? '' : undefined} data-bare={bare ? '' : undefined}><TextLink kind="more" size="title" label={name} aria={`${name}. Who belongs on this list`} onOpen={onOpen} />{add}</div>;
export const StepPrayerPrompt = ({ children }: { children: ComponentChildren }) => <p class="tkc-step__pprompt" data-part="prompt">{children}</p>;
export const StepPrayerAdd = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__pend2" data-part="add">{children}</div>;
export const StepPrayerVerse = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__pverse" data-part="verse">{children}</div>;
export const StepPrayerVref = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__pvref" data-part="verse-source">{children}</div>;
export const StepPrayerAhead = ({ children }: { children: ComponentChildren }) => <p class="tkc-step__pahead" data-part="ahead">{children}</p>;
export const StepPrayerBig = ({ children }: { children: ComponentChildren }) => <div class="tkc-step__pbig" data-part="big-button">{children}</div>;
