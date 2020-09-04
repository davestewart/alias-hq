require('colors')
const inquirer = require('inquirer')
const Path = require('path')
const Fs = require('fs')
const hq = require('../../src')
const { getPathInfo } = require('../utils/paths')
const { makeBullet } = require('../utils/text')
const { loadJson } = require('../utils/config')
const { makeChoices } = require('../utils/inquirer')

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

  getBaseUrl () {
    const baseUrl = Fs.existsSync('./src')
      ? './src'
      : ''
    return inquirer
      .prompt({
        type: 'input',
        name: 'baseUrl',
        message: 'Base URL:',
        default: previous.baseUrl || baseUrl
      })
      .then(answer => {
        previous.baseUrl = answer.baseUrl
        answers.baseUrl = answer.baseUrl
      })
  },

  showConfig () {
    // helper
    function makeFileBullet (config, state) {
      const { path, absPath } = config
      const label = path.cyan
      const info = `- ${absPath}`.gray.italic
      return makeBullet(`${label} ${info}`, state)
    }

    // helper
    const fileInfo = getPathInfo(answers.file, hq.config.rootUrl)
    const srcInfo = getPathInfo(answers.baseUrl, hq.config.rootUrl)

    // path
    answers.path = fileInfo.absPath

    // json
    const json = answers.json = {
      compilerOptions: {
        baseUrl: './src',
        paths: {}
      }
    }
    const text = JSON
      .stringify(json, null, '  ')
      .replace(/^/gm, '    ')

    // output
    console.log('')
    console.log(`  File:\n` + makeFileBullet(fileInfo, !fileInfo.exists))
    console.log(`  Base Url:\n` + makeFileBullet(srcInfo, srcInfo.valid))
    console.log(`  JSON:`)
    console.log(text.cyan)
    console.log()
  },

  makeFile () {
    return inquirer
      .prompt({
        type: 'confirm',
        name: 'confirm',
        message: `Write file now?`,
      })
      .then((answer) => {
        if (!answer.confirm) {
          return
        }

        // data
        const data = JSON.stringify(answers.json, null, '  ')

        // write
        try {
          return Fs.writeFileSync(answers.path, data, 'utf8')
        } catch (err) {
          return err.message
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
  baseUrl: '',
  json: '',
}

function createConfig () {
  return Promise.resolve()
    .then(actions.getChoices)
    .then(actions.getBaseUrl)
    .then(actions.showConfig)
    .then(actions.makeFile)
}

module.exports = {
  createConfig,
}
