import nyf from './src/main.ts';

export const getImgElement = (seed?: string, palette?: string[], size?: number, cache?: number) =>
  nyf.imgEl({ seed, palette, size, cache });
