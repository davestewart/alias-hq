const { toArray, resolve, join } = require('../../src/utils')

// used in cli fix code
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
  return toArray(callback, config, options)
    .sort(function (a, b) {
      if (a.path === b.path) {
        return 0
      }
      return a.path > b.path ? -1 : 1
    })
}
