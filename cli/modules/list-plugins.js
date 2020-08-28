const hq = require('../../src')
const { getPlugins } = require('../utils')

function run () {
  const plugins = getPlugins()
  Object.keys(plugins).forEach(plugin => {
    Object.keys(plugins[plugin]).forEach(format => {
      const options = plugins[plugin][format]
      console.log({ plugin, options, aliases: hq.get(plugin, options) })
    })
  })
}

module.exports = {
  run
}
