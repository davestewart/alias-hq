# Alias HQ 

![tests](https://github.com/davestewart/alias-hq/workflows/tests/badge.svg)

> The end-to-end solution for managing path aliases

<p align="center">
  <img src="https://raw.githubusercontent.com/davestewart/alias-hq/master/docs/assets/logo.png" alt="Alias HQ logo">
</p>
## TL;DR

Using aliases in your projects makes your code easier to read and maintain.

You may want to use **Alias HQ** if:

- you **want** to use path aliases: *it will **generate** initial config and **rewrite** your imports* 
- you **already** use path aliases: *a **single configuration** & **one-liner usage** in Webpack, Jest, Rollup, etc*

## Abstract

Path "aliases" are `@identifiers` that simplify unwieldy and verbose file `imports`:

```js
// from this
import { service } from '../../../core/services/service' 

// to this
import { service } from '@services/service' 
```

They are widely supported in the JavaScript ecosystem, but:

- libraries have incompatible formats so require separate configurations  
- maintaining duplicate configurations is fiddly and error-prone 
- modifying source code is laborious and long-winded

Alias HQ solves these problems by:

- using your project's `js/tsconfig`'s `paths` as the [single source of truth](./docs/setup.md)
- providing a user-friendly [CLI](docs/cli.md) to generate `config` *and* modify `src/*` code
- providing a one-liner [API](docs//api.md) for [Webpack](docs/integrations.md#webpack), [Jest](docs/integrations.md#jest), [Rollup](docs/integrations.md#rollup) and [more](docs/plugins.md)

## Getting started

![cli](docs/assets/cli-02.png)

You can configure and convert any sized project *from scratch* in **under 30 seconds** by installing the package, running the CLI, and answering the prompts.

For more detailed instructions, see:

- [Setup](docs/setup.md)
- [CLI](docs/cli.md)

- [Integrations](docs/integrations.md)

For information about the API, see:

- [API](docs/api.md)
- [Plugins](docs/plugins.md)


