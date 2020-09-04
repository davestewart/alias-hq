const inquirer = require('inquirer')
const Path = require('path')
const Fs = require('fs')
const hq = require('../../src')
const { getPathInfo } = require('../utils/paths')
const { makeBullet } = require('../utils/text')
const { loadJson } = require('../utils/config')
const { inspect } = require('../utils/inquirer')

// ---------------------------------------------------------------------------------------------------------------------
// actions
// ---------------------------------------------------------------------------------------------------------------------

const actions = {
  getChoices: () => {
    // choices
    const choices = [
      { name: '- JavaScript', value: 'jsconfig.json' },
      { name: '- TypeScript', value: 'tsconfig.json' },
    ]

    // prompt
    return inquirer
      .prompt({
        type: 'list',
        name: 'file',
        message: 'Language:',
        default: previous.file,
        choices,
      })
      .then(answer => {
        previous.file = choices.find(choice => choice.value === answer.file).name
        settings.file = answer.file
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
        settings.baseUrl = answer.baseUrl
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
    const fileInfo = getPathInfo(settings.file, hq.config.rootUrl)
    const srcInfo = getPathInfo(settings.baseUrl, hq.config.rootUrl)

    // path
    settings.path = fileInfo.absPath

    // json
    const json = settings.json = {
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
        const data = JSON.stringify(settings.json, null, '  ')

        // write
        try {
          return Fs.writeFileSync(settings.path, data, 'utf8')
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
const settings = {
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
