# Contributing

## Intro

Thanks for checking out the contributing document.

I'm guessing you're likely here because:

- you want to contribute a [plugin](#plugins)
- you want to improve the project's [code quality](#nice-to-have)

## Plugins

Alias HQ uses a fairly simple plugin architecture to add new functionality to the library.

### Overview

A few points:

- plugins export a single function which receives the `paths` hash any an `options` hash
- plugins should return whatever format (Object or Array) the consuming library requires
- plugins are placed in the `src/plugins` folder
- plugins may use any of the utils from the `src/utils` folder
- plugin code is not compiled, so needs to be written using Common JS format

### Writing the plugin

Check the following locations for examples of how to write a plugin:

- `src/plugins/*`
- `tests/specs/plugins.spec.js`

The following example code is from the `plugins.spec.js` file:

```js
function plugin (paths, options) {
  return Object.keys(paths).reduce((output, key) => {
    const alias = key.substring(1).replace('/*', '')
    const path = paths[key].replace('/*', '')
    output[alias] = { path }
    return output
  }, {})
}
```

It converts the passed `paths` configuration into the following (hypothetical) output:

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

The `options` parameter will always be an `object` with at least a key for `root` which will be the folder path of the current configuration file.

If you need this, you can use it in conjunction with the `resolve` (simply an alias to `path.resolve`) function from the `utils` folder: 

```js
const { resolve } = require('../utils')

function plugin (paths, { root }) {
  return Object.keys(paths).reduce((output, key) => {
    const path = resolve(root, paths[key])
    ...
  }, {})
}
```

### Using utilities

There are additional utilities `toArray` and `toObject` which simplify the unwrapping and rewrapping of the paths config and just allow you to pass a conversion function:

```js 
const { toArray } = require('../utils')

function callback (alias, path) {
  // your code
  return ...
}

// returns an array
module.exports = function (paths, options) {
  return toArray(paths, callback, options)
}

```

### Saving a plugin

Once you decide what you want your plugin to do, you would need to:

- decide on the name of the plugin, e.g. `"custom"`
- save it to a named file, such as `src/plugins/custom.js`
- make it the main export via `module.exports = function () { ... }` 

The plugin can then be used by users like so:

```js
const config = aliases.to('custom')
```

### Automated testing

You can have your plugin automatically tested by:

- adding a fixture to the `plugins` variable in `tests/fixtures/index.js`
- the `key` should be the `name` of the plugin
- the `value` should be the expected transformed output of the supplied `aliases.config.json` file

If you need to test for any custom `options` you should manually add tests to `tests/specs/plugins.specs.js` . 

## Scripts

You can see a demo of all plugins and helpers using:

```
npm run demo
```

You can run the tests with:

```
npm run test
npm run test:coverage
```

## Documentation

If you add a plugin, please also add a simple section to the documentation section in the main readme.

Follow the existing format, and include:

- a simple intro sentence, with inline links to any related documentation
- a simple code sample, showing the plugin being used, but without bloating it with unrelated parameters

## Nice to have

A few things I'd like to add to the project, but have not got round to / don't know how to:

- Linting (Standard style used throughout)
- Git hooks such as `lint-staged`
- CI (run tests during pull requests)
- Badges

If you can help, please give me a shout!

