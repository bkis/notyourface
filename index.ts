import notyourface from './src/main.ts';
export const getAvatarImgTags = () =>
  Array.from('notyourface').map((c) => notyourface.imgEl({ seed: c }));
