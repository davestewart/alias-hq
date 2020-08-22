const { toArray, resolve } = require('../utils')

// @see https://github.com/rollup/plugins/tree/master/packages/alias
function callback (alias, path, { rootUrl, baseUrl }) {
  alias = alias
    .replace(/\/\*$/, '')
  path = path
    .replace(/\*$/, '')
  path = resolve(rootUrl, baseUrl, path)
  return {
    find: alias,
    replacement: path,
  }
}

module.exports = function (paths, options) {
  return toArray(paths, callback, options)
}
