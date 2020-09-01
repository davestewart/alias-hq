const { resolve } = require('./paths')

const rootUrl = resolve(__dirname, '../../')

function rel (path = '') {
  return `./demo/src/${path}`.replace(/\/$/, '')
}

function abs (path = '') {
  return resolve(rootUrl, 'demo/src/', path)
}

module.exports = {
  rootUrl,
  rel,
  abs,
}
