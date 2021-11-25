require('colors')
const inquirer = require('inquirer')
const Path = require('path')
const Fs = require('fs')
const hq = require('../../../src')
const { getPathInfo } = require('../../services/paths')
const { makeJson, makeFileBullet, indent } = require('../../utils/text')
const { makeChoices } = require('../../utils/prompts')

// ---------------------------------------------------------------------------------------------------------------------
// actions
// ---------------------------------------------------------------------------------------------------------------------

const actions = {
  getChoices: () => {
    // choices
    const choices = {
      'jsconfig.json': 'JavaScript',
      'tsconfig.json': 'TypeScript',
    }

    // prompt
    return inquirer
      .prompt({
        type: 'list',
        name: 'file',
        message: 'Language:',
        default: previous.file,
        choices: makeChoices(choices, true),
      })
      .then(answer => {
        previous.file = answer.file
        answers.file = answer.file
      })
  },

  showConfig () {
    const fileInfo = getPathInfo(hq.config.rootUrl, answers.file)

    // path
    answers.path = fileInfo.absPath

    // json
    const json = answers.json = {
      compilerOptions: {
        baseUrl: '',
        paths: {}
      }
    }

    // output
    console.log('')
    console.log('  File:\n' + makeFileBullet(fileInfo, !fileInfo.exists))
    console.log('  JSON:\n' + indent(makeJson(json)))
    console.log()
  },

  saveConfig () {
    return inquirer
      .prompt({
        type: 'confirm',
        name: 'confirm',
        message: `Save "${Path.basename(answers.file)}" now?`.red,
      })
      .then((answer) => {
        if (!answer.confirm) {
          return
        }

        // data
        const data = makeJson(answers.json, false)

        // write
        try {
          return Fs.writeFileSync(answers.path, data, 'utf8')
        }
        catch (err) {
          console.warn(err.message)
        }
      })
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

const previous = {}
const answers = {
  file: '',
  path: '',
  json: '',
}

function createConfig () {
  hq.load()
  return Promise.resolve()
    .then(actions.getChoices)
    .then(actions.showConfig)
    .then(actions.saveConfig)
}

module.exports = {
  createConfig,
}
