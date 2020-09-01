const Path = require('path')
const colors = require('colors')
const { inspect } = require('../../../../src/utils')
const { getPath } = require('../utils/paths')

module.exports = function (fileInfo, api, options) {
  // variables
  const { path, source } = fileInfo
  const j = api.jscodeshift
  const root = j(source)

  // debug
  function log (from, to) {
    if (!to) {
      to = `${from} (no change)`.gray
    }
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
      const newPath = getPath(path, oldPath, options)
      log(oldPath, newPath)
      if (newPath) {
        p.value.arguments[0].value = newPath
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
      let text = `> ${path}\n\n`
      text += updates.map(update => {
        const { from, to } = update
        return [` › ${from}`, ` › ${(to || '').cyan}`].join('\n') + '\n'
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
