import { expect, test } from 'vitest';
import { internal } from '../src/notyourface';

test('_shuffle produces consistent results', () => {
  const arr = Array.from(Array(10).keys());
  for (let index = 0; index < 99; index++) {
    const prng1 = internal._prng(123456789);
    const prng2 = internal._prng(123456789);
    for (let index = 0; index < 99; index++) {
      expect(internal._shuffle(arr, prng1)).toStrictEqual(internal._shuffle(arr, prng2));
    }
  }
});
