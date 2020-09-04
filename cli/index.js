const inquirer = require('inquirer')
const hq = require('../src')

const { para } = require('./utils/text')
const { makeMenuHeader, makeChoices } = require('./utils/inquirer')
const { numAliases } = require('./utils/config')

const setup = require('./setup')
const debug = require('./integrations')

let previous = {}

function intro () {
  para('== Alias HQ =='.red)
}

function index () {
  // setup
  hq.load()

  // options
  const choices = {
    setup: 'Setup' + '         - update config and source code'.grey,
  }
  if (numAliases()) {
    choices.debug = 'Integrations ' + ' - configure and debug integrations'.grey
  }
  choices.exit = 'Exit'

  // questions
  console.log()
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: makeMenuHeader('Main Menu'),
      default: previous.choice,
      choices: makeChoices(choices),
    })
    .then((answer) => {
      previous.choice = answer.choice
      let result
      switch (answer.choice) {
        case choices.setup:
          return setup()

        case choices.debug:
          return debug()

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
