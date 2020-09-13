require('colors')
const Fs = require('fs')
const Path = require('path')
const runner = require('jscodeshift/src/Runner')
const hq = require('../../../src')
const { getAliases } = require('../../services/config')
const { TransformMode } = require('./paths')
const stats = require('./stats')

function getCsOptions () {
  // language
  const language = Path.basename(hq.settings.configFile).slice(0, 2)

  // parser
  const parser = Fs.existsSync('.flowconfig')
    ? 'flow'
    : language === 'ts'
      ? 'tsx'
      : undefined

  // extensions
  const defaultExtensions = language === 'ts'
    ? 'ts js tsx jsx'
    : 'js jsx'
  const extensions = (hq.settings.extensions || defaultExtensions)
    .match(/\w+/g)
    .join(', ')

  // TODO add options to
  // - ignore folders (node, vendor, etc)
  // - force conversion to aliases ?

  /**
   * @typedef {object} Options
   */
  return {
    dry: true,
    silent: true,
    verbose: 0,
    runInBand: true,
    ignorePattern: 'node_modules/*',
    extensions,
    parser,
  }
}

function rewriteSource (paths, options, dry = true) {
  // aliases
  const aliases = getAliases()

  // options
  const csOptions = {
    ...options,
    aliases,
    dry,
  }

  // debug
  // inspect({ paths, modules, extensions })
  // inspect({ options: csOptions, paths, aliases })

  // track updated
  stats.reset()

  // do it
  if (aliases.names.length) {
    console.log()
    const file = __dirname + '/transformer.js'
    return runner
      .run(file, paths, csOptions)
      .then(results => stats.present(results))
  }
}

module.exports = {
  getCsOptions,
  rewriteSource,
}
