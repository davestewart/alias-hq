const { toObject, resolve } = require('../../utils')

// @see https://webpack.js.org/configuration/resolve/#resolvealias
function callback (name, [path], config) {
  const { root, base } = config
  name = name.replace(/\/\*$/, '')
  path = path.replace(/\*$/, '')
  path = resolve(root, base, path)
  return {
    name,
    path,
  }
}

module.exports = function (config, options) {
  return toObject(callback, config, options)
}
