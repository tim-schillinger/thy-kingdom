import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { fileURLToPath } from 'node:url';

// Alpha artifact variant of the production build (545-547): relative paths (--base ./), no service worker, no manifest.
// Production builds carry no fixture or story code, so Alpha runs on the real date (546).
export default defineConfig({
  base: './',
  resolve: {
    alias: [
      { find: /^\.\/data\/stories$/, replacement: '/src/data/stories.stub.ts' },
      { find: 'virtual:pwa-register', replacement: fileURLToPath(new URL('./src/alpha/pwa-register.stub.ts', import.meta.url)) },
    ],
  },
  plugins: [preact()],
  build: { target: 'es2022', outDir: 'dist-alpha', emptyOutDir: true },
});
