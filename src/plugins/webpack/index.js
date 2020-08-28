const { toObject, resolve } = require('../../utils')

// @see https://webpack.js.org/configuration/resolve/#resolvealias
function callback (alias, paths, { rootUrl, baseUrl }) {
  alias = alias
    .replace(/\/\*$/, '')
  let path = paths[0]
    .replace(/\*$/, '')
  path = resolve(rootUrl, baseUrl, path)
  return {
    alias,
    path,
  }
}

module.exports = function (paths, options) {
  return toObject(paths, callback, options)
}
