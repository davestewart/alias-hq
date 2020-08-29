# CLI

> Command line tool to check configuration and run various tasks

![alias cli](./assets/cli.png)

## Overview

The CLI provides a prompt-driven interface to run various development tasks:

```
  == Alias HQ ==
? What do you want to do? (Use arrow keys)
❯ - Show loaded config
  - List plugins output (JS)
  - Dump plugin output (JSON)
  - Make paths JSON
```

For example, view current config, as loaded by Alias HQ:

```js
{
  rootUrl: '/volumes/projects/path/to/project/',
  baseUrl: 'src',
  paths: {
    '@api/*': [ 'api/*' ],
    '@app/*': [ 'app/*' ],
    '@config/*': [ 'app/config/*' ],
    '@services/*': [ 'app/services/*' ],
    '@utils/*': [ 'common/utils/*', 'vendor/utils/*' ]
  }
}
```

## Running

In the terminal, from your project root, type:

```bash
alias-hq
```

If this doesn't work, ensure that local `node_modules` executables are in your `~/.bash_profile` or equivalent: 

```bash
export PATH=./node_modules/.bin:$PATH
```

If you can't get the path setup working, you can just call the CLI directly:

```bash
node ./node_modules/alias-hq/cli
```

