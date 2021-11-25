require('colors')
const adapt = require('vue-jscodeshift-adapter')
const { TransformMode, toAlias, toRelative } = require('./paths')
const stats = require('./stats')

function transform (fileInfo, api, options) {
  // variables
  const { path, source } = fileInfo
  const j = api.jscodeshift
  const root = j(source)

  // options
  const to = options.mode === TransformMode.RELATIVE
    ? toRelative
    : toAlias

  // quote style
  let quote
  const setQuote = value => {
    if (typeof quote === 'undefined' && value) {
      quote = value.startsWith('"')
        ? 'double'
        : 'single'
    }
  }

  // find
  const requires = root.find(j.CallExpression, { callee: { name: 'require' } })
  const imports = root.find(j.ImportDeclaration)

  // update
  if (requires.length || imports.length) {
    // requires
    requires.forEach(p => {
      const argument = p.value.arguments[0]
      const oldPath = argument.value
      if (oldPath) {
        const newPath = to(path, oldPath, options)
        stats.log(oldPath, newPath)
        setQuote(argument.raw)
        if (newPath) {
          argument.value = newPath
        }
      }
    })

    // imports
    imports.forEach(p => {
      const source = p.value.source
      const oldPath = source.value
      const newPath = to(path, oldPath, options)
      stats.log(oldPath, newPath)
      setQuote(source.raw || (source.extra && source.extra.raw))
      if (newPath) {
        source.value = newPath
      }
    })

    // output
    const updated = stats.dump(path)
    if (updated) {
      return root.toSource({ quote: quote || 'single' })
    }
  }
}

module.exports = adapt(transform)
