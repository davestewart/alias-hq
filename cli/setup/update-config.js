require('colors')
const inquirer = require('inquirer')
const Path = require('path')
const Fs = require('fs')
const hq = require('../../src')
const { makeChoices } = require('../utils/inquirer')
const { saveSettings } = require('../utils/config')
const { indent, makeJson } = require('../utils/text')
const { checkPath, checkPaths } = require('./common')

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

function makePaths (folders, answers) {
  const { config } = hq
  const rootUrl = Path.resolve(config.rootUrl, answers.baseUrl)
  const paths = answers.action === 'add'
    ? config.paths
    : {}
  return folders.reduce((output, input) => {
    // path
    let path = Path.isAbsolute(input)
      ? Path.relative(rootUrl, input)
      : input

    // alias
    let alias = answers.prefix + Path.basename(path)

    // folder
    const ext = Path.extname(path)
    if (!ext) {
      path += '/*'
      alias += '/*'
    }

    // file
    else {
      alias = alias.replace(ext, '')
    }

    // assign
    output[alias] = [path]
    return output
  }, paths)
}

/**
 * @param   {boolean}  colorize
 * @returns {string}
 */
function makeConfig (colorize = false) {
  // variables
  const baseUrl = answers.baseUrl

  // paths
  let paths = answers.paths
    .filter(info => info.valid)
    .map(info => info.relPath)

  // json
  paths = makePaths(paths, answers)

  // config
  const config = {
    compilerOptions: {
      baseUrl,
      paths
    }
  }

  // json
  return makeJson(config, colorize, true)
}

// ---------------------------------------------------------------------------------------------------------------------
// actions
// ---------------------------------------------------------------------------------------------------------------------

const actions = {
  getChoice () {
    const numAliases = Object.keys(hq.config.paths).length
    if (numAliases) {
      const choices = {
        add: 'Add folders',
        replace: 'Reconfigure',
      }
      return inquirer
        .prompt({
          type: 'list',
          name: 'action',
          message: 'Operation:',
          default: previous.action,
          choices: makeChoices(choices, true),
        })
        .then(answer => {
          previous.action = answer.action
          answers.action = answer.action.match(/\w+/).toString()
        })
    }
  },

  getBaseUrl () {
    if (answers.action === 'add') {
      return
    }
    const baseUrl = Fs.existsSync(Path.resolve(hq.config.baseUrl, 'src'))
      ? './src'
      : ''
    return inquirer
      .prompt({
        type: 'input',
        name: 'baseUrl',
        message: 'Base URL:',
        default: previous.baseUrl || hq.config.baseUrl || baseUrl
      })
      .then(answer => {
        // variables
        const baseUrl = answer.baseUrl.trim() || '.'
        const info = checkPath(baseUrl)
        if (!info || !info.valid) {
          return actions.getBaseUrl()
        }

        // set answers
        previous.baseUrl = info.relPath
        answers.baseUrl = info.relPath
      })
  },

  getFolders () {
    // default folders
    let folders = previous.folders
    if (answers.action === 'replace') {
      folders = Object
        .values(hq.config.paths)
        .map(paths => {
          const path = paths[0].replace(/[\/]\*$/, '')
          return path.includes(' ')
            ? `'${path}'`
            : path
        })
        .join(' ')
    }

    // question
    return inquirer
      .prompt({
        type: 'input',
        name: 'folders',
        default: folders,
        message: `Folders [ ${'drag here / type paths'.red} ]:`,
      })
      .then((answer) => {
        // variables
        const folders = answer.folders.trim() || '.'
        const rootUrl = Path.join(hq.config.rootUrl, answers.baseUrl)
        const infos = checkPaths(folders, rootUrl)

        // if invalid paths
        if (!infos.every(info => info.valid)) {
          // set only valid folders as defaults
          previous.folders = infos
            .filter(info => info.valid)
            .map(info => {
              return info.path
            })
            .join(' ')

          // ask again
          return actions.getFolders()
        }

        // otherwise...
        previous.folders = folders
        answers.paths = infos
      })
  },

  getPrefix () {
    return inquirer
      .prompt({
        type: 'input',
        name: 'prefix',
        message: 'Alias prefix:',
        default: previous.prefix || hq.settings.prefix
      })
      .then(answer => {
        const prefix = answer.prefix.trim()
        previous.prefix = prefix
        answers.prefix = prefix
      })
  },

  showConfig () {
    const json = makeConfig(true)
    console.log()
    console.log(indent(json) + '\n')
  },

  saveSettings () {
    if (answers.prefix !== hq.settings.prefix) {
      return inquirer
        .prompt({
          type: 'confirm',
          name: 'save',
          message: 'Save updated choices?',
        })
        .then(answer => {
          if (answer.save) {
            saveSettings({
              prefix: answers.prefix
            })
          }
        })
    }
  },

  saveConfig () {
    return inquirer
      .prompt({
        type: 'confirm',
        name: 'confirm',
        message: `Update "${ Path.basename(hq.settings.configFile)}" now?`.red,
      })
      .then(answer => {
        if (!answer.confirm) {
          return
        }

        // data
        const json = makeConfig()
        try {
          return Fs.writeFileSync(hq.settings.configFile, json, 'utf8')
        } catch (err) {
          return false
        }
      })
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

function getAnswers () {
  return {
    action: '',
    baseUrl: hq.config.baseUrl,
    prefix: '',
    paths: [],
    dry: false,
  }
}

const previous = {}
let answers = {}

function updateConfig () {
  // setup
  hq.load()
  answers = getAnswers()

  // begin
  return Promise.resolve()
    .then(actions.getChoice)
    .then(actions.getBaseUrl)
    .then(actions.getFolders)
    .then(actions.getPrefix)
    .then(actions.showConfig)
    .then(actions.saveSettings)
    .then(actions.saveConfig)
}

module.exports = {
  updateConfig,
  makePaths,
  actions,
}
