const { toObject } = require('../../utils')

const defaults = {
  format: 'string'
}

// https://github.com/tleunen/babel-plugin-module-resolver/blob/HEAD/DOCS.md#alias
function callback (alias, paths, config, options) {
  // for babel to use a regex, the alias must start with a ^
  const prefix = alias.includes('*') ? '^' : ''
  const name = prefix + alias.replace('*', '(.*)')
  let path = paths.map(path => {
    return path.replace('*', '\\1')
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
