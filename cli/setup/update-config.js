const inquirer = require('inquirer')
const Path = require('path')
const Fs = require('fs')
const hq = require('../../src')
const { getPathInfo, getPathsInfo } = require('../utils/paths')
const { makeChoices } = require('../utils/inquirer')
const { indent, plural, makeBullet, makeJson, getLongestStringLength } = require('../utils/text')

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

function makePaths (folders, settings) {
  const rootUrl = Path.resolve(settings.rootUrl, settings.baseUrl)
  const paths = settings.type === 'all'
    ? settings.paths
    : {}
  return folders.reduce((output, input) => {
    // path
    let path = Path.isAbsolute(input)
      ? Path.relative(rootUrl, input)
      : input

    // alias
    let alias = settings.prefix + Path.basename(path)

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
  const { baseUrl } = settings
  let paths = answers.paths
    .filter(info => info.valid)
    .map(info => info.relPath)
  paths = makePaths(paths, settings)

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

function getBullet (label, info, valid = undefined, width = 0) {
  const padding = ' '.repeat(Math.max(width - label.length, 0))
  const labelText = label.cyan
  const infoText = `- ${info}`.gray.italic
  return makeBullet(`${labelText} ${padding} ${infoText}`, valid)
}

function getPaths (paths) {
  const width = getLongestStringLength(paths, 'path')
  return paths
    .map(config => getBullet(config.path, config.absPath, config.valid, width))
    .join('\n')
}

function getAliases (paths) {
  const width = getLongestStringLength(paths, 'folder') + 1
  return paths
    .filter(config => config.valid)
    .map(config => {
      const label = settings.prefix + config.folder
      return getBullet(label, config.relPath, undefined, width)})
    .join('\n')
}


// ---------------------------------------------------------------------------------------------------------------------
// actions
// ---------------------------------------------------------------------------------------------------------------------

const actions = {
  getChoice () {
    if (settings.numAliases) {
      const choices = {
        append: 'Add aliases',
        replace: 'Replace aliases',
      }
      return inquirer
        .prompt({
          type: 'list',
          name: 'type',
          message: 'Operation:',
          default: previous.type,
          choices: makeChoices(choices),
        })
        .then(answer => {
          previous.type = answer.type
          answers.type = answer.type.match(/\w+/).toString()
        })
    }
  },

  getBaseUrl () {
    return inquirer
      .prompt({
        type: 'input',
        name: 'baseUrl',
        message: 'Base URL:',
        default: previous.baseUrl || settings.baseUrl
      })
      .then(answer => {
        previous.baseUrl = answer.baseUrl
        answers.baseUrl = answer.baseUrl
      })
  },

  getFolders () {
    return inquirer
      .prompt({
        type: 'input',
        name: 'folders',
        default: previous.folders,
        message: `Folders [${'drag here, or type paths'.yellow}]:`,
      })
      .then((answer) => {
        previous.folders = answer.folders
        const rootUrl = Path.resolve(Path.join(hq.config.rootUrl, answers.baseUrl))
        answers.paths = getPathsInfo(answer.folders, rootUrl, false)

        console.log()
        console.log(getPaths(answers.paths))
        console.log()

      })
  },

  getPrefix () {
    return inquirer
      .prompt({
        type: 'input',
        name: 'prefix',
        message: 'Alias prefix:',
        default: previous.prefix || settings.prefix
      })
      .then(answer => {
        previous.prefix = answer.prefix
        settings.prefix = answer.prefix
      })
  },

  confirmChoices () {
    const json = makeConfig(true)
    console.log()
    console.log(indent(json) + '\n')

    return inquirer
      .prompt({
        type: 'confirm',
        name: 'confirm',
        message: 'Update config now?'.red,
      })
  },

  process (answer) {
    if (!answer.confirm) {
      return
    }

    // TODO decide upon answers and settings
    // then merge at end

    // data
    const json = makeConfig()
    const path = Path.resolve(hq.config.rootUrl, hq.settings.config)
    try {
      return Fs.writeFileSync(path, json, 'utf8')
    } catch (err) {
      return false
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

function getAnswers () {
  return {
    type: '',
    baseUrl: '',
    prefix: '',
    paths: [],
    dry: false,
  }
}

function getSettings () {
  const settings = {
    ...hq.config,
    ...hq.settings
  }
  settings.numAliases = Object.keys(settings.paths).length
  return settings
}

const previous = {}
let answers = {}
let settings = {}

function updateConfig () {
  // setup
  answers = getAnswers()
  settings = getSettings()

  // begin
  return Promise.resolve()
    .then(actions.getChoice)
    .then(actions.getBaseUrl)
    .then(actions.getFolders)
    .then(actions.getPrefix)
    .then(actions.confirmChoices)
    .then(actions.process)
}

module.exports = {
  updateConfig,
  makePaths,
}
