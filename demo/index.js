const aliases = require('..')
const fixtures = require('../tests/fixtures')

Object.keys(fixtures.plugins).forEach(format => {
  console.log({ format, aliases: aliases.as(format) })
})
