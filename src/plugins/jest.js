const { toObject } = require('../utils')

// @see https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring
function callback (alias, path) {
  path = path.replace(/^\//, '')
  return {
    alias: `^${alias.replace(/\*/, '(.*)')}$`,
    path: `<rootDir>/${path.replace(/\*/, '$1')}`
  }
}

module.exports = function (paths, options) {
  return toObject(paths, callback, options)
}
