const Path = require('path')
const fs = require('fs')

/**
 * Convert to Webpack format
 *
 * @param   {string}  alias   The alias name
 * @param   {string}  path    The relative alias path
 * @param   {string}  root    The absolute root path
 * @returns {{alias: string, path: string}}
 */
function toWebpack (alias, path, root) {
  if (alias.endsWith('/*')) {
    alias = alias.replace(/\/\*$/, '')
    path = path.replace(/\*$/, '')
  }
  return {
    alias,
    path: Path.resolve(root, path),
  }
}

/**
 * Convert to Jest format
 *
 * @param   {string}  alias   The alias name
 * @param   {string}  path    The relative alias path
 * @returns {{alias: string, path: string}}
 */
function toJest (alias, path) {
  path = path.replace(/^\//, '')
  return {
    alias: `^${alias.replace(/\*/, '(.*)')}$`,
    path: `<rootDir>/${path.replace(/\*/, '$1')}`
  }
}

/**
 * Convert config using mapping function
 *
 * @param   {object}    paths   The tsconfig.json paths node
 * @param   {function}  mapper  The conversion / mapping function
 * @param   {path}      root    Optional root path
 * @returns {T}
 */
function convert (paths, mapper, root) {
  return Object
    .entries(paths)
    .map(entry => {
      const alias = entry[0];
      const path = Array.isArray(entry[1])
        ? entry[1][0]
        : entry[1]
      return mapper(alias, path, root)
    })
    .reduce((output, entry) => {
      if (!output[entry.alias]) {
        output[entry.alias] = entry.path
      }
      return output
    }, {})
}

/**
 * Load config and convert
 *
 * @param   {undefined} value   Pass no value for to determine tsconfig.json automatically
 * @param   {string}    value   Pass an absolute path to load from alternate location
 * @param   {object}    value   Pass tsconfig directly
 * @param   {function}  mapper  The mapping function to convert each alias
 * @returns {T}                 Converted aliases as a key => path hash
 */
function load (value, mapper) {
  // variables
  let paths
  let root
  let path
  let json

  // object: config passed directly
  if (value && typeof value === 'object') {
    json = value
  }

  // string: relative or absolute path passed
  else if (typeof value === 'string') {
    path = Path.resolve(value)
    json = require(path)
  }

  // no value: default config file
  else {
    path = Path.resolve('./aliases.config.json')
    if (fs.existsSync(path)) {
      json = require(path)
    }
    else {
      path = Path.resolve('./tsconfig.json')
      if (fs.existsSync(path)) {
        json = require(path)
      }
    }
  }

  // variables
  root = path
    ? Path.dirname(path)
    : __dirname
  paths = json && json.compilerOptions
      ? json.compilerOptions.paths
      : json || {}

  // convert
  return convert(paths, mapper, root)
}

module.exports = {
  toWebpack: value => load(value, toWebpack),
  toJest: value => load(value, toJest),
}
