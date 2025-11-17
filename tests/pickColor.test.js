import { expect, test } from 'vitest';
import { internal } from '../src/notyourface';

const options = { seed: 'foo', palette: ['#AAA', '#BBB', '#CCC'] };

test('_pickColor correctly rotates the color palette', () => {
  expect(internal._pickColor(options)).toBe('#CCC');
  expect(options.palette).toStrictEqual(['#CCC', '#AAA', '#BBB']);
  expect(internal._pickColor(options)).toBe('#BBB');
  expect(options.palette).toStrictEqual(['#BBB', '#CCC', '#AAA']);
  expect(internal._pickColor(options)).toBe('#AAA');
  expect(options.palette).toStrictEqual(['#AAA', '#BBB', '#CCC']);
  expect(internal._pickColor(options)).toBe('#CCC');
  expect(options.palette).toStrictEqual(['#CCC', '#AAA', '#BBB']);
  expect(internal._pickColor(options)).toBe('#BBB');
  expect(options.palette).toStrictEqual(['#BBB', '#CCC', '#AAA']);
  expect(internal._pickColor(options)).toBe('#AAA');
  expect(options.palette).toStrictEqual(['#AAA', '#BBB', '#CCC']);
});
