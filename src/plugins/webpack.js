const { toObject, resolve } = require('../utils')

// @see https://webpack.js.org/configuration/resolve/#resolvealias
function callback (alias, path, { root }) {
  if (alias.endsWith('/*')) {
    alias = alias.replace(/\/\*$/, '')
    path = path.replace(/\*$/, '')
  }
  return {
    alias,
    path: resolve(root, path),
  }
}

module.exports = function (paths, options) {
  return toObject(paths, callback, options)
}
