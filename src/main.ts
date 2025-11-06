/**
 * TYPES
 */

type Modify<T, R> = Omit<T, keyof R> & R;
type ComplexityValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type ObjectType = 'square' | 'circle' | 'triangle';

interface NYFOptions {
  seed?: unknown;
  size?: number;
  palette?: string[];
  complexity?: ComplexityValue;
  objects?: ObjectType[];
  noCache?: boolean;
  maxCacheSize?: number;
}

type GuaranteedNYFOptions = Modify<
  Required<NYFOptions>,
  {
    seed: string;
    palette?: string[];
    objects?: ObjectType[];
    rnd: () => number;
  }
>;

/**
 * INTERNAL UTILITY FUNCTIONS
 */

const _seedInt = (input: unknown) => {
  let str: string;
  try {
    str = JSON.stringify(input ?? Math.random().toString());
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

const _seedStr = (input: unknown) => {
  return _seedInt(input).toString().padStart(8, '0');
};

function _getRndFn(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const _getInt = (min: number = 0, max: number = 100, rnd: () => number) => {
  if (max < min) throw Error(`Invalid arguments for min (${min}) and max (${max}).`);
  const span = Math.floor(max) + 1 - Math.ceil(min);
  return Math.floor(span * rnd()) + Math.ceil(min);
};

const _getCol = (o: GuaranteedNYFOptions) => {
  if (o.palette?.length) {
    return _rotateArr(o.palette) ?? '#fff';
  } else {
    // return (seed-stable) random color
    return (
      '#' +
      _getInt(0, 0xfffff * 1000000, o.rnd)
        .toString(16)
        .slice(0, 6)
    );
  }
};

const _shuffle = <T>(arr: Array<T>, rnd: () => number) => {
  let currentIndex = arr.length;
  while (currentIndex != 0) {
    const randomIndex = Math.floor(rnd() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
};

const _rotateArr = <T>(arr: Array<T>) => {
  const v = arr.pop();
  if (v) arr.unshift(v);
  return v;
};

const _processOptions = (o?: NYFOptions) => {
  const seed = _seedStr(o?.seed ?? Math.random().toString());
  const rnd = _getRndFn(_seedInt(seed));
  const palette = o?.palette?.length ? _shuffle(o.palette, rnd) : undefined;
  return {
    seed,
    rnd,
    palette,
    complexity: o?.complexity ?? 4,
    size: o?.size ?? 128,
    objects: o?.objects?.length ? [...new Set(o.objects)] : undefined,
    noCache: o?.noCache ?? false,
    maxCacheSize: o?.maxCacheSize ?? 1024,
  } as GuaranteedNYFOptions;
};

const _drawSquare = (
  ctx: CanvasRenderingContext2D,
  o: GuaranteedNYFOptions,
  sizeMod: number = 1
) => {
  ctx.fillStyle = _getCol(o);
  const size = _getInt(o.size * 0.5 * sizeMod, o.size * sizeMod, o.rnd);
  const posMod = size / 2;
  const x = _getInt(o.size * 0.2 - posMod, o.size - o.size * 0.2 + posMod, o.rnd);
  const y = _getInt(o.size * 0.2 - posMod, o.size - o.size * 0.2 + posMod, o.rnd);
  const xTrans = x + size / 2;
  const yTrans = y + size / 2;
  ctx.translate(xTrans, yTrans);
  ctx.rotate(_getInt(0, 360, o.rnd));
  ctx.translate(-xTrans, -yTrans);
  ctx.fillRect(x, y, size, size);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};

const _drawCircle = (
  ctx: CanvasRenderingContext2D,
  o: GuaranteedNYFOptions,
  sizeMod: number = 1
) => {
  ctx.beginPath();
  const radius = _getInt(o.size * 0.5 * sizeMod, o.size * sizeMod, o.rnd);
  const posMod = radius / 2;
  ctx.arc(
    _getInt(o.size * 0.2 - posMod, o.size - o.size * 0.2 + posMod, o.rnd),
    _getInt(o.size * 0.2 - posMod, o.size - o.size * 0.2 + posMod, o.rnd),
    radius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = _getCol(o);
  ctx.fill();
};

/**
 * AVATAR GENERATION PROCEDURE
 */

const _generate = (o: GuaranteedNYFOptions) => {
  const canvas = document.createElement('canvas');
  canvas.width = o.size;
  canvas.height = o.size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/png');
  // background
  ctx.fillStyle = _getCol(o);
  ctx.fillRect(0, 0, o.size, o.size);
  // define available draw actions
  type ObjectDrawAction = { type: ObjectType; fn: (sm: number) => void };
  const actions: ObjectDrawAction[] = [
    { type: 'circle' as ObjectType, fn: (sm: number) => _drawCircle(ctx, o, sm) },
    { type: 'square' as ObjectType, fn: (sm: number) => _drawSquare(ctx, o, sm) },
  ].filter((a: ObjectDrawAction) => !o.objects?.length || o.objects.includes(a.type));
  // draw objects, count depends on complexity option value
  for (let i = 1; i <= o.complexity; i++) {
    actions[i % actions.length].fn(1.25 - i / o.complexity);
  }
  return canvas.toDataURL('image/png');
};

/**
 * SIMPLE SHORT-TERM MEMORY
 */

const _cache: Map<string, string> = new Map();

/**
 * EXTERNAL API
 */

const nyf = {
  dataURL(options?: NYFOptions): string {
    // populate options object to work with
    const o = _processOptions(options);
    if (o.size > 256)
      console.warn(
        `Be careful with the size of your avatars. Due to performance reasons, the maximum recommended size is 256px.`
      );
    // process seed to get something that makes sense as a mapping key
    // check if we can serve from cache (if cache usage isn't disabled in options)
    if (!o.noCache && _cache.has(o.seed)) {
      return _cache.get(o.seed) as string;
    }
    // generate new avatar data URL
    const dataURL = _generate(o);
    // write to cache (if cache usage isn't disabled in options)
    if (!o.noCache && _cache.size < o.maxCacheSize) {
      _cache.set(o.seed, dataURL);
    }
    return dataURL;
  },
  imgEl(options?: NYFOptions, attrs?: Record<string, string>): HTMLImageElement {
    const el = document.createElement('img');
    el.src = nyf.dataURL(options);
    // apply additional element attributes
    if (attrs) {
      Object.keys(attrs).forEach((key) => {
        el.setAttribute(key, attrs[key]);
      });
    }
    return el;
  },
};

export default nyf;
