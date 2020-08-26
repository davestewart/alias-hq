const { toArray, toObject, resolve, join } = require('../utils')

// @see https://github.com/rollup/plugins/tree/master/packages/alias
function callback (alias, paths, { rootUrl, baseUrl, format }) {
  alias = alias
    .replace(/\/\*$/, '')
  let path = paths[0]
    .replace(/\/\*$/, '')
  path = resolve(baseUrl, path)
  if (format === 'array') {
    return {
      find: alias,
      replacement: path,
    }
  }
  return {
    alias,
    path,
  }
}

module.exports = function (paths, options) {
  return options.format === 'array'
    ? toArray(paths, callback, options)
    : toObject(paths, callback, options)
}
