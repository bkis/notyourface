const _cache: Record<string, string> = {};

const _getSeed = (input?: unknown) => {
  // TODO: come up with better seed preprocessing
  return String(input ?? Math.random());
};

const _generate = (seed: string) => {
  // TODO: implement
  console.debug(`seed: ${seed}`);
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath d='M4 7.33l2.952-2.954c.918-.918.9-2.256.066-3.087A2.134 2.134 0 0 0 4 1.29a2.132 2.132 0 0 0-3.015-.01C.15 2.12.13 3.46 1.05 4.372L4 7.33z'/%3E%3C/svg%3E";
};

const notyourface = (seed?: unknown, useCache: boolean = true) => {
  const nyfSeed = _getSeed(seed);
  if (useCache && nyfSeed in _cache) return _cache[nyfSeed];
  const nyf = _generate(nyfSeed);
  if (useCache) _cache[nyfSeed] = nyf;
  return nyf;
};

export default notyourface;
