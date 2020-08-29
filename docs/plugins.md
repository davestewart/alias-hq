# Plugins

> Package path transforms as a plugin to more easily convert to a specific format

## Overview

Whilst writing a [conversion function](./api#as-a-custom-format) is fairly simple, packaging it as a plugin takes a little more work.

Alias HQ uses a simple plugin architecture:

- plugins live in named folders
- folders contain plugin and test files: 

```
+- plugins
    +- <plugin_name>
        +- index.js         // the plugin file
        +- tests.js         // tests and options
```

Start your plugin by:

- deciding on a plugin folder name
- creating the above folder and file structure
- or duplicating an existing plugin folder

## Writing the plugin

#### Plugin function

The `index.js` file should export a single function.

The following example is from the [`custom.spec.js`](../blob/master/tests/specs/custom.spec.js) file:

```js
module.exports = function (config, options = null) {
  const paths = config.paths
  return Object.keys(paths).reduce((output, key) => {
    const alias = key.substring(1).replace('/*', '')
    const path = paths[key][0].replace('/*', '')
    output[alias] = { path }
    return output
  }, {})
}
```

Note that all code is **uncompiled** so must be written in [Common JS](https://www.sitepoint.com/understanding-module-exports-exports-node-js/) format.

#### Plugin config

Your plugin will always receive the loaded `config` as the first parameter:

```js
{
  rootUrl: '/volumes/projects/path/to/project',
  baseUrl: 'src',
  paths: {
    '@api/*': [ 'api/*' ],
    '@app/*': [ 'app/*' ],
    ...
  }
}
```

#### Plugin options

Your plugin may receive user options (which can be any JavaScript type) with which you can decide how to customise the transformation:

```js
function (config, options = 'bar') {
  return options.format === 'foo'
  	? fooify(config.paths)
  	: barify(config.paths)
}
```

#### Plugin output

The function should transform and return paths in whatever format the consuming library requires.

The example above outputs the following (hypothetical) object:

```js
{
  'api': { path: 'api' },
  'app': { path: 'app' },
  'config': { path: 'app/config' },
  'services': { path: 'app/services' },
  'utils': { path: 'common/utils' },
}
```

## Testing the plugin

#### Overview

Plugins are **required** to have tests with them; the project's tests enforce:

- there is at least one test
- each test converts the example `jsconfig.json` file correctly 

#### File structure

The `tests.js` file should export an `array` of **at least** one function:

```js
module.exports = [
  function () { ... },
  ...
]
```

#### Function format

Each function should be of the format:

```js
function test () {
  return {
    // [optional] label for tests and CLI
    label: 'foo bar',
    
    // [optional] user options
    options: { foo: 'bar' },
    
    // [required] expected converted paths for the above options
    expected: {
      '@api': abs('api'),
      ...
    }
  }
}
```

The function MUST:

- return an `object` 
- with **at least** the `expected` node
- which MUST match the plugin output for the supplied `options`

Note:

-  the `label` and `options` values are required **only** if you need to test multiple configurations (as per the [Rollup](./src/plugins/rollup/tests.js) plugin).
- any returned `options` will be used in both **tests** and relevant **CLI** commands.

#### Running the tests

The project's test suite will run the payload of each test function against the plugin, passing:

- the loaded `config` based on the sample `jsconfig.json` file in the package root
- the supplied `options` from the test function

Successful tests should print to the terminal:

```
available plugins...
  plugin: <your_plugin>
    ✓ should have at least one test
    each test...
      test: <option.label>
        ✓ should return an object
        ✓ should receive an "expected" value
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

module.exports = function (config) {
  const { paths, rootUrl, baseUrl } = config
  return Object.keys(paths).reduce((output, key) => {
    const absPath = resolve(rootUrl, baseUrl, paths[key][0])
    ...
  }, {})
}
```

#### Plugin utilities

The `toArray` and `toObject` utilities simplify the unwrapping and re-wrapping of the `paths` config.

This simplifies the writing of the overall conversion function, allowing you to concentrate on each `alias => paths` pair in turn:

```js 
const { toArray } = require('../../utils')

// process a single `alias => paths` entry
function callback (alias, config, options) {
  const { rootUrl, baseUrl, paths } = config // note, these are the paths for the alias!
  return {
    alias: alias.replace('/*', ''),
    path: paths[0].replace('/*', '')
  }
}

// process the loaded config and return an array
module.exports = function (config, options) {
  return toArray(callback, config, options)
}
```

Note that `callback` functions MUST return an object of the form `{ alias: '', path: * }` in order to be correctly mapped into arrays or objects. 

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

If you add a plugin, please also update the docs:

- add the name of the plugin to the main [readme](../README.md)
- add a simple example to the [integrations](./integrations.md) document 

For the integrations example, follow the existing format, and include:

- a simple intro sentence, with inline links to any related documentation
- a simple code sample, showing the plugin being used, without bloating it with unrelated setup

## Submitting

To save any wasted effort, create an issue to discuss any proposed plugin first.

If it looks like it's a good idea, fork the library, update the code and submit a PR.

Thanks :)
