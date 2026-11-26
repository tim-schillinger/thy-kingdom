// Prayer (Evening step 5): the intro and the five parts' bodies, built from the library (Review J-intro, J-p1 to J-p5).
// Part 2 (Kingdom, the nations) and part 3 (People, in PrayerPeople.tsx) are built here. A screen file: data and layout only (build-standards §5.8).
import type { ComponentChildren } from 'preact';
import { PRAYER, NEED_WORDS, listAnd } from '../../copy';
import { JoinedCard } from '../TKC-062-JoinedCard/JoinedCard';
import { StepWhy } from '../TKC-030-StepHeader/StepHeader';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { Stepper } from '../TKC-028-Stepper/Stepper';
import { Checkbox } from '../TKC-010-Checkbox/Checkbox';
import { PrayerProgress } from '../TKC-040-PrayerProgress/PrayerProgress';
import { PrayerWords } from '../TKC-035-PrayerWords/PrayerWords';
import { AnchorLine } from '../TKC-052-AnchorLine/AnchorLine';
import { NationList, type NationRowProps } from '../TKC-041-NationRow/NationRow';
import { StepPrayerIntro, StepPrayerList, StepPrayerHide, StepPrayerProgress, StepPrayerEnd } from '../patterns/StepScreen';

export type PrayerPart = 1 | 2 | 3 | 4 | 5;

export function PrayerIntro({ hidden, onHidden }: { hidden: boolean; onHidden: (v: boolean) => void }) {
  return <>
    <StepPrayerIntro>{PRAYER.introBody}</StepPrayerIntro>
    <StepPrayerList><Stepper steps={PRAYER.parts.map((x) => ({ name: x.name, line: x.line }))} /></StepPrayerList>
    <StepPrayerHide><Checkbox label="Don’t show this again" checked={hidden} onChange={onHidden} /></StepPrayerHide>
  </>;
}

/** Kingdom's three words for the nights' nations: one nation, two or three, or none (TKC-041 D, 973). */
function kingdomWords(names: string[]) {
  const k = PRAYER.kingdom;
  return names.length === 0 ? { aim: k.aimNone, move: k.moveNone, starter: k.starterNone }
    : { aim: k.aim, move: names.length === 1 ? k.moveOne(names[0]) : k.moveMany, starter: k.starter(listAnd(names)) };
}

/** The anchor's reference for a part, from the prayer's lines ("Matthew 6:11–12"). */
const anchorRef = (part: number) => `Matthew 6:${PRAYER.anchors[part - 1].split(':')[1].replace('-', '–')}`;

/** The words a part says: the aim, the move, and the starter prayer that sits behind "Need words? ›" (frame-lock-7 R5, 1846 a, 2000 y). */
export function partWords(part: PrayerPart, nationNames: string[], requests?: boolean) {
  return part === 1 ? PRAYER.father : part === 2 ? kingdomWords(nationNames) : part === 3 ? { aim: requests ? PRAYER.people.aimRequests : PRAYER.people.aim, move: undefined, starter: undefined } : part === 4 ? PRAYER.trust : PRAYER.amen;
}

/** Parts 1 to 5 on a card (frame-lock-7 R1, R4, R9): the progress pills above; one card with the anchor in its top half and the aim, the count line (People) and the move in the lower half, then the rows she acts on (tonight's nations or people) and "Need words? ›" last, all inside the card (frame-lock-12 P1, 3421 y);
 *  the band above holds the label and, on part one, the why line (R15). */
export function PrayerPartBody({ part, partName, label, why, bible, onAnchor, onWords, nations, people, count, requests, done, onPart }: { part: 1 | 2 | 3 | 4 | 5; partName: string; /** the card's label: the step's heading on part one, the part's name after */ label: string; why?: string; bible: 'web' | 'kjv'; onAnchor: () => void; onWords: () => void; nations?: NationRowProps[]; /** part 3: the rows (PeopleContent) */ people?: ComponentChildren; /** part 3: the count line, the thing to do (TKC-044) */ count?: ComponentChildren; /** part 3 on Saturday: Your Requests */ requests?: boolean; /** the parts that show a check (frame-lock-10 §2) and the tap on a pill; without onPart the pills are look-only */ done?: readonly number[]; onPart?: (n: PrayerPart) => void }) {
  const text = PRAYER.anchorText[bible][part - 1];
  const p = partWords(part, (nations ?? []).map((n) => n.name), requests);
  return <>
    <StepPrayerProgress><PrayerProgress part={part} name={partName} done={done} onGo={onPart} /></StepPrayerProgress>
    <JoinedCard band label={label} why={why} merge={part === 3 ? 'top-low' : part === 2 && nations && nations.length > 0 ? 'low-rows' : undefined}
      rows={part === 2 && nations && nations.length > 0 ? <NationList rows={nations} /> : part === 3 ? people : undefined}
      help={p.starter ? <TextLink kind="more" label={NEED_WORDS} aria={`${NEED_WORDS} Opens a prayer you can use`} onOpen={onWords} /> : undefined}
      top={<AnchorLine kind="quote" text={text} label={`From the Lord’s Prayer, ${anchorRef(part)}. Open the passage`} onOpen={onAnchor} />}>
      <PrayerWords kind="aim" text={p.aim} first={part === 1} />
      {count}
      {'move' in p && p.move && <PrayerWords kind="move" text={p.move} />}
    </JoinedCard>
    <StepPrayerEnd />
  </>;
}
