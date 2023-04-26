# API

> Read and transform path aliases using JavaScript  

## Overview

The Alias HQ is quite simple, just three methods:

- `get(name, options?)` or `get(callback)`
- `load(path)`
- `add(name, callback)`

## `get(name, options?)`

> Grab and convert paths in a particular format

### Using available plugins

To grab paths using [available plugins](../integrations.md) call `get(...)` with the plugin name:

```js
import hq from 'alias-hq'

const config = hq.get('webpack')
```

To provide custom options, pass an additional hash: 

```js
const config = hq.get('rollup', { format: 'object' })
```

### As a custom format

If you need custom transformation:

- pass a function with the following signature
- transform the loaded config
- return the result

```js
function fooify (config, options) {
  const { rootUrl, baseUrl, paths } = config
  // transform config.paths ...
  return ...
}
const config = hq.get(fooify)
```

See the [plugins](plugins.md) document for detailed information on writing custom transforms

## `load(path)`

> Load a custom `tsconfig.json` file

Alias HQ attempts to load either `js/tsconfig.json` in the project root.

However, you can load any custom config directly:

```ts
import hq from 'alias-hq'

const config = hq.load('path/to/tsconfig.custom.json').get(...)
```

Note when using `extends` that TypeScript (and Alias HQ) will use the **top-most**  `paths` block – so don't place paths in separate files thinking they will be combined, as they won't.

## `add(name, callback)`

> Add a plugin to be called by name

You can package custom code via `plugins.add()`, passing a`name` and `callback` function:

```js
hq.plugins.add('foo', fooify)
```

Then simply `get()` the paths by passing the plugin `name`: 

```js
const config = hq.get('foo')
```

*If you want to submit a custom format as a plugin to the repository, post an issue or PR.*

