import nyf from './src/main.ts';

export const getImgElements = (seeds: string[]) =>
  seeds.map((seed) => nyf.imgEl({ seed, scale: 128 }));
