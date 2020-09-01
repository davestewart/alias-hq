const hq = require('..')


/**
 * Utility function to get the max length of a series of strings
 *
 * @param {array<string|object>}  items   An array or strings or objects
 * @param {string}               [prop]   An optional sub-property to grab
 * @returns {number}
 */
function getLongestStringLength (items, prop) {
  return Math.max(...items.map(item => (prop ? item[prop] : item).length))
}

/**
 * Convert a string of text containing folders to an array of folders
 *
 * Handles quotes, spaces, etc
 *
 * @param input
 * @returns {[]}
 */
function parsePathsFromText (input) {
  const rx = /(["'])(.+?)\1|(\S+)/g
  let match
  let folders = []
  while(match = rx.exec(input)) {
    const folder = match[1] ? match[2] : match[0]
    folders.push(folder)
  }
  return folders
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
    const tests = require(`../src/plugins/${name}/tests.js`)
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

module.exports = {
  getLongestStringLength,
  parsePathsFromText,
  getPlugins,
}
