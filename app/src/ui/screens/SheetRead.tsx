// The read sheet for the 60 Check-In ideas and the 7 lists (frame-lock-4a §3, 4b §3, 4c §1): the title, ✕, then three titled sections in her Bible.
// A screen file: data and layout only (build-standards §5.8).
import { getContent } from '../../data/content';
import { formatRef } from '../../engine/refs';
import { SHEET_BIBLE } from '../../copy';
import type { SheetItem } from '../../engine/types';
import { BottomSheet, ReadSections } from '../TKC-004-BottomSheet/BottomSheet';
import { SheetHost } from '../patterns/SheetHost';

export function SheetRead({ title, titles, item, bible, bibleName, onClose }: { title: string; titles: [string, string]; item: SheetItem; bible: 'web' | 'kjv'; bibleName: string; onClose: () => void }) {
  return <SheetHost onClose={onClose}><BottomSheet kind="read" title={title} onClose={onClose}>
    <ReadSections titles={[titles[0], titles[1], SHEET_BIBLE]} line={item.a} ways={item.b} verse={item[bible]} reference={formatRef(getContent(), item.ref)} bible={bibleName} /></BottomSheet></SheetHost>;
}
