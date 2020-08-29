# API

> Manage configured aliases using JavaScript code 

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

See:

- the [debugging](#log-config) section below for an example `config` object.

- the [plugins](plugins.md) document for detailed information on writing custom transforms

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

## Debugging

There might be times when you need to check what is happening under the hood.

### Log config

Check the loaded configuration:

```js
console.log(hq.config)
```

```js
{
  rootUrl: '/volumes/projects/path/to/project',
  baseUrl: 'src',
  paths: {
    '@api/*': [ 'api/*' ],
    '@app/*': [ 'app/*' ],
    '@config/*': [ 'app/config/*' ],
    '@services/*': [ 'app/services/*' ],
    '@utils/*': [ 'common/utils/*' ]
  }
}
```

### Get plugin names

Check available plugin names:

```js
console.log(hq.plugins.names)
```

```js
[ 'jest', 'rollup', 'webpack' ]
```

### Grab plugin output as JSON

Dump configured paths in JSON format for any plugin:

```js
hq.json('jest')
```

```json
{
  "^@api/(.*)$": "<rootDir>/src/api/$1",
  "^@app/(.*)$": "<rootDir>/src/app/$1",
  "^@config/(.*)$": "<rootDir>/src/app/config/$1",
  "^@services/(.*)$": "<rootDir>/src/app/services/$1",
  "^@utils/(.*)$": [
    "<rootDir>/src/common/utils/$1",
    "<rootDir>/src/vendor/utils/$1"
  ]
}
```

## CLI

Note that the [CLI](./cli.md) provides an alternative prompt-driven interface to do all of the above, and more.

