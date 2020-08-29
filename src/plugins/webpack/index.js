const { toObject, resolve } = require('../../utils')

// @see https://webpack.js.org/configuration/resolve/#resolvealias
function callback (alias, config) {
  const { rootUrl, baseUrl, paths } = config
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

module.exports = function (config, options) {
  return toObject(callback, config, options)
}
