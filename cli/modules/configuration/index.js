require('colors')
const inquirer = require('inquirer')
const hq = require('../../../src')
const { makeHeader } = require('../../utils/text')
const { makeChoices } = require('../../utils/prompts')

// modules
const { showConfig } = require('../../services/config')
const { createConfig } = require('./create')
const { updateConfig } = require('./update')

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

const previous = {}

function configurePaths () {
  hq.load()

  // variables
  const hasConfig = !!hq.settings.configFile

  // choices
  let choices = {
    create: 'Create config',
    view: 'View config',
    update: 'Update config',
    back: 'Back',
  }

  if (hasConfig) {
    delete choices.create
  }
  else {
    choices = {
      create: choices.create
    }
  }

  // start
  makeHeader('Paths Menu')
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

      switch (choice) {
        case choices.create:
          return createConfig()

        case choices.view:
          return showConfig()

        case choices.update:
          return updateConfig()

        case choices.back:
          return 'back'
      }
    })
    .then(result => {
      return result === 'back'
        ? null
        : configurePaths()
    })
}

module.exports = {
  configurePaths
}
