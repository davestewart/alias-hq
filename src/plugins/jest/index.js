const { toObject, join } = require('../../utils/plugin')

// @see https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring
function callback (alias, paths, { baseUrl }) {
  alias = alias
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
    alias: `^${alias}$`,
    path,
  }
}

module.exports = function (paths, options) {
  return toObject(paths, callback, options)
}
