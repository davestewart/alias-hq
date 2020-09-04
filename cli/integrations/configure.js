const inquirer = require('inquirer')
const fetch = require('node-fetch')

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

const urls = {
  raw: 'https://raw.githubusercontent.com/davestewart/alias-hq/master/docs/integrations.md',
  markdowm: 'https://github.com/davestewart/alias-hq/blob/master/docs/integrations.md',
}

function openUrl (hash = '') {
  require('opn')(urls.markdowm + '#' + hash)
}

// ---------------------------------------------------------------------------------------------------------------------
// actions
// ---------------------------------------------------------------------------------------------------------------------

const actions = {
  getNames () {
    return fetch(urls.raw)
      .then(res => res.text())
      .then(text => {
        const matches = text.match(/\n## (.+)\n/g)
        if (matches) {
          answers.names = matches
            .map(text => text.replace(/\n/g, '').substr(3))
        }
      })
  },

  getChoices: () => {
    // no integrations
    if (answers.names.length === 0) {
      return openUrl ()
    }

    // choices
    const choices = answers.names.map(name => {
      return {
        name: '- ' + name,
        value: name,
        short: name,
      }
    })

    // prompt
    return inquirer
      .prompt({
        type: 'list',
        name: 'name',
        pageSize: 100,
        message: 'Integration:',
        default: previous.name,
        choices,
      })
      .then(answer => {
        previous.name = answer.name
        const hash = answer.name
          .toLowerCase()
          .replace(/\W+/g, '-')
        return openUrl(hash)
      })
  },
}

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

const previous = {}
const answers = {
  names: [],
}

function configureIntegration () {
  return Promise.resolve()
    .then(actions.getNames)
    .then(actions.getChoices)
}

module.exports = {
  configureIntegration
}
