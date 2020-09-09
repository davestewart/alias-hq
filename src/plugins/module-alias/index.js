const moduleAlias = require('module-alias')
const webpack = require('../webpack')

module.exports = function (config, options) {
  const paths = webpack(config, options)
  Object.keys(paths).forEach(key => {
    moduleAlias.addAlias(key, paths[key])
  })
  return true
}
