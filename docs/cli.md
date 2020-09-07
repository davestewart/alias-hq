# CLI

> Command line tool to generate configuration, rewrite source code, and debug plugins

![alias cli](./assets/cli.png)

## Overview

The Alias HQ CLI is designed to make the configuration and refactoring your project as simple as picking some options, and hitting enter.

In the terminal, run the following code:

```bash
alias-hq
```

You will see (depending on the configured state of your project):

```
  == Alias HQ ==

  -- Main Menu --

? What do you want to do?
❯ - Setup         - update config and source code
  - Integrations  - configure and debug library integrations
  - Help          - read the docs
  - Exit
```

Choose from the available options:

- [Setup](#setup) - update config and source code
- [Integrations](#integrations) - configure and debug library integrations

*If the CLI does not run at all, see the [troubleshooting](#troubleshooting) section.*

## Setup

The Setup menu allows you to: 

- [Create config](#create-config) - create a new `ts/jsconfig` file from scratch
- [Update config](#update-config) - update your config file with new paths
- [Update source code](#update-source-code) - update your source code with new aliases

*Note that on first run, Alias HQ may only reveal menu options as you complete sections.*

### Create config

If you do not already have a `ts/jsconfig.json` file, Alias HQ can create one for you.

Follow the prompts and you will end up with a basic file like this:

```json
{
  "compilerOptions": {
    "baseUrl": "",
    "paths": {}
  }
}
```

### Update config

The next menu option allows you to configure your project's path aliases.

It has three steps: **Base Url**, **Paths** and **Alias Prefix**.

#### Base URL

The `baseUrl` is folder from which all `paths` will start from, and is generally either:

-  your `src/` folder (pre-filled if this folder exists)
- your root folder (just enter `.` )

#### Paths

Your `paths` config is the physical map of alias names to file system folders.

You have various ways to enter them in:

- type relative paths, relative to your `baseUrl` folder
- drag-and-drop folders from your Finder / Explorer
- copy/paste relative or absolute paths. Note that:
    - the paste limit is often 1024 characters
    - line breaks do not seem to be supported (separate paths with spaces)

Alias HQ will process your input then show you a preview of valid paths (those that exist, and are below the project root):

```
? Folders [ drag here / type paths ]: ../packages app foo

    ✔ packages      - /Volumes/Data/AliasHQ/demos/alias-hq-demo/packages
    ✔ app           - /Volumes/Data/AliasHQ/demos/alias-hq-demo/src/app
    ✘ foo           - /Volumes/Data/AliasHQ/demos/alias-hq-demo/src/foo
```

You cannot continue with invalid paths; they will be removed and you will have to repeat the step.

#### Alias prefix

Finally, you will want to *prefix* your aliases.

The convention is `@` and is the default suggestion.

#### Preview config

Once you complete these steps, Alias HQ will show you a preview of the new configuration and give you the option to save it:

```js
{
  "rootUrl": "/Volumes/Data/AliasHQ/demos/alias-hq-demo",
  "baseUrl": "src",
  "paths": {
    "@packages/*": [ "../packages/*" ],
    "@/*": [ "/*" ],
    "@app/*": [ "app/*" ],
    "@data/*": [ "app/data/*" ],
    ...
  }
}
```

### Update source code

Alias HQ's killer feature is the ability to rewrite your existing source code with your shiny new aliases.

There are two configuration steps:

- **Folders** and **Module roots**

Followed by options to

- **Change settings**, **Preview updates** or **Update files**

#### Folders

This step asks you for the paths **relative to your *project's root***, that you would like to process.

As before, you can type, drag-and-drop or paste relative or absolute paths here:

```
? Folders: packages src

    ✔ packages  - /Volumes/Data/AliasHQ/demos/alias-hq-demo/packages
    ✔ src       - /Volumes/Data/AliasHQ/demos/alias-hq-demo/src
```

#### Module Roots

"Module roots" is Alias HQ's way of determining how to correctly write paths when you have "self-contained" units of code.

Say you have a `plugins` folder (itself aliased via `@plugins`) but the subfolders are independent units:

```
+- plugins
    +- plugin-one
    +- plugin-two
    +- ...
```

If any file in the project requires `plugin-one` the path would be `@plugins/plugin-one`.

But if a sibling plugin needed to access `plugin-one` the path would be  `../plugin-one` –  a *relative* path, because both folders are children of the `@plugins` alias – suggesting they are somehow related.

But because we want to treat plugins as *independent* of each other, we mark `@plugins` as a "module root" which instructs Alias HQ to rewrite any interdependencies as `@plugins/plugin-one` .

This setting affects **immediate children** of any alias – in this case `@plugins/*`. 

Choose your module roots from your configured aliases, save the options (to your `package.json`) if you like, and continue.

#### Confirmation

The final step will show a brief confirmation of your choices, as well as which extensions will be processed and what parser will be used:

```
  Paths:
    ✔ packages    - /Volumes/Data/AliasHQ/demos/alias-hq-demo/packages
    ✔ src         - /Volumes/Data/AliasHQ/demos/alias-hq-demo/src
  Module roots:
    › @packages   - packages
  Options:
    › extensions  - js, jsx, vue
    › parser      - default
```

Note that:

- JavaScript / TypeScript is detected based on your `ts/jsconfig.json` file

- Vue's `.vue` files are handled if they exist

#### Preview updates / update files

The final menu shows five options:

```
? Next step:
  - Show config
  - Change settings
❯ - Preview updates
  - Update files - no further confirmation!
  - Back
```

The Preview and Update options are identical, apart from one updates your files and one doesn't:

```
/Volumes/Data/AliasHQ/demos/alias-hq-demo/src/main.js

  › ./app/views/user
  › @views/user

/Volumes/Data/AliasHQ/demos/alias-hq-demo/packages/services/foo.js

  › ./settings

  › ../fetch
  › @packages/fetch

/Volumes/Data/AliasHQ/demos/alias-hq-demo/src/classes/User.js

  › ../../packages/fetch
  › @packages/fetch
```

If you choose to update – **make sure you have committed the files** – because they will be overwritten.

### Undoing changes

The easiest way to undo changes is to revert files using Git.

However, there is also one *secret* option available, but you will need to restart the CLI:

```
alias-hq revert
```

This will show the following Setup menu:

```
? What do you want to do?
  - View config
  - Update config
  - Update source code (to aliased paths)
❯ - Revert source code (to relative paths)
  - Back
```

Choosing "Revert source code" will rewrite all aliased paths (assuming those aliases exist in your configuration file) to relative paths.

This can be useful if you want to create a new set of aliases and need paths in their un-aliased state.

## Advanced configuration

The question-based interface remembers your choices between steps, but projects are complex and shared between users, so there are some extra settings that can be stored in `package.json` under the `"alias-hq"` node:

 ```js
"alias-hq": {
  "root": "demo",           // an optional folder to look for `ts/jsconfig.json`
  "prefix": "@",            // an alias prefix to always suggest
  "extensions": "js vue",   // any extensions to always process
  "folders": [              // any folders to always suggest to rewrite
    "packages",
    "src"
  ],
  "modules": [              // any aliases to always suggest to mark as module roots
    "@packages"
  ]
}
 ```

## Integrations

The Integrations menu allows you to:

- [Configure integration](#configure-integration) - instructions on how to configure Webpack, Jest, etc
- [Debug integration](#debug-integration) - view the output of integrations to debug or use as JSON 

### Configure integrations

This menu shows you the documented list of integrations:

```
? What do you want to do? Configure integration
? Integration:
❯ - VS Code
  - WebStorm
  - Webpack
  - Rollup
  - Jest
  - Vue
  - React
  - JSON-only
```

They simply [link](./integrations.md) to this documentation and provide specifics of setting up each IDE / framework / lib.

### Debug integration

This menu lets you choose from the available plugins (Webpack, Rollup, Jest) and any available format options, then prints the results:

```
? What do you want to do? Debug integration
? Which integration? Jest

    {
      "^@packages/(.*)$": "<rootDir>/packages/$1",
      "^@/(.*)$": "<rootDir>/src/$1",
      "^@app/(.*)$": "<rootDir>/src/app/$1",
      "^@data/(.*)$": "<rootDir>/src/app/data/$1",
      ...
    }
```

You can copy and paste this if you find the [API](./api.md) is not giving you the results you need.

## Troubleshooting

If you can't get the CLI to run, ensure that local `node_modules` executables are in your `~/.bash_profile` or equivalent: 

```bash
export PATH=./node_modules/.bin:$PATH
```

If you still can't get the path setup working, you can just call the CLI directly:

```bash
node ./node_modules/alias-hq/cli
```

