/* eslint-disable key-spacing */
require('colors')
const inquirer = require('inquirer')
const hq = require('../src')

// utils
const { para, makeHeader } = require('./utils/text')
const { makeChoices } = require('./utils/prompts')
const { openDocs } = require('./services/docs')

// actions
const { configurePaths } = require('./modules/configuration')
const { setupIntegrations } = require('./modules/integrations')
const { updateSource } = require('./modules/source')

// set global flag
global.ALIAS_CLI = true

const previous = {}

function intro () {
  para('== Alias HQ =='.red)
}

function index () {
  // setup
  hq.load()

  // options
  const choices = {
    config  : 'Configure paths',
    debug   : 'Setup integrations',
    update  : 'Update source code',
    revert  : 'Revert source code (to relative paths)',
    help    : 'Help',
    exit    : 'Exit',
  }

  const numAliases = Object.keys(hq.config.paths).length

  if (numAliases === 0) {
    delete choices.debug
    delete choices.update
    delete choices.revert
  }

  // special "revert" mode shows option to rewrite project to relative paths
  if (process.argv.includes('revert')) {
    if (choices.update) {
      choices.update += ' (to aliased paths)'
    }
  }
  else {
    delete choices.revert
  }

  // questions
  makeHeader('Main Menu')
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: 'What do you want to do?',
      default: previous.choice,
      choices: makeChoices(choices),
    })
    .then((answer) => {
      previous.choice = answer.choice
      switch (answer.choice) {
        case choices.config:
          return configurePaths()

        case choices.update:
          return updateSource(true)

        case choices.revert:
          return updateSource(false)

        case choices.debug:
          return setupIntegrations()

        case choices.help:
          return openDocs()

        case choices.exit:
          return false
      }
    })
    .then(result => {
      if (result === false) {
        console.log()
        process.exit()
      }
      return index()
    })
}

intro()
index()
