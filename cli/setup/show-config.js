const hq = require('../../src')
const { indent, makeJson } = require('../utils/text')

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

function showConfig () {
  console.log()
  console.log(indent(makeJson(hq.config, true, true)) + '\n')
}

function run () {
  showConfig()
}

module.exports = {
  showConfig,
  run,
}
