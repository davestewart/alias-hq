const { toArray, resolve } = require('../utils')

// @see https://github.com/rollup/plugins/tree/master/packages/alias
function callback (alias, path, { root }) {
  if (alias.endsWith('/*')) {
    alias = alias.replace(/\/\*$/, '')
    path = path.replace(/\*$/, '')
  }
  return {
    find: alias,
    replacement: resolve(root, path)
  }
}

module.exports = function (paths, options) {
  return toArray(paths, callback, options)
}
