# Alias HQ 

![tests](https://github.com/davestewart/alias-hq/workflows/tests/badge.svg)

> Manage a single set of folder aliases and convert on-the-fly to other formats

<p align="center">
  <img src="https://raw.githubusercontent.com/davestewart/alias-hq/master/docs/assets/logo.png" alt="Alias HQ logo">
</p>

## Abstract

Alias HQ makes the management, creation and use of path aliases easy.

```js
import { SomeService } from '@services'
```

It [uses](./docs/setup.md) your `js/tsconfig.json` as the single source of truth:

```text
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@services/*": ["app/services/*"],
      ...
    }
  }
}
```

And provides a simple [API](docs/api.md) to use in the rest of your toolchain:

```js
// webpack.config.js
import hq from 'alias-hq'

module.exports = {
  resolve: {
    alias: hq.get('webpack') // or jest, rollup, or your own transform...
  }
}
```

No more wrangling multiple incompatible configuration files:

```js
// webpack, eslint, etc
'@services': '/volumes/projects/path/to/project/src/app/services'
```
```js
// jest
'^@services/(.*)$': '<rootDir>/src/app/services/$1'
```
```js
// rollup
{
  find: '@services',
  replacement: '/volumes/projects/path/to/project/src/app/services'
}
```

Alias configuration is just a simple import and one-liner conversion.

## Integrations and tooling

[Webpack](docs/integrations.md#webpack), [Jest](docs/integrations.md#jest) and [Rollup](docs/integrations.md#rollup) are supported out of the box, with new functionality available as [plugins](docs/plugins.md).

Aliases are supported by [VSCode](docs/integrations.md#vs-code) and [Webstorm](docs/integrations.md#webstorm) so auto-completion should just work.

Finally, an accompanying [CLI](docs/cli.md) makes it super simple to create, inspect, debug and convert paths:

![cli](docs/assets/cli.png)

See [here](https://twitter.com/i/status/1298592287266611205) for video :)

## Get started

To start using aliases in your own project:

- [Setup](docs/setup.md)
- [Integrations](docs/integrations.md)

For more information about what the package can do:

- [API](docs/api.md)
- [CLI](docs/cli.md)

If you've an additional format you'd like to contribute:

- [Plugins](docs/plugins.md)



