const { toObject, join } = require('../../utils')

const defaults = {
  format: 'string'
}

// @see https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring
function callback (name, config, options) {
  options = { ...defaults, ...options }
  const { baseUrl, paths } = config
  name = name
    .replace(/\*/, '(.*)')
  let path = paths.map(path => {
    path = path
      .replace(/^\//, '')
      .replace(/\*/, '$1')
    return join('<rootDir>', baseUrl, path)
  })
  if (options.format === 'string' || path.length === 1) {
    path = path[0]
  }
  return {
    name: `^${name}$`,
    path,
  }
}

module.exports = function (config, options) {
  return toObject(callback, config, options)
}
