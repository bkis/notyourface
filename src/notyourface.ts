//// TYPES ////

type ComplexityValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type ShapeName = 'square' | 'circle';

interface UserOptions {
  seed?: unknown;
  size?: number;
  palette?: string[];
  complexity?: ComplexityValue;
  shapes?: ShapeName[];
  cache?: number;
}

interface Options {
  seed: string;
  prng: () => number;
  size: number;
  palette?: string[];
  complexity: ComplexityValue;
  shapes?: ShapeName[];
  cache: number;
}

//// INTERNAL UTILITY FUNCTIONS ////

/**
 * Returns a numerical representation of an input of unknown type
 * for use as a numerical seed.
 */
const _seedInt = (input: unknown) => {
  let str: string;
  try {
    str = JSON.stringify(input);
  } catch {
    str = String(input);
  }
  let hash = 0;
  for (const char of str) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return hash;
};

/**
 * Returns a pseudo-random number generator function based on a numerical input seed.
 * (Mulberry32 algorithm, taken from https://stackoverflow.com/a/47593316/7399631)
 */
export const _prng = (a: number) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Returns a random integer between min and max (inclusive)
 * using the given random number generator function.
 */
export const _pickInt = (min: number = 0, max: number = 100, rnd: () => number) => {
  if (min > max) throw Error(`min (${min}) > (${max}).`);
  const span = Math.floor(max) + 1 - Math.ceil(min);
  return Math.floor(span * rnd()) + Math.ceil(min);
};

/**
 * Picks a color from the palette given in the passed options object by
 * rotating the palette, or, if no palette is given, generates a random color
 * using the given random number generator function.
 */
export const _pickColor = (o: Options) => {
  if (o.palette?.length) {
    // pick and rotate
    const v = o.palette.pop();
    if (v) o.palette.unshift(v);
    return v ?? 'red';
  } else {
    // return (seed-stable) random color
    return (
      '#' +
      _pickInt(0, 0xfffff * 1000000, o.prng)
        .toString(16)
        .slice(0, 6)
    );
  }
};

/**
 * Shuffles the given array using the given random number generator function.
 */
const _shuffle = <T>(arr: Array<T>, rnd: () => number) => {
  let currentIndex = arr.length;
  while (currentIndex != 0) {
    const randomIndex = Math.floor(rnd() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
};

/**
 * Draws a square into the given canvas context.
 */
const _drawSquare = (ctx: CanvasRenderingContext2D, o: Options, sizeMod: number = 1) => {
  ctx.fillStyle = _pickColor(o);
  const size = _pickInt(o.size * 0.5 * sizeMod, o.size * sizeMod, o.prng);
  const posMod = size / 2;
  const x = _pickInt(o.size * 0.2 - posMod, o.size - o.size * 0.2 + posMod, o.prng);
  const y = _pickInt(o.size * 0.2 - posMod, o.size - o.size * 0.2 + posMod, o.prng);
  const xTrans = x + size / 2;
  const yTrans = y + size / 2;
  ctx.translate(xTrans, yTrans);
  ctx.rotate(_pickInt(0, 360, o.prng));
  ctx.translate(-xTrans, -yTrans);
  ctx.fillRect(x, y, size, size);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

/**
 * Draws a circle into the given canvas context.
 */
const _drawCircle = (ctx: CanvasRenderingContext2D, o: Options, sizeMod: number = 1) => {
  ctx.beginPath();
  const radius = _pickInt(o.size * 0.5 * sizeMod, o.size * sizeMod, o.prng);
  const posMod = radius / 2;
  ctx.arc(
    _pickInt(o.size * 0.2 - posMod, o.size - o.size * 0.2 + posMod, o.prng),
    _pickInt(o.size * 0.2 - posMod, o.size - o.size * 0.2 + posMod, o.prng),
    radius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = _pickColor(o);
  ctx.fill();
};

/**
 * Makes sure the passed options object is complete and returns a new object with
 * all options set.
 */
const _processOptions = (o?: UserOptions) => {
  const seedInt = _seedInt(o?.seed ?? Math.random().toString());
  const prng = _prng(seedInt);
  const palette = o?.palette?.length ? _shuffle(o.palette, prng) : undefined;
  return {
    seed: seedInt.toString(),
    prng,
    palette,
    complexity: o?.complexity ?? 4,
    size: o?.size ?? 128,
    shapes: o?.shapes?.length ? [...new Set(o.shapes)] : undefined,
    cache: o?.cache != null ? Math.abs(o.cache) : 1024,
  } as Options;
};

//// AVATAR GENERATION PROCEDURE ////

const _generate = (o: Options) => {
  const canvas = document.createElement('canvas');
  canvas.width = o.size;
  canvas.height = o.size;
  const ctx = canvas.getContext('2d');
  /* v8 ignore if -- @preserve */
  if (!ctx) throw new Error();
  // background
  ctx.fillStyle = _pickColor(o);
  ctx.fillRect(0, 0, o.size, o.size);
  // define available draw actions
  type ShapeDrawAction = { type: ShapeName; fn: (sm: number) => void };
  const actions: ShapeDrawAction[] = [
    { type: 'circle' as ShapeName, fn: (sm: number) => _drawCircle(ctx, o, sm) },
    { type: 'square' as ShapeName, fn: (sm: number) => _drawSquare(ctx, o, sm) },
  ].filter((a: ShapeDrawAction) => !o.shapes?.length || o.shapes.includes(a.type));
  // draw shapes, count depends on complexity option value
  for (let i = 1; i <= o.complexity; i++) {
    actions[i % actions.length].fn(1.25 - i / o.complexity);
  }
  return canvas.toDataURL();
};

//// SIMPLE SHORT-TERM MEMORY (a.k.a. cache) ////

const _cache: Map<string, string> = new Map();

//// EXTERNAL API ////

/**
 * Generates PNG image data based on the given options and returns it encoded as data URI.
 */
export const dataURI = (options?: UserOptions): string => {
  // populate options object to work with
  const o = _processOptions(options);
  // process seed to get something that makes sense as a mapping key
  // check if we can serve from cache (if cache usage isn't disabled in options)
  if (!!o.cache && _cache.has(o.seed)) {
    return _cache.get(o.seed) as string;
  }
  // generate new avatar data URI
  const dataURI = _generate(o);
  // write to cache (if cache usage isn't disabled in options)
  if (!!o.cache && _cache.size < o.cache) {
    _cache.set(o.seed, dataURI);
  }
  return dataURI;
};

/**
 * Generates PNG image data based on the given options and returns
 * an img tag with the PNG data encoded as data URI.
 * Also, the given `attrs` object is applied to the img tag as attributes.
 */
export const imgEl = (options?: UserOptions, attrs?: Record<string, string>): HTMLImageElement => {
  const el = document.createElement('img');
  el.src = dataURI(options);
  // apply additional element attributes
  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      el.setAttribute(key, attrs[key]);
    });
  }
  return el;
};

const nyf = { dataURI, imgEl };
export default nyf;
