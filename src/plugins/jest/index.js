const { toObject, join } = require('../../utils')

// @see https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring
function callback (name, config) {
  const { baseUrl, paths } = config
  name = name
    .replace(/\*/, '(.*)')
  let path = paths.map(path => {
    path = path
      .replace(/^\//, '')
      .replace(/\*/, '$1')
    return join('<rootDir>', baseUrl, path)
  })
  if (path.length === 1) {
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
