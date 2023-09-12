const Fs = require('fs')
const Path = require('path')
const JSON5 = require('json5')
const { parseTsconfig } = require('get-tsconfig')
const { resolve } = require('./utils')

// ---------------------------------------------------------------------------------------------------------------------
// typedefs
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The jsconfig.json hash of paths
 *
 * @typedef {Object.<string, string[]>} PathsHash
 */

/**
 * The Hash of string:function plugins
 *
 * @typedef {Object.<string,function>} PluginHash
 */

/**
 * The Alias HQ user settings; loaded and saved from package.json
 *
 * @typedef   {Object}      HQSettings
 * @property  {string}      root
 * @property  {string}      configFile
 * @property  {string}      extensions
 * @property  {string}      prefix
 * @property  {string[]}    folders
 * @property  {string[]}    modules
 */

/**
 * The core Alias HQ config; passed to plugins
 *
 * @typedef   {Object}      HQConfig
 * @property  {string}      rootUrl   The absolute path to the config file folder
 * @property  {string}      baseUrl   The relative path to the JSConfig base folder
 * @property  {PathsHash}   paths     The loaded aliases
 */

/**
 * The Alias HQ plugins object; used to store and load all transforms
 *
 * @typedef   {Object}      HQPlugins
 * @property  {string[]}    names     The list of loaded plugin names
 * @property  {function}    add       Method to add new plugins
 * @property  {PluginHash} custom    The hash of plugins
 */

// ---------------------------------------------------------------------------------------------------------------------
// factories
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Make a fresh Settings object
 *
 * @returns {HQSettings}
 */
function makeSettings () {
  return {
    root: '',
    configFile: '',
    extensions: '',
    prefix: '@',
    folders: [],
    modules: []
  }
}

/**
 * Make a fresh Config object
 *
 * @returns {HQConfig}
 */
function makeConfig () {
  const root = settings.root || ''
  return {
    rootUrl: resolve(root),
    baseUrl: '',
    paths: {},
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// loaders
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Load JSON file and handle errors in a helpful manner
 *
 * @param   {string}  path
 * @return  {object}  The loaded JSON
 * @throws            An error if the JSON could not be parsed
 */
function loadJson (path) {
  const text = Fs.readFileSync(path, 'utf8')
  if (text) {
    try {
      return JSON5.parse(text)
    }
    catch (err) {
      require('colors')
      const file = Path.basename(path)
      const message = (
        '\n  Error! ' + err.message.replace('JSON', `"${file}"`) +
        '\n\n  Edit the file to fix this, then try again' +
        '\n').red

      // CLI
      if (global.ALIAS_CLI) {
        console.warn(message)
        process.exit(0)
      }

      // API
      console.warn(`\n  [Alias HQ]\n${message}\n`.red)
      throw (err)
    }
  }
}

/**
 * Load user settings from package.json
 */
function loadSettings () {
  const json = loadJson('package.json')
  const data = json['alias-hq']
  if (data) {
    if (data.root) {
      config.rootUrl = Path.resolve(data.root)
    }
    Object.assign(settings, makeSettings(), data)
    return true
  }
}

/**
 * Load js/tsconfig.json file
 *
 * @param   {string}    path      The absolute path to the config file
 */
function loadConfig (path) {
  const { compilerOptions: { baseUrl = '', paths = {} } } = parseTsconfig(path)
  settings.configFile = path
  config.rootUrl = Path.dirname(path)
  config.baseUrl = baseUrl
  config.paths = paths
}

// ---------------------------------------------------------------------------------------------------------------------
// api
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Load config
 *
 * @param   {string}           [value]    Pass no value for to determine config file automatically
 * @param   {string}            value     Pass an absolute path to load from alternate location
 * @returns {object}                      The Alias HQ instance
 */
function load (value = undefined) {
  // load settings
  loadSettings()

  // string: relative or absolute path passed
  if (typeof value === 'string') {
    const path = Path.resolve(value)
    if (Fs.existsSync(path)) {
      loadConfig(path)
    }
    else {
      throw new Error(`[Alias HQ] No such file "${path}"`)
    }
  }

  // no value: default or configured config file
  else if (value === undefined) {
    // variables
    let found = false
    const files = [
      'jsconfig.json',
      'tsconfig.json',
    ]

    // attempt to load file
    while (files.length && !found) {
      const file = files.shift()
      // config.rootUrl will be an absolute folder path if loaded from package.json
      const path = Path.resolve(config.rootUrl, file)
      if (Fs.existsSync(path)) {
        loadConfig(path)
        found = true
      }
    }

    // could not load file!
    if (!found) {
      Object.assign(config, makeConfig())
    }
  }

  // any other value
  else {
    throw new Error('[Alias HQ] Invalid parameter "value"')
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
  if (!settings.configFile) {
    load()
  }

  // callback
  if (typeof plugin === 'function') {
    return plugin(config, options)
  }

  // plugin
  if (typeof plugin === 'string') {
    // check for custom plugin
    if (typeof plugins.custom[plugin] === 'function') {
      const callback = plugins.custom[plugin]
      return callback(config, options)
    }

    // check for built-in plugin
    const path = Path.resolve(__dirname, `./plugins/${plugin}/index.js`)
    if (Fs.existsSync(path)) {
      const callback = require(path)
      return callback(config, options)
    }
    throw new Error(`[Alias HQ] No such plugin "${plugin}"`)
  }

  // invalid
  throw new Error('[Alias HQ] Invalid "plugin" parameter')
}

// ---------------------------------------------------------------------------------------------------------------------
// members
// ---------------------------------------------------------------------------------------------------------------------

/**
 * @type {HQSettings}
 */
const settings = makeSettings()

/**
 * @type {HQConfig}
 */
const config = makeConfig()

/**
 *
 * @type {HQPlugins}
 */
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
    const items = Fs.readdirSync(path)
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
  settings,
}
