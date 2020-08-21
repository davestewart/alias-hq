# Alias HQ 

> Manage a single set of folder aliases and convert as-needed to other formats

## Abstract

#### Background

In any non-trivial JavaScript project, developers use path "aliases" to make imports more intuitive:

```js
// without aliases
import { SomeService } from `../../../core/services`
```
```js
// with aliases
import { SomeService } from `@/services`
```

An alias is just a map of names and folder paths:

```json
'@/services': '/<path to project>/src/core/services/'
```

#### Problem

The problem is that:

- tools in the JavaScript ecosystem (e.g. TypeScript, WebStorm, WebPack, Rollup, Jest, etc) all use **very different formats** 
- this results in the developer needing to duplicate, rewrite and maintain aliases for as many tools as they use in their toolchain

#### Solution

This library attempts to solve that by:

- adopting TypeScript's [path configuration](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) format as the default
- using your project's `tsconfig.json` (or `alias.config.json`) as the "single source of truth"
- providing a plugin architecture to map the configuration to other formats

Note that <strong style="color:red">you don't need TypeScript to use this library</strong> - it is only the configuration format that is borrowed.

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

Open your `tsconfig.json` and add aliases to the `compilerOptions.paths` node using the (rather verbose) wildcard and array format:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@api/*": ["api/*"],
      "@app/*": ["app/*"],
      "@config/*": ["app/config/*"],
      "@shared/*": ["app/shared/*"],
      "@helpers/*": ["common/helpers/*"]
    }
  }
}
```

Feel free to add non-TypeScript paths (such as assets) here; TypeScript will ignore them but Alias HQ will convert them.

#### JavaScript projects

Create a new file  `aliases.config.json` in your project root, and add the aliases to the root:

```json
{
  "@api/*": "api/*",
  "@app/*": "app/*",
  "@config/*": "app/config/*",
  "@shared/*": "app/shared/*",
  "@helpers/*": "common/helpers/*"
}
```

You should use the same TypeScript [format](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) but you can **just add paths as strings**.

## Usage

Using the default configuration files, usage is as simple as an import and helper function:

```js
import aliases from 'alias-hq'

const config = {
  aliases: aliases.as('webpack') // use any available plugin name here
}
```

The library will automatically find either `tsconfig.json` or `aliases.config.json` in your project root, so should "just work":

Alias HQ will load and convert the configuration, which for Webpack as above) will look like the following:

```js
{
  '@api': '/Volumes/Projects/Path/To/Project/api',
  '@app': '/Volumes/Projects/Path/To/Project/app',
  '@config': '/Volumes/Projects/Path/To/Project/app/config',
  '@shared': '/Volumes/Projects/Path/To/Project/app/shared',
  '@helpers': '/Volumes/Projects/Path/To/Project/common/helpers'
}
```
Check the `src/plugins` folder for the full list of plugins, but currently it includes:

- Webpack
- Jest
- Rollup
- Your own custom functions

## API

### Conversion using available plugins

To convert to a desired format, use the `as()` method, passing the plugin name: 

```js
const config = aliases.as('jest')
```

You can also use `to` if you prefer:

```js
const config = aliases.to('jest')
```

### Conversion using your own code

You can also pass a custom function to convert aliases to any format you need:

```js
const config = aliases.to(function (paths, options) {
  // your code here
  return ...
})
```

### Adding custom code as plugins

To add your own plugins, you can use the `plugin` helper...:

```js
aliases.plugin('custom', function (paths, options) { ... })
```

...then access the plugin by name: 

```js
const config = aliases.to('custom')
```

### Custom configuration

To load an alternative configuration, you can also pass a relative or absolute path to the helper, then convert:

```js
const path = __dirname + '/build/paths.json'
const config = aliases
  .load(path)
  .as('rollup')
```
You may also pass a config directly (note that for plugins which require the root path, you will need to pass that in the options object): 
```js
const json = require('./build/paths.json')
const config = aliases
  .load(json)
  .as('webpack', { root: __dirname })
```

The library will attempt to grab `paths` from `compilerOptions` or if it can't find that, will use keys and values in the root node.

### Debugging

Several helper functions allow you to see what is loaded:

```js
// `paths` data from `tsconfig.json`, `aliases.config.json` or other passed path / object 
const paths = aliases.paths()
```

```js
// folder root as determined by the location of the configuration files 
const root = aliases.root()
```

```js
// loaded plugin names, including custom plugins 
const plugins = aliases.plugins()
```

## Integration examples

To get you up and running, here are some example integrations:

### WebStorm

The following configuration can be [used to tell](https://www.jetbrains.com/help/webstorm/using-webpack.html#webpack_module_resolution) WebStorm about your Webpack setup.

Add this file to your project root, and choose it in *Preferences > Languages and Frameworks > JavaScript > Webpack*:

```js
// webpack.config.js
import aliases from 'alias-hq'

module.exports = {
  resolve: {
    alias: aliases.as('webpack')
  }
}
```

### Webpack

If bundling using a vanilla Webpack build, you can [add the aliases](https://webpack.js.org/configuration/resolve/#resolvealias) using the `resolve.alias` configuration option:

```js
// build.js
import aliases from 'alias-hq'

module.exports = {
  ...
  resolve: {
    alias: aliases.as('webpack'),
  },
}
```

### Rollup

If bundling using Rollup and its [alias plugin](https://github.com/rollup/plugins/tree/master/packages/alias) build, you can [add the aliases](https://webpack.js.org/configuration/resolve/#resolvealias) using the `plugins.alias` configuration option:

```js
// rollup.config.js
import aliases from 'alias-hq'
import alias from '@rollup/plugin-alias';

module.exports = {
  ...
  plugins: [
    alias({
      entries: aliases.as('rollup')
    })
  ]
};
```

### Vue

If using Vue CLI, you can [tweak the webpack config](https://cli.vuejs.org/guide/webpack.html#simple-configuration) via the `configureWebpack` option:

```js
// vue.config.js
import aliases from 'alias-hq'

module.exports = {
  configureWebpack: (config) => {
    ...
    config.resolve.alias = aliases.as('webpack')
  },
}
```

### Jest

If running Jest, you can [configure](https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring) the `moduleNameMapper` option:

```js
// jest.config.js
import aliases from 'alias-hq'

module.exports = {
  ...
  moduleNameMapper: aliases.to('jest'),
}
```

