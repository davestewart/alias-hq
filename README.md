# Alias HQ 

![tests][tests]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

> The end-to-end solution for configuring, refactoring, maintaining and using path aliases

<p align="center">
  <img src="https://raw.githubusercontent.com/davestewart/alias-hq/master/docs/assets/logo.png" alt="Alias HQ logo">
</p>

## Abstract

Path "aliases" are special identifiers (starting with `@` or `~` ) that point to specific folders.

Using them in your codebase makes your imports easier to read and maintain:

```js
// from this
import { fooify } from '../../../core/services/foo' 

// to this
import { fooify } from '@services/foo' 
```

They are widely supported in the JavaScript ecosystem, *however*:

- libraries have incompatible formats so require separate configurations  
- maintaining duplicate configurations is fiddly and error-prone 
- migrating source code is laborious and long-winded

## Overview

Alias HQ is build-time tool which:

- uses `ts/jsconfig.json` as the single source of configuration 
- provides one-liner integrations to popular bundlers, frameworks and libraries
- has a CLI for quick configuration, and even source code migration

Begin by [configuring](./docs/cli/paths.md) aliases in your project's `ts/jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@packages/*": [ "../packages/*" ],
      "@/*": [ "/*" ],
      "@app/*": [ "/app/*" ],
      "@services/*": [ "/app/services/*" ]
    }
  }
}
```

Use the [API](./docs/api/api.md) to sync your toolchain, frameworks, even your IDE:

```js
// webpack.config.js
config.resolve.alias = hq.get('webpack')

// jest.config.js
config.moduleNameMapper = hq.get('jest')

// etc...
```
Use the [CLI](./docs/cli/cli.md) to migrate or maintain your source code:

```
? What do you want to do?
  - Configure paths
  - Setup integrations
❯ - Update source code
  - Help
  - Exit
```

For a list of all supported frameworks, see the [integrations](docs/integrations.md) doc.

## Benefits

If you are *already* using aliases:

- The Alias API **simplifies** your tooling with a single [config file](docs/cli/paths.md) and [one-liner integrations](docs/integrations.md)

If you are *thinking about* using aliases:

- The Alias CLI **migrates** your project by [configuring your paths](docs/cli/paths.md) and [rewriting your imports](docs/cli/source.md) 

You can **configure and migrate any project** in less than a minute by:

- installing the package
- running the CLI
- following the prompts

## Getting started

Install via your package manager of choice:

```bash
npm i --save-dev alias-hq
```

```bash
yarn add -D alias-hq
```

To jump in without much reading:

- [Quick start](docs/quick-start.md)

For step-by-step instructions:

- [Documentation](docs/README.md)

For a short video:

- [Click here](https://twitter.com/i/status/1298592287266611205)

Wanna support the project?

- Tweet or [retweet](https://twitter.com/dave_stewart/status/1297906829868109825) about it :)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/alias-hq/latest.svg?style=flat&colorA=18181B&colorB=2EBCDC
[npm-version-href]: https://npmjs.com/package/alias-hq

[npm-downloads-src]: https://img.shields.io/npm/dm/alias-hq.svg?style=flat&colorA=18181B&colorB=6F6A92
[npm-downloads-href]: https://npmjs.com/package/alias-hq

[license-src]: https://img.shields.io/npm/l/alias-hq.svg?style=flat&colorA=18181B&colorB=B41C64
[license-href]: https://npmjs.com/package/alias-hq

[tests]: https://github.com/davestewart/alias-hq/workflows/tests/badge.svg
