import { expect, test } from 'vitest';
import * as nyf from '../src/notyourface';

const options = { seed: 'foo', palette: ['#AAA', '#BBB', '#CCC'] };

test('_pickColor correctly rotates the color palette', () => {
  expect(nyf._pickColor(options)).toBe('#CCC');
  expect(options.palette).toStrictEqual(['#CCC', '#AAA', '#BBB']);
  expect(nyf._pickColor(options)).toBe('#BBB');
  expect(options.palette).toStrictEqual(['#BBB', '#CCC', '#AAA']);
  expect(nyf._pickColor(options)).toBe('#AAA');
  expect(options.palette).toStrictEqual(['#AAA', '#BBB', '#CCC']);
  expect(nyf._pickColor(options)).toBe('#CCC');
  expect(options.palette).toStrictEqual(['#CCC', '#AAA', '#BBB']);
  expect(nyf._pickColor(options)).toBe('#BBB');
  expect(options.palette).toStrictEqual(['#BBB', '#CCC', '#AAA']);
  expect(nyf._pickColor(options)).toBe('#AAA');
  expect(options.palette).toStrictEqual(['#AAA', '#BBB', '#CCC']);
});
