// Steady text (experience.md §2, layout stability): the faces the app reads in load before any screen or reading shows, so no text paints in a
// fallback face and then swaps (the swap resized a whole reading, CLS 0.21). A face that is slow never holds the app: the wait is capped.
const FACES = ['400 30px "Noto Serif Hebrew"', '500 22px "EB Garamond"', '400 19px Literata', 'italic 400 15px Literata', '600 21px Literata', '400 17px "Atkinson Hyperlegible Next"', '500 15px "Atkinson Hyperlegible Next"', '600 13px "Atkinson Hyperlegible Next"'];
let warm: Promise<unknown> | null = null;
export function fontsReady(capMs = 1500): Promise<unknown> {
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve();
  warm ||= Promise.all(FACES.map((f) => document.fonts.load(f).catch(() => [])));
  return Promise.race([warm, new Promise((r) => setTimeout(r, capMs))]);
}
