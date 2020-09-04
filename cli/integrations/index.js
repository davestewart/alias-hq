const inquirer = require('inquirer')
const hq = require('../../src')

const { makeChoices, makeMenuHeader } = require('../utils/inquirer')
const { numAliases } = require('../utils/config')

// modules
const { showConfig } = require('../setup/show-config')
const { configureIntegration } = require('./configure')
const { debugConfiguration } = require('./debug')

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

const previous = {}

function run () {
  // setup
  hq.load()

  // variables
  const choices = {
    show: 'View config',
  }

  if (numAliases()) {
    Object.assign(choices, {
      configure: 'Configure integration',
      debug: 'Debug integration',
      back: 'Back',
    })
  } else {
    choices.make = 'Make paths JSON'
  }

  console.log()
  return inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: makeMenuHeader('Debug Menu'),
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
