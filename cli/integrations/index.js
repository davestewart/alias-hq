const inquirer = require('inquirer')
const hq = require('../../src')

const { makeHeader } = require('../utils/text')
const { makeChoices } = require('../utils/inquirer')
const { numAliases } = require('../utils/config')

// modules
const { showConfig } = require('../setup/common')
const { configureIntegration } = require('./configure')
const { debugConfiguration } = require('./debug')

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

const previous = {}

function run () {
  // setup
  hq.load()

  // choices
  const choices = {
    show: 'View config',
    configure: 'Configure integration',
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
      previous.choice = answer.choice
      let result
      switch (answer.choice) {
        case choices.show:
          result = showConfig()
          break

        case choices.configure:
          result = configureIntegration()
          break

        case choices.debug:
          result = debugConfiguration()
          break

        case choices.back:
          return
      }

      // run again...
      return Promise
        .resolve(result)
        .then(run)
    })
}

module.exports = function () {
  return run()
}
