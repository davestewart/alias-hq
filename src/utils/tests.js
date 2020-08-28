const Path = require('path')

const rootUrl = Path.resolve(__dirname, '../../')

function rel (path) {
  return `./src/${path}`
}

function abs (path) {
  return `${rootUrl}/src/${path}`
}

module.exports = {
  rootUrl,
  rel,
  abs,
}
