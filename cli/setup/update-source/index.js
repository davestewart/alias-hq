require('colors')
const Path = require('path')
const assert = require('assert').strict
const inquirer = require('inquirer')
const runner = require('jscodeshift/src/Runner')
const hq = require('../../../src')
const { inspect } = require('../../utils')
const { getLongestStringLength } = require('../../utils/text')
const { getAliases, numAliases, saveSettings } = require('../../utils/config')
const { cleanPathsInfo } = require('../../utils/paths')
const { makeBullet, para } = require('../../utils/text')
const { makeChoices } = require('../../utils/inquirer')
const { showConfig, checkPaths, makeItemsBullets, makePathsBullets } = require('../common')

// ---------------------------------------------------------------------------------------------------------------------
// actions
// ---------------------------------------------------------------------------------------------------------------------

const actions = {
  getPaths () {
    // defaults
    let folders = hq.config.baseUrl
    if (hq.settings.folders.length) {
      folders = hq.settings.folders.map(folder => {
        return folder.includes(' ')
          ? `'${folder}'`
          : folder
      }).join(' ')
    }

    // question
    return inquirer
      .prompt({
        type: 'input',
        name: 'folders',
        message: 'Folders:',
        default: folders
      })
      .then(answer => {
        // variables
        const folders = answer.folders
        const { infos, valid, input } = checkPaths(folders)

        // check paths
        if (!valid) {
          return actions.getPaths()
        }

        // continue
        answers.paths = cleanPathsInfo(infos)
      })
  },

  getModules () {
    // choices
    const aliases = getAliases()
    const maxLength = getLongestStringLength(aliases.keys)
    const choices = aliases.keys
      .map(key => {
        const item = aliases.get(key)
        const { alias, relPath } = item
        const label = alias + ' '.repeat(maxLength - alias.length)
        const name = label + '  ' + `- ${relPath}`.grey
        return {
          name,
          short: alias,
          value: alias,
        }
      })

    const defaults = hq.settings.modules

    // question
    return inquirer
      .prompt({
        type: 'checkbox',
        name: 'modules',
        message: `Module roots:`,
        choices: choices,
        default: defaults,
        pageSize: 20,
      })
      .then(answer => {
        answers.modules = answer.modules
          .map(answer => answer.match(/\S+/).toString())
          .map(alias => aliases.get(alias))
      })
  },

  confirmChoices () {
    function log (title, answers) {
      if (!Array.isArray(answers)) {
        answers = [answers]
      }
      answers = answers
        .map(answer => answer.cyan)
        .map(answer => makeBullet(answer))
      console.log(`  ${title}:\n${answers.join('\n')}`)
    }

    console.log('')
    // console.log(`  Paths:\n` + makeItemsBullets(answers.paths, 'folder', 'relPath'))
    console.log(`  Paths:\n` + makePathsBullets(answers.paths))
    if (answers.modules.length) {
      console.log(`  Module roots:\n` + makeItemsBullets(answers.modules, 'alias', 'relPath'))
    }
    console.log()
  },

  saveSettings () {
    const oldSettings = {
      folders: hq.settings.folders,
      modules: hq.settings.modules,
    }
    const newSettings = {
      folders: answers.paths.map(path => path.relPath),
      modules: answers.modules.map(alias => alias.alias),
    }
    // inspect({ oldSettings, newSettings })

    try {
      assert.deepEqual(oldSettings, newSettings)
    } catch (err) {
      return inquirer
        .prompt({
          type: 'confirm',
          name: 'save',
          message: 'Save updated choices?',
        })
        .then(answer => {
          if (answer.save) {
            saveSettings(newSettings)
          }
        })
    }
  },

  process () {
    const choices = {
      config: 'Show config',
      restart: 'Change settings',
      preview: 'Preview updates',
      proceed: 'Update files ' + '- no further confirmation!'.red,
      back: 'Back',
    }
    return inquirer
      .prompt({
        type: 'list',
        name: 'action',
        message: `Next step:`,
        choices: makeChoices(choices),
        default: choices.preview,
      })
      .then(answer => {
        const action = answer.action
        if (action === choices.back) {
          return
        }

        if (action === choices.config) {
          showConfig()
          return actions.process()
        }

        if (action === choices.restart) {
          return updateSource()
        }

        // aliases
        const aliases = getAliases()

        // paths
        const paths = answers.paths
          .filter(config => config.valid)
          .map(config => config.absPath)

        // modules
        const modules = answers.modules
          .map(module => module.alias)

        // extensions
        const defaultExtensions = Path.basename(hq.settings.configFile).startsWith('ts')
          ? 'ts js tsx jsx'
          : 'js jsx'
        const extensions = (hq.settings.extensions || defaultExtensions)
          .match(/\w+/g)
          .join(',')

        // options
        const options = {
          silent: true,
          verbose: 0,
          runInBand: true,
          extensions,
          dry: action === choices.preview,
        }

        // debug
        // inspect({ paths, modules, extensions })
        // inspect({ options, paths, aliases })

        // do it
        if (aliases.keys.length) {
          console.log()
          const file = __dirname + '/transformer.js'
          return runner
            .run(file, paths, { ...options, aliases, modules })
            .then(results => {
              console.log()

              // results
              console.log(`Results: in ${results.timeElapsed} seconds\n`)
              console.log('  › ' + `updated    : ${results.ok}`.cyan)
              console.log('  › ' + `unmodified : ${results.nochange}`.blue)
              console.log('  › ' + `skipped    : ${results.skip}`.grey)
              console.log('  › ' + `errors     : ${results.error}`.red)
              console.log()

              // run again
              return actions.process()
            })
        }
      })
  },
}

// ---------------------------------------------------------------------------------------------------------------------
// setup
// ---------------------------------------------------------------------------------------------------------------------

/**
 * @returns {Answers}
 */
function getAnswers () {
  /**
   * @typedef   {object}      Answers
   * @property  {PathInfo[]}  paths
   * @property  {string[]}    modules
   */
  return {
    paths: [],
    modules: [],
  }
}

/**
 * @type {Answers}
 */
let answers

// main function
function updateSource () {
  // setup
  hq.load()
  answers = getAnswers()

  // check
  if (!numAliases()) {
    para('No aliases configured: skipping source code update!'.red)
    return
  }

  // actions
  return Promise.resolve()
    .then(actions.getPaths)
    .then(actions.getModules)
    .then(actions.confirmChoices)
    .then(actions.saveSettings)
    .then(actions.process)
}

module.exports = {
  updateSource,
  getAliases,
}
