# Quick start

> Configure your project to use path aliases in your toolchain

## Run the CLI

From version 4.1, all configuration can be completed via the [Alias CLI](cli/cli.md):

![alias cli](./assets/cli-preview.png)

In the terminal:

- From your project root, type and run `alias-hq`

*If this doesn't work, see the [troublshooting](cli/cli.md#troubleshooting) section in the CLI docs.*

## Configuration

> *For more detailed steps, see the full [Configure paths](./cli/paths.md) document.*

### Create a new config file

If you don't yet have a config file, from the main menu:

- Choose "Configure paths > Create config"
- Choose "JavaScript" or "TypeScript" as required
- Choose to save the file

### Configure paths

To add or update paths in your config file, from the main menu: 

- Choose "Configure paths > Update config"
- Choose your "Base URL"
- Choose "Folders" by typing relative paths, or dragging in folders from Finder / Explorer
- Choose an "Alias prefix"
- Choose to save the config

## Setup integrations

> *For more detailed steps, see the [Setup integrations](./cli/integrations.md) document.*

To set up existing integrations like Webpack and Jest, from the main menu:

- Choose "Setup integrations > Setup integration"
- Choose an integration from the list of integrations
- Follow the instructions

## Update source code

> *For more detailed steps, see the [Update source code](./cli/source.md) document.*

To update source code with your new aliases, from the main menu:

- Choose "Update source code"
- Choose "Configure options"
- Type the relative paths of the folders you want to update
- Choose any [module roots](./cli/source.md#module-roots) from the list 
- Choose to "Preview updates" or "Update files"



