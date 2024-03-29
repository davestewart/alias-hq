# Update source code

> Rewrite your project's source code with your configured aliases

![alias cli](../assets/cli-source.png)

One of Alias HQ's best features is **the ability to rewrite your source code** with your shiny new aliases.

There are five main options:

```
? What do you want to do?: (Use arrow keys)
  - Show config
  - Show options
  - Configure options
  - Preview updates
❯ - Update files - no further confirmation!
```

## Show config

The first menu option simply prints your current source folders and [paths](./paths.md) config:

```js
{
  "rootUrl": "/Volumes/Data/AliasHQ/demos/alias-hq-demo",
  "baseUrl": "src",
  "paths": {
    "@packages/*": [ "../packages/*" ],
    ...
  }
}
```

You should run this before continuing, just to have something to refer to as you set further options or update your source code.

## Show options

This menu option shows your currently configured options for updating source code.

It shows a brief confirmation of previous choices, as well as which extensions will be processed and what parser will be used:

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
- Vue's `.vue` files are automatically detected and included if they exist

You can set up permanent suggestions for these settings using the [Advanced configuration](#advanced-configuration) options.

## Configure options

This menu lets you make some simple choices about how to update your source code, and has two steps.

### Folders

This step asks you for the paths **relative to your project's *root***, that you would like to process.

As before, you can type, drag-and-drop or paste relative or absolute paths here:

```
? Folders: packages src

    ✔ packages  - /Volumes/Data/AliasHQ/demos/alias-hq-demo/packages
    ✔ src       - /Volumes/Data/AliasHQ/demos/alias-hq-demo/src
```

### Module Roots

#### Background

"Module roots" is Alias HQ's way of determining how to correctly write paths when you have "self-contained" units of code.

Say you have a `plugins` folder (itself aliased via `@plugins`) but the subfolders are independent units:

```
+- plugins
    +- fooify
    |   +- ...
    +- barify
    |   +- ...
    +- ...
```

If any file in the project requires `fooify` the path would be `@plugins/fooify`.

But if a sibling plugin needed to access `fooify` the path would be  `../fooify` –  a *relative* path, because both folders are children of the `@plugins` alias – suggesting they are somehow related.

But because we want to treat plugins as *independent* of each other, we mark `@plugins` as a "module root" which instructs Alias HQ to rewrite any interdependencies between the modules as `@plugins/<module>` :

```
// plugins/barify
import { fooify } from '@plugins/fooify'
import { settings } from './settings'
```

This setting affects **immediate children** of any alias – in this case `@plugins/*`. 

#### Choose module roots

The UI will show you your existing configured path aliases (from the [Configure paths](./paths.md) menu) as a checklist.

Pick which aliases should be configured as module roots, choose to save the options if you like, then continue.

If you choose to save, options will be saved to your `package.json` under the `"alias-hq"` node, for next time.

## Preview updates / update files

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

Paths should be clickable, so you can double-check changes. If not, see the [troubleshooting](cli.md#clickable-links) section.

## Undoing changes

The easiest way to undo changes is to revert files using source control.

However, there is a *secret* option available, but you will need to restart the CLI:

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

Choosing "Revert source code" will rewrite all **aliased** paths (assuming those aliases exist in your configuration file) to **relative** paths.

This can be useful if you want to create a new set of aliases and need paths in their un-aliased state.

## Advanced configuration

The question-based interface remembers your choices between steps, but projects are complex and shared between developers, so there are some extra settings that can be stored in `package.json` under the `"alias-hq"` node:

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

When new answers are given in the CLI, you will be prompted if you want to save.

