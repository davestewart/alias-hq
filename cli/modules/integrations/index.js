const inquirer = require('inquirer')
const hq = require('../../../src')

const { makeHeader } = require('../../utils/text')
const { makeChoices } = require('../../utils/prompts')
const { showConfig, numAliases } = require('../../services/config')

// modules
const { setupIntegration } = require('./setup')
const { debugConfiguration } = require('./debug')

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

const previous = {}

function setupIntegrations () {
  // setup
  hq.load()

  // choices
  const choices = {
    show: 'View config',
    setup: 'Setup integration',
    debug: 'Debug integration',
    back: 'Back'
  }
  if (!numAliases()) {
    delete choices.configure
    delete choices.debug
  }

  makeHeader('Integrations Menu')
  return inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: 'What do you want to do?',
      default: previous.choice,
      choices: makeChoices(choices),
    })
    .then((answer) => {
      const choice = answer.choice
      if (choice !== choices.back) {
        previous.choice = answer.choice
      }

      switch (answer.choice) {
        case choices.show:
          return showConfig()

        case choices.setup:
          return setupIntegration()

        case choices.debug:
          return debugConfiguration()

        case choices.back:
          return 'back'
      }
    })
    .then(result => {
      return result === 'back'
        ? null
        : setupIntegrations()
    })
}

module.exports = {
  setupIntegrations
}
