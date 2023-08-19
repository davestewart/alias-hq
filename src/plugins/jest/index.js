const { toObject, join } = require('../../utils')

const defaults = {
  format: 'string'
}

// @see https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring
function callback (name, paths, config, options) {
  const { base } = config
  name = name.replace('*', '(.*)')
  let path = paths.map(path => {
    path = path.replace('*', '$1')
    return `<rootDir>/${join(base, path)}`
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
  options = { ...defaults, ...options }
  return toObject(callback, config, options)
}
