const _cache: Map<string, string> = new Map();

/**
 * TYPES
 */

type Modify<T, R> = Omit<T, keyof R> & R;

interface NYFOptions {
  seed?: unknown;
  size?: number;
  palette?: string[];
  noCache?: boolean;
  maxCacheSize?: number;
}

type GuaranteedNYFOptions = Modify<
  Required<NYFOptions>,
  {
    seed: string;
    palette?: string[];
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

const _pick = <T>(arr: T[], rnd: () => number) => {
  return arr[_getInt(0, arr.length - 1, rnd)];
};

const _getCol = (rnd: () => number, palette?: string[]) => {
  if (palette?.length) {
    return _pick(palette, rnd);
  } else {
    return (
      '#' +
      _getInt(0, 0xfffff * 1000000, rnd)
        .toString(16)
        .slice(0, 6)
    );
  }
};

const _getOptions = (o?: NYFOptions) => {
  const seed = _seedStr(o?.seed ?? Math.random().toString());
  return {
    seed,
    size: o?.size ?? 128,
    noCache: o?.noCache ?? false,
    maxCacheSize: o?.maxCacheSize ?? 1024,
    palette: o?.palette,
    rnd: _getRndFn(_seedInt(seed)),
  } as GuaranteedNYFOptions;
};

const _drawSquare = (
  ctx: CanvasRenderingContext2D,
  o: GuaranteedNYFOptions,
  sizeMod: number = 1
) => {
  ctx.fillStyle = _getCol(o.rnd, o.palette);
  const size = _getInt(o.size * 0.5 * sizeMod, o.size * sizeMod, o.rnd);
  const posMod = size / 2;
  ctx.fillRect(
    _getInt(o.size * 0.2 - posMod, o.size - o.size * 0.2 + posMod, o.rnd),
    _getInt(o.size * 0.2 - posMod, o.size - o.size * 0.2 + posMod, o.rnd),
    size,
    size
  );
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
  ctx.fillStyle = _getCol(o.rnd, o.palette);
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
  if (!ctx) throw Error('Could not get canvas context.');
  // background
  ctx.fillStyle = _getCol(o.rnd, o.palette);
  ctx.fillRect(0, 0, o.size, o.size);
  _drawSquare(ctx, o, 1.0); // some square
  _drawCircle(ctx, o, 0.8); // some circle
  _drawSquare(ctx, o, 0.6); // some square
  _drawCircle(ctx, o, 0.4); // some circle
  return canvas.toDataURL('image/png');
};

/**
 * EXTERNAL API
 */

const nyf = {
  dataURL(options?: NYFOptions): string {
    // populate options object to work with
    const o = _getOptions(options);
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
  imgEl(options?: NYFOptions): HTMLImageElement {
    const el = document.createElement('img');
    el.src = nyf.dataURL(options);
    return el;
  },
};

export default nyf;
