# Contributing

## Intro

Thanks for checking out this document.

I'm guessing you're likely here because:

- you want to contribute a [plugin](#plugins)
- you want to improve the project's [code quality](#nice-to-have)

## Plugins

Alias HQ uses a fairly simple plugin architecture to add new functionality to the library.

### Overview

A few points:

- plugins export a single function which receives the `paths` and `options` hashes
- plugins should return whatever format (Object or Array) the consuming library requires
- plugins are placed in the `src/plugins` folder
- plugins may use any of the utils from the `src/utils` folder or native Node functions
- plugin code is not compiled, so file import and export need to be written in Common JS format

### Writing the plugin

Check the following locations for examples of how to write a plugin:

- [`src/plugins/*`](https://github.com/davestewart/alias-hq/tree/master/src/plugins)
- [`tests/specs/plugins.spec.js`](https://github.com/davestewart/alias-hq/blob/master/tests/specs/plugins.spec.js)

The following example code is from the `plugins.spec.js` file:

```js
function plugin (paths, options) {
  return Object.keys(paths).reduce((output, key) => {
    const alias = key.substring(1).replace('/*', '')
    const path = paths[key][0].replace('/*', '') // remember the aliases format supports multiple paths!
    output[alias] = { path }
    return output
  }, {})
}
```

It is a good example of converting the passed `paths` configuration into a (hypothetical) output hash:

```js
{
  'api': { path: 'api' },
  'app': { path: 'app' },
  'config': { path: 'app/config' },
  'services': { path: 'app/services' },
  'utils': { path: 'common/utils' },
}
```

### Consuming options

The passed `options` parameter will always be an `object` with the current `config` and any user options:

```js
{
  // user options
  foo: 'bar',
  
  // base config
  rootUrl: '/volumes/projects/path/to/project',
  baseUrl: 'src',
  paths: {
    '@api/*': [ 'api/*' ],
    '@app/*': [ 'app/*' ],
    ...
  }
}
```

As a convenience, the `utils/` folder also exports Node's `path.resolve` and `path.join` functions:

```js
const { join, resolve } = require('../utils')

function plugin (paths, { rootUrl, baseUrl }) {
  return Object.keys(paths).reduce((output, key) => {
    const absPath = resolve(rootUrl, baseUrl, paths[key][0])
    ...
  }, {})
}
```

### Using utilities

There are additional utilities `toArray` and `toObject` which simplify the unwrapping and re-wrapping of the `paths` config, allowing you to simply write a conversion function which will consume each key/value pair in turn:

```js 
const { toArray } = require('../utils')

// process a single entry
function callback (alias, paths, options) {
  return { alias, path: paths[0] }
}

// processes the paths hash and returns an array
module.exports = function (paths, options) {
  return toArray(paths, callback, options)
}

```

### Saving a plugin

Once you have decided what you want your plugin to do, you will need to:

- decide on the name of the plugin, e.g. `"custom"`
- save it to a named file, such as `src/plugins/custom.js`
- make it the main export with `module.exports = function ...` 

The plugin can then be used by users like so:

```js
const config = hq.get('custom', options)
```

### Automated testing

You can have your plugin automatically tested during development by:

- adding one or more fixtures to  `tests/fixtures/plugins.js`
- use the `plugin()` function to define:
  - an `id` (defined as `name:options`, where name is the plugin `name` and `options` is a friendly identifier for the test output)
  - the expected `config` for the current option
  - an optional `options` hash

You should see something like this when you run the tests:

```
  available plugins
    should convert with options
      ✓ webpack
      ✓ jest
      ✓ rollup:object
      ✓ rollup:array
```

## Scripts

You can see a demo of all plugins and config using:

```
npm run demo
```

You can run the tests with:

```
npm run test
npm run test:coverage
```

## Documentation

If you add a plugin, please also update the main [readme](README.md):

- add the name of the plugin to the **Usage** section
- add a simple example to the **Integration examples** section 

For the example, follow the existing format, and include:

- a simple intro sentence, with inline links to any related documentation
- a simple code sample, showing the plugin being used, without bloating it with unrelated setup

## Nice to have

A few things I'd like to add to the project, but have not got round to / don't know how to:

- Linting (Standard style used throughout)
- Git hooks such as `lint-staged`
- CI (run tests during pull requests)
- Badges

If you can help, please give me a shout!

