/// <reference types="vitest/config" />

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/notyourface.ts'),
      name: 'notyourface',
      fileName: 'notyourface',
      formats: ['es'],
    },
    emptyOutDir: true,
    chunkSizeWarningLimit: 5,
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src/'],
    }),
  ],
});
