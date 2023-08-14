# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [6.2.2] - 2023-08-14

Fixed:

- Fixed jest plugin omitting `<rootDir>` for aliases involving parent directories (#57) - closes #45

## [6.2.1] - 2023-04-25

Changed:

- Updated packages - closes #52

## [6.2.0] - 2023-04-25

Changed:

- Replace TypeScript dependency with JSON5 (#65) - closes #41

## [6.1.0] - 2022-12-06

Added:

- Add Babel support (#60) - closes #56

## [6.0.0] - 2022-12-06

Changed:

- Improve plugin utils callback signature (#59) - closes #58

## [5.4.0] - 2022-04-22

Added:

- Added support to initialize Alias HQ with a Node require flag (#48) - closes #46

## [5.3.0] - 2021-11-25

Added:

- Added support for tsconfig extends (#37) - closes #28, #30

## [5.2.0] - 2021-10-30

Added:

- Added initial TypeScript type definitions (#33) - closes #29

## [5.1.7] - 2021-10-30

Fixed:

- Fixed empty defaults for Rollup plugin generating incorrect array config

## [5.1.6] - 2020-09-20

Modified plugin formats:

- Jest now has string and array format options
- Jest now outputs strings by default
- Rollup now outputs objects by default
- Fixed test:plugins script

## [5.1.5] - 2020-09-20

Fixed:

- Fixed issue where CLI does not recognise existing config.json without existing paths node


## [5.1.4] - 2020-09-11

Fixed:

- Fixed CLI link to docs

## [v5.1.3] - 2020-09-09

Fixed:

- Minor fix to transformer quote detection

## [v5.1.2] - 2020-09-09

Fixed:

- Major bug fix where config.json was being overwritten, not updated
- Minor bug where changed settings would load as undefined

## [v5.1.1] - 2020-09-09

Added:

- Helpful error message if config or settings cannot be loaded

## [5.1.0] - 2020-09-09

Added:

- Node support via module-alias package

## [v5.0.0] - 2020-09-09

Changed:

- Simplified CLI menus
- Optimised stats output
- Minor change to prefer shorter local paths to aliased paths

Breaking changes:

- Plugin `toArray` / `toObject` `{ name, path }` format

Fixed:

- Major bug with config loading
- Bug with transforms not being properly updated for imports

## [v4.1.4] - 2020-09-09

Fixed (backfixes):

- Major bug fix where config.json was being overwritten, not updated
- Minor fix to transformer quote detection

## [v4.1.0] - 2020-09-09

Added:

- Improved path formatting for added paths

## [v4.0.0] - 2020-08-29

Changed:

- Refactored passing of plugin parameters to separate config and user options
- Refactored plugin helper functions to do the same, plus de-duplicate paths

## [v3.1.4] - 2020-08-29

Added:

- CLI support for "make paths json" to generate file aliases

## [v3.3.0] - 2020-08-28

Changed:

- Refactored plugin architecture to provide both tests and options
- CLI now provides output for all available plugin options
- Simplified utils structure

## [v3.2.0] - 2020-08-28

Added:

- Support for directly accessing CLI as .bin

## [v3.1.3] - 2020-08-26

Added:

- Tests for CLI paths

Fixed:

- Fix CLI "make paths json" incorrectly converting relative paths

## [v3.1.2] - 2020-08-26

Fixed:

- Fix CLI "make paths json" not recognising paths with spaces

## [v3.1.1] - 2020-08-26

Fixed:

- Fix broken Rollup plugin

## [v3.1.0] - 2020-08-26

Added:

- CLI tool to generate paths config

## [v3.0.2] - 2020-08-26

Changed:

- Changed `hq.log()` to `hq.json()`

## [v3.0.1] - 2020-08-26

Changed:

- Change Rollup format default to array
- Change CLI tool from listing plugin names to showing plugin output

Fixed:

- Fix issue with wrong root folder being found

## [v3.0.0] - 2020-08-26

Added:

- Explicit support for Create React App with tsconfig.base.json fallback
- Interactive CLI tool
- Rollup format options

Removed:

- Ability to load raw object data (update hq.config directly if needed)
- Ability to load simplified config version

## [v2.1.0] - 2020-08-24

Added:

- Support for multiple paths per alias

## [v2.0.1] - 2020-08-24

Added:

- Support for baseUrl

## [v1.0.0] - 2020-08-24

Initial release
