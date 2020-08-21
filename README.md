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

The problem with existing alias setups is that:

- tools in the JavaScript ecosystem use **completely different formats** 
- developers need to maintain seaparate configurations for each of these tools in their toolchain

#### Solution

Alias HQ attempts to solve that by:

- adopting TypeScript's [path configuration](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) format
- using your project's `tsconfig.json` (or custom `alias.config.json`) as the "single source of truth"
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
      "@services/*": ["app/services/*"],
      "@utils/*": ["common/utils/*"]
    }
  }
}
```

Feel free to add non-TypeScript paths (such as assets) here; TypeScript will ignore them but Alias HQ will convert them.

#### JavaScript projects

Create a new file  `aliases.config.json` in your project root, and add aliases to the root:

```json
{
  "@api/*": "api/*",
  "@app/*": "app/*",
  "@config/*": "app/config/*",
  "@services/*": "app/services/*",
  "@utils/*": "common/utils/*"
}
```

You should use the same TypeScript [wildcard format](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) but you may **add paths as strings** rather than arrays if you wish.

## Usage

With the default configuration, usage is a one-liner:

```js
import aliases from 'alias-hq'

const config = {
  aliases: aliases.as('webpack') // use any available plugin name here
}
```

Alias HQ will automatically find the configuration files in your project root, and will convert and return in the new format:

```js
{
  '@api': '/volumes/projects/path/to/project/api',
  '@app': '/volumes/projects/path/to/project/app',
  '@config': '/volumes/projects/path/to/project/app/config',
  '@services': '/volumes/projects/path/to/project/app/services',
  '@utils': '/volumes/projects/path/to/project/common/utils'
}
```
You can convert to any of the supported formats...

- Webpack
- Rollup
- Jest

...or supply your own custom functions.

## API

### Conversion using available plugins

To convert to a desired format, use the `as()` method, passing the plugin `name`: 

```js
const config = aliases.as('jest')
```

You can also use `to()` if you prefer:

```js
const config = aliases.to('jest')
```

### Conversion using your own code

If you need custom functionality, pass a custom function with the following signature, and return the transformed `paths` data:

```js
function customFormat (paths, options) {
  // your code here
  return ...
}
const config = aliases.to(customFormat)
```

### Adding custom code as plugins

You can package any custom code using the `plugin()` helper, passing the `name` and `callback` function:

```js
aliases.plugin('custom', customFormat)
```

...then later, access the plugin by `name`: 

```js
const config = aliases.to('custom')
```

### Custom configuration

To load alternative configuration, pass a relative or absolute `path` to the helper, then convert using `as()` or `to()`:

```js
const path = __dirname + '/build/paths.json'
const config = aliases
  .load(path)
  .as('rollup')
```
You may also pass `json` configurations directly: 
```js
const json = require('./build/paths.json')
const config = aliases
  .load(json)
  .as('webpack', { root: __dirname })
```

Note that plugins which require the `root` path (e.g. Webpack and Rollup) will access it via the `options` parameter.

### Debugging

Several helper functions allow you to see the state of Alias HQ at any time:

```js
// `paths` data from `tsconfig.json`, `aliases.config.json` or other passed path / object 
const paths = aliases.paths()
```

```js
// folder root as determined by the location of the configuration file
const root = aliases.root()
```

```js
// loaded plugin names, including custom plugins 
const plugins = aliases.plugins()
```

## Integration examples

To get you up and running, here are some common framework integrations:

### WebStorm

The following configuration file can be [used to tell](https://www.jetbrains.com/help/webstorm/using-webpack.html#webpack_module_resolution) WebStorm about your Webpack setup.

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

If bundling using Webpack, you can [add the aliases](https://webpack.js.org/configuration/resolve/#resolvealias) using the `resolve.alias` configuration option:

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

If bundling using Rollup and @rollup/plugin-alias, you can [add the aliases](https://github.com/rollup/plugins/tree/master/packages/alias#usage) using the `plugins.alias` configuration option:

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

If using Vue CLI, you can [add the aliases](https://cli.vuejs.org/guide/webpack.html#simple-configuration) using the `configureWebpack` option:

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

If testing using Jest, you can [configure](https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring) the `moduleNameMapper` option:

```js
// jest.config.js
import aliases from 'alias-hq'

module.exports = {
  ...
  moduleNameMapper: aliases.as('jest'),
}
```

## Contributing

If you see a framework or library here that you would like supported check the [contributing](./CONTRIBUTING.md) document or create an [issue](https://github.com/davestewart/alias-hq/issues).

Thanks.  