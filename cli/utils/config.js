const Path = require ('path')
const Fs = require ('fs')
const hq = require('../../src')
const { compactJson } = require('./text')

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
  const keys = Object.keys(aliases)

  // lookup
  const lookup = keys
    .map(alias => {
      const absPath = String(aliases[alias])
      const relPath = Path.relative(rootUrl, absPath)

      /**
       * @typedef   {object}  Alias
       * @property  {string}  alias
       * @property  {string}  absPath
       * @property  {string}  relPath
       */
      return {
        alias,
        absPath,
        relPath,
      }
    })
    .sort(function (a, b) {
      if (a.absPath === b.absPath) {
        return 0
      }
      return a.absPath > b.absPath ? -1 : 1
    })

  /**
   * @typedef   {object}    Aliases
   * @property  {string[]}  keys
   * @property  {Alias[]}   lookup
   * @property  {(function(string): Alias)}   get
   */
  return {
    keys,
    lookup,
    get: key => lookup.find(item => item.alias === key)
  }
}

function numAliases (load = false) {
  if (load) {
    hq.load()
  }
  return Object.keys(hq.config.paths).length
}

function loadJson (filename, asText = false) {
  const path = Path.resolve(filename)
  try {
    const text = Fs.readFileSync(path, 'utf8')
    return asText
      ? text
      : JSON.parse(text)
  }
  catch (err) {
    console.warn(`Could not load "${filename}"`)
    return asText ? '' : null
  }
}

function saveJson (filename, data, compact = false) {
  // path
  const path = Path.resolve(filename)

  // get spacing
  const text = loadJson(filename, true) || ''
  const match = text.match(/^(\s+)"\w/)
  const spacing = match ? match[1] : '  '

  // get text
  let json = JSON.stringify(data, null, spacing)

  // compact arrays
  if (compact) {
    json = compactJson(json)
  }

  // save
  return saveText(path, json)
}

function saveText (path, text) {
  try {
    return Fs.writeFileSync(path, text, 'utf8')
  }
  catch (err) {
    console.warn(`Could not save "${Path.basename(text)}"`, err)
    return null
  }
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
  loadJson,
  saveJson,
}
