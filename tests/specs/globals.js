const Path = require('path')

const rootUrl = Path.resolve(__dirname, '../../')
const config = {
  ts: require('../../tsconfig.json').compilerOptions.paths,
  js: require('../../jsconfig.json').compilerOptions.paths,
  custom: {
    'foo/*': 'bar/*'
  }
}
config.default = config.js

module.exports = {
  rootUrl,
  config,
}
