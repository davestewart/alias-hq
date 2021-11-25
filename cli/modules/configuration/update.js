require('colors')
const inquirer = require('inquirer')
const Path = require('path')
const Fs = require('fs')
const hq = require('../../../src')
const { checkPath, checkPaths } = require('../../services/paths')
const { saveSettings } = require('../../services/config')
const { loadJson, saveJson } = require('../../utils/file')
const { indent, makeJson } = require('../../utils/text')
const { makeChoices } = require('../../utils/prompts')
// const { inspect } = require('../../utils')

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
    const absPath = Path.resolve(rootUrl, input)
    let relPath = Path.relative(rootUrl, absPath)

    // name
    const prefix = answers.prefix
    let name = Path.basename(absPath)
    if (rootUrl === absPath && prefix === '@') {
      name = ''
    }
    name = prefix + name

    // folder
    const ext = Path.extname(absPath)
    if (!ext) {
      relPath += '/*'
      name += '/*'
    }

    // file
    else {
      name = name.replace(ext, '')
    }

    // assign
    output[name] = [relPath]
    return output
  }, paths)
}

/**
 * Make the config to be saved to disk
 *
 * @param   {Answers}       answers
 * @returns {object}
 */
function getConfigData (answers) {
  // variables
  const baseUrl = answers.baseUrl

  // folders
  const folders = answers.paths
    .filter(info => info.valid)
    .map(info => info.relPath)

  // paths
  const paths = makePaths(folders, hq.config, answers)

  // config
  return {
    baseUrl,
    paths
  }
}

/**
 * Make the config to be shown in the terminal
 *
 * @param   {Answers}       answers
 * @param   {JsonFormat}   [options]
 * @returns {string}
 */
function makeConfig (answers, options = undefined) {
  const config = {
    compilerOptions: {
      ...getConfigData(answers)
    }
  }
  return makeJson(config, options)
}

// ---------------------------------------------------------------------------------------------------------------------
// actions
// ---------------------------------------------------------------------------------------------------------------------

const actions = {
  getChoice () {
    const numAliases = Object.keys(hq.config.paths).length
    if (numAliases) {
      const choices = {
        add: 'Add paths',
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
        const { info, valid } = checkPath(baseUrl)
        if (!valid) {
          return actions.getBaseUrl()
        }

        // set answers
        previous.baseUrl = info.relPath
        answers.baseUrl = info.relPath
      })
  },

  getPaths () {
    // default folders
    let paths = previous.paths
    if (!paths && answers.action === 'replace') {
      paths = Object
        .values(hq.config.paths)
        .map(paths => {
          const path = paths[0].replace(/[/]\*$/, '')
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
        name: 'paths',
        default: paths,
        message: `Paths [ ${'type folders / drag from filesystem'.red} ]:`,
      })
      .then((answer) => {
        // variables
        const paths = answer.paths.trim()
        if (paths === '') {
          return actions.getPaths()
        }

        // TODO
        // trim leading slash
        // find way to prevent newline from stopping paste of multiple lines
        // check input return is working

        // variables
        const rootUrl = Path.join(hq.config.rootUrl, answers.baseUrl)
        const { infos, valid, input } = checkPaths(paths, rootUrl)

        // if invalid paths
        if (!valid) {
          previous.paths = input
          return actions.getPaths()
        }

        // otherwise...
        previous.paths = paths
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

        // validation
        if (/^[./\\]+/.test(prefix)) {
          return actions.getPrefix()
        }

        // assign
        previous.prefix = prefix
        answers.prefix = prefix
      })
  },

  showConfig () {
    let json

    // add - format only added paths in cyan
    if (answers.action === 'add') {
      // options
      const options = { color: 'grey' }

      // get complete json in grey
      json = makeConfig(answers, options)

      // get strings of partial json in grey
      const parts = makeConfig({ ...answers, action: '' }, options)
        .split(/\n/).slice(4).join('\n')
        .match(/".+?"/g)
        .reverse()

      // get start and end formatting codes for grey
      const [fStart, fEnd] = '|'.grey.split('|')

      // loop over and replace / reformat
      parts.forEach(part => {
        const replacement = part
          .replace(fStart, '')
          .replace(fEnd, '')
          .replace(/"([^"]+)"/, function (match, part) {
            return `"${part.cyan}"`
          })
        json = json.replace(part, replacement)
      })
    }

    // new / replace - format whole json in cyan
    else {
      json = makeConfig(answers)
    }

    // log
    console.log()
    console.log(indent(json))
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
    const configFile = hq.settings.configFile
    return inquirer
      .prompt({
        type: 'confirm',
        name: 'confirm',
        message: `Update "${Path.basename(configFile)}" now?`.red,
      })
      .then(answer => {
        if (answer.confirm) {
          const data = getConfigData(answers)
          const config = loadJson(configFile)
          if (config) {
            Object.assign(config.compilerOptions, data)
            saveJson(configFile, config, true)
          }
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
    .then(actions.getPaths)
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
