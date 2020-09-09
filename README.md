# Alias HQ 

![tests](https://github.com/davestewart/alias-hq/workflows/tests/badge.svg)

> The end-to-end solution for configuring, refactoring, maintaining and using path aliases

<p align="center">
  <img src="https://raw.githubusercontent.com/davestewart/alias-hq/master/docs/assets/logo.png" alt="Alias HQ logo">
</p>

## TL;DR

**Using path aliases in your projects makes your code easier to read and maintain.**

If you are *considering* using aliases:

- The Alias CLI **migrates** your project by [configuring your paths](docs/cli/paths.md) and [rewriting your imports](docs/cli/source.md) 

If you are *already* using aliases:

- The Alias API **simplifies** your tooling with a single [config file](docs/cli/paths.md) and [one-liner integrations](docs/integrations.md)

With Alias HQ, aliases are as easy as:

```js
const aliases = hq.get('webpack') // or any supported library
```

## Abstract

Path "aliases" are `@identifiers` that simplify unwieldy or lengthy file `imports`:

```js
// from this
import { fooify } from '../../../core/services/foo' 

// to this
import { fooify } from '@services/foo' 
```

They are widely supported in the JavaScript ecosystem, but:

- libraries have incompatible formats so require separate configurations  
- maintaining duplicate configurations is fiddly and error-prone 
- migrating source code is laborious and long-winded

Alias HQ solves these problems by:

- using your project's `js/tsconfig`'s `paths` as the [single source of truth](docs/cli/paths.md)
- providing a user-friendly [CLI](docs/cli/cli.md) to generate `config` *and* refactor `src/*` code
- providing a one-liner [API](docs/api/api.md) for [Webpack](docs/integrations.md#webpack), [Jest](docs/integrations.md#jest), [Rollup](docs/integrations.md#rollup) and [more](docs/api/plugins.md)

## Getting started

You can configure and refactor any sized project in **less than a minute** by installing the package, running the CLI, and answering some prompts:

![cli](docs/assets/cli-preview.png)

Install via your package manager of choice:

```bash
npm i --save-dev alias-hq
```

```bash
yarn add -D alias-hq
```

To jump in without much reading, see:

- [Quick start](docs/quick-start.md)

For step-by-step instructions, see the docs index:

- [Documentation](docs/README.md)

To see a short video:

- [Click here](https://twitter.com/i/status/1298592287266611205)

