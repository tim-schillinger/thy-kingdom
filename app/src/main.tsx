import { render } from 'preact';
import '@fontsource/eb-garamond/latin-500.css';
import '@fontsource/literata/latin-400.css';
import '@fontsource/literata/latin-400-italic.css';
import '@fontsource/literata/latin-600.css';
import '@fontsource/noto-serif-hebrew/hebrew-400.css';
import '@fontsource/atkinson-hyperlegible-next/latin-400.css';
import '@fontsource/atkinson-hyperlegible-next/latin-500.css';
import '@fontsource/atkinson-hyperlegible-next/latin-600.css';
import './styles.css';
import { App, navigate } from './ui/App';
import { init } from './data/store';
import { askToPersist } from './data/db';
import { loadContent } from './data/content';
import { TEST_CONTROLS, setNow } from './data/clock';
import { registerSW } from 'virtual:pwa-register';
import { fontsReady } from './ui/fonts';
import { testAudioElement } from './data/audio';

// A new version waits and starts the next time she opens the app; nothing is said (1286 A).
registerSW({ immediate: true });

async function boot() {
  await Promise.all([loadContent(), init(), fontsReady()]);
  void askToPersist(); // every start until the phone agrees to keep her data (3-6k); nothing shows
  if (import.meta.env.VITE_TEST_CONTROLS === 'true' && TEST_CONTROLS) {
    const { playStory } = await import('./data/stories');
    (window as any).__tkc = {
      /** Motion is off under test unless this is 'on' (so screenshots never catch a frame mid-move). */
      motion: 'off',
      /** First-time tips (TKC-064) are off under test unless this is 'on', as motion is: the parity and look runs photograph pages without them. */
      tips: 'off',
      /** Walk a moment slower: every motion token times n (4 for the 4x walk), read by ms() and by the CSS alike. */
      slow: (n: number) => { const r = document.documentElement.style; for (const [k, v] of Object.entries({ quick: 150, short: 200, calm: 300, sheet: 420, win: 700, stagger: 90 })) r.setProperty(k === 'stagger' ? '--stagger' : `--motion-${k}`, `${v * n}ms`); },
      setNow: (iso: string) => setNow(new Date(iso)),
      /** The hymn player's audio element (3-5p), for the walk that checks the ring and the end of a song. */
      audioEl: () => testAudioElement(),
      go: (r: unknown) => navigate(r as never),
      /** Her stored marks for one date (3-5y: the pill walk reads `pm.prayer.seen` and `pm.prayer.kingdom`). */
      marks: async (date: string) => { const { getHer } = await import('./data/store'); return getHer().dayMarks.filter((m) => m.date === date).map((m) => `${m.step}=${m.state}${m.value === undefined ? '' : ':' + m.value}`); },
      fixture: async (n: string) => { const { playFixture } = await import('./data/stories'); await playFixture(n as never); (await import('./ui/TKC-064-Tip/tips')).resetTips(); navigate({ s: 'today' }); },
      story: async (n: 'ray' | 'dale' | 'joan') => { await playStory(n); (await import('./ui/TKC-064-Tip/tips')).resetTips(); const { getHer } = await import('./data/store'); navigate(getHer().reminders.firstRunDone ? { s: 'today' } : { s: 'firstrun' }); },
    };
  }
  render(<App />, document.getElementById('app')!);
  document.documentElement.dataset.ready = '1';
}
boot();
