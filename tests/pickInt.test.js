import { expect, test } from 'vitest';
import * as nyf from '../src/notyourface';

test('_pickInt stays in bounds', () => {
  Array.from(Array(99).keys()).forEach((k) => {
    expect(nyf._pickInt(1, 10, nyf._prng(k)))
      .greaterThanOrEqual(1)
      .and.lessThanOrEqual(10);
  });
});

test('_pickInt errors on invalid arguments', () => {
  expect(() => nyf._pickInt(10, 9, nyf._prng(2))).toThrowError();
});
