import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'notyourface',
      fileName: 'notyourface',
    },
    manifest: true,
    sourcemap: true,
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
