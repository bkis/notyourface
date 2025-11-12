import { expect, test } from 'vitest';
import * as nyf from '../src/notyourface';

test('PRNG generates predictable numbers', () => {
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
