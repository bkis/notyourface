import { expect, test } from 'vitest';
import * as nyf from '../src/notyourface';

test('PRNG generates stable numbers for a given seed', () => {
  expect(
    new Set(
      Array.from(Array(99).keys())
        .map((k) => {
          const prng = nyf._prng(k);
          Array.from(Array(99).keys()).map((_) => prng());
        })
        .map((numbers) => JSON.stringify(numbers))
    ).size
  ).toBe(1);
});
