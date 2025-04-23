import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/sand-table-pattern-maker/',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        env: resolve(__dirname, 'src/js/env.js'),
      },
    },
  },
  server: {
    open: true,
  },
  optimizeDeps: {
    include: ['@markroland/path-helper'],
  },
});