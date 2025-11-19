import { expect, test } from 'vitest';
import nyf from '../src/notyourface';

const testOptions = [
  undefined,
  {},
  { seed: 'foo' },
  { seed: undefined },
  { seed: { foo: 'foo' } },
  { seed: 1234 },
  { seed: [true, 1, 'foo'] },
  { seed: BigInt(9007199254740991) },
  { palette: ['#F00', 'lime', 'rgba(0, 0, 255, 1.0)'] },
  { palette: [undefined, undefined] },
  ...Array.from(Array(10).keys()).map((k) => ({ complexity: k + 1 })),
  { shapes: ['circle'] },
  { shapes: ['square'] },
  { shapes: [] },
  { size: 256 },
  { size: 32 },
  { cache: 3 },
  { cache: -5 },
];

test('dataURI() runs without errors', () => {
  testOptions.forEach((options) => {
    expect(() => nyf.dataURI(options)).not.toThrowError();
  });
});

test('imgEl() runs without errors', () => {
  testOptions.forEach((options) => {
    expect(() => nyf.imgEl(options)).not.toThrowError();
  });
});

test('imgEl() with img element attributes runs without errors', () => {
  testOptions.forEach((options) => {
    expect(() => nyf.imgEl(options, { class: 'foo', alt: 'bar' })).not.toThrowError();
  });
});
