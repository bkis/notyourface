const _cache: Map<string, string> = new Map();

interface NYFOptions {
  seed?: unknown;
  useCache?: boolean;
}

const _DEFAULT_OPTIONS: NYFOptions = {
  seed: undefined,
  useCache: true,
};

const _seed = (input?: unknown) => {
  let str: string;
  try {
    str = JSON.stringify(input ?? Math.random());
  } catch {
    str = String(input);
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return (hash >>> 0).toString(36).padStart(7, '0');
};

const _generate = (o: NYFOptions) => {
  // TODO: implement
  console.debug(`seed: ${o.seed}`);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillRect(25, 25, 100, 100);
  ctx.clearRect(45, 45, 60, 60);
  ctx.strokeRect(50, 50, 50, 50);
  return canvas.toDataURL('image/png');
};

const notyourface = {
  dataURL(options: NYFOptions = _DEFAULT_OPTIONS): string {
    const seed = _seed(options.seed);
    if (!!options.useCache && _cache.has(seed)) return _cache.get(seed) as string;
    const dataURL = _generate({ ...options, seed });
    if (options.useCache) _cache.set(seed, dataURL);
    return dataURL;
  },
  imgEl(options: NYFOptions = _DEFAULT_OPTIONS): HTMLImageElement {
    const el = document.createElement('img');
    el.src = notyourface.dataURL(options);
    return el;
  },
};

export default notyourface;
