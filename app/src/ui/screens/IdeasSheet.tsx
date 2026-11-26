// The "Need ideas?" sheet (frame-lock-7 R5, 1881): one list of words in a TKC-004 sheet; a word opens its page in the same sheet, with a back control.
// A screen file: data and layout only (build-standards §5.8).
import { useRef } from 'preact/hooks';
import { getContent } from '../../data/content';
import { formatRef } from '../../engine/refs';
import { SHEET_BIBLE } from '../../copy';
import type { SheetSet } from '../../engine/types';
import { BottomSheet, ReadList, ReadSections } from '../TKC-004-BottomSheet/BottomSheet';
import { SheetHost } from '../patterns/SheetHost';

export function IdeasSheet({ title, set, idea, onPick, onBack, bible, bibleName, onClose }: { title: string; set: SheetSet; idea: number | null; onPick: (i: number) => void; onBack: () => void; bible: 'web' | 'kjv'; bibleName: string; onClose: () => void }) {
  const item = idea == null ? null : set.items[idea];
  const left = useRef<number | null>(null); if (idea != null) left.current = idea;   // the word she opened last: Back puts focus on its row
  return <SheetHost onClose={onClose}>
    {item
      ? <BottomSheet key={item.word} kind="read" title={item.word} back={{ label: `Back to ${title}`, onBack }} onClose={onClose}>
          <ReadSections titles={[set.sections[0], set.sections[1], SHEET_BIBLE]} line={item.a} ways={item.b} verse={item[bible]} reference={formatRef(getContent(), item.ref)} bible={bibleName} /></BottomSheet>
      : <BottomSheet key="list" kind="read" title={title} onClose={onClose}>
          <ReadList items={set.items.map((x) => x.word)} label={title} onPick={onPick} focusIndex={left.current} /></BottomSheet>}
  </SheetHost>;
}
