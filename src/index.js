const Path = require('path')
const fs = require('fs')

/**
 * Load config
 *
 * @param   {undefined} value     Pass no value for to determine config file automatically
 * @param   {string}    value     Pass an absolute path to load from alternate location
 * @param   {object}    value     Pass config directly
 * @returns {object}              The Alias HQ instance
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
    path = Path.resolve('./jsconfig.json')
    /* istanbul ignore else */
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

  // grab config
  const compilerOptions = json && json.compilerOptions
  if (compilerOptions) {
    config.baseUrl = (compilerOptions.baseUrl || '').replace(/^\.\//, '')
    config.paths = compilerOptions.paths || {}
  }
  else {
    config.paths = json || {}
  }
  config.root = path
    ? Path.dirname(path)
    : __dirname

  // check for paths
  if (Object.keys(config.paths).length === 0) {
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
function get (plugin, options = {}) {
  // load defaults if not loaded
  if (!config.paths) {
    load()
  }

  // options
  options = { ...config, ...options }

  // callback
  if (typeof plugin === 'function') {
    return plugin(config.paths, options)
  }

  // plugin
  if (typeof plugin === 'string') {
    // check for custom plugin
    if (typeof plugins.custom[plugin] === 'function') {
      return plugins.custom[plugin](config.paths, options)
    }

    // check for built-in plugin
    const path = Path.resolve(__dirname, `./plugins/${plugin}.js`)
    if (fs.existsSync(path)) {
      plugin = require(path)
      return plugin(config.paths, options)
    }
    throw new Error(`No such plugin "${plugin}"`)
  }

  // invalid
  throw new Error(`Invalid "plugin" parameter`)
}


const config = {
  root: '',
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
