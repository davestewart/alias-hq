const { toObject, join } = require('../utils')

// @see https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring
function callback (alias, path, { baseUrl }) {
  alias = alias
    .replace(/\*/, '(.*)')
  path = path
    .replace(/^\//, '')
    .replace(/\*/, '$1')
  path = join('<rootDir>', baseUrl, path)
  return {
    alias: `^${alias}$`,
    path,
  }
}

module.exports = function (paths, options) {
  return toObject(paths, callback, options)
}
