const Path = require('path')

function getPaths (name) {
  return require(`${rootUrl}/${name}.json`).compilerOptions.paths
}

const rootUrl = Path.resolve(__dirname, '../demo/')

const config = {
  js: getPaths('jsconfig'),
  ts: getPaths('tsconfig.base'),
}
config.default = config.js

module.exports = {
  rootUrl,
  config,
}
