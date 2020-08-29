# Plugins

> Package path transforms as a plugin to more easily convert to a specific format

## Overview

This document is designed for developers who:

- want more information about the transformation routine
- want to contribute a new transformation format by way of a plugin

## Writing the plugin

### Overview

Whilst writing a transformation function is reasonably straightforward, packaging it as a plugin takes a little more work.

Alias HQ uses a plugin architecture to add new functionality:

- plugins live in named folders
- each folder contains
  - the `index` plugin file which handles path conversion 
  - a `tests` file which provides both tests and CLI options
- all code is **uncompiled** so written in Common JS style

### Get started

Fork the repository, then clone locally.

Decide upon a plugin folder name, and add the files as below:

```
+- plugins
    +- <plugin_name>
        +- index.js         // the plugin file itself
        +- tests.js         // tests and options
```

### Main plugin function

Add the conversion code to the `index.js` file (as per the example code from the `custom.spec.js` file):

```js
module.exports = function (paths, options) {
  return Object.keys(paths).reduce((output, key) => {
    const alias = key.substring(1).replace('/*', '')
    const path = paths[key][0].replace('/*', '') // remember the aliases format supports multiple paths!
    output[alias] = { path }
    return output
  }, {})
}
```

It is a basic example of converting the passed `paths` configuration into a (hypothetical) output hash:

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

Your plugin will always receive an `options` object, with the current `config` and any user options mixed in:

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

## Testing the plugin

Plugins are **required** to have tests with them; the project's tests enforce there is at least one test, and that path conversion succeeds.

The `tests.js` file should export an `array` of **at least** one function:

```js
module.exports = [
	function () { ... }
]
```

Each test function should return an `object` with **at least** the `expected` node which should be the expected converted paths for the plugin called with the supplied options:

```js
function test () {
  return {
    // optional
    label: 'foo bar',
    options: { foo: 'bar' },
    
    // required
    expected: {
      '@api': abs('api'),
      ...
    }
  }
}
```

Note:

-  the `label` and `options` values are **only** required if you need to test multiple configurations (as does the [Rollup](./src/plugins/rollup/tests.js) plugin).
- any returned options will be used in both **tests** and relevant **CLI** commands.

Successful tests should output:

```
available plugins...
  plugin: <your_plugin>
    ✓ should have at least one test
    each test...
      test: foo bar
        ✓ should return an object
        ✓ should receive a "expected" value
        ✓ should correctly convert example paths
```

You can view the actual test code in [`tests/specs/plugins.spec.js`](https://github.com/davestewart/alias-hq/blob/master/tests/specs/plugins.spec.js).

## Using utilities

The `utils/` folder exports various useful functions for use in your plugin and test code.

#### Path utilities

As a convenience, Node's `path.resolve` and `path.join` functions are made available.

This makes it easier to wrangle paths, and defends against errors across various platforms and systems:

```js
const { join, resolve } = require('../../utils')

module.exports = function (paths, { rootUrl, baseUrl }) {
  return Object.keys(paths).reduce((output, key) => {
    const absPath = resolve(rootUrl, baseUrl, paths[key][0])
    ...
  }, {})
}
```

#### Plugin utilities

The `toArray` and `toObject` utilities simplify the unwrapping and re-wrapping of the `paths` config.

This simplifies the writing of the overall conversion function, allowing you to concentrate on each key/value pair in turn:

```js 
const { toArray } = require('../../utils')

// process a single entry
function callback (alias, paths, options) {
  return { alias, path: paths[0] }
}

// processes the paths hash and returns an array
module.exports = function (paths, options) {
  return toArray(paths, callback, options)
}
```

Note that callback functions MUST return an object of the form `{ alias: '', path: '' }`. 

#### Test utilities

For testing against the project's example `jsconfig.json` there are two functions `abs()` and `rel()`.

These return absolute and relative paths to the project's `src/` folder making it simple to write the automated tests:

```js
const { abs } = require('../../utils')

module.exports = [
  function () {
    const expected = {
      '@api': abs('api'),
      ...
    }
    return { expected }
  },
]
```

Please do use the utilities rather than reinventing the wheel!  

## Scripts

You can use the CLI to check the output of all plugins at any time by choosing "List plugins output (JS)":

```
npm run cli
```

You can run the tests with:

```bash
# run all tests
npm run test

# run only the plugins test in watch mode
npm run test:plugins

# run test coverage
npm run test:coverage
```

## Documentation

If you add a plugin, please also update the main [readme](README.md):

- add the name of the plugin to the **Usage** section
- add a simple example to the **Integration examples** section 

For the example, follow the existing format, and include:

- a simple intro sentence, with inline links to any related documentation
- a simple code sample, showing the plugin being used, without bloating it with unrelated setup

## Submitting

To save some work, create an issue to discuss the plugin idea first.

If it looks like it's a good idea, fork the library, update the code and submit a PR.

Thanks :)
