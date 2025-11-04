const _cache: Map<string, string> = new Map();

interface NYFOptions {
  seed?: unknown;
  scale?: number;
  noCache?: boolean;
  palette?: string[];
}

interface GuaranteedNYFOptions extends Required<NYFOptions> {
  seed: string;
}

const _DEFAULT_OPTIONS: GuaranteedNYFOptions = {
  seed: Math.random().toString(),
  scale: 256,
  noCache: false,
  palette: ['#002500', '#929982', '#EDCBB1', '#B7245C', '#843B62'],
};

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

const nyf = {
  dataURL(options: NYFOptions = _DEFAULT_OPTIONS): string {
    // process seed to get something that makes sense as a mapping key
    const seed = _seedStr(options.seed ?? _DEFAULT_OPTIONS.seed);
    // check if we can serve from cache (if cache usage isn't disabled in options)
    if (!options.noCache && _cache.has(seed)) {
      return _cache.get(seed) as string;
    }
    // generate new avatar data URL
    const dataURL = _generate({
      seed,
      scale: options.scale ?? _DEFAULT_OPTIONS.scale,
      noCache: options.noCache ?? _DEFAULT_OPTIONS.noCache,
      palette: options.palette ?? _DEFAULT_OPTIONS.palette,
    });
    // write to cache (if cache usage isn't disabled in options)
    if (!options.noCache) {
      _cache.set(seed, dataURL);
    }
    return dataURL;
  },
  imgEl(options: NYFOptions = _DEFAULT_OPTIONS): HTMLImageElement {
    const el = document.createElement('img');
    el.src = nyf.dataURL(options);
    return el;
  },
};

export default nyf;
