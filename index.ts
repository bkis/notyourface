import nyf from './src/main.ts';

export const getImgElement = (
  seed?: string,
  palette?: string[],
  size?: number,
  noCache?: boolean
) => nyf.imgEl({ seed, palette, noCache, size });
