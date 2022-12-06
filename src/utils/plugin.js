
/**
 * Convert paths and return an array
 *
 * @param   {function}  callback    The conversion function
 * @param   {object}    config      The loaded config, containing rootUrl, baseUrl and paths properties
 * @param   {*}        [options]    Optional user options
 * @returns {{name: string, path: string}[]}
 */
function toArray (callback, config, options) {
  return Object
    .keys(config.paths)
    .map(name => {
      const paths = config.paths[name]
      const urls = {
        root: config.rootUrl,
        base: config.baseUrl,
      }
      return callback(name, paths, urls, options)
    })
}

/**
 * Convert paths and return an object
 *
 * @param   {function}  callback    The conversion function
 * @param   {object}    config      The loaded config, containing rootUrl, baseUrl and paths properties
 * @param   {*}        [options]    Optional user options
 * @returns {Object.<string, string>}
 */
function toObject (callback, config, options) {
  return toArray(callback, config, options)
    .reduce((output, entry) => {
      if (!output[entry.name]) {
        output[entry.name] = entry.path
      }
      return output
    }, {})
}

module.exports = {
  toObject,
  toArray,
}
