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
      if (a.absPath === b.absPath) {
        return 0
      }
      return a.absPath > b.absPath ? -1 : 1
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
