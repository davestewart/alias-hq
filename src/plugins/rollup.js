const { toArray, resolve } = require('../utils')

// @see https://github.com/rollup/plugins/tree/master/packages/alias
function callback (alias, path, { root, baseUrl }) {
  alias = alias
    .replace(/\/\*$/, '')
  path = path
    .replace(/\*$/, '')
  path = resolve(root, baseUrl, path)
  return {
    find: alias,
    replacement: path,
  }
}

module.exports = function (paths, options) {
  return toArray(paths, callback, options)
}
