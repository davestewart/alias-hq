const Path = require('path')
const fs = require('fs')

/**
 * Load a config file
 *
 * @param   {string}    path      The absolute path to the config file
 */
function loadConfig (path) {
  // file
  const json = require(path)

  // base url / paths
  const compilerOptions = json && json.compilerOptions
  if (compilerOptions && compilerOptions.paths) {
    config.baseUrl = (compilerOptions.baseUrl || './')
    config.paths = compilerOptions.paths || {}
    return true
  }

  // normal file
  config.paths = {}
}

/**
 * Load config
 *
 * @param   {undefined}         value     Pass no value for to determine config file automatically
 * @param   {string}            value     Pass an absolute path to load from alternate location
 * @returns {object}                      The Alias HQ instance
 */
function load (value = undefined) {
  // variables
  let path

  // string: relative or absolute path passed
  if (typeof value === 'string') {
    path = Path.resolve(value)
    if (fs.existsSync(path)) {
      loadConfig(path)
    }
    else {
      throw new Error(`No such file "${path}"`)
    }
  }

  // no value: default config file
  else if (typeof value === 'undefined') {
    // variables
    let found = false
    const files = [
      'jsconfig.json',
      'tsconfig.base.json',
      'tsconfig.json',
    ]

    // attempt to load file
    while (files.length && !found) {
      let file = files.shift()
      path = Path.resolve(config.rootUrl, file)
      if (fs.existsSync(path)) {
        found = loadConfig(path)
      }
    }

    // could not load file!
    if (!found) {
      throw new Error('No config file found')
    }
  }

  // any other value
  else {
    throw new Error('Invalid parameter "value"')
  }

  // return
  return this
}

/**
 * Convert paths config using a plugin or callback
 *
 * @param   {string}    format    The name of an available plugin
 * @param   {function}  format    A custom function
 * @param   {object}   [options]  Any options to pass to the plugin
 */
function get (format, options = {}) {
  // load defaults if not loaded
  if (!config.paths) {
    load()
  }

  // options
  options = { ...config, ...options }

  // callback
  if (typeof format === 'function') {
    return format(config.paths, options)
  }

  // plugin
  if (typeof format === 'string') {
    // check for custom plugin
    if (typeof plugins.custom[format] === 'function') {
      const plugin = plugins.custom[format]
      return plugin(config.paths, options)
    }

    // check for built-in plugin
    const path = Path.resolve(__dirname, `./plugins/${format}.js`)
    if (fs.existsSync(path)) {
      const plugin = require(path)
      return plugin(config.paths, options)
    }
    throw new Error(`No such plugin "${format}"`)
  }

  // invalid
  throw new Error(`Invalid "plugin" parameter`)
}


const config = {
  rootUrl: require('app-root-path').toString(),
  baseUrl: '',
  paths: null,
}

const plugins = {
  custom: {},

  /**
   * Add a plugin to the core setup
   *
   * @param   {string}    name        The plugin name
   * @param   {function}  callback    The plugin function
   * @returns {object}                The Alias HQ instance
   */
  add (name, callback) {
    if (!this.custom[name] && typeof callback === 'function') {
      this.custom[name] = callback
    }
    return this
  },

  /**
   * List available plugin names
   *
   * @returns {string[]}
   */
  get names () {
    const path = Path.resolve(__dirname, 'plugins')
    const items = fs.readdirSync(path).map(file => file.replace('.js', ''))
    Object.keys(this.custom).forEach(key => {
      if (!items.includes(key)) {
        items.push(key)
      }
    })
    return items.sort()
  },
}

module.exports = {
  get,
  load,
  config,
  plugins,
}
