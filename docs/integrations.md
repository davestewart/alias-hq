# Integrations

> Use configured path aliases in a variety of IDEs, libraries and frameworks

## VS Code

Follow the instructions in the [Configure paths](cli/paths.md) document and VS Code should pick up your paths.

See the VS Code [documentation](https://code.visualstudio.com/docs/languages/jsconfig#_using-webpack-aliases) for more information.

## WebStorm

The following configuration file can be [used to tell](https://www.jetbrains.com/help/webstorm/using-webpack.html#webpack_module_resolution) WebStorm about your Webpack setup.

Add this file to your project root, and choose it in *Preferences > Languages and Frameworks > JavaScript > Webpack*:

```js
// webpack.config.js
import hq from 'alias-hq'

module.exports = {
  resolve: {
    alias: hq.get('webpack')
  }
}
```

## Node

Although Node [doesn't support](https://arunmichaeldsouza.com/blog/aliasing-module-paths-in-node-js) path aliases natively, the [module-alias](https://www.npmjs.com/package/module-alias) package modifies Node's `require()` to add support for path aliases. There are some [caveats](https://github.com/ilearnio/module-alias#using-within-another-npm-package) but Alias HQ supports it via a plugin.

Setup is simple; add the following line in your application's main file, before requiring any `@aliased` paths:

```js
require('alias-hq').get('module-alias')
```

## Webpack

If bundling using Webpack, you can [add the aliases](https://webpack.js.org/configuration/resolve/#resolvealias) using the `resolve.alias` configuration option:

```js
// build.js
import hq from 'alias-hq'

module.exports = {
  ...
  resolve: {
    alias: hq.get('webpack'),
  },
}
```

## Rollup

#### Basic setup

If bundling using Rollup you will need to use the [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias) plugin.

Install, then [add the aliases](https://github.com/rollup/plugins/tree/master/packages/alias#usage) using the `plugins.alias` configuration option:

```js
// rollup.config.js
import hq from 'alias-hq'
import alias from '@rollup/plugin-alias';

module.exports = {
  ...
  plugins: [
    alias({
      entries: hq.get('rollup')
    })
  ]
}
```

You can request paths in `object` (the default) or  `array` format:

```js
hq.get('rollup', { format: 'array' })
```

#### Bundling with TypeScript

If your bundle is to be consumed by other projects, you will need to set up additional plugins. This is because the TypeScript compiler (rather strangely) doesn't transform aliased paths in its generated type files.

The plugin [ts-transform-paths](https://www.npmjs.com/package/@zerollup/ts-transform-paths) will rewrite aliases in the compilation step, using the [rollup-plugin-typescript2](https://github.com/ezolenko/rollup-plugin-typescript2) plugin, which is arguably the most reliable TypeScript bundling plugin for Rollup.

Full instructions here:

- https://www.npmjs.com/package/@zerollup/ts-transform-paths#setup-for-rollup-plugin-typescript2

## Jest

If using Jest, you can [configure](https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring) the `moduleNameMapper` option:

```js
// jest.config.js
import hq from 'alias-hq'

module.exports = {
  ...
  moduleNameMapper: hq.get('jest'),
}
```

You can request paths in `string` (the default) or  `array` (Jest v25+) format:

```js
hq.get('rollup', { format: 'array' })
```

## Vue

If using Vue CLI, you can [add the aliases](https://cli.vuejs.org/guide/webpack.html#simple-configuration) using the `configureWebpack` or `chainWebpack` option.

Decide which one to use, then update as appropriate:

```js
// vue.config.js
import hq from 'alias-hq'

module.exports = {
  configureWebpack: (config) => {
    ...
    Object.assign(config.resolve.alias, hq.get('webpack'))
  },
}
```

## React

React takes a little more work than the other options, depending on how you are using it.

#### Create React App

Unfortunately, [Create React App](https://create-react-app.dev/) out-of-the-box does not allow path aliases, and will [physically rewrite](https://github.com/davestewart/alias-hq/issues/1#issuecomment-680005750) your config if you attempt to use them.

To work around this, at least two options are:

- **[eject](https://create-react-app.dev/docs/available-scripts/#npm-run-eject) the configuration** and manually add Alias HQ to `config/webpack.config.js` *(see above)*
- **use something like [React App Rewired](https://github.com/timarney/react-app-rewired)** to enable the webpack setup to be manually tweaked *(see below)*

#### React App Rewired

To prevent Create React App from rewriting your `tsconfig`:

1. Rename your `tsconfig.json` file as `tsconfig.base.json`
2. Create a new `tsconfig.json` file and save the following:

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {}
}
```

To set up React App Rewired:

1. Follow the [installation instructions](https://github.com/timarney/react-app-rewired#how-to-rewire-your-create-react-app-project) to install in your project
2. Set up the ``config-overrides.js`` file as follows:

```js
const hq = require('alias-hq')

module.exports = function override(config, env) {
  Object.assign(config.resolve.alias, hq.get('webpack'))
  return config;
}
```

This short React guide is *not meant to be exhaustive*; for issues, use your common sense, search Google, and see the appropriate package's issues.

## JSON-only

For libraries or setups that require JSON, you can use the [CLI](cli/cli.md):

- Run the CLI by typing `alias-hq` in the terminal
- Choose "Dump plugin output (JSON)"
- Choose the required format 
- Copy / paste the JSON where you need it


