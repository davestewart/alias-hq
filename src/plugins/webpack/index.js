const { toObject, resolve } = require('../../utils')

const defaults = {
  format: 'string'
}

// @see https://webpack.js.org/configuration/resolve/#resolvealias
function callback (name, paths, config, options) {
  const { root, base } = config
  name = name.replace(/\/\*$/, '')
  let path = paths.map(path => {
    path = path.replace(/\*$/, '')
    return resolve(root, base, path)
  })
  if (options.format === 'string' || path.length === 1) {
    path = path[0]
  }
  return {
    name,
    path,
  }
}

module.exports = function (config, options) {
  options = { ...defaults, ...options }
  return toObject(callback, config, options)
}
