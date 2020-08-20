const aliases = require('..')
const fixtures = require('../tests/fixtures')

// plugins
console.log('\n\n== [ PLUGINS ] ============================================\n')
Object.keys(fixtures.plugins).forEach(format => {
  console.log({ format, aliases: aliases.as(format) })
})

// helpers
console.log('\n\n== [ HELPERS ] ============================================\n')
const helpers = ['root', 'paths']
helpers.forEach(helper => {
  console.log({ helper, value: aliases[helper]() })
})
