# notyourface

Your face is beautiful! But sometimes you need the next best thing. **notyourface** generates random but stable avatar images from any input seed. Like a configurable hash function that produces funky little images.

[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](#)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)

## Features

- 👩‍💻 **Simple** but efficient API, typed with **TypeScript**
- 🌈 Fixed, **custom color palettes** or colorful **randomness**
- 🌱 **Deterministic** (same seed == same image)
- 📦 Only ~3kb (**~1.5kb** gzipped)
- ⚡ Works **client-side** (in the browser) and is able to **cache** up to `n` generated avatar images
- 🛠 Configurable **complexity**, **size**, **shape types**, ...
- 🐧 **No runtime dependencies** (as in _zero_, _none_, ...wait, why is there a penguin?!)
- 🖼 Returns _encoded image data_ as a [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) for use as `<img src="...">` or CSS `background-image: url(...)` **or** returns a ready-to-use `img` HTML element
- 🤖 **no AI** involved nor required (in case you were concerned)

## Usage

```js
import nyf from 'notyourface';

// define options (because we're reusing them later)
const nyfOptions = {
  seed: 'my.email@example.com', // or whatever! default: random seed
  size: 100, // in pixels, default: 128
  palette: ['#F00', '#0F0', '#00F'], // color palette, default: random
  complexity: 3, // number of shapes, default: 4
  shapes: ['circle'], // shapes selection, default: ['circle', 'square']
  noCache: false, // disable cache, default: false
  maxCacheSize: 100, // no. of cached images, default: 1000
};

// get a data URI string
const dataUri = nyf.dataURI(nyfOptions);

// ...or get a <img> element
const imgEl = nyf.imgEl(nyfOptions, { class: 'my-avatar' });
```

## Examples

...

## Contributing

...
