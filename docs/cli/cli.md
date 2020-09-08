# Alias HQ CLI

> Command line tool to generate configuration, rewrite source code, and debug plugins

![alias cli](../assets/cli-preview.png)

## Overview

The Alias HQ CLI is designed to make the configuration and refactoring your project as simple as picking some options, and hitting enter.

In the terminal, run the following code:

```bash
alias-hq
```

Choose from the available options:

- [Configure paths](./paths.md) - create or configure your project's path aliases
- [Setup integrations](./integrations.md) - configure and debug integrations for Webpack, Jest, etc
- [Update source code](./source.md) - refactor source code with your configured aliases

## Troubleshooting

If you can't get the CLI to run, ensure that local `node_modules` executables are in your `~/.bash_profile` or equivalent: 

```bash
export PATH=./node_modules/.bin:$PATH
```

If you still can't get the path setup working, you can just call the CLI directly:

```bash
./node_modules/.bin/alias-hq
```


