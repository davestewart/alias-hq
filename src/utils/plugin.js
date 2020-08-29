
/**
 * Convert paths and return an array
 *
 * @param   {function}  callback    The conversion function
 * @param   {object}    config      The loaded config, containing rootUrl, baseUrl and paths properties
 * @param   {*}        [options]    Optional user options
 * @returns {{alias: string, path: string}[]}
 */
function toArray (callback, config, options) {
  return Object
    .keys(config.paths)
    .map(key => {
      return callback(key, {
        rootUrl: config.rootUrl,
        baseUrl: config.baseUrl,
        paths: config.paths[key],
      }, options)
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
