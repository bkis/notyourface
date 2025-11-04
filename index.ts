import nyf from './src/main.ts';
export const getAvatarImgTags = () =>
  Array.from('abcdefghijklmnopqrstvwxyz0123456789').map((c) => nyf.imgEl({ seed: c }));
