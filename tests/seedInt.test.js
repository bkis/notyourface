import { expect, test } from 'vitest';
import { internal } from '../src/notyourface';

test('_seedInt generates stable int seeds', () => {
  expect(internal._seedInt(4)).eq(internal._seedInt(2 + 2));
  expect(internal._seedInt('foo')).eq(internal._seedInt('f' + 'o' + 'o'));
  expect(internal._seedInt('foo')).not.eq(internal._seedInt('FOO'));
  expect(internal._seedInt([1, 'foo', true])).eq(internal._seedInt([2 - 1, 'foo', true]));
});
