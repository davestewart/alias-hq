const Path = require('path')
const hq = require('../../src')
const { loadJson, saveJson } = require('../utils/file')
const { indent, makeJson } = require('../utils/text')

/**
 * Log the current config to the terminal
 */
function showConfig () {
  hq.load()
  console.log()
  console.log(indent(makeJson(hq.config)))
}

/**
 * Returns all plugins as a 2D hash of plugins and their options
 *
 * In this format:
 *   {
 *     jest: {},
 *     rollup: {
 *       object: { format: 'object' },
 *       array: { format: 'array' }
 *     },
 *     webpack: {}
 *   }
 * @returns {{{object}}}
 */
function getPlugins () {
  const names = hq.plugins.names
  return names.reduce(function (plugins, name) {
    const tests = require(`../../src/plugins/${name}/tests.js`)
    plugins[name] = tests.reduce(function (formats, test) {
      if (typeof test === 'function') {
        const { label = 'default', options } = test()
        formats[label] = options
        if (options) {
          // do nothing for now...
        }
      }
      return formats
    }, {})
    return plugins
  }, {})
}

/**
 *
 * @returns {Aliases}
 */
function getAliases () {
  const rootUrl = hq.config.rootUrl
  const aliases = hq.get('webpack')
  const names = Object.keys(aliases)

  // lookup
  const lookup = names
    .map(name => {
      const absPath = String(aliases[name])
      const relPath = Path.relative(rootUrl, absPath)

      /**
       * @typedef   {object}  Alias
       * @property  {string}  name      The name of the alias, i.e @data
       * @property  {string}  absPath   The absolute path of the alias, i.e. /projects/project/src/services/data
       * @property  {string}  relPath   The relative path of the alias, i.e. src/services/data
       */
      return {
        name,
        absPath,
        relPath,
      }
    })
    .sort(function (a, b) {
      if (a.relPath === b.relPath) {
        return 0
      }
      return a.relPath > b.relPath ? -1 : 1
    })

  /**
   * @typedef   {object}    Aliases
   * @property  {string[]}  names
   * @property  {Alias[]}   lookup
   * @property  {(function(string): Alias)}   forName   Returns the alias for the exact alias @name
   * @property  {(function(string): Alias)}   fromName  Returns the first alias matching the partial @aliased path
   * @property  {(function(string): Alias)}   forPath   Returns the first alias matching the partial /absolute path
   */
  return {
    names,
    lookup,
    forName: name => lookup.find(item => name === item.name),
    fromName (path) {
      const reversed = names.sort().reverse()
      const name = reversed.find(name => path.startsWith(name))
      return this.forName(name)
    },
    forPath: absPath => lookup.find(item => absPath.startsWith(item.absPath)),
  }
}

function numAliases (load = false) {
  if (load) {
    hq.load()
  }
  return Object.keys(hq.config.paths).length
}

function saveSettings (newSettings) {
  const data = loadJson('./package.json')
  if (data) {
    const key = 'alias-hq'
    const oldSettings = data[key] || {}
    Object.assign(oldSettings, newSettings)
    data[key] = oldSettings
    saveJson('./package.json', data)
  }
}

module.exports = {
  getPlugins,
  getAliases,
  numAliases,
  saveSettings,
  showConfig,
}
