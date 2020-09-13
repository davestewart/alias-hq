const fetch = require('node-fetch')

const docsUrl = 'https://github.com/davestewart/alias-hq/blob/master/docs/'

const urls = {
  raw: 'https://raw.githubusercontent.com/davestewart/alias-hq/master/docs/integrations.md',
  markdowm: docsUrl + 'integrations.md',
}

function getIntegrations () {
  return fetch(urls.raw).then(res => res.text())
}

function openIntegration (hash = '') {
  require('open')(urls.markdowm + '#' + hash)
}

function openDocs () {
  require('open')(docsUrl + 'cli/cli.md')
}

module.exports = {
  getIntegrations,
  openIntegration,
  openDocs,
}
