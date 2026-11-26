// 3-5w (T24, T28): two copies of the app can live on one web address, the real one at /thy-kingdom/ and a Preview beside it at /thy-kingdom/preview/.
// A browser keeps one shelf of storage per address, not per folder, so without this a Preview would read, and could overwrite, her real lists and progress.
// A Preview build (VITE_TKC_CHANNEL=preview) keeps everything under its own names. The real build's names do not change, so no one's saved data moves.
export const CHANNEL: 'main' | 'preview' = import.meta.env.VITE_TKC_CHANNEL === 'preview' ? 'preview' : 'main';
export const storageName = (base: string, channel: 'main' | 'preview' = CHANNEL): string => (channel === 'preview' ? `${base}-preview` : base);
