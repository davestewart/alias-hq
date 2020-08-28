
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
    .keys(paths)
    .map(alias => callback(alias, paths[alias], options))
}

/**
 * Convert paths and return an object
 *
 * @param   {object}    paths       The tsconfig.json paths node
 * @param   {function}  callback    The conversion function
 * @param   {path}      options     Optional options path
 * @returns {Object.<string, string>}
 */
function toObject (paths, callback, options) {
  return toArray(paths, callback, options)
    .reduce((output, entry) => {
      if (!output[entry.alias]) {
        output[entry.alias] = entry.path
      }
      return output
    }, {})
}

module.exports = {
  toObject,
  toArray,
}
