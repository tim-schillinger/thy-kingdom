// Phosphor icons (MIT), self-hosted and inlined (1276). The library's one icon part: size by --sz.
import PencilSimple from '@phosphor-icons/core/assets/regular/note-pencil.svg?raw';
import CheckReg from '@phosphor-icons/core/assets/regular/check.svg?raw';
import CheckBold from '@phosphor-icons/core/assets/bold/check-bold.svg?raw';
import ArrowRightBold from '@phosphor-icons/core/assets/bold/arrow-right-bold.svg?raw';
import MinusBold from '@phosphor-icons/core/assets/bold/minus-bold.svg?raw';
import PlantDuo from '@phosphor-icons/core/assets/duotone/plant-duotone.svg?raw';
import Info from '@phosphor-icons/core/assets/regular/info.svg?raw';
import CaretRight from '@phosphor-icons/core/assets/regular/caret-right.svg?raw';
import CaretDown from '@phosphor-icons/core/assets/regular/caret-down.svg?raw';
import Search from '@phosphor-icons/core/assets/regular/magnifying-glass.svg?raw';
import X from '@phosphor-icons/core/assets/regular/x.svg?raw';
import House from '@phosphor-icons/core/assets/regular/house.svg?raw';
import HouseFill from '@phosphor-icons/core/assets/fill/house-fill.svg?raw';
import Hands from '@phosphor-icons/core/assets/regular/hands-praying.svg?raw';
import HandsFill from '@phosphor-icons/core/assets/fill/hands-praying-fill.svg?raw';
import Books from '@phosphor-icons/core/assets/regular/books.svg?raw';
import BooksFill from '@phosphor-icons/core/assets/fill/books-fill.svg?raw';
import Gear from '@phosphor-icons/core/assets/regular/gear.svg?raw';
import GearFill from '@phosphor-icons/core/assets/fill/gear-fill.svg?raw';
import BookOpen from '@phosphor-icons/core/assets/regular/book-open.svg?raw';
import MoonStars from '@phosphor-icons/core/assets/regular/moon-stars.svg?raw';
import MusicNotes from '@phosphor-icons/core/assets/regular/music-notes.svg?raw';
import PlantReg from '@phosphor-icons/core/assets/regular/plant.svg?raw';
import Sun from '@phosphor-icons/core/assets/regular/sun.svg?raw';
import TextAa from '@phosphor-icons/core/assets/regular/text-aa.svg?raw';
import DownloadSimple from '@phosphor-icons/core/assets/regular/download-simple.svg?raw';
import ClockCcw from '@phosphor-icons/core/assets/regular/clock-counter-clockwise.svg?raw';
import Bell from '@phosphor-icons/core/assets/regular/bell.svg?raw';
import ShieldCheck from '@phosphor-icons/core/assets/regular/shield-check.svg?raw';
import Trash from '@phosphor-icons/core/assets/regular/trash.svg?raw';
import CaretLeft from '@phosphor-icons/core/assets/regular/caret-left.svg?raw';
import DotsThree from '@phosphor-icons/core/assets/regular/dots-three.svg?raw';
import PlayFill from '@phosphor-icons/core/assets/fill/play-fill.svg?raw';
import PauseFill from '@phosphor-icons/core/assets/fill/pause-fill.svg?raw';
import DeviceMobile from '@phosphor-icons/core/assets/regular/device-mobile.svg?raw';

// The plant's duotone leaf takes success-fill, its line success-ink (TKC-026 C, 899).
const plant = PlantDuo.replace('opacity="0.2"', 'class="d1"').replace(/<path d="M247/, '<path class="d2" d="M247');
export const ICON = { notePencil: PencilSimple, arrowRight: ArrowRightBold, check: CheckBold, checkReg: CheckReg, minus: MinusBold, plant, info: Info, caretRight: CaretRight, caretDown: CaretDown, x: X, search: Search,
  house: House, houseFill: HouseFill, hands: Hands, handsFill: HandsFill, books: Books, booksFill: BooksFill, gear: Gear, gearFill: GearFill,
  bookOpen: BookOpen, moonStars: MoonStars, musicNotes: MusicNotes, plantReg: PlantReg, sun: Sun, textAa: TextAa, downloadSimple: DownloadSimple, clockCcw: ClockCcw, bell: Bell, shieldCheck: ShieldCheck, trash: Trash, deviceMobile: DeviceMobile, caretLeft: CaretLeft, dotsThree: DotsThree, playFill: PlayFill, pauseFill: PauseFill } as const;
export type IconName = keyof typeof ICON;

export function Icon({ n, size, cls }: { n: IconName; size: string; cls?: string }) {
  return <span class={`tkc-icon${cls ? ' ' + cls : ''}`} style={{ '--sz': size }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICON[n] }} />;
}
