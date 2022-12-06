const { toArray, toObject, resolve } = require('../../utils')

const defaults = {
  format: 'object'
}

// @see https://github.com/rollup/plugins/tree/master/packages/alias
function callback (name, [path], config, options) {
  const { root, base } = config
  name = name.replace(/\/\*$/, '')
  path = path.replace(/\/\*$/, '')
  path = resolve(root, base, path)
  if (options.format === 'object') {
    return {
      name,
      path,
    }
  }
  return {
    find: name,
    replacement: path,
  }
}

module.exports = function (config, options) {
  options = { ...defaults, ...options }
  return options.format === 'object'
    ? toObject(callback, config, options)
    : toArray(callback, config, options)
}
