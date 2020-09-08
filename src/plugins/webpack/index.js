const { toObject, resolve } = require('../../utils')

// @see https://webpack.js.org/configuration/resolve/#resolvealias
function callback (name, config) {
  const { rootUrl, baseUrl, paths } = config
  name = name
    .replace(/\/\*$/, '')
  let path = paths[0]
    .replace(/\*$/, '')
  path = resolve(rootUrl, baseUrl, path)
  return {
    name,
    path,
  }
}

module.exports = function (config, options) {
  return toObject(callback, config, options)
}
