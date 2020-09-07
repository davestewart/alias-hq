require('colors')
const inquirer = require('inquirer')
const hq = require('../src')

const { para, makeHeader } = require('./utils/text')
const { makeChoices } = require('./utils/inquirer')
const { numAliases } = require('./utils/config')

const setup = require('./setup')
const debug = require('./integrations')
const { openDocs } = require('./integrations/configure')

let previous = {}

function intro () {
  para('== Alias HQ =='.red)
}

function index () {
  // setup
  hq.load()

  // options
  const choices = {
    setup: 'Setup        ' + ' - update config and source code'.grey,
    debug: 'Integrations ' + ' - configure and debug library integrations'.grey,
    help: 'Help         ' + ' - read the docs'.grey,
    exit: 'Exit',
  }

  if (!numAliases()) {
    delete choices.debug
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
        case choices.setup:
          return setup()

        case choices.debug:
          return debug()

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
process.argv.includes('setup')
  ? setup()
  : index()
