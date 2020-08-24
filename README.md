# Alias HQ 

> Manage a single set of folder aliases and convert as-needed to other formats

<p align="center">
  <img src="https://raw.githubusercontent.com/davestewart/alias-hq/master/docs/logo.png" alt="Alias HQ logo">
</p>

## Abstract

### Background

In any non-trivial JavaScript project, developers use path "aliases":

```js
// without aliases
import SomeService from `../../../core/services/some-service`
```
```js
// with aliases
import SomeService from `@services/some-service`
```

The advantage of this is tider, more intuitive imports, and easier refactoring.

### Problem

At their simplest, aliases are just a map of names and folder paths:

```json
'@app'      : './src/app/'
'@services' : './src/app/services/'
'@utils'    : './src/common/utils/'
...
```

However, tools in the JavaScript ecosystem use a variety of **different** formats:

```js
// typescript, vscode
"@services/*": ["src/app/services/*"]

// webpack, eslint, etc
'@services': '/volumes/projects/path/to/project/src/app/services'

// jest
'^@services/(.*)$': '<rootDir>/src/app/services/$1'

// rollup
{
  find: '@services',
  replacement: '/volumes/projects/path/to/project/src/app/services'
}
```

This forces developers who want to use aliases to duplicate, edit and maintain **separate** configurations for each of these tools in their toolchain.

### Solution

Alias HQ solves this fragmentation by:

- adopting TypeScript / VS Code's [configuration](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) as the de facto format
- using your project's [tsconfig.json](https://code.visualstudio.com/docs/typescript/typescript-compiling#_tsconfigjson) or [jsconfig.json](https://code.visualstudio.com/docs/languages/jsconfig) as the "single source of truth"
- providing a plugin architecture to map the configuration to other formats

Note that <strong style="color:red">you don't need to use VS Code <em>or</em> TypeScript to use this library</strong> - it is only the configuration format that is borrowed.

## Setup

### Installation

Install via your package manager of choice:

```bash
npm i --save-dev alias-hq
```
```bash
yarn add -D alias-hq
```

### Configuration

#### TypeScript projects

Open your `tsconfig.json` and add aliases to the `compilerOptions.paths` node using the [somewhat verbose](https://code.visualstudio.com/docs/languages/jsconfig#_using-webpack-aliases) wildcard and array format:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@api/*": ["api/*"],
      "@app/*": ["app/*"],
      "@config/*": ["app/config/*"],
      "@services/*": ["app/services/*"],
      "@utils/*": ["common/utils/*"]
    }
  }
}
```

Note that:

- You can specify a `baseUrl` if files are in subfolders
- The format supports multiple paths (currently Jest is the only conversion format to utilse this)
- You may add **non-TypeScript** paths (such as assets) here; TypeScript will ignore them but Alias HQ will use them
- You don't *have* to use a `@` character, but the convention is to use one

#### JavaScript projects

If you don't already have one, create a new file  `jsconfig.json` in your project root, and copy the format above to add aliases.

## Usage

With the default setup, usage is a one-liner:

```js
import aliases from 'alias-hq'

const config = {
  aliases: aliases.get('webpack') // use any available plugin name here
}
```

Alias HQ will automatically find the configuration files in your project root, and will convert and return paths in the new format:

```js
{
  '@api': '/volumes/projects/path/to/project/src/api',
  '@app': '/volumes/projects/path/to/project/src/app',
  '@config': '/volumes/projects/path/to/project/src/app/config',
  '@services': '/volumes/projects/path/to/project/src/app/services',
  '@utils': '/volumes/projects/path/to/project/src/common/utils'
}
```
You can convert to any of the [supported](https://github.com/davestewart/alias-hq/tree/master/src/plugins) formats...

- Webpack
- Rollup
- Jest

...or supply a custom transform function.

## API

### Conversion to known formats

To convert to a desired format, use the `get()` method, passing the plugin `name`: 

```js
const config = aliases.get('jest')
```

If you need to pass custom options, pass an additional hash: 

```js
const config = aliases.get('fancypants', { foo: 'bar' })
```

You can check for available plugins using:

```js  
console.log(aliases.plugins.names)
```

### Conversion to custom formats

If you need custom transformation, pass a function with the following signature, and return the transformed `paths` data:

```js
function customFormat (paths, options) {
  // your code here
  return ...
}
const config = aliases.get(customFormat)
```

See the [contributing](CONTRIBUTING.md) document for more information on writing custom functions.

### Adding custom code as plugins

You can package any custom code via `plugins.add()`, passing the `name` and `callback` function:

```js
aliases.plugins.add('custom', customFormat)
```

...then later, access the plugin by `name`: 

```js
const config = aliases.get('custom')
```

### Loading alternate configuration

To load alternative configuration, pass a relative or absolute `path` to the helper, then convert using `.get()`:

```js
const path = __dirname + '/build/paths.json'
const config = aliases
  .load(path)
  .get('rollup')
```
You may also pass `json` configurations directly: 
```js
const json = require('./build/paths.json')
const config = aliases
  .load(json)
  .get('webpack', { rootUrl: __dirname })
```

Note that plugins which require the `rootUrl` path (e.g. Webpack and Rollup) will access it via the `options` parameter.

### Debugging

You can check the configuration of Alias HQ at any time, by logging the `config` object:

```js
console.log(aliases.config)
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

Check available plugins via the `plugins` object:

```js
console.log(aliases.plugins.names)
```

```js
[ 'jest', 'rollup', 'webpack' ]
```

## Integration examples

To get you up and running, here are some common framework integrations:

### VS Code

Simply follow the instructions above, and VS Code should pick up your paths.

See the VS Code [documentation](https://code.visualstudio.com/docs/languages/jsconfig#_using-webpack-aliases) for more information.

### WebStorm

The following configuration file can be [used to tell](https://www.jetbrains.com/help/webstorm/using-webpack.html#webpack_module_resolution) WebStorm about your Webpack setup.

Add this file to your project root, and choose it in *Preferences > Languages and Frameworks > JavaScript > Webpack*:

```js
// webpack.config.js
import aliases from 'alias-hq'

module.exports = {
  resolve: {
    alias: aliases.get('webpack')
  }
}
```

### Webpack

If bundling using Webpack, you can [add the aliases](https://webpack.js.org/configuration/resolve/#resolvealias) using the `resolve.alias` configuration option:

```js
// build.js
import aliases from 'alias-hq'

module.exports = {
  ...
  resolve: {
    alias: aliases.get('webpack'),
  },
}
```

### Rollup

If bundling using Rollup and @rollup/plugin-alias, you can [add the aliases](https://github.com/rollup/plugins/tree/master/packages/alias#usage) using the `plugins.alias` configuration option:

```js
// rollup.config.js
import aliases from 'alias-hq'
import alias from '@rollup/plugin-alias';

module.exports = {
  ...
  plugins: [
    alias({
      entries: aliases.get('rollup')
    })
  ]
};
```

### Vue

If using Vue CLI, you can [add the aliases](https://cli.vuejs.org/guide/webpack.html#simple-configuration) using the `configureWebpack` option:

```js
// vue.config.js
import aliases from 'alias-hq'

module.exports = {
  configureWebpack: (config) => {
    ...
    Object.assign(config.resolve.alias, aliases.get('webpack'))
  },
}
```

### Jest

If using Jest, you can [configure](https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring) the `moduleNameMapper` option:

```js
// jest.config.js
import aliases from 'alias-hq'

module.exports = {
  ...
  moduleNameMapper: aliases.get('jest'),
}
```

## Contributing

If you want a specific framework or library supported, check the [contributing](./CONTRIBUTING.md) document or create an [issue](https://github.com/davestewart/alias-hq/issues).