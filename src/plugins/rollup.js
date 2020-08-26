const { toArray, toObject, resolve, join } = require('../utils')

// @see https://github.com/rollup/plugins/tree/master/packages/alias
function callback (alias, paths, { rootUrl, baseUrl, format }) {
  alias = alias
    .replace(/\/\*$/, '')
  let path = paths[0]
    .replace(/\/\*$/, '')
  path = resolve(baseUrl, path)
  if (format === 'object') {
    return {
      alias,
      path,
    }
  }
  return {
    find: alias,
    replacement: path,
  }
}

module.exports = function (paths, options) {
  return options.format === 'object'
    ? toObject(paths, callback, options)
    : toArray(paths, callback, options)
}
