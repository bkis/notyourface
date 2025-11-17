import { expect, test } from 'vitest';
import { internal } from '../src/notyourface';

test('PRNG generates stable numbers for a given seed', () => {
  expect(
    new Set(
      Array.from(Array(99).keys())
        .map((k) => {
          const prng = internal._prng(k);
          Array.from(Array(99).keys()).map((_) => prng());
        })
        .map((numbers) => JSON.stringify(numbers))
    ).size
  ).toBe(1);
});
