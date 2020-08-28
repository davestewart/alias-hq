const hq = require('../../src')

function run () {
  hq.load()
  console.log(hq.config)
}

module.exports = {
  run
}
