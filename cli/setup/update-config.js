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

/**
 * Generate JSConfig format paths
 *
 * @param   {string[]}    folders
 * @param   {HQConfig}    config
 * @param   {Answers}     answers
 * @returns {PathsHash}
 */
function makePaths (folders, config, answers) {
  const rootUrl = Path.resolve(config.rootUrl, answers.baseUrl)
  const paths = answers.action === 'add'
    ? config.paths
    : {}
  return folders.reduce((output, input) => {
    // path
    let absPath = Path.resolve(rootUrl, input)
    let relPath = Path.relative(rootUrl, absPath)

    // alias
    let alias = answers.prefix + Path.basename(absPath)

    // folder
    const ext = Path.extname(absPath)
    if (!ext) {
      relPath += '/*'
      alias += '/*'
    }

    // file
    else {
      alias = alias.replace(ext, '')
    }

    // assign
    output[alias] = [relPath]
    return output
  }, paths)
}

/**
 * Make the config to be saved to disk or shown in the terminal
 *
 * @param   {Answers}    answers
 * @param   {boolean}   colorize
 * @returns {string}
 */
function makeConfig (answers, colorize = false) {
  // variables
  const baseUrl = answers.baseUrl

  // paths
  let paths = answers.paths
    .filter(info => info.valid)
    .map(info => info.relPath)

  // json
  paths = makePaths(paths, hq.config, answers)

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
        const { info, input, valid } = checkPath(baseUrl)
        if (!valid) {
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
        const { infos, valid, input } = checkPaths(folders, rootUrl)

        // if invalid paths
        if (!valid) {
          previous.folders = input
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
    const json = makeConfig(answers, true)
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
        const json = makeConfig(answers)
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

/**
 * @typedef {{baseUrl: string, prefix: string, paths: [], action: string, dry: boolean}} Answers
 * @property  {string}      action
 * @property  {string}      baseUrl
 * @property  {string}      prefix
 * @property  {PathInfo[]}  paths
 * @property  {boolean}     dry
 */
/**
 * @returns {Answers}
 */
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

/**
 * @type {Answers}
 */
let answers

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
