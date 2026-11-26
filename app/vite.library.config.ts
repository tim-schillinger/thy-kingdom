import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// The library page (build-standards §5.5): its own build into dist-library/, never part of the app's bundle.
// Sprint 1a: as a second input of the app's build, Rollup merged shared code with it and the app ran it.
export default defineConfig({
  plugins: [preact()],
  build: { target: 'es2022', outDir: 'dist-library', rollupOptions: { input: 'library.html' } },
});
