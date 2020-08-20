# Alias HQ 

> Manage a single set of folder aliases and convert as-needed to other formats

## Abstract

#### Background

In any non-trivial JavaScript project, developers use path "aliases" to make for more intuitive imports:

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

- the various tools in the JavaScript ecosystem (e.g. TypeScript, WebStorm, WebPack, Jest) all use **different formats** 
- which results in the developer needing to duplicate, rewrite and maintain aliases for as many tools as they use in their toolchain

#### Solution

This library attempts to solve that by:

- adopting TypeScript's [path configuration](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) format
- using `tsconfig.json` or a custom configuration file as the "single source of truth"
- providing simple functions to map to other formats such as [Webpack](https://webpack.js.org/) and [Jest](https://jestjs.io/)

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

You should use the same general TypeScript [format](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) but you can **just add paths as strings**.

## Usage

Basic usage should be as simple as an import and calling a single function:

```js
// import library
import aliases from 'alias-hq'

// grab converted aliases
console.log(aliases.toWebpack())
console.log(aliases.toJest())
```

The helpers will load and convert the configuration, which will look something like the following:

```js
// webpack
{
  '@api': '/Volumes/Projects/Path/To/Project/api',
  '@app': '/Volumes/Projects/Path/To/Project/app',
  '@config': '/Volumes/Projects/Path/To/Project/app/config',
  '@shared': '/Volumes/Projects/Path/To/Project/app/shared',
  '@helpers': '/Volumes/Projects/Path/To/Project/common/helpers'
}
```
```js
// jest
{
  '^@api/(.*)$': '<rootDir>/api/$1',
  '^@app/(.*)$': '<rootDir>/app/$1',
  '^@config/(.*)$': '<rootDir>/app/config/$1',
  '^@shared/(.*)$': '<rootDir>/app/shared/$1',
  '^@helpers/(.*)$': '<rootDir>/common/helpers/$1'
}
```

## API

The library will automatically find either `tsconfig.json` or `aliases.config.json` in your project root, so should "just work":

```js
aliases.toWebpack()
```
However, you can also pass a relative or absolute path to the helper:
```js
aliases.toWebpack(__dirname + 'some-file.json')
```
Finally, you can pass in a config directly (note that for Webpack only you will need to pass in the path to the root folder): 
```js
aliases.toWebpack(require('./tsconfig.json'), { root: __dirname })
```

The library will attempt to grab paths from `compilerOptions` or if it can't find that, will use values in the root node.

## Integrations

To get you up and running, here are some example setups:

### WebStorm

The following configuration can be [used to tell](https://www.jetbrains.com/help/webstorm/using-webpack.html#webpack_module_resolution) WebStorm about your Webpack setup.

Add this file to your project root, and choose it in *Preferences > Languages and Frameworks > JavaScript > Webpack*:

```js
// webpack.config.js
import aliases from 'alias-hq'

module.exports = {
  resolve: {
    alias: aliases.toWebpack()
  }
}
```

### Webpack

If running a vanilla Webpack build, you can [add the aliases](https://webpack.js.org/configuration/resolve/#resolvealias) using the `resolve.alias` configuration option:

```js
// build.js
import aliases from 'alias-hq'

module.exports = {
  ...
  resolve: {
    alias: aliases.toWebpack(),
  },
}
```
### Vue CLI

If using Vue CLI, you can [tweak the webpack config](https://cli.vuejs.org/guide/webpack.html#simple-configuration) via the `configureWebpack` option:

```js
// vue.config.js
import aliases from 'alias-hq'

module.exports = {
  configureWebpack: (config) => {
    ...
    config.resolve.alias = aliases.toWebpack()
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
  moduleNameMapper: aliases.toJest(), // note, this uses .toJest!
}
```

