// Where the app is running (T22, the Settings Lock 1260, 1264): the Home Screen card and the Add to Home Screen row are for an iPhone in Safari,
// and only until the app is opened from the Home Screen. Every other phone and browser says nothing (TKC-059 B). The test build can set `__tkc.iphoneSafari`.
export const inHomeScreenApp = (): boolean => matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
export function onIphoneSafari(): boolean {
  const t = (window as unknown as { __tkc?: { iphoneSafari?: boolean } }).__tkc;
  if (t && typeof t.iphoneSafari === 'boolean') return t.iphoneSafari;
  const ua = navigator.userAgent;
  return /iPhone|iPod/.test(ua) && /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua);
}
/** Show the Home Screen card and row: an iPhone in a Safari tab, not yet on the Home Screen. */
export const homeScreenOffered = (): boolean => onIphoneSafari() && !inHomeScreenApp();
