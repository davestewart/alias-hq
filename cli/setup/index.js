require('colors')
const inquirer = require('inquirer')
const hq = require('../../src')
const { makeHeader, para, indent, makeBullet } = require('../utils/text')
const { makeChoices } = require('../utils/inquirer')

// modules
const { showConfig } = require('./common')
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
  const hasConfig = !!hq.settings.configFile
  const numAliases = Object.keys(hq.config.paths).length

  // choices
  let choices = {
    create: 'Create config',
    view: 'View config',
    configure: `Update config`,
    update: 'Update source code',
    revert: 'Revert source code (to relative paths)',
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

  // special "revert" mode shows option to rewrite project to relative paths
  if (process.argv.includes('revert')) {
    choices.update += ' (to aliased paths)'
  }
  else {
    delete choices.revert
  }

  if (numAliases === 0) {
    delete choices.update
  }

  // start
  makeHeader('Setup Menu')
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

        case choices.create:
          result = createConfig()
          break

        case choices.view:
          result = showConfig()
          break

        case choices.configure:
          result = updateConfig()
          break

        case choices.update:
          result = updateSource()
          break

        case choices.revert:
          result = updateSource(false)
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
