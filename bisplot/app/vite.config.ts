import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// The build emits ONE self-contained index.html (JS and CSS inlined) into the
// parent folder, bisplot/sito/, which GitHub Pages serves as-is: the repo has
// no build step, so the committed file is what goes live.
//
// emptyOutDir must stay false — the output folder also holds this app/ source.
export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: '..',
    emptyOutDir: false,
  },
});
