const Path = require('path')

function convert (entry, callback, options) {
  const alias = entry[0]
  const path = Array.isArray(entry[1])
    ? entry[1][0]
    : entry[1]
  return callback(alias, path, options)
}

/**
 * Convert paths and return an hash
 *
 * @param   {object}    paths       The tsconfig.json paths node
 * @param   {function}  callback    The conversion function
 * @param   {path}      options     Optional options path
 * @returns {Object.<string, string>}
 */
function toObject (paths, callback, options) {
  return Object
    .entries(paths)
    .map(entry => convert(entry, callback, options))
    .reduce((output, entry) => {
      if (!output[entry.alias]) {
        output[entry.alias] = entry.path
      }
      return output
    }, {})
}

/**
 * Convert paths and return an array
 *
 * @param   {object}    paths       The tsconfig.json paths node
 * @param   {function}  callback    The conversion function
 * @param   {path}      options     Optional options path
 * @returns {{alias: string, path: string}[]}
 */
function toArray (paths, callback, options) {
  return Object
    .entries(paths)
    .map(entry => convert(entry, callback, options))
}

module.exports = {
  resolve: Path.resolve,
  toObject,
  toArray,
}
