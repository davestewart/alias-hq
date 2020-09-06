require('colors')
const { toAlias, toRelative } = require('./paths')
const stats = require('./stats')

module.exports = function (fileInfo, api, options) {
  // variables
  const { path, source } = fileInfo
  const j = api.jscodeshift
  const root = j(source)
  const to = options.mode === 'relative'
    ? toRelative
    : toAlias

  // find
  const requires = root.find(j.CallExpression, { callee: { name: 'require' } })
  const imports = root.find(j.ImportDeclaration)

  // update
  if (requires.length || imports.length) {
    // requires
    requires.forEach(p => {
      const oldPath = p.value.arguments[0].value
      if (oldPath) {
        const newPath = to(path, oldPath, options)
        stats.log(oldPath, newPath)
        if (newPath) {
          p.value.arguments[0].value = newPath
        }
      }
    })

    // imports
    imports.forEach(p => {
      const oldPath = p.value.source.value
      const newPath = to(path, oldPath, options)
      stats.log(oldPath, newPath)
      if (newPath) {
        p.value.source.value = newPath
      }
    })

    // output
    const updated = stats.dump(path)
    if (updated) {
      // TODO
      const quote = 'single'
      return root.toSource({ quote })
    }
  }
}
