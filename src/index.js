const Path = require('path')
const fs = require('fs')

/**
 * Load config
 *
 * @param   {undefined} value     Pass no value for to determine config file automatically
 * @param   {string}    value     Pass an absolute path to load from alternate location
 * @param   {object}    value     Pass config directly
 */
function load (value = undefined) {
  // variables
  let path
  let json

  // object: config passed directly
  if (value && typeof value === 'object') {
    json = value
  }

  // string: relative or absolute path passed
  else if (typeof value === 'string') {
    path = Path.resolve(value)
    try {
      json = require(path)
    }
    catch (error) {
      throw error
    }
  }

  // no value: default config file
  else if (typeof value === 'undefined') {
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

  // any other value
  else {
    throw new Error('Invalid parameter "value"')
  }

  // variables
  root = path
    ? Path.dirname(path)
    : __dirname
  paths = json && json['compilerOptions']
      ? json['compilerOptions'].paths
      : json || {}

  // check object has keys
  if (Object.keys(json).length === 0) {
    throw new Error('The loaded paths appear to be empty')
  }

  // return
  return this
}

/**
 * Convert paths config using a plugin or callback
 *
 * @param   {string}    plugin    The name of an available plugin
 * @param   {function}  plugin    A custom function
 * @param   {object}   [options]  Any options to pass to the plugin
 */

function as (plugin, options = {}) {
  // load defaults if not loaded
  if (!paths) {
    load()
  }

  // options
  options = { root, ...options }

  // callback
  if (typeof plugin === 'function') {
    return plugin(paths, options)
  }

  // plugin
  if (typeof plugin === 'string') {
    const path = Path.resolve(__dirname, `./plugins/${plugin}.js`)
    if (fs.existsSync(path)) {
      plugin = require(path)
      return plugin(paths, options)
    }
    throw new Error(`No such plugin "${plugin}"`)
  }

  // invalid
  throw new Error(`Invalid "plugin" parameter`)
}

let paths
let root

module.exports = {
  load,
  paths: () => paths,
  root: () => root,
  to: as,
  as,
}
