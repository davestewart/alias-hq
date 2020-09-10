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

### Running the CLI

If typing `alias-hq` does not run the CLI, you'll need to add `node_modules/.bin` to your system path.

#### Mac

Add the following line to `~/.bash_profile` or equivalent (note: `~/.zshrc` on the latest OSX!):

```bash
export PATH=./node_modules/.bin:$PATH
```

#### Windows

Follow the Instructions [here](https://www.computerhope.com/issues/ch000549.htm).

#### Last resort

If you are unable to modify your system path, just call the CLI directly:

```bash
./node_modules/.bin/alias-hq
```

### Clickable links

The following plugin enables clickable links in WebStorm (useful when [updating source code](./source.md)):

- https://plugins.jetbrains.com/plugin/7677-awesome-console/

VS Code displays them by default.
