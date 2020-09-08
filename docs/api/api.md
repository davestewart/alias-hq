# API

> Read and transform path aliases using JavaScript  

## Get paths

### Using available plugins

To grab paths using available formats / plugins, call `get()` with the plugin name:

```js
import hq from 'alias-hq'

const config = hq.get('webpack') // use any available plugin name here
```

If you need to pass custom options, pass an additional hash: 

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

## Plugins

You can package custom code via `plugins.add()`, passing the `name` and `callback` function:

```js
hq.plugins.add('foo', fooify)
```

Then simply `get()` the paths by passing the plugin `name`: 

```js
const config = hq.get('foo')
```

*If you want to submit a custom format as a plugin to the repository, post an issue or PR.*

