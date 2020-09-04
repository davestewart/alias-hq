require('colors')
const inquirer = require('inquirer')
const hq = require('../../src')
const { bullets, para, indent, makeBullet } = require('../utils/text')
const { makeChoices, makeMenuHeader } = require('../utils/inquirer')

// modules
const { showConfig } = require('./show-config')
const { createConfig } = require('./create-config')
const { updateConfig } = require('./update-config')
const { updateSource } = require('./update-source')

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

function intro () {
  hq.load()
  const para2 = text => para(text, 60, 4)
  // para2('Updates will be made to files as you submit your answers, so you should check updates to source code as you go along.')
  // para2('Make sure everything is committed before continuing!'.red)
}

const previous = {}

function run () {
  hq.load()

  // variables
  const hasConfig = !!hq.settings.config
  const numAliases = Object.keys(hq.config.paths).length

  // choices
  let choices = {
    create: 'Create config',
    view: 'View config',
    configure: `Update config`,
    source: 'Update source code',
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

  if (numAliases === 0) {
    delete choices.source
  }

  // start
  console.log()
  return inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: makeMenuHeader('Setup Menu'),
      default: previous.choice,
      choices: makeChoices(choices),
    })
    .then((answer) => {
      previous.choice = answer.choice
      let result
      switch (answer.choice) {

        case choices.create:
          result = createConfig()
          break

        case choices.view:
          result = showConfig()
          break

        case choices.configure:
          result = updateConfig()
          break

        case choices.source:
          result = updateSource()
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
  intro()
  previous.choice = undefined
  return run()
}
