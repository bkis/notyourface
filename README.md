# notyourface

[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](#)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)

**notyourface** deterministically generates random but stable avatar images from any input seed. Like a configurable hash function that produces funky little images. Your face is beautiful! But sometimes you need the next best thing.

![](docs/assets/example_small_01.png)
![](docs/assets/example_small_02.png)
![](docs/assets/example_small_03.png) \
![](docs/assets/example_small_04.png)
![](docs/assets/example_small_05.png)
![](docs/assets/example_small_06.png) \
![](docs/assets/example_small_07.png)
![](docs/assets/example_small_08.png)
![](docs/assets/example_small_09.png)


## Features

- 👩‍💻 **Simple** but efficient API, typed with **TypeScript**
- 🌈 Fixed, **custom color palettes** or colorful **randomness**
- 🌱 **Deterministic** (same seed == same image)
- 📦 Only ~3kb (**~1.5kb** gzipped)
- ⚡ Works **client-side** (in the browser) and **caches** up to `n` generated avatar images (`1024` by default)
- 🛠 Configurable **complexity**, **size**, **shape types**, ...
- 🐧 **No runtime dependencies** (as in _zero_, _none_, ...wait, why is there a penguin?!)
- 🖼 Returns _encoded image data_ as a [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme) for use as `<img src="...">` or CSS `background-image: url(...)` **or** returns a ready-to-use `img` HTML element
- 🤖 **no AI** involved nor required (in case you were concerned)

## Usage

```js
import nyf from 'notyourface';

// To get a data URI string, call `dataURI`.
// Optionally, pass some options (see below!).
const dataUri = nyf.dataURI({ seed: 'my.email@example.com' });

// Or, get an <img> element, call `imgEl`.
// Optionally, pass some options (see below!)
// and/or attributes you want to be set on the element.
const imgEl = nyf.imgEl({ seed: 'my.email@example.com' }, { class: 'my-avatar' });
```

## Options

All options are, as the name suggests, optional.

### `seed`

- Type: `unknown` (optional)
- Default: A random seed.

Optional seed (can be anything: a string, a number, an object, etc.). The output will be stable as long as the same seed (with the same set of other options) is used.

### `size`

- Type: `number` (optional)
- Default: `128`

The size of the generated avatar image **in pixels**. As they are square-shaped, this will be both the width and height.

⚠ Be very careful with the size of the generated images. The larger the size, the longer it will take to generate the images. Also, as the cache will store the images in memory, larger images will take up more memory when cached. A maximum `size` value of more or less `256` is recommended. Of course, this greatly depends on where and how you are using this.

### `palette`

- Type: `string[]` (optional)
- Default: `undefined`
- Example: `['#F00', 'lime', 'rgba(0, 0, 255, 1.0)']`

A custom color palette to use. The string values can be any valid CSS color string. Using less than two colors here won't make much sense, think about it.

If no custom color palette is set, random colors will be used.

⚠ If a `seed` is given, a "random" color palette will be the same for each call using this seed! _Not so random after all!_

### `complexity`

- Type: `1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10` (optional)
- Default: `4`

The number of shapes that will be drawn. This makes for the overall perceived complexity of the avatar image.

### `shapes`

- Type: `'square' | 'circle'` (optional)
- Default: `undefined`

The types of shapes that will be drawn onto the avatar image. This is a way to e.g. reduce the shapes used to only one type. It greatly changes the overall style of the avatar image.

If not set, all types will be used.

💡 No, this does not determine the shape of the generated image. There are no circular images, duh!

### `cache`

- Type: `number` (optional)
- Default: `1024`

The number of avatar images to cache in memory.

As this library was developed with an optimistic attitude, negative values will simply be turned into their positive counterparts (so the absolute value is used).

⚠ A value of `0` will completely disable the cache for this call, so **it will neither be read from nor written to**.


## Contributing

Please see the [contributing guidelines](CONTRIBUTING.md).
