require('colors')
const { getPath } = require('./utils')

module.exports = function (fileInfo, api, options) {
  // variables
  const { path, source } = fileInfo
  const j = api.jscodeshift
  const root = j(source)

  // debug
  function log (from, to) {
    updates.push({ from, to })
  }

  // data
  const updates = []

  // find
  const requires = root.find(j.CallExpression, { callee: { name: 'require' } })
  const imports = root.find(j.ImportDeclaration)

  if (requires.length || imports.length) {

    // requires
    requires.forEach(p => {
      const oldPath = p.value.arguments[0].value
      if (oldPath) {
        const newPath = getPath(path, oldPath, options)
        log(oldPath, newPath)
        if (newPath) {
          p.value.arguments[0].value = newPath
        }
      }
    })

    // imports
    imports.forEach(p => {
      const oldPath = p.value.source.value
      const newPath = getPath(path, oldPath, options)
      log(oldPath, newPath)
      if (newPath) {
        p.value.source.value = newPath
      }
    })

    // debug
    if (updates.length) {
      // NOTE for some reason, logs seem to be asynchronous
      //      so we need to buffer the output before logging
      let text = `\n${path.grey}\n\n`
      text += updates.map(update => {
        const { from, to } = update
        if (!to) {
          return `  › ` + `${from} ${'(no change)'.grey}` + '\n'
        }
        return [`  › ${from}`, `  › ${(to || '').cyan}`].join('\n') + '\n'
      }).join('\n')
      console.log(text)
    }
  }

  // debug
  // console.log(root.toSource())

  if (updates) {
    return root.toSource()
  }
}
