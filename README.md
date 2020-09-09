# Alias HQ 

![tests](https://github.com/davestewart/alias-hq/workflows/tests/badge.svg)

> The end-to-end solution for configuring, refactoring, maintaining and using path aliases

<p align="center">
  <img src="https://raw.githubusercontent.com/davestewart/alias-hq/master/docs/assets/logo.png" alt="Alias HQ logo">
</p>

## Abstract

Path "aliases" are `@identifiers` that simplify unwieldy or lengthy file `imports`.

Using them in your projects makes your code easier to read and maintain:

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

## TL;DR

If you are *thinking about* using aliases:

- The Alias CLI **migrates** your project by [configuring your paths](docs/cli/paths.md) and [rewriting your imports](docs/cli/source.md) 

If you are *already* using aliases:

- The Alias API **simplifies** your tooling with a single [config file](docs/cli/paths.md) and [one-liner integrations](docs/integrations.md)

You can **configure and migrate any project** in less than a minute by:

- installing the package
- running the CLI
- following the prompts

## Overview

Alias HQ is configured using your project's `ts/jsconfig.json`:

```js
{
  "baseUrl": "src",
  "paths": {
    "@packages/*": [ "../packages/*" ],
    "@/*": [ "/*" ],
    "@app/*": [ "/app/*" ],
    "@services/*": [ "/app/services/*" ],
    ...
  }
}
```

The API makes sure your IDE, framework and toolchain are always in sync:

```js
const aliases = hq.get('webpack') // choose any plugin; jest, rollup, etc
```

The CLI makes sure your code is always up-to-date:

```
? What do you want to do?
  - Configure paths
  - Setup integrations
❯ - Update source code
  - Help
  - Exit
```

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


