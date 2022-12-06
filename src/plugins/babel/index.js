const { toObject } = require('../../utils')

// https://github.com/tleunen/babel-plugin-module-resolver/blob/HEAD/DOCS.md#alias
function callback (alias, paths) {
  const prefix = alias.endsWith('*') ? '^' : ''
  const name = prefix + alias.replace('*', '(.*)')
  const path = paths[0].replace('/*', '/\\1')
  return {
    name,
    path,
  }
}

module.exports = function (config, options) {
  return toObject(callback, config, options)
}
