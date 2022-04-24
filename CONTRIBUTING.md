# Contributing guide

## Intro

If you are considering contributing, thanks!

The steps below outline the formats expected to be consistent with the existing commits.

## Process

Before writing any code:

- raise an issue
- discuss the problem

Once it's been agreed what should be done:

- fork the `main` branch
- work on your code

To submit your code:

- make a pull request
- make sure the PR title is in the present tense, ie "Add thing"
- in the description, either:
  - tag the issue
  - use the `Closes #xxx` form to automatically close the issue
- if the code is complex, explain what you've done and why

## Additional requirements

For all changes:

- update the package.json version using [semantic versioning](https://www.baeldung.com/cs/semantic-versioning) (minor: feature, patch: fix)
- update the [changelog](https://github.com/davestewart/alias-hq/blob/master/CHANGELOG.md), including:
  - `[version] - date` in `yyyy-mm-dd`
  - `type` of change(s) - as many are needed
  - `description` of change(s) - one per line
  - `(#nn)` PR id in brackets
  - `- fixes/closes #nn` issue(s) id after

If you are submitting a new plugin:

- read the [plugins](https://github.com/davestewart/alias-hq/blob/master/docs/api/plugins.md) document
- make sure to include tests as outlined in the above document
- update the [integrations](https://github.com/davestewart/alias-hq/blob/master/docs/integrations.md) document with a brief description
