import { expect, test } from 'vitest';
import { internal } from '../src/notyourface';

test('_pickInt stays in bounds', () => {
  Array.from(Array(99).keys()).forEach((k) => {
    expect(internal._pickInt(1, 10, internal._prng(k)))
      .greaterThanOrEqual(1)
      .and.lessThanOrEqual(10);
  });
});

test('_pickInt errors on invalid arguments', () => {
  expect(() => internal._pickInt(10, 9, internal._prng(2))).toThrowError();
});
