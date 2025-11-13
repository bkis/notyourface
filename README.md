# notyourface

[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](https://www.npmjs.com/package/notyourface)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](#)
[![dependencies: none](https://img.shields.io/badge/dependencies-none-lightgray)](#)
\
[![gzip: 1.3 kB](https://img.shields.io/badge/gzip-1.3_kB-leaf)](#)
[![tests status](https://img.shields.io/github/actions/workflow/status/bkis/notyourface/tests.yml?label=tests)](https://github.com/bkis/notyourface/actions/workflows/tests.yml)
[![coverage is always 100%](https://img.shields.io/badge/coverage-100%-leaf)](#)

**notyourface** deterministically generates random but stable avatar images from any input seed. Like a configurable hash function that produces funky little images. Your face is beautiful! But sometimes you need the next best thing.

![](./docs/assets/example_header_01.png)
![](./docs/assets/example_header_02.png)
![](./docs/assets/example_header_03.png) \
![](./docs/assets/example_header_04.png)
![](./docs/assets/example_header_05.png)
![](./docs/assets/example_header_06.png) \
![](./docs/assets/example_header_07.png)
![](./docs/assets/example_header_08.png)
![](./docs/assets/example_header_09.png)

(for more examples, see the [Configuration](#configuration) section!)

## Features

- 👩‍💻 **Simple** but efficient API, typed with **TypeScript**
- 🎨 Fixed, **custom color palettes** or colorful **randomness**
- 🌱 **Deterministic** (same seed == same image)
- 📦 Only **~1.3kb** gzipped
- ⚡ Works **client-side** (in the browser) and **caches** up to `n` generated avatar images (`1024` by default)
- 🛠 Configurable **complexity**, **size**, **shape types**, ...
- 🐧 **No runtime dependencies** (as in _zero_, _none_, ...wait, why is there a penguin?!)
- 🖼 Returns _encoded image data_ as a [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme), e.g. for direct use as `<img src="...">` or CSS `background-image: url(...)` **or** returns a ready-to-use `img` HTML element – so no DOM manipulations by the library, it's all up to you!
- 🤖 **no AI** involved nor required (in case you were concerned)

## Why?

I wasn't satisfied with any of the comparable existing libraries. They were either too complicated and heavy, too focused on a specific technological context (a framework or library), or just didn't produce the aesthetics I was looking for. So I built this.

## Installation

You got this. Something like...

```sh
npm install notyourface
```

## Usage

Use it in browser-facing code! The library needs access to the `document` object and the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) to generate the images.

You have the choice between two function calls. That's it. One gives you a data URI containing encoded PNG image data you can use as a `src` value for an `<img>` element or as a `background-image` in CSS. The other gives you a ready-to-use `<img>` element with optional attributes (with the same encoded PNG data set as `src`, so this second one is just a convenience wrapper around the first).

```js
import nyf from 'notyourface';

// To get a PNG data URI string, call `dataURI`.
// Optionally, pass some options (see below!).
const dataUri = nyf.dataURI({ seed: 'my.email@example.com' });
// ...so you can do something like this:
someImgElement.src = dataUri;
// ...or this:
someElement.style.backgroundImage = `url(${dataUri})`;

// ...OR, to get an <img> element right away, call `imgEl`.
// Optionally, pass some options (see below!) and/or
// attributes you want to be set on the element.
const imgEl = nyf.imgEl({ seed: 'my.email@example.com' }, { class: 'my-avatar' });
// ...so you can do this:
someElement.appendChild(imgEl);
```

## Configuration

All options are, as the name suggests, optional.

### `seed`

- Type: `unknown` (optional)
- Default: A random seed.

An optional (but recommended) seed. This can be anything: A string, a number, an object, etc. The output will be stable as long as the same seed is used with the same set of other options. Please use something that is unique about what the avatar is going to represent, like a username.

Also, whatever you use as a seed input should be JSON-serializable or at least produce a meaningful string representation. Internally, the seed is converted to a string (using `JSON.stringify` or `String(seed)` as a fallback) and then hashed to a number.

### `size`

- Type: `number` (optional)
- Default: `128`

The size of the generated avatar image **in pixels**. As they are square-shaped, this will be both the width and height.

❗ Be very careful with the size of the generated images. The larger the size, the longer it will take to generate the images. Also, as the cache will store the images in memory, larger images will take up more memory when cached. A maximum `size` value of more or less `256` is recommended. Of course, this greatly depends on where and how you are using this.

#### Examples

Avatar images with `size` values of `64`, `128` and `256`:

![](./docs/assets/example_size_01.png)
![](./docs/assets/example_size_02.png)
![](./docs/assets/example_size_03.png)

### `palette`

- Type: `string[]` (optional)
- Default: `undefined`
- Example: `['#F00', 'lime', 'rgba(0, 0, 255, 1.0)']`

A custom color palette to use. The string values can be any valid CSS color string. Using less than two colors here won't make much sense (think about it!).

If no custom color palette is set, random colors will be used.

❗ If a `seed` is given, a "random" color palette will be stable a.k.a. the same for each call using this seed! _Not so random after all!_

#### Examples

Two different custom color palettes in action. In this case :

- `['#134686', '#ED3F27', '#FEB21A', '#FDF4E3']` and
- `['#004030', '#4A9782', '#DCD0A8', '#FFF9E5']`

![](./docs/assets/example_palette_01a.png)
![](./docs/assets/example_palette_01b.png)
![](./docs/assets/example_palette_01c.png)
![](./docs/assets/example_palette_01d.png)
![](./docs/assets/example_palette_01e.png) \
![](./docs/assets/example_palette_02a.png)
![](./docs/assets/example_palette_02b.png)
![](./docs/assets/example_palette_02c.png)
![](./docs/assets/example_palette_02d.png)
![](./docs/assets/example_palette_02e.png)

### `complexity`

- Type: `1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10` (optional)
- Default: `4`

The number of shapes that will be drawn. This makes for the overall perceived complexity of the avatar image.

#### Examples

Complexity values from 1 to 10:

![](./docs/assets/example_complexity_01.png)
![](./docs/assets/example_complexity_02.png)
![](./docs/assets/example_complexity_03.png)
![](./docs/assets/example_complexity_04.png)
![](./docs/assets/example_complexity_05.png)
![](./docs/assets/example_complexity_06.png)
![](./docs/assets/example_complexity_07.png)
![](./docs/assets/example_complexity_08.png)
![](./docs/assets/example_complexity_09.png)
![](./docs/assets/example_complexity_10.png)

As you can see, we should've realized we're making a huge mistake at around `6`. Maybe `7` and beyond should have never happened. As the shapes are overlapping, it just gets worse at some point.

### `shapes`

- Type: `Array<'square' | 'circle'>` (optional)
- Default: `undefined`

The types of shapes that will be drawn onto the avatar image. This is a way to e.g. reduce the shapes used to only one type. It greatly changes the overall style of the avatar image.

If not set, all types will be used.

💡 No, this does not determine the shape of the generated image. There are no circular digital images. But you can always style your `<img>` element to be circular with `border-radius: 50%` or make it blurry using `filter: blur(2px)`, or whatever you like.

#### Examples

Only `['circle']` or only `['square']`:

![](./docs/assets/example_shapes_01.png)
![](./docs/assets/example_shapes_02.png)
![](./docs/assets/example_shapes_03.png)
![](./docs/assets/example_shapes_04.png)

### `cache`

- Type: `number` (optional)
- Default: `1024`

The number of avatar images to cache in memory.

As this library was developed with an optimistic attitude, negative values will simply be turned into their positive counterparts (so the absolute value is used).

❗ A value of `0` will completely disable the cache for this call, so **it will neither be read from nor written to**.

## Contributing

Please see the [contributing guidelines](CONTRIBUTING.md).

## Development

Use the following `npm` scripts in development:

- `npm run lint`: Runs ESLint with `--fix` flag.
- `npm run format`: Runs Prettier with `--write` flag.
- `npm run fix`: Runs both `lint` and `format` scripts.
- `npm run dev`: Starts the development server. Visit `http://localhost:5173` afterwards to see the development page that hot-reloads and reflects the current state of the source live.
- `npm run build`: Runs the `fix` script, `tsc`, and `vite build` in sequence.
