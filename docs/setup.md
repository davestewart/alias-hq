# Setup

> Configure your project to use aliases in your application code and toolchain

## Installation

Install via your package manager of choice:

```bash
npm i --save-dev alias-hq
```
```bash
yarn add -D alias-hq
```

## Configuration

> Alias HQ piggybacks `tsconfig.json` and `jsconfig.js` which are Microsoft-designed configuration files, that can be used in your project **whether or not** you are running VS Code or TypeScript. 

Locate (or create) your `tsconfig.json` or `jsconfig.js` in your project's root folder, and configure using the example below as a guide:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@api/*": ["api/*"],
      "@app/*": ["app/*"],
      "@config/*": ["app/config/*"],
      "@services/*": ["app/services/*"],
      "@utils/*": ["common/utils/*"]
    }
  }
}
```

The configuration requires:

- The `baseUrl` to provide a relative entry point such as  `"."` or `"src"`
- The `paths` to be specified using Microsoft's [somewhat verbose](https://code.visualstudio.com/docs/languages/jsconfig#_using-webpack-aliases) wildcard and array format

Note that:

- All `paths` should resolve from the `baseUrl`, so something like this is fine: `../node_modules/`
- To resolve folder content, wildcards are required in both `alias` and `path` components
- The format supports [multiple paths](./tsconfig.json), though currently Jest is the only conversion format to utilise this
- You may add non-TypeScript paths (such as assets) here; TypeScript will ignore them but Alias HQ will use them
- You don't *have* to use a `@` character, but the convention is to use one

## Auto-generation

New in 3.1, you can automatically generate the config using the [Alias CLI](#cli):

![alias cli](./assets/cli.png)

In the terminal:

- From your project root, type and run `alias-hq`
- Choose "Make paths JSON"
- Choose the prompts that suit you
- Drag in folders from Finder / Explorer (or manually type relative paths, separating with spaces)
- Copy the resulting JSON to the config file

See the [CLI](#cli) section for more info / troubleshooting.
