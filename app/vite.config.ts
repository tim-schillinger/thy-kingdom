import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

// One visit installs everything: app, fonts, icons, calendars, nations and both Bibles (1360).
// Workbox skips files over 2 MiB by default (maximumFileSizeToCacheInBytes 2,097,152), so each Bible ships per book.
// 3-5v (T24, the code half): the app lives at any address, a domain root or a folder such as /thy-kingdom/. Every path is relative (base './'),
// the manifest's start_url and scope are './', and the offline fallback is index.html, so the same bundle installs from wherever it is served.
// tools/subpath-walk.mjs proves it from a folder address (gate step 6b). Her data stays with the address, so the address is chosen before anyone but the Creator installs (1374).
export default defineConfig(({ mode }) => ({
  base: './',
  resolve: mode === 'test' ? {} : { alias: [{ find: /^\.\/data\/stories$/, replacement: '/src/data/stories.stub.ts' }] },
  plugins: [
    preact(),
    VitePWA({
      registerType: 'prompt', // a new version waits for the next open; we never show the prompt (1286 A)
      injectRegister: false,
      manifest: {
        name: 'Thy Kingdom', short_name: 'Thy Kingdom', id: './', start_url: './', scope: './', display: 'standalone',
        background_color: '#FBF6EC', theme_color: '#FBF6EC',
        icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,json,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: { target: 'es2022' },
}));
