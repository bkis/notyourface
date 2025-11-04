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
  },
  plugins: [
    dts({
      bundleTypes: true,
      tsconfigPath: './tsconfig.json',
      include: ['lib/'],
    }),
  ],
});
