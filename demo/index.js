const aliases = require('..')

// plugins
console.log('\n\n== [ PLUGINS ] ============================================\n')
aliases.plugins().forEach(format => {
  console.log({ format, aliases: aliases.get(format) })
})

// helpers
console.log('\n\n== [ HELPERS ] ============================================\n')
const helpers = ['root', 'paths']
helpers.forEach(helper => {
  console.log({ helper, value: aliases[helper]() })
})
