// The walk flow (IA Flow 2): one step per screen, the run goes forward in order, and at the end the app offers
// what's still untouched (Still Open), or a completion screen.
import { useEffect, useState } from 'preact/hooks';
import { getContent } from '../data/content';
import { getHer, setMark, setAsks, useHer, today as todayFn, addPerson } from '../data/store';
import { planFor, peopleTonight, type DayPlan } from '../engine/plan';
import { markIndex, stepState, walkState, stepsOf, dayFinished, streaks, plantStage, nextStop } from '../engine/progress';
import { formatRefs, formatRef } from '../engine/refs';
import { fmtShort, type CivilDate } from '../engine/dates';
import { STEP_NAMES, CHECKIN_NAMES, LISTS, type StepId, type Walk as W, type CheckIn, type Ask, type Ref } from '../engine/types';
import { STEP_COPY, SONG_COPY, RESPOND, MEMORIZE_TIPS, CHECKIN, MEDITATE_Q, MEDITATE_MOVE, PRAYER, END } from '../copy';
import { Icon, Passage, VerseText, LocatorMap, PlantMark } from './bits';
import type { Nav, Route } from './App';

type From = 'today' | 'opendays';
const trans = () => getHer().sources.bible;
const bibleName = () => (trans() === 'kjv' ? 'King James Version' : 'World English Bible');

// ---------- the frame ----------
function WalkBar({ walk, date, step, onClose, where }: { walk: W; date: CivilDate; step: StepId | null; onClose: () => void; where?: string }) {
  const her = useHer(); const idx = markIndex(her.dayMarks);
  const isToday = date === todayFn();
  return <header class="walkbar">
    <button class="icon-btn" aria-label="Close" onClick={onClose}><Icon n="X" /></button>
    <div class="where">
      <span>{isToday ? '' : `${fmtShort(date)} · `}{walk === 'morning' ? 'Morning Walk' : 'Evening Walk'}{where ? '' : ''}</span>
      <span class="path" aria-hidden="true">{stepsOf(walk).map((s) => <i key={s} class={s === step ? 'now' : stepState(idx, date, s) === 'open' ? '' : stepState(idx, date, s)} />)}</span>
    </div>
    <span />
  </header>;
}

function StepHead({ label, count, heading, why, info = true }: { label: string; count?: string; heading: string; why?: string; info?: boolean }) {
  return <>
    <div class="step-label"><span class="eyebrow">{label}{count && <span class="count"> · {count}</span>}</span>
      {info && <button class="icon-btn bare muted" aria-label={`Learn more about ${label}`}><Icon n="Info" /></button>}</div>
    <h1 class="display-m">{heading}</h1>
    {why && <p class="body why">{why}</p>}
  </>;
}

function SourceLine({ text, change = true, translation = true }: { text: string; change?: boolean; translation?: boolean }) {
  return <p class="caption sourceline"><span>{text}</span>{translation && <><span>·</span><span class="u">{bibleName()}</span><Icon n="CaretDown" size={12} /></>}{change && <><span>·</span><span class="u">Change</span></>}</p>;
}

function ActionBar({ onBack, onSkip, onNext, nextLabel, extra }: { onBack?: () => void; onSkip?: () => void; onNext: () => void; nextLabel: string; extra?: preact.ComponentChildren }) {
  return <footer class="actionbar">
    <div class="row">
      {onBack ? <button class="btn btn-quiet" onClick={onBack}>Back</button> : <span />}
      {onSkip ? <button class="btn btn-quiet" onClick={onSkip}>Skip</button> : <span />}
      <button class="btn btn-primary" onClick={onNext}>{nextLabel}</button>
    </div>
    {extra}
  </footer>;
}

// ---------- the run ----------
export function WalkScreen({ route, nav }: { route: Extract<Route, { s: 'step' }>; nav: Nav }) {
  const her = useHer();
  const content = getContent();
  const { walk, date, step, from } = route;
  const plan = planFor(content, her, date);
  const steps = stepsOf(walk);
  const i = steps.indexOf(step);
  const idx = markIndex(her.dayMarks);
  const othersOpen = steps.filter((s) => s !== step && stepState(idx, date, s) === 'open');
  const isLast = othersOpen.length === 0;
  const lastLabel = walk === 'morning' ? 'Complete Morning Walk' : 'Complete Evening Walk';
  const wash = walk === 'morning' ? 'wash-dawn' : 'wash-dusk';
  const close = () => (from === 'opendays' ? nav({ s: 'today', date, from: 'opendays' }) : nav({ s: 'today' }));

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const advance = (state: 'done' | 'skipped') => {
    const review = stepState(markIndex(getHer().dayMarks), date, step) !== 'open';
    if (!review || state === 'done') setMark(date, step, state);
    const s = nextStop(steps, markIndex(getHer().dayMarks), date, i, review);   // frame-lock-8 L1: the next step still open, else Still Open, else the end
    if ('step' in s) nav({ ...route, step: steps[s.step] });
    else if (s.end === 'still') nav({ s: 'still', walk, date, from });
    else finish(walk, date, from, nav);
  };
  const back = i > 0 ? () => nav({ ...route, step: steps[i - 1] }) : undefined;
  const nextLabel = isLast ? lastLabel : 'Next';

  const props = { plan, date, walk, step, advance, back, nextLabel, nav, route };
  let body;
  switch (step) {
    case 'am.ask': body = <PromptStep {...props} verse="PSA 119:18" />; break;
    case 'pm.turn': body = <PromptStep {...props} verse="PSA 141:2" />; break;
    case 'am.psalm': body = <ReadStep {...props} refs={plan.day?.psalm ?? []} />; break;
    case 'am.proverb': body = <ReadStep {...props} refs={plan.proverbChapter ? [{ b: 'PRO', c: plan.proverbChapter }] : []} />; break;
    case 'am.reading': body = <ReadStep {...props} refs={plan.day?.reading ?? []} />; break;
    case 'am.respond': body = <RespondStep {...props} />; break;
    case 'am.memorize': body = <MemorizeStep {...props} />; break;
    case 'pm.prayer': body = <PrayerStep {...props} />; break;
    case 'pm.checkin': body = <CheckInStep {...props} />; break;
    case 'pm.meditate': body = <MeditateStep {...props} />; break;
  }
  return <div class={`app ${wash}`} data-screen={`step:${step}`}>
    <WalkBar walk={walk} date={date} step={step} onClose={close} />
    {body}
  </div>;
}

export function finish(walk: W, date: CivilDate, from: From, nav: Nav) {
  const idx = markIndex(getHer().dayMarks);
  if (dayFinished(idx, date)) nav({ s: 'daydone', date, from });
  else nav({ s: 'walkdone', walk, date, from });
}

type StepProps = { plan: DayPlan; date: CivilDate; walk: W; step: StepId; advance: (s: 'done' | 'skipped') => void; back?: () => void; nextLabel: string; nav: Nav; route: Extract<Route, { s: 'step' }> };
const Std = ({ p, children, label }: { p: StepProps; children: preact.ComponentChildren; label?: string }) => {
  const c = STEP_COPY[p.step];
  return <><main class="step"><StepHead label={label ?? STEP_NAMES[p.step]} heading={c.heading} why={c.why} />{children}</main>
    <ActionBar onBack={p.back} onSkip={() => p.advance('skipped')} onNext={() => p.advance('done')} nextLabel={p.nextLabel} /></>;
};

function PromptStep(p: StepProps & { verse: string }) {
  const r = parseKey(p.verse);
  return <Std p={p}>
    <p class="body instruction">{STEP_COPY[p.step].instruction}</p>
    <p class="prayer-words"><VerseText r={r} trans={trans()} /></p>
    <SourceLine text={formatRef(getContent(), r)} change={false} />
  </Std>;
}
function parseKey(s: string): Ref { const [b, cv] = s.split(' '); const [c, v] = cv.split(':'); const [v1, v2] = (v ?? '').split('-'); return { b, c: +c, ...(v1 ? { v: +v1 } : {}), ...(v2 ? { c2: +c, v2: +v2 } : {}) }; }

function ReadStep(p: StepProps & { refs: Ref[] }) {
  const song = p.step === 'am.psalm' && p.plan.day?.song;
  const c = song ? SONG_COPY : { label: STEP_NAMES[p.step], ...STEP_COPY[p.step] };
  if (!p.refs.length) return <Std p={p}><p class="body placeholder">This day has no reading in the calendar. What it holds is set later (1363).</p></Std>;
  return <><main class="step"><StepHead label={c.label} heading={c.heading} why={c.why} />
    <SourceLine text={formatRefs(getContent(), p.refs)} />
    <Passage refs={p.refs} trans={trans()} /></main>
    <ActionBar onBack={p.back} onSkip={() => p.advance('skipped')} onNext={() => p.advance('done')} nextLabel={p.nextLabel} /></>;
}

function RespondStep(p: StepProps) {
  const c = getContent(); const d = p.plan.day;
  const cues = d ? [formatRefs(c, d.psalm), `Proverbs ${p.plan.proverbChapter}`, ...d.reading.map((r) => formatRef(c, r))] : [];
  return <Std p={p}>
    <p class="body instruction">{STEP_COPY['am.respond'].instruction}</p>
    <p class="spoken">{RESPOND.line1} <span class="blank" aria-label="blank" />.<br />{RESPOND.line2}</p>
    <p class="body muted" style={{ marginTop: '16px' }}>{RESPOND.helper}</p>
    {cues.length > 0 && <><p class="eyebrow" style={{ marginTop: '28px' }}>Today’s readings</p><div class="cues">{cues.map((x) => <button class="cue" key={x}>{x}</button>)}</div></>}
  </Std>;
}

/** The week's verse (Memorize, Walk Complete, Today): every day carries one (frame-lock-2 §6; the stand-in branch is gone). */
export function weekVerse(p: DayPlan): Ref | null { return p.day?.weekVerse ?? null; }
/** Meditate's verse: the night's own (a Name or Attribute night's, else the week's run). Never the Memorize verse (Build 7a). */
export function meditateVerse(p: DayPlan): Ref | null { return p.meditation?.verse ?? null; }

function MemorizeStep(p: StepProps) {
  const [open, setOpen] = useState(true);
  const r = weekVerse(p.plan);
  return <Std p={p}>
    {r && <div class="verse-card"><p class="eyebrow">This Week’s Verse</p><p class="v"><VerseText r={r} trans={trans()} /></p>
      <SourceLine text={formatRef(getContent(), r)} /></div>}
    <div class="disclosure"><button aria-expanded={open} onClick={() => setOpen(!open)}>Tips for Memorizing<Icon n={open ? 'CaretUp' : 'CaretDown'} /></button>
      {open && <ul class="body">{MEMORIZE_TIPS.map((t) => <li key={t}>{t}</li>)}</ul>}</div>
  </Std>;
}

// ---------- Prayer (Flow 3) ----------
function PrayerStep(p: StepProps) {
  const her = useHer();
  const idx = markIndex(her.dayMarks);
  const partMark = idx.get(`${p.date}|pm.prayer.part`);
  const [part, setPart] = useState<number>(() => (typeof partMark?.value === 'number' ? partMark.value : her.reminders.prayerIntroHidden ? 1 : 0));
  const go = (n: number) => { setPart(n); setMark(p.date, 'pm.prayer.part', 'set', n); window.scrollTo(0, 0); };
  const c = getContent();
  if (part === 0) {
    return <><main class="step"><StepHead label="Prayer" heading={PRAYER.introHeading} />
      <p class="ask-move">{PRAYER.introBody}</p>
      <ol class="stepper">{PRAYER.parts.map((x, k) => <li key={x.name}><span class="num">{k + 1}</span><div><b>{k === 2 && p.plan.list === 6 ? 'Requests' : x.name}</b><span class="body muted">{x.line}</span></div></li>)}</ol>
      <label class="checkbox body"><input type="checkbox" checked={her.reminders.prayerIntroHidden} onChange={(e) => import('../data/store').then((s) => s.setReminders({ prayerIntroHidden: (e.target as HTMLInputElement).checked }))} />Don’t show this again</label>
    </main>
      <footer class="actionbar"><button class="btn btn-primary" onClick={() => go(1)}>Begin</button></footer></>;
  }
  const names = PRAYER.parts.map((x, k) => (k === 2 && p.plan.list === 6 ? 'Requests' : x.name));
  const progress = <div class="pprog" aria-label={`Part ${part} of 5: ${names[part - 1]}`}>{names.map((n, k) => <span key={n} class={k + 1 === part ? 'now' : k + 1 < part ? 'done' : ''}>{k + 1 === part ? n : k + 1 < part ? <Icon n="Check" size={18} /> : k + 1}</span>)}</div>;
  const anchor = parseKey(PRAYER.anchors[part - 1]);
  const anchorLine = <button class="anchor"><span class="q"><VerseText r={anchor} trans={trans()} quote /></span><Icon n="CaretRight" size={18} /></button>;
  const next = () => {
    if (part === 2) setMark(p.date, 'pm.prayer.kingdom', 'done');
    if (part < 5) go(part + 1); else { setMark(p.date, 'pm.prayer.part', 'set', 5); p.advance('done'); }
  };
  const backFn = part > 1 ? () => go(part - 1) : p.back;
  let inner;
  if (part === 1) inner = <><p class="aim-first">{PRAYER.father.aim}</p><p class="move">{PRAYER.father.move}</p><p class="leadin">If you want words:</p><p class="prayer-words">{PRAYER.father.starter}</p></>;
  if (part === 2) {
    const ns = (p.plan.day?.nations ?? []).map((id) => c.nations[id]);
    const joined = ns.map((n) => n.name).join(ns.length === 3 ? ', ' : ' and ').replace(/, ([^,]*)$/, ', and $1');
    inner = <><h2 class="display-m aim">{ns.length ? PRAYER.kingdom.aim : PRAYER.kingdom.aimNone}</h2>
      <div style={{ marginTop: '16px' }}>{ns.map((n) => <button class="nation" key={n.id}><LocatorMap latlng={n.latlng} /><span style={{ flex: 1 }}><b>{n.name}</b></span><Icon n="CaretRight" size={18} /></button>)}</div>
      <p class="move">{ns.length === 0 ? PRAYER.kingdom.moveNone : ns.length === 1 ? PRAYER.kingdom.moveOne(ns[0].name) : PRAYER.kingdom.moveMany}</p>
      <p class="leadin">If you want words:</p><p class="prayer-words">{ns.length ? PRAYER.kingdom.starter(joined) : PRAYER.kingdom.starterNone}</p></>;
  }
  if (part === 3) inner = <PeoplePart plan={p.plan} date={p.date} />;
  if (part === 4) inner = <><h2 class="display-m aim">{PRAYER.trust.aim}</h2><p class="leadin">If you want words:</p><p class="prayer-words">{PRAYER.trust.starter}</p></>;
  if (part === 5) inner = <><h2 class="display-m aim">{PRAYER.amen.aim}</h2><p class="leadin">If you want words:</p><p class="prayer-words">{PRAYER.amen.starter}</p></>;
  return <><main class="step" data-part={part}>
    {part === 1 ? <StepHead label="Prayer" heading={STEP_COPY['pm.prayer'].heading} why={STEP_COPY['pm.prayer'].why} /> : <div class="step-label"><span class="eyebrow">Prayer</span><button class="icon-btn bare muted" aria-label="Learn more about Prayer"><Icon n="Info" /></button></div>}
    {progress}{anchorLine}{inner}</main>
    <ActionBar onBack={backFn} onSkip={() => p.advance('skipped')} onNext={next} nextLabel="Next" /></>;
}

const ASKS: Ask[] = ['provide', 'forgive', 'protect'];
function PeoplePart({ plan, date }: { plan: DayPlan; date: CivilDate }) {
  const her = useHer();
  const list = LISTS[plan.list];
  const people = peopleTonight(her, date, plan.list, plan.prayerCount);
  const [keyOpen, setKeyOpen] = useState(!her.reminders.prayerKeySeen);
  useEffect(() => { if (!her.reminders.prayerKeySeen) import('../data/store').then((s) => s.setReminders({ prayerKeySeen: true })); }, []);
  const marks = new Map(her.prayerMarks.filter((m) => m.date === date).map((m) => [m.personId, m.asks]));
  const sat = plan.list === 6;
  const add = () => { const name = prompt(sat ? 'Your request' : 'Name'); if (name) addPerson({ list: plan.list, name, request: '', added: date }); };
  return <>
    <h2 class="display-m aim">{sat ? PRAYER.people.aimRequests : PRAYER.people.aim}</h2>
    <div class="list-head"><b>{list.name} <span>· {people.length} tonight</span></b><button class="btn-small" onClick={add}>+ {sat ? 'Add Request' : 'Add Person'}</button></div>
    {people.length === 0 ? <div class="empty-prayer"><p class="move">{PRAYER.people.empty}</p></div> : <>
      <p class="move" style={{ marginTop: '12px' }}>{PRAYER.people.select} <button class="link" onClick={() => setKeyOpen(!keyOpen)}>{PRAYER.people.key}</button></p>
      {keyOpen && <dl class="body">{ASKS.map((a) => <div key={a} style={{ marginTop: '8px' }}><dt><b>{a[0].toUpperCase() + a.slice(1)}</b></dt><dd style={{ margin: '0px' }} class="muted">{PRAYER.people.keyLines[a]}</dd></div>)}</dl>}
      {people.map(({ person, addedTonight }) => {
        const asks = marks.get(person.id) ?? [];
        return <div class="person" key={person.id} data-person={person.name}>
          <div class="nm"><span>{person.name} {addedTonight && <span class="tag">Added tonight</span>}</span><button class="icon-btn bare" aria-label={`More for ${person.name}`}><Icon n="Dots" /></button></div>
          {person.request && <p class="rq">{person.request}</p>}
          <div class="pills">{ASKS.map((a) => { const on = asks.includes(a); return <button class="pill" aria-pressed={on} key={a}
            onClick={() => setAsks(person.id, date, on ? asks.filter((x) => x !== a) : [...asks, a])}>{on && <Icon n="Hands" size={18} />}{a[0].toUpperCase() + a.slice(1)}</button>; })}</div>
        </div>;
      })}</>}
  </>;
}

// ---------- Check-In (step 6) ----------
function CheckInStep(p: StepProps) {
  const her = useHer();
  const idx = markIndex(her.dayMarks);
  const all = p.plan.checkIns;
  const ciState = (c: CheckIn) => stepState(idx, p.date, `pm.checkin.${c}` as StepId);
  const [view, setView] = useState<CheckIn | 'more'>(() => all.find((c) => ciState(c) === 'open') ?? 'more');
  useEffect(() => window.scrollTo(0, 0), [view]);
  const anyDone = all.some((c) => ciState(c) === 'done');
  if (view === 'more') {
    const left = all.filter((c) => ciState(c) === 'open').length;
    const dataLine = moreLine(p.date, all.length - 1);
    return <><main class="step"><StepHead label="Check-In" heading="More Tonight?" why={left === 1 ? 'One more completes tonight’s check-ins.' : left === 0 ? 'Every check-in done tonight.' : dataLine} />
      <div style={{ marginTop: '24px' }}>{all.map((c) => { const s = ciState(c); return <button class="ci-row" key={c} disabled={s === 'done'} onClick={() => setView(c)}>
        <span class={`ring ${s === 'done' ? 'done' : ''}`}>{s === 'done' && <Icon n="Check" size={16} />}</span><span class="nm">{CHECKIN_NAMES[c]}</span>
        {s === 'done' ? <span class="body muted">Done</span> : s === 'skipped' ? <span class="body muted">Skipped</span> : <Icon n="CaretRight" size={18} />}</button>; })}</div></main>
      <footer class="actionbar"><div class="row"><button class="btn btn-quiet" onClick={() => setView(all[0])}>Back</button><span /><button class="btn btn-primary" onClick={() => p.advance(anyDone ? 'done' : 'skipped')}>{p.nextLabel}</button></div></footer></>;
  }
  const c = view; const k = CHECKIN[c];
  const next = () => { setMark(p.date, `pm.checkin.${c}`, 'done'); if (all.length > 1) { setMark(p.date, 'pm.checkin', 'done'); setView('more'); } else p.advance('done'); };
  const skip = () => { setMark(p.date, `pm.checkin.${c}`, 'skipped'); if (all.length > 1) setView('more'); else p.advance('skipped'); };
  return <WithCheckIn p={p} c={c} k={k} next={next} skip={skip} />;
}
const moreLine = (date: CivilDate, n: number) => {
  const d = planFor(getContent(), getHer(), date).checkIns;
  const parts = [d.includes('grain') && 'the week', d.includes('peace') && 'the month', d.includes('sin') && 'the quarter', d.includes('trespass') && 'the year'].filter(Boolean) as string[];
  const joined = parts.length <= 2 ? parts.join(' and ') : `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
  return `Today is the last day of ${joined}, so ${n} more check-in${n === 1 ? ' is' : 's are'} available.`;
};
function WithCheckIn({ p, c, k, next, skip }: { p: StepProps; c: CheckIn; k: (typeof CHECKIN)[CheckIn]; next: () => void; skip: () => void }) {
  const [open, setOpen] = useState(false);
  const r = parseKey(k.anchor.replace(' ', ' '));
  return <><main class="step" data-checkin={c}>
    <StepHead label="Check-In" count={CHECKIN_NAMES[c]} heading={STEP_COPY['pm.checkin'].heading} why={STEP_COPY['pm.checkin'].why} />
    <button class="anchor"><span class="q"><FirstClause r={r} />{' '}<span class="n" style={{ fontStyle: 'normal' }}>{formatRef(getContent(), r)}</span></span><Icon n="CaretRight" size={18} /></button>
    <p class="ask-q">{k.question}</p>
    <div class="disclosure"><button aria-expanded={open} onClick={() => setOpen(!open)}>Need ideas?<Icon n={open ? 'CaretUp' : 'CaretDown'} /></button>
      {open && <ul class="body two">{k.areas.map((a) => <li key={a}>{a}</li>)}</ul>}</div>
    <p class="ask-move">{k.move}</p></main>
    <ActionBar onBack={p.back} onSkip={skip} onNext={next} nextLabel={p.plan.checkIns.length > 1 ? 'Next' : p.nextLabel} /></>;
}
/** The check-in's verse line: its opening words, then "…" (TKC-052 quote with reference). */
function FirstClause({ r }: { r: Ref }) {
  return <span class="first-clause"><Clause r={r} /></span>;
}
function Clause({ r }: { r: Ref }) {
  const [t, setT] = useState('');
  useEffect(() => { import('../data/content').then(({ loadBook }) => loadBook(trans(), r.b).then((ch) => {
    const v = ch[r.c - 1][(r.v ?? 1) - 1].replace(/\[|\]/g, '');
    const m = v.match(/^(.{20,90}?[,;:.])\s/); setT(`“${(m ? m[1].replace(/[,;:]$/, '') : v)}…”`);
  })); }, [r.b, r.c, r.v]);
  return <>{t}</>;
}

// ---------- Meditate (step 7) ----------
function MeditateStep(p: StepProps) {
  const m = p.plan.meditation;
  const her = useHer();
  const qMark = markIndex(her.dayMarks).get(`${p.date}|pm.meditate.q`);
  const [q, setQ] = useState<number>(m?.question === 'all' ? (typeof qMark?.value === 'number' ? qMark.value : 1) : (m?.question as number) ?? 1);
  const all = m?.question === 'all';
  const c = getContent();
  const r = meditateVerse(p.plan);
  const heading = q <= 3 ? 'Set Your Mind on God' : 'Live It Out';
  const src = m ? (all ? `${m.title}${r ? ` · ${formatRef(c, r)}` : ''}` : `This week: ${m.title}${r ? ` · ${formatRef(c, r)}` : ''}`) : '';
  const goQ = (n: number) => { setQ(n); setMark(p.date, 'pm.meditate.q', 'set', n); window.scrollTo(0, 0); };
  const done = () => p.advance('done');
  return <><main class="step" data-question={q}>
    <StepHead label="Meditate" count={all ? `Question ${q} of 6` : undefined} heading={heading} why={STEP_COPY['pm.meditate'].why} />
    {m && <SourceLine text={src} change={!all} />}
    {r && <p class="reading" style={{ marginTop: '16px' }}><VerseText r={r} trans={trans()} /></p>}
    <p class="ask-q">{MEDITATE_Q[q - 1]}</p>
    <p class="ask-move">{MEDITATE_MOVE[q - 1]}</p></main>
    {all ? <ActionBar onBack={q > 1 ? () => goQ(q - 1) : p.back} onSkip={q < 6 ? () => goQ(q + 1) : () => p.advance('skipped')} onNext={q < 6 ? () => goQ(q + 1) : done} nextLabel={q < 6 ? 'Next' : p.nextLabel}
      extra={q < 6 ? <button class="btn btn-quiet" onClick={done}>{p.nextLabel === 'Next' ? 'Next Step' : p.nextLabel}</button> : undefined} />
      : <ActionBar onBack={p.back} onSkip={() => p.advance('skipped')} onNext={done} nextLabel={p.nextLabel} />}
  </>;
}
