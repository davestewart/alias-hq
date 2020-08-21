const aliases = require('..')

// plugins
console.log('\n\n== [ PLUGINS ] ============================================\n')
aliases.plugins.names.forEach(format => {
  console.log({ format, aliases: aliases.get(format) })
})

// helpers
console.log('\n\n== [ CONFIG ] ============================================\n')
console.log(aliases.config)
