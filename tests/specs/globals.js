const Path = require('path')

const root = Path.resolve(__dirname, '../../')
const config = {
  ts: require('../../tsconfig.json'),
  js: require('../../aliases.config.json'),
  custom: {
    'foo/*': 'bar/*'
  }
}

module.exports = {
  root,
  config,
}
