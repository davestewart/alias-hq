const { toObject } = require('../../utils')

// https://github.com/tleunen/babel-plugin-module-resolver/blob/HEAD/DOCS.md#alias
function callback (alias, paths) {
  // for babel to use a regex, the alias must start with a ^
  const prefix = alias.includes('*') ? '^' : ''
  const name = prefix + alias.replace('*', '(.*)')
  const path = paths[0].replace('*', '\\1')
  return {
    name,
    path,
  }
}

module.exports = function (config, options) {
  return toObject(callback, config, options)
}
