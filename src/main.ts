const _cache: Map<string, string> = new Map();

interface NYFOptions {
  seed?: unknown;
  scale?: number;
  palette?: string[];
  noCache?: boolean;
  maxCacheSize?: number;
}

interface GuaranteedNYFOptions extends Required<NYFOptions> {
  seed: string;
}

const _seedInt = (input: unknown) => {
  let str: string;
  try {
    str = JSON.stringify(input);
  } catch {
    str = String(input);
  }
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash >>> 0);
};

const _seedStr = (input: unknown) => {
  return _seedInt(input).toString().padStart(8, '0');
};

const _getInt = (min: number = 0, max: number = 100, seed: string) => {
  if (max <= min) throw Error(`Invalid arguments for min (${min}) and max (${max}).`);
  return Math.round(_seedInt(seed) % (max + 1 - min)) + min;
};

const _pick = <T>(arr: T[], seed: string) => {
  return arr[_getInt(0, arr.length - 1, seed)];
};

const _rndCol = (seed?: string) => {
  return (
    '#' +
    Math.floor(seed != null ? _seedInt(seed) % 16777215 : Math.random() * 16777215).toString(16)
  );
};

const _generate = (o: GuaranteedNYFOptions) => {
  const canvas = document.createElement('canvas');
  canvas.width = o.scale;
  canvas.height = o.scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw Error('Could not get canvas context.');
  // background
  ctx.fillStyle = _pick(o.palette, o.seed + 'bg');
  ctx.fillRect(0, 0, o.scale, o.scale);
  // some square
  ctx.fillStyle = _pick(o.palette, o.seed + 's1');
  const s1scale = _getInt(o.scale * 0.2, o.scale * 0.8, o.seed + 's1s');
  ctx.fillRect(
    _getInt(0 - o.scale * 0.2, o.scale * 0.8, o.seed + 's1x'),
    _getInt(0 - o.scale * 0.2, o.scale * 0.8, o.seed + 's1y'),
    s1scale,
    s1scale
  );
  // some circle
  ctx.beginPath();
  ctx.arc(
    _getInt(0 - o.scale * 0.2, o.scale * 0.8, o.seed + 'c1x'),
    _getInt(0 - o.scale * 0.2, o.scale * 0.8, o.seed + 'c1y'),
    _getInt(o.scale * 0.1, o.scale * 0.6, o.seed + 'c1r'),
    0,
    2 * Math.PI
  );
  ctx.fillStyle = _pick(o.palette, o.seed + 'c1');
  ctx.fill();
  return canvas.toDataURL('image/png');
};

const _getOptions = (o?: NYFOptions) => {
  const seed = _seedStr(o?.seed ?? Math.random().toString());
  return {
    seed,
    scale: o?.scale ?? 256,
    palette: o?.palette ?? Array.from(Array(5).keys()).map((k) => _rndCol(k + seed + k)),
    noCache: o?.noCache ?? false,
    maxCacheSize: o?.maxCacheSize ?? 1024,
  } as GuaranteedNYFOptions;
};
const nyf = {
  dataURL(options?: NYFOptions): string {
    // populate options object to work with
    const o = _getOptions(options);
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
